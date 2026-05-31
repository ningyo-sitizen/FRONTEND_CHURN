import React, { useState, useRef, useEffect } from 'react';
import {
  LayoutDashboard, BarChart3, History, Bell,
  User, Mail, Phone, Building2, MapPin,
  Camera, Save, CreditCard, Crown, Edit3, X, Check, Crop, Upload,
  LifeBuoy, MessageCircle,
} from 'lucide-react';
import {
  IconHome,
  IconChartBar,
  IconBell,
  IconMenu2,
  IconLogout,
  IconUsers,
  IconHistory,
  IconUser,
  IconChevronDown,
  IconSelector,
  IconFile,
  IconFileReport,
  IconBellRinging,
  IconFileDescription,
  IconCalendarWeek,
  IconSearch,
  IconCashBanknote,
  IconAdjustmentsHorizontal,
  IconTrash,
  IconCheck
} from "@tabler/icons-react";
import Header from './HeaderSA.jsx';
import Footer from './Footer.jsx';
import { useAuthAdmin } from '../utils/authadmin.js';
// import logochurn from './assets/logo churn.png';
// import unggahdata from './assets/unggahdata.png';
import { IconBrandMyOppo, IconUserCircle, IconLogout2 } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';
import Sidebar from './sideBaradmin.jsx';
import AppLayout from './AppLayout';
import axios from "axios";
const BASE_URL = `${import.meta.env.VITE_BACKEND_URL}`;


const ProfilePageSA = () => {
  const user = useAuthAdmin()
  const goto = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [showCropModal, setShowCropModal] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const [showLogout, setShowLogout] = useState(false);

  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [profileImg, setProfileImg] = useState({ name: "Loading...", role: "Admin" });
  const fileInputRef = useRef(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const getSidebarItemClass = (isActive = false) => {
    const baseClasses =
      "flex items-center gap-3 p-3 rounded-md font-medium transition-colors text-sm";
    return isActive
      ? `${baseClasses} bg-[#F2EEEF] text-[#DA839A] font-semibold`
      : `${baseClasses} text-[#DA839A] hover:bg-gray-50`;
  };

  const handlePhotoClick = () => {
    if (isEditing) fileInputRef.current.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImg(reader.result);
        setShowCropModal(true);
      };
      reader.readAsDataURL(file);
    }
  };
  useEffect(() => {
    if (user?.id) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        goto("/login", { replace: true });
        return;
      }

      const res = await axios.get(
        `${BASE_URL}/api/profile/userInfo?id=${user.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setProfileData(res.data);
    } catch (err) {
      console.error("❌ Error fetch profile:", err);

      if (err.response?.status === 401) {
        goto("/login", { replace: true });
      }

      setProfileData({
        name: "Gagal Memuat",
        email: "-",
        telp: "-",
      });
    } finally {
      setLoading(false);
    }
  };
  if (loading) {
    return <div>Loading...</div>;
  }
  return (
    <div className="bg-[#F9FAFB] font-['Plus_Jakarta_Sans'] text-[#1a1a1a] flex min-h-screen">
      <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />


      {/* sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-white border-r transform transition-transform duration-300 ease-in-out 
                ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} 
                lg:translate-x-0 lg:static`}>

        <Sidebar />

      </aside>
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-30 lg:hidden"
          onClick={toggleSidebar}
        ></div>
      )}

      {/* main content area */}
      <main className="flex-1 flex flex-col">
        <Header
          profileData={user}
          loading={loading}
          profileImg={user?.name}
          setShowLogout={setShowLogout}
        />
        {/* Content Container */}
        <div className="p-8 flex-1">


          <div className="grid grid-cols-6 gap-8 mb-10">
            <div className="flex flex-col col-span-8 space-y-6 w-full">
              {/* Profile Card */}
              <div className="bg-white p-8 rounded-sm border border-gray-100 shadow-sm flex items-center gap-8 relative overflow-hidden">
                <div className={`absolute top-0 left-0 w-1 h-full ${isEditing ? 'bg-[#e11d48]' : 'bg-gray-200'}`}></div>
                <div className="relative group">
                  <IconUser size={24} className="text-gray-500" />
                  {isEditing && (
                    <div onClick={handlePhotoClick} className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center rounded-sm cursor-pointer text-white">
                      <Camera size={20} className="mb-1" />
                      <span className="text-[8px] font-black uppercase tracking-tighter">pilih foto </span>
                    </div>
                  )}
                </div>
                <div className='text-left'>
                  <h2 className="text-xl font-semibold">{profileData?.name}</h2>
                  <p className="text-gray-400 text-sm mb-4">{profileData?.email}</p>
                  <span className="px-3 py-1 bg-pink-50 text-[#e11d48] text-xs rounded-sm text-center border border-[#e11d48]/20">
                    Admin ChurnGuard
                  </span>
                </div>
              </div>

              {/* Data Forms */}
              <div className="bg-white rounded-sm border border-gray-100 shadow-sm divide-y divide-gray-50">
                <div className="p-8">
                  <h3 className="text-base font-semibold text-[#e11d48] mb-6 flex items-center gap-2">
                    <User size={18} /> Informasi Personal
                  </h3>
                  <div className="grid grid-cols-2 gap-x-10 gap-y-6 text-left">
                    <DataField isEditing={isEditing} label="Nama lengkap" value={`${profileData?.name} ${profileData?.las_name}`} />
                    <DataField isEditing={isEditing} label="Email address" value={profileData?.email} />
                  </div>
                </div>


              </div>
            </div>
          </div>
        </div>

        {/* FOOTER - Diletakkan di sini agar nempel di bawah konten utama */}
        <Footer></Footer>
      </main>
    </div>
  );
};

// DataField Component
const DataField = ({ label, value, isEditing }) => (
  <div className="space-y-2">
    <label className="text-sm font-medium text-gray-400 ml-0.5">{label}</label>
    {isEditing ? (
      <input type="text" defaultValue={value} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-sm text-sm font-medium focus:ring-2 focus:ring-pink-100 focus:border-[#e11d48] outline-none transition-all" />
    ) : (
      <p className="text-sm font-medium text-[#1a1a1a] px-0.5 tracking-tight">{value}</p>
    )}
  </div>
);

export default ProfilePageSA;