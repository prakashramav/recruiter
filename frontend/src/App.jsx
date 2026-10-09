import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { RootLayout } from './components/layout/RootLayout';
import { ProtectedRoute, RoleRoute } from './components/layout/ProtectedRoute';
import { 
  Home, Login, Register, Jobs, MyApplications, 
  Dashboard, RecruiterJobs, ManageJob, JobDetails
} from './pages';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<RootLayout />}>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/jobs/:id" element={<JobDetails />} />

          {/* Applicant Protected Routes */}
          <Route element={<RoleRoute allowedRoles={['applicant']} />}>
            <Route path="/my-applications" element={<MyApplications />} />
          </Route>

          {/* Recruiter Protected Routes */}
          <Route element={<RoleRoute allowedRoles={['recruiter']} />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/recruiter/jobs" element={<RecruiterJobs />} />
            <Route path="/recruiter/jobs/:id" element={<ManageJob />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
