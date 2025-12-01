import RecruiterHeaderPage from '../RecruiterHeaderPage';
import RecruiterNavbarPage from '../RecruiterNavbarPage';
import './index.css'

const RecruiterInterviewSchedule = () => {
    return (
        <>
            <RecruiterHeaderPage />
            <div className='recruiter-interview-page-container'>
                <RecruiterNavbarPage />
                <div className='recruiter-interview-content-contaier'>
                    <h1>Interviews</h1>
                </div>
            </div>
        </>
    )
}

export default RecruiterInterviewSchedule;