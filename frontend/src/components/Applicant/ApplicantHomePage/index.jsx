import { useNavigate, Navigate } from "react-router-dom";
import Cookies from 'js-cookie'
import "./index.css";

const ApplicantHomePage = () => {
    const navigate = useNavigate();
    const jwtToken = Cookies.get("recruiter_applicant_jwtToken")
    if(!jwtToken){
        return <Navigate to="/applicant/login" />
    }
    
    const applicantLogout = () => {
        Cookies.remove("recruiter_applicant_jwtToken")
        navigate('/applicant/login');
    }

    return (
        <div className="applicant-home-container">
            <h1>Welcome to Applicant Home Page</h1>
            <div className="applicant-role-btn">
                <button onClick={() => {navigate('/applicant/signup')}} className="app-role-btn">Signup</button>
                <button onClick={() => {navigate('/applicant/login')}} className="app-role-btn">Login</button>
                <button onClick={applicantLogout} className="app-role-btn">Logout</button>
            </div>
        </div>

    )
}

export default ApplicantHomePage;