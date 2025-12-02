import { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import RecruiterHeaderPage from "../RecruiterHeaderPage";
import RecruiterNavbarPage from "../RecruiterNavbarPage";
import { ThreeDots } from "react-loader-spinner";
import "./index.css";

const RecruiterUpdateProfile = () => {
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    companyName: "",
    companyWebsite: "",
    designation: "",
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = Cookies.get("talintify_recruiter_jwt_token");
        const response = await axios.get(
          "https://recruiter-1-gjf3.onrender.com/api/recruiters/profile",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setProfile(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const updateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = Cookies.get("talintify_recruiter_jwt_token");

      await axios.put(
        "https://recruiter-1-gjf3.onrender.com/api/recruiters/update-profile",
        profile,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("Profile updated successfully!");
      setLoading(false);
    } catch (error) {
      console.log(error);
      alert("Failed to update profile");
      setLoading(false);
    }
  };

  return (
    <div>
      <RecruiterHeaderPage />

      <div>
        <RecruiterNavbarPage />

        <div className="recruiter-update-profile-container">
          <h2>Update Your Profile</h2>

          <form className="update-profile-form" onSubmit={updateProfile}>
            <input
              type="text"
              name="name"
              value={profile.name}
              onChange={handleChange}
              placeholder="Full Name"
              required
            />

            <input
              type="email"
              name="email"
              value={profile.email}
              onChange={handleChange}
              placeholder="Email"
              required
            />

            <input
              type="text"
              name="companyName"
              value={profile.companyName}
              onChange={handleChange}
              placeholder="Company Name"
              required
            />

            <input
              type="text"
              name="companyWebsite"
              value={profile.companyWebsite}
              onChange={handleChange}
              placeholder="Company Website"
              required
            />

            <input
              type="text"
              name="designation"
              value={profile.designation}
              onChange={handleChange}
              placeholder="Designation"
              required
            />

            {loading ? (
                <div className="update-loader-container">
                    <ThreeDots color="blue" height={30} width={50} />
              </div>
            ) : (
              <button className="update-btn" type="submit">
                Update Profile
              </button>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default RecruiterUpdateProfile;
