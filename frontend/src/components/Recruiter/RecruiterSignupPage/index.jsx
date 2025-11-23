import './index.css'

const RecruiterSignupPage = () => {
  return (
    <div className='recruiter-singup-container'>
      <div className='recruiter-signup-mini-container'>
        <h1>Recruiter Signup Page</h1>
        <div className='input-handler-container'>
          <label htmlFor='Name'>Name</label>
          <input type='text' placeholder='Name' id='name' className='input-field'/>
        </div>
        <div className='input-handler-container'>
          <label htmlFor="email" className='label'>Email</label>
          <input type="email" placeholder='Email' id='email' className='input-field'/>
        </div>
        <div className='input-handler-container'>
          <label htmlFor="password" className='label'>Password</label>
          <input type="password" placeholder='Password' id='password' className='input-field'/>
        </div>
        <div className='input-handler-container'>
          <label htmlFor="companyName" className='label'>Company Name</label>
          <input type="text" placeholder='Company Name' id='companyName' className='input-field'/>
        </div>
        <div className='input-handler-container'>
          <label htmlFor="companyWebsite" className='label'>Company Website</label>
          <input type="text" placeholder='Company Website' id='companyWebsite' className='input-field'/>
        </div>
        <div className='input-handler-container'>
          <label className='label' htmlFor='designation'>designation</label>
          <input className='input-field' placeholder='Designation' id="designation"/>
        </div>
        <button className='button' type='button'>Signup</button>
      </div>
    </div>
  )
}

export default RecruiterSignupPage;

// companyName, companyWebsite, designation