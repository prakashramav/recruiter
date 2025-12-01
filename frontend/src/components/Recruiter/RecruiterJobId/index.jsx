import { useParams } from "react-router-dom";
import RecruiterHeaderPage from "../RecruiterHeaderPage";
import RecruiterNavbarPage from "../RecruiterNavbarPage";
import Cookies from "js-cookie";
import axios from "axios";
import "./index.css";
import { useEffect } from "react";

const RecruiterJobId = () => {
    const { jobId } = useParams();
    console.log("Job ID:", jobId);
    useEffect(() => {
        const fetchJobDetails = async () => {
            const jwtToken = Cookies.get("talintify_recruiter_jwt_token");
            const response = await axios.get(`https://recruiter-1-gjf3.onrender.com/api/recruiters/jobs/${jobId}`, {
                headers: {
                    Authorization: `Bearer ${jwtToken}`,
                },
            });
            const data = response.data;
            console.log("Job Details:", data);
        };
        fetchJobDetails();
    },[jobId])
  return (
    <div>
        <RecruiterHeaderPage />
        <div className="">
            <RecruiterNavbarPage />
            <h2>
                Recruiter Job Id Page
            </h2>
        </div>
    </div>
);
}

export default RecruiterJobId;