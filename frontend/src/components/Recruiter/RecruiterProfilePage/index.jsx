import { useEffect, useState } from "react";
import RecruiterHeaderPage from "../RecruiterHeaderPage";
import RecruiterNavbarPage from "../RecruiterNavbarPage";
import { useNavigate } from "react-router-dom";
import "./index.css";
import axios from 'axios';
import Cookies from 'js-cookie';
import { ThreeDots } from "react-loader-spinner";

const RecruiterProfilePage = () => {
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDelete, setDelete] = useState(false);
  const navigate = useNavigate()

  useEffect(() => {
    const fetchData = async () => {
      const jwtToken = Cookies.get("talintify_recruiter_jwt_token");

      const response = await axios.get(
        'https://recruiter-1-gjf3.onrender.com/api/recruiters/profile',
        {
          headers: { Authorization: `Bearer ${jwtToken}` },
        }
      );

      setProfile(response.data);
      setIsLoading(false);
    };

    fetchData();
  }, []);
  const deleteRecruiterProfile = async () => {
    setDelete(true);
    const token = Cookies.get("talintify_recruiter_jwt_token");
    await axios.delete(
        "https://recruiter-1-gjf3.onrender.com/api/recruiters/delete-profile",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert("Your profile has been deleted successfully");
      Cookies.remove("talintify_recruiter_jwt_token");
      navigate("/recruiter/login", { replace: true });
      setDelete(false);
  }
  return (
    <>
      <RecruiterHeaderPage />

      <div className="recruiter-profile-page-container">
        <RecruiterNavbarPage />

        <div className="recruiter-profile-content-container">
          {isLoading ? (
            <ThreeDots color="blue"/>
          ) : (
            <div className="profilePage-container">
              <h1>Profile Page</h1>

              <p><b>Name:</b> <span>{profile.name}</span></p>
              <p><b>Email:</b> <span>{profile.email}</span></p>
              <p><b>Company:</b> <span>{profile.companyName}</span></p>
              <p><b>CompanyWebsite:</b> <span>{profile.companyWebsite}</span></p>
              <p><b>Designation:</b><span>{profile.designation}</span></p>
              <div className="update-delete-profile-container">
                <button className="update-profile-btn" onClick={() => navigate('/recruiter/update-profile')}>
                    Update Profile 
                </button>
                {isDelete ? (<ThreeDots height={40} width={40} color="red"/>):(<button className="delete-profile-btn" onClick={deleteRecruiterProfile}>
                    Delete Profile 
                </button>)}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default RecruiterProfilePage;
