import { Link, useNavigate, Navigate} from 'react-router-dom';
import { useState } from 'react';
import Cookies from 'js-cookie'
import { ThreeDots } from 'react-loader-spinner';
import './index.css'

const ApplicantSignupPage = () => {
  const [name, setName] = useState('');
  const [email, setMail] = useState('');
  const [password, setPassword] = useState('');
  const [nameError, setNameError] = useState(false);
  const [mailError, setMailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [dataMsg, setDataMsg] = useState('')
  const [dataError, setDataError] = useState(false);
  const navigate = useNavigate()

  const jwtToken = Cookies.get("recruiter_admin_jwtToken")
  if(jwtToken){
    return <Navigate to="/applicant" />
  }
  
  const onApplicantSignupSuccess = () => {
    navigate('/applicant/login')
    setIsLoading(false);
  }

  const onApplicantSignupFailure = (data_msg) => {
    setDataMsg(data_msg);
    setDataError(true);
    setIsLoading(false)
  }

  const onSubmitApplicantSignUp = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    if(name === ""){
      setNameError(true);
      setIsLoading(false)
    }
    if(email === ""){
      setMailError(true);
      setIsLoading(false)
    }
    if(password === ""){
      setPasswordError(true);
      setIsLoading(false)
    }
    if(name === "" || email === "" || password === ""){
      return;
    }
    const userDetails = {name, email, password};
    const url = "https://recruiter-7jmo.onrender.com/api/applicants/register"
    const option = {
      method : "POST",
      headers : {
        "Content-Type": "application/json"
      },
      body : JSON.stringify(userDetails)
    }
    const response = await fetch(url, option);
    console.log(response);
    const data = await response.json();
    console.log(data);
    if(response.ok === true){
      onApplicantSignupSuccess();
    }
    else{
      onApplicantSignupFailure(data.msg);
    }
  }

  return (
    <form className='admin-singup-page-container' onSubmit={onSubmitApplicantSignUp}>
      <div className='admin-mini-signup-page-container'>
        <h1>Applicant Signup Page</h1>
        <div className='input-handler-container'>
          <label htmlFor='name' className='label'>Name</label>
          <input className='input-field' placeholder='Enter Your Name' id='name' type='text' onChange={(e) => {setName(e.target.value),setNameError(false)}}/>
          {nameError && <span className='admin-error-msg'>*Required Field</span>}
        </div>
        <div className='input-handler-container'>
          <label htmlFor='email'>Email</label>
          <input className='input-field' placeholder='Enter Your Email' id='email' type='email' onChange={(e) => {setMail(e.target.value),setMailError(false)}}/>
          {mailError && <span className='admin-error-msg'>*Required Field</span>}
        </div>
        <div className='input-handler-container'>
          <label htmlFor='password'>Password</label>
          <input className='input-field' placeholder='Enter Your Password' id='password' type='password' onChange={(e) => {setPassword(e.target.value),setPasswordError(false)}}/>
          {passwordError && <span className='admin-error-msg'>*Required Field</span>}
        </div>
        <div className='admin-signup-page-button-container'>
          {isLoading ? (<ThreeDots height={60} width={60} ariaLabel="tail-spin-loading" radius="1" visible={true}/>):(<button className='admin-signup-button' type='submit'>signup</button>)}
        </div>
        <div className='data-error-msg'>
          {dataError && <p className='error-msg'>{dataMsg}</p>}
        </div>
        <div className='admin-sign-link-to-login'>
          <p>Already have an Account? <Link to="/applicant/login">Login</Link></p>
        </div>
      </div>
    </form>
  )
}

export default ApplicantSignupPage;

