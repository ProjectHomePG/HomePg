# Livio - Deployment & CI/CD Guide

This guide details how to build, package, and deploy the Livio PG-finder and co-living platform.

---

## 🚀 Deployment Options

### Option 1: Docker Compose (Recommended for Production & VPS)
Docker Compose packages both the Spring Boot API and the Next.js App Router into optimized, lightweight Docker containers and starts them concurrently.

#### Prerequisites
- Install **Docker** and **Docker Compose** on your server.

#### Steps
1. Clone your repository to your server:
   ```bash
   git clone <your-repository-url>
   cd Homepg
   ```
2. Build and start the containers in detached (background) mode:
   ```bash
   docker compose up --build -d
   ```
3. The services will start running:
   - **Frontend App**: `http://localhost:8082`
   - **Backend API**: `http://localhost:8083`
4. Persistent Data:
   - Database entries (H2) will be persisted in `./backend/data/` on the host machine, making it safe to update or rebuild containers without losing data.

---

### Option 2: CI/CD Pipeline with GitHub Actions
Every time you push or merge a PR to the `main` or `master` branches, GitHub Actions will automatically run the CI/CD pipeline defined in `.github/workflows/ci-cd.yml`:

1. **Continuous Integration**:
   - Backend: Sets up JDK 17, caches dependencies, compiles the code, and runs all unit tests.
   - Frontend: Sets up Node 18, installs packages, runs ESLint checker, and runs Next.js production build (`npm run build`).
2. **Docker Packaging & Registry Publish**:
   - Build tags are compiled using the Git SHA commit hash.
   - Images are pushed to **GitHub Container Registry (GHCR)** under:
     - `ghcr.io/<your-github-username>/<repo-name>-backend:latest`
     - `ghcr.io/<your-github-username>/<repo-name>-frontend:latest`

#### How to Deploy via GHCR images:
On your production server, simply create a `docker-compose.prod.yml` and pull the latest pre-built images:
```yaml
version: '3.8'

services:
  backend:
    image: ghcr.io/<your-github-username>/<repo-name>-backend:latest
    ports:
      - "8083:8083"
    volumes:
      - ./data:/app/data
    restart: unless-stopped

  frontend:
    image: ghcr.io/<your-github-username>/<repo-name>-frontend:latest
    ports:
      - "8082:8082"
    environment:
      - NEXT_PUBLIC_API_URL=http://<your-server-ip-or-domain>:8083/api
    restart: unless-stopped
```
Run `docker compose -f docker-compose.prod.yml pull && docker compose -f docker-compose.prod.yml up -d` to deploy!

---

### Option 3: Deploying on Render (onrender.com)
Render supports automatic one-click deployments of multi-service architectures using their **Blueprints** feature. We have configured a `render.yaml` specification at the root of the project.

#### Steps:
1. Push this project repository to your GitHub account.
2. Log into the [Render Dashboard](https://dashboard.render.com).
3. Click **New +** and select **Blueprint**.
4. Connect your GitHub repository.
5. Render will automatically detect the `render.yaml` file and prepare the following resources on the Free tier:
   - **livio-db**: A persistent managed PostgreSQL database.
   - **livio-backend**: The Spring Boot Java API (exposes port `8083`).
   - **livio-frontend**: The Next.js web application (exposes port `8082`).
6. Custom Backend Domains:
   - If the name `livio-backend` is already taken, Render will assign your backend a slightly different URL (e.g. `https://livio-backend-xywz.onrender.com`).
   - If that happens, go to your **livio-frontend** Web Service settings in the Render dashboard, and update the `NEXT_PUBLIC_API_URL` environment variable to point to the correct backend URL (e.g., `https://livio-backend-xywz.onrender.com/api`), then click **Manual Deploy** -> **Clear Cache & Deploy** to re-compile Next.js with the new URL.
7. Click **Apply** to deploy!

---

### Option 4: Manual Startup (Local Development)
To run the project on your local machine outside of Docker:

#### 1. Start both servers concurrently via Maven:
Inside the `backend` folder:
```bash
mvn spring-boot:run
```
*A custom runner will automatically detect your OS and launch the Next.js frontend dev server (`npm run dev`) asynchronously.*

#### 2. Manual Startup (Separate Windows/Terminals):
- **Backend API**:
  ```bash
  cd backend
  mvn spring-boot:run
  ```
- **Frontend App**:
  ```bash
  cd frontend
  npm install
  npm run dev
  ```
