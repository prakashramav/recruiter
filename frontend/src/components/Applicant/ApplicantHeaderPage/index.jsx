import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { CgProfile } from "react-icons/cg";
import "./index.css";

const ApplicantHeaderPage = () => {
    const navigate = useNavigate();
    const applicantLogoutButton = () => {
        Cookies.remove("talentify_applicant_jwtToken");
        navigate('/applicant/login');
    }
    return (
        <header className="recruiter-header">
            <div className="applicant-navbar-heading-container" onClick={() => navigate('/applicant')}>
                <h1 className="header-title">
                    Talentify
                </h1>
            </div>
            <div className="profile-icon-container">
                <div className="applicant-progile-icon-container" onClick={() => navigate('/applicant/profile')}>
                    <CgProfile size={40} />
                </div>
                <div className="applicant-logout-btn-container">
                    <button className="logout-btn" onClick={applicantLogoutButton}>Logout</button>
                </div>
            </div>
        </header>
    )
}

export default ApplicantHeaderPage;