import ApplicantHeaderPage from '../ApplicantHeaderPage'
import ApplicantNavbarPage from '../ApplicantNavabrPage'
import { useState,useEffect } from 'react'
import axios from 'axios'
import Cookies from 'js-cookie'
import './index.css'
import { ThreeDots } from 'react-loader-spinner'
import { useNavigate } from 'react-router-dom'

const ApplicantAppliedJobs = () => {
    const navigate = useNavigate();
    const token = Cookies.get("talentify_applicant_jwtToken");

    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const fetchAppliedJobs = async () => {
        try {
            const res = await axios.get(
            "https://recruiter-1-gjf3.onrender.com/api/applicants/my-applications",
            { headers: { Authorization: `Bearer ${token}` } }
            );

            setApplications(res.data.applications);
        } catch (err) {
            console.error("Error fetching applied jobs:", err);
        } finally {
            setLoading(false);
        }
        };

        fetchAppliedJobs();
    }, [token]);
    console.log(applications);

    const appliedOn = (dateString) => {
        const date = new Date(dateString);
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

    return (
        <div>
            <ApplicantHeaderPage />
            <div>
                <ApplicantNavbarPage />
                <div className='applicant-applied-jobs-container'>
                    <h1 className='my-applicant-job-heading'>My Applications</h1>
                    {
                        loading ? (
                            <div className='loader-container'>
                                <ThreeDots color='blue' height={50} width={50} />
                            </div>
                        ):(
                            applications.length === 0 ? (<p>You haven't applied for any jobs yet.</p>):(
                                <ul className='my-applicant-list-container'>
                                    {
                                        applications.map((app) => (
                                            <li key={app._id} className='my-applicant-list-item' onClick={() => app.jobId?._id && navigate(`/applicant/jobs/${app.jobId._id}`)}>
                                                <h5><strong>Title: </strong>{app.jobId?.title || "Job Deleted"}</h5>
                                                <p><strong>Company:</strong> {app.jobId?.company || "N/A"}</p>
                                                <p><strong>Location:</strong> {app.jobId?.location || "N/A"}</p>
                                                <p><strong>Applied On:</strong> {appliedOn(app.appliedAt)}</p>
                                                <p>
                                                    <strong>Status:</strong>{" "}
                                                    <span
                                                        className={`status-badge ${
                                                        app.status === "accepted"
                                                            ? "status-accepted"
                                                            : app.status === "rejected"
                                                            ? "status-rejected"
                                                            : app.status === "reviewed"
                                                            ? "status-reviewed"
                                                            : "status-pending"
                                                        }`}
                                                    >
                                                        {app.status.toUpperCase()}
                                                    </span>
                                                </p>
                                            </li>
                                        ))
                                    }
                                </ul>
                            )
                        )
                    }
                </div>
            </div>
        </div>
    )
}

export default ApplicantAppliedJobs