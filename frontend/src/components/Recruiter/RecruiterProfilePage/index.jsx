import { useEffect, useState } from "react";
import RecruiterHeaderPage from "../RecruiterHeaderPage";
import RecruiterNavbarPage from "../RecruiterNavbarPage";
import "./index.css";
import axios from 'axios';
import Cookies from 'js-cookie';

const RecruiterProfilePage = () => {
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

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
  console.log(profile)
  return (
    <>
      <RecruiterHeaderPage />

      <div className="recruiter-profile-page-container">
        <RecruiterNavbarPage />

        <div className="recruiter-profile-content-container">
          {isLoading ? (
            <p>Loading...</p>
          ) : (
            <div className="profilePage-container">
              <h1>Profile Page</h1>

              <p><b>Name:</b> <span>{profile.name}</span></p>
              <p><b>Email:</b> <span>{profile.email}</span></p>
              <p><b>Company:</b> <span>{profile.companyName}</span></p>
              <p><b>CompanyWebsite:</b> <span>{profile.companyWebsite}</span></p>
              <p><b>Designation:</b><span>{profile.designation}</span></p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default RecruiterProfilePage;
