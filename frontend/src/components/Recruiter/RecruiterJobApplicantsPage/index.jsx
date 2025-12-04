import { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useParams } from "react-router-dom";
import RecruiterHeaderPage from "../RecruiterHeaderPage";
import RecruiterNavbarPage from "../RecruiterNavbarPage";
import { ThreeDots } from "react-loader-spinner";
import "./applicants.css";

const RecruiterJobApplicantsPage = () => {
  const { jobId } = useParams();
  const token = Cookies.get("talentify_recruiter_jwtToken");

  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch applicants for this job
  useEffect(() => {
    const fetchApplicants = async () => {
      try {
        const res = await axios.get(
          `https://recruiter-1-gjf3.onrender.com/api/recruiters/jobs/${jobId}/applicants`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setApplicants(res.data.applicants);
      } catch (err) {
        console.error("Error fetching applicants:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchApplicants();
  }, [jobId]);

  // Update application status (Accept/Reject)
  const updateStatus = async (applicationId, newStatus) => {
    try {
      await axios.put(
        `https://recruiter-1-gjf3.onrender.com/api/recruiters/applications/${applicationId}/status`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Update UI instantly
      setApplicants((prev) =>
        prev.map((app) =>
          app._id === applicationId ? { ...app, status: newStatus } : app
        )
      );

      alert(`Application ${newStatus} successfully`);
    } catch (err) {
      console.error("Status update error:", err);
      alert("Something went wrong");
    }
  };

  return (
    <>
      <div className="applicants-container">
        <h1>Applicants for This Job</h1>

        {loading ? (
          <div className="loader">
            <ThreeDots height={50} width={50} color="blue" />
          </div>
        ) : applicants.length === 0 ? (
          <p className="no-applicants">No applicants yet for this job.</p>
        ) : (
          <ul className="applicants-list">
            {applicants.map((app) => (
              <li key={app._id} className="applicant-card">
                <h3>{app.applicantId.name}</h3>
                <p>
                  <strong>Email:</strong> {app.applicantId.email}
                </p>
                <p>
                  <strong>Skills:</strong>{" "}
                  {app.applicantId.skills?.join(", ") || "Not mentioned"}
                </p>

                <p>
                  <strong>Status:</strong>{" "}
                  <span className={`status-badge ${app.status}`}>
                    {app.status}
                  </span>
                </p>

                {app.applicantId.resumeUrl && (
                  <a
                    href={app.applicantId.resumeUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="resume-btn"
                  >
                    View Resume
                  </a>
                )}

                <div className="actions">
                  <button
                    className="accept-btn"
                    onClick={() => updateStatus(app._id, "accepted")}
                  >
                    Accept
                  </button>
                  <button
                    className="reject-btn"
                    onClick={() => updateStatus(app._id, "rejected")}
                  >
                    Reject
                  </button>
                  <button
                    className="review-btn"
                    onClick={() => updateStatus(app._id, "reviewed")}
                  >
                    Review
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
};

export default RecruiterJobApplicantsPage;
