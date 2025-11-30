import { Navigate } from "react-router-dom";
import Cookies from "js-cookie";
const ApplicantProtectedRoute = ({children}) => {
    const applicantJwtToken = Cookies.get("talentify_applicant_jwtToken");
    if (applicantJwtToken === undefined) {
        return <Navigate to="/applicant/login" replace />;
    }
    return children;
}

export default ApplicantProtectedRoute;