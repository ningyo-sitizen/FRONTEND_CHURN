import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import authCheck from "./authCheck";
import axios from "axios";
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
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nama*</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-[#023048] focus:border-[#023048]"
                            placeholder="Nama"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Peran*</label>
                        <select
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-[#023048] focus:border-[#023048]"
                            required
                        >
                            <option value="admin">admin</option>
                            <option value="Super admin">super admin</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Username*</label>
                        <input
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-[#023048] focus:border-[#023048]"
                            placeholder="Username"
                            required
                        />
                    </div>

                    {/* Password Fields */}
                    <div className="flex space-x-4">
                        <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Password Baru*</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-[#023048] focus:border-[#023048] pr-10"
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
                            <label className="block text-sm font-medium text-gray-700 mb-1">Konfirmasi Password*</label>
                            <div className="relative">
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-[#023048] focus:border-[#023048] pr-10"
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
const UserControl = () => {
    authCheck();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);
    const [viewMode, setViewMode] = useState('grid');

    // Data Dummy
    const [users, setUsers] = useState([]);
    const [profileData, setProfileData] = useState({
        user_id: "",
        username: "",
        name: "",
        role: "",
        photo: "https://i.ibb.co/C07X0Q0/dummy-profile.jpg",
    });

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
        const fetchProfileList = async () => {
            const token = localStorage.getItem('token')
            try {
                // Ganti URL sesuai endpoint backend Anda
                const response = await axios.get(`http://localhost:8080/api/profile/getAllUser`, {
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    }
                });

                setUsers(response.data);


            } catch (error) {
                console.error("Gagal mengambil data profil:", error);
                // Tampilkan pesan default jika gagal

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

            // ✅ DELETE request
            await axios.delete(
                `http://localhost:8080/api/profile/userInfo?user_id=${userToDelete.user_id}`,
                {
                    headers: { "Authorization": `Bearer ${token}` }
                }
            );

            // Update UI
            setUsers(users.filter(user => user.user_id !== userToDelete.user_id));
            closeDeleteModal();

            setNotificationMessage(`Akun ${userToDelete.username} berhasil dihapus.`);
            setShowSuccessNotification(true);

        } catch (error) {
            console.error("Error deleting user:", error);
            alert("Gagal menghapus user.");
        }
    };

    // Handler untuk menampilkan notifikasi setelah sukses tambah
    const handleAddUserSuccess = (newUser) => {
        // Tambahkan user baru ke state users
        setUsers(prevUsers => [...prevUsers, newUser]);

        setIsAddModalOpen(false);
        setNotificationMessage(`Akun ${newUser.username} berhasil ditambahkan.`);
        setShowSuccessNotification(true);
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
        <div className="flex min-h-screen bg-[#F5F6FA] font-['Plus_Jakarta_Sans']">

            {/* SIDEBAR */}
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
                        <a href="/dashboard" className={getSidebarItemClass()}>
                            <IconHome size={20} />
                            Dashboard
                        </a>
                        <a href="/analytic" className={getSidebarItemClass()}>
                            <IconChartBar size={20} />
                            Data Analitik
                        </a>
                        <a href="/konfirmasi" className={getSidebarItemClass()}>
                            <IconBell size={20} />
                            Konfirmasi Data
                        </a>
                        <a href="/user-control" className={getSidebarItemClass(true)}>
                            <IconUsers size={20} />
                            User Control
                        </a>
                        <a href="/history" className={getSidebarItemClass()}>
                            <IconHistory size={20} />
                            History
                        </a>
                    </nav>
                </div>
            </aside>

            {/* OVERLAY */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black opacity-50 z-30 lg:hidden"
                    onClick={toggleSidebar}
                ></div>
            )}

            {/* MAIN AREA */}
            <div className="flex-1 lg:ml-0">

                {/* NAVBAR */}
                <header className="w-full bg-white border-b p-4 flex justify-between lg:justify-end relative z-20">
                    <button
                        className="lg:hidden text-[#023048]"
                        onClick={toggleSidebar}
                        aria-label="Toggle menu"
                    >
                        <IconMenu2 size={24} />
                    </button>
                    <div
                        className="flex items-center gap-2 cursor-pointer pr-4 relative"
                        onClick={toggleDropdown}
                    >
                        <IconChevronDown size={18} className="text-gray-600" />
                        <p className="font-semibold text-sm text-[#023048] select-none hidden sm:block">
                            Hai, {profileData.name.split(" ")[0]}
                        </p>
                        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center border border-gray-300 overflow-hidden">
                            <IconUser size={24} className="text-gray-500" />
                        </div>
                    </div>
                    {isDropdownOpen && (
                        <div className="absolute right-4 top-full mt-2 w-64 bg-white rounded-md shadow-lg border z-30">
                            <div className="flex items-center gap-3 p-4 border-b">
                                <IconUser size={24} className="text-gray-500" />
                                <div>
                                    <p className="font-semibold text-sm text-[#023048]">
                                        {profileData.name}
                                    </p>
                                    <p className="text-xs text-gray-500">{profileData.role}</p>
                                </div>
                            </div>
                            <div className="p-2 space-y-1">
                                <button
                                    onClick={() => navigate("/profile")}
                                    className="flex items-center gap-3 p-2 w-full text-left text-sm hover:bg-gray-100 rounded-md text-gray-700"
                                >
                                    <IconUser size={18} />
                                    Profile
                                </button>
                                <a
                                    href="/logout"
                                    className="flex items-center gap-3 p-2 text-sm text-red-600 hover:bg-red-50 rounded-md"
                                >
                                    <IconLogout size={18} />
                                    Keluar
                                </a>
                            </div>
                        </div>
                    )}
                </header>

                {/* MAIN USER CONTROL CONTENT */}
                <div className="p-4 sm:p-8">

                    <div className="flex justify-between items-start mb-6">
                        {/* Judul dan deskripsi */}
                        <div>
                            <h1 className="text-xl font-semibold text-[#023048]">Kontrol Pengguna</h1>
                            <p className="text-sm text-gray-600 mt-1">
                                Fitur User Control memungkinkan admin menambah dan menghapus akun pengguna sesuai kebutuhan sistem.
                            </p>
                        </div>
                        {/* IKON TAMPILAN DATA */}
                        <div className="flex-shrink-0 flex items-center mt-2 sm:mt-0">
                            {/* Tombol Grid */}
                            <button
                                onClick={() => setViewMode('grid')}
                                className={`w-10 h-10 border rounded-lg flex items-center justify-center ${viewMode === 'grid'
                                    ? 'bg-[#023048] text-white border-[#023048] shadow-sm'
                                    : 'bg-white text-[#667790] border-gray-300 hover:bg-gray-50'
                                    } transition duration-150`}
                                aria-label="Tampilan Grid"
                            >
                                <IconLayoutGrid size={20} />
                            </button>
                            {/* Tombol List */}
                            <button
                                onClick={() => setViewMode('list')}
                                className={`w-10 h-10 border rounded-lg flex items-center justify-center ml-3 ${viewMode === 'list'
                                    ? 'bg-[#023048] text-white border-[#023048] shadow-sm'
                                    : 'bg-white text-[#667790] border-gray-300 hover:bg-gray-50'
                                    } transition duration-150`}
                                aria-label="Tampilan List"
                            >
                                <IconList size={20} />
                            </button>
                        </div>
                    </div>

                    {/* USER CARD GRID/LIST */}
                    <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'grid-cols-1'}`}>
                        {users.map(user => (
                            <div key={user.user_id} className="relative bg-white rounded-md shadow-sm border border-gray-200 p-4 flex items-center justify-between min-h-[120px]">

                                {/* Garis biru di kiri */}
                                <div className="absolute left-0 top-0 bottom-0 w-2 bg-[#667790] rounded-l-md"></div>

                                {/* Kontainer Utama Konten */}
                                <div className="flex items-start w-full pl-2">

                                    {/* Kiri: Icon dan Teks Detail */}
                                    <div className="flex items-start flex-grow">
                                        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0 mr-3">
                                            <IconUser size={20} className="text-gray-500" />
                                        </div>
                                        <div>
                                            {/* Username */}
                                            <p className="font-semibold text-base text-[#023048] leading-tight mb-1">
                                                {user.username}
                                            </p>
                                            {/* Nama Panjang */}
                                            <p className="text-sm text-gray-700 leading-snug">
                                                {user.name}
                                            </p>
                                            {/* Role */}
                                            <p className="text-xs text-[#667790] font-medium leading-snug mt-0.5">
                                                Role : {user.role}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Kanan: Tombol Hapus */}
                                    <button
                                        onClick={() => openDeleteModal(user)}
                                        className="w-10 h-10 text-white bg-red-600 rounded-lg hover:bg-red-700 transition duration-150 flex-shrink-0 flex items-center justify-center ml-4 relative z-20"
                                        aria-label={`Hapus user ${user.username}`}
                                    >
                                        <IconTrash size={20} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* TOMBOL TAMBAH AKUN BARU */}
                    <div className="mt-8 flex justify-end">
                        <button
                            onClick={openAddModal}
                            className="flex items-center gap-2 px-6 py-3 bg-[#023048] text-white rounded-lg hover:bg-[#023048]/90 transition duration-150 font-normal"
                        >
                            <IconPlus size={20} />
                            Tambah Account Baru
                        </button>
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

        </div>
    );
};

export default UserControl;