import { useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { ThreeDots } from "react-loader-spinner";
import "./index.css";
import ApplicantHeaderPage from "../ApplicantHeaderPage";
import ApplicantNavbarPage from "../ApplicantNavabrPage";

const ApplicantCompleteProfile = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    phone: "",
    githubUrl: "",
    linkedinUrl: "",
    portfolioUrl: "",
    skills: "",
    interests: "",
    experience: "",
  });

  const [loading, setLoading] = useState(false);

  // Handle Input Change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const token = Cookies.get("talentify_applicant_jwtToken");

    try {
      const payload = {
        phone: formData.phone,
        githubUrl: formData.githubUrl,
        linkedinUrl: formData.linkedinUrl,
        portfolioUrl: formData.portfolioUrl,
        experience: Number(formData.experience),

        // backend expects array
        skills: formData.skills.split(",").map((s) => s.trim()),
        interests: formData.interests.split(",").map((i) => i.trim()),
      };

      await axios.post(
        "https://recruiter-1-gjf3.onrender.com/api/applicants/complete-profile",
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Profile Completed Successfully!");
      navigate("/applicant", { replace: true });
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ApplicantHeaderPage />

      <div>
        <ApplicantNavbarPage />

        <div className="applicant-complete-profile-page-container">

          <h2>Complete Your Profile</h2>

          <form className="complete-profile-form" onSubmit={handleSubmit}>

            <input
              type="text"
              name="phone"
              placeholder="Phone Number *"
              value={formData.phone}
              onChange={handleChange}
              required
            />

            <input
              type="text"
              name="githubUrl"
              placeholder="https://github.com/username"
              value={formData.githubUrl}
              onChange={handleChange}
            />

            <input
              type="text"
              name="linkedinUrl"
              placeholder="https://linkedin.com/in/username"
              value={formData.linkedinUrl}
              onChange={handleChange}
            />

            <input
              type="text"
              name="portfolioUrl"
              placeholder="https://portfolio.com/username"
              value={formData.portfolioUrl}
              onChange={handleChange}
            />

            <input
              type="number"
              name="experience"
              placeholder="Years of Experience"
              value={formData.experience}
              onChange={handleChange}
            />

            <textarea
              name="skills"
              placeholder="Skills (comma separated) *"
              value={formData.skills}
              onChange={handleChange}
              required
            />

            <textarea
              name="interests"
              placeholder="Interests / Job Roles (comma separated)"
              value={formData.interests}
              onChange={handleChange}
            />

            {loading ? (
                <div className="complete-profile-loading-container">
                    <ThreeDots color="blue" height={40} width={40} />
                </div>
            ) : (
              <button type="submit" className="submit-btn">
                Save Profile
              </button>
            )}
          </form>

        </div>
      </div>
    </>
  );
};

export default ApplicantCompleteProfile;
