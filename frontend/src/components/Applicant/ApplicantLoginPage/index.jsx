import { Link, useNavigate, Navigate} from 'react-router-dom';
import { useState } from 'react';
import Cookies from 'js-cookie'
import { ThreeDots } from 'react-loader-spinner';
import './index.css'

const ApplicantLoginPage = () => {
  const [email, setMail] = useState('');
  const [password, setPassword] = useState('');
  const [mailError, setMailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [dataMsg, setDataMsg] = useState('')
  const [dataError, setDataError] = useState(false);
  const navigate = useNavigate()

  const jwtToken = Cookies.get("talentify_applicant_jwtToken")
  if(jwtToken){
    return <Navigate to="/applicant" />
  }

  const onApplicantLoginSuccess = (jwtToken) => {
    Cookies.set("talentify_applicant_jwtToken", jwtToken, {expires : 3})
    navigate('/applicant')
    setIsLoading(false);
  }

  const onApplicantLoginFailure = (data_msg) => {
    setDataMsg(data_msg);
    setDataError(true);
    setIsLoading(false)
  }

  const onSubmitApplicantSignUp = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if(email === ""){
      setMailError(true);
      setIsLoading(false)
    }
    if(password === ""){
      setPasswordError(true);
      setIsLoading(false)
    }
    if(email === "" || password === ""){
      return;
    }
    const userDetails = {email, password};
    const url = "https://recruiter-7jmo.onrender.com/api/applicants/login"
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
      onApplicantLoginSuccess(data.token);
    }
    else{
      onApplicantLoginFailure(data.msg);
    }
  }

  return (
    <form className='applicant-login-page-container' onSubmit={onSubmitApplicantSignUp}>
      <div className='applicant-mini-login-page-container'>
        <h1 className='applicant-login-heading'>Applicant  Login Page</h1>
        <div className='input-handler-container'>
          <label htmlFor='email'>Email</label>
          <input className='input-field' placeholder='Enter Your Email' id='email' type='email' onChange={(e) => {setMail(e.target.value),setMailError(false)}}/>
          {mailError && <span className='error-message'>*Required Field</span>}
        </div>
        <div className='input-handler-container'>
          <label htmlFor='password'>Password</label>
          <input className='input-field' placeholder='Enter Your Password' id='password' type='password' onChange={(e) => {setPassword(e.target.value),setPasswordError(false)}}/>
          {passwordError && <span className='error-message'>*Required Field</span>}
        </div>
        <div className='applicant-login-page-button-container'>
          {isLoading ? (<ThreeDots height={60} width={60} ariaLabel="tail-spin-loading" radius="1" visible={true}/>):(<button className='applicant-login-button' type='submit'>Login</button>)}
        </div>
        <div className='data-error-msg'>
          {dataError && <p className='error-message'>{dataMsg}</p>}
        </div>
        <div className='applicant-login-link-to-login'>
          <p>Don't have an Account? <Link to="/applicant/signup">Signup</Link></p>
        </div>
      </div>
    </form>
  )
}
export default ApplicantLoginPage;

