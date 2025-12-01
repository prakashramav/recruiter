import RecruiterHeaderPage from "../RecruiterHeaderPage";
import RecruiterNavbarPage from "../RecruiterNavbarPage";
import "./index.css";
const RecruiterProfilePage = () => {
    return (
        <>
            <RecruiterHeaderPage/>
            <div className="recruiter-profile-page-container">
                <RecruiterNavbarPage />
                <div className="recruiter-profile-content-container">
                    <h1>Recruiter Profile Page</h1>
                </div>
            </div>
        </>
    )
}

export default RecruiterProfilePage;