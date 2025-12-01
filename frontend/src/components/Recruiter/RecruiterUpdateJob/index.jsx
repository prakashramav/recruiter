import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import RecruiterHeaderPage from "../RecruiterHeaderPage";
import RecruiterNavbarPage from "../RecruiterNavbarPage";
import Cookies from "js-cookie";
import axios from "axios";
import { ThreeDots } from "react-loader-spinner";
import "./updatejob.css";

// SAME CATEGORIES AS CREATE JOB
const categories = [
  "Software Development",
  "Data Science",
  "Product Management",
  "Artificial Intelligence",
  "frontend Development",
  "backend Development",
  "DevOps",
  "Cybersecurity",
  "Cloud Computing",
  "Mobile Development",
  "UI/UX Design",
  "Quality Assurance",
  "Business Analysis",
  "fullstack Development",
  "Machine Learning",
  "Blockchain",
  "Game Development",
  "Data Engineering",
  "Network Engineering",
  "Java Development",
  "Python Development",
  "JavaScript Development",
];

const RecruiterUpdateJob = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    company: "",
    location: "",
    jobType: "",
    category: "",
    stipend: "",
    experienceRequired: "",
    skillsRequired: "",
    description: "",
  });

  const [loading, setLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  // Fetch job details for pre-fill
  useEffect(() => {
    const fetchJob = async () => {
      try {
        const token = Cookies.get("talintify_recruiter_jwt_token");

        const response = await axios.get(
          `https://recruiter-1-gjf3.onrender.com/api/recruiters/jobs/${jobId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const job = response.data.job;

        setFormData({
          title: job.title,
          company: job.company,
          location: job.location,
          jobType: job.jobType,
          category: job.category,
          stipend: job.stipend,
          experienceRequired: job.experienceRequired,
          skillsRequired: job.skillsRequired.join(", "),
          description: job.description,
        });

        setLoading(false);
      } catch (error) {
        console.error(error);
        alert("Failed loading job details");
        setLoading(false);
      }
    };

    fetchJob();
  }, [jobId]);

  // Handle form inputs
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Submit updated job data
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsUpdating(true);

    try {
      const token = Cookies.get("talintify_recruiter_jwt_token");

      const body = {
        ...formData,
        experienceRequired: Number(formData.experienceRequired),
        skillsRequired: formData.skillsRequired
          .split(",")
          .map((s) => s.trim())
          .filter((s) => s !== ""),
      };

      await axios.put(
        `https://recruiter-1-gjf3.onrender.com/api/recruiters/jobs/${jobId}`,
        body,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("Job Updated Successfully!");

      navigate(`/recruiter/jobs/${jobId}`, { replace: true });
    } catch (error) {
      console.error(error);
      alert("Failed to update job!");
    }

    setIsUpdating(false);
  };
  
  return (
    <div>
      <RecruiterHeaderPage />

      <div className="updatejob-container">
        <RecruiterNavbarPage />

        <div className="updatejob-content">
            <div className="heading-goback-container">
                <h2 className="updatejob-heading">Update Job</h2>
                <button className="go-back-btn" onClick={() => navigate(-1)}>Goback</button>
            </div>
        {loading ? (<div className="update-job-loader-container">
        <ThreeDots color="blue" height={40} width={40} />
      </div>) : (<form className="updatejob-form" onSubmit={handleSubmit}>
            <input
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Job Title *"
              required
            />

            <input
              name="company"
              value={formData.company}
              onChange={handleChange}
              placeholder="Company *"
              required
            />

            <input
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="Location *"
              required
            />

            <select
              name="jobType"
              value={formData.jobType}
              onChange={handleChange}
              required
            >
              <option>Select Job Type</option>
              <option>Full-Time</option>
              <option>Part-Time</option>
              <option>Internship</option>
              <option>Freelance</option>
            </select>

            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat}>{cat}</option>
              ))}
            </select>

            <input
              type="number"
              name="stipend"
              value={formData.stipend}
              onChange={handleChange}
              placeholder="Stipend *"
              required
            />

            <input
              type="number"
              name="experienceRequired"
              value={formData.experienceRequired}
              onChange={handleChange}
              placeholder="Experience Required (Years) *"
              required
            />

            <input
              name="skillsRequired"
              value={formData.skillsRequired}
              onChange={handleChange}
              placeholder="Skills (comma separated) *"
              required
            />

            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Job Description *"
              required
            />

            <div className="loading-and-button-container">
              {isUpdating ? (
                <ThreeDots color="blue" height={40} width={50} />
              ) : (
                <button className="job-submit-btn" type="submit">
                  Update Job
                </button>
              )}
            </div>
          </form>)}
        </div>
      </div>
    </div>
  );
};

export default RecruiterUpdateJob;
