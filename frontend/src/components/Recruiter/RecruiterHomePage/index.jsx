import {useNavigate } from "react-router-dom";
import RecruiterHeaderPage from '../RecruiterHeaderPage';
import RecruiterNavbarPage from "../RecruiterNavbarPage";
import "./index.css";
import Cookies from "js-cookie";
import { useEffect } from "react";
import axios from "axios";
import { useState } from "react";
import { ThreeDots } from "react-loader-spinner";

const RecruiterHomePage = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [jobs, setJobs] = useState();

  useEffect(() => {
     const fetchData = async () => {
       // You can add any data fetching logic here if needed in the future
       const jwtToken = Cookies.get("talintify_recruiter_jwt_token");
       const response = await axios.get('https://recruiter-1-gjf3.onrender.com/api/recruiters/jobs', {
         headers: {
           Authorization: `Bearer ${jwtToken}`,
          },
        });
        // console.log(response.data)
        const data = response.data;
        setJobs(data);
        console.log(data);
        setIsLoading(false);
     }
      fetchData();
  },[]);

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
            <div className="jobs-list-created-page-container">
                {isLoading ? (
                  <ThreeDots color="blue" height={30} width={30} />
                ) : (jobs && jobs.length > 0 ? (
                  <ul className="recruiter-jobs-list">
                    {jobs.map((job) => (
                      <li key={job._id} className="recruiter-job-item">
                        <h3>{job.title}</h3>
                        <p><strong>Company:</strong> {job.company}</p>
                        <p><strong>Location:</strong> {job.location}</p>
                        <p><strong>Type:</strong> {job.jobType}</p>
                        <p><strong>Category:</strong> {job.category}</p>
                        <p><strong>Stipend:</strong> {job.stipend}</p>
                        <p><strong>Experience Required:</strong> {job.experienceRequired} years</p>
                        <p><strong>Skills Required:</strong> {job.skillsRequired.join(", ")}</p>
                        <p><strong>Description:</strong> {job.description}</p>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No jobs posted yet.</p>
                ))}
              </div>
          </div>
          <div>
            
          </div>
        </div>
      </div>
    </>
  );
};

export default RecruiterHomePage;
