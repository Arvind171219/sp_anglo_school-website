# School Management System

A full-stack private school/college website with **Spring Boot** backend, **React** frontend, and **MySQL** database.

## Features

- **Admin Panel**: Manage students, publish results, post announcements, update college info
- **Student Portal**: View exam results, search by roll number
- **Public Pages**: Home page with college info, announcements
- **JWT Authentication**: Secure login with role-based access (Admin / Student)
- **Auto Grade Calculation**: Grades auto-computed based on marks percentage

## Tech Stack

| Layer    | Technology                    |
|----------|-------------------------------|
| Backend  | Spring Boot 3.2, Java 17     |
| Frontend | React 18, Vite, React Router |
| Database | MySQL (or H2 for testing)     |
| Auth     | JWT (JSON Web Tokens)         |
| Build    | Maven, npm                    |

## Project Structure

```
school-website/
├── backend/                    # Spring Boot API
│   ├── src/main/java/com/school/
│   │   ├── config/            # Security, JWT, CORS
│   │   ├── controller/        # REST API endpoints
│   │   ├── model/             # JPA Entities
│   │   ├── repository/        # Data Access Layer
│   │   ├── dto/               # Request/Response DTOs
│   │   └── service/           # Business Logic
│   └── src/main/resources/
│       └── application.properties
├── frontend/                   # React SPA
│   ├── src/
│   │   ├── pages/             # Page components
│   │   │   ├── admin/         # Admin dashboard pages
│   │   │   └── student/       # Student pages
│   │   ├── components/        # Shared components
│   │   ├── context/           # Auth context
│   │   └── services/          # API service layer
│   └── index.html
└── database/
    └── schema.sql             # MySQL schema (optional)
```

## Quick Start (Local Development)

### Prerequisites
- Java 17+ (JDK)
- Node.js 18+
- Maven 3.8+
- MySQL 8+ (optional - H2 works for testing)

### 1. Start Backend (Spring Boot)

```bash
cd backend

# Option A: Run with H2 database (no MySQL needed - DEFAULT)
mvn spring-boot:run

# Option B: Run with MySQL
# First edit src/main/resources/application.properties
# Uncomment MySQL lines, comment H2 lines, set your password
mvn spring-boot:run
```

Backend starts at: **http://localhost:8080**

### 2. Start Frontend (React)

```bash
cd frontend
npm install
npm run dev
```

Frontend starts at: **http://localhost:3000**

### 3. Login

Open http://localhost:3000 and use these credentials:

| Role    | Username  | Password    |
|---------|-----------|-------------|
| Admin   | admin     | admin123    |
| Student | student1  | student123  |

## API Endpoints

| Method | Endpoint                    | Access  | Description           |
|--------|-----------------------------|---------|-----------------------|
| POST   | /api/auth/login             | Public  | Login                 |
| POST   | /api/auth/register          | Public  | Register              |
| GET    | /api/students               | Auth    | List all students     |
| POST   | /api/students               | Admin   | Add student           |
| PUT    | /api/students/:id           | Admin   | Update student        |
| DELETE | /api/students/:id           | Admin   | Delete student        |
| GET    | /api/results/student/:id    | Auth    | Get student results   |
| POST   | /api/results                | Admin   | Add result            |
| PUT    | /api/results/:id            | Admin   | Update result         |
| DELETE | /api/results/:id            | Admin   | Delete result         |
| GET    | /api/college                | Public  | Get college info      |
| POST   | /api/college                | Admin   | Update college info   |
| GET    | /api/announcements          | Public  | List announcements    |
| POST   | /api/announcements          | Admin   | Create announcement   |
| PUT    | /api/announcements/:id      | Admin   | Update announcement   |
| DELETE | /api/announcements/:id      | Admin   | Delete announcement   |

---

## FREE Deployment Options

### Option 1: Render.com (Recommended - Easiest)

**Backend (Spring Boot):**
1. Push your code to GitHub
2. Go to https://render.com → New → Web Service
3. Connect your GitHub repo, set root to `backend`
4. Build command: `mvn clean package -DskipTests`
5. Start command: `java -jar target/school-website-0.0.1-SNAPSHOT.jar`
6. Add environment variables:
   - `SPRING_DATASOURCE_URL` = your MySQL connection string
   - `SPRING_DATASOURCE_USERNAME` = your db username
   - `SPRING_DATASOURCE_PASSWORD` = your db password

**Frontend (React):**
1. Render.com → New → Static Site
2. Connect repo, set root to `frontend`
3. Build command: `npm install && npm run build`
4. Publish directory: `dist`

**Free MySQL:**
- Use https://www.clever-cloud.com (free MySQL up to 5MB)
- Or https://planetscale.com (free tier available)
- Or https://aiven.io (free tier MySQL)

### Option 2: Railway.app

1. Go to https://railway.app
2. New Project → Deploy from GitHub
3. Add a MySQL database (free included)
4. Deploy both backend and frontend
5. Railway auto-detects Spring Boot and React

### Option 3: Backend on Render + Frontend on Vercel

**Frontend on Vercel:**
1. Go to https://vercel.com
2. Import your repo
3. Set root directory to `frontend`
4. Build automatically detects Vite
5. Add environment variable: `VITE_API_URL` = your backend URL

**Note for Vercel:** Update `frontend/src/services/api.js`:
```js
const API_BASE = import.meta.env.VITE_API_URL || '/api';
```

### Option 4: Full Free Stack

| Service  | Provider         | Free Tier                |
|----------|------------------|--------------------------|
| Backend  | Render.com       | 750 hours/month          |
| Frontend | Vercel/Netlify   | Unlimited static hosting |
| Database | Clever-Cloud     | 5MB free MySQL           |
| Database | Aiven.io         | Free MySQL tier          |

---

## Using MySQL Locally

1. Install MySQL and create the database:
```sql
CREATE DATABASE school_db;
```

2. Edit `backend/src/main/resources/application.properties`:
   - Uncomment the MySQL lines
   - Comment the H2 lines
   - Set your MySQL password

3. Spring Boot auto-creates all tables on startup.

## Notes

- The H2 in-memory database resets on every restart (good for testing)
- For production, always use MySQL
- Change the JWT secret in `application.properties` for production
- Default admin credentials are created on first startup
