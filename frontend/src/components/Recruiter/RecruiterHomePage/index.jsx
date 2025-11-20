import { useNavigate } from "react-router-dom";
import "./index.css";


const RecruiterHomePage = () => {
    const navigate = useNavigate();
    return (
        <div className="recruiter-home-container">
            <h1>Welcome to Recruiter Home Page</h1>
            <div className="recruiter-role-btn">
                <button onClick={() => {navigate('/recruiter/signup')}} className="rec-role-btn">Signup</button>
                <button onClick={() => {navigate('/recruiter/login')}} className="rec-role-btn">Login</button>
            </div>
        </div>
    )
}

export default RecruiterHomePage;
