import ApplicantHeaderPage from "../ApplicantHeaderPage";
import ApplicantNavbarPage from "../ApplicantNavabrPage";
import { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useParams } from "react-router-dom";
import { ThreeDots } from "react-loader-spinner";
import "./index.css";

const ApplcantJobDetails = () => {
  const { jobId } = useParams();
  const token = Cookies.get("talentify_applicant_jwtToken");

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applied, setApplied] = useState(false);
  const [buttonLoading, setButtonLoading] = useState(false);

  useEffect(() => {
    setJob(null);
    setLoading(true);

    const fetchJobDetails = async () => {
      try {
        const jobRes = await axios.get(
          `https://recruiter-1-gjf3.onrender.com/api/applicants/job/${jobId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setJob(jobRes.data);
      } catch (err) {
        console.error("Error fetching job:", err);
      }
    };

    const checkIfApplied = async () => {
      try {
        const res = await axios.get(
          "https://recruiter-1-gjf3.onrender.com/api/applicants/my-applications",
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const hasApplied = res.data.applications.some(
          (app) => app.jobId?._id === jobId
        );
        setApplied(hasApplied);
      } catch (err) {
        console.error("Error checking application:", err);
      }
    };

    // RUN BOTH THEN STOP LOADING
    Promise.all([fetchJobDetails(), checkIfApplied()])
      .then(() => setLoading(false));

  }, [jobId, token]);

  const handleApplyJob = async () => {
    try {
      setButtonLoading(true);

      await axios.post(
        `https://recruiter-1-gjf3.onrender.com/api/applicants/apply-job/${jobId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("🎉 Job Applied!");
      setApplied(true);
    } catch (err) {
      console.error("Apply job error:", err);
      alert(err.response?.data?.msg || "Failed to apply");
    } finally {
      setButtonLoading(false);
    }
  };

  return (
    <div>
      <ApplicantHeaderPage />
      <ApplicantNavbarPage />

      <div className="jobdetails-container-page">
        <h1>Job Details</h1>

        {loading || !job ? (
          <div className="loader-container">
            <ThreeDots color="blue" height={50} width={50} />
          </div>
        ) : (
          <div className="job-details-container">
            <h5 className="job-title">{job.title}</h5>
            <span><strong>Company:</strong> {job.company}</span>
            <span><strong>Job Type:</strong> {job.jobType}</span>
            <span><strong>Category: </strong>{job.category}</span>
            <span><strong>Experience Required:</strong> {job.experienceRequired} Years</span>
            <span className="job-salary"><strong>Stipend : </strong> {job.stipend}</span>
            <span className=""><strong>Skills:</strong> {job.skillsRequired.join(", ")}</span>
            <span className="job-location"><strong>Location:</strong> {job.location}</span>
            <span className="job-description"><strong>Description:</strong> {job.description}</span>

            {applied ? (
              <button className="applied-button">✔ Applied</button>
            ) : (
              <button
                className="apply-job-btn"
                onClick={handleApplyJob}
                disabled={buttonLoading}
              >
                {buttonLoading ? "Applying..." : "Apply Now"}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ApplcantJobDetails;
