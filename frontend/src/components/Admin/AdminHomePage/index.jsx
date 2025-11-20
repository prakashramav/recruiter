import { useNavigate } from "react-router-dom";

import "./index.css";

const AdminHomePage = () => {
    const navigate = useNavigate();
    return (
        <div className="admin-home-page-container">
            <h1>Welcome to Admin Home Page</h1>
            <div className="admin-role-btn">
                <button onClick={() => {navigate('/admin/signup')}} className="adm-role-btn">Signup</button>
                <button onClick={() => {navigate('/admin/login')}} className="adm-role-btn">Login</button>
            </div>
        </div>
    )
}

export default AdminHomePage;