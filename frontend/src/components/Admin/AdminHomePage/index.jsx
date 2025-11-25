import { useNavigate , Navigate} from "react-router-dom";
import Cookies from 'js-cookie'
import "./index.css";

const AdminHomePage = () => {
    const navigate = useNavigate();

    const jwtToken = Cookies.get("recruiter_admin_jwtToken");
    if(!jwtToken) {
        return <Navigate to="/admin/login" />
    }

    const adminLogout = () => {
        Cookies.remove("recruiter_admin_jwtToken");
        navigate('/admin/login')

    }
    
    return (
        <div className="admin-home-page-container">
            <h1>Welcome to Admin Home Page</h1>
            <div className="admin-role-btn">
                <button onClick={() => {navigate('/admin/signup')}} className="adm-role-btn">Signup</button>
                <button onClick={() => {navigate('/admin/login')}} className="adm-role-btn">Login</button>
                <button onClick={adminLogout} className="adm-role-btn">Logout</button>
            </div>
        </div>
    )
}

export default AdminHomePage;