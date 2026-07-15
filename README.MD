# Livio - Premium PG-Finder & Co-Living Platform

**Livio** is a modern, minimal, and premium PG (Paying Guest) and co-living accommodation finder platform. It features a fully integrated **Spring Boot** REST API backend and a **Next.js** (React) frontend styled with **Tailwind CSS v4**.

---

## 🚀 Key Features
- **Integrated Startup**: Run both frontend and backend servers concurrently with a single Maven command.
- **Search & Filtering**: Quick searches by city, college, office, or landmark, with filters for gender accommodations (Male, Female, Unisex) and budget.
- **Responsive Layout**: Designed for optimal viewing across mobile, tablet, and desktop form factors.
- **Verification Engine**: Verification status badges, detailed reviews, ratings, and amenity checklists for listings.
- **H2 Database Seeding**: Pre-loaded mock stays, customer accounts, and reviews initialized dynamically.

---

## 🛠 Tech Stack

### Backend
- **Core**: Java 17, Spring Boot 3.2.5
- **Security**: Spring Security (Role-based CORS and endpoints configuration)
- **Data Access**: Spring Data JPA, Hibernate 6
- **Database**: H2 (In-Memory for development) / MySQL support
- **Build System**: Maven

### Frontend
- **Framework**: React 19, Next.js 16 (App Router)
- **Styling**: Tailwind CSS v4, Lucide React (Icons)
- **HTTP Client**: Axios (with authorization token interceptors)
- **Build Tool**: Next.js Turbopack

---

## 📁 Repository Structure
```text
Homepg/
├── backend/                  # Spring Boot Maven application
│   ├── src/main/java/com/livio/
│   │   ├── config/           # App runners & Data Initializers (seeding)
│   │   ├── controller/       # REST API Endpoints
│   │   ├── entity/           # JPA Database Entities
│   │   ├── repository/       # JPA Query Interfaces
│   │   └── service/          # Business logic implementations
│   └── pom.xml               # Maven configuration & dependencies
│
├── frontend/                 # Next.js web application
│   ├── src/app/              # Next.js App Router (layout, search, login, admin)
│   ├── src/components/       # Modular UI components (Layout, Details, Admin, Search)
│   ├── src/services/         # API client handlers (Axios service clients)
│   └── package.json          # Node dependencies & npm scripts
│
└── README.md                 # Project documentation (this file)
```

---

## 🚦 Getting Started

### Prerequisites
Make sure you have the following installed on your machine:
- **Java JDK 17** or higher
- **Maven** (configured in your PATH environment)
- **Node.js** (v18.x or higher) and **npm**

### Quickstart (Integrated Execution)
To start the entire application (both frontend and backend), simply run the following command in the **backend** folder:

```bash
cd backend
mvn spring-boot:run
```

#### How it Works:
A custom `FrontendRunner` class inside the Spring Boot container detects the operating system, triggers `npm run dev` asynchronously inside the `../frontend` folder, and redirects console outputs using `[Frontend]` logging prefixes. Stopping the Spring Boot runner automatically terminates the Next.js process.

### Port Mappings
- **Frontend App**: `http://localhost:8082`
- **Backend API**: `http://localhost:8083`
- **H2 Console**: `http://localhost:8083/h2-console` (JDBC URL: `jdbc:h2:mem:livio_db`, User: `sa`, Password: *blank*)

---

## 🔌 API Endpoints
- **Home**: `GET /`
- **Authentication**: `POST /api/auth/login`, `POST /api/auth/register`
- **PG Listings**: `GET /api/pgs`, `GET /api/pgs/{slug}`
- **Search Queries**: `GET /api/search?query=...&gender=...&maxPrice=...`
- **Inquiries**: `POST /api/inquiries`
- **Reviews**: `GET /api/reviews/pg/{pgId}`, `POST /api/reviews`
