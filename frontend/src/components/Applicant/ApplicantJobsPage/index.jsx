import { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { ThreeDots } from "react-loader-spinner";
import "./jobs.css";
import { BsThreeDotsVertical } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import { FaRupeeSign, FaBriefcase, FaMapMarkerAlt, FaBuilding } from "react-icons/fa";

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


const ApplicantJobsPage = () => {
  const navigate = useNavigate();
  const token = Cookies.get("talentify_applicant_jwtToken");

  const [jobs, setJobs] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [filterOpen, setFilterOpen] = useState(false);

  const [category, setCategory] = useState("");
  const [experience, setExperience] = useState("");
  const [jobType, setJobType] = useState("");

  // Fetch All Jobs + Applied Jobs
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await axios.get(
          "https://recruiter-1-gjf3.onrender.com/api/applicants/all-jobs",
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const appliedRes = await axios.get(
          "https://recruiter-1-gjf3.onrender.com/api/applicants/my-applications",
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setJobs(res.data);
        setAppliedJobs(appliedRes.data.applications.map((app) => app.jobId._id));
      } catch (err) {
        console.error("Error fetching jobs:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [token]);

  const convertDate = (dateInput) => {
    const date = new Date(dateInput);
    const now = new Date();

    const seconds = Math.floor((now - date) / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const months = Math.floor(days / 30);
    const years = Math.floor(days / 365);

    if (seconds < 60) return "Just now";
    if (minutes < 60) return `${minutes} min ago`;
    if (hours < 24) return `${hours} hours ago`;
    if (days < 30) return `${days} days ago`;
    if (months < 12) return `${months} months ago`;
    return `${years} years ago`;
  };

  // 🔍 SEARCH API
  const searchJobButton = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `https://recruiter-1-gjf3.onrender.com/api/applicants/search?keyword=${search}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setJobs(res.data);
    } catch (err) {
      console.log(err);
      alert("Search failed");
    } finally {
      setLoading(false);
    }
  };

  // 🎯 APPLY FILTERS API
  const applyFilters = async () => {
    setFilterOpen(false)
    setLoading(true);
    try {
      const res = await axios.get(
        "https://recruiter-1-gjf3.onrender.com/api/applicants/filter",
        {
          params: { category, experience, jobType },
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setJobs(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to apply filters");
    } finally {
      setLoading(false);
    }
  };

 const clearFilters = async () => {
      setCategory("");
      setExperience("");
      setJobType("");
      setLoading(true);

      try {
        const res = await axios.get(
          "https://recruiter-1-gjf3.onrender.com/api/applicants/all-jobs",
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setJobs(res.data); // RESET job list
      } catch (err) {
        console.error(err);
        alert("Failed to reset filters");
      } finally {
        setLoading(false);
      }
    };


  return (
    <>
      <div className="jobs-container">

        {/* SEARCH + FILTER ROW */}
        <div className="search-container">
          <div className="search-mini-container">
            <input
              type="search"
              className="jobs-search"
              placeholder="Search Jobs"
              onChange={(e) => setSearch(e.target.value)}
            />
            <button className="jobs-search-btn" onClick={searchJobButton}>
              Search
            </button>
          </div>
          <div className="filter-container">
            <div>
              <button
                className="filter-button"
                onClick={() => setFilterOpen(!filterOpen)}
              >
                Filter
              </button>
            </div>
            <div>
              <button className="clear-filter-btn" onClick={clearFilters}>Reset</button>
            </div>
          </div>
        </div>

        {/* 🔽 FILTER PANEL */}
        {filterOpen && (
          <div className="filter-panel">
            <h4>Filter Jobs</h4>

            <div className="filter-group">
              <label>Category</label>
              {/* <select onChange={(e) => setCategory(e.target.value)} value={category}>
                <option value="">All</option>
                <option value="IT">IT</option>
                <option value="Software">Software</option>
                <option value="Marketing">Marketing</option>
                <option value="Design">Design</option>
              </select> */}
              <select
                onChange={(e) => setCategory(e.target.value)} value={category}
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat}>{cat}</option>
                ))}
            </select>
            </div>

            <div className="filter-group">
              <label>Experience Required</label>
              <select onChange={(e) => setExperience(e.target.value)} value={experience}>
                <option value="">All</option>
                <option value="0">0 Years</option>
                <option value="1">1 Year</option>
                <option value="2">2 Years</option>
                <option value="3">3 Years</option>
                <option value="5">5+ Years</option>
              </select>
            </div>

            <div className="filter-group">
              <label>Job Type</label>
              <select onChange={(e) => setJobType(e.target.value)} value={jobType}>
                <option value="">All</option>
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Internship">Internship</option>
                <option value="Remote">Remote</option>
              </select>
            </div>

            <div className="filter-buttons-row">
              <button className="apply-filter-btn" onClick={applyFilters}>Apply</button>
            </div>
          </div>
        )}

        {/* JOB LIST */}
        <ul className="applicant-jobs-list">
          {loading ? (
            <div className="jobs-loader">
              <ThreeDots color="blue" height={50} width={50} />
            </div>
          ) : jobs.length === 0 ? (
            <h3>No jobs available right now.</h3>
          ) : (
            jobs.map((job) => {
              const isApplied = appliedJobs.includes(job._id);
              return (
                <li
                  key={job._id}
                  className="applicant-job-item"
                  onClick={() => navigate(`/applicant/jobs/${job._id}`)}
                >
                  <div className="job-card-three">
                    <h6>{job.title}</h6>
                    <BsThreeDotsVertical />
                  </div>

                  <div className="company-type-container">
                    <p><FaBuilding /> {job.company}</p>
                    <p><FaRupeeSign /> {job.stipend}</p>
                  </div>

                  <div className="company-type-container">
                    <p><FaMapMarkerAlt /> {job.location}</p>
                    <p><FaBriefcase /> {job.jobType}</p>
                  </div>

                  <p>Experience Required: {job.experienceRequired} years</p>

                  <div className="bottom-container-of-job">
                    {isApplied ? (
                      <span className="span-applied">Applied</span>
                    ) : (
                      <span className="span-not-applied">Not Applied</span>
                    )}

                    <span className="posted-time">
                      Posted: {convertDate(job.createdAt)}
                    </span>
                  </div>
                </li>
              );
            })
          )}
        </ul>
      </div>
    </>
  );
};

export default ApplicantJobsPage;
