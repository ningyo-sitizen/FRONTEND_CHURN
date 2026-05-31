import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import AppLayout from "./AppLayout";
import SidebarSA from "./sideBaradmin";
import LogoutAlert from "./logoutConfirm";
import HeaderSA from './HeaderSA';
import "./App.css";
import axios from "axios";
import Footer from "./Footer";

const API_URL = `${import.meta.env.VITE_BACKEND_URL}`;

function TambahAdm() {

    const goto = useNavigate();

    // =========================
    // STATES
    // =========================
    const [password,        setPassword]        = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showLogout,      setShowLogout]       = useState(false);
    const [loadingProfile,  setLoadingProfile]   = useState(true);

    const [profileData, setProfileData] = useState({
        name: "Loading...",
        username: "Loading...",
        role: "Admin",
    });
    const [profileImg] = useState({ name: "Loading...", role: "Admin" });

    const [formData, setFormData] = useState({
        email: "",
        name: "",
        las_name: "",
    });

    const token = localStorage.getItem("token");

    // =========================
    // FETCH PROFILE
    // =========================
    useEffect(() => {
        const token      = localStorage.getItem("token");
        if (!token) { goto("/login"); return; }
    }, [goto]);

    // =========================
    // SUBMIT
    // =========================
    const handleSubmit = async () => {
        try {
            const payload = {
                email: formData.email,
                name: formData.name,
                las_name: formData.las_name,
                password,
            };
    
            const response = await axios.post(
                `${API_URL}/api/user-management/users/newadmin`,
                payload,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
    
            if (response.data.success) {
                alert("Admin berhasil dibuat!");
    
                // Redirect ke halaman User Management
                goto("/user-management");
            }
    
        } catch (error) {
            console.error("Gagal tambah admin:", error);
            alert(
                error.response?.data?.message || "Terjadi kesalahan server"
            );
        }
    };

    const isPasswordValid = password.length >= 4 && /\d/.test(password);

    // =========================
    // RENDER
    // =========================
    return (
        <main className="bg-[#F9FAFB] min-h-screen font-jakarta">
            <div className="flex">

                {/* SIDEBAR */}
                <SidebarSA />

                {/* MAIN CONTENT */}
                <div className="flex-1 flex flex-col min-h-screen">

                    {/* HEADER */}
                    <HeaderSA
                        profileData={profileData}
                        loading={loadingProfile}
                        profileImg={profileImg}
                        setShowLogout={setShowLogout}
                    />

                    {/* LOGOUT ALERT */}
                    {showLogout && <LogoutAlert onClose={() => setShowLogout(false)} />}

                    {/* CONTENT */}
                    <div className="flex-1 overflow-y-auto">
                        <div className="p-8">

                            {/* PAGE TITLE + SAVE BUTTON */}
                            <div className="flex items-center justify-between mb-6">
                                <div className="text-2xl font-semibold">Tambah Admin</div>
                                <button
                                    onClick={handleSubmit}
                                    disabled={password !== confirmPassword || !isPasswordValid}
                                    className={`px-6 py-2 text-sm font-semibold text-white rounded-lg transition-all
                                        ${password !== confirmPassword || !isPasswordValid
                                            ? "bg-gray-300 cursor-not-allowed opacity-70"
                                            : "bg-[#D82F5A] hover:bg-[#B2153D] active:scale-95"
                                        }`}
                                >
                                    Simpan
                                </button>
                            </div>

                            {/* FORM CARD */}
                            <div className="relative bg-white w-full rounded-lg border border-[#EDEDED] px-8 py-8 flex flex-col">

                                {/* Email */}
                                <div className="mb-4 text-left">
                                    <label className="text-sm font-medium text-gray-700 block mb-1">
                                        Email <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        placeholder="Contoh: admin@mail.com"
                                        className="border border-gray-300 rounded-lg p-3 w-full text-sm outline-none focus:ring-2 focus:ring-[#023048]"
                                    />
                                </div>

                                {/* Nama Depan & Belakang */}
                                <div className="flex flex-col md:flex-row gap-4 w-full">
                                    <div className="mb-4 text-left flex-1 min-w-0">
                                        <label className="text-sm font-medium text-gray-700 block mb-1">
                                            Nama Depan <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            placeholder="Contoh: Budi"
                                            className="border border-gray-300 rounded-lg p-3 w-full text-sm outline-none focus:ring-2 focus:ring-[#023048]"
                                        />
                                    </div>
                                    <div className="mb-4 text-left flex-1 min-w-0">
                                        <label className="text-sm font-medium text-gray-700 block mb-1">
                                            Nama Belakang <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.las_name}
                                            onChange={(e) => setFormData({ ...formData, las_name: e.target.value })}
                                            placeholder="Contoh: Santoso"
                                            className="border border-gray-300 rounded-lg p-3 w-full text-sm outline-none focus:ring-2 focus:ring-[#023048]"
                                        />
                                    </div>
                                </div>

                                {/* Password */}
                                <div className="mb-4 text-left">
                                    <label className="text-sm font-medium text-gray-700 block mb-1">
                                        Password <span className="text-red-500">*</span>
                                    </label>
                                    <div className="flex items-center border border-gray-300 rounded-lg p-3 w-full focus-within:ring-2 focus-within:ring-[#023048]">
                                        <input
                                            type="password"
                                            placeholder="Minimal 4 karakter dan mengandung angka"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="outline-none w-full text-sm"
                                        />
                                    </div>
                                    {password && !isPasswordValid && (
                                        <p className="text-red-500 text-xs mt-1">
                                            Password minimal 4 karakter dan harus mengandung angka
                                        </p>
                                    )}
                                </div>

                                {/* Konfirmasi Password */}
                                <div className="mb-4 text-left">
                                    <label className="text-sm font-medium text-gray-700 block mb-1">
                                        Konfirmasi Password <span className="text-red-500">*</span>
                                    </label>
                                    <div className="flex items-center border border-gray-300 rounded-lg p-3 w-full focus-within:ring-2 focus-within:ring-[#023048]">
                                        <input
                                            type="password"
                                            placeholder="Ulangi password"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            className="outline-none w-full text-sm"
                                        />
                                    </div>
                                    {confirmPassword && password !== confirmPassword && (
                                        <p className="text-red-500 text-xs mt-1">
                                            Password tidak cocok
                                        </p>
                                    )}
                                </div>

                            </div>
                        </div>
                        <Footer></Footer>
                    </div>

                </div>
            </div>
        </main>
    );
}

export default TambahAdm;