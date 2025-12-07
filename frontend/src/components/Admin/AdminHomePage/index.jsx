import { Navigate} from "react-router-dom";
import Cookies from 'js-cookie'
import "./index.css";
import AdminHeaderPage from "../AdminHeaderPage";
import { useEffect, useState } from "react";
import axios from "axios";
import AdminAnalyticsPage from "../AdminAnalyticsPage";
const AdminHomePage = () => {
    const adminJwtToken = Cookies.get("talentify_admin_jwtToken");
    const [activity, setActivity] = useState(null);
    useEffect(() => {
        const activities = async () => {
            const res = await axios.get('https://recruiter-1-gjf3.onrender.com/api/admin-analytics/recent',{
                headers: {
                    Authorization: `Bearer ${adminJwtToken}`
                }
            })
            setActivity(res.data);
        }
        activities();
    },[adminJwtToken]);
    console.log(activity)
    return (
        <>
            <AdminHeaderPage />
            <div className="admin-home-page-container">
                <AdminAnalyticsPage />
            </div>
        </>
    )
}

export default AdminHomePage;