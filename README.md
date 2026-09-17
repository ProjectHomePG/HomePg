# 🏠 Livio

> **Livio is a full-stack property platform designed to simplify property PG discovery, management, and user interaction through a modern web experience.**

Livio combines a **JavaScript frontend**, **Java backend**, and **PostgreSQL database** to provide a scalable foundation for a property-focused digital platform.

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

* User registration and login
* User profile management
* User-specific property interactions
* Secure backend-driven user data management

### 💬 User Interaction

* Property-related interactions
* Save/favorite properties
* Manage user preferences
* Track relevant user activity

### ⚙️ Backend & API

The Java backend provides:

* RESTful APIs
* Business logic
* User and property management
* Database operations
* Request validation
* Frontend/backend integration

### 🗄️ Data Management

PostgreSQL provides persistent storage for:

* Users
* Profiles
* Properties
* Property information
* User interactions
* Application data

---

# 🏗️ System Architecture

HomePg follows a modern full-stack architecture:

```text
                         ┌──────────────────┐
                         │      Users       │
                         └────────┬─────────┘
                                  │
                                  ▼
                         ┌──────────────────┐
                         │   JavaScript     │
                         │    Frontend      │
                         └────────┬─────────┘
                                  │
                              REST APIs
                                  │
                                  ▼
                         ┌──────────────────┐
                         │   Java Backend   │
                         │                  │
                         │ Business Logic   │
                         │ API Layer        │
                         │ Validation       │
                         └────────┬─────────┘
                                  │
                                  ▼
                         ┌──────────────────┐
                         │   PostgreSQL     │
                         │     Database     │
                         └──────────────────┘
```

Docker provides containerization for consistent development and deployment environments.

---

# 🛠️ Technology Stack

| Layer            | Technology |
| ---------------- | ---------- |
| Frontend         | JavaScript |
| Backend          | Java       |
| Database         | PostgreSQL |
| Containerization | Docker     |
| Build Tool       | Maven      |
| Package Manager  | npm        |

### Frontend

The JavaScript frontend handles:

* User interface
* Property discovery
* Forms and interactions
* API communication
* Client-side application logic

### Backend

The Java backend handles:

* REST APIs
* Business logic
* Authentication/user management
* Property operations
* Database communication
* Server-side validation

### Database

**PostgreSQL** is used as the primary relational database for reliable and structured application data management.

### Docker

Docker enables the application environment to be packaged and deployed consistently across development and production environments.

---

# 📂 Project Structure

```text
HomePg/
│
├── frontend/
│   ├── src/
│   ├── public/
│   └── package.json
│
├── backend/
│   ├── src/
│   │   ├── main/
│   │   │   └── java/
│   │   └── test/
│   └── pom.xml
│
├── docker/
│   └── Dockerfile
│
├── docs/
│
├── .env.example
└── README.md
```

---

# 🔄 Application Flow

```text
User
 │
 ▼
HomePg Frontend
 │
 │ HTTP / REST API
 ▼
Java Backend
 │
 ├── Authentication
 ├── Property Services
 ├── User Services
 ├── Business Logic
 │
 ▼
PostgreSQL
 │
 ▼
Backend Response
 │
 ▼
HomePg Frontend
 │
 ▼
User
```

---

# 🔐 Authentication & Data Security

HomePg uses a backend-driven architecture for managing application data and user operations.

Security-sensitive configuration such as database credentials and application secrets should be provided through environment variables rather than stored directly in source code.

Example:

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=homepg
DB_USERNAME=postgres
DB_PASSWORD=your_password
```

---

# 🚀 Running HomePg

## Prerequisites

* Node.js
* npm
* Java JDK
* Maven
* PostgreSQL
* Docker

---

## Frontend

```bash
cd frontend
npm install
npm run dev
```

---

## Backend

```bash
cd backend
mvn clean package
```

Run the generated application:

```bash
java -jar target/<backend-jar-name>.jar
```

---

## Docker

Build the application:

```bash
docker build -t homepg .
```

Run:

```bash
docker run -p 8080:8080 homepg
```

---

# 🌐 Product Architecture

HomePg is structured to support the evolution of the platform as the product grows.

```text
                 HOME PG PLATFORM
                        │
        ┌───────────────┼───────────────┐
        │               │               │
        ▼               ▼               ▼
   Property         User &          Platform
   Discovery        Profiles        Services
        │               │               │
        └───────────────┼───────────────┘
                        │
                        ▼
                  Java API Layer
                        │
                        ▼
                   PostgreSQL
```

This separation allows product features to evolve independently while maintaining a consistent backend and data layer.

---

# 💡 Why HomePg?

HomePg is built around creating a **single, technology-driven platform for property-related experiences**, reducing complexity for users while providing a foundation that can scale with the product.

The architecture separates:

**User Experience → Application Logic → Data**

This provides a foundation for introducing additional property services, intelligent discovery, automation, analytics, and other platform capabilities as the product evolves.

---

# 📌 Project Status

**HomePg is under active development.**

The platform is being developed with a focus on:

* Product usability
* Scalable architecture
* Reliable data management
* Clean frontend/backend separation
* API-driven development
* Production-ready deployment

---

## 🏠 Livio

**Property Platform · JavaScript · Java · PostgreSQL · Docker**

Built to make property experiences **simpler, smarter, and more accessible.**
