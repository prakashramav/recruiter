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
    const fetchJob = async () => {
      try {
        const res = await axios.get(
          `https://recruiter-1-gjf3.onrender.com/api/applicants/job/${jobId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setJob(res.data);
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
            (app) => app.jobId._id === jobId
            );

            setApplied(hasApplied);
        } catch (err) {
            console.error("Error checking if applied:", err);
        }finally {
            setLoading(false);
        }
    };
    fetchJob();
    checkIfApplied();
  }, [jobId, token]);
  console.log(job);
  const handleApplyJob = async () => {
    try {
      setButtonLoading(true);

      await axios.post(
        `https://recruiter-1-gjf3.onrender.com/api/applicants/apply-job/${jobId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("🎉 Job Applied Successfully!");

      setApplied(true); // instantly update UI
    } catch (err) {
      console.error("Apply job error:", err);
      alert(err.response?.data?.msg || "Failed to apply job");
    } finally {
      setButtonLoading(false);
    }
  };

  return (
    <div>
      <ApplicantHeaderPage />
      <div>
        <ApplicantNavbarPage />
        <div className="jobdetails-container-page">
            <h1>Job Details</h1>
            {
                loading ? (
                    <div className="loader-container"> 
                        <ThreeDots color="blue" height={50} width={50} />
                    </div>
                ) : (
                    <>
                        <div className="job-details-container">
                            <h2 className="job-title">{job.title}</h2>
                            <p>Company: {job.company}</p>
                            <p>Job Type: {job.jobType}</p>
                            <p>Category: {job.category}</p>
                            <p>Experience Required: {job.experienceRequired} Years</p>
                            <p className="job-salary">Stipend : {job.stipend}</p>
                            <p className="job-location">Location: {job.location}</p>
                            <p>{job.skills}</p>
                            <p className="job-description">Description: {job.description}</p>
                            {applied ? (<button className="applied-button">✔ Applied</button>):(<button className="apply-job-btn" onClick={handleApplyJob} disabled={buttonLoading}>
                                {buttonLoading ? "Applying..." : "Apply Now"}
                            </button>)}
                        </div>
                    </>
                )
            }
        </div>
      </div>
    </div>
  );
};

export default ApplcantJobDetails;
