import React, { useEffect } from "react";
import { FaSignOutAlt, FaUpload } from "react-icons/fa";
import { TbLetterW } from "react-icons/tb";
import { useNavigate } from "react-router-dom";
import { getMe } from '../service/login.service';

const Navbar: React.FC = () => {
  const [, setUserId] = React.useState(null);
  const [name, setName] = React.useState(null);
  const [picture, setpicture] = React.useState(null);
  const navigate = useNavigate();

  const fetchData = async () => {
    const userInfo = await getMe()
    setUserId(userInfo.userId);
    setName(userInfo.name);
    setpicture(userInfo.picture);

    localStorage.setItem('userId-flix-wrapped', userInfo.userId);
  }

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <nav className="bg-black fixed top-0 left-0 right-0 z-50 px-3 py-2 md:px-6 md:py-4 text-white shadow-lg flex items-center justify-between">
      {/* Logo */}
      <div
        className="flex items-center text-lg md:text-2xl font-bold text-red-700"
        style={{ fontFamily: "Poppins, sans-serif" }}
        onClick={() => navigate("/dashboard")}
      >
        Flix<span className="ml-2 md:ml-3"><TbLetterW size={24} className="md:size-8" /></span>rapped
      </div>

      {/* Ações */}
      <div className="flex items-center space-x-2 md:space-x-4">
        {/* Upload */}
        <div
          className="bg-neutral-800 px-2 md:px-4 py-1 md:py-2 rounded-full shadow-md hover:bg-neutral-700 transition cursor-pointer flex items-center space-x-1 md:space-x-2"
          onClick={() => navigate("/upload")}
        >
          <FaUpload className="text-white text-sm md:text-base" />
          <span className="text-xs md:text-sm font-poppins">Upload</span>
        </div>

        {/* Usuário */}
        <div className="flex items-center bg-neutral-800 px-2 md:px-3 py-1 rounded-full shadow-md hover:bg-neutral-700 transition space-x-2 md:space-x-3 cursor-pointer">
          <img
            src={`${picture}`}
            alt="User"
            className="w-6 h-6 md:w-8 md:h-8 rounded-full border border-neutral-600"
          />
          <span className="text-xs md:text-sm font-medium font-poppins">{name || ''}</span>
          <FaSignOutAlt
            className="text-red-500 hover:text-red-400 transition text-sm md:text-base"
            onClick={() => {
              navigate('/')
              localStorage.removeItem('token-flix-wrapped')
            }}
          />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
