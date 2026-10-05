<div align="center">
  <h1>🏠 Livio (HomePg)</h1>
  <p><strong>A Modern, Scalable Platform for PG & Room Discovery</strong></p>
  
  <p>
    <img src="https://img.shields.io/badge/Frontend-Next.js-black?style=for-the-badge&logo=next.js" alt="Next.js" />
    <img src="https://img.shields.io/badge/Backend-Spring_Boot-6DB33F?style=for-the-badge&logo=spring" alt="Spring Boot" />
    <img src="https://img.shields.io/badge/Database-PostgreSQL-316192?style=for-the-badge&logo=postgresql" alt="PostgreSQL" />
    <img src="https://img.shields.io/badge/Deployment-Vercel_%7C_Render-blueviolet?style=for-the-badge" alt="Deployment" />
  </p>
</div>

---

## 🚀 About Livio

Livio is a robust, production-grade platform designed to streamline the discovery and management of PGs (Paying Guests) and rental rooms. Engineered as a modern full-stack application, it pairs a lightning-fast **Next.js frontend** with a highly scalable, secure **Spring Boot backend**. 

Built for performance, scalability, and an exceptional user experience, Livio is the foundation of a modern property tech startup.

---

## ✨ Key Features

### 🏡 PG & Property Management
* **Rich Listings:** Detailed PG data including amenities, pricing, availability, and images.
* **Property Administration:** Intuitive flow to create, update, and manage PG portfolios.
* **Status Tracking:** Real-time availability and capacity tracking.

### 🔎 Advanced Discovery & Search
* **Smart Filtering:** Find rooms based on budget, location, and specific preferences.
* **Interactive UI:** A highly responsive, Tailwind-styled interface for seamless browsing.
* **Organized Categorization:** Simplifies the decision-making process for users.

### 🔐 User & Security Management
* **JWT Authentication:** Secure, stateless token-based authentication.
* **Role-Based Access Control:** Distinct roles for property owners vs. tenants.
* **Personalized Profiles:** Users can manage their preferences and saved properties.

---

## 🏗️ System Architecture

Livio follows a decoupled microservices-inspired architecture:

```text
                           ┌─────────────────────────┐
                           │      Web Clients        │
                           └───────────┬─────────────┘
                                       │
                                       ▼
  [ Vercel Edge Network ]  ┌─────────────────────────┐
                           │    Next.js Frontend     │ (React, Tailwind)
                           └───────────┬─────────────┘
                                       │ REST APIs (JSON)
                                       ▼
  [ Render Container ]     ┌─────────────────────────┐
                           │   Spring Boot Backend   │ (Java, Spring Security)
                           └───────────┬─────────────┘
                                       │
                                       ▼
  [ Persistent Volume ]    ┌─────────────────────────┐
                           │    Database Storage     │ (PostgreSQL / H2)
                           └─────────────────────────┘
```

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React, Next.js 14+, Tailwind CSS, Lucide Icons |
| **Backend** | Java 17, Spring Boot, Spring Security, Hibernate ORM |
| **Database** | PostgreSQL (Production), Embedded H2 (Development) |
| **Containerization** | Docker, Docker Compose |
| **Build Tools** | npm (Frontend), Maven (Backend) |
| **Hosting** | Vercel (Frontend), Render (Backend API) |

---

## 🚀 Deployment Strategy (Production)

Livio uses a highly optimized **Hybrid Deployment Strategy** to maximize performance and minimize costs:

1. **Frontend (Vercel):** The Next.js application is deployed on Vercel's Edge Network for global CDN distribution, automatic caching, and lightning-fast page loads.
2. **Backend (Render):** The Spring Boot Java API and Database run as a containerized service on Render, handling heavy lifting, background tasks, and data persistence.
3. **Seamless Integration:** Vercel automatically proxies `/api/*` requests directly to the Render backend, entirely bypassing CORS issues and securing the API.

---

## 💻 Local Development Setup

### Prerequisites
* **Node.js** (v18 or higher)
* **Java JDK** (v17 or higher)
* **Maven** (v3.8+)
* **Docker** (optional)

### 1. Start the Spring Boot Backend

The backend will start and connect to a local embedded H2 database automatically for development.

```bash
cd backend
mvn clean install
mvn spring-boot:run
```
> The API will be available at `http://localhost:8083`

### 2. Start the Next.js Frontend

Open a new terminal window:

```bash
cd frontend
npm install
npm run dev
```
> The web interface will be available at `http://localhost:8082`

---

## 🔐 Environment Variables

To run the application in a production-like environment (e.g., using PostgreSQL), create an `.env` file in the backend root:

```env
SPRING_PROFILES_ACTIVE=prod
SPRING_DATASOURCE_URL=jdbc:postgresql://localhost:5432/homepg
SPRING_DATASOURCE_USERNAME=postgres
SPRING_DATASOURCE_PASSWORD=your_secure_password
```

---

## 📁 Repository Structure

```text
HomePg/
├── backend/                  # Java Spring Boot API source code
│   ├── src/                  # Controllers, Services, Models, Security
│   └── pom.xml               # Maven dependencies
├── frontend/                 # Next.js React application
│   ├── src/app/              # Next.js App Router pages
│   ├── src/components/       # Reusable UI components
│   ├── vercel.json           # Vercel deployment & rewrite rules
│   └── package.json          # Node dependencies
├── data/                     # Local H2 database persistent storage
├── render.yaml               # Render Infrastructure-as-Code config
└── Dockerfile                # Production backend container build steps
```

---

<div align="center">
  <p>Built with ❤️ to make property experiences simpler, smarter, and more accessible.</p>
</div>
