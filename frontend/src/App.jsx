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
            <Route path="/recruiter" element={<RecruiterHomePage/>} />
            <Route path='/recruiter/login' element={<RecruiterLoginPage/>} />
            <Route path='/recruiter/signup' element={<RecruiterSignupPage/>} />


          {/*Applicant Routes*/}
            <Route path="/applicant" element={<ApplicantHomePage/>} />
            <Route path='/applicant/login' element={<ApplicantLoginPage/>} />
            <Route path='/applicant/signup' element={<ApplicantSignupPage/>} />


          {/*Admin Routes*/}
            <Route path="/admin" element={<AdminHomePage/>} />
            <Route path='/admin/login' element={<AdminLoginPage/>} />
            <Route path='/admin/signup' element={<AdminSignupPage/>} />

            <Route path="/notfound" element={<NotFound /> } />

            <Route path="*" element={<Navigate to="/notfound" replace />} />

        </Routes>
      </Suspense>
    </>
  )
}

export default App;

