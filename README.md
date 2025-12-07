# 🧑‍💼 Talentify – Recruitment Portal (ATS)
A full-stack Applicant Tracking System built with **React**, **Node.js**, and **Express**, designed to simplify job posting, applicant tracking, and resume management for recruiters and applicants.

---

##  Features

###  Core Features
- Job CRUD (Create, Read, Update, Delete)
- Application CRUD (Applicants can apply, recruiters can manage)
- Resume Upload (PDF → Base64 → Stored on backend)
- Resume Preview using react-pdf
- Job & Application Filters
- Search Functionality
- Pagination for long lists
- Fully functional REST API (Node.js + Express)
- Error handling & server-side validation

###  Advanced Features (Future Scope)
- Resume parsing with NLP
- Dashboard with charts for recruiter insights
- Role-based access (Admin, Recruiter, Applicant)
- Cloud resume storage (AWS S3 / Firebase)
- Application status workflow (New → Reviewed → Shortlisted)

---

##  Tech Stack

### **Frontend**
- React JS
- React Router
- React Query
- React Hook Form + Zod
- Axios
- react-pdf-viewer
- TailwindCSS / Custom CSS

### **Backend**
- Node.js
- Express.js
- Multer (optional)
- JSON Web Token (optional)
- CORS
- Nodemon

### **Testing**
- Jest + React Testing Library
- Supertest for API testing

---

##  Folder Structure

```
recruiter/
│
├── backend/
│ ├── controllers/
│ ├── routes/
│ ├── middlewares/
│ ├── uploads/
│ ├── server.js
│ └── package.json
│
└── frontend/
├── src/
│ ├── components/
│ ├── pages/
│ ├── hooks/
│ ├── api/
│ ├── context/
│ ├── utils/
│ └── App.jsx
└── package.json
```

---

##  System Flow (High-Level)

1. User submits job/application form
2. Form validated using **React Hook Form + Zod**
3. React Query sends API request
4. Express backend validates & processes data
5. PDF resumes converted to Base64 and stored
6. Response returned → UI updates automatically

---

## 🛠️ Installation & Setup

### **1️ Clone the Repository**
```bash
git clone https://github.com/prakashramav/recruiter.git
cd recruiter
```

### Backend Setup
```
cd backend
npm install
npm start
```
### Frontend Setup
```
cd frontend
npm install
npm run dev
```
### API Endpoints (Sample)
###  Jobs API

| Method | Endpoint     | Description                              |
|--------|--------------|------------------------------------------|
| GET    | /jobs        | Get all jobs (with filters + pagination) |
| POST   | /jobs        | Create job                               |
| PUT    | /jobs/:id    | Update job                               |
| DELETE | /jobs/:id    | Delete job                               |

### 📝 Applications API

| Method | Endpoint             | Description                          |
|--------|-----------------------|--------------------------------------|
| POST   | /applications        | Submit application + resume          |
| GET    | /applications        | List applications                    |
| PUT    | /applications/:id    | Update application                   |
| DELETE | /applications/:id    | Delete application                   |



### Challenges & Solutions
### Resume Upload & Preview

PDFs converted to Base64 using FileReader

Stored on backend for previewing

Rendered using react-pdf-viewer

### Pagination + Filters

Custom backend pagination logic

React Query for server-state caching


##  Project Timeline

| Week   | Deliverables                                      |
|--------|---------------------------------------------------|
| Week 1 | Setup, API design, Job list + pagination          |
| Week 2 | Job & Application CRUD (Frontend + Backend)       |
| Week 3 | Filters, Resume Upload & Preview                  |
| Week 4 | Testing, UI cleanup, README, final demo           |


### Developer
Prakash Ramavath (Arjun)
Full-stack Developer | React • Node.js • Express
GitHub: https://github.com/prakashramav

### Contribution Guide
Fork the repository
Create your feature branch
Commit your changes
Open a pull request

### License
This project is licensed under the MIT License.


