import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AppLayout from "./AppLayout";
import SidebarSA from "./sideBaradmin";
import LogoutAlert from "./logoutConfirm";
import axios from "axios";
import HeaderSA from './HeaderSA';
import { useAuthAdmin } from "../utils/authadmin";
import { IconChevronDown, IconSearch } from "@tabler/icons-react";
import Footer from "./Footer";

const API_URL = `${import.meta.env.VITE_BACKEND_URL}`;

function UserManagement() {
    const user = useAuthAdmin()
    const goto = useNavigate();

    const [showLogout,  setShowLogout]  = useState(false);
    const [loading,     setLoading]     = useState(true);
    const [profileData, setProfileData] = useState({ name: "Loading...", username: "Loading...", role: "Admin" });
    const [profileImg]                  = useState({ name: "Loading...", role: "Admin" });

    const [banLoadingId,  setBanLoadingId]  = useState(null);
    const [data,          setData]          = useState([]);
    const [dataLoading,   setDataLoading]   = useState(true);
    const [search,        setSearch]        = useState("");
    const [isActive,      setIsActive]      = useState("");
    const [selectedSort,  setSelectedSort]  = useState("");
    const [showSort,      setShowSort]      = useState(false);
    const [currentPage,   setCurrentPage]   = useState(1);
    const [rowsPerPage]                     = useState(10);
    const [pagination,    setPagination]    = useState({ totalPages: 1, totalRecords: 0 });

    // ── ADMIN TABLE ───────────────────────────────
    const [adminData,         setAdminData]         = useState([]);
    const [adminLoading,      setAdminLoading]      = useState(true);
    const [adminSearch,       setAdminSearch]       = useState("");
    const [adminPage,         setAdminPage]         = useState(1);
    const [adminRowsPerPage]                        = useState(10);
    const [adminPagination,   setAdminPagination]   = useState({ totalPages: 1, totalRecords: 0 });
    const [adminBanLoadingId, setAdminBanLoadingId] = useState(null);
    const [firstAdminId,      setFirstAdminId]      = useState(null);

    useEffect(() => {
        const token      = localStorage.getItem("token");
        if (!token) { goto("/login"); return; }
    }, [goto]);

    useEffect(() => {
        const fetchUsers = async () => {
            setDataLoading(true);
            try {
                const token  = localStorage.getItem("token") || "";
                const params = new URLSearchParams({ page: currentPage, limit: rowsPerPage });
                if (search.trim())   params.append("search",    search.trim());
                if (isActive !== "") params.append("is_active", isActive);

                const res = await axios.get(
                    `${import.meta.env.VITE_BACKEND_URL}/api/user-management/users?${params}`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                setData(res.data.data.users || []);
                setPagination({
                    totalPages:   res.data.data.pagination?.total_pages || 1,
                    totalRecords: res.data.data.pagination?.total_rows  || 0,
                });
            } catch (err) {
                console.error("Gagal fetch users:", err);
                setData([]);
            } finally {
                setDataLoading(false);
            }
        };
        const t = setTimeout(fetchUsers, 300);
        return () => clearTimeout(t);
    }, [currentPage, search, isActive, rowsPerPage]);

    // =========================
    // FETCH ADMINS
    // =========================
    useEffect(() => {
        const fetchAdmins = async () => {
            setAdminLoading(true);
            try {
                const token  = localStorage.getItem("token") || "";
                const params = new URLSearchParams({ page: adminPage, limit: adminRowsPerPage });
                if (adminSearch.trim()) params.append("search", adminSearch.trim());

                const res = await axios.get(
                    `${API_URL}/api/user-management/admins?${params}`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                setAdminData(res.data.data.users || []);
                setFirstAdminId(res.data.data.firstAdminId ?? null);
                setAdminPagination({
                    totalPages:   res.data.data.pagination?.total_pages || 1,
                    totalRecords: res.data.data.pagination?.total_rows  || 0,
                });
            } catch (err) {
                console.error("Gagal fetch admins:", err);
                setAdminData([]);
            } finally {
                setAdminLoading(false);
            }
        };
        const t = setTimeout(fetchAdmins, 300);
        return () => clearTimeout(t);
    }, [adminPage, adminSearch, adminRowsPerPage]);

    // =========================
    // BAN / UNBAN USER
    // =========================
    const handleToggleBan = async (user) => {
        const token    = localStorage.getItem("token");
        const isBanned = user.is_active === 0;
        const action   = isBanned ? "unban" : "ban";
        if (!window.confirm(`Yakin ingin ${action} user "${user.name}"?`)) return;
        try {
            setBanLoadingId(user.id);
            await axios.patch(
                `${API_URL}/api/user-management/users/${user.id}/ban`,
                { ban: !isBanned },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setData((prev) => prev.map((u) =>
                u.id === user.id ? { ...u, is_active: isBanned ? 1 : 0 } : u
            ));
        } catch (err) {
            console.error("Gagal toggle ban user:", err);
            alert("Gagal melakukan aksi ban/unban. Silakan coba lagi.");
        } finally {
            setBanLoadingId(null);
        }
    };

    // =========================
    // BAN / UNBAN ADMIN
    // =========================
    const handleToggleBanAdmin = async (admin) => {
        if (admin.id === firstAdminId) {
            alert("Akun admin pertama tidak dapat di-ban.");
            return;
        }
        const token    = localStorage.getItem("token");
        const isBanned = admin.is_active === 0;
        const action   = isBanned ? "unban" : "ban";
        if (!window.confirm(`Yakin ingin ${action} admin "${admin.name}"?`)) return;
        try {
            setAdminBanLoadingId(admin.id);
            await axios.patch(
                `${API_URL}/api/user-management/admins/${admin.id}/ban`,
                { ban: !isBanned },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setAdminData((prev) => prev.map((a) =>
                a.id === admin.id ? { ...a, is_active: isBanned ? 1 : 0 } : a
            ));
        } catch (err) {
            const msg = err.response?.data?.message || "Gagal melakukan aksi ban/unban admin.";
            alert(msg);
            console.error("Gagal toggle ban admin:", err);
        } finally {
            setAdminBanLoadingId(null);
        }
    };

    // =========================
    // FILTER STATUS (USER)
    // =========================
    const handleFilterStatus = (value) => {
        if (value === "Active")      setIsActive("1");
        else if (value === "Banned") setIsActive("0");
        else                         setIsActive("");
        setCurrentPage(1);
    };

    // =========================
    // PAGINATION HELPERS
    // =========================
    const buildPages = (current, total) => {
        const maxVisible = 5;
        let s = Math.max(1, current - Math.floor(maxVisible / 2));
        let e = s + maxVisible - 1;
        if (e > total) { e = total; s = Math.max(1, e - maxVisible + 1); }
        const nums = [];
        for (let i = s; i <= e; i++) nums.push(i);
        return nums;
    };

    const userPages  = buildPages(currentPage, pagination.totalPages);
    const adminPages = buildPages(adminPage,    adminPagination.totalPages);

    const userStart  = data.length      > 0 ? (currentPage - 1) * rowsPerPage      + 1 : 0;
    const userEnd    = (currentPage - 1) * rowsPerPage      + data.length;
    const adminStart = adminData.length > 0 ? (adminPage    - 1) * adminRowsPerPage + 1 : 0;
    const adminEnd   = (adminPage    - 1) * adminRowsPerPage + adminData.length;

    // =========================
    // REUSABLE COMPONENTS
    // =========================

    // ── Status Badge ──
    const StatusBadge = ({ isActive }) => (
        <span className={`px-3 py-1 rounded-full text-xs font-medium
            ${isActive === 1
                ? "bg-[#D9FBD9] text-[#4ABC4C]"
                : "bg-[#FFE1E1] text-[#FF1515]"
            }`}>
            {isActive === 1 ? "Active" : "Inactive"}
        </span>
    );

    // ── Pagination ──
    const Pagination = ({ current, total, records, start, end, pages, onPrev, onNext, onPage }) => (
        <div className="flex flex-col lg:flex-row justify-between items-center mt-6 gap-4">
            <p className="text-xs text-[#757575]">
                Showing data {start} to {end} of {records} entries
            </p>
            <div className="flex items-center gap-2">
                <button
                    onClick={onPrev}
                    disabled={current === 1}
                    className="px-3 py-1 text-xs text-[#757575] disabled:opacity-40">
                    ← Sebelumnya
                </button>
                {pages.map((num) => (
                    <button key={num} onClick={() => onPage(num)}
                        className={`px-3 py-1 rounded-md text-xs transition-all
                            ${current === num
                                ? "bg-[#EDF1F3] border border-[#667790] font-medium"
                                : "hover:bg-[#F3F6F9] text-[#757575]"
                            }`}>
                        {num}
                    </button>
                ))}
                <button
                    onClick={onNext}
                    disabled={current >= total}
                    className="px-3 py-1 text-xs text-[#757575] disabled:opacity-40">
                    Selanjutnya →
                </button>
            </div>
        </div>
    );

    // ── Customer Table ──
    const CustomerTable = () => {
        if (dataLoading) return <div className="text-center py-16 text-gray-500 text-sm">Memuat data...</div>;
        if (data.length === 0) return (
            <div className="text-center py-16 text-gray-400 text-sm border rounded-lg">
                Tidak ada data ditemukan
            </div>
        );
        return (
            <table className="min-w-full border-collapse">
                <thead>
                    <tr className="border-b border-[#EDEDED]">
                        <th className="p-3 text-sm font-normal text-left text-gray-500">Nama</th>
                        <th className="p-3 text-sm font-normal text-left text-gray-500">Email</th>
                        <th className="p-3 text-sm font-normal text-left text-gray-500">Perusahaan</th>
                        <th className="p-3 text-sm font-normal text-left text-gray-500">Nama App</th>
                        <th className="p-3 text-sm font-normal text-left text-gray-500">Status</th>
                        <th className="p-3 text-sm font-normal text-left text-gray-500">Aksi</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((item) => {
                        const isBanned     = item.is_active === 0;
                        const isLoadingRow = banLoadingId === item.id;
                        return (
                            <tr key={item.id} className="hover:bg-gray-50 transition">
                                <td className="py-4 px-3 border-b text-sm text-gray-700">
                                    {item.name}{item.las_name ? ` ${item.las_name}` : ""}
                                </td>
                                <td className="py-4 px-3 border-b">
                                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-[#E7EBF1] text-[#023048]">
                                        {item.email}
                                    </span>
                                </td>
                                <td className="py-4 px-3 border-b text-sm text-gray-700">{item.nama_perusahaan || "-"}</td>
                                <td className="py-4 px-3 border-b text-sm text-gray-700">{item.nama_app || "-"}</td>
                                <td className="py-4 px-3 border-b">
                                    <StatusBadge isActive={item.is_active} />
                                </td>
                                <td className="py-4 px-3 border-b">
                                    <button
                                        onClick={() => handleToggleBan(item)}
                                        disabled={isLoadingRow}
                                        className={`px-3 py-1 text-xs font-medium rounded-md transition-all active:scale-95
                                            ${isLoadingRow
                                                ? "opacity-50 cursor-not-allowed bg-gray-300 text-gray-600"
                                                : isBanned
                                                    ? "bg-red-100 text-[#FF1515] hover:bg-red-200"
                                                    : "bg-[#D82F5A] text-white hover:bg-[#E48CA3]"
                                            }`}>
                                        {isLoadingRow ? "Loading..." : isBanned ? "Banned" : "Ban User"}
                                    </button>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        );
    };

    // ── Admin Table ──
    const AdminTable = () => {
        if (adminLoading) return <div className="text-center py-16 text-gray-500 text-sm">Memuat data...</div>;
        if (adminData.length === 0) return (
            <div className="text-center py-16 text-gray-400 text-sm border rounded-lg">
                Tidak ada data ditemukan
            </div>
        );
        return (
            <table className="min-w-full border-collapse">
                <thead>
                    <tr className="border-b border-[#EDEDED]">
                        <th className="p-3 text-sm font-normal text-left text-gray-500">Nama</th>
                        <th className="p-3 text-sm font-normal text-left text-gray-500">Email</th>
                        <th className="p-3 text-sm font-normal text-left text-gray-500">Perusahaan</th>
                        <th className="p-3 text-sm font-normal text-left text-gray-500">Nama App</th>
                        <th className="p-3 text-sm font-normal text-left text-gray-500">Status</th>
                        <th className="p-3 text-sm font-normal text-left text-gray-500">Aksi</th>
                    </tr>
                </thead>
                <tbody>
                    {adminData.map((item) => {
                        const isBanned      = item.is_active === 0;
                        const isFirstAdmin  = item.id === firstAdminId;
                        const isLoadingRow  = adminBanLoadingId === item.id;
                        return (
                            <tr key={item.id} className="hover:bg-gray-50 transition">
                                <td className="py-4 px-3 border-b text-sm text-gray-700">
                                    {item.name}{item.las_name ? ` ${item.las_name}` : ""}
                                </td>
                                <td className="py-4 px-3 border-b">
                                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-[#E7EBF1] text-[#023048]">
                                        {item.email}
                                    </span>
                                </td>
                                <td className="py-4 px-3 border-b text-sm text-gray-700">{item.nama_perusahaan || "-"}</td>
                                <td className="py-4 px-3 border-b text-sm text-gray-700">{item.nama_app || "-"}</td>
                                <td className="py-4 px-3 border-b">
                                    <StatusBadge isActive={item.is_active} />
                                </td>
                                <td className="py-4 px-3 border-b">
                                    {isFirstAdmin ? (
                                        <span className="px-3 py-1 text-xs font-medium rounded-md bg-gray-100 text-gray-400 cursor-not-allowed select-none">
                                            Terlindungi
                                        </span>
                                    ) : (
                                        <button
                                            onClick={() => handleToggleBanAdmin(item)}
                                            disabled={isLoadingRow}
                                            className={`px-3 py-1 text-xs font-medium rounded-md transition-all active:scale-95
                                                ${isLoadingRow
                                                    ? "opacity-50 cursor-not-allowed bg-gray-300 text-gray-600"
                                                    : isBanned
                                                        ? "bg-red-100 text-[#FF1515] hover:bg-red-200"
                                                        : "bg-[#D82F5A] text-white hover:bg-[#E48CA3]"
                                                }`}>
                                            {isLoadingRow ? "Loading..." : isBanned ? "Banned" : "Ban Admin"}
                                        </button>
                                    )}
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        );
    };

    // =========================
    // RENDER
    // =========================
    return (
        <main className="bg-[#F9FAFB] min-h-screen font-jakarta">
            <div className="flex">
                <SidebarSA />
                <div className="flex-1 flex flex-col min-h-screen">
                    <HeaderSA profileData={user} loading={loading} profileImg={user?.name} setShowLogout={setShowLogout} />
                    {showLogout && <LogoutAlert onClose={() => setShowLogout(false)} />}

                    <div className="flex-1 overflow-y-auto">
                        <div className="p-8">

                            {/* ── TITLE ── */}
                            <div className="flex items-center justify-between mb-8">
                                <div className="text-2xl font-semibold">User Management</div>
                            </div>

                            {/* ── TABEL CUSTOMER ── */}
                            <div className="bg-white border border-[#DCDBDB] rounded-[10px] mb-8 p-6">
                                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
                                    <p className="text-lg font-semibold text-black">All Customers</p>
                                    <div className="flex flex-col md:flex-row items-center gap-3">
                                        {/* Search */}
                                        <div className="flex items-center gap-2 bg-[#E7E7E7] px-3 py-2 rounded-xl w-64">
                                            <IconSearch size={18} className="text-gray-500 shrink-0" />
                                            <input
                                                type="text"
                                                placeholder="Cari nama / email..."
                                                value={search}
                                                onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
                                                className="bg-transparent outline-none text-sm w-full" />
                                        </div>
                                        {/* Filter dropdown */}
                                        <div className="relative">
                                            <button
                                                onClick={() => setShowSort(!showSort)}
                                                className="flex items-center justify-between gap-3 bg-[#E7E7E7] px-4 py-2 rounded-xl min-w-[160px]">
                                                <div className="flex items-center gap-1">
                                                    <p className="text-sm text-gray-500">Filter:</p>
                                                    <span className="font-medium text-sm text-gray-800">{selectedSort || "All"}</span>
                                                </div>
                                                <IconChevronDown size={16} className={`transition duration-200 text-gray-500 ${showSort ? "rotate-180" : ""}`} />
                                            </button>
                                            {showSort && (
                                                <div className="absolute top-full mt-1 w-full bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden z-50">
                                                    {["All", "Active", "Banned"].map((opt) => (
                                                        <button key={opt}
                                                            onClick={() => { setSelectedSort(opt); handleFilterStatus(opt); setShowSort(false); }}
                                                            className={`w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 transition
                                                                ${selectedSort === opt ? "text-[#D82F5A] font-medium" : "text-gray-700"}`}>
                                                            {opt}
                                                        </button>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className="overflow-x-auto">
                                    <CustomerTable />
                                    {!dataLoading && data.length > 0 && (
                                        <Pagination
                                            current={currentPage}
                                            total={pagination.totalPages}
                                            records={pagination.totalRecords}
                                            start={userStart}
                                            end={userEnd}
                                            pages={userPages}
                                            onPrev={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                                            onNext={() => setCurrentPage((p) => Math.min(p + 1, pagination.totalPages))}
                                            onPage={setCurrentPage}
                                        />
                                    )}
                                </div>
                            </div>

                            {/* ── TABEL ADMIN ── */}
                            <div className="bg-white border border-[#DCDBDB] rounded-[10px] mb-20 p-6">
                                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
                                    {/* Kiri: judul */}
                                    <p className="text-lg font-semibold text-black">All Admin</p>

                                    {/* Kanan: tombol + search sejajar */}
                                    <div className="flex items-center gap-3">
                                        <div className="flex items-center gap-2 bg-[#E7E7E7] px-3 py-2 rounded-xl w-64">
                                            <IconSearch size={18} className="text-gray-500 shrink-0" />
                                            <input
                                                type="text"
                                                placeholder="Cari nama / email admin..."
                                                value={adminSearch}
                                                onChange={(e) => { setAdminSearch(e.target.value); setAdminPage(1); }}
                                                className="bg-transparent outline-none text-sm w-full" />
                                        </div>
                                        <button
                                            onClick={() => goto("/TambahAdm")}
                                            className="px-4 py-2 bg-[#D82F5A] text-white text-sm rounded-lg hover:bg-[#E48CA3] transition active:scale-95 whitespace-nowrap">
                                            + Tambah Admin
                                        </button>
                                    </div>
                                </div>
                                <div className="overflow-x-auto">
                                    <AdminTable />
                                    {!adminLoading && adminData.length > 0 && (
                                        <Pagination
                                            current={adminPage}
                                            total={adminPagination.totalPages}
                                            records={adminPagination.totalRecords}
                                            start={adminStart}
                                            end={adminEnd}
                                            pages={adminPages}
                                            onPrev={() => setAdminPage((p) => Math.max(p - 1, 1))}
                                            onNext={() => setAdminPage((p) => Math.min(p + 1, adminPagination.totalPages))}
                                            onPage={setAdminPage}
                                        />
                                    )}
                                </div>
                            </div>

                        </div>
                        
                    </div>
                    <Footer></Footer>
                </div>
            </div>      
        </main>
    );
}

export default UserManagement;