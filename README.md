# Talentify 2.0 - Applicant Tracking System

![Talentify Mockup](https://via.placeholder.com/1200x600.png?text=Talentify+Dashboard+Mockup)

Talentify is a modern, production-ready Recruitment Portal and Applicant Tracking System (ATS). It connects job seekers with recruiters through a highly polished, responsive, and intuitive interface.

## 🚀 Features

- **For Applicants:**
  - Browse and search thousands of jobs with advanced filtering.
  - Apply instantly by uploading a PDF resume.
  - Built-in ATS Score checking to instantly match your resume against the job description.
  - Live preview of your resume before submitting (powered by `react-pdf`).
  - Track application statuses in real-time and join scheduled interviews.

- **For Recruiters:**
  - Create, manage, and edit job postings (Publish/Close).
  - Interactive dashboard with real-time aggregated metrics (Total Applications, Shortlisted, Rejected).
  - Review candidate applications and securely download PDF resumes.
  - View AI-driven ATS Match Scores for every applicant.
  - Schedule and manage interview times, and track attendance with 'No Show' tracking.
  - Move candidates through pipeline stages (New → Reviewed → Shortlisted → Rejected → No Show).

- **Architecture & Security:**
  - Role-based Access Control (RBAC) separating `applicant` and `recruiter`.
  - Secure JWT authentication with strict Zod payload validation on both Client and Server.
  - Disk-based file uploads using Multer (No heavy Base64 strings in the DB).
  - Centralized Error Handling in Express.

## 🛠 Tech Stack

**Frontend:**
- React 18 (Vite)
- React Router v6
- TanStack React Query (Server State)
- Tailwind CSS & Framer Motion (Styling & Animations)
- React Hook Form + Zod (Form Validation)
- Axios (API Layer)
- React-PDF (Resume Preview)

**Backend:**
- Node.js (ES Modules)
- Express.js
- MongoDB & Mongoose
- Multer (File Uploads)
- JWT (JSON Web Tokens)
- Bcryptjs (Password Hashing)
- Helmet, CORS, Express Rate Limit (Security)

## 📂 Folder Structure

```
.
├── backend/
│   ├── src/
│   │   ├── config/          # DB config
│   │   ├── controllers/     # Route handlers
│   │   ├── middlewares/     # Auth, Errors, Multer, Validation
│   │   ├── models/          # Mongoose Schemas
│   │   ├── routes/          # Express Routers
│   │   ├── services/        # Business Logic & DB queries
│   │   ├── utils/           # AppError, Helpers
│   │   └── validators/      # Zod Schemas for backend
│   └── uploads/             # Statically served PDF resumes
│
└── frontend/
    ├── src/
    │   ├── api/             # Axios instance & interceptors
    │   ├── components/      # Reusable UI components (Tailwind base)
    │   ├── context/         # React Context (Auth)
    │   ├── features/        # Feature-based slices (Auth, Jobs, Applications)
    │   ├── hooks/           # Custom React Query Hooks
    │   ├── pages/           # Route-level components
    │   └── utils/           # Tailwind class merger (cn)
```

## 💻 Setup & Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/talentify.git
   cd talentify
   ```

2. **Backend Setup:**
   ```bash
   cd backend
   npm install
   cp .env.example .env
   # Ensure MongoDB is running and update MONGO_URI in .env
   npm run dev
   ```

3. **Frontend Setup:**
   ```bash
   cd frontend
   npm install
   # Default Vite dev server runs on port 5173
   npm run dev
   ```

## 📖 API Documentation

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/api/v1/auth/register` | Register a new user | Public |
| POST | `/api/v1/auth/login` | Login user | Public |
| GET | `/api/v1/jobs` | Get all jobs (with filters) | Public |
| GET | `/api/v1/jobs/:id` | Get job by ID | Public |
| POST | `/api/v1/jobs` | Create a new job | Recruiter |
| POST | `/api/v1/jobs/:jobId/applications/check-ats` | Check ATS match score | Applicant |
| POST | `/api/v1/jobs/:jobId/applications` | Apply for a job | Applicant |
| GET | `/api/v1/applications/me` | Get my applications | Applicant |
| GET | `/api/v1/jobs/:jobId/applications` | Get applicants for a job | Recruiter |
| PATCH| `/api/v1/applications/:id/status`| Update app status | Recruiter |
| GET | `/api/v1/applications/stats` | Recruiter Dashboard stats | Recruiter |

## 🧪 Running Tests

Both frontend and backend are set up with Jest testing environments.

- **Backend:** `cd backend && npm test`
- **Frontend:** `cd frontend && npm test`

---
*Built with clean architecture principles for scale.*
