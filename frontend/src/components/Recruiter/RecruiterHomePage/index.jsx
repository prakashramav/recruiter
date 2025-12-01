import { useNavigate } from "react-router-dom";
import RecruiterHeaderPage from '../RecruiterHeaderPage';
import RecruiterNavbarPage from "../RecruiterNavbarPage";
import "./index.css";

const RecruiterHomePage = () => {
  const navigate = useNavigate();

  return (
    <>
      <RecruiterHeaderPage />

      
      <button
        className="recruiter-post-job-fixed-btn"
        onClick={() => navigate('/recruiter/create-jobs')}
      >
        Post a Job
      </button>

      <div className="recruiter-home-container">
        <RecruiterNavbarPage />

        <div className="recruiter-dashboard-page-container">
          <div className="recruiter-front-page-container">
            <h4>Recruiter Dashboard</h4>
          </div>
        </div>
      </div>
    </>
  );
};

export default RecruiterHomePage;
