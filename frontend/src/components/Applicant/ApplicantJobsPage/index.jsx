import { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { ThreeDots } from "react-loader-spinner";
import ApplicantHeaderPage from "../ApplicantHeaderPage";
import ApplicantNavbarPage from "../ApplicantNavabrPage";
import "./jobs.css";
import { BsThreeDotsVertical } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
const ApplicantJobsPage = () => {
    const navigate = useNavigate();
  const token = Cookies.get("talentify_applicant_jwtToken");

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [appliedJobs, setAppliedJobs] = useState([]);

  // Fetch All Active Jobs
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await axios.get(
          "https://recruiter-1-gjf3.onrender.com/api/applicants/all-jobs",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const appliedRes = await axios.get(
          "https://recruiter-1-gjf3.onrender.com/api/applicants/my-applications",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setJobs(res.data);
        setAppliedJobs(appliedRes.data.applications.map(app => app.jobId._id));
      } catch (err) {
        console.error("Error fetching jobs:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [token]);

  const convertDate = (dateInput) => {
    const date = new Date(dateInput);
    const now = new Date();

    const seconds = Math.floor((now - date) / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const months = Math.floor(days / 30);
    const years = Math.floor(days / 365);

    if (seconds < 60) return "Just now";
    if (minutes < 60) return `${minutes} min ago`;
    if (hours < 24) return `${hours} hours ago`;
    if (days < 30) return `${days} days ago`;
    if (months < 12) return `${months} months ago`;
    return `${years} years ago`;
  };

  return (
    <>
      <div className="jobs-container">
        <h1 className="jobs-heading">Available Jobs</h1>
        <ul className="jobs-list">


          {loading ? (
            <div className="jobs-loader">
              <ThreeDots color="blue" height={50} width={50} />
            </div>
          ) : jobs.length === 0 ? (
            <h3>No jobs available right now.</h3>
          ) : (
            jobs.map((job) => {
                const isApplied = appliedJobs.includes(job._id);
                return (
                    <li key={job._id} className="job-card" onClick={() => navigate(`/applicant/jobs/${job._id}`)}>
                        <div className="job-card-three">
                            <h3>{job.title}</h3>
                            <BsThreeDotsVertical />
                        </div>
                        <p><strong>Company:</strong> {job.company}</p>
                        <p><strong>Location:</strong> {job.location}</p>
                        <p><strong>Category:</strong> {job.category}</p>
                        <p><strong>Stipend:</strong> {job.stipend}</p>
                        <p><strong>Experience Required:</strong> {job.experienceRequired} years</p>

                        <p><strong>Skills:</strong> {job.skillsRequired.join(", ")}</p>
                        <div className="bottom-container-of-job">
                            {
                                isApplied ? (<span className="span-applied">Already Applied</span>) : "Not Applied" 
                            }
                            <span className="posted-time">
                            Posted: {convertDate(job.createdAt)}
                            </span>
                        </div>
                    </li>
            )})
          )}

        </ul>
      </div>
    </>
  );
};

export default ApplicantJobsPage;
