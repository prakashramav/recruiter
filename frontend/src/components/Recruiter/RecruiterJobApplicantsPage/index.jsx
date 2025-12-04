import { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useParams } from "react-router-dom";
import { ThreeDots } from "react-loader-spinner";
import "./applicants.css";

const RecruiterJobApplicantsPage = () => {
  const { jobId } = useParams();
  const token = Cookies.get("talintify_recruiter_jwt_token");

  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);

  // INTERVIEW MODAL STATE
  const [selectedApplicant, setSelectedApplicant] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [interviewData, setInterviewData] = useState({
    interviewDate: "",
    meetLink: "",
    message: "",
  });

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
  }, [jobId,token]);

  // Update application status
  const updateStatus = async (applicationId, newStatus) => {
  try {
    // Add animation class to button
    const btn = document.getElementById(`btn-${applicationId}-${newStatus}`);
    if (btn) {
      btn.classList.add(
        newStatus === "accepted"
          ? "flash-success"
          : newStatus === "rejected"
          ? "flash-reject"
          : "flash-review"
      );

      setTimeout(() => {
        btn.classList.remove("flash-success", "flash-reject", "flash-review");
      }, 500);
    }

    await axios.put(
      `https://recruiter-1-gjf3.onrender.com/api/recruiters/applications/${applicationId}/status`,
      { status: newStatus },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    setApplicants((prev) =>
      prev.map((app) =>
        app._id === applicationId ? { ...app, status: newStatus } : app
      )
    );
  } catch (err) {
    console.error("Status update error:", err);
    alert("Something went wrong");
  }
};


  // Schedule Interview
  const scheduleInterview = async () => {
    try {
      await axios.post(
        "https://recruiter-1-gjf3.onrender.com/api/interviews/schedule",
        {
          applicantId: selectedApplicant.applicantId._id,
          jobId: jobId,
          interviewDate: interviewData.interviewDate,
          meetLink: interviewData.meetLink,
          message: interviewData.message,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Update status to accepted
      updateStatus(selectedApplicant._id, "accepted");

      alert("Interview Scheduled Successfully!");
      setShowModal(false);
    } catch (err) {
      console.error(err);
      alert("Failed to schedule interview");
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
                    disabled={app.status === "accepted"}
                    onClick={() => {
                      if (app.status !== "accepted") {
                        setSelectedApplicant(app);
                        setShowModal(true);
                      }
                    }}
                    style={{
                      opacity: app.status === "accepted" ? 0.5 : 1,
                      cursor: app.status === "accepted" ? "not-allowed" : "pointer"
                    }}
                  >
                    Accept & Schedule Interview
                  </button>
                  <button
                    className="reject-btn"
                    disabled={app.status === "accepted"}
                    onClick={() => updateStatus(app._id, "rejected")}
                    style={{
                      opacity: app.status === "accepted" ? 0.5 : 1,
                      cursor: app.status === "accepted" ? "not-allowed" : "pointer"
                    }}
                  >
                    Reject
                  </button>
                  <button
                    className="review-btn"
                    disabled={app.status === "accepted"}
                    onClick={() => updateStatus(app._id, "reviewed")}
                    style={{
                      opacity: app.status === "accepted" ? 0.5 : 1,
                      cursor: app.status === "accepted" ? "not-allowed" : "pointer"
                    }}
                  >
                    Mark Reviewed
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* INTERVIEW SCHEDULING MODAL */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h2>Schedule Interview</h2>

            <label>Date & Time:</label>
            <input
              type="datetime-local"
              value={interviewData.interviewDate}
              onChange={(e) =>
                setInterviewData({
                  ...interviewData,
                  interviewDate: e.target.value,
                })
              }
            />

            <label>Google Meet Link:</label>
            <input
              type="text"
              placeholder="https://meet.google.com/xyz"
              value={interviewData.meetLink}
              onChange={(e) =>
                setInterviewData({
                  ...interviewData,
                  meetLink: e.target.value,
                })
              }
            />

            <label>Message to Applicant:</label>
            <textarea
              placeholder="Add a message (optional)"
              value={interviewData.message}
              onChange={(e) =>
                setInterviewData({
                  ...interviewData,
                  message: e.target.value,
                })
              }
            ></textarea>

            <div className="modal-actions">
              <button className="schedule-btn" onClick={scheduleInterview}>
                Send Interview Details
              </button>
              <button className="cancel-btn" onClick={() => setShowModal(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default RecruiterJobApplicantsPage;
