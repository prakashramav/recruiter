import {  Navigate} from "react-router-dom";
import Cookies from 'js-cookie'
import RecruiterHeaderPage from '../RecruiterHeaderPage'
import "./index.css";


const RecruiterHomePage = () => {
    return (
      <>
        <RecruiterHeaderPage/>
        <div className="recruiter-home-container">
            <h1>Welcome to Recruiter Home Page</h1>
        </div>
      </>
    )
}

export default RecruiterHomePage;
