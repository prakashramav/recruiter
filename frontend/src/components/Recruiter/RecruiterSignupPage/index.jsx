import { useState } from 'react';
import {Link, useNavigate, Navigate} from 'react-router-dom'
import {ThreeDots} from 'react-loader-spinner'
import Cookies from 'js-cookie'
import './index.css'

const RecruiterSignupPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState('');
  const [nameError, setNameError] = useState(false)
  const [dataError, setDataError] = useState('');
  const [dataMsgError, setDataMsgError] = useState(false);
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState(false)
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState(false)
  const [companyName, setCompanyName] = useState('');
  const [companyNameError, setCompanyNameError] = useState(false)
  const [companyWebsite, setCompanyWebsite] = useState('');
  const [companyWebsiteError, setCompanyWebsiteError] = useState(false)
  const [designation, setDesignation] = useState('');
  const [designationError, setDesignationError] = useState(false)

  const navigate = useNavigate();

  const jwtToken = Cookies.get("talintify_recruiter_jwt_token");
  if(jwtToken) {
    return <Navigate to='/recruiter' replace/>
  }

  const onSuccessFullRegister = () => {
    // navigate('/recruiter/login',{replace:true});
    setIsLoading(false)
  }

  const onFailureRegister = (data_message) => {
    setIsLoading(false);
    setDataMsgError(true);
    setDataError(data_message);


  }

  const onSubmitSignup = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    if(name === ''){
      setNameError(true);
      setIsLoading(false)
    }
    if(email === ''){
      setEmailError(true);
      setIsLoading(false)
    }
    if(password === ''){
      setPasswordError(true)
      setIsLoading(false)
    }
    if(companyName === ''){
      setCompanyNameError(true)
      setIsLoading(false)
    }
    if(companyWebsite === ''){
      setCompanyWebsiteError(true)
      setIsLoading(false)
    }
    if(designation === ""){
      setDesignationError(true);
      setIsLoading(false)
    }
    if(!name || !email || !password || !companyName || !companyWebsite || !designation){
      return;
    }
    const url = "https://recruiter-1-gjf3.onrender.com/api/recruiters/register"
    const userDetails = {name, email,password, companyName,companyWebsite,designation};
    const option = {
      method:"POST",
      headers: {
        "Content-Type" : "application/json"
      },
      body : JSON.stringify(userDetails)
    }
    const response = await fetch(url, option);
    console.log(response)
    const data = await response.json();
    console.log(data);
    if(response.ok === true){
      onSuccessFullRegister();
    }else{
      onFailureRegister(data.message)
    }

    
  }
  return (
    <form className='recruiter-singup-container' onSubmit={onSubmitSignup}>
      <div className='recruiter-signup-mini-container'>
        <h1 className='recruiter-login-heading'>Recruiter Signup Page</h1>
        <div className='input-handler-container'>
          <label htmlFor='name'>Name</label>
          <input type='text' placeholder='Enter Your Name' id='name' className='input-field' onChange={(e) => {setName(e.target.value),setNameError(false)}}/>
          {nameError && <span className='error-message'>*Enter Your Name</span>}
        </div>
        <div className='input-handler-container'>
          <label htmlFor="email" className='label'>Email</label>
          <input type="email" placeholder='Enter Your Email' id='email' className='input-field' onChange={(e) => {setEmail(e.target.value), setEmailError(false)}} />
          {emailError && <span className='error-message'>*Enter Your Mail</span>  }
        </div>
        <div className='input-handler-container'>
          <label htmlFor="password" className='label'>Password</label>
          <input type="password" placeholder='Enter Your Password' id='password' className='input-field' onChange={(e) => {setPassword(e.target.value),setPasswordError(false)}} />
          {passwordError && <span className='error-message'>*Enter Your password</span>}
        </div>
        <div className='input-handler-container'>
          <label htmlFor="companyName" className='label'>Company Name</label>
          <input type="text" placeholder='Company Name' id='companyName' className='input-field' onChange={(e) => {setCompanyName(e.target.value),setCompanyNameError(false)}}/>
          {companyNameError && <span className='error-message'>*Enter Your Company name</span>}
        </div>
        <div className='input-handler-container'>
          <label htmlFor="companyWebsite" className='label'>Company Website</label>
          <input type="text" placeholder='Company Website' id='companyWebsite' className='input-field' onChange={(e) => {setCompanyWebsite(e.target.value),setCompanyWebsiteError(false)}}/>
          {companyWebsiteError && <span className='error-message'>*Enter Your Company Website</span> }
        </div>
        <div className='input-handler-container'>
          <label className='label' htmlFor='designation'>designation</label>
          <input className='input-field' placeholder='Designation' id="designation" onChange={(e) => {setDesignation(e.target.value),setDesignationError(false)}}/>
          {designationError && <span className='error-message'>*Enter Your Designation</span>}
        </div>
        <div className='button-container'>
          {isLoading ? (<ThreeDots height="60" width="60" color="blue" ariaLabel="tail-spin-loading" radius="1" visible={true}/>): (<button className='button' type='submit'>Signup</button>) }
        </div>
        <div className='login-link-container'>
          {dataMsgError && <p className='error-message'>{dataError}</p>}
        </div>
        <div className='login-link-container'>
          <p>Already have an account? <Link to='/recruiter/login' className='login-link'>Login</Link></p>
        </div>
      </div>
    </form>
  )
}

export default RecruiterSignupPage;

// companyName, companyWebsite, designation