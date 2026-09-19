# 🏠 Livio (HomePg)

> **Livio is a full-stack property platform designed to simplify property PG discovery, management, and user interaction through a modern web experience.**

Livio combines a **Next.js (React) frontend**, **Spring Boot (Java) backend**, and an **embedded H2/PostgreSQL database** to provide a scalable foundation for a property-focused digital platform.

---

## 🚀 About Livio

Livio is built to create a centralized platform where users can interact with property-related information through a simple, responsive, and reliable web application.

The platform is designed around three core principles:

* **Simple** — intuitive property-focused user experience
* **Reliable** — structured backend and persistent data management
* **Scalable** — architecture designed to support future product growth

---

## ✨ Key Features

### 🏡 PG Management
* PG listing and management
* PG information and details
* Structured PG data
* PG availability/status management
* Create, update, view, and manage PG information

### 🔎 PG/Rooms Discovery
* Browse available PG/Rooms
* Search PG/Rooms
* Filter PG/Rooms based on relevant criteria
* View detailed PG/Rooms information
* Organized PG/Rooms listings for easier discovery

### 👤 User Management
* User registration and login (JWT Authentication)
* User profile management
* User-specific property interactions
* Secure backend-driven user data management

### 💬 User Interaction
* Property-related interactions
* Save/favorite properties
* Manage user preferences
* Track relevant user activity

---

## 🏗️ System Architecture

HomePg follows a modern full-stack architecture:

`	ext
                         ┌──────────────────┐
                         │      Users       │
                         └────────┬─────────┘
                                  │
                                  ▼
                         ┌──────────────────┐
                         │   Next.js React  │
                         │    Frontend      │
                         └────────┬─────────┘
                                  │
                              REST APIs
                                  │
                                  ▼
                         ┌──────────────────┐
                         │   Spring Boot    │
                         │   Java Backend   │
                         └────────┬─────────┘
                                  │
                                  ▼
                         ┌──────────────────┐
                         │ H2 / PostgreSQL  │
                         │     Database     │
                         └──────────────────┘
`

---

## 🛠️ Technology Stack

| Layer            | Technology |
| ---------------- | ---------- |
| **Frontend**     | Next.js, React, Tailwind CSS |
| **Backend**      | Java, Spring Boot, Spring Security, Hibernate |
| **Database**     | Embedded H2 (Dev), PostgreSQL (Prod) |
| **Container**    | Docker, Docker Compose |
| **Build Tool**   | Maven (Backend), npm (Frontend) |

---

## 🚀 Getting Started

### Prerequisites

* Node.js & npm
* Java JDK 17
* Maven
* Docker (optional, for containerized deployment)

### 1. Running the Backend

The backend is a standard Spring Boot application. It runs on http://localhost:8083.

`ash
cd backend
mvn clean package -DskipTests
java -jar target/livio-backend-0.0.1-SNAPSHOT.jar
`

Alternatively, you can run it using the Maven wrapper or plugin:
`ash
cd backend
mvn spring-boot:run
`

### 2. Running the Frontend

The frontend is a Next.js application. It runs on http://localhost:3000.

`ash
cd frontend
npm install
npm run dev
`

### 3. Docker Deployment

To build and run the entire application (frontend + backend) using Docker:

`ash
docker build -t homepg .
docker run -p 3000:3000 -p 8083:8083 homepg
`

---

## 🔐 Authentication & Security

Livio uses JWT-based authentication for securing endpoints. Security-sensitive configuration, such as database credentials and application secrets, should be provided through environment variables rather than stored directly in source code.

Example .env configuration (if using PostgreSQL):
`env
SPRING_DATASOURCE_URL=jdbc:postgresql://localhost:5432/homepg
SPRING_DATASOURCE_USERNAME=postgres
SPRING_DATASOURCE_PASSWORD=your_password
`

By default, the application runs on an embedded H2 database located at ./data/livio_db.mv.db.

---

## 📌 Project Status

**HomePg is under active development.**

The platform is being developed with a focus on:
* Product usability
* Scalable architecture
* Reliable data management
* Clean frontend/backend separation
* API-driven development
* Production-ready deployment

---

**Livio — Built to make property experiences simpler, smarter, and more accessible.**
