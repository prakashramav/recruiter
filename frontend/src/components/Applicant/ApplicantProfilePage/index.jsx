import ApplicantHeaderPage from "../ApplicantHeaderPage";
import ApplicantNavbarPage from "../ApplicantNavabrPage";
import "./index.css";

const ApplicantProfilePage = () => {
    return (
        <>
            <ApplicantHeaderPage />
            <div>
                <ApplicantNavbarPage />
                <div className="applicant-profile-page-container">
                    <h1>Applicant Profile Page</h1>
                </div>
            </div>
        </>
    )
}

export default ApplicantProfilePage;