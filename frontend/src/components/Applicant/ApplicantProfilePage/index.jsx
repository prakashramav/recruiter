import ApplicantHeaderPage from "../ApplicantHeaderPage";
import ApplicantNavbarPage from "../ApplicantNavabrPage";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import axios from "axios";
import "./index.css";
import { ThreeDots } from "react-loader-spinner";

const ApplicantProfilePage = () => {
    const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const token = Cookies.get("talentify_applicant_jwtToken");
  const navigate = useNavigate();

  // Fetch Profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(
          "https://recruiter-1-gjf3.onrender.com/api/applicants/me",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setProfile(res.data);
      } catch (err) {
        console.error("Error fetching profile:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleDelete = async () => {
      
  }
    return (
        <>
            <ApplicantHeaderPage />
            <div>
                <ApplicantNavbarPage />
                <div className="applicant-profile-page-container">
                    
                    <h1 className="profile-heading">My Profile</h1>
                    {loading ? (<ThreeDots color="blue" height={50} width={50}/>) :(
                        <div className="profile-card-container">
                            <div className="profile-card-page-container">
                                <p><strong>Name:</strong> {profile.name}</p>
                                <p><strong>Email:</strong> {profile.email}</p>
                                <p><strong>Phone:</strong> {profile.phone || "Not added"}</p>
                                <p><strong>Experience:</strong> {profile.experience} years</p>

                                <p><strong>Skills:</strong>  
                                    {profile.skills?.length > 0 ? profile.skills.join(", ") : "No skills added"}
                                </p>

                                <p><strong>Interests:</strong>  
                                    {profile.interests?.length > 0 ? profile.interests.join(", ") : "No interests added"}
                                </p>
                            </div>
                            <div className="resume-section">
                                <h3>Resume</h3>
                                {profile.isResumeUploaded ? (
                                <a
                                    href={profile.resumeUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="view-resume-btn"
                                >
                                    View Resume
                                </a>
                                ) : (
                                <p>No resume uploaded</p>
                                )}
                            </div>

                            <div className="button-row">
                                <button
                                className="update-btn"
                                onClick={() => navigate("/applicant/update-profile")}
                                >
                                Update Profile
                                </button>

                                <button className="delete-btn" onClick={handleDelete}>
                                Delete Profile
                                </button>
                            </div>
                        </div>
                )}
                </div>
            </div>
        </>
    )
}

export default ApplicantProfilePage;