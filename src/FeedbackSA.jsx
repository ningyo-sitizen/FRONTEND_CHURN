import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AppLayout from "./AppLayout";
import SidebarSA from "./sideBaradmin";
import LogoutAlert from "./logoutConfirm";
import axios from "axios";
import HeaderSA from './HeaderSA';
import { useAuthAdmin } from "../utils/authadmin";
import { IconChevronDown, IconSearch } from "@tabler/icons-react";
import Footer from "./footer";

const API_URL = `${import.meta.env.VITE_BACKEND_URL}`;

// =========================
// HELPER: STAR RATING
// =========================
const StarRating = ({ rating }) => (
    <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
            <svg key={star} xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24"
                fill={star <= rating ? "#d3d606" : "#e5e7eb"}>
                <path d="M12 3l2.9 6.26l6.9 .6l-5.2 4.73l1.55 6.81l-6.15 -3.56l-6.15 3.56l1.55 -6.81l-5.2 -4.73l6.9 -.6z" />
            </svg>
        ))}
        <span className="text-xs text-gray-400 ml-1">{rating}/5</span>
    </div>
);

// =========================
// HELPER: FORMAT WAKTU
// =========================
const formatTime = (isoString) => {
    if (!isoString) return "-";
    return new Date(isoString).toLocaleDateString("id-ID", {
        day: "numeric", month: "long", year: "numeric",
        hour: "2-digit", minute: "2-digit",
    });
};

// =========================
// KOMPONEN UTAMA
// =========================
function FeedBack() {
    const user = useAuthAdmin()
    const goto = useNavigate();

    const [showLogout, setShowLogout]     = useState(false);
    const [loading, setLoading]           = useState(true);
    const [profileImg]                    = useState({ name: "Loading...", role: "Admin" });
    const [profileData, setProfileData]   = useState({ name: "Loading...", username: "Loading...", role: "Admin" });
    const [data, setData]                 = useState([]);
    const [dataLoading, setDataLoading]   = useState(true);
    const [search, setSearch]             = useState("");
    const [sortBy, setSortBy]             = useState("time");
    const [selectedSort, setSelectedSort] = useState("");
    const [sortOrder, setSortOrder]       = useState("DESC");
    const [showSort, setShowSort]         = useState(false);
    const [currentPage, setCurrentPage]   = useState(1);
    const [rowsPerPage]                   = useState(10);
    const [pagination, setPagination]     = useState({ totalPages: 1, totalRecords: 0 });

    // =========================
    // FETCH PROFILE DARI LOCALSTORAGE
    // =========================
    useEffect(() => {
        const token      = localStorage.getItem("token");

        if (!token) { goto("/login"); return; }
    }, [goto]);

    // =========================
    // FETCH FEEDBACK DARI API
    // =========================
    useEffect(() => {
        const fetchFeedback = async () => {
            setDataLoading(true);
            try {
                const token = localStorage.getItem("token") || "";

                const params = new URLSearchParams({
                    page:      currentPage,
                    limit:     rowsPerPage,
                    sortBy,
                    sortOrder,
                });
                if (search.trim()) params.append("search", search.trim());

                const response = await axios.get(
                    `${API_URL}/api/feedbackSA?${params.toString()}`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );

                // Backend mengembalikan: { data: [...], pagination: { totalPages, totalRecords, ... } }
                setData(response.data.data || []);
                setPagination({
                    totalPages:   response.data.pagination?.totalPages   || 1,
                    totalRecords: response.data.pagination?.totalRecords || 0,
                });

            } catch (error) {
                console.error("Gagal fetch feedback:", error);
                setData([]);
            } finally {
                setDataLoading(false);
            }
        };

        const debounce = setTimeout(fetchFeedback, 300);
        return () => clearTimeout(debounce);

    }, [currentPage, search, sortBy, sortOrder, rowsPerPage]);

    // =========================
    // SORT HANDLER
    // =========================
    const handleSort = (value) => {
        if (value === "Terbaru")      { setSortBy("time");   setSortOrder("DESC"); }
        else if (value === "Terlama") { setSortBy("time");   setSortOrder("ASC");  }
        else if (value === "Rating")  { setSortBy("rating"); setSortOrder("DESC"); }
        setCurrentPage(1);
    };

    // =========================
    // PAGINATION
    // =========================
    const { totalPages, totalRecords } = pagination;
    const maxVisible = 5;
    let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let end   = start + maxVisible - 1;
    if (end > totalPages) { end = totalPages; start = Math.max(1, end - maxVisible + 1); }
    const pageNumbers = [];
    for (let i = start; i <= end; i++) pageNumbers.push(i);
    const startIndex = data.length > 0 ? (currentPage - 1) * rowsPerPage + 1 : 0;
    const endIndex   = (currentPage - 1) * rowsPerPage + data.length;

    // =========================
    // RENDER
    // =========================
    return (
        <main className="bg-[#F9FAFB] min-h-screen font-jakarta">
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

                            <div className="text-left text-2xl font-semibold mb-8">
                                FeedBack Management
                            </div>

                            <div className="bg-white border border-[#DCDBDB] rounded-[10px] p-6">

                                {/* TOP BAR */}
                                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8">
                                    <div className="flex flex-col gap-1 text-left">
                                        <p className="text-lg font-semibold text-black">Feedback Customer</p>
                                        <p className="text-xs text-[#D82F5A]">Feedback for Admin</p>
                                    </div>

                                    <div className="flex flex-col md:flex-row items-center gap-4">
                                        {/* SEARCH */}
                                        <div className="flex items-center gap-2 bg-[#E7E7E7] px-3 py-2 rounded-xl w-64">
                                            <IconSearch size={18} className="text-gray-500" />
                                            <input
                                                type="text"
                                                placeholder="Cari email / topik / subjek..."
                                                value={search}
                                                onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
                                                className="bg-transparent outline-none text-sm w-full"
                                            />
                                        </div>

                                        {/* SORT */}
                                        <div className="relative">
                                            <button
                                                onClick={() => setShowSort(!showSort)}
                                                className="flex items-center justify-between gap-3 bg-[#E7E7E7] px-4 py-2 rounded-xl min-w-[180px]"
                                            >
                                                <div className="flex items-center gap-2">
                                                    <p className="text-sm text-gray-600">Sort by:</p>
                                                    <span className="font-medium text-sm text-gray-800">{selectedSort}</span>
                                                </div>
                                                <IconChevronDown size={18} className={`transition duration-200 ${showSort ? "rotate-180" : ""}`} />
                                            </button>

                                            {showSort && (
                                                <div className="absolute top-full mt-2 w-full bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden z-50">
                                                    {["Terbaru", "Terlama", "Rating"].map((option) => (
                                                        <button
                                                            key={option}
                                                            onClick={() => { setSelectedSort(option); handleSort(option); setShowSort(false); }}
                                                            className="w-full text-left px-4 py-3 text-sm text-[#D82F5A] transition hover:bg-gray-100"
                                                        >
                                                            {option}
                                                        </button>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* TABLE */}
                                <div className="overflow-x-auto">
                                    {dataLoading ? (
                                        <div className="text-center py-16 text-gray-500 text-sm">Memuat data feedback...</div>
                                    ) : data.length === 0 ? (
                                        <div className="text-center py-16 text-gray-400 text-sm border rounded-lg">Tidak ada feedback yang ditemukan</div>
                                    ) : (
                                        <table className="min-w-full border-collapse">
                                            <thead>
                                                <tr className="border-b border-[#EDEDED]">
                                                    <th className="p-3 text-sm font-normal text-left">Email</th>
                                                    <th className="p-3 text-sm font-normal text-left">Topik</th>
                                                    <th className="p-3 text-sm font-normal text-left">Subjek</th>
                                                    <th className="p-3 text-sm font-normal text-left">Isi Feedback</th>
                                                    <th className="p-3 text-sm font-normal text-left">Rating</th>
                                                    <th className="p-3 text-sm font-normal text-left">Waktu</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {data.map((item) => (
                                                    <tr key={item.feedback_id} className="hover:bg-gray-50 transition">
                                                        <td className="py-4 px-4 border-b text-sm text-gray-700">{item.email}</td>
                                                        <td className="py-4 px-4 border-b">
                                                            <span className="px-2 py-1 rounded-full text-xs font-medium bg-[#E7EBF1] text-[#023048]">
                                                                {item.topik}
                                                            </span>
                                                        </td>
                                                        <td className="py-4 px-4 border-b text-sm text-gray-700">{item.subjek}</td>
                                                        <td className="py-4 px-4 border-b text-sm text-gray-600 max-w-[250px]">
                                                            <p className="line-clamp-2" title={item.isi_feed}>{item.isi_feed}</p>
                                                        </td>
                                                        <td className="py-4 px-4 border-b"><StarRating rating={item.rating} /></td>
                                                        <td className="py-4 px-4 border-b text-xs text-gray-500 whitespace-nowrap">{formatTime(item.time)}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    )}

                                    {/* PAGINATION */}
                                    {!dataLoading && data.length > 0 && (
                                        <div className="flex flex-col lg:flex-row justify-between items-center mt-6 gap-4">
                                            <p className="text-xs text-[#757575]">
                                                Showing data {startIndex} to {endIndex} of {totalRecords} entries
                                            </p>
                                            <div className="flex items-center gap-2">
                                                <button onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                                                    disabled={currentPage === 1} className="px-3 py-1 text-xs disabled:opacity-40">
                                                    ← Sebelumnya
                                                </button>
                                                {pageNumbers.map((num) => (
                                                    <button key={num} onClick={() => setCurrentPage(num)}
                                                        className={`px-3 py-1 rounded-md text-xs ${currentPage === num ? "bg-[#EDF1F3] border border-[#667790]" : "hover:bg-[#F3F6F9]"}`}>
                                                        {num}
                                                    </button>
                                                ))}
                                                <button onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                                                    disabled={currentPage >= totalPages} className="px-3 py-1 text-xs disabled:opacity-40">
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
        </main>
    );
}

export default FeedBack;