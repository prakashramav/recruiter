import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import RecruiterHeaderPage from "../RecruiterHeaderPage";
import RecruiterNavbarPage from "../RecruiterNavbarPage";
import { ThreeDots } from "react-loader-spinner";
import "./createjob.css";


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


const RecruiterCreateJobPage = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    company: "",
    location: "",
    jobType: "Full-Time",
    category: "",
    stipend: "",
    experienceRequired: "",
    skillsRequired: "",
    description: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const submitJob = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const token = Cookies.get("talintify_recruiter_jwt_token");
      console.log("Token:", token);
      const body = {
        title: formData.title,
        company: formData.company,
        location: formData.location,
        jobType: formData.jobType,
        category: formData.category,
        salaryRange: formData.stipend,
        experienceRequired: Number(formData.experienceRequired),
        skillsRequired: formData.skillsRequired.split(",").map((s) => s.trim()),
        description: formData.description,
      };

      const response = await axios.post(
        "https://recruiter-1-gjf3.onrender.com/api/recruiters/jobs",
        body,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response);
      console.log(response.data);

      alert("Job Created Successfully!");
      navigate('/recruiter',{replace:true});
      setIsLoading(false);
      setFormData({
        title: "",
        company: "",
        location: "",
        jobType: "Full-Time",
        category: "",
        stipend: "",
        experienceRequired: "",
        skillsRequired: "",
        description: "",
      });

    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Something went wrong!");
    }
  };

  return (
    <>
      <RecruiterHeaderPage />

      <div className="createjob-container">

        {/* SAME NAVBAR (Auto bottom on mobile) */}
        <RecruiterNavbarPage />

        <div className="createjob-content">
          <h2>Create Job</h2>

          <form className="createjob-form" onSubmit={submitJob}>
            
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

            <div className="salary-row">
              <input
                type="number"
                name="stipend"
                value={formData.stipend}
                onChange={handleChange}
                placeholder="Stipend*"
                required
              />
            </div>

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

            { isLoading ? (<ThreeDots color="blue" height={30} width={30}/>) : (<button className="job-submit-btn" type="submit">
              Post Job
            </button>)}
          </form>
        </div>
      </div>
    </>
  );
};

export default RecruiterCreateJobPage;
