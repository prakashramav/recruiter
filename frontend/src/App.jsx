import {Route, Routes } from 'react-router-dom';
import LoginRoleSelection from './components/LoginRoleSelection';

import AdminLoginPage from './components/Admin/AdminLoginPage'
import AdminSignupPage from './components/Admin/AdminSignupPage'

import ApplicantLoginPage from './components/Applicant/ApplicantLoginPage'
import ApplicantSignupPage from './components/Applicant/ApplicantSignupPage'

import RecruiterLoginPage from './components/Recruiter/RecruiterLoginPage'
import RecruiterSignupPage from './components/Recruiter/RecruiterSignupPage'

import AdminHomePage from './components/Admin/AdminHomePage';
import ApplicantHomePage from './components/Applicant/ApplicantHomePage';
import RecruiterHomePage from './components/Recruiter/RecruiterHomePage';
const App = () => {
  return (
    <>
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

      </Routes>
    </>
  )
}

export default App;

