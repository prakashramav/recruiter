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
          <button onClick={() => navigate("/login/recruiter")} className="role-btn">
            Recruiter
          </button>
        </div>

        <div>
          <button className="role-btn" onClick={() => navigate("/login/applicant")}>
            Applicant
          </button>
        </div>

        <div>
          <button className="role-btn" onClick={() => navigate("/login/admin")}>
            Admin
          </button>
        </div>

      </div>
    </div>
  );
};

export default LoginRoleSelection;
