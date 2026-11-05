# Iliyas Patel — Full-Stack Portfolio

A production-ready full-stack portfolio with a React frontend, Express.js REST API backend, and MySQL database integration.

---

## 1. Project Structure

```
iliyas-patel-portfolio/
├── frontend/                 # React 19 + Vite + Tailwind CSS Frontend
│   ├── src/
│   │   ├── components/       # UI & section components (Contact, Hero, Services, etc.)
│   │   ├── utils/            # API client (api.js) & utilities
│   │   ├── data/             # Portfolio content & copy
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── public/               # Public assets & images
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── package.json
│   ├── .env.example
│   └── .gitignore
│
├── backend/                  # Node.js + Express + MySQL Backend
│   ├── config/
│   │   └── db.js             # MySQL connection pool & keepAlive
│   ├── controllers/
│   │   ├── contactController.js # Contact form submission & duplicate checks
│   │   └── healthController.js  # Service health & DB ping
│   ├── middleware/
│   │   ├── errorHandler.js   # Centralized JSON error handling
│   │   └── rateLimiter.js    # Rate limiting for spam prevention
│   ├── routes/
│   │   ├── contactRoutes.js  # POST /api/contact
│   │   ├── healthRoutes.js   # GET /api/health
│   │   └── index.js          # API route aggregator
│   ├── validators/
│   │   └── contactValidator.js # Input validation & XSS sanitization
│   ├── schema.sql            # MySQL schema for portfolio_db
│   ├── API_DOCUMENTATION.md  # Detailed API specs
│   ├── index.js              # Server entry point with Helmet & CORS
│   ├── package.json
│   ├── .env.example
│   └── .gitignore
│
├── .gitignore                # Root gitignore (protects secrets & builds)
├── package.json              # Root workspace management scripts
└── README.md
```

---

## 2. MySQL Database Setup

### Step 1: Create Database
```sql
CREATE DATABASE IF NOT EXISTS `portfolio_db`
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;
```

### Step 2: Import Schema
Execute `backend/schema.sql` (or import via phpMyAdmin / MySQL Workbench):

```sql
USE `portfolio_db`;

CREATE TABLE IF NOT EXISTS `contact_messages` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(100) NOT NULL,
  `email` VARCHAR(255) NOT NULL,
  `phone` VARCHAR(50) DEFAULT NULL,
  `subject` VARCHAR(200) NOT NULL,
  `message` TEXT DEFAULT NULL,
  `status` ENUM('unread', 'read', 'archived', 'replied') NOT NULL DEFAULT 'unread',
  `ip_address` VARCHAR(45) DEFAULT NULL,
  `user_agent` VARCHAR(255) DEFAULT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_contact_email` (`email`),
  INDEX `idx_contact_status` (`status`),
  INDEX `idx_contact_created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

---

## 3. Quick Start (Local Development)

### 1. Configure Backend Environment
Copy `backend/.env.example` to `backend/.env` and enter your MySQL credentials:
```env
PORT=5000
NODE_ENV=development
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=portfolio_db
FRONTEND_URL=http://localhost:5173
```

### 2. Configure Frontend Environment (Optional)
Copy `frontend/.env.example` to `frontend/.env`:
```env
VITE_API_BASE_URL=http://localhost:5000
```

### 3. Install Dependencies
```bash
# Frontend
npm install --prefix frontend

# Backend
npm install --prefix backend
```

### 4. Run Development Servers
```bash
# Terminal 1: Backend
npm run dev:backend

# Terminal 2: Frontend
npm run dev:frontend
```

---

## 4. API Endpoints

| Method | Endpoint | Description | Rate Limit |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/health` | Service status and MySQL database ping | 100 req / 15 min |
| `POST` | `/api/contact` | Validates, sanitizes, and stores inquiries | 5 submissions / 15 min |

See `backend/API_DOCUMENTATION.md` for full payload schemas and response formats.

---

## 5. Deployment Guide (Hostinger)

### Frontend Deployment
1. Set production API URL: `VITE_API_BASE_URL=https://yourdomain.com`
2. Run build: `npm run build`
3. Upload contents of `frontend/dist/` to Hostinger's `public_html/`.

### Backend Deployment
1. In Hostinger hPanel → Node.js: Create a Node.js application pointing to `backend/index.js`.
2. Configure production environment variables in hPanel.
3. In Hostinger phpMyAdmin: Import `backend/schema.sql` into your Hostinger MySQL database.
