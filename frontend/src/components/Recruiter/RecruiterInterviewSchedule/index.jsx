import { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import RecruiterHeaderPage from "../RecruiterHeaderPage";
import RecruiterNavbarPage from "../RecruiterNavbarPage";
import { ThreeDots } from "react-loader-spinner";
import "./index.css";
const RecruiterInterviewSchedule = () => {
    const token = Cookies.get("talintify_recruiter_jwt_token");

    const [interviews, setInterviews] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUpcoming = async () => {
            try {
            const res = await axios.get(
                "https://recruiter-1-gjf3.onrender.com/api/interviews/upcoming-interviews",
                {
                headers: { Authorization: `Bearer ${token}` },
                }
            );
            setInterviews(res.data.interviews);
            } catch (err) {
            console.error("Error fetching upcoming interviews:", err);
            } finally {
            setLoading(false);
            }
        };

        fetchUpcoming();
    }, [token]);

    const getTimeLeft = (date) => {
        const interviewTime = new Date(date);
        const now = new Date();

        const diff = interviewTime - now; // milliseconds

        if (diff <= 0) return "Interview time passed";

        const seconds = Math.floor(diff / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);

        if (days > 0) return `${days} day${days > 1 ? "s" : ""} left`;
        if (hours > 0) return `${hours} hour${hours > 1 ? "s" : ""} left`;
        if (minutes > 0) return `${minutes} minute${minutes > 1 ? "s" : ""} left`;

        return "Few seconds left";
    };

    return (
        <>
        <RecruiterHeaderPage />
        <div className="interviews-layout">
            <RecruiterNavbarPage />

            <div className="interviews-container">
            <h2 className="heading-of-interview">Upcoming Interviews</h2>

            {loading ? (
                <div className="loader-container">
                    <ThreeDots height={50} width={50} color="blue" />
                </div>
            ) : interviews.length === 0 ? (
                <div className="no-Interviews">
                    <h4>No upcoming interviews scheduled.</h4>
                </div>
            ) : (
                <ul className="interviews-list">
                {interviews.map((iv) => (
                    <li key={iv._id} className="interview-card">
                    <h3>{iv.applicantId.name}</h3>

                    <p><strong>Email:</strong> {iv.applicantId.email}</p>
                    <p><strong>Job:</strong> {iv.jobId.title}</p>
                    <p><strong>Company:</strong> {iv.jobId.company}</p>

                    <p>
                        <strong>Date & Time:</strong>{" "}
                        {new Date(iv.interviewDate).toLocaleString()}
                    </p>

                    <a 
                        className="meet-link"
                        href={iv.meetLink}
                        target="_blank"
                        rel="noreferrer"
                    >
                        Join Meeting
                    </a>

                    {iv.message && (
                        <p className="note"><strong>Message:</strong> {iv.message}</p>
                    )}
                    <p className="time-left">
                    <strong>⏳Time left:</strong> {getTimeLeft(iv.interviewDate)}
                    </p>
                    </li>
                ))}
                </ul>
            )}
            </div>
        </div>
        </>
    );
}

export default RecruiterInterviewSchedule;