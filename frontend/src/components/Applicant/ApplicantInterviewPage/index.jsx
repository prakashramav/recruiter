import { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import ApplicantHeaderPage from "../ApplicantHeaderPage";
import ApplicantNavbarPage from "../ApplicantNavabrPage";
import { ThreeDots } from "react-loader-spinner";
import "./interview.css";
const ApplicantInterviewPage = () => {
    const token = Cookies.get("talentify_applicant_jwtToken");

    const [interviews, setInterviews] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchInterviews = async () => {
        try {
            const res = await axios.get(
            "https://recruiter-1-gjf3.onrender.com/api/interviews/my-interviews",
            { headers: { Authorization: `Bearer ${token}` } }
            );

            setInterviews(res.data.interviews);
        } catch (err) {
            console.error("Error fetching interviews:", err);
        } finally {
            setLoading(false);
        }
        };

        fetchInterviews();
    }, [token]);
    return (
        <div>
            <ApplicantHeaderPage />
            <div>
                <ApplicantNavbarPage />
                <div className="interview-container">
                    <h2 className="interview-heading">Upcoming Interviews</h2>

                    {loading ? (
                    <div className="loader-box">
                        <ThreeDots color="blue" height={50} width={50} />
                    </div>
                    ) : interviews.length === 0 ? (
                    <p className="no-interviews">No upcoming interviews scheduled.</p>
                    ) : (
                    <ul className="interview-list">
                        {interviews.map((iv) => (
                        <li key={iv._id} className="interview-card">
                            <h3>{iv.jobId.title}</h3>

                            <p><strong>Company:</strong> {iv.jobId.company}</p>
                            <p><strong>Location:</strong> {iv.jobId.location}</p>

                            <p>
                            <strong>Date & Time:</strong>{" "}
                            {new Date(iv.interviewDate).toLocaleString()}
                            </p>

                            <a 
                            className="join-meet"
                            href={iv.meetLink}
                            target="_blank"
                            rel="noreferrer"
                            >
                            Join Meet
                            </a>

                            {iv.message && (
                            <p className="message">
                                <strong>Message:</strong> {iv.message}
                            </p>
                            )}

                            <p>
                            <strong>Recruiter:</strong> {iv.recruiterId.name} (
                                {iv.recruiterId.email})
                            </p>
                        </li>
                        ))}
                    </ul>
                    )}
                </div>
            </div>
        </div>
    )
}

export default ApplicantInterviewPage