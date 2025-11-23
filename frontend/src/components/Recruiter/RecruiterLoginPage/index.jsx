import './index.css'

const RecruiterLoginPage = () => {
  return (
    <div className='recruiter-login-page-container'>
        <div className='recruiter-mini-container'>
            <h1>Recruiter Login Page</h1>
          <div className='input-handler-container'>
            <label htmlFor="email" className='label'>Email</label>
            <input type="email" placeholder='Email' id='email' className='input-field'/>
          </div>
          <div className='input-handler-container'>
            <label htmlFor="password" className='label'>Password</label>
            <input type="password" placeholder='Password' id='password' className='input-field'/>
          </div>
            <button className='button' type='button'>Login</button>
          </div>
    </div>
  )
}

export default RecruiterLoginPage;
