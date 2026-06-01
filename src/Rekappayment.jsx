import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AppLayout from "./AppLayout";
import SidebarSA from "./sideBaradmin";
import "react-day-picker/dist/style.css";
import { IconSearch } from "@tabler/icons-react";
import HeaderSA from './HeaderSA';
import LogoutAlert from "./logoutConfirm";
import Footer from "./Footer";
import "./App.css";
import axios from "axios";
import { useAuthAdmin } from "../utils/authadmin";

const API_URL = `${import.meta.env.VITE_BACKEND_URL}`;

function Rekappayment() {
    const user = useAuthAdmin()

    const goto = useNavigate();

    const [showLogout,   setShowLogout]   = useState(false);
    const [loading,      setLoading]      = useState(true);
    const [profileImg]                    = useState({ name: "Loading...", role: "Admin" });
    const [profileData,  setProfileData]  = useState({ name: "Loading...", username: "Loading...", role: "Admin" });

    const [data,         setData]         = useState([]);
    const [dataLoading,  setDataLoading]  = useState(true);

    const [search,       setSearch]       = useState("");
    const [sortBy,       setSortBy]       = useState("latest");

    const [currentPage,  setCurrentPage]  = useState(1);
    const [rowsPerPage]                   = useState(10);
    const [total,        setTotal]        = useState(0);

    // =========================
    // FETCH PROFILE DARI LOCALSTORAGE
    // =========================
    useEffect(() => {
        const token = localStorage.getItem("token");

        if (!token) { goto("/login"); return; }
    }, [goto]);

    // =========================
    // FETCH PAYMENT DATA
    // =========================
    useEffect(() => {
        const fetchPaymentData = async () => {
            setDataLoading(true);
            try {
                const token = localStorage.getItem("token");

                const params = new URLSearchParams({
                    page:  currentPage,
                    limit: rowsPerPage,
                    sort:  sortBy,
                });
                if (search.trim()) params.append("search", search.trim());

                const response = await axios.get(
                    `${API_URL}/api/paymentSA?${params.toString()}`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );

                setData(response.data.data  || []);
                setTotal(response.data.total || response.data.data?.length || 0);

            } catch (error) {
                console.error("Gagal mengambil data payment:", error);
                setData([]);
            } finally {
                setDataLoading(false);
            }
        };

        const debounce = setTimeout(fetchPaymentData, 300);
        return () => clearTimeout(debounce);

    }, [currentPage, search, sortBy, rowsPerPage]);

    // =========================
    // SORT
    // =========================
    const handleSort = (value) => {
        setSortBy(value);
        setCurrentPage(1);
    };

    // =========================
    // PAGINATION
    // =========================
    const totalPages  = Math.max(1, Math.ceil(total / rowsPerPage));
    const maxVisible  = 5;
    let   pgStart     = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let   pgEnd       = pgStart + maxVisible - 1;
    if (pgEnd > totalPages) { pgEnd = totalPages; pgStart = Math.max(1, pgEnd - maxVisible + 1); }
    const pageNumbers = [];
    for (let i = pgStart; i <= pgEnd; i++) pageNumbers.push(i);

    const startIndex = data.length > 0 ? (currentPage - 1) * rowsPerPage + 1 : 0;
    const endIndex   = (currentPage - 1) * rowsPerPage + data.length;

    // =========================
    // STATUS BADGE
    // =========================
    const statusClass = (status) => {
        switch (status) {
            case "success":  return "bg-[#D9FBD9] text-[#4ABC4C]";
            case "pending":  return "bg-[#FFF4D6] text-[#D89B00]";
            case "expired":  return "bg-[#E5E5E5] text-[#666666]";
            default:         return "bg-[#FFE1E1] text-[#FF1515]";
        }
    };

    // =========================
    // RENDER
    // =========================
    return (
        <div className="flex min-h-screen bg-[#F5F6FA] font-['Plus_Jakarta_Sans']">

            <SidebarSA />

            <div className="flex-1 flex flex-col min-h-screen">

                <HeaderSA
                    profileData={user}
                    loading={loading}
                    profileImg={user?.name}
                    setShowLogout={setShowLogout}
                />

                {showLogout && <LogoutAlert onClose={() => setShowLogout(false)} />}

                <div className="flex-1 overflow-y-auto min-w-0">
                    <div className="p-8">

                        <div className="flex flex-col bg-white border border-[#DCDBDB] rounded-[10px] p-4 px-8">

                            {/* HEADER CARD */}
                            <div className="flex items-start justify-between gap-4 flex-wrap">
                                <div className="flex flex-col gap-1 text-left">
                                    <p className="text-lg font-semibold text-black">All Customer</p>
                                    <p className="text-xs text-[#D82F5A]">Members</p>
                                </div>

                                <div className="flex items-center gap-4 flex-wrap">
                                    {/* SEARCH */}
                                    <div className="flex items-center gap-2 bg-[#E7E7E7] px-3 py-2 rounded-xl w-64">
                                        <IconSearch size={18} className="text-gray-500" />
                                        <input
                                            type="text"
                                            placeholder="Search..."
                                            value={search}
                                            onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
                                            className="bg-transparent outline-none text-sm w-full placeholder:text-gray-400"
                                        />
                                    </div>

                                    {/* SORT */}
                                    <div className="flex items-center gap-3 bg-[#E7E7E7] px-4 py-2 rounded-2xl min-w-[180px]">
                                        <p className="text-sm whitespace-nowrap text-gray-600">Sort by:</p>
                                        <select
                                            onChange={(e) => handleSort(e.target.value)}
                                            className="bg-transparent outline-none font-medium text-sm w-full text-gray-700 cursor-pointer"
                                        >
                                            <option value="latest">Terbaru</option>
                                            <option value="oldest">Terlama</option>
                                            <option value="status">Status</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {/* TABLE */}
                            <div className="mt-9 overflow-x-auto">
                                {dataLoading ? (
                                    <div className="text-center py-16 text-gray-500 text-sm">Memuat data payment...</div>
                                ) : data.length === 0 ? (
                                    <div className="text-center py-16 text-gray-400 text-sm border rounded-lg">Tidak ada data payment</div>
                                ) : (
                                    <table className="min-w-full border-collapse">
                                        <thead>
                                            <tr className="border-b border-[#EDEDED]">
                                                <th className="p-2 font-normal text-[#333333] text-sm text-left">Nama</th>
                                                <th className="p-2 font-normal text-[#333333] text-sm text-left">Terbilang</th>
                                                <th className="p-2 font-normal text-[#333333] text-sm text-left">Metode Pembayaran</th>
                                                <th className="p-2 font-normal text-[#333333] text-sm text-left">Plan</th>
                                                <th className="p-2 font-normal text-[#333333] text-sm text-left">Status</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {data.map((item, index) => (
                                                <tr key={item.id ?? index} className="hover:bg-gray-50 transition">
                                                    <td className="py-3 px-4 text-sm text-[#616161] border-b border-[#EDEDED]">{item.name           || "N/A"}</td>
                                                    <td className="py-3 px-4 text-sm text-[#616161] border-b border-[#EDEDED]">{item.price          || "N/A"}</td>
                                                    <td className="py-3 px-4 text-sm text-[#616161] border-b border-[#EDEDED]">{item.payment_method || "N/A"}</td>
                                                    <td className="py-3 px-4 text-sm text-[#616161] border-b border-[#EDEDED]">{item.plan           || "N/A"}</td>
                                                    <td className="py-3 px-4 border-b border-[#EDEDED]">
                                                        <span className={`px-2 py-1 text-xs font-medium rounded-full inline-block ${statusClass(item.status)}`}>
                                                            {item.status || "unknown"}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                )}

                                {/* PAGINATION */}
                                {!dataLoading && data.length > 0 && (
                                    <div className="justify-between flex mt-5 flex-wrap gap-4">
                                        <p className="px-3 py-1 text-[#757575] text-xs">
                                            Showing data {startIndex} to {endIndex} of {total} entries
                                        </p>
                                        <div className="flex flex-wrap gap-2 justify-center items-center">
                                            <button
                                                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                                                disabled={currentPage === 1}
                                                className="px-3 py-1 text-[#757575] text-xs rounded disabled:opacity-40"
                                            >
                                                ← Sebelumnya
                                            </button>
                                            {pageNumbers.map((num) => (
                                                <button
                                                    key={num}
                                                    onClick={() => setCurrentPage(num)}
                                                    className={`px-3 py-1 rounded-md transition-all duration-150
                                                        ${currentPage === num
                                                            ? "border-2 bg-[#EDF1F3] border-[#667790] text-[#023048] shadow-md"
                                                            : "text-[#023048] text-xs hover:bg-[#F3F6F9]"
                                                        }`}
                                                >
                                                    {num}
                                                </button>
                                            ))}
                                            <button
                                                onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                                                disabled={currentPage >= totalPages}
                                                className="px-3 py-1 text-[#757575] text-xs rounded disabled:opacity-40"
                                            >
                                                Selanjutnya →
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <Footer></Footer>
                </div>
            </div>
        </div>
    );
}

export default Rekappayment;