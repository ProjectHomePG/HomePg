# HomePg - Complete Audit & Solutions Guide

## Executive Summary
This document provides a complete analysis of issues found in your HomePg project and provides actionable solutions for:
1. **Database Issues** - Data not persisting, search functionality broken
2. **Backend Problems** - API configuration and data retrieval issues
3. **Frontend Issues** - Theme/styling inconsistencies and search integration
4. **Deployment Status** - Current deployment configuration review

---

## 🔴 CRITICAL ISSUES FOUND

### 1. DATABASE NOT PROPERLY DEPLOYED / PERSISTENT
**Status:** ⚠️ CRITICAL

#### Issue Details:
- Using **H2 File-based Database** (not production-grade)
- Database file path in `docker-compose.yml` (line 15) points to `/app/data` but volume mount is from `./backend/data`
- **H2 doesn't handle concurrent connections well** in Docker
- No database initialization script
- Data may not persist between container restarts

#### Symptoms:
- "Find PGs" returns empty even though data exists
- Search results appear/disappear randomly
- Data loss after container restart

#### Solution:

**Option A: Switch to PostgreSQL (RECOMMENDED for Production)**

1. Update `backend/pom.xml`:
```xml
<!-- Replace H2 dependency with PostgreSQL -->
<!-- Remove H2 dependency lines 45-50 -->

<!-- Add PostgreSQL dependency -->
<dependency>
    <groupId>org.postgresql</groupId>
    <artifactId>postgresql</artifactId>
    <version>42.7.1</version>
    <scope>runtime</scope>
</dependency>
```

2. Update `docker-compose.yml`:
```yaml
version: '3.8'

services:
  postgres:
    image: postgres:15-alpine
    container_name: livio-postgres
    environment:
      POSTGRES_DB: livio_db
      POSTGRES_USER: livio_user
      POSTGRES_PASSWORD: livio_secure_password_2024
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U livio_user"]
      interval: 10s
      timeout: 5s
      retries: 5
    restart: unless-stopped

  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    container_name: livio-backend
    ports:
      - "8083:8083"
    environment:
      - SPRING_DATASOURCE_URL=jdbc:postgresql://postgres:5432/livio_db
      - SPRING_DATASOURCE_USERNAME=livio_user
      - SPRING_DATASOURCE_PASSWORD=livio_secure_password_2024
      - SPRING_DATASOURCE_DRIVER_CLASS_NAME=org.postgresql.Driver
      - SPRING_JPA_HIBERNATE_DDL_AUTO=update
      - SPRING_JPA_DATABASE_PLATFORM=org.hibernate.dialect.PostgreSQLDialect
    depends_on:
      postgres:
        condition: service_healthy
    restart: unless-stopped

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    container_name: livio-frontend
    ports:
      - "8082:8082"
    environment:
      - NEXT_PUBLIC_API_URL=http://localhost:8083/api
    depends_on:
      - backend
    restart: unless-stopped

volumes:
  postgres_data:
```

3. Update `backend/src/main/resources/application.properties`:
```properties
# Server Config
server.port=8083

# PostgreSQL Database Config
spring.datasource.url=jdbc:postgresql://localhost:5432/livio_db
spring.datasource.username=livio_user
spring.datasource.password=livio_secure_password_2024
spring.datasource.driver-class-name=org.postgresql.Driver

# JPA / Hibernate Config
spring.jpa.database-platform=org.hibernate.dialect.PostgreSQLDialect
spring.jpa.open-in-view=false
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=false
spring.jpa.properties.hibernate.format_sql=false
spring.jpa.properties.hibernate.jdbc.batch_size=20
spring.jpa.properties.hibernate.order_inserts=true
spring.jpa.properties.hibernate.order_updates=true

# Spring Security / Security config
app.jwt.secret=PlaceholderSecretKeyMustBeAtLeast256BitsLongForHS256SigningKey
app.jwt.expiration-ms=86400000

# File Upload Config
spring.servlet.multipart.max-file-size=50MB
spring.servlet.multipart.max-request-size=50MB

# Logging config
logging.level.org.springframework.web=INFO
logging.level.org.springframework.security=WARN
logging.level.com.livio=INFO
```

---

### 2. SEARCH NOT WORKING - Backend Issues
**Status:** 🔴 CRITICAL

#### Issue Details:
- `SearchController.java` receives search parameters but doesn't validate them properly
- Price parameters can be "undefined" or "null" strings from frontend
- Case sensitivity issues in database queries

#### Root Cause:
The `SearchController` on line 32 calls `searchService.search()` but the parameters aren't being trimmed/validated before calling repository.

#### Solution - Update `backend/src/main/java/com/livio/controller/SearchController.java`:

```java
package com.livio.controller;

import com.livio.entity.PG;
import com.livio.service.SearchService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/search")
@CrossOrigin(origins = "*")
public class SearchController {

    @Autowired
    private SearchService searchService;

    @GetMapping
    public ResponseEntity<?> search(
            @RequestParam(required = false) String query,
            @RequestParam(required = false) String city,
            @RequestParam(required = false) String gender,
            @RequestParam(required = false) String sharing,
            @RequestParam(required = false) String minPrice,
            @RequestParam(required = false) String maxPrice,
            @RequestParam(required = false) String amenity) {

        try {
            // Validate and clean all parameters
            String cleanQuery = cleanStringParam(query);
            String cleanCity = cleanStringParam(city);
            String cleanGender = cleanStringParam(gender);
            String cleanSharing = cleanStringParam(sharing);
            String cleanAmenity = cleanStringParam(amenity);

            Double parsedMinPrice = parsePrice(minPrice);
            Double parsedMaxPrice = parsePrice(maxPrice);

            // Validate price logic
            if (parsedMinPrice != null && parsedMaxPrice != null && parsedMinPrice > parsedMaxPrice) {
                Map<String, String> error = new HashMap<>();
                error.put("error", "Minimum price cannot be greater than maximum price");
                return ResponseEntity.badRequest().body(error);
            }

            List<PG> results = searchService.search(
                    cleanQuery, 
                    cleanCity, 
                    cleanGender, 
                    cleanSharing, 
                    parsedMinPrice, 
                    parsedMaxPrice, 
                    cleanAmenity
            );
            
            return ResponseEntity.ok(results);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Search failed: " + e.getMessage());
            return ResponseEntity.internalServerError().body(error);
        }
    }

    /**
     * Clean string parameters - remove whitespace, handle null/undefined
     */
    private String cleanStringParam(String param) {
        if (param == null || param.trim().isEmpty() || 
            param.equalsIgnoreCase("null") || 
            param.equalsIgnoreCase("undefined") ||
            param.equalsIgnoreCase("ALL")) {
            return null;
        }
        return param.trim();
    }

    /**
     * Parse price with error handling
     */
    private Double parsePrice(String priceStr) {
        if (priceStr == null || priceStr.trim().isEmpty() || 
            priceStr.equalsIgnoreCase("undefined") || 
            priceStr.equalsIgnoreCase("null") ||
            priceStr.equalsIgnoreCase("0")) {
            return null;
        }
        try {
            Double price = Double.parseDouble(priceStr.trim());
            if (price < 0) return null;
            return price;
        } catch (NumberFormatException e) {
            return null;
        }
    }
}
```

---

### 3. FRONTEND SEARCH NOT SENDING PROPER REQUEST
**Status:** 🔴 CRITICAL

#### Issue Details:
Frontend search is not properly calling the backend API. The `FiltersSidebar.js` doesn't send requests to backend.

#### Solution - Create/Update `frontend/src/components/Search/SearchPage.js`:

```javascript
"use client";

import React, { useEffect, useState, useCallback } from 'react';
import { Search, MapPin } from 'lucide-react';
import pgService from '@/services/pgService';
import FiltersSidebar from './FiltersSidebar';
import PGGrid from './PGGrid';
import LoadingSkeleton from '../Shared/LoadingSkeleton';

export default function SearchPage() {
  const [filters, setFilters] = useState({
    query: '',
    city: 'ALL',
    gender: 'ALL',
    sharing: 'ALL',
    minPrice: '',
    maxPrice: '',
    amenity: 'ALL'
  });

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchPerformed, setSearchPerformed] = useState(false);

  // Debounced search function
  const performSearch = useCallback(async (searchFilters) => {
    setLoading(true);
    setError(null);
    try {
      const data = await pgService.search(
        searchFilters.query || '',
        searchFilters.city === 'ALL' ? '' : searchFilters.city,
        searchFilters.gender === 'ALL' ? '' : searchFilters.gender,
        searchFilters.sharing === 'ALL' ? '' : searchFilters.sharing,
        searchFilters.minPrice || '',
        searchFilters.maxPrice || '',
        searchFilters.amenity === 'ALL' ? '' : searchFilters.amenity
      );
      setResults(data || []);
      setSearchPerformed(true);
    } catch (err) {
      console.error('Search error:', err);
      setError('Failed to fetch results. Please try again.');
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial load - fetch all PGs
  useEffect(() => {
    performSearch(filters);
  }, []);

  // Handle filter changes
  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    performSearch(newFilters);
  };

  const handleReset = () => {
    const defaultFilters = {
      query: '',
      city: 'ALL',
      gender: 'ALL',
      sharing: 'ALL',
      minPrice: '',
      maxPrice: '',
      amenity: 'ALL'
    };
    setFilters(defaultFilters);
    performSearch(defaultFilters);
  };

  const handleQueryChange = (e) => {
    const newFilters = { ...filters, query: e.target.value };
    setFilters(newFilters);
  };

  const handleQuerySubmit = (e) => {
    if (e.key === 'Enter' || e.type === 'click') {
      performSearch(filters);
    }
  };

  return (
    <div className="space-y-8">
      {/* Search Header */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-3xl p-8 lg:p-12 text-white">
        <h1 className="text-2xl lg:text-4xl font-bold mb-4">Find Your Perfect PG</h1>
        
        {/* Search Bar */}
        <div className="flex gap-2 bg-white rounded-2xl p-3 shadow-lg">
          <Search className="w-5 h-5 text-slate-400 flex-shrink-0 my-auto" />
          <input
            type="text"
            placeholder="Search by name, location, or amenities..."
            value={filters.query}
            onChange={handleQueryChange}
            onKeyPress={handleQuerySubmit}
            className="flex-1 outline-none bg-transparent text-slate-800 text-sm placeholder-slate-400"
          />
          <button
            onClick={handleQuerySubmit}
            className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-xl font-semibold text-sm transition-colors"
          >
            Search
          </button>
        </div>
      </div>

      {/* Results Section */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <FiltersSidebar 
            filters={filters} 
            onFilterChange={handleFilterChange}
            onReset={handleReset}
          />
        </div>

        {/* Main Results */}
        <div className="lg:col-span-3">
          {/* Results Info */}
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-850 dark:text-slate-100">
                {searchPerformed ? `${results.length} Results Found` : 'Browse All Stays'}
              </h2>
              {filters.query && (
                <p className="text-sm text-slate-400 mt-1">
                  Searching for "<strong>{filters.query}</strong>"
                </p>
              )}
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-2xl p-4 mb-6">
              <p className="text-sm text-red-700 dark:text-red-300 font-semibold">{error}</p>
            </div>
          )}

          {/* Loading State */}
          {loading ? (
            <LoadingSkeleton type="GRID" count={6} />
          ) : results.length > 0 ? (
            <>
              <PGGrid pgs={results} />
            </>
          ) : (
            <div className="text-center py-16 bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700">
              <MapPin className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-slate-850 dark:text-slate-200 mb-2">
                No Results Found
              </h3>
              <p className="text-sm text-slate-400 mb-4">
                Try adjusting your filters or search criteria
              </p>
              <button
                onClick={handleReset}
                className="inline-block bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-xl font-semibold text-sm transition-colors"
              >
                Reset Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
```

---

### 4. THEME/STYLING ISSUES
**Status:** ⚠️ MEDIUM

#### Issue Details:
- `globals.css` lines 107-123 have incomplete Tailwind CSS definitions
- Dark mode variables not properly defined
- Inconsistent spacing in some components
- Missing color palette for dark mode in some places

#### Solution - Update `frontend/src/app/globals.css`:

```css
@import "tailwindcss";

@theme {
  --color-primary-50: #fff1f2;
  --color-primary-100: #ffe4e6;
  --color-primary-200: #fecdd3;
  --color-primary-300: #fbcdd0;
  --color-primary-400: #f8a4aa;
  --color-primary-500: #f43f5e;
  --color-primary-600: #e11d48;
  --color-primary-700: #be123c;
  --color-primary-800: #9f1239;
  --color-primary-900: #881337;
  --color-primary-950: #500724;

  --color-slate-50: #f8fafc;
  --color-slate-100: #f1f5f9;
  --color-slate-200: #e2e8f0;
  --color-slate-300: #cbd5e1;
  --color-slate-400: #94a3b8;
  --color-slate-500: #64748b;
  --color-slate-600: #475569;
  --color-slate-700: #334155;
  --color-slate-800: #1e293b;
  --color-slate-850: #0f172a;
  --color-slate-900: #0f172a;
  --color-slate-950: #020617;

  --color-card-light: #ffffff;
  --color-card-dark: #1e293b;

  --color-bg-light: #f8fafc;
  --color-bg-dark: #0f172a;

  --font-sans: 'Inter', system-ui, -apple-system, sans-serif;
}

:root {
  --background: #f8fafc;
  --foreground: #1e293b;
  --card: #ffffff;
  --card-foreground: #1e293b;
  --border: #e2e8f0;
}

@media (prefers-color-scheme: dark) {
  :root {
    --background: #0f172a;
    --foreground: #f8fafc;
    --card: #1e293b;
    --card-foreground: #f8fafc;
    --border: #334155;
  }
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html {
  scroll-behavior: smooth;
}

body {
  background-color: var(--background);
  color: var(--foreground);
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  overflow-x: hidden;
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
}

/* Custom premium scrollbar */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 9999px;
}

@media (prefers-color-scheme: dark) {
  ::-webkit-scrollbar-thumb {
    background: #475569;
  }
}

::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

/* Common Layout Utilities */
.glass-effect {
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
}

@media (prefers-color-scheme: dark) {
  .glass-effect {
    background: rgba(15, 23, 42, 0.8);
  }
}

.shadow-soft {
  box-shadow: 0 4px 20px -2px rgba(0, 0, 0, 0.05), 0 2px 8px -1px rgba(0, 0, 0, 0.03);
}

.shadow-card-hover {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.shadow-card-hover:hover {
  transform: translateY(-4px);
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

/* Consistent icon sizing */
.icon-xs {
  width: 0.75rem;
  height: 0.75rem;
}

.icon-sm {
  width: 1rem;
  height: 1rem;
}

.icon-md {
  width: 1.5rem;
  height: 1.5rem;
}

.icon-lg {
  width: 2rem;
  height: 2rem;
}

.icon-xl {
  width: 2.5rem;
  height: 2.5rem;
}

/* Responsive container */
.container-custom {
  width: 100%;
  max-width: 1280px;
  margin-left: auto;
  margin-right: auto;
  padding-left: 1rem;
  padding-right: 1rem;
}

@media (min-width: 1024px) {
  .container-custom {
    padding-left: 2rem;
    padding-right: 2rem;
  }
}
```

---

### 5. API ENVIRONMENT CONFIGURATION ISSUES
**Status:** ⚠️ MEDIUM

#### Issue Details:
- `api.js` has hardcoded `NEXT_PUBLIC_API_URL` fallback
- Docker compose API URL points to `localhost:8083` which doesn't work in Docker
- Frontend can't reach backend in containerized environment

#### Solution - Update `frontend/src/services/api.js`:

```javascript
import axios from 'axios';

// Determine API base URL based on environment
const getApiUrl = () => {
  // Browser environment (Next.js Client Component)
  if (typeof window !== 'undefined') {
    return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8083/api';
  }
  
  // SSR/Node.js environment
  // In Docker, use container name; locally use localhost
  const isDocker = process.env.DOCKER_ENVIRONMENT === 'true';
  if (isDocker) {
    return 'http://livio-backend:8083/api';
  }
  return process.env.INTERNAL_API_URL || 'http://localhost:8083/api';
};

const API_BASE_URL = getApiUrl();

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 second timeout
});

// Request interceptor to inject JWT token from localStorage if available
api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
export { API_BASE_URL };
```

---

## 🟡 DEPLOYMENT STATUS

### Current Deployment Issues:

1. **Docker-Compose Configuration**
   - Using H2 database (not suitable for production)
   - Volume mount inconsistency for database
   - Frontend API URL points to localhost

2. **Missing Health Checks**
   - No health checks for backend
   - Frontend doesn't wait for backend to be ready

3. **No Environment-Specific Configs**
   - Same config for development and production
   - Secrets hardcoded

### Recommended Changes to `docker-compose.yml` (PostgreSQL version):

See the comprehensive solution in **Database Solution** section above.

---

## 📋 DEPLOYMENT CHECKLIST

### Before Deployment:

- [ ] Switch to PostgreSQL database
- [ ] Update `backend/pom.xml` with PostgreSQL dependency
- [ ] Update `application.properties` with PostgreSQL config
- [ ] Fix `SearchController` parameter validation
- [ ] Create `SearchPage.js` component
- [ ] Fix `globals.css` theme variables
- [ ] Update API configuration for Docker environment
- [ ] Add environment variables for sensitive data
- [ ] Test search functionality locally with Docker
- [ ] Run database migrations/initialization
- [ ] Configure CORS properly (remove `@CrossOrigin("*")` in production)

### Production Deployment (Render/Railway):

```bash
# 1. Environment Variables to set:
SPRING_DATASOURCE_URL=jdbc:postgresql://your-db-host:5432/livio_db
SPRING_DATASOURCE_USERNAME=livio_user
SPRING_DATASOURCE_PASSWORD=your_secure_password
APP_JWT_SECRET=your_256_bit_secret
NEXT_PUBLIC_API_URL=https://your-backend-domain/api

# 2. Database Setup:
# Create PostgreSQL database on Render/Heroku
# Run migrations if any

# 3. Deploy:
# Push to GitHub, Render will auto-deploy
```

---

## 🧪 TESTING THE FIX

### Test Search Functionality:

```bash
# 1. Start containers
docker-compose up -d

# 2. Test backend API
curl -X GET "http://localhost:8083/api/search?query=PG&city=Mumbai&gender=MALE" \
  -H "Content-Type: application/json"

# 3. Test frontend
# Visit http://localhost:8082
# Try search and filter

# 4. Check logs
docker-compose logs -f backend
```

### Expected Results:
- ✅ Search returns results based on query
- ✅ Filters work (gender, sharing, price, amenity)
- ✅ Results display with correct styling
- ✅ Dark mode works properly
- ✅ No console errors related to API calls

---

## 📞 SUPPORT & DEBUGGING

If issues persist after applying fixes:

1. Check backend logs: `docker logs livio-backend`
2. Check frontend logs: `docker logs livio-frontend`
3. Verify database connection: `docker logs livio-postgres`
4. Verify API is accessible: `curl http://localhost:8083/api/pgs`
5. Check browser console for frontend errors

---

**Last Updated:** 2024
**Status:** Ready for Implementation
