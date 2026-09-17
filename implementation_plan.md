# Implementation Plan: Deployment Fix, Single Port Setup, Search & Filter Overhaul, Auth Redesign, Dark/Light Mode, and Real-Time Data

Resolve the deployment startup crash (`HibernateException: Unable to determine Dialect without JDBC metadata` and subsequent `ECONNREFUSED ::1:8083`), configure a single-port unified deployment (Frontend + Backend + Database), fix the "Find PGs" search button and filter options, modernize Sign In / Sign Up interfaces, add a comprehensive Dark/Light theme toggle, and connect the UI to real-time data from the uploaded database.

---

## Root Cause Analysis

1. **Hibernate Dialect Crash on Deployment**:
   - `Caused by: org.hibernate.HibernateException: Unable to determine Dialect without JDBC metadata`
   - **Why it occurred**: In Spring Boot 3.2.5 with Hibernate 6, when a custom `@Bean DataSource` is created in `DataSourceConfig.java`:
     - If an external database URL is provided (e.g. Render/cloud PostgreSQL), `DataSourceConfig` parsed the URL without retaining required SSL parameters (`?sslmode=require`), causing the external database connection to fail.
     - When the external connection failed, it fell back to H2. However, the H2 database file had lock conflicts (`MVStoreException: The file is locked`) or permission issues.
     - Because the DataSource could not establish a connection to fetch metadata and neither `spring.jpa.database-platform`, `jakarta.persistence.jdbc.url`, nor `hibernate.dialect` was explicitly declared in `application.properties` / `application-prod.properties`, Hibernate failed to determine the dialect and crashed during `EntityManagerFactory` creation.
   - **Consequence**: Spring Boot backend crashed immediately upon boot. When Next.js rewrites attempted to proxy `/api/pgs` and `/api/search` to `http://localhost:8083`, it encountered `ECONNREFUSED ::1:8083` / `127.0.0.1:8083`.

2. **Search & Filter Malfunctions**:
   - In `SearchServiceImpl.java`: When `amenity` was passed as `'ALL'`, it was not sanitized like `city`, `gender`, and `sharing`. Instead, it queried `LOWER(a.name) LIKE '%all%'`, matching zero records and returning an empty list.
   - In `PGRepository.java`: `searchPGs` query used multiple `LEFT JOIN` on collection tables alongside `EAGER` fetched list collections in `PG.java`, causing collection bag fetch conflicts in Hibernate and inconsistent search matches.
   - In `SearchBar.js` and `Navbar.js`: The search bar submitted parameters, but when the backend was down, the frontend fell back to static mock data instead of reading from the real database (`data/livio_db.mv.db`), giving the impression that uploaded database data is missing.
   - The filter sidebar lacked multi-filter clearance, responsive styling, and active filter pill counters.

3. **Single-Port Deployment Requirement**:
   - Cloud providers (Render, Railway, Fly.io, Heroku) and typical single-server setups expose only a single web port (`PORT`).
   - The existing `docker-compose.yml` exposed two ports (`8082` for frontend, `8083` for backend), while `start.sh` ran both in a single container but had timing and IPv6 loopback binding issues (`localhost` resolving to `::1`).

4. **Sign In & Sign Up Aesthetics**:
   - The current login page includes demo credentials and sandbox controls embedded directly in the form, feeling like a prototype rather than a polished, production-ready portal.
   - The register page lacked password visibility toggles, proper input validation feedback, and consistent visual polish.

5. **Theme Support**:
   - `globals.css` only had `@media (prefers-color-scheme: dark)` without a manual toggle mechanism, theme provider, or localStorage persistence.
   - Broken CSS overrides in `globals.css` (`.w-5`, `.h-5`, `.w-4`, `.h-4` with manual spacing multiples) distorted Lucide icons across all components.

---

## User Review Required

> [!IMPORTANT]
> **Single Port Architecture**: In this setup, Next.js will be the only publicly exposed service (on standard port `8082`, `8080`, or cloud `$PORT`). All requests to `/api/*` and `/uploads/*` are reverse-proxied internally to Spring Boot running on `127.0.0.1:8083`. No second port needs to be opened to the internet.

> [!NOTE]
> **Database Data**: Your uploaded database `data/livio_db.mv.db` (1.8 MB) contains your live records. We will ensure this database is placed in both `./data/` and `./backend/data/`, with `AUTO_SERVER=TRUE;FILE_LOCK=SOCKET` enabled so file locks will never crash the backend again. If an external PostgreSQL database (Render / Neon / Supabase) is configured, the system will automatically handle SSL and credentials, falling back cleanly to persistent H2 if unreachable.

---

## Proposed Changes

### 1. Backend: Database Configuration & Dialect Fix

#### [MODIFY] [backend/src/main/resources/application.properties](file:///d:/Github/HomePg/backend/src/main/resources/application.properties)
- Add explicit default JPA dialect properties (`spring.jpa.database-platform=org.hibernate.dialect.H2Dialect`).
- Set `spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.H2Dialect` and `spring.jpa.properties.jakarta.persistence.jdbc.url=jdbc:h2:file:./data/livio_db`.
- Ensure H2 connection string has `AUTO_SERVER=TRUE;DB_CLOSE_ON_EXIT=FALSE;FILE_LOCK=SOCKET`.

#### [MODIFY] [backend/src/main/resources/application-prod.properties](file:///d:/Github/HomePg/backend/src/main/resources/application-prod.properties)
- Configure fallback datasource and dialect settings so that even in `prod` profile, Hibernate never encounters missing metadata.

#### [MODIFY] [backend/src/main/java/com/livio/config/DataSourceConfig.java](file:///d:/Github/HomePg/backend/src/main/java/com/livio/config/DataSourceConfig.java)
- Improve URL parser:
  - If a PostgreSQL URL is detected, preserve query parameters or append `sslmode=require` if remote.
  - Correctly URL-decode username and password containing special characters.
  - Set dialect dynamically on EntityManagerFactory or ensure fallback to H2 creates directories (`./data`) if they don't exist.
  - Add `FILE_LOCK=SOCKET` to H2 URL to prevent file locking issues across container restarts.

---

### 2. Backend: Search Query & Filter Logic Fix

#### [MODIFY] [backend/src/main/java/com/livio/service/impl/SearchServiceImpl.java](file:///d:/Github/HomePg/backend/src/main/java/com/livio/service/impl/SearchServiceImpl.java)
- Fix the `cleanAmenity` bug: sanitize `amenity` when it equals `'ALL'` or is whitespace, preventing `LOWER(a.name) LIKE '%all%'`.
- Clean query strings with `.trim()`.

#### [MODIFY] [backend/src/main/java/com/livio/repository/PGRepository.java](file:///d:/Github/HomePg/backend/src/main/java/com/livio/repository/PGRepository.java)
- Refactor the `@Query` in `searchPGs` to use safe subqueries or distinct left joins that do not trigger multiple bag fetch errors.
- Ensure case-insensitive partial matching for PG title, city, area, state, and address.

---

### 3. Deployment & Single-Port Architecture

#### [MODIFY] [start.sh](file:///d:/Github/HomePg/start.sh)
- Launch Spring Boot with `-Djava.net.preferIPv4Stack=true` on port 8083 bound to `127.0.0.1`.
- Ensure health check loops against `http://127.0.0.1:8083/` using IPv4 explicitly.
- Launch Next.js on `PORT` (or `8082` by default) so it serves both frontend and proxied backend requests on a single port.

#### [MODIFY] [frontend/next.config.mjs](file:///d:/Github/HomePg/frontend/next.config.mjs)
- Update rewrites destination from `http://localhost:8083` to `http://127.0.0.1:8083` to avoid Node.js 18+ IPv6 `::1` resolution failures.

#### [MODIFY] [docker-compose.yml](file:///d:/Github/HomePg/docker-compose.yml)
- Update to support single-port deployment: expose only 1 port (`8082:8082`), map `./data:/app/data` (fixing the missing data path), and configure network aliases properly.

#### [MODIFY] [Dockerfile](file:///d:/Github/HomePg/Dockerfile)
- Ensure `/app/data` directory is prepared with proper permissions and the user's `livio_db.mv.db` is copied and persisted.

---

### 4. Frontend: Dark & Light Theme System

#### [NEW] [frontend/src/context/ThemeContext.js](file:///d:/Github/HomePg/frontend/src/context/ThemeContext.js)
- Create a React Theme Context managing `'light' | 'dark' | 'system'`.
- Synchronize with `document.documentElement.classList` (`dark` class) and store preference in `localStorage`.

#### [NEW] [frontend/src/components/Shared/ThemeToggle.js](file:///d:/Github/HomePg/frontend/src/components/Shared/ThemeToggle.js)
- Sleek toggle button with Sun / Moon icons and smooth rotation animation.

#### [MODIFY] [frontend/src/app/layout.js](file:///d:/Github/HomePg/frontend/src/app/layout.js)
- Wrap application with `ThemeProvider`.
- Inject a lightweight inline script in `<head>` to prevent theme flash on initial load.

#### [MODIFY] [frontend/src/app/globals.css](file:///d:/Github/HomePg/frontend/src/app/globals.css)
- Remove the broken icon overrides (`.w-4`, `.h-4`, `.w-5`, `.h-5`).
- Ensure class-based `.dark` variables work seamlessly across all surfaces, text colors, and borders.

#### [MODIFY] [frontend/src/components/Layout/Navbar.js](file:///d:/Github/HomePg/frontend/src/components/Layout/Navbar.js)
- Embed the `ThemeToggle` in both desktop and mobile menus.

---

### 5. Frontend: Search & Filter Overhaul

#### [MODIFY] [frontend/src/components/Home/SearchBar.js](file:///d:/Github/HomePg/frontend/src/components/Home/SearchBar.js)
- Ensure "Find PGs" search button smoothly routes to `/search` with all selected criteria (query, gender, budget).
- Add keyboard submit support (Enter key) and clear indicator.

#### [MODIFY] [frontend/src/app/search/page.js](file:///d:/Github/HomePg/frontend/src/app/search/page.js)
- Improve state synchronization with URL query parameters.
- Provide live result count, instant response, and clean empty-state guidance with quick reset.

#### [MODIFY] [frontend/src/components/Search/FiltersSidebar.js](file:///d:/Github/HomePg/frontend/src/components/Search/FiltersSidebar.js)
- Redesign filter sidebar:
  - Better visual hierarchy with active filter counters.
  - Interactive budget slider / quick range presets.
  - Multi-select friendly amenity chips.
  - Instant reset button and clear active tags.
  - High dark-mode contrast.

#### [MODIFY] [frontend/src/services/pgService.js](file:///d:/Github/HomePg/frontend/src/services/pgService.js)
- Improve search API error handling: retry logic, graceful notification if server is unreachable, and ensure real data from the database is preferred.

---

### 6. Frontend: Sign In & Sign Up Redesign

#### [MODIFY] [frontend/src/app/login/page.js](file:///d:/Github/HomePg/frontend/src/app/login/page.js)
- Redesign into a premium, modern card:
  - Clean role selector (Resident / PG Owner).
  - Show/Hide password toggle.
  - Remove intrusive mock/demo boxes; replace with a subtle "Try Demo Account" helper.
  - Form validation with clear inline error states and loading animations.

#### [MODIFY] [frontend/src/app/register/page.js](file:///d:/Github/HomePg/frontend/src/app/register/page.js)
- Upgrade registration UI to match login design:
  - Tenant vs Property Owner role selector.
  - Phone number formatting.
  - Password strength / show-hide toggle.
  - Real backend registration with automatic login redirect.

---

### 7. Real-Time Data Integration

- Ensure the backend reads from `livio_db.mv.db` containing real PG listings, real prices, and real locations.
- Add live data refresh hooks (auto-revalidating or manual refresh trigger) in `search/page.js` and `pg/[slug]/page.js`.
- Synchronize inquiry submissions and review ratings immediately in the UI state upon creation.

---

## Verification Plan

### Automated Build & Test Verification
1. **Backend Build**:
   ```powershell
   cd d:\Github\HomePg\backend
   mvn clean test -Dtest=*Test
   ```
2. **Frontend Build**:
   ```powershell
   cd d:\Github\HomePg\frontend
   npm run build
   ```

### Manual Verification
1. **Single-Port & Startup Verification**:
   - Start the unified service using `start.sh` or Docker:
     - Verify Spring Boot starts on `127.0.0.1:8083` without dialect errors.
     - Verify Next.js binds to single port `8082` (or `$PORT`).
     - Access `http://localhost:8082` in browser.
     - Call `http://localhost:8082/api/pgs` and verify real database records return with HTTP 200.
2. **Search & Filter Verification**:
   - Click "Find PGs" on the homepage navbar -> Navigate to `/search`.
   - Search by name (e.g., "Dublin", "Zolo", "Stanza"), city (Bangalore, Delhi, Mumbai), and gender (MALE, FEMALE, UNISEX).
   - Verify filter sidebar chips and budget inputs update the results list in real-time.
   - Verify selecting an amenity (e.g., "WiFi") returns matching PGs rather than empty results.
3. **Authentication Verification**:
   - Test Sign In page with both regular and owner credentials.
   - Test Sign Up page: create a new tenant and a new owner account; verify account is saved in the database.
4. **Theme Verification**:
   - Toggle between Light and Dark mode using the navbar button.
   - Verify all pages (Home, Search, Details, Login, Register, Admin) render cleanly with high contrast in both modes.
   - Refresh page; verify theme preference is preserved from `localStorage`.
5. **Git Commit & Push**:
   - Stage all changes, commit with descriptive message, and push to `origin/main`.
