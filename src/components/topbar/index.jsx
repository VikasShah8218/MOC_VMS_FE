import React, { useState, useContext, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { UserContext } from "../../context/UserContext.jsx";
import Notification from "../../components/notification";
import essilogo from "../../assets/images/essi-logo.png"
import Profile from "../../views/auth/Profile.jsx";
import { url } from "../../utils/Constants";
import { useTranslation } from 'react-i18next';
import LanguageOutlinedIcon from '@mui/icons-material/LanguageOutlined';
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";

const Topbar = () => {
  let history = useNavigate();
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const { setIslogin, setUser, user, setDatas } = useContext(UserContext);

  const { t, i18n } = useTranslation();
  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  const handleLogout = async() => {
    try {
      const response = await fetch(`${url}/accounts/logout/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          refresh : localStorage.getItem("refresh_token"),
        }),
      });
      if (response.ok) {
        let whomToVisit = localStorage.getItem("names")
        let visitingPurpose = localStorage.getItem("names1")
        localStorage.clear();
        localStorage.setItem("names",(whomToVisit));
        localStorage.setItem("names1",(visitingPurpose));
        setUser();
        history("/login");
        Notification.showSuccessMessage("Logout Successfully!", "You have been logged out successfully.");
      }
    } catch (err) {
      Notification.showErrorMessage("Error", "Server error!");
    }
  };

  let username = localStorage.getItem("user_name");
  let userimage = localStorage.getItem("image");

  useEffect(() => {
    username = localStorage.getItem("user_name");
    userimage = localStorage.getItem("image");
  });

  return (
    <>
      <div className="flex justify-between items-center bg-gray-100 p-4 shadow-md">
        <img src={essilogo} alt="MOD Logo" className="h-12" />

        <div className="software-name" style={{color:"#40664f" , fontSize:"32px"}}>
          <h1 style={{fontFamily:"fantasy"}}>{t("Visitor Management System")}</h1>
        </div>

        {localStorage.getItem("token") && (
          <div className="flex items-center space-x-2">
            <button className="bg-customGreen hover:bg-green-700 text-white py-2 px-4 rounded-3xl shadow-md flex items-center text-sm" onClick={() => changeLanguage('es')}>
              English
            </button>
            <button className="bg-customGreen hover:bg-green-700 text-white py-2 px-4 rounded-3xl shadow-md flex items-center text-sm" onClick={() => changeLanguage('hn')}>
              हिंदी 
            </button>
            <div className="flex items-center space-x-2 bg-customGreen rounded-full p-1 transform scale-90 shadow-md min-w-[130px]" onClick={() => setProfileModalOpen(true)}>
              <div className="w-8 h-8 border-2 border-gray-300 rounded-full overflow-hidden bg-customGreen flex justify-center items-center">
                {userimage != "null" ? (
                  <img src={`data:image/jpeg;base64,${localStorage.getItem("image")}`} alt="User" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-white">{username ? username.charAt(0).toUpperCase() : 'N'}</span>
                )}
              </div>
              <span className="text-white p-1">{username}</span>
            </div>

            <button className="bg-customGreen hover:bg-green-700 text-white py-2 px-4 rounded-3xl shadow-md flex items-center text-sm" onClick={() => handleLogout()}>
              Logout
            </button>
          </div>
        )}

      </div>

      <Profile open={profileModalOpen} onClose={() => setProfileModalOpen(false)} />
    </>
  );
};
export default Topbar;

