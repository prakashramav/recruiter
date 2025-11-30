import { useNavigate } from "react-router-dom";
import { CgProfile } from "react-icons/cg";
import Cookies from "js-cookie";
import './index.css'
const AdminHeaderPage = () => {
    const navigate = useNavigate();

    const adminLogoutButton = () => {
        Cookies.remove("talentify_admin_jwtToken");
        navigate('/admin/login');
    }

    return(
        <header className="admin-navbar-page-container">
            <div onClick={() => navigate('/admin')} className="admin-navbar-heading-container">
                <h1 className="admin-navbar-page-heading">
                    Talentify 
                </h1>
            </div>
            <div className="profile-logout-container">
                <div onClick={() => navigate('/admin/profile')} className="admin-profile-icon-container">
                    <CgProfile size={40} />
                </div>
                <div>
                    <button className="admin-logout-btn" onClick={adminLogoutButton}>Logout</button>
                </div>
            </div>
        </header>
    )
}

export default AdminHeaderPage;