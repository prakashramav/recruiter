import ApplicantHeaderPage from "../ApplicantHeaderPage"
import ApllicantNavbarPage from "../ApplicantNavabrPage"
import { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useParams } from "react-router-dom";
const ApplcantJobDetails = () => {
    const { jobId } = useParams();
  const token = Cookies.get("talentify_applicant_jwtToken");

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch Job By ID
  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await axios.get(
          `https://recruiter-1-gjf3.onrender.com/api/applicants/job/${jobId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setJob(res.data);
      } catch (err) {
        console.error("Error fetching job:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [jobId]);
    return (
        <div>
            <ApplicantHeaderPage />
            <div>
                <ApllicantNavbarPage />
                <div className="jobdetals-container-page">
                    <h1>Applicant Job  Details Page</h1>
                </div>
            </div>
        </div>
    )
} 

export default ApplcantJobDetails