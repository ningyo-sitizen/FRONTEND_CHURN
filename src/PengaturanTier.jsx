import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import SidebarSA from "./sideBaradmin";
import AppLayout from './AppLayout';
import LogoutAlert from "./logoutConfirm";
import { IconTrash, IconCheck } from "@tabler/icons-react";
import HeaderSA from './HeaderSA';
import { useAuthAdmin } from "../utils/authadmin";
import Footer from "./Footer";

const API_URL = `${import.meta.env.VITE_BACKEND_URL}`;

function PengaturanTier() {
    const navigate = useNavigate();
    const user = useAuthAdmin()
    const [tiers,        setTiers]        = useState([]);
    const [loading,      setLoading]      = useState(true);
    const [selectMode,   setSelectMode]   = useState(false);
    const [selectedIds,  setSelectedIds]  = useState([]);
    const [showLogout,   setShowLogout]   = useState(false);
    const [profileData,  setProfileData]  = useState({ name: "Loading...", username: "Loading...", role: "Admin" });
    const [profileImg]                    = useState({ name: "Loading...", role: "Admin" });

    const formatRupiah = (value) => {
        if (!value) return "Rp 0";
        return new Intl.NumberFormat("id-ID", {
            style: "currency", currency: "IDR", minimumFractionDigits: 0,
        }).format(value);
    };

    // =========================
    // FETCH PROFILE DARI LOCALSTORAGE
    // =========================
    useEffect(() => {
        const token      = localStorage.getItem("token");
        const userString = localStorage.getItem("user");

        if (!token) { navigate("/login"); return; }
    }, [navigate]);

    // =========================
    // FETCH TIERS
    // =========================
    useEffect(() => {
        const token = localStorage.getItem("token");
        axios.get(`${API_URL}/api/tier`, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then((res) => setTiers(res.data))
            .catch((err) => console.error("Gagal fetch tier:", err));
    }, []);

    // =========================
    // DELETE SINGLE
    // =========================
    const handleDeleteOne = async (id) => {
        if (!window.confirm("Yakin ingin menghapus tier ini?")) return;
        try {
            const token = localStorage.getItem("token");
            await axios.delete(`${API_URL}/api/tier/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setTiers(prev => prev.filter(item => item.id !== id));
        } catch (err) {
            console.error("Gagal menghapus tier:", err);
            alert("Gagal menghapus tier.");
        }
    };

    // =========================
    // DELETE SELECTED
    // =========================
    const handleDeleteSelected = async () => {
        if (selectedIds.length === 0) return;
        if (!window.confirm(`Yakin ingin menghapus ${selectedIds.length} tier?`)) return;
        try {
            const token = localStorage.getItem("token");
            await axios.delete(`${API_URL}/api/tier`, {
                headers: { Authorization: `Bearer ${token}` },
                data: { ids: selectedIds }
            });
            setTiers(prev => prev.filter(item => !selectedIds.includes(item.id)));
            setSelectedIds([]);
            setSelectMode(false);
        } catch (err) {
            console.error("Gagal bulk delete:", err);
            alert("Gagal menghapus tier yang dipilih.");
        }
    };

    // =========================
    // RENDER
    // =========================
    return (
        <main className="bg-[#F5F6FA] min-h-screen font-['Plus_Jakarta_Sans']">
            <div className="flex">

                <SidebarSA />

                <div className="flex-1 flex flex-col min-h-screen">

                    <HeaderSA
                        profileData={user}
                        loading={loading}
                        profileImg={user?.name}
                        setShowLogout={setShowLogout}
                    />

                    {showLogout && <LogoutAlert onClose={() => setShowLogout(false)} />}

                    <div className="flex-1 overflow-y-auto">
                        <div className="p-8">

                            {/* ACTION BUTTONS */}
                            <div className="flex gap-3 justify-end items-center mb-6">
                                <button
                                    onClick={() => navigate("/edit-tier")}
                                    className="bg-[#B2153D] p-2 text-sm font-semibold text-white rounded-lg hover:bg-[#C21B47] active:scale-95 transition-all"
                                >
                                    + Tambah
                                </button>

                                {selectMode ? (
                                    <div className="relative group">
                                        <button
                                            onClick={handleDeleteSelected}
                                            className="bg-[#D82F5A] p-2 text-sm font-semibold text-white rounded-lg active:scale-95 transition-all duration-300"
                                        >
                                            <IconTrash size={20} />
                                        </button>
                                        <div className="absolute bottom-[-20px] left-1/2 -translate-x-1/2 whitespace-nowrap p-1.5 bg-black text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none">
                                            Delete All
                                        </div>
                                    </div>
                                ) : (
                                    <button
                                        onClick={() => setSelectMode(true)}
                                        className="bg-black p-2 text-sm font-semibold text-white rounded-lg active:scale-95 transition-all duration-300"
                                    >
                                        Select
                                    </button>
                                )}
                            </div>

                            {/* TIER CARDS */}
                            <div className="grid gap-6 grid-cols-1">
                                {tiers.map((item) => (
                                    <div key={item.id} className="relative">

                                        {/* CHECKBOX */}
                                        <div className={`absolute left-[-10px] top-1/2 -translate-y-1/2 transition-all duration-300 ease-out z-10
                                            ${selectMode ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4 pointer-events-none"}`}
                                        >
                                            <input
                                                type="checkbox"
                                                className="w-5 h-5 accent-[#B2153D]"
                                                checked={selectedIds.includes(item.id)}
                                                onChange={(e) => {
                                                    setSelectedIds(prev =>
                                                        e.target.checked
                                                            ? [...prev, item.id]
                                                            : prev.filter(id => id !== item.id)
                                                    );
                                                }}
                                            />
                                        </div>

                                        {/* CARD */}
                                        <div className={`relative bg-white w-full rounded-lg border border-[#EDEDED] px-2 flex flex-col min-w-[900px] min-h-[160px] hover:scale-[1.02] transition-all duration-300 ${selectMode ? "ml-10" : "ml-0"}`}>

                                            <div className="absolute top-0 left-0 h-[90px] w-[29px] bg-[#B2153D] rounded-tl-lg" />

                                            <div className="flex items-start justify-between py-8 ml-12">
                                                <div className="flex items-start text-left text-2xl gap-8 font-semibold">
                                                    <h3 className="text-[#667790]">{item.title}</h3>
                                                    <h4 className="text-[#000000]">{formatRupiah(item.price)}</h4>
                                                </div>
                                                <div className="flex gap-3 mr-4">
                                                    <button
                                                        className="bg-white text-[#D82F5A] border border-[#D82F5A] py-2 px-8 text-sm active:scale-95 transition-all font-semibold rounded-lg"
                                                        onClick={() => navigate(`/edit-tier/${item.id}`)}
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        className="bg-[#D82F5A] p-2 text-sm font-semibold text-white active:scale-95 transition-all rounded-lg"
                                                        onClick={() => handleDeleteOne(item.id)}
                                                    >
                                                        <IconTrash size={20} />
                                                    </button>
                                                </div>
                                            </div>

                                            {(() => {
                                                let descs = [];
                                                try {
                                                    descs = typeof item.descriptions === "string"
                                                        ? JSON.parse(item.descriptions)
                                                        : item.descriptions;
                                                } catch { descs = []; }
                                                return descs?.map((desc, index) => (
                                                    <div key={index} className="flex gap-3 mb-4 ml-12 items-center">
                                                        <IconCheck size={20} className="text-[#B2153D]" />
                                                        <p className="font-light text-base">{desc}</p>
                                                    </div>
                                                ));
                                            })()}

                                            <div className="absolute bottom-0 right-0 h-[52px] w-[150px] bg-[#B2153D] rounded-br-lg" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <Footer></Footer>
                    </div>
                </div>
            </div>
        </main>
    );
}

export default PengaturanTier;