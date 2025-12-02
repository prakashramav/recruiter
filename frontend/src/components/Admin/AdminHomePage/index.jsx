import { Navigate} from "react-router-dom";
import Cookies from 'js-cookie'
import "./index.css";
import AdminHeaderPage from "../AdminHeaderPage";

const AdminHomePage = () => {
    return (
        <>
            <AdminHeaderPage />
            <div className="admin-home-page-container">
                <h1>Welcome to Admin Home Page</h1>
            </div>
        </>
    )
}

export default AdminHomePage;