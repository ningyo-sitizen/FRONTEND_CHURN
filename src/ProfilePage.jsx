import React, {
  useState,
  useRef,
  useEffect
} from 'react';

import LoadingOverlay from './LoadingOverlay.jsx';

import {
  User,
  Building2,
  Camera,
  CreditCard,
  Crown,
  Edit3,
  X,
  Check,
  Crop,
  LifeBuoy,
  MessageCircle
} from 'lucide-react';

import Header from './Header';
import { useAuth } from '../utils/auth.js';
import Sidebar from './SideBar.jsx';
import Footer from './Footer';
import axios from 'axios';
import { useNavigate } from "react-router-dom";

const ProfilePage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState(null);

  const [uploading, setUploading] = useState(false);

  const user = useAuth();

  const [isEditing, setIsEditing] = useState(false);

  const [showCropModal, setShowCropModal] =
    useState(false);

  const [profileImg, setProfileImg] =
    useState(null);

  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    nama: "",
    email: "",
    perusahaan: "",
    nama_app: "",
    link_app: ""
  });

  useEffect(() => {

    if (user) {
      setFormData({
        nama: user?.name || "",
        email: user?.email || "",
        perusahaan: user?.nama_perusahaan || "",
        nama_app: user?.nama_app || "",
        link_app: user?.link_app || ""
      });

      setProfileImg(user?.avatar || null);

    }

  }, [user]);

  const updateUserData = async () => {
    const token = localStorage.getItem("token");

    try {
      setIsLoading(true);

      const form = new FormData();
      form.append("name", formData.nama);
      form.append("nama_perusahaan", formData.perusahaan);
      form.append("nama_app", formData.nama_app);
      form.append("link_app", formData.link_app);

      if (selectedFile) {
        form.append("avatar", selectedFile);
      }

      const response = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/auth/update-profile`,
        form,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      console.log(response.data);

      setIsEditing(false);

    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePhotoClick = () => {
    fileInputRef.current?.click();
  };


  const handleFileChange = (event) => {

    const file = event.target.files[0];

    if (!file) return;

    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png"
    ];

    if (!allowedTypes.includes(file.type)) {

      alert("Hanya JPG/JPEG");

      return;

    }

    const maxSize = 2 * 1024 * 1024;

    if (file.size > maxSize) {

      alert("Maksimal 2MB");

      return;

    }

    setSelectedFile(file);

    console.log(selectedFile)

    const reader = new FileReader();

    reader.onloadend = () => {

      setProfileImg(reader.result);

      setShowCropModal(true);

    };

    reader.readAsDataURL(file);

  };

  return (

    <div className="bg-[#F9FAFB] font-['Plus_Jakarta_Sans'] text-[#1a1a1a] flex min-h-screen">

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept="image/*"
      />

      {/* MODAL */}
      {showCropModal && (

        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">

          <div className="bg-white w-full max-w-md rounded-sm shadow-2xl overflow-hidden">

            <div className="p-6 border-b border-gray-100 flex justify-between items-center">

              <h3 className="font-semibold text-sm flex items-center gap-2">
                <Crop size={18} className="text-[#e11d48]" />
                Sesuaikan Foto
              </h3>

              <button
                onClick={() =>
                  setShowCropModal(false)
                }
              >
                <X size={20} />
              </button>

            </div>

            <div className="p-8 bg-gray-50 flex justify-center">

              <div className="relative w-64 h-64 border-2 border-dashed border-[#e11d48] rounded-sm overflow-hidden bg-white">

                <img
                  src={profileImg}
                  alt="crop"
                  className="w-full h-full object-cover"
                />

              </div>

            </div>

            <div className="p-6 flex justify-end gap-2 bg-white">

              <button
                onClick={() =>
                  setShowCropModal(false)
                }
                className="px-4 py-2 text-xs font-medium"
              >
                Batal
              </button>

              <button
                onClick={() =>
                  setShowCropModal(false)
                }
                className="px-6 py-2 bg-[#1a1a1a] text-white text-xs font-medium rounded-sm"
              >
                Simpan
              </button>

            </div>

          </div>

        </div>

      )}

      <Sidebar />

      <main className="flex-1 flex flex-col">

        <Header
          formData={user}
          profileImg={profileImg}
        />

        <div className="p-8 flex-1">

          {/* TOP */}
          <div className="flex justify-between items-end mb-10">

            <div>

              <h1 className="text-2xl font-semibold text-[#1a1a1a] mb-1">
                Analisis churn pelanggan
              </h1>

              <p className="text-gray-500 text-sm">
                Kelola informasi profil dan
                pantau status keanggotaan anda.
              </p>

            </div>

            {!isEditing ? (

              <button
                onClick={() =>
                  setIsEditing(true)

                }
                className="flex items-center gap-2 px-6 py-2.5 bg-[#1a1a1a] text-white text-sm font-medium rounded-[4px]"
              >
                <Edit3 size={16} />
                Edit Profil
              </button>

            ) : (

              <div className="flex gap-3">

                <button
                  onClick={() =>
                    setIsEditing(false)
                  }
                  className="px-6 py-2.5 text-sm font-medium text-gray-500"
                >
                  Batal
                </button>

                <button
                  onClick={updateUserData}
                  className="flex items-center gap-2 px-6 py-2.5 bg-[#e11d48] text-white text-sm font-medium rounded-sm"
                >
                  <Check size={16} />
                  Simpan Data
                </button>

              </div>

            )}

          </div>

          {/* CONTENT */}
          <div className="grid grid-cols-12 gap-8 mb-10">

            {/* LEFT */}
            <div className="col-span-8 space-y-6">

              {/* PROFILE */}
              <div className="bg-white p-8 rounded-sm border border-gray-100 shadow-sm flex items-center gap-8 relative overflow-hidden">

                <div className="relative group">

                  <img
                    src={profileImg}
                    alt="avatar"
                    className="w-24 h-24 rounded-sm object-cover"
                  />

                  {isEditing && (

                    <div
                      onClick={handlePhotoClick}
                      className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center rounded-sm cursor-pointer text-white"
                    >

                      <Camera
                        size={20}
                        className="mb-1"
                      />

                      <span className="text-[8px] font-black uppercase tracking-tighter">
                        pilih foto
                      </span>

                    </div>

                  )}

                </div>

                <div>

                  <h2 className="text-xl font-semibold">
                    {formData.nama}
                  </h2>

                  <p className="text-gray-400 text-sm mb-4">
                    {formData.email}
                  </p>

                  <span className="px-3 py-1 bg-pink-50 text-[#e11d48] text-xs rounded-sm">
                    Member Premium
                  </span>

                </div>

              </div>

              {/* FORM */}
              <div className="bg-white rounded-sm border border-gray-100 shadow-sm divide-y divide-gray-50">

                {/* PERSONAL */}
                <div className="p-8">

                  <h3 className="text-base font-semibold text-[#e11d48] mb-6 flex items-center gap-2">
                    <User size={18} />
                    Informasi Personal
                  </h3>

                  <div className="grid grid-cols-2 gap-x-10 gap-y-6">

                    <DataField
                      isEditing={isEditing}
                      label="Nama lengkap"
                      value={formData.nama}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          nama: e.target.value
                        })
                      }
                    />

                    <DataField
                      isEditing={isEditing}
                      label="Email address"
                      value={formData.email}
                      readOnly
                    />

                  </div>

                </div>

                {/* COMPANY */}
                <div className="p-8">

                  <h3 className="text-base font-semibold text-[#e11d48] mb-6 flex items-center gap-2">
                    <Building2 size={18} />
                    Informasi perusahaan
                  </h3>

                  <div className="space-y-6">

                    <DataField
                      isEditing={isEditing}
                      label="Nama perusahaan"
                      value={formData.perusahaan}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          perusahaan:
                            e.target.value
                        })
                      }
                    />

                    <div className="grid grid-cols-2 gap-x-10">

                      <DataField
                        isEditing={isEditing}
                        label="link app"
                        value={formData.link_app}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            link_app:
                              e.target.value
                          })
                        }
                      />

                      <DataField
                        isEditing={isEditing}
                        label="nama app"
                        value={formData.nama_app}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            nama_app:
                              e.target.value
                          })
                        }
                      />

                    </div>

                  </div>

                </div>

              </div>

            </div>

            {/* RIGHT */}
            <div className="col-span-4 space-y-6">

              <div className="bg-[#1a1a1a] text-white p-8 rounded-sm shadow-xl">

                <div className="flex items-center justify-between mb-8">

                  <p className="text-sm font-medium text-gray-400">
                    Status Langganan
                  </p>

                  <Crown
                    className="text-[#e11d48]"
                    size={20}
                  />

                </div>

                <p className="text-xl font-black mb-1 uppercase">
                  {user?.member_plan}
                </p>

                <p className="text-gray-400 text-xs">
                  Aktif s/d {new Date(user?.member_until).toLocaleDateString("id-ID")}
                </p>

                <button onClick={() => navigate("/historyPayment")} className="w-full mt-8 py-3.5 bg-white text-[#1a1a1a] font-semibold text-sm rounded-sm hover:bg-gray-100 flex items-center justify-center gap-2">

                  <CreditCard size={14} />

                  Informasi Member

                </button>

              </div>

              <div className="bg-white border border-gray-100 rounded-sm p-6 shadow-sm">

                <div className="flex items-center gap-2 mb-4 text-[#1a1a1a]">

                  <LifeBuoy
                    size={18}
                    className="text-[#e11d48]"
                  />

                  <h4 className="font-semibold text-sm">
                    Pusat Bantuan
                  </h4>

                </div>

                <p className="text-xs text-gray-400 leading-relaxed mb-6">
                  Butuh bantuan dalam
                  mengelola akun?
                </p>

                <button className="w-full flex items-center justify-between p-4 bg-pink-50 rounded-sm">

                  <span className="text-xs font-semibold text-[#e11d48]">
                    Hubungi Support
                  </span>

                  <MessageCircle
                    size={16}
                    className="text-[#e11d48]"
                  />

                </button>

              </div>

            </div>

          </div>

        </div>

        <Footer />

      </main>
      {isLoading && <LoadingOverlay />}
    </div>

  );

};

// DATA FIELD
const DataField = ({
  label,
  value,
  isEditing,
  onChange,
  readOnly = false
}) => (

  <div className="space-y-2">

    <label className="text-sm font-medium text-gray-400 ml-0.5">
      {label}
    </label>

    {isEditing ? (

      <input
        type="text"
        value={value || ""}
        onChange={onChange}
        readOnly={readOnly}
        className={`
          w-full px-4 py-2.5 rounded-sm text-sm font-medium
          border outline-none transition-all
          ${readOnly
            ? "bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200"
            : "bg-gray-50 border-gray-200 focus:ring-2 focus:ring-pink-100 focus:border-[#e11d48]"
          }
        `}
      />

    ) : (

      <p className="text-sm font-medium text-[#1a1a1a] px-0.5 tracking-tight">
        {value}
      </p>

    )}

  </div>

);

export default ProfilePage;