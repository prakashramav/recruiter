import { useNavigate } from "react-router-dom";
import { CgProfile } from "react-icons/cg";
import "./index.css";

const RecruiterHeaderPage = () => {
    const navigate = useNavigate();
    return (
        <header className="recruiter-header-page-container">
            <div className="recruiter-navbar-heading-container" onClick={() => navigate('/recruiter')}>
                <h1 className="recruiter-header-heading">Talentify</h1>
            </div>
            <div className="recruiter-header-page-progile-logout-container">
                <div className="recruiter-profile-icon-container" onClick={() => navigate('/recruiter/profile')}>
                    <CgProfile size={40} />
                </div>
                <div className="recruiter-logout-btn-container">
                    <button className="recruiter-logout-btn">Logout</button>
                </div>
            </div>
        </header>
    )
}


export default RecruiterHeaderPage;