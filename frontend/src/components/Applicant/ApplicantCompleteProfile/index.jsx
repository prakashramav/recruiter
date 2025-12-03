import ApplicantHeaderPage from "../ApplicantHeaderPage"
import ApplicantNavbarPage from "../ApplicantNavabrPage"
import './index.css'
const ApplicantCompleteProfile = () => {
    return (
        <div>
            <ApplicantHeaderPage />
            <div>
                <ApplicantNavbarPage />
                <div className='applicant-complete-profile-page-container'>
                    <h1>Complete Your Profile</h1>
                </div>
            </div>
        </div>
    )
}

export default ApplicantCompleteProfile