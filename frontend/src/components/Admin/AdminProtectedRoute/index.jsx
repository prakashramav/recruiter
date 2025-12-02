import { Navigate } from "react-router-dom";
import Cookies from "js-cookie";
const AdminProtectedRoute = ({children}) => {
    const adminJwtToken = Cookies.get("talentify_admin_jwtToken");
    if (adminJwtToken === undefined) {
        return <Navigate to="/admin/login" replace />;
    }

    return children;
}

export default AdminProtectedRoute;