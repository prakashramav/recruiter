import { Navigate } from "react-router-dom";
import Cookies from 'js-cookie'
import ApplicantHeaderPage from '../ApplicantHeaderPage'
import ApplicantNavbarPage from "../ApplicantNavabrPage";
import "./index.css";

const ApplicantHomePage = () => {

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