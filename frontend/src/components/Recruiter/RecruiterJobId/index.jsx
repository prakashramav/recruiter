import { useParams } from "react-router-dom";
import RecruiterHeaderPage from "../RecruiterHeaderPage";
import RecruiterNavbarPage from "../RecruiterNavbarPage";
import Cookies from "js-cookie";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./index.css";
import { useEffect, useState } from "react";
import { ThreeDots } from "react-loader-spinner";
import { BsThreeDotsVertical } from "react-icons/bs";
import RecruiterJobApplicantsPage from "../RecruiterJobApplicantsPage";

const RecruiterJobId = () => {
  const { jobId } = useParams();
  const [job, setJob] = useState(null);
  const navigate = useNavigate();
//   const [isUpdate, setIsUpdate] = useState(false);
const [isDelete, setIsDelete] = useState(false)
const jwtToken = Cookies.get("talintify_recruiter_jwt_token");


  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        const response = await axios.get(
          `https://recruiter-1-gjf3.onrender.com/api/recruiters/jobs/${jobId}`,
          {
            headers: {
              Authorization: `Bearer ${jwtToken}`,
            },
          }
        );
        setJob(response.data.job);
      } catch (err) {
        console.error(err);
      }
    };

    fetchJobDetails();
  }, [jobId, jwtToken]);


  const deleteJob = async () => {
    
    try{
        setIsDelete(true);
        await axios.delete(
           `https://recruiter-1-gjf3.onrender.com/api/recruiters/jobs/${jobId}`,
            {
                headers: {
                Authorization: `Bearer ${jwtToken}`,
                },
            } 
        )
        alert("Job Deleted Successfully!");

        navigate("/recruiter", { replace: true });
        setIsDelete(false);
    }catch(err){
        console.log(err);
        setIsDelete(false);
        alert(err.response?.data?.message || "Failed to delete job")
    }
  }
  const toggleJob = async (jobId) => {
      try {
        const res = await axios.put(
          `https://recruiter-1-gjf3.onrender.com/api/recruiters/jobs/${jobId}/toggle`,
          {},
          {
            headers: { Authorization: `Bearer ${jwtToken}` }
          }
        );

        // Update UI instantly
        setJob((prev) =>
          prev.map((job) =>
            job._id === jobId ? { ...job, isActive: !job.isActive } : job
          )
        );

        alert(res.data.message);
        navigate("/recruiter", { replace: true });

      } catch (err) {
        console.error(err);
        alert("Failed to update job status");
      }
    };

  return (
    <>
      <RecruiterHeaderPage jobId={jobId}/>

      {/* Close menu when clicking outside */}
      <div className="jobid-layout-container">
        <RecruiterNavbarPage />

        <div className="job-jobId-page-container">
            <div className="job-details-go-back-container">
                <h2>Job Details</h2>
                <button className="job-details-goback-container" onClick={() => navigate(-1)}>Go Back</button>
            </div>

          {job ? (
            <div
              className="job-details-section"
            >
              <div className="job-details-heading-container">
                <h3>{job.title}</h3>

                {/* Wrapper for dots + menu */}
                <div className="dots-wrapper">
                  <div className="dots-page-container">
                    <BsThreeDotsVertical size={22} />
                  </div>
                </div>
              </div>

              <p><strong>Company:</strong> {job.company}</p>
              <p><strong>Location:</strong> {job.location}</p>
              <p><strong>Stipend:</strong> {job.stipend}</p>
              <p><strong>Job Type:</strong> {job.jobType}</p>
              <p><strong>Experience:</strong> {job.experienceRequired} years</p>
              <p><strong>Skills:</strong> {job.skillsRequired.join(", ")}</p>
              <p><strong>Category:</strong> {job.category}</p>
              <p><strong>Description:</strong> {job.description}</p>
              <div className="update-delete-buttons">
                <button
                  className={`toggle-btn ${job.isActive ? "deactivate" : "activate"}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleJob(job._id);
                  }}
                >
                  {job.isActive ? "Deactivate" : "Activate"}
                </button>

                <button className="button-update" onClick={() => navigate(`/recruiter/updateJob/${jobId}`)}>Update</button>
                <div>
                    {
                        isDelete ? (<ThreeDots height={30} width={50} color="#f44336"/>) :
                        (<button className="button-delete" onClick={deleteJob}>Delete</button>)}
                </div>
              </div>
            </div>
          ) : (
            <div className="job-details-loader-container">
              <ThreeDots color="blue" height={40} width={40} />
            </div>
          )}
          <RecruiterJobApplicantsPage />
        </div>
      </div>
    </>
  );
};

export default RecruiterJobId;
