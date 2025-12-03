import ApplicantHeaderPage from '../ApplicantHeaderPage'
import ApplicantNavbarPage from '../ApplicantNavabrPage'
import './index.css'

const ApplicantInterviewPage = () => {
    return (
        <div>
            <ApplicantHeaderPage />
            <div>
                <ApplicantNavbarPage />
                <div className='applicant-interview-page-container'>
                    <h1>Interview</h1>
                </div>
            </div>
        </div>
    )
}

export default ApplicantInterviewPage