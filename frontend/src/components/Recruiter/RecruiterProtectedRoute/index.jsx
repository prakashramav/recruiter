import Cookies from "js-cookie";
import { Navigate } from "react-router-dom";

const RecruiterProtectedRoute = ({children}) => {
    const recruiterJwtToken = Cookies.get("talintify_recruiter_jwt_token");
    if (recruiterJwtToken === undefined) {
        return <Navigate to="/recruiter/login" replace />;
    }
    return children;
}

export default RecruiterProtectedRoute;