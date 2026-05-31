import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import AppLayout from './AppLayout';
import authCheckSA from "./authCheckSA";
import LogoutAlert from "./logoutConfirm";
import {
    IconHome,
    IconChartBar,
    IconBell,
    IconLogout,
    IconUser,
    IconChevronDown,
    IconMenu2,
    IconTrash,
    IconUsers,
    IconHistory,
    IconPlus,
    IconLayoutGrid,
    IconList,
    IconX,
    IconEye,
    IconEyeOff,
    IconCheck,
    IconBellRinging,
    IconFileDescription,
} from "@tabler/icons-react";

// Counter ID untuk simulasi penambahan user baru

// --- KOMPONEN NOTIFIKASI BERHASIL (Toast) --- 
const SuccessNotification = ({ isVisible, message, onClose }) => {
    useEffect(() => {
        if (isVisible) {
            const timer = setTimeout(() => {
                onClose();
            }, 5000);
            return () => clearTimeout(timer);
        }

    }, [isVisible, onClose]);

    const notificationClass = isVisible
        ? "translate-x-0 opacity-100"
        : "translate-x-full opacity-0";

    return (
        <div
            className={`fixed top-4 right-4 z-50 transition-all duration-500 ease-in-out ${notificationClass}`}
        >
            <div className="bg-white border-l-4 border-green-500 p-4 rounded-lg shadow-xl max-w-sm w-full flex items-start space-x-3">
                <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <IconCheck size={20} className="text-white" />
                </div>
                <div className="flex-1">
                    <h3 className="text-base font-semibold text-gray-800">Berhasil!</h3>
                    <p className="text-sm text-gray-600 mt-1">{message}</p>
                </div>
                <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-gray-700 p-1 rounded-full flex-shrink-0"
                    aria-label="Tutup notifikasi"
                >
                    <IconX size={20} />
                </button>
            </div>
        </div>
    );
};

//pop up delete
const DeleteConfirmModal = ({ isOpen, onClose, onConfirm, username }) => {
    if (!isOpen) return null;

    return (
        // Backdrop Overlay (Latar Belakang Gelap) 
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black bg-opacity-50 font-['Plus_Jakarta_Sans'] transition-opacity duration-300">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm mx-4 transform transition-transform duration-300 scale-100 relative overflow-hidden">

                {/* Header Merah  */}
                <div className="w-full bg-red-500 py-8 flex items-center justify-center relative">
                    <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center">
                        {/* Ikon Tempat Sampah Putih di dalam lingkaran putih */}
                        <IconTrash size={40} className="text-red-500" />
                    </div>
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 text-white hover:text-gray-200 p-1"
                        aria-label="Tutup modal"
                    >
                        <IconX size={24} />
                    </button>
                </div>

                {/* Body Modal */}
                <div className="px-8 pt-6 pb-8 text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Hapus Account?</h2>
                    <p className="text-sm text-gray-600 mt-4 mb-6">
                        Setelah akun dihapus, tindakan ini bersifat permanen dan tidak dapat dibatalkan.
                        {username && <span className="block mt-1 font-medium">({username})</span>}
                    </p>

                    {/* Grup Tombol Aksi */}
                    <div className="flex flex-col gap-3">
                        <button
                            type="button"
                            onClick={onConfirm}
                            className="w-full px-4 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-150 font-semibold"
                        >
                            Setujui
                        </button>

                        <button
                            type="button"
                            onClick={onClose}
                            className="w-full px-4 py-3 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-100 transition duration-150 font-medium"
                        >
                            Batal
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};


// --- KOMPONEN MODAL TAMBAH AKUN BARU 
const AddUserModal = ({ isOpen, onClose, onAddSuccess }) => {
    if (!isOpen) return null;

    const [formData, setFormData] = useState({
        name: "",
        role: "Admin",
        username: "",
        password: "",
        confirmPassword: ""
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');

        // Basic validation
        if (!formData.name.trim() || !formData.username.trim() || !formData.password) {
            alert("Semua field harus diisi!");
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            alert("Password dan Konfirmasi Password tidak cocok!");
            return;
        }

        if (formData.password.length < 6) {
            alert("Password harus minimal 6 karakter!");
            return;
        }

        try {
            const response = await axios.post(
                'http://localhost:8080/api/profile/register',
                {
                    name: formData.name.trim(),
                    username: formData.username.trim(),
                    password: formData.password,
                    role: formData.role
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    }
                }
            );

            if (onAddSuccess) {
                try {
                    const currentUser = JSON.parse(localStorage.getItem("user"));
                    const token = localStorage.getItem("token");

                    const actor = currentUser.username || currentUser.name;
                    const role = currentUser.role;
                    const user_action = `user berhasil menambahkan akun baru (${formData.username}) dengan role (${formData.role})`;
                    const action_status = "berhasil";

                    const now = new Date();
                    const pad = (n) => n.toString().padStart(2, "0");
                    const datePart = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
                    const timePart = `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
                    const time = `${datePart} ${timePart}`;

                    await fetch("http://localhost:8080/api/logger/logging", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${token}`
                        },
                        body: JSON.stringify({ user_name: actor, role, user_action, action_status, time })
                    });

                } catch (logError) {
                    console.error("Gagal mencatat log tambah user:", logError);
                }

                onAddSuccess(response.data);
            }

            setFormData({
                name: "",
                role: "Admin",
                username: "",
                password: "",
                confirmPassword: ""
            });
            onClose();

        } catch (error) {
            console.error("Error adding user:", error);

            if (error.response) {
                // Server responded with error status
                const serverMessage = error.response.data.message || error.response.data.error || "Unknown server error";
                alert(`Gagal menambahkan user: ${serverMessage}`);
            } else if (error.request) {
                // No response received
                alert("Gagal terhubung ke server. Periksa koneksi internet Anda.");
            } else {
                // Other errors
                alert("Terjadi kesalahan: " + error.message);
            }
        }
    };


    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 font-['Plus_Jakarta_Sans'] transition-opacity duration-300">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg mx-4">

                {/* Header Modal */}
                <div className="flex items-center justify-between p-6 border-b">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#E7EBF1] flex items-center justify-center">
                            <IconUsers size={24} className="text-[#023048]" />
                        </div>
                        <h2 className="text-xl font-semibold text-[#023048]">Tambah Akun Baru</h2>
                    </div>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                        <IconX size={24} />
                    </button>
                </div>

                {/* Body/Form Modal */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4">

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1 text-left">Nama  <span className="text-red-500">*</span></label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:ring-[#023048] focus:border-[#023048]"
                            placeholder="Nama"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1 text-left">Peran  <span className="text-red-500">*</span></label>
                        <select
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:ring-[#023048] focus:border-[#023048]"
                            required
                        >
                            <option value="admin">admin</option>
                            <option value="super admin">super admin</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1 text-left">Username  <span className="text-red-500">*</span></label>
                        <input
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:ring-[#023048] focus:border-[#023048]"
                            placeholder="Username"
                            required
                        />
                    </div>

                    {/* Password Fields */}
                    <div className="flex space-x-4">
                        <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-700 mb-1 text-left">Password Baru  <span className="text-red-500">*</span></label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:ring-[#023048] focus:border-[#023048] pr-10"
                                    placeholder="********"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
                                    aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
                                >
                                    {showPassword ? <IconEyeOff size={18} /> : <IconEye size={18} />}
                                </button>
                            </div>
                        </div>

                        <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-700 mb-1 text-left">Konfirmasi Password  <span className="text-red-500">*</span></label>
                            <div className="relative">
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:ring-[#023048] focus:border-[#023048] pr-10"
                                    placeholder="********"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
                                    aria-label={showConfirmPassword ? "Sembunyikan konfirmasi password" : "Tampilkan konfirmasi password"}
                                >
                                    {showConfirmPassword ? <IconEyeOff size={18} /> : <IconEye size={18} />}
                                </button>
                            </div>
                        </div>
                    </div>
                </form>

                {/* Footer Modal */}
                <div className="flex justify-end gap-3 p-6 border-t bg-gray-50 rounded-b-xl">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-100 transition duration-150"
                    >
                        Batal
                    </button>
                    <button
                        type="submit"
                        onClick={handleSubmit}
                        className="px-4 py-2 bg-[#023048] text-white rounded-lg hover:bg-[#023048]/90 transition duration-150"
                    >
                        Tambah Akun
                    </button>
                </div>
            </div>
        </div>
    );
};

// --- KOMPONEN UTAMA USER CONTROL ---
export default function UserControl() {
    authCheckSA();
    const [showLogout, setShowLogout] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);
    const [viewMode, setViewMode] = useState('list');

    // Data Dummy
    const [users, setUsers] = useState([]);
    const [profileData, setProfileData] = useState({
        user_id: "",
        username: "",
        name: "",
        role: "",
        photo: "https://i.ibb.co/C07X0Q0/dummy-profile.jpg",
    });
    const fetchProfileList = async () => {
        const token = localStorage.getItem('token')
        try {
            const response = await axios.get(`http://localhost:8080/api/profile/getAllUser`, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            });
            setUsers(response.data);
        } catch (error) {
            console.error("Gagal mengambil data profil:", error);
        }
    };
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
            }
        }
        fetchProfile();
        fetchProfileList();
        console.log(users);

    }, []);
    // STATE NOTIFIKASI
    const [showSuccessNotification, setShowSuccessNotification] = useState(false);
    const [notificationMessage, setNotificationMessage] = useState("");

    const navigate = useNavigate();

    // --- HANDLERS UTAMA ---
    const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);
    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
    const openAddModal = () => setIsAddModalOpen(true);
    const closeAddModal = () => setIsAddModalOpen(false);
    const closeNotification = () => setShowSuccessNotification(false);

    // Buka Modal Hapus Konfirmasi
    const openDeleteModal = (user) => {
        setUserToDelete(user);
        setIsDeleteModalOpen(true); // INI YANG MUNCULKAN MODAL KUSTOM TAILWIND
    };

    // Tutup Modal Hapus Konfirmasi
    const closeDeleteModal = () => {
        setIsDeleteModalOpen(false);
        setUserToDelete(null);
    };

    // Proses Konfirmasi Hapus Akun
    const handleConfirmDelete = async () => {
        if (!userToDelete) return;

        try {
            const token = localStorage.getItem('token');

            // 1️⃣ DELETE user
            await axios.delete(
                `http://localhost:8080/api/profile/userInfo?user_id=${userToDelete.user_id}`,
                {
                    headers: { "Authorization": `Bearer ${token}` }
                }
            );

            // 2️⃣ Logging Activity
            const userk = JSON.parse(localStorage.getItem('user'));

            const role = userk.role;
            const user_name = userk.username || userk.name;
            const user_action = `user berhasil menghapus akun user ${userToDelete.username}`;
            const action_status = "berhasil";

            const now = new Date();
            const pad = (n) => n.toString().padStart(2, "0");
            const datePart = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
            const timePart = `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
            const time = `${datePart} ${timePart}`;

            await fetch("http://localhost:8080/api/logger/logging", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ user_name, role, user_action, action_status, time })
            });

            // 3️⃣ Update list user di frontend tanpa reload
            setUsers(prev => prev.filter(u => u.user_id !== userToDelete.user_id));

            // 4️⃣ Notifikasi berhasil
            setNotificationMessage(`Akun ${userToDelete.username} berhasil dihapus.`);
            setShowSuccessNotification(true);

            // 5️⃣ Tutup modal
            closeDeleteModal();

        } catch (error) {
            console.error("Error deleting user:", error);
            alert("Gagal menghapus user.");
        }
    };



    // Handler untuk menampilkan notifikasi setelah sukses tambah
    const handleAddUserSuccess = async (newUser) => {
        setIsAddModalOpen(false);

        setNotificationMessage(`Akun ${newUser.username} berhasil ditambahkan.`);
        setShowSuccessNotification(true);

        await fetchProfileList(); // reload list setelah tambah user
    };



    // --- UTILITY CLASS ---
    const getSidebarItemClass = (isActive = false) => {
        const baseClasses =
            "flex items-center gap-3 p-3 rounded-md font-medium transition-colors text-sm";
        return isActive
            ? `${baseClasses} bg-[#E7EBF1] text-[#023048] font-semibold`
            : `${baseClasses} text-[#667790] hover:bg-gray-100`;
    };

    // --- RENDER COMPONENT ---
    return (
        <main className="flex min-h-screen bg-[#F5F6FA] font-['Plus_Jakarta_Sans']">
            <div className="flex h-full">
                <aside
                    className={`fixed inset-y-0 left-0 z-40 w-64 bg-white border-r transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"
                        } lg:static lg:h-auto`}
                >
                    <div className="flex flex-col h-full">
                        <div className="flex flex-col items-center p-6">
                            <div className="flex items-center gap-4 mb-6">
                                {/* Icon Bebas Pustaka */}
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
                            <a href="/ApprovalSA" className={getSidebarItemClass()}>
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
                {isSidebarOpen && (
                    <div
                        className="fixed inset-0 bg-black opacity-50 z-30 lg:hidden"
                        onClick={toggleSidebar}
                    ></div>
                )}

                {/* MAIN AREA */}
                 <div className="flex-1 flex flex-col h-screen">

                    {/* NAVBAR */}
                    <header className="w-full bg-white border-b p-4 flex justify-between lg:justify-end relative z-20 ">
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
                            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center border border-gray-300 overflow-hidden">
                                <IconUser size={24} className="text-gray-500" />
                            </div>
                            <p className="font-semibold text-sm text-[#023048] select-none hidden sm:block">
                                Hai, {profileData.name.split(" ")[0]}
                            </p>
                            <IconChevronDown size={18} className="text-gray-600" />
                        </div>
                        {isDropdownOpen && (
                            <div className="absolute right-4 top-full mt-2 w-64 bg-white rounded-md shadow-lg border z-30">
                                <div className="flex items-center gap-3 p-4 border-b">
                                    <IconUser size={24} className="text-gray-500" />
                                    <div>
                                        <p className="font-semibold text-sm text-[#023048] text-left">{profileData.name}</p>
                                        <p className="text-xs text-gray-500 text-left">{profileData.role}</p>
                                    </div>
                                </div>
                                <div className="p-2 space-y-1">
                                    <button
                                        onClick={() => navigate("/profileSA")}
                                        className="flex items-center gap-3 p-2 w-full text-left text-sm hover:bg-gray-100 rounded-md text-gray-700"
                                    >
                                        <IconUser size={18} />
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
                    {/* MAIN USER CONTROL CONTENT */}
                      <div className="flex-1 overflow-y-auto">
                        <div className=" h-screen">
                            <div className="p-4 sm:p-8">
                                <div className="flex justify-between items-start mb-6 ">

                                    <div>
                                        <h1 className="text-xl font-semibold text-[#023048] text-left">Kontrol Pengguna</h1>
                                        <p className="text-sm text-gray-600 mt-1">
                                            Fitur kontrol pengguna memungkinkan admin menambah dan menghapus akun pengguna sesuai kebutuhan sistem.
                                        </p>
                                    </div>

                                    <div className="flex-shrink-0 flex items-center mt-2 sm:mt-0">

                                        <div className="relative group">
                                            <button
                                                className="w-10 h-10 bg-[#023048] border rounded-lg flex text-white items-center justify-center active:scale-90 transition-transform duration-100 hover:bg-[#023048]/90"
                                                onClick={openAddModal}
                                            >
                                                <IconPlus size={24} />
                                            </button>
                                            <span className="absolute z-10 bottom-full mb-1 left-1/2 -translate-x-1/2 px-1 bg-[#EDEDED] text-gray-600 text-xs border border-gray-300 rounded-sm whitespace-nowrap opacity-0 
                                group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                                            >
                                                Tambah Pengguna Baru
                                            </span>
                                        </div>
                                        <div className="relative group">
                                            <button
                                                onClick={() => setViewMode('grid')}
                                                className={`w-10 h-10 border rounded-lg flex items-center justify-center ml-3 active:scale-90 transition-transform duration-100 ${viewMode === 'grid'
                                                    ? 'bg-[#023048] text-white border-[#023048] shadow-sm'
                                                    : 'bg-white text-[#667790] border-gray-300 hover:bg-gray-50'
                                                    } transition duration-150`}
                                                aria-label="Tampilan Grid"
                                            >
                                                <IconLayoutGrid size={20} />
                                            </button>
                                            <span className="absolute z-10 bottom-full mb-1 left-1/2 -translate-x-1/2 px-1 bg-[#EDEDED] text-gray-600 text-xs border border-gray-300 rounded-sm whitespace-nowrap opacity-0 
                                group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                                            >
                                                Ganti ke Grid
                                            </span>
                                        </div>
                                        <div className="relative group">
                                            <button
                                                onClick={() => setViewMode('list')}
                                                className={`w-10 h-10 border rounded-lg flex items-center justify-center ml-3 active:scale-90 transition-transform duration-100 ${viewMode === 'list'
                                                    ? 'bg-[#023048] text-white border-[#023048]'
                                                    : 'bg-white text-[#667790] border-gray-300 hover:bg-gray-50'
                                                    } transition duration-150`}
                                                aria-label="Tampilan List"
                                            >
                                                <IconList size={20} />
                                            </button>
                                            <span className="absolute z-10 bottom-full mb-1 left-1/2 -translate-x-1/2 px-1 bg-[#EDEDED] text-gray-600 text-xs border border-gray-300 rounded-sm whitespace-nowrap opacity-0 
                                group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                                            >
                                                Ganti ke Baris
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* USER CARD GRID/LIST */}
                                <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3' : 'grid-cols-1'}`}>
                                    {users.map(user => (
                                        <div
                                            key={user.user_id}
                                            className="relative bg-white w-full rounded-lg border border-[#EDEDED] py-4 px-2 flex items-center justify-between min-h-[120px]"
                                        >

                                            {/* 1. Garis Penanda Kiri (Visual Accent) */}
                                            <div className="absolute left-0 inset-y-0 w-2 bg-[#667790] rounded-l-lg"></div>

                                            {/* 2. Konten Utama Card: Kiri (Info) & Kanan (Aksi) */}
                                            <div className="flex items-center w-full pl-4">

                                                {/* KIRI: Info Pengguna (Avatar, Username, Detail) */}
                                                <div className="flex flex-col flex-grow">

                                                    {/* A. Avatar & Username */}
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-3xl bg-gray-200 flex items-center justify-center">
                                                            {/* Pastikan IconUser sudah di-import */}
                                                            <IconUser size={20} className="text-gray-500" />
                                                        </div>
                                                        <p className="font-semibold text-base text-[#023048]  text-left">
                                                            {user.username}
                                                        </p>
                                                    </div>

                                                    {/* B. Detail Nama & Role */}
                                                    <div className="mt-2  text-left">
                                                        <p className="text-sm font-medium text-gray-800">{user.name}</p>
                                                        <p className="text-xs text-[#667790] font-medium mt-1">
                                                            Role: <span className="font-semibold">{user.role}</span>
                                                        </p>
                                                    </div>
                                                </div>

                                                {/* KANAN: Tombol Aksi (Delete) */}
                                                <button
                                                    onClick={() => openDeleteModal(user)}
                                                    className="flex items-center justify-center w-10 h-10 bg-[#BE3A42] text-white rounded-full hover:bg-red-600 transition duration-150 shrink-0 mr-4">

                                                    <IconTrash size={20} />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                            </div>
                            <div className="sticky w-full z-50 mt-10">
                                <AppLayout></AppLayout>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            {/* MODAL TAMBAH AKUN BARU */}
            <AddUserModal
                isOpen={isAddModalOpen}
                onClose={closeAddModal}
                onAddSuccess={handleAddUserSuccess}
            />

            {/* MODAL KONFIRMASI HAPUS AKUN (POPP-UP MERAH) */}
            <DeleteConfirmModal
                isOpen={isDeleteModalOpen}
                onClose={closeDeleteModal}
                onConfirm={handleConfirmDelete}
                username={userToDelete ? userToDelete.username : ""}
            />

            {/* KOMPONEN NOTIFIKASI SUKSES */}
            <SuccessNotification
                isVisible={showSuccessNotification}
                message={notificationMessage}
                onClose={closeNotification}
            />

        </main>
    );
};
