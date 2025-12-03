import { Navigate } from "react-router-dom";
import Cookies from 'js-cookie'
import axios from 'axios'
import ApplicantHeaderPage from '../ApplicantHeaderPage'
import ApplicantNavbarPage from "../ApplicantNavabrPage";
import "./index.css";
import { useEffect,useState } from "react";
import { ThreeDots } from "react-loader-spinner";

const ApplicantHomePage = () => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        const token = Cookies.get("talentify_applicant_jwtToken");

        const fetchUser = async () => {
            try {
                const response = await axios.get(
                    "https://recruiter-1-gjf3.onrender.com/api/applicants/me",
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                setProfile(response.data);
            } catch (err) {
                console.log("Error fetching Applicant:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, []);

    if (loading) {
        return (
            <div className="applicant-dashboard-page-loader-container">
                <ThreeDots color="blue" height={60} width={60} />
            </div>
        );
    }
    if (!profile || !profile.isProfileComplete) {
        return <Navigate to="/applicant/complete-profile" replace />;
    }

    console.log(profile);
    
    return (
        <>
            <ApplicantHeaderPage />
            <div>
                <ApplicantNavbarPage />
                <div className="applicant-dashboard-page-container">
                    <h1>Welcome to Applicant Dashboard</h1>
                </div>
            </div>
        </>
    )
}

export default ApplicantHomePage;