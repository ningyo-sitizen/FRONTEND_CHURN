import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import AppLayout from "./AppLayout";
import authCheckSA from "./authCheckSA";
import { DayPicker } from "react-day-picker";
import 'react-day-picker/dist/style.css';
import {
    IconHome,
    IconChartBar,
    IconBell,
    IconMenu2,
    IconLogout,
    IconUsers,
    IconHistory,
    IconUser,
    IconChevronDown,
    IconSelector,
    IconFile,
    IconBellRinging,
    IconFileDescription,
    IconCalendarWeek
} from "@tabler/icons-react";
import LogoutAlert from "./logoutConfirm";
import "./App.css";

import axios from "axios";

function Approval() {
    authCheckSA();
    const [activeTab, setActiveTab] = useState('pending');
    const [tabCounts, setTabCounts] = useState({
        pending: 0,
        approved: 0,
        all: 0
    });
    const [showLogout, setShowLogout] = useState(false);
    const [statusRange, setStatusRange] = useState();
    const [data, setData] = useState([]);
    const [total, setTotal] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const [approveProgress, setApproveProgress] = useState(0);
    const [isApproving, setIsApproving] = useState(false);

    function chunkArray(array, size) {
        const result = [];
        for (let i = 0; i < array.length; i += size) {
            result.push(array.slice(i, i + size));
        }
        return result;
    }


    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState("");
    const [checkedItems, setCheckedItems] = useState({});
    const [approvedAll, setApprovedAll] = useState(false);
    const [searchTimeout, setSearchTimeout] = useState(null);

    //gonta ganti tab
    const [changeTab, setChangeTab] = useState(); //ini buat render data base on folder
    const [changeTabColor, setChangeTabColor] = useState("#D8DFEC")

    const [sortBy, setSortBy] = useState('priority');
    const [sortOrder, setSortOrder] = useState('asc');
    const [rowsInput, setRowsInput] = useState(10);

    const fetchAllData = async () => {
        try {
            const token = localStorage.getItem("token");
            const res = await axios.get("http://localhost:8080/api/bebaspustaka/getmahasiswaITAll", {
                headers: { Authorization: `Bearer ${token}` },
                params: { search, sortBy, sortOrder }
            });
            return res.data?.data || [];
        } catch (err) {
            console.error("fetchAllData error:", err);
            return [];
        }
    };


    const fetchData = useCallback(async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem("token");

            const res = await axios.get("http://localhost:8080/api/bebaspustaka/dataMahasiswa", {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                params: {
                    search,
                    page: currentPage,
                    limit: rowsPerPage,
                    sortBy,
                    sortOrder,
                    statusFilter: activeTab // Tambahkan parameter ini
                }
            });

            const result = res.data?.data || [];

            const formatted = result.map(d => ({
                id: d.id,
                name: d.nama_mahasiswa || '',
                nim: d.nim ? String(d.nim) : '',
                status_peminjaman: d.STATUS_peminjaman || 0,
                status_bepus: d.STATUS_bebas_pustaka,
                institusi: d.institusi || '',
                program_studi: d.program_studi || ''
            }));

            setTotal(res.data.total || 0);
            setData(formatted);

            // Update tab counts
            setTabCounts({
                pending: res.data.pendingCount || 0,
                approved: res.data.approvedCount || 0,
                all: res.data.totalCount || 0
            });

        } catch (err) {
            console.error("Error fetchData:", err);
            alert("Gagal mengambil data: " + (err.response?.data?.message || err.message));
        } finally {
            setLoading(false);
        }
    }, [search, currentPage, rowsPerPage, sortBy, sortOrder, activeTab]);


    const handleTabChange = (tab) => {
        setActiveTab(tab);
        setCurrentPage(1);
        setCheckedItems({}); // Clear checkbox selection
        setApprovedAll(false);
    };

    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearch(value);

        // Clear previous timeout
        if (searchTimeout) clearTimeout(searchTimeout);

        // Set new timeout
        const timeout = setTimeout(() => {
            setCurrentPage(1); // Reset to first page when searching
        }, 500); // 500ms delay

        setSearchTimeout(timeout);
    };

    // const handleToggleFilter = () => {
    //     setShowFilter(prev => !prev);
    // };

    //GET login user
    const [profileData, setProfileData] = useState({
        name: "Loading...",
        username: "Loading...",
        role: "Admin",
    });


    //atur header + sidebar
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const getSidebarItemClass = (isActive = false) => {
        const baseClasses =
            "flex items-center gap-3 p-3 rounded-md font-medium transition-colors text-sm";
        return isActive
            ? `${baseClasses} bg-[#E7EBF1] text-[#023048] font-semibold`
            : `${baseClasses} text-[#667790] hover:bg-gray-100`;
    };

    const openAlertBepusAll = () => {
        setAlertBebasPustakaAll(true);
    }
    const approveAllRequest = async () => {
        try {
            const token = localStorage.getItem("token");
            const user = JSON.parse(localStorage.getItem('user'))
            const username = user.name;
            const allData = await fetchAllData();
            const selectedMahasiswa = allData.filter(item => checkedItems[item.id]);

            if (selectedMahasiswa.length === 0) {
                alert("Tidak ada data yang dicentang.");
                return;
            }

            // Mulai Progress
            setAlertBebasPustakaAll(false);
            setIsApproving(true);
            setApproveProgress(0);

            const chunks = chunkArray(selectedMahasiswa, 100);

            for (let i = 0; i < chunks.length; i++) {
                await axios.post(
                    "http://localhost:8080/api/bebaspustaka/approveAll",
                    { mahasiswa: chunks[i], username },
                    { headers: { Authorization: `Bearer ${token}` } }
                );

                const progressValue = Math.round(((i + 1) / chunks.length) * 100);
                setApproveProgress(progressValue);
            }

            alert("Berhasil Approve Semua!");
            fetchData();

        } catch (err) {
            alert("Gagal approve all: " + err.response?.data?.message);
        } finally {
            setIsApproving(false);
        }
    };


    const cekAll = async () => {
        const newValue = !approvedAll;
        setApprovedAll(newValue);

        const allData = await fetchAllData();

        const newChecked = {};

        allData.forEach(item => {
            const peminjaman = item.STATUS_peminjaman ?? item.status_peminjaman;
            const statusBepus = item.STATUS_bebas_pustaka ?? item.status_bepus;

            // ❗ hanya centang yang memenuhi syarat
            if (peminjaman === 1 && statusBepus === "pending") {
                newChecked[item.id] = newValue;
            }
        });

        setCheckedItems(newChecked);
    };

    const [showPopup, setShowPopup] = useState(false);
    const [showOutDatePopup, setShowOutDatePopup] = useState(false);



    const SetujuiSemuaBepus = () => {
        (!setAlertBebasPustakaAll)
        console.log("Setuju semua bepustaka clicked");
    };

    const handleSingleCheck = (id) => {
        setCheckedItems(prev => {
            const updated = { ...prev, [id]: !prev[id] };


            const allChecked = data.every(item => updated[item.id]);
            setApprovedAll(allChecked);

            return updated;
        });
    };


    //pagination
    const totalPages = Math.ceil(total / rowsPerPage);

    const pageNumbers = [];
    const maxVisible = 5;

    let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let end = start + maxVisible - 1;

    if (end > totalPages) {
        end = totalPages;
        start = Math.max(1, end - maxVisible + 1);
    }

    for (let i = start; i <= end; i++) pageNumbers.push(i);



    //next page
    const goto = useNavigate();
    const [selectedItem, setSelectedItem] = useState(null);
    const [alertBebasPustaka, setAlertBebasPustaka] = useState(false);

    const [alertBebasPustakaAll, setAlertBebasPustakaAll] = useState(false);
    const [showFilter, setShowFilter] = useState(false);
    const resetdate = useState(false);


    const [urutkanBy, setUrutkanBy] = useState(false);
    //sort by
    // Ganti fungsi sortAZ dan sortZA dengan ini:
    const handleSort = (sortType) => {
        setCurrentPage(1); // Reset ke halaman pertama saat sorting

        switch (sortType) {
            case 'priority':
                setSortBy('priority');
                setSortOrder('asc');
                break;
            case 'name_asc':
                setSortBy('name_asc');
                setSortOrder('asc');
                break;
            case 'name_desc':
                setSortBy('name_desc');
                setSortOrder('desc');
                break;
            case 'latest':
                setSortBy('latest');
                setSortOrder('desc');
                break;
            case 'oldest':
                setSortBy('oldest');
                setSortOrder('asc');
                break;
            default:
                setSortBy('priority');
                setSortOrder('asc');
        }
        setUrutkanBy(false); // Tutup dropdown setelah memilih
    };

    const approveSingle = async (item) => {
        try {
            const token = localStorage.getItem("token");
            const user = JSON.parse(localStorage.getItem('user'))
            const username = user.name;

            const res = await axios.post(
                "http://localhost:8080/api/bebaspustaka/approve",
                {
                    nim: item.nim,
                    nama_mahasiswa: item.name,
                    institusi: item.institusi,
                    program_studi: item.program_studi,
                    status_peminjaman: item.status_peminjaman,
                    username
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            alert("Berhasil di-approve!");
            fetchData(); // refresh table

        } catch (err) {
            alert("Gagal approve: " + err.response?.data?.message);
        }
    };

    const openAlertBepus = () => {
        setAlertBebasPustaka(true)
    }


    //pick date
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [rangeText, setRangeText] = useState('');

    const [range, setRange] = useState({
        from: undefined,
        to: undefined,
    });

    const formatDate = (date) => {
        if (!date) return "";
        const d = new Date(date);
        return d.toLocaleDateString("id-ID", { day: "2-digit", month: "long", year: "numeric" });
    };
    const handleExportPDF = () => {
        const token = localStorage.getItem("token");

        if (!token) {
            alert("Token tidak ditemukan. Silakan login ulang.");
            return;
        }

        window.open(
            `http://localhost:8080/api/bebaspustaka/export-pdf?token=${token}`,
        );
    };

    const handleRangeChange = (selectedRange) => {
        setRange(selectedRange);
        setStartDate(selectedRange?.from ? selectedRange.from.toISOString().slice(0, 10) : "");
        setEndDate(selectedRange?.to ? selectedRange.to.toISOString().slice(0, 10) : "");

        if (selectedRange?.from && selectedRange?.to) {
            setRangeText(`${formatDate(selectedRange.from)} - ${formatDate(selectedRange.to)}`);
        } else {
            setRangeText("");
        }
    };
    const handleStartInput = (e) => {
        const value = e.target.value;
        setStartDate(value);
        setRange((prev) => ({ ...prev, from: value ? new Date(value) : undefined }));

        if (value && endDate) {
            setRangeText(`${formatDate(value)} - ${formatDate(endDate)}`);
        } else {
            setRangeText("");
        }
    };
    const handleEndInput = (e) => {
        const value = e.target.value;
        setEndDate(value);
        setRange((prev) => ({ ...prev, to: value ? new Date(value) : undefined }));

        if (startDate && value) {
            setRangeText(`${formatDate(startDate)} - ${formatDate(value)}`);
        } else {
            setRangeText("");
        }
    };
    const date_change = async () => {
        try {
            const token = localStorage.getItem("token");

            const res = await fetch("http://localhost:8080/api/bebaspustaka/seTanggal", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    start_date: startDate,
                    end_date: endDate
                })
            });

            const data = await res.json();

            if (data.success) {
                alert("berhasil diperbaharui");
                fetchData();
            } else {
                alert("Gagal: " + data.message);

                if (data.status === "out_of_range") {
                    setStatusRange("out_of_range"); // 🔥 ini kuncinya
                } else {
                    setStatusRange("empty");
                }
            }


        } catch (error) {
            console.error("Error saving date:", error);
            alert("Terjadi kesalahan saat menyimpan tanggal");
        }

        setShowFilter(false);
    };


    //acc n
    const SetujuiBepus = async () => {
        setAlertBebasPustaka(false);

        const selectedIDs = Object.keys(checkedItems).filter(id => checkedItems[id]);

        if (selectedIDs.length === 0) {
            alert("Ga ada yang dicentang cuy 😭");
            return;
        }

        console.log("Update BEPUS ID:", selectedIDs);
    };

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    useEffect(() => {
        if (statusRange === "empty") {
            setShowPopup(true);
        }
        if (statusRange === "out_of_range") {
            setShowOutDatePopup(true);
        }
    }, [statusRange]);

    useEffect(() => {
        const fetchdate = async () => {
            const token = localStorage.getItem('token');
            const res = await axios.get(
                "http://localhost:8080/api/bebaspustaka/kompenDate",
                { headers: { Authorization: `Bearer ${token}` } }
            );

            const status = res.data.status?.toLowerCase();
            setStatusRange(status);

            if (res.data.start_date && res.data.end_date) {
                setStartDate(res.data.start_date);
                setEndDate(res.data.end_date);
            }
        };
        fetchdate();
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
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    return (
        <div className="flex min-h-screen bg-[#F5F6FA] font-['Plus_Jakarta_Sans']">
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
                            <a href="/dashboard" className={getSidebarItemClass()}>
                                <IconHome size={20} />
                                Dashboard
                            </a>
                            <a href="/analytic" className={getSidebarItemClass()}>
                                <IconChartBar size={20} />
                                Data Analitik
                            </a>
                            <a href="/Approval" className={getSidebarItemClass(true)}>
                                <IconFileDescription size={20} />
                                Konfirmasi Data
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

                <div className="flex-1 flex flex-col h-screen">
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
                            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center border border-gray-300 overflow-hidden">
                                <IconUser size={24} className="text-gray-500" />
                            </div>
                            <p className="font-semibold text-sm text-[#023048] select-none hidden sm:block">
                                Hai, {profileData.name}
                            </p>
                            <IconChevronDown size={18} className="text-gray-600" />

                        </div>
                        {isDropdownOpen && (
                            <div className="absolute right-4 top-full mt-2 w-64 bg-white rounded-md shadow-lg border z-30">
                                <div className="flex items-center gap-3 p-4 border-b">
                                    <IconUser size={24} className="text-gray-500" />
                                    <div>
                                        <p className="font-semibold text-sm text-[#023048] text-left">
                                            {profileData.name}
                                        </p>
                                        <p className="text-xs text-gray-500 text-left">{profileData.role}</p>
                                    </div>
                                </div>
                                <div className="p-2 space-y-1">
                                    <button
                                        onClick={() => goto("/profile")}
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

                    {/* isi konten */}
                    <div className="flex-1 overflow-y-auto">
                        <div className="p-4 md:p-8">
                            <p className="font-semibold text-xl text-black mb-2 mt-0 md:mt-2 text-left">Konfirmasi Data Bebas Pustaka</p>
                            <div className="flex items-start gap-1 text-[#9A9A9A] text-sm font-medium mb-3">
                                <svg xmlns="http://www.w3.org/2000/svg"
                                    width="18"
                                    height="18"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                    <path d="M9 7m-4 0a4 4 0 1 0 8 0a4 4 0 1 0 -8 0" />
                                    <path d="M3 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2" />
                                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                                    <path d="M21 21v-2a4 4 0 0 0 -3 -3.85" />
                                </svg>
                                <div className="flex">
                                    <p className="text-sm ml-1">{total} &nbsp;</p>
                                    <p className="text-sm mb-6">permohonan bebas pustaka</p>
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-2 items-center justify-between mt-4">
                                <div className="flex items-center text-[#616161] text-sm font-semibold">
                                    <p className="mr-2">Tunjukkan</p>
                                    <input
                                        type="number"
                                        min="1"
                                        max="100"
                                        value={rowsPerPage}
                                        onChange={(e) => {
                                            const value = parseInt(e.target.value);
                                            if (value >= 1 && value <= 100) {
                                                setRowsPerPage(value);
                                                setCurrentPage(1);
                                            }
                                        }}
                                        className="w-24 h-8 bg-transparent border border-[#E3E3E3] text-center focus:outline-none"
                                    />
                                    <p className="ml-2">Entitas</p>
                                </div>


                                <div className="flex items-center gap-3">
                                    <div className="flex border-2 border-[#E3E3E3] items-center justify-center">
                                        <div className="relative">
                                            <div className="border-r-2 border-[#E3E3E3] text-sm h-full my-auto">

                                                <button
                                                    onClick={() => {
                                                        if (statusRange === "empty") {
                                                            setShowPopup(true);
                                                        } else if (statusRange === "out_of_date") {
                                                            setShowOutDatePopup(true);
                                                        } else {
                                                            setShowFilter(!showFilter);
                                                        }
                                                    }}
                                                    disabled={statusRange === "on_range"}
                                                    className={`flex relative gap-4 px-4 py-2 active:scale-90 transition-transform duration-100
                                                      ${statusRange === "on_range"
                                                            ? 'text-gray-400 cursor-not-allowed'
                                                            : showFilter
                                                                ? 'bg-[#667790] text-white'
                                                                : 'bg-transparent text-[#616161] cursor-pointer'
                                                        }`}
                                                >
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        width="20"
                                                        height="20"
                                                        viewBox="0 0 24 24"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        strokeWidth="2"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        className="icon icon-tabler"
                                                    >
                                                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                                        <path d="M4 4h16v2.172a2 2 0 0 1 -.586 1.414l-4.414 4.414v7l-6 2v-8.5l-4.48 -4.928a2 2 0 0 1 -.52 -1.345v-2.227z" />
                                                    </svg>
                                                    Tanggal
                                                </button>
                                            </div>

                                            {showFilter && (
                                                <div className="absolute top-full right-0 bg-white p-3 rounded-lg shadow-xl z-50 w-[90vw] max-w-[260px]">

                                                    <div className="flex justify-between p-1">
                                                        <p className="font-semibold text-base text-gray-800">Filter</p>
                                                        <button className="font-semibold text-base text-gray-800"
                                                            onClick={() => setShowFilter(false)}>X</button>
                                                    </div>

                                                    <div className="w-full h-[1px] bg-gray-300 mb-4"></div>

                                                    <div className="w-full max-w-xs items-center justify-start text-xs px-4 mb-[12px]">
                                                        <DayPicker
                                                            mode="range"
                                                            selected={range}
                                                            onSelect={handleRangeChange}
                                                        />
                                                    </div>

                                                    <div className="w-full h-[1px] bg-gray-300 mb-4"></div>

                                                    {/* Start Date */}
                                                    <div className="text-sm mb-3">
                                                        <label className="block mb-1 font-medium text-xs text-left">
                                                            Tanggal Mulai <span className="text-red-500">*</span>
                                                        </label>
                                                        <input
                                                            type="date"
                                                            value={startDate}
                                                            onChange={handleStartInput}
                                                            className="border border-gray-300 px-3 py-2 rounded-md w-full text-xs focus:outline-blue-400"
                                                        />
                                                    </div>

                                                    {/* End Date */}
                                                    <div className="text-sm mb-3">
                                                        <label className="block mb-1 font-medium text-xs text-left">
                                                            Tanggal Selesai <span className="text-red-500">*</span>
                                                        </label>
                                                        <input
                                                            type="date"
                                                            value={endDate}
                                                            onChange={handleEndInput}
                                                            className="border border-gray-300 px-3 py-2 rounded-md w-full text-xs focus:outline-blue-400"
                                                        />
                                                    </div>

                                                    {/* Range Text */}
                                                    <p className="text-[11px] font-semibold text-gray-700 mt-2 text-left">Rentang :</p>
                                                    <p className="text-[11px] text-gray-500 mb-4">{rangeText}</p>

                                                    {/* Buttons */}
                                                    <div className="flex justify-end gap-2 mt-2">
                                                        <button
                                                            className="px-3 py-2 text-xs rounded-md bg-[#023048] text-white hover:bg-[#012C3F] active:scale-95 transition"
                                                            onClick={date_change}
                                                        >
                                                            Cari Data
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        <div className="relative">
                                            <button
                                                onClick={openAlertBepusAll}
                                                disabled={!approvedAll}
                                                className={`cursor-pointer items-center text-sm flex gap-2 px-5 py-1 border-r-2 border-[#E3E3E3] active:scale-90 transition-transform duration-100
                                                ${alertBebasPustakaAll
                                                        ? 'bg-[#667790] text-white border-[#667790]'
                                                        : 'bg-transparent text-[#616161] border-[#616161]'
                                                    }`}
                                            >
                                                <IconSelector size={16} fill="#616161"></IconSelector>
                                                Approve All
                                            </button>

                                        </div>
                                        <div className="relative">
                                            <button
                                                onClick={() => setUrutkanBy(!urutkanBy)}
                                                className={`cursor-pointer text-sm flex relative items-center gap-2 px-5 py-2 border-[#E3E3E3] active:scale-90 transition-transform duration-100
                                                     ${urutkanBy
                                                        ? 'bg-[#667790] text-white border-[#667790]'
                                                        : 'bg-transparent text-[#616161] border-[#616161]'
                                                    }`}
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg"
                                                    width="20"
                                                    height="20"
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth="2"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    className="icon icon-tabler icons-tabler-outline icon-tabler-sort-descending"
                                                >
                                                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                                    <path d="M4 6l9 0" />
                                                    <path d="M4 12l7 0" />
                                                    <path d="M4 18l7 0" />
                                                    <path d="M15 15l3 3l3 -3" />
                                                    <path d="M18 6l0 12" />
                                                </svg>
                                                Urutkan
                                            </button>
                                            {urutkanBy && (
                                                <div className="absolute top-12 right-0 flex flex-col gap-2 bg-[#F9FAFB] rounded-sm shadow z-50 w-40">
                                                    <div className="flex items-center justify-between px-3 py-2 border-b border-gray-200">
                                                        <p className="text-[#616161] font-bold text-sm">Urutkan</p>
                                                        <p
                                                            className="text-[#616161] font-bold cursor-pointer text-sm"
                                                            onClick={() => setUrutkanBy(false)}
                                                        >
                                                            X
                                                        </p>
                                                    </div>

                                                    <button
                                                        onClick={() => handleSort('priority')}
                                                        className="px-3 py-1 w-full font-normal text-left text-sm rounded-sm hover:bg-gray-300 focus:bg-[#A8B5CB] outline-none transition-colors"
                                                    >
                                                        Prioritas (Status Bermasalah)
                                                    </button>
                                                    <button
                                                        onClick={() => handleSort('latest')}
                                                        className="px-3 py-1 w-full font-normal text-left text-sm rounded-sm hover:bg-gray-300 focus:bg-[#A8B5CB] outline-none transition-colors"
                                                    >
                                                        Terbaru
                                                    </button>
                                                    <button
                                                        onClick={() => handleSort('oldest')}
                                                        className="px-3 py-1 w-full font-normal text-left text-sm rounded-sm hover:bg-gray-300 focus:bg-[#A8B5CB] outline-none transition-colors"
                                                    >
                                                        Terlama
                                                    </button>
                                                    <button
                                                        onClick={() => handleSort('name_asc')}
                                                        className="px-3 py-1 w-full font-normal text-left text-sm rounded-sm hover:bg-gray-300 focus:bg-[#A8B5CB] outline-none transition-colors"
                                                    >
                                                        A → Z
                                                    </button>
                                                    <button
                                                        onClick={() => handleSort('name_desc')}
                                                        className="px-3 py-1 w-full font-normal text-left text-sm rounded-sm hover:bg-gray-300 focus:bg-[#A8B5CB] outline-none transition-colors"
                                                    >
                                                        Z → A
                                                    </button>
                                                </div>
                                            )}
                                        </div>

                                        <div className="relative w-40">
                                            <input
                                                type="text"
                                                placeholder="Search..."
                                                value={search}
                                                onChange={handleSearchChange}
                                                className="w-full bg-transparent pl-12 pr-4 py-2 text-sm border-l-2 border-[#E3E3E3] focus:outline-none focus:ring-1 focus:ring-[#A8B5CB]"
                                            />
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="16"
                                                height="16"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500 ml-3"
                                            >
                                                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                                <path d="M10 10m-7 0a7 7 0 1 0 14 0a7 7 0 1 0 -14 0" />
                                                <path d="M21 21l-6 -6" />
                                            </svg>

                                        </div>
                                    </div>

                                </div>
                            </div>

                            <div className='grid grid-cols-1 mt-9 overflow-x-auto'>
                                <div className="flex">
                                    {/* Tab Menunggu (Pending) */}
                                    <div
                                        onClick={() => handleTabChange('pending')}
                                        className={`w-40 h-12 cursor-pointer transition-all
            [clip-path:polygon(0_0,91%_0,100%_100%,0_100%)]
            ${activeTab === 'pending' ? 'bg-[#D8DFEC]' : 'bg-[#E7ECF5]'}`}
                                    >
                                        <div className="flex gap-2 items-center justify-center mt-3 text-sm text-[#023048]">
                                            <p className="font-medium">Menunggu</p>
                                            <div className="rounded bg-white px-2 py-0.5 text-xs font-semibold">
                                                {tabCounts.pending}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Tab Disetujui (Approved) */}
                                    <div
                                        onClick={() => handleTabChange('approved')}
                                        className={`w-40 h-12 cursor-pointer transition-all
                                        [clip-path:polygon(0_0,91%_0,100%_100%,0_100%)]
                                        ${activeTab === 'approved' ? 'bg-[#D8DFEC]' : 'bg-[#E7ECF5]'}`}
                                    >
                                        <div className="flex gap-2 items-center justify-center mt-3 text-sm text-[#023048]">
                                            <p className="font-medium">Disetujui</p>
                                            <div className="rounded bg-white px-2 py-0.5 text-xs font-semibold">
                                                {tabCounts.approved}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Tab Semua (All) */}
                                    <div
                                        onClick={() => handleTabChange('all')}
                                        className={`w-40 h-12 cursor-pointer transition-all
                                        [clip-path:polygon(0_0,91%_0,100%_100%,0_100%)]
                                        ${activeTab === 'all' ? 'bg-[#D8DFEC]' : 'bg-[#EEF3FB]'}`}
                                    >
                                        <div className="flex gap-2 items-center justify-center mt-3 text-sm text-[#023048]">
                                            <p className="font-medium">Semua</p>
                                            <div className="rounded bg-white px-2 py-0.5 text-xs font-semibold">
                                                {tabCounts.all}
                                            </div>
                                        </div>
                                    </div>

                                    <p className="ml-auto mt-4 text-xs text-[#9A9A9A]">
                                        Range aktif: {startDate} — {endDate}
                                    </p>
                                </div>

                                <div className="w-full border border-gray-200 rounded-b-lg shadow-sm overflow-x-auto">
                                    <table className="min-w-full border-collapse">
                                        <thead>
                                            <tr style={{ backgroundColor: changeTabColor }}>
                                              <th className="p-2 text-center text-sm font-normal text-[#333333] border border-[#D8DFEC]">
                                                    <button
                                                        onClick={cekAll}
                                                        className="px-3 py-1 rounded border border-[#A8B5CB]
                                                        hover:bg-[#F1F4F8]
                                                        active:scale-95 transition"
                                                    >
                                                        Checklist Semua
                                                    </button>
                                                </th>
                                                <th className="p-2 font-normal text-[#333333] text-sm overflow-x-auto">Nama</th>
                                                <th className="p-2 font-normal text-[#333333] text-sm overflow-x-auto">NIM</th>
                                                <th className="p-2 font-normal text-[#333333] text-sm overflow-x-auto">institusi</th>
                                                <th className="p-2 font-normal text-[#333333] text-sm overflow-x-auto">program studi</th>
                                                <th className="p-2 font-normal text-[#333333] text-sm overflow-x-auto">Status Peminjaman</th>
                                                <th className="p-2 font-normal text-[#333333] text-sm overflow-x-auto">Status</th>
                                                <th className="p-2 font-normal text-[#333333] text-sm overflow-x-auto">Tindakan</th>
                                                <th className="p-2 font-normal text-[#333333] text-sm overflow-x-auto">Keterangan</th>
                                            </tr>
                                        </thead>

                                        {/* isianya dari db */}
                                        <tbody>

                                            {data.map((item, index) => (
                                                <tr key={item.id ?? index}
                                                    className={index % 2 === 0 ? 'bg-white' : 'bg-[#F5F5F5]'}
                                                >
                                                    <td className="p-2">
                                                        <label className="relative items-center cursor-pointer">
                                                            <input
                                                                type="checkbox"
                                                                checked={checkedItems[item.id] || false}
                                                                onChange={() => {
                                                                    if (item.status_peminjaman === 1) {
                                                                        handleSingleCheck(item.id);
                                                                    }
                                                                }}
                                                                disabled={!(
                                                                    item.status_peminjaman === 1 &&
                                                                    item.status_bepus === "pending"
                                                                )}
                                                                className="absolute w-4 h-4 opacity-0 cursor-pointer"
                                                            />

                                                            <div
                                                                className={`w-4 h-4 border rounded flex items-center justify-center ${checkedItems[item.id]
                                                                    ? 'bg-[#A8B5CB] border-white'
                                                                    : 'bg-white border-[#A8B5CB]'
                                                                    }`}
                                                            >
                                                                {checkedItems[item.id] && (
                                                                    <svg width="12" height="10" viewBox="0 0 12 10" fill="none">
                                                                        <path d="M1 5L4 8L11 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                                    </svg>
                                                                )}
                                                            </div>
                                                        </label>
                                                    </td>
                                                    <td className="py-2 px-4 whitespace-nowrap overflow-x-auto text-sm text-[#616161] truncate">{item.name || 'N/A'}</td>
                                                    <td className="py-2 px-4 whitespace-nowrap overflow-x-auto text-sm text-[#616161] truncate">{item.nim || 'N/A'}</td>
                                                    <td className="py-2 px-4 whitespace-nowrap overflow-x-auto text-sm text-[#616161] truncate">{item.institusi || 'N/A'}</td>
                                                    <td className="py-2 px-4 whitespace-nowrap overflow-x-auto text-sm text-[#616161] truncate">{item.program_studi || 'N/A'}</td>

                                                    {/* Status Peminjaman */}
                                                    <td className="py-2 px-4 whitespace-nowrap overflow-x-auto">
                                                        <span
                                                            className={`px-2 py-1 text-xs font-medium rounded-full inline-block
                                                                ${item.status_peminjaman === 1
                                                                    ? "bg-[#D9FBD9] text-[#4ABC4C]"
                                                                    : "bg-[#FFE1E1] text-[#FF1515]"
                                                                }`}
                                                        >
                                                            {item.status_peminjaman === 1
                                                                ? "Sudah Dikembalikan"
                                                                : "Belum Dikembalikan"}
                                                        </span>
                                                    </td>


                                                    <td className={`py-2 px-4 whitespace-nowrap overflow-x-auto`}>
                                                        <span className={`px-2 py-1 text-xs font-medium rounded-full inline-block ${(item.status_peminjaman === 1) ? "bg-[#D9FBD9] text-[#4ABC4C]" : "bg-[#FFE1E1] text-[#FF1515]"}`}
                                                        >
                                                            {item.status_peminjaman === 1
                                                                ? "Memenuhi syarat"
                                                                : "Belum Memenuhi Syarat"}
                                                        </span>


                                                    </td>

                                                    <td className="py-2 px-4 overflow-x-auto">
                                                        {item.status_bepus === "pending" ? (
                                                            <button
                                                                type="button"
                                                                onClick={() => {
                                                                    if (item.status_peminjaman === 1) {
                                                                        setSelectedItem(item);
                                                                        openAlertBepus();
                                                                    }
                                                                }}

                                                                disabled={!(item.status_peminjaman === 1)}
                                                                className={`px-2 py-1 text-xs rounded-md border transition 
                                                                  ${item.status_peminjaman === 1
                                                                        ? "cursor-pointer bg-[#023048] border-[#023048] text-white active:scale-90"
                                                                        : "cursor-not-allowed bg-gray-200 border-gray-300 text-gray-400"
                                                                    }`}
                                                            >
                                                                Approve
                                                            </button>
                                                        ) : (
                                                            <p className="text-[#4ABC4C] font-semibold">Sudah di approve</p>
                                                        )}

                                                    </td>

                                                    {/* Keterangan */}
                                                    <td className="py-2 px-2 items-center justify-center overflow-hidden">
                                                        <div className="relative group inline-block">
                                                            <button
                                                                className="cursor-pointer relative flex items-center gap-2 text-[#667790] px-3 py-1 left-[15px] rounded 
                                                                      transition-all active:scale-90 hover:text-[#445266]"

                                                                onClick={() => goto(`/Keterangan/${item.nim}`)}
                                                            >
                                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                                                    <path d="M14 3v4a1 1 0 0 0 1 1h4" />
                                                                    <path d="M17 21h-10a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2z" />
                                                                </svg>
                                                            </button>
                                                            <span className="absolute z-10 bottom-full left-1/2 -translate-x-1/3 mb-3 px-1 bg-[#EDEDED] text-gray-600 text-xs border border-gray-300 rounded-sm whitespace-nowrap opacity-0 
                                                            group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                                                            >
                                                                Keterangan Riwayat Peminjaman
                                                            </span>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                            </div>

                            {/* pagination dan export */}
                            <div className="flex ml-60 justify-between">
                                <div className="flex flex-wrap gap-2 justify-center mt-8 items-center">
                                    {/* Prev */}
                                    <button
                                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                        disabled={currentPage === 1}
                                        className="px-3 py-1 text-[#757575] text-xs rounded disabled:opacity-40"
                                    >
                                        ← Sebelumnya
                                    </button>

                                    {pageNumbers.map(num => (
                                        <button
                                            key={num}
                                            onClick={() => setCurrentPage(num)}
                                            className={`px-3 py-1 rounded-md transition-all duration-150
                                                ${currentPage === num
                                                    ? 'border-2 bg-[#EDF1F3] border-[#667790] text-[#023048] shadow-md'
                                                    : 'text-[#023048] text-xs hover:bg-[#F3F6F9]'
                                                }`}
                                        >
                                            {num}
                                        </button>
                                    ))}

                                    {/* Next */}
                                    <button
                                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                        disabled={currentPage === totalPages}
                                        className="px-3 py-1 text-[#757575] text-xs rounded disabled:opacity-40"
                                    >
                                        Selanjutnya →
                                    </button>
                                </div>

                                <button
                                    className="cursor-pointer flex relative items-center p-2 top-4 my-5 rounded border border-[#757575] bg-[#023048] hover:bg text-sm text-white active:scale-90 transition-transform duration-200"
                                    onClick={handleExportPDF}
                                >
                                    Cetak ke PDF
                                </button>
                            </div>

                        </div>

                        <div className="sticky w-full z-90">
                            <AppLayout></AppLayout>
                        </div>
                        {alertBebasPustaka && (
                            <div className="fixed inset-0 bg-[#333333]/60 flex items-center justify-center z-50">
                                <div className="relative w-80 h-80 overflow-hidden">

                                    <div className="bg-white rounded-md font-semibold flex flex-col items-center justify-center text-center py-4 px-6 mt-8 pt-3">
                                        <div className="w-[55px] h-[55px] bg-[#EDF1F3] rounded-full flex items-center justify-center">
                                            <IconFile stroke="#023048" size={30} />
                                        </div>

                                        <p className="text-xl mt-5">Setujui Data Ini?</p>
                                        <p className="text-xs font-extralight mt-4 px-2">
                                            Setelah data disetujui, perubahan tidak dapat dibatalkan dan akan dianggap
                                            sebagai data yang sah serta tersimpan dalam sistem.
                                        </p>

                                        <div className="flex gap-3">
                                            <button
                                                type="button"
                                                onClick={() => setAlertBebasPustaka(false)} className="cursor-pointer mt-4 px-5 py-1 border border-[#023048] rounded-md bg-[#E5E7EB] text-[#023048] font-thin
                                                    active:scale-90 transition-transform duration-100"
                                            >
                                                Batalkan
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    approveSingle(selectedItem);
                                                    setAlertBebasPustaka(false);
                                                }}
                                                className="cursor-pointer mt-4 px-5 py-1 rounded-md bg-[#023048] text-white font-thin
                                                    active:scale-90 transition-transform duration-100"
                                            >
                                                Setujui
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {alertBebasPustakaAll && (
                            <div className="fixed inset-0 bg-[#333333]/60 flex items-center justify-center z-50">
                                <div className="relative w-80 h-80 overflow-hidden">

                                    <div className="bg-white rounded-md font-semibold flex flex-col items-center justify-center text-center py-4 px-6 mt-8 pt-3">
                                        <div className="w-[55px] h-[55px] bg-[#EDF1F3] rounded-full flex items-center justify-center">
                                            <IconFile stroke="#023048" size={30} />
                                        </div>

                                        <p className="text-xl mt-5">Setujui Semua Data?</p>
                                        <p className="text-xs font-extralight mt-4 px-2">
                                            Setelah data disetujui, perubahan tidak dapat dibatalkan dan akan dianggap
                                            sebagai data yang sah serta tersimpan dalam sistem.
                                        </p>

                                        <div className="flex gap-3">
                                            <button
                                                type="button"
                                                onClick={() => setAlertBebasPustakaAll(false)}
                                                className="cursor-pointer mt-4 px-5 py-1 border border-[#023048] rounded-md bg-[#E5E7EB] text-[#023048] font-thin
                                                    active:scale-90 transition-transform duration-100"
                                            >
                                                Batalkan
                                            </button>
                                            <button
                                                type="button"
                                                onClick={approveAllRequest}
                                                className="cursor-pointer mt-4 px-5 py-1 rounded-md bg-[#023048] text-white font-thin
                                                    active:scale-90 transition-transform duration-100"
                                            >
                                                Setujui
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {isApproving && (
                            <div className="fixed inset-0 bg-[#333333]/60 flex items-center justify-center z-50">
                                <div className="max-width-xl bg-white rounded-md font-semibold flex flex-col items-center justify-center text-center pb-3 px-6 mt-8 pt-3">

                                    <div className=" w-full max-w-xs">
                                        <p className="text-sm font-semibold text-[#667790] mb-1">
                                            Memproses... {approveProgress}%
                                        </p>

                                        <div className="w-full bg-gray-300 h-3 rounded-full overflow-hidden">
                                            <div
                                                className="bg-[#023048] h-3 transition-all duration-300"
                                                style={{ width: `${approveProgress}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* out of date */}
                        {showOutDatePopup && (
                            <div className="fixed inset-0 bg-[#333333]/60 flex items-center justify-center z-50">
                                <div className="w-80">
                                    <div className="bg-white rounded-md font-semibold flex flex-col items-center text-center py-6 px-6">

                                        <div className="w-[55px] h-[55px] bg-[#EDF1F3] rounded-full flex items-center justify-center">
                                            <IconCalendarWeek stroke="#023048" size={30} />
                                        </div>

                                        <p className="text-xl mt-5">Masa Telah Usai</p>
                                        <p className="text-xs font-extralight mt-4 px-2">
                                            Silahkan perbaharui tanggal agar data bisa ditampilkan.
                                        </p>

                                        <button
                                            onClick={() => {
                                                setShowOutDatePopup(false);
                                                setShowFilter(true); // auto buka filter tanggal
                                            }}
                                            className="w-full mt-8 py-2.5 rounded-lg bg-[#023048] text-white text-sm
                                            hover:bg-[#034161] active:scale-95 transition"
                                        >
                                            Oke, Mengerti
                                        </button>

                                    </div>
                                </div>
                            </div>
                        )}


                        {/* pick tanggal */}
                        {showPopup && (
                            <div className="fixed inset-0 bg-[#333333]/60 flex items-center justify-center z-50">
                                <div className="relative w-80">
                                    <div className="bg-white rounded-md font-semibold flex flex-col items-center text-center py-6 px-6">

                                        <div className="w-[55px] h-[55px] bg-[#EDF1F3] rounded-full flex items-center justify-center">
                                            <IconCalendarWeek stroke="#023048" size={30} />
                                        </div>

                                        <p className="text-xl mt-5">Pilih Tanggal Terlebih Dahulu!</p>
                                        <p className="text-xs font-extralight mt-4 px-2">
                                            Silakan pilih tanggal agar data tampil lengkap.
                                        </p>

                                        <button
                                            onClick={() => {
                                                setShowPopup(false);
                                                setShowFilter(true); // auto buka filter tanggal
                                            }}
                                            className="w-full mt-8 py-2.5 rounded-lg bg-[#023048] text-white text-sm
                                            hover:bg-[#034161] active:scale-95 transition"
                                        >
                                            Oke, Mengerti
                                        </button>

                                    </div>
                                </div>
                            </div>
                        )}


                    </div>
                </div>

            </div>
        </div>
    );
}

export default Approval;