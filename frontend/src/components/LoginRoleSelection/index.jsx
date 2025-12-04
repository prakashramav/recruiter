import React from "react";
import { useNavigate } from "react-router-dom";
import "./index.css";

const LoginRoleSelection = () => {
  const navigate = useNavigate();

  return (
    <div className="login-type-container">
      <h1 className="role-title">Select Login Type</h1>
      <div className="indise-login-type-container">
        <div>
          <button onClick={() => navigate("/recruiter")} className="role-btn">
            <span>Recruiter</span>
          </button>
        </div>

        <div>
          <button className="role-btn" onClick={() => navigate("/applicant")}>
            <span>Applicant</span>
          </button>
        </div>

        <div>
          <button className="role-btn" onClick={() => navigate("/admin")}>
            <span>Admin</span>
          </button>
        </div>

      </div>
    </div>
  );
};

export default LoginRoleSelection;
