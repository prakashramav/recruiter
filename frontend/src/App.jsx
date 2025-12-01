import {Route, Routes, Navigate } from 'react-router-dom';
import React, {Suspense, lazy} from 'react';

// import LoginRoleSelection from './components/LoginRoleSelection';
const LoginRoleSelection = lazy(() => import('./components/LoginRoleSelection'));

const AdminLoginPage = lazy(() => import ('./components/Admin/AdminLoginPage'));
const AdminSignupPage = lazy(() => import ('./components/Admin/AdminSignupPage'));

const ApplicantLoginPage = lazy(() => import ('./components/Applicant/ApplicantLoginPage'));
const ApplicantSignupPage = lazy(() => import ('./components/Applicant/ApplicantSignupPage'));

const RecruiterLoginPage = lazy(() => import('./components/Recruiter/RecruiterLoginPage'));
const RecruiterSignupPage = lazy(() => import('./components/Recruiter/RecruiterSignupPage'));

const AdminHomePage = lazy(() => import ('./components/Admin/AdminHomePage'));
const ApplicantHomePage = lazy(() => import ('./components/Applicant/ApplicantHomePage'));
const RecruiterHomePage = lazy(() => import ('./components/Recruiter/RecruiterHomePage'));
const NotFound = lazy(() => import ('./components/NotFound/Index'));

const AdminProtectedRoute = lazy(() => import ('./components/Admin/AdminProtectedRoute'));
const ApplicantProtectedRoute = lazy(() => import ('./components/Applicant/ApplicantProtectedRoute'));
const RecruiterProtectedRoute = lazy(() => import ('./components/Recruiter/RecruiterProtectedRoute'));

const AdminProfilePage = lazy(() => import ('./components/Admin/AdminProfilePage'));
const ApplicantProfilePage = lazy(() => import ('./components/Applicant/ApplicantProfilePage'));
const RecruiterProfilePage = lazy(() => import ('./components/Recruiter/RecruiterProfilePage'));


const RecruiterApplicantPage = lazy(() => import('./components/Recruiter/RecruiterApplicantPage'))
const RecruiterCreateJobPage = lazy(() => import('./components/Recruiter/RecruiterCreateJobPage'));


const RecruiterJobId = lazy(() => import('./components/Recruiter/RecruiterJobId'));

const RecruiterUpdateJob = lazy(() => import('./components/Recruiter/RecruiterUpdateJob'));
const RecruiterInterviewSchedule = lazy(() => import('./components/Recruiter/RecruiterInterviewSchedule'))
import { ThreeDots } from 'react-loader-spinner';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js'; 

import './App.css'

const App = () => {
  return (
    <>
      <Suspense fallback={<div className='lazy-loading-page'><ThreeDots color='green'/></div>}>
        <Routes>
          <Route path="/" element={<LoginRoleSelection />} />


          {/*Recruiter Routes*/}
            <Route path='/recruiter/login' element={<RecruiterLoginPage/>} />
            <Route path='/recruiter/signup' element={<RecruiterSignupPage/>} />
            <Route path="/recruiter" element={<RecruiterProtectedRoute><RecruiterHomePage/> </RecruiterProtectedRoute> } />
            <Route path="/recruiter/profile" element={ <RecruiterProtectedRoute> <RecruiterProfilePage/> </RecruiterProtectedRoute>} />
            <Route path='/recruiter/create-jobs' element={ <RecruiterProtectedRoute> <RecruiterCreateJobPage/> </RecruiterProtectedRoute>} />
            <Route path='/recruiter/applicants' element={ <RecruiterProtectedRoute> <RecruiterApplicantPage/> </RecruiterProtectedRoute>} />
            <Route path='/recruiter/jobs/:jobId' element={ <RecruiterProtectedRoute> <RecruiterJobId/> </RecruiterProtectedRoute>} />
            <Route path='/recruiter/updateJob/:jobId' element={ <RecruiterProtectedRoute> <RecruiterUpdateJob/> </RecruiterProtectedRoute>} />
            <Route path='/recruiter/interview' element={<RecruiterProtectedRoute><RecruiterInterviewSchedule /></RecruiterProtectedRoute>} />

          {/*Applicant Routes*/}
            
            <Route path='/applicant/login' element={<ApplicantLoginPage/>} />
            <Route path='/applicant/signup' element={<ApplicantSignupPage/>} />
            <Route path="/applicant" element={ <ApplicantProtectedRoute> <ApplicantHomePage/> </ApplicantProtectedRoute>} />
            <Route path="/applicant/profile" element={ <ApplicantProtectedRoute> <ApplicantProfilePage/> </ApplicantProtectedRoute>} />

          {/*Admin Routes*/}
            <Route path='/admin/login' element={<AdminLoginPage/>} />
            <Route path='/admin/signup' element={<AdminSignupPage/>} />
            <Route path="/admin" element={ <AdminProtectedRoute> <AdminHomePage/> </AdminProtectedRoute>} />
            <Route path="/admin/profile" element={ <AdminProtectedRoute> <AdminProfilePage/> </AdminProtectedRoute>} />

            <Route path="/notfound" element={<NotFound /> } />

            <Route path="*" element={<Navigate to="/notfound" replace />} />

        </Routes>
      </Suspense>
    </>
  )
}

export default App;

