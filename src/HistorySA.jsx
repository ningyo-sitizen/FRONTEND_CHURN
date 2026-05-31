// HistorySA.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import AppLayout from "./AppLayout";
import LogoutAlert from "./logoutConfirm";
import SidebarSA from "./sideBaradmin";
import HeaderSA from './HeaderSA';
import { useAuthAdmin } from "../utils/authadmin";
import {
    IconSearch, IconCalendar,
    IconX, IconChevronRight, IconChevronLeft,
} from "@tabler/icons-react";
import Footer from "./footer";

const API_URL = `${import.meta.env.VITE_BACKEND_URL}`;

// ─────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────
const monthNames = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember",
];

const formatDisplayDate = (date) => {
    if (!date) return "";
    return `${date.getDate()} ${monthNames[date.getMonth()]} ${date.getFullYear()}`;
};

const formatTimestampParts = (isoString) => {
    if (!isoString) return null;
    const date = new Date(isoString);
    const hari    = date.toLocaleDateString("id-ID", { weekday: "long" });
    const tanggal = date.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
    const waktu   = date
        .toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit", hour12: false, timeZone: "Asia/Jakarta" })
        .replace(/\./g, ":");
    return { hari, tanggal, waktu };
};

const formatDateISO = (date) => {
    if (!date) return "";
    const year  = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day   = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
};

const parseDateISO = (isoString) => {
    if (!isoString) return null;
    try {
        if (isoString.includes("T")) return new Date(isoString);
        const [year, month, day] = isoString.split("-").map(Number);
        return new Date(year, month - 1, day);
    } catch { return null; }
};


// ─────────────────────────────────────────────
// KOMPONEN: Modal Filter Tanggal
// ─────────────────────────────────────────────
const FilterModal = ({ isOpen, onClose, onApplyFilter, initialStart, initialEnd }) => {
    if (!isOpen) return null;

    const initStart = initialStart ? parseDateISO(formatDateISO(initialStart)) : null;
    const initEnd   = initialEnd   ? parseDateISO(formatDateISO(initialEnd))   : null;

    const [currentDate,   setCurrentDate]   = useState(initStart || new Date());
    const [selectedRange, setSelectedRange] = useState({ start: initStart, end: initEnd });
    const [startDateISO,  setStartDateISO]  = useState(initStart ? formatDateISO(initStart) : "");
    const [endDateISO,    setEndDateISO]    = useState(initEnd   ? formatDateISO(initEnd)   : "");

    useEffect(() => {
        setStartDateISO(selectedRange.start ? formatDateISO(selectedRange.start) : "");
        setEndDateISO(selectedRange.end     ? formatDateISO(selectedRange.end)   : "");
    }, [selectedRange]);

    const handleDayClick = (day) => {
        if (!day) return;
        const dayNormalized = parseDateISO(formatDateISO(day));
        if (!dayNormalized) return;
        const { start, end } = selectedRange;
        if (!start || (start && end)) {
            setSelectedRange({ start: dayNormalized, end: null });
            setCurrentDate(dayNormalized);
        } else if (dayNormalized.getTime() < start.getTime()) {
            setSelectedRange({ start: dayNormalized, end: start });
        } else {
            setSelectedRange({ start, end: dayNormalized });
        }
    };

    const getDaysInMonth = (date) => {
        const year  = date.getFullYear();
        const month = date.getMonth();
        const firstDayOfMonth = new Date(year, month, 1);
        const startDayIndex   = (firstDayOfMonth.getDay() + 6) % 7;
        const days = [];
        for (let i = 0; i < startDayIndex; i++) days.push(null);
        const lastDay = new Date(year, month + 1, 0).getDate();
        for (let i = 1; i <= lastDay; i++) days.push(new Date(year, month, i));
        return days;
    };

    const getCalendarDayClass = (day) => {
        let classes = "text-gray-900 hover:bg-gray-100 rounded-full";
        if (!day) return "text-gray-900";
        const { start, end } = selectedRange;
        const dayNorm = parseDateISO(formatDateISO(day));
        if (!dayNorm) return classes;
        const dayTime = dayNorm.getTime();
        if (!start || (start && !end)) {
            return start && dayTime === start.getTime()
                ? "bg-[#667790] text-white rounded-full"
                : "text-gray-900 hover:bg-gray-100 rounded-full";
        }
        const rangeStart = Math.min(start.getTime(), end.getTime());
        const rangeEnd   = Math.max(start.getTime(), end.getTime());
        if (dayTime >= rangeStart && dayTime <= rangeEnd) {
            const isStart = dayTime === rangeStart;
            const isEnd   = dayTime === rangeEnd;
            if (isStart && isEnd) classes = "bg-[#667790] text-white rounded-full";
            else if (isStart)    classes = "bg-[#667790] text-white rounded-l-full rounded-r-none";
            else if (isEnd)      classes = "bg-[#667790] text-white rounded-r-full rounded-l-none";
            else                 classes = "bg-[#AEC2E6] text-white rounded-none";
        } else {
            classes = "text-gray-900 hover:bg-gray-100 rounded-full";
        }
        return classes;
    };

    const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));

    const handleDateInputChange = (field, isoString) => {
        const newDate = isoString ? parseDateISO(isoString) : null;
        setSelectedRange((prev) => {
            const next = { ...prev };
            if (field === "start") {
                next.start = newDate;
                if (newDate && next.end && next.end.getTime() < newDate.getTime()) next.end = newDate;
            } else {
                next.end = newDate;
                if (newDate && next.start && next.start.getTime() > newDate.getTime()) next.start = newDate;
            }
            if (newDate) setCurrentDate(new Date(newDate.getFullYear(), newDate.getMonth(), 1));
            return next;
        });
        if (field === "start") setStartDateISO(isoString);
        if (field === "end")   setEndDateISO(isoString);
    };

    const handleApply = () => { onApplyFilter(selectedRange.start, selectedRange.end); onClose(); };

    const displayMonthYear  = `${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}`;
    const days              = getDaysInMonth(currentDate);
    const currentRangeText  = selectedRange.start
        ? `Rentang : ${formatDisplayDate(selectedRange.start)}${selectedRange.end ? ` - ${formatDisplayDate(selectedRange.end)}` : ""}`
        : "Rentang :";

    return (
        <div className={`absolute left-1/2 -translate-x-1/2 top-full mt-2 z-50 w-72 bg-white rounded-lg shadow-xl border p-4 font-['Plus_Jakarta_Sans'] origin-top transition-all duration-150
            ${isOpen ? "scale-100 opacity-100" : "scale-95 opacity-0 pointer-events-none"}`}>
            <div className="flex justify-between items-center pb-3 border-b mb-4">
                <h3 className="font-semibold text-base text-gray-800">Filter</h3>
                <button onClick={onClose} className="text-gray-500 hover:text-gray-700"><IconX size={20} /></button>
            </div>
            <div className="text-center">
                <div className="flex justify-between items-center mb-4 text-sm">
                    <button onClick={prevMonth} className="text-gray-600 hover:text-gray-800"><IconChevronLeft size={18} /></button>
                    <span className="font-semibold text-gray-800">{displayMonthYear}</span>
                    <button onClick={nextMonth} className="text-gray-600 hover:text-gray-800"><IconChevronRight size={18} /></button>
                </div>
                <div className="grid grid-cols-7 gap-1">
                    {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
                        <div key={i} className="font-medium text-gray-500 text-xs">{d}</div>
                    ))}
                    {days.map((day, index) => (
                        <div key={index} className="h-6 flex items-center justify-center">
                            {day && (
                                <button
                                    onClick={() => handleDayClick(day)}
                                    className={`w-full h-full flex items-center justify-center transition text-xs ${getCalendarDayClass(day)}`}
                                >
                                    {day.getDate()}
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            </div>
            <div className="mt-4 space-y-3">
                <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1 text-left">
                        Tanggal Mulai <span className="text-[#FF1515]">*</span>
                    </label>
                    <input type="date" value={startDateISO}
                        onChange={(e) => handleDateInputChange("start", e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-lg bg-white text-sm focus:border-[#023048] focus:ring-[#023048]" />
                </div>
                <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1 text-left">
                        Tanggal Selesai <span className="text-[#FF1515]">*</span>
                    </label>
                    <input type="date" value={endDateISO}
                        onChange={(e) => handleDateInputChange("end", e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-lg bg-white text-sm focus:border-[#023048] focus:ring-[#023048]" />
                    <p className="text-xs text-gray-500 mt-2 text-left">{currentRangeText}</p>
                </div>
            </div>
            <div className="flex justify-end gap-3 pt-3 mt-3 border-t">
                <button onClick={onClose}
                    className="px-3 py-1.5 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-100 transition duration-150 text-xs">
                    Batalkan
                </button>
                <button onClick={handleApply}
                    disabled={!selectedRange.start || !selectedRange.end ||
                        (selectedRange.start && selectedRange.end && selectedRange.start.getTime() > selectedRange.end.getTime())}
                    className="px-3 py-1.5 bg-[#023048] text-white rounded-lg hover:bg-[#023048]/90 transition duration-150 text-xs disabled:opacity-50">
                    Cari data
                </button>
            </div>
        </div>
    );
};


// ─────────────────────────────────────────────
// KOMPONEN UTAMA
// ─────────────────────────────────────────────
const History = () => {
    const goto = useNavigate();
    const user = useAuthAdmin()
    const [showLogout,     setShowLogout]     = useState(false);
    const [isFilterOpen,   setIsFilterOpen]   = useState(false);
    const [selectedSort,   setSelectedSort]   = useState("Terbaru");
    const [searchTerm,     setSearchTerm]     = useState("");
    const [debouncedSearch,setDebouncedSearch]= useState("");
    const [historyList,    setHistoryList]    = useState([]);
    const [isLoading,      setIsLoading]      = useState(true);
    const [dateFilter,     setDateFilter]     = useState({ start: null, end: null });
    const [loading,        setLoading]        = useState(true);
    const [profileData,    setProfileData]    = useState({ name: "Loading...", username: "Loading...", role: "Admin" });
    const [profileImg]                        = useState({ name: "Loading...", role: "Admin" });
    const [currentPage,    setCurrentPage]    = useState(1);
    const [pagination,     setPagination]     = useState({
        currentPage: 1, totalPages: 1, totalRecords: 0,
        hasNextPage: false, hasPrevPage: false, limit: 8,
    });

    const totalPages  = pagination.totalPages;
    const maxPage     = 5;
    const startPage   = Math.max(1, currentPage - Math.floor(maxPage / 2));
    const endPage     = Math.min(totalPages, startPage + maxPage - 1);
    const pageNumbers = Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);

    // ── Fetch Profile dari localStorage ─────
    useEffect(() => {
        const token      = localStorage.getItem("token");

        if (!token) { goto("/login"); return; }

    }, [goto]);

    // ── Debounce search ──────────────────────
    useEffect(() => {
        const t = setTimeout(() => setDebouncedSearch(searchTerm.trim()), 300);
        return () => clearTimeout(t);
    }, [searchTerm]);

    // ── Fetch Logs ───────────────────────────
    useEffect(() => {
        let isMounted = true;

        const fetchLogs = async () => {
            setIsLoading(true);
            try {
                const token = localStorage.getItem("token") || "";

                const params = new URLSearchParams();
                params.append("page",  currentPage);
                params.append("limit", pagination.limit);
                if (debouncedSearch) params.append("search", debouncedSearch);

                let sortBy    = "time";
                let sortOrder = "DESC";
                if      (selectedSort === "Terbaru") { sortBy = "time"; sortOrder = "DESC"; }
                else if (selectedSort === "Terlama") { sortBy = "time"; sortOrder = "ASC";  }
                else if (selectedSort === "A -> Z")  { sortBy = "user"; sortOrder = "ASC";  }
                else if (selectedSort === "Z -> A")  { sortBy = "user"; sortOrder = "DESC"; }

                params.append("sortBy",    sortBy);
                params.append("sortOrder", sortOrder);

                if (dateFilter.start && dateFilter.end) {
                    params.append("startDate", formatDateISO(dateFilter.start));
                    params.append("endDate",   formatDateISO(dateFilter.end));
                }

                const res = await fetch(
                    `${API_URL}/api/logger/logging?${params.toString()}`,
                    {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${token}`,
                        },
                    }
                );

                if (!res.ok) throw new Error(`HTTP ${res.status}: ${await res.text()}`);

                const result = await res.json();
                const rows   = result.data || result.rows || [];
                const paginationFromServer = result.pagination || {
                    currentPage, totalPages: 1, totalRecords: rows.length,
                    limit: pagination.limit, hasNextPage: false, hasPrevPage: false,
                };

                if (isMounted) {
                    const transformedData = rows.map((item, idx) => ({
                        id:        item.id || idx + 1 + ((paginationFromServer.currentPage - 1) * (paginationFromServer.limit || 0)),
                        name:      item.user      || item.name      || "-",
                        role:      item.role      ? item.role.toLowerCase() : "sistem",
                        timestamp: item.time      || item.timestamp || new Date().toISOString(),
                        activity:  item.user_action || item.activity || "",
                        photo:     item.photo     || null,
                    }));
                    setHistoryList(transformedData);
                    setPagination((prev) => ({ ...prev, ...paginationFromServer }));
                    setIsLoading(false);
                }
            } catch (err) {
                console.error("Error fetching log data:", err);
                if (isMounted) { setHistoryList([]); setIsLoading(false); }
            }
        };

        fetchLogs();
        return () => { isMounted = false; };
    }, [currentPage, debouncedSearch, selectedSort, dateFilter]);

    // ── Handlers ─────────────────────────────
    const handleApplyDateFilter = (start, end) => {
        setDateFilter({ start, end });
        setCurrentPage(1);
    };

    // ── Filter + Group ───────────────────────
    const filteredData = historyList.filter((item) => {
        if (!debouncedSearch) return true;
        const s = debouncedSearch.toLowerCase();
        return (
            (item.name     && item.name.toLowerCase().includes(s))     ||
            (item.role     && item.role.toLowerCase().includes(s))     ||
            (item.activity && item.activity.toLowerCase().includes(s))
        );
    });

    const groupedData = filteredData.reduce((acc, item) => {
        const t   = formatTimestampParts(item.timestamp);
        const key = t.tanggal;
        if (!acc[key]) acc[key] = { hari: t.hari, tanggal: t.tanggal, items: [] };
        acc[key].items.push({ ...item, waktu: t.waktu });
        return acc;
    }, {});

    // ─────────────────────────────────────────
    // RENDER
    // ─────────────────────────────────────────
    return (
        <main className="bg-[#F9FAFB] min-h-screen font-jakarta">
            <div className="flex">
                <SidebarSA />
                <div className="flex-1 flex flex-col min-h-screen">
                    <HeaderSA profileData={user} loading={loading} profileImg={user?.name} setShowLogout={setShowLogout} />
                    {showLogout && <LogoutAlert onClose={() => setShowLogout(false)} />}

                    <div className="flex-1 overflow-y-auto">
                        <div className="p-8">
                            <div className="mb-5">
                                <h1 className="text-2xl font-semibold text-left">Rekaman Aktivitas</h1>
                                <p className="text-sm text-[#9A9A9A] mt-1 text-left">
                                    Seluruh rekaman aktivitas pengguna dan administrator tersimpan dan tercatat secara berurutan di sini.
                                </p>
                            </div>
                            <div className="w-full border-b border-gray-200 mb-5" />

                            <div className="flex flex-col lg:flex-row gap-6">

                                {/* ── TIMELINE ── */}
                                <div className="flex-1">
                                    {isLoading ? (
                                        <div className="text-center py-20 text-gray-600">Memuat data histori...</div>
                                    ) : Object.values(groupedData).length > 0 ? (
                                        Object.values(groupedData).map((group, idx) => (
                                            <div key={idx} className="mb-10">
                                                <p className="text-sm font-semibold text-left">{group.hari}</p>
                                                <p className="text-sm text-gray-500 mb-4 text-left">{group.tanggal}</p>
                                                {group.items
                                                    .sort((a, b) => a.waktu.localeCompare(b.waktu))
                                                    .map((item) => (
                                                        <div key={item.id} className="flex items-start mt-2 relative space-y-3">
                                                            <p className="text-xs text-[#9A9A9A] w-16 shrink-0 mt-3">{item.waktu} WIB</p>
                                                            <div className="relative flex bg-white min-w-[300px] border border-gray-200 rounded-xs mx-5 w-full">
                                                                <div className="absolute left-0 top-0 bottom-0 w-2 bg-[#D82F5A] rounded-l-xs" />
                                                                <div className="flex flex-col gap-1 pl-6 pr-4 py-3 w-full">
                                                                    <div className="flex items-center gap-2">
                                                                        <p className="text-sm font-semibold text-[#023048]">Di edit oleh {item.name}</p>
                                                                        <span className={`text-xs px-2 py-0.5 rounded-md font-medium
                                                                            ${item.role === "super admin"
                                                                                ? "text-[#9B1C1C] bg-[#FDE8E8] border border-[#F5C6CB]"
                                                                                : item.role === "admin"
                                                                                    ? "text-[#023048] bg-[#E7EBF1] border border-[#C6D0DF]"
                                                                                    : "text-[#1C3A9B] bg-[#E8EDFD] border border-[#C6D0F5]"
                                                                            }`}>
                                                                            {item.role.charAt(0).toUpperCase() + item.role.slice(1)}
                                                                        </span>
                                                                    </div>
                                                                    <p className="text-xs text-gray-700 text-left">{item.activity}</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-center py-10 text-gray-500 bg-white rounded-lg border">
                                            Tidak ada aktivitas yang ditemukan
                                        </div>
                                    )}

                                    {/* PAGINATION */}
                                    <div className="flex flex-wrap gap-2 justify-center my-4 items-center">
                                        <button onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                                            disabled={currentPage === 1}
                                            className="px-3 py-1 text-xs text-[#757575] disabled:opacity-40">
                                            ← Sebelumnya
                                        </button>
                                        {pageNumbers.map((num) => (
                                            <button key={num} onClick={() => setCurrentPage(num)}
                                                className={`px-3 py-1 rounded-md text-xs transition-all
                                                    ${currentPage === num ? "bg-[#EDF1F3] border border-[#667790]" : "hover:bg-[#F3F6F9]"}`}>
                                                {num}
                                            </button>
                                        ))}
                                        <button onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                                            disabled={currentPage >= totalPages}
                                            className="px-3 py-1 text-xs text-[#757575] disabled:opacity-40">
                                            Selanjutnya →
                                        </button>
                                    </div>
                                </div>

                                {/* ── FILTER PANEL ── */}
                                <div className="flex flex-col p-4 bg-white w-full lg:w-80 shrink-0 border border-[#EDEDED] rounded-[10px] gap-3">
                                    <p className="font-semibold text-lg">Filter</p>
                                    <div className="relative w-full">
                                        <input type="text" placeholder="Cari data...."
                                            className="w-full p-2 pl-10 border border-[#B3B3B3] rounded text-xs text-black focus:ring-[#023048] focus:border-[#023048]"
                                            value={searchTerm}
                                            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }} />
                                        <IconSearch size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                    </div>
                                    <p className="font-regular text-sm mt-2">Tindakan</p>
                                    <div className="grid grid-cols-2 gap-2">
                                        {["Terbaru", "Terlama", "A -> Z", "Z -> A"].map((option) => (
                                            <label key={option}
                                                className={`flex items-center gap-2 px-3 py-2 text-xs cursor-pointer rounded-sm border transition
                                                    ${selectedSort === option
                                                        ? "border-[#D82F5A] bg-[#FBEAEE] text-[#D82F5A] font-semibold"
                                                        : "border-gray-300 text-gray-700 hover:bg-gray-50"}`}>
                                                <input type="radio" name="sort" checked={selectedSort === option}
                                                    onChange={() => setSelectedSort(option)} className="accent-[#D82F5A]" />
                                                {option}
                                            </label>
                                        ))}
                                    </div>
                                    <p className="font-regular text-sm mt-2">Waktu</p>
                                    <div className="relative">
                                        <button onClick={() => setIsFilterOpen(!isFilterOpen)}
                                            className="w-full flex items-center p-2 border border-[#B3B3B3] text-left text-sm text-black bg-white hover:bg-gray-50">
                                            Urutkan Waktu
                                            <IconCalendar size={20} className="text-gray-600 ml-auto" />
                                            {(dateFilter.start || dateFilter.end) && (
                                                <span className="w-2 h-2 bg-red-500 rounded-full absolute top-1 right-1" />
                                            )}
                                        </button>
                                        {isFilterOpen && (
                                            <FilterModal
                                                isOpen={isFilterOpen}
                                                onClose={() => setIsFilterOpen(false)}
                                                onApplyFilter={handleApplyDateFilter}
                                                initialStart={dateFilter.start}
                                                initialEnd={dateFilter.end}
                                            />
                                        )}
                                    </div>
                                </div>

                            </div>
                        </div>
                        <Footer></Footer>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default History;