import { Navigate } from "react-router-dom";
import Cookies from "js-cookie";
import axios from "axios";
import ApplicantHeaderPage from "../ApplicantHeaderPage";
import ApplicantNavbarPage from "../ApplicantNavabrPage";
import "./index.css";
import { useEffect, useState } from "react";
import { ThreeDots } from "react-loader-spinner";
import ApplcantFetchingJobs from "../ApplicantJobsPage";
import ApplicantJobsPage from "../ApplicantJobsPage";

const ApplicantHomePage = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [resumeFile, setResumeFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  // Fetch logged-in applicant profile
  useEffect(() => {
    const token = Cookies.get("talentify_applicant_jwtToken");

    const fetchUser = async () => {
      try {
        const response = await axios.get(
          "https://recruiter-1-gjf3.onrender.com/api/applicants/me",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setProfile(response.data);
      } catch (err) {
        console.log("Error fetching Applicant:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  // Upload Resume Handler
  const handleResumeUpload = async () => {
    if (!resumeFile) {
      alert("Please select a PDF file");
      return;
    }

    const token = Cookies.get("talentify_applicant_jwtToken");

    const formData = new FormData();
    formData.append("resume", resumeFile);

    try {
      setUploading(true);

      const res = await axios.post(
        "https://recruiter-1-gjf3.onrender.com/api/ats/upload",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      alert("Resume Uploaded Successfully!");

      // Update UI with new resume data
      setProfile((prev) => ({
        ...prev,
        isResumeUploaded: true,
        resumeUrl: res.data.resumeUrl,
      }));
    } catch (err) {
      console.log(err);
      alert(err.response?.data?.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  // Loader before profile
  if (loading) {
    return (
      <div className="applicant-dashboard-page-loader-container">
        <ThreeDots color="blue" height={60} width={60} />
      </div>
    );
  }

  // If profile incomplete → redirect
  if (!profile || !profile.isProfileComplete) {
    return <Navigate to="/applicant/complete-profile" replace />;
  }

  return (
    <>
      <ApplicantHeaderPage />

      <div>
        <ApplicantNavbarPage />

        <div className="applicant-dashboard-page-container">
            <div className="applicant-heading-resume-container">
                <h3>Welcome to  Dashboard {profile.name}</h3>

                {/* Resume Upload Section */}
                <div className="resume-card">
                    <h3>Resume Status</h3>

                    {profile.isResumeUploaded ? (
                    <>
                        <p><strong>Resume Uploaded ✓</strong></p>

                        <a
                        href={profile.resumeUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="resume-link"
                        >
                        View Resume
                        </a>
                    </>
                    ) : (
                    <>
                        <p>No Resume Uploaded</p>

                        <input
                        type="file"
                        accept="application/pdf"
                        onChange={(e) => setResumeFile(e.target.files[0])}
                        />

                        {uploading ? (
                        <div className="upload-resume-container">
                            <ThreeDots height={40} width={40} color="blue" />
                        </div>
                        ) : (
                        <button className="upload-btn" onClick={handleResumeUpload}>
                            Upload Resume
                        </button>
                        )}
                    </>
                    )}
                </div>
            </div>
            <div className="jobs-container">
                <ApplicantJobsPage />
            </div>
        </div>
      </div>
    </>
  );
};

export default ApplicantHomePage;
