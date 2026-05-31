import React, { useState, useEffect } from "react"; // ⭐️ Import useEffect
import { useNavigate } from "react-router-dom";
import axios from "axios"; // ⭐️ Import axios
import authCheckSA from "./authCheckSA";
import {
  IconUsers,
  IconHistory,
  IconHome,
  IconChartBar,
  IconBell,
  IconFileDescription,
  IconLogout,
  IconUser,
  IconChevronDown,
  IconMenu2,
  IconBellRinging
} from "@tabler/icons-react";
import LogoutAlert from "./logoutConfirm";

export default function ProfileSA() {
  authCheckSA();
  const [showLogout, setShowLogout] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true); // ⭐️ State untuk loading

  // ⭐️ STATE BARU untuk menyimpan data profil dari backend
  const [profileData, setProfileData] = useState({
    name: "Loading...",
    username: "Loading...",
    role: "Admin",
  });

  const navigate = useNavigate();

  // --- FETCH DATA DARI BACKEND ---
  useEffect(() => {
    const fetchProfile = async () => {
      const user = JSON.parse(localStorage.getItem('user'))
      const user_id = user.user_id;
      const token = localStorage.getItem('token')
      try {
        // Ganti URL sesuai endpoint backend Anda
        const response = await axios.get(`http://localhost:8080/api/profile/userInfo?user_id=${user_id}`, {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          }
        });

        setProfileData(response.data);


      } catch (error) {
        console.error("Gagal mengambil data profil:", error);
        // Tampilkan pesan default jika gagal
        setProfileData({
          name: "Gagal memuat",
          username: "N/A",
          role: "N/A",
        });
        // Tambahkan alert jika perlu
        // alert("Gagal terhubung ke server untuk memuat data profil.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []); // useEffect dijalankan sekali saat komponen dimuat

  // --- HANDLERS ---
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const getSidebarItemClass = () => {
    const baseClasses =
      "flex items-center gap-3 p-3 rounded-md font-medium transition-colors text-sm";
    return `${baseClasses} text-[#667790] hover:bg-gray-100`;
  };

  // --- RENDER COMPONENT ---

  // Tampilkan loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-[#F5F6FA] font-['Plus_Jakarta_Sans']">
        <p>Memuat Data Profil...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#F5F6FA] font-['Plus_Jakarta_Sans']">

      {/* SIDEBAR (RESPONSIVE) */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-white border-r transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          } lg:static lg:h-auto`}
      >
        <div className="flex flex-col h-full">
          <div className="flex flex-col items-center p-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="bg-[url('https://cdn.designfast.io/image/2025-10-28/d0d941b0-cc17-46b2-bf61-d133f237b449.png')] w-[29px] h-[29px] bg-cover bg-center"></div>
              <h1 className="text-lg font-medium text-[#023048]">Bebas Pustaka</h1>
            </div>
            <div className="w-full border-b border-gray-200"></div>
          </div>

          <nav className="flex-1 px-6 pt-3 space-y-4 pb-6">
            <a href="/dashboardSA" className={getSidebarItemClass()}>
              <IconHome size={20} />
              Dashboard
            </a>
            <a href="/analyticSA" className={getSidebarItemClass()}>
              <IconChartBar size={20} />
              Data Analitik
            </a>
            <a href="/approvalSA" className={getSidebarItemClass()}>
              <IconFileDescription size={20} />
              Konfirmasi Data
            </a>
            <a href="/usercontrolSA" className={getSidebarItemClass(true)}>
              <IconUsers size={20} />
              Kontrol Pengguna
            </a>
            <a href="/HistoryApprovalSA" className={getSidebarItemClass()}>
              <IconHistory size={20} />
              Riwayat
            </a>
          </nav>
        </div>
      </aside>

      {/* OVERLAY untuk Mobile Sidebar */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-30 lg:hidden"
          onClick={toggleSidebar}
        ></div>
      )}

      {/* MAIN AREA */}
      <div className="flex-1 lg:ml-0">

        {/* NAVBAR (RESPONSIVE) */}
        <header className="w-full bg-white border-b p-4 flex justify-between lg:justify-end relative z-20">

          {/* Tombol Menu Mobile */}
          <button
            className="lg:hidden text-[#023048]"
            onClick={toggleSidebar}
            aria-label="Toggle menu"
          >
            <IconMenu2 size={24} />
          </button>

          <a href="/historySA" className="group mt-2.5 mr-4 text-[#023048] hover:text-[#A8B5CB]">
            <IconBell size={24} className="block group-hover:hidden" />
            <IconBellRinging size={24} className="hidden group-hover:block animate-ring-bell" />
          </a>

          <div
            className="flex items-center gap-2 cursor-pointer pr-4 relative"
            onClick={toggleDropdown}
          >
            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center border border-gray-300">
              <IconUser size={24} className="text-gray-500" />
            </div>
            <p className="font-semibold text-sm text-[#023048] select-none hidden sm:block">
              Hai, {profileData.name.split(" ")[0]}
            </p>


            <IconChevronDown size={18} className="text-gray-600" />

          </div>

          {/* DROPDOWN MENU */}
          {isDropdownOpen && (
            <div className="absolute right-4 top-full mt-2 w-64 bg-white rounded-md shadow-lg border z-30">
              <div className="flex items-center gap-3 p-4 border-b">
                <IconUser size={24} className="text-gray-500" />
                <div>
                  <p className="font-semibold text-sm text-[#023048] text-left">
                    {profileData.name}
                  </p>
                  <p className="text-xs text-gray-500 ">{profileData.role}</p>
                </div>
              </div>

              <div className="p-2 space-y-1">
                <button
                  className="flex items-center gap-3 p-2 w-full text-left text-sm bg-[#667790] text-white rounded-md"
                >
                  <IconUser size={18} className="text-white" />
                  Profile
                </button>

                <button
                  onClick={() => setShowLogout(true)}
                  className="flex items-center gap-3 p-2 w-full text-sm text-red-600 hover:bg-red-50 rounded-md"
                >
                  <IconLogout size={18} />
                  Keluar
                </button>
              </div>
            </div>
          )}

        </header>
        {showLogout && (
          <LogoutAlert onClose={() => setShowLogout(false)} />
        )}
        {/* MAIN PROFILE CONTENT */}
        <div className="p-4 sm:p-8">
          <h1 className="text-xl sm:text-2xl font-semibold mb-6 text-[#023048] text-left">Profile</h1>

          <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 border">

            {/* HEADER CARD */}
            <div className="flex items-center gap-4 pb-5 flex-wrap">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                <IconUser size={40} className="text-gray-500 sm:size={50}" />
              </div>

              <div>
                <h2 className="text-lg sm:text-xl font-semibold text-[#023048] text-left">
                  {profileData.name} {/* ⭐️ Data Dinamis */}
                </h2>
                <p className="text-sm text-gray-500 text-left">{profileData.role}</p> {/* ⭐️ Data Dinamis */}
              </div>
            </div>

            {/* TABS */}
            <div className="flex gap-4 sm:gap-8 mt-5 border-b overflow-x-auto whitespace-nowrap">
              <span className="pb-2 border-b-2 border-[#023048] text-[#023048] font-medium text-sm">
                Rincian Saya
              </span>

              {/* GOTO EDIT PROFILE */}
              <button
                onClick={() => navigate("/edit-profileSA")}
                className="pb-2 text-gray-500 hover:text-gray-700 text-sm"
              >
                Edit Profile
              </button>
            </div>

            {/* CONTENT */}
            <div className="mt-6">
              <h3 className="text-base sm:text-lg font-semibold mb-4 text-[#023048] text-left">
                Profile Utama
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-8 text-sm text-left">
                <div>
                  <p className="font-medium text-left">Nama :</p>
                  <p className="text-gray-700 mt-1">{profileData.name}</p> {/* ⭐️ Data Dinamis */}
                </div>

                <div>
                  <p className="font-medium text-left">Peran :</p>
                  <p className="text-gray-700 mt-1">{profileData.role}</p> {/* ⭐️ Data Dinamis */}
                </div>

                <div>
                  <p className="font-medium text-left">Username :</p>
                  <p className="text-gray-700 mt-1">{profileData.username}</p> {/* ⭐️ Data Dinamis */}
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};
