import { Navigate } from "react-router-dom";
import Cookies from 'js-cookie'
import ApplicantNavbarPage from '../ApplicantHeaderPage'
import "./index.css";

const ApplicantHomePage = () => {

    return (
        <>
            <ApplicantNavbarPage />
            <div className="applicant-home-container">
                <h1>Welcome to Applicant Home Page</h1>
            </div>
        </>
    )
}

export default ApplicantHomePage;