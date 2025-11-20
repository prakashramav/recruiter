import { useNavigate } from "react-router-dom";
import "./index.css";

const ApplicantHomePage = () => {
    const navigate = useNavigate();
    return (
        <div className="applicant-home-container">
            <h1>Welcome to Applicant Home Page</h1>
            <div className="applicant-role-btn">
                <button onClick={() => {navigate('/applicant/signup')}} className="app-role-btn">Signup</button>
                <button onClick={() => {navigate('/applicant/login')}} className="app-role-btn">Login</button>
            </div>
        </div>

    )
}

export default ApplicantHomePage;