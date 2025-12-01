import { useNavigate } from "react-router-dom";
import { CgProfile } from "react-icons/cg";
import Cookies from "js-cookie";
import "./header.css";

const RecruiterHeaderPage = () => {
  const navigate = useNavigate();

  const logout = () => {
    Cookies.remove("talintify_recruiter_jwt_token");
    navigate("/recruiter/login", { replace: true });
  };

  return (
    <header className="recruiter-header">
      <h1 className="header-title" onClick={() => navigate("/recruiter")}>
        Talentify
      </h1>

      <div className="header-actions">
        <CgProfile size={35} className="profile-icon" onClick={() => navigate("/recruiter/profile")} />
        <button className="logout-btn" onClick={logout}>Logout</button>
      </div>
    </header>
  );
};

export default RecruiterHeaderPage;
