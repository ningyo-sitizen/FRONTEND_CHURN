import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import SidebarSA from "./sideBaradmin";
import AppLayout from './AppLayout';
import LogoutAlert from "./logoutConfirm";
import HeaderSA from './HeaderSA';
import Footer from "./footer";
import { useAuthAdmin } from "../utils/authadmin";
import {
    IconBell,
    IconLogout,
    IconUser,
    IconChevronDown,
    IconBellRinging,
} from "@tabler/icons-react";

function EditTier() {
    const user = useAuthAdmin()
    const { id } = useParams();
    const navigate = useNavigate();

    const [title, setTitle]       = useState("");
    const [price, setPrice]       = useState("");
    const [descriptions, setDescriptions] = useState([{ id: 1, value: "" }]);
    const [profileImg, setProfileImg] = useState({ name: "Loading...", role: "Admin" });

    const [loading,      setLoading]      = useState(false);
    const [showLogout,   setShowLogout]   = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [profileData,  setProfileData]  = useState({
        name: "Loading...",
        username: "Loading...",
        role: "Admin",
    });

    const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

    // ── Fetch Profile ────────────────────────
    // ✅ GANTI dengan ini
    useEffect(() => {
        const token      = localStorage.getItem("token");
        const userString = localStorage.getItem("user");
        if (!token) { navigate("/login"); return; }
    }, [navigate]);

    // ── Fetch Tier by ID (edit mode) ─────────
    useEffect(() => {
        if (!id) return;

        axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/tier/${id}`)
            .then((res) => {
                setTitle(res.data.title);
                setPrice(String(res.data.price));

                const descs = Array.isArray(res.data.descriptions)
                    ? res.data.descriptions
                    : [];

                setDescriptions(
                    descs.length > 0
                        ? descs.map((item, index) => ({ id: index + 1, value: item }))
                        : [{ id: 1, value: "" }]
                );
            })
            .catch((err) => console.error("Gagal fetch tier:", err));
    }, [id]);

    // ── Descriptions Handlers ────────────────
    const handleAddField = () => {
        setDescriptions(prev => [...prev, { id: Date.now(), value: "" }]);
    };

    const handleRemoveField = (fieldId) => {
        if (descriptions.length <= 1) return;
        setDescriptions(prev => prev.filter(item => item.id !== fieldId));
    };

    const handleChange = (fieldId, value) => {
        setDescriptions(prev =>
            prev.map(item => item.id === fieldId ? { ...item, value } : item)
        );
    };

    // ── Submit (Create / Update) ─────────────
    const handleSubmit = async () => {
        if (!title.trim()) return alert("Nama tier wajib diisi");
        if (!price)        return alert("Harga wajib diisi");

        const payload = {
            title: title.trim(),
            price: parseInt(price),
            descriptions: descriptions.map(d => d.value).filter(v => v.trim() !== "")
        };

        try {
            if (id) {
                await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/tier/${id}`, payload);
            } else {
                await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/tier`, payload);
            }
            navigate("/pengaturan-tier");
        } catch (err) {
            console.error("Gagal simpan tier:", err.response?.data || err.message);
            alert("Gagal menyimpan data tier");
        }
    };

    return (
        <main className="bg-[#F5F6FA] min-h-screen font-['Plus_Jakarta_Sans']">
            <div className="flex">

                {/* ✅ Sidebar — sama dengan PengaturanTier & HistorySA */}
                <SidebarSA />

                <div className="flex-1 flex flex-col min-h-screen">

                    {/* HEADER */}
                     <HeaderSA
                        profileData={user}
                        loading={loading}
                        profileImg={user?.name}
                        setShowLogout={setShowLogout}
                    />

                    {showLogout && <LogoutAlert onClose={() => setShowLogout(false)} />}

                    {/* CONTENT */}
                    <div className="flex-1 overflow-y-auto">
                        <div className="p-8">

                            {/* SAVE BUTTON */}
                            <div className="flex justify-end mb-6">
                                <button
                                    onClick={handleSubmit}
                                    className="bg-[#D82F5A] px-6 py-2 text-sm font-semibold text-white rounded-lg active:scale-95 transition-all hover:bg-[#B2153D]"
                                >
                                    Simpan
                                </button>
                            </div>

                            {/* FORM CARD */}
                            <div className="relative bg-white w-full rounded-lg border border-[#EDEDED] px-8 py-8 flex flex-col min-w-[600px]">

                                <h3 className="text-xl font-semibold text-[#000000] mb-6 text-left">
                                    {id ? "Edit Tier" : "Tambah Tier"}
                                </h3>

                                {/* Nama Tier */}
                                <div className="mb-4 text-left">
                                    <label className="text-sm font-medium text-gray-700 block mb-1">
                                        Nama Tier <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        placeholder="Contoh: Premium"
                                        className="border border-gray-300 rounded-lg p-3 w-full text-sm outline-none focus:ring-2 focus:ring-[#023048]"
                                    />
                                </div>

                                {/* Harga */}
                                <div className="mb-4 text-left">
                                    <label className="text-sm font-medium text-gray-700 block mb-1">
                                        Harga <span className="text-red-500">*</span>
                                    </label>
                                    <div className="flex items-center border border-gray-300 rounded-lg p-3 w-full focus-within:ring-2 focus-within:ring-[#023048]">
                                        <span className="text-sm text-gray-500 mr-2">Rp</span>
                                        <input
                                            type="text"
                                            value={price ? Number(price).toLocaleString("id-ID") : ""}
                                            onChange={(e) => {
                                                const val = e.target.value.replace(/\D/g, "");
                                                setPrice(val);
                                            }}
                                            placeholder="0"
                                            className="outline-none w-full text-sm"
                                        />
                                    </div>
                                </div>

                                {/* Keterangan / Descriptions */}
                                <div className="text-left">
                                    <div className="flex items-center justify-between mb-2">
                                        <label className="text-sm font-medium text-gray-700">
                                            Keterangan
                                        </label>
                                        <div className="flex gap-2">
                                            <button
                                                type="button"
                                                onClick={handleAddField}
                                                className="w-8 h-8 rounded-lg bg-[#B2153D] text-white flex items-center justify-center text-lg font-semibold hover:scale-105 active:scale-95 transition-all"
                                            >
                                                +
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveField(descriptions[descriptions.length - 1].id)}
                                                disabled={descriptions.length <= 1}
                                                className="w-8 h-8 rounded-lg border border-[#B2153D] text-[#B2153D] flex items-center justify-center text-lg font-semibold hover:scale-105 active:scale-95 transition-all disabled:opacity-40"
                                            >
                                                -
                                            </button>
                                        </div>
                                    </div>

                                    {descriptions.map((item) => (
                                        <div
                                            key={item.id}
                                            className="flex items-center border border-gray-300 rounded-lg p-3 w-full focus-within:ring-2 focus-within:ring-[#E48CA3] mb-3"
                                        >
                                            <input
                                                type="text"
                                                placeholder="Masukkan keterangan..."
                                                value={item.value}
                                                onChange={(e) => handleChange(item.id, e.target.value)}
                                                className="outline-none w-full text-sm"
                                            />
                                        </div>
                                    ))}
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

export default EditTier;