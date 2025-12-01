import RecruiterHeaderPage from '../RecruiterHeaderPage';
import RecruiterNavbarPage from '../RecruiterNavbarPage';
import './index.css';

const RecruiterApplicantPageForm = () => {
    return (
        <div>
            <RecruiterHeaderPage />
            <div className='recruiter-applicant-page-container'>
                <RecruiterNavbarPage />
                <div className="recruiter-applicant-content-container">
                    <h1>Welcome to Recruiter Applicants Page</h1>
                </div>
            </div>
        </div>
    )
}

export default RecruiterApplicantPageForm;