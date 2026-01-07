# Enterprise User Management System

A production-grade full-stack starter using FastAPI, React (Vite), and MySQL.

## Features
- **FastAPI Backend**: Async SQLAlchemy 2.0, Repository Pattern, Argon2 Hashing, JWT rotation.
- **React Frontend**: Premium Glassmorphism UI, Axios Interceptors, Auth Context.
- **DevOps**: Docker, Docker Compose, GitHub Actions CI.

## Quick Start (Local)

### 1. Backend
```bash
cd backend
pip install -r requirements.txt
# Set .env
alembic upgrade head
uvicorn backend.app.main:app --reload
```

### 2. Frontend
```bash
cd frontend
npm install
npm run dev
```

## Quick Start (Docker)
```bash
docker-compose up --build
```

For detailed architecture and setup, see [walkthrough.md](file:///C:/Users/abuza/.gemini/antigravity/brain/702a1a34-dd30-457d-bba2-4d4e8000af56/walkthrough.md).
