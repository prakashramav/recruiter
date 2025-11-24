import { useState } from 'react';
import { Link , useNavigate, Navigate} from 'react-router-dom';
import {ThreeDots} from 'react-loader-spinner';
import Cookies from 'js-cookie'
import './index.css'


const RecruiterLoginPage = () => {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState(false);
  const [password, setPassword] = useState('');
  const [passError, setPassError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const navigate = useNavigate();

  const jwtToken = Cookies.get("recruiter_jwt_token");
  if(jwtToken) {
    return <Navigate to='/recruiter/' replace/>
  }
  const onSuccesLogin = (jwtToken) => {
    Cookies.set("recruiter_jwt_token", jwtToken, {expires: 3})
    navigate('/recruiter', {replace:true});
    setLoading(false);
  }

  const onFailureOfLogin = (data_msg) => {
    setLoading(false);
    setData(true);
    setErrorMsg(data_msg);
  }

  const loginPageSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    if(email === ''){
      setEmailError(true);
      setLoading(false);
    }
    if(password === ''){
      setPassError(true);
      setLoading(false);
    }

    if(!email || !password){
      // setError('Please fill in all fields');
      // console.log('Error:', error);
      setEmailError(!email);
      setPassError(!password);
      setLoading(false);
     return 
    }
    
    const apiUrl = 'https://recruiter-7jmo.onrender.com/api/recruiters/login'

    const userDetails = {email, password};

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userDetails),
    };
    const response = await fetch(apiUrl, options);
    console.log(response);
    const data = await response.json();
    console.log(data);
    if(response.ok === true){
      onSuccesLogin(data.token);
      console.log(data.token);
    }else{
      onFailureOfLogin(data.message);
    }

  }

  return (
    <form className='recruiter-login-page-container' onSubmit={loginPageSubmit}>
        <div className='recruiter-mini-container'>
            <h1>Recruiter Login Page</h1>
          <div className='input-handler-container'>
            <label htmlFor="email" className='label'>Email</label>
            <input type="email" placeholder='Enter your Email' id='email' className='input-field' onChange={(e)=>{setEmail(e.target.value),setEmailError(false)}}/>
            {emailError && <span className='error-message'>*Email is required</span>}
          </div>
          <div className='input-handler-container'>
            <label htmlFor="password" className='label'>Password</label>
            <input type="password" placeholder='Enter your Password' id='password' className='input-field' onChange={(e)=>{setPassword(e.target.value),setPassError(false)}}/>
            {passError && <span className='error-message'>*Password is required</span>}
          </div>
          <div className='button-container'>
            {loading ? (<ThreeDots height="60" width="60"color="blue" ariaLabel="tail-spin-loading" radius="1" visible={true}/>) :(<button className='button' type='submit'>Login</button>)}
          </div>
          <div className='error-message-container'>
            {data && <span className='error-message'>{errorMsg}</span>}
          </div>
          <div >
            {data && <p className='error-message'>{errorMsg}</p>}
          </div>
          <div className='signup-link-container'>
            <p>I don't have an Account? <Link to="/recruiter/signup">singup</Link></p>
          </div>
        </div>
    </form>
  )
}

export default RecruiterLoginPage;
