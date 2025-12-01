import {useNavigate } from "react-router-dom";
import RecruiterHeaderPage from '../RecruiterHeaderPage';
import RecruiterNavbarPage from "../RecruiterNavbarPage";
import "./home.css";
import Cookies from "js-cookie";
import { useEffect } from "react";
import axios from "axios";
import { useState } from "react";
import { ThreeDots } from "react-loader-spinner";
import { FaRupeeSign } from "react-icons/fa";
import { FaBriefcase } from "react-icons/fa";
import { FaMapMarkerAlt } from "react-icons/fa";
import { FaBuilding } from "react-icons/fa";
import { BsThreeDotsVertical } from "react-icons/bs";



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
    const timeAgo = (timestamp) => {
      const now = new Date();
      const past = new Date(timestamp);
      const diffMs = now - past;

      const diffSec = Math.floor(diffMs / 1000);
      const diffMin = Math.floor(diffSec / 60);
      const diffHr = Math.floor(diffMin / 60);
      const diffDay = Math.floor(diffHr / 24);

      if (diffSec < 60) return `${diffSec} seconds ago`;
      if (diffMin < 60) return `${diffMin} minutes ago`;
      if (diffHr < 24) return `${diffHr} hours ago`;
      return `${diffDay} days ago`;
  }

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
            <h4>Your Job-list</h4>
            <div className="jobs-list-created-page-container">
                {isLoading ? (
                  <div className="job-list-loader-container"> <ThreeDots color="blue" height={40} width={40} /> </div>
                ) : (jobs && jobs.length > 0 ? (
                  <ul className="recruiter-jobs-list">
                    {jobs.map((job) => (
                      <li key={job._id} className="recruiter-job-item" onClick={() => navigate(`/recruiter/jobs/${job._id}`)}>
                        <div className="job-list-page-container">
                          <h3 className="job-title">{job.title}</h3>
                          <div className="dots-page-container">
                            <BsThreeDotsVertical />
                          </div>
                        </div>
                        <div className="comapny-type-container">
                          <p> <FaBuilding />{job.company}</p>
                          <p><FaMapMarkerAlt />  {job.location}</p>
                        </div>
                        <div className="comapny-type-container">
                          <p><FaBriefcase/> {job.jobType}</p>
                          <p><FaRupeeSign/> {job.stipend}</p>
                        </div>
                        <div>
                          <p>Experience: {job.experienceRequired} years</p>
                        </div>
                        <div className="posted-time-container">
                          <span>Posted: {timeAgo(job.createdAt)}</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="no-jobs-posted-container">
                    <h4>No jobs posted yet.</h4>
                  </div>
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
