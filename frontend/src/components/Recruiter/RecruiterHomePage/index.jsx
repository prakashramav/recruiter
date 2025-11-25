import { useNavigate , Navigate} from "react-router-dom";
import Cookies from 'js-cookie'
import "./index.css";


const RecruiterHomePage = () => {
    const navigate = useNavigate();
    
    const jwtToken = Cookies.get("recruiter_jwt_token");
      if(!jwtToken) {
        return <Navigate to='/recruiter/login' replace/>
      }

      const recruiterLogout = () => {
        Cookies.remove("recruiter_jwt_token")
        navigate('/recruiter/login')
      }

    return (
        <div className="recruiter-home-container">
            <h1>Welcome to Recruiter Home Page</h1>
            <div className="recruiter-role-btn">
                <button onClick={() => {navigate('/recruiter/signup')}} className="rec-role-btn">Signup</button>
                <button onClick={() => {navigate('/recruiter/login')}} className="rec-role-btn">Login</button>
                <button onClick={recruiterLogout} className="rec-role-btn">Logout</button>
            </div>
        </div>
    )
}

export default RecruiterHomePage;
