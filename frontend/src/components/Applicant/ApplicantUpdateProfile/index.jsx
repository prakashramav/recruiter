import ApplicantHeaderPage from "../ApplicantHeaderPage"
import ApplicantNavbarPage from "../ApplicantNavabrPage"
import './index.css'
import { useState, useEffect } from "react"
import { ThreeDots } from "react-loader-spinner"
import Cookies from "js-cookie"
import { useNavigate } from "react-router-dom"
import axios from "axios"
const ApplicantUpdateProfile = () => {
    const navigate = useNavigate();
    const token = Cookies.get("talentify_applicant_jwtToken");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [resumeFile, setResumeFile] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    experience: "",
    githubUrl: "",
    linkedinUrl: "",
    portfolioUrl: "",
    skills: "",
    interests: "",
  });

  // Fetch old profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(
          "https://recruiter-1-gjf3.onrender.com/api/applicants/me",
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const p = res.data;

        setFormData({
          name: p.name,
          email: p.email,
          phone: p.phone || "",
          experience: p.experience || "",
          githubUrl: p.githubUrl || "",
          linkedinUrl: p.linkedinUrl || "",
          portfolioUrl: p.portfolioUrl || "",
          skills: p.skills?.join(", ") || "",
          interests: p.interests?.join(", ") || "",
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [token]);
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);

        try {
            const fd = new FormData();
        // Append normal fields
        fd.append("name", formData.name);
        fd.append("email", formData.email);
        fd.append("phone", formData.phone);
        fd.append("experience", formData.experience);
        fd.append("githubUrl", formData.githubUrl);
        fd.append("linkedinUrl", formData.linkedinUrl);
        fd.append("portfolioUrl", formData.portfolioUrl);

        // FIX: Convert to JSON array for backend
        const skillsArray = formData.skills
            .split(",")
            .map((s) => s.trim())
            .filter((s) => s !== "");

        const interestsArray = formData.interests
            .split(",")
            .map((i) => i.trim())
            .filter((i) => i !== "");

        fd.append("skills", JSON.stringify(skillsArray));
        fd.append("interests", JSON.stringify(interestsArray));
        if (resumeFile) fd.append("resume", resumeFile);

        await axios.put(
            "https://recruiter-1-gjf3.onrender.com/api/applicants/update-profile",
            fd,
            {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "multipart/form-data",
            },
            }
        );

        alert("Profile updated successfully!");
        navigate('/applicant/profile')
        } catch (err) {
        alert(err.response?.data?.message || "Update failed");
        } finally {
        setSaving(false);
        }
    };
    return (
        <div>
            <ApplicantHeaderPage />
            <div>
                <ApplicantNavbarPage />
                <div className='applicant-update-profile-page-container'>
                    <h1>Update Your Profile</h1>
                    {loading ? (
                        <ThreeDots color="blue" height={50} width={50} />
                    ):(
                        <form className="update-form" onSubmit={handleSubmit}>
          
                            <input
                                type="text"
                                name="name"
                                placeholder="Full Name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />

                            <input
                                type="email"
                                name="email"
                                placeholder="Email Address"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />

                            <input
                                type="number"
                                name="phone"
                                placeholder="Phone Number"
                                value={formData.phone}
                                onChange={handleChange}
                            />

                            <input
                                type="number"
                                name="experience"
                                placeholder="Experience (Years)"
                                value={formData.experience}
                                onChange={handleChange}
                            />

                            <input
                                type="text"
                                name="githubUrl"
                                placeholder="GitHub URL"
                                value={formData.githubUrl}
                                onChange={handleChange}
                            />

                            <input
                                type="text"
                                name="linkedinUrl"
                                placeholder="LinkedIn URL"
                                value={formData.linkedinUrl}
                                onChange={handleChange}
                            />

                            <input
                                type="text"
                                name="portfolioUrl"
                                placeholder="Portfolio URL"
                                value={formData.portfolioUrl}
                                onChange={handleChange}
                            />

                            <textarea
                                name="skills"
                                placeholder="Skills (comma separated)"
                                value={formData.skills}
                                onChange={handleChange}
                                rows="3"
                            />

                            <textarea
                                name="interests"
                                placeholder="Interests (comma separated)"
                                value={formData.interests}
                                onChange={handleChange}
                                rows="3"
                            />

                            <label className="resume-upload-label">Upload New Resume (PDF Only)</label>
                            <input
                                type="file"
                                accept="application/pdf"
                                onChange={(e) => setResumeFile(e.target.files[0])}
                            />

                            <button className="save-btn" type="submit" disabled={saving}>
                                {saving ? "Saving..." : "Save Changes"}
                            </button>

                        </form>
                    )}
                </div>
            </div>
        </div>
    )
}

export default ApplicantUpdateProfile

