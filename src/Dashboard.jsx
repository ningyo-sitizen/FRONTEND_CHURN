import { Line, Bar, Pie, Doughnut } from 'react-chartjs-2';
import AppLayout from './AppLayout';
import axios from 'axios';
import authCheckSA from './authCheckSA';
import LogoutAlert from "./logoutConfirm";
import { useNavigate } from "react-router-dom";
import {
    IconHome,
    IconChartBar,
    IconBell,
    IconLogout,
    IconUser,
    IconChevronDown,
    IconMenu2,
    IconBellRinging,
    IconUsers,
    IconHistory,
    IconPlus,
    IconLayoutGrid,
    IconList,
    IconX,
    IconEye,
    IconEyeOff,
    IconCheck,
    IconFileDescription,
} from "@tabler/icons-react";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend
);


export default function Dashboard() {
    authCheckSA();
    const fetchLandingPageList = async () => {
        try {
            const token = localStorage.getItem("token");

            const response = await axios.get(
                "http://localhost:8080/api/landing/landingpagelist",
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response.data.success) {
                setData(
                    response.data.data.map((item, index) => ({
                        id: index + 1,
                        name: item.nama_mahasiswa,
                        nim: item.nim,
                        jurusan: item.program_studi,
                        statusbebaspustakanya:
                            item.STATUS_bebas_pustaka === "pending" ? 0 : 1,
                    }))
                );
            }
        } catch (error) {
            console.error("❌ Gagal mengambil data landing page:", error);
        }
    };

    const [showLogout, setShowLogout] = useState(false);
    //data dummy
    const [data, setData] = useState([]);
    //goto
    const goto = useNavigate();

    const [profileData, setProfileData] = useState({
        name: "Loading...",
        username: "Loading...",
        role: "Admin",
    });
    //dropdown
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [chartData, setChartData] = useState({
        lineChart: null
    });

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

    const [visitors, setVisitors] = useState([]);

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
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
        fetchChartData();
        fetchLandingPageList();
    }, []);

    const fetchChartData = async () => {
        try {
            const token = localStorage.getItem("token");
            console.log("🔑 Token from localStorage:", token);

            if (!token) {
                console.warn("⚠️ No token found in localStorage!");
                return;
            }

            const response = await fetch("http://localhost:8080/api/landing/landingpagechart?year=2025", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
            });

            console.log("Response status:", response.status);

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();
            console.log("📊 Chart data fetched:", data);

            setChartData({
                lineChart: {
                    labels: data.labels,
                    datasets: [
                        {
                            label: 'Kunjungan per Bulan',
                            data: data.data,
                            borderColor: 'rgb(75, 192, 192)',
                            backgroundColor: 'rgba(75, 192, 192, 0.2)',
                            tension: 0.1
                        },
                    ],
                }
            });

        } catch (error) {
            console.error('❌ Error fetching chart data:', error);
        }
    };

    return (
        <main className="font-jakarta bg-[#F9FAFB] min-h-screen overflow-hidden">

            <div className="flex h-full">
                <aside
                    className={`fixed inset-y-0 left-0 z-40 w-64 bg-white border-r transform transition-transform duration-300 ease-in-out 
                ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} 
                lg:translate-x-0 lg:static`}>

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
                            <a href="/dashboard" className={getSidebarItemClass(true)}>
                                <IconHome size={20} />
                                Dashboard
                            </a>
                            <a href="/analytic" className={getSidebarItemClass()}>
                                <IconChartBar size={20} />
                                Data Analitik
                            </a>
                            <a href="/Approval" className={getSidebarItemClass()}>
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
                                        <p className="font-semibold text-sm text-[#023048] text-left">{profileData.name}</p>
                                        <p className="text-xs text-gray-500 text-left">{profileData.role}</p>
                                    </div>
                                </div>
                                <div className="p-2 space-y-1">
                                    <button onClick={() => goto("/profile")} className="flex items-center gap-3 p-2 w-full text-left text-sm hover:bg-gray-100 rounded-md text-gray-700">
                                        <IconUser size={18} /> Profile
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

                    {/* isiannya */}
                    <div className="flex-1 overflow-y-auto">
                        <div className="p-8">
                            <div className="relative w-full mx-auto rounded-lg overflow-hidden shadow-sm mb-8 bg-[#033854]">
                                <div className="flex flex-col md:flex-row w-full">

                                    <div className="md:w-1/1 p-10 text-white flex flex-col justify-start text-left">
                                        <p className="font-semibold text-3xl mb-4">Selamat Datang!</p>
                                        <p className="font-normal text-lg mb-2">Di Dashboard admin Bebas Pustaka</p>
                                        <p className="font-light text-sm">
                                            Tempat Admin memantau dan mengelola data  serta status bebas pustaka dengan lebih mudah dan terarah.
                                        </p>
                                    </div>

                                    <div className="md:w-1/2 w-1/3 flex items-center justify-end">
                                        <img
                                            src="https://cdn.designfast.io/image/2025-12-03/c0fb8085-f25e-4ce8-8687-24ace6ba9f2e.png"
                                            alt="icon"
                                            className="w-52 h-52  object-none"
                                        />
                                    </div>

                                </div>
                            </div>

                            <p className="font-semibold text-xl text-left text-black mb-8 overflow-x-hidden">
                                Silakan cek data yang ingin anda lihat di sini!
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
                                {/* ini chart */}
                                <div className="flex flex-col h-full">
                                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
                                        <h3 className="font-semibold text-base mb-2 sm:mb-0">Data Analitik Mahasiswa</h3>
                                        <p className="font-light text-[#9A9A9A] text-sm cursor-pointer hover:underline"
                                            onClick={() => goto('/analyticSA')}>
                                            Lihat data &gt;
                                        </p>
                                    </div>

                                    <div className="shadow-sm border border-[#EDEDED] bg-white p-2 w-full h-full overflow-x-auto ">
                                        {chartData.lineChart && (
                                            <div className="w-full min-w-[500px]" style={{ height: '300px', maxWidth: '100%' }}>
                                                <Line
                                                    data={chartData.lineChart}
                                                    options={{
                                                        responsive: true,
                                                        maintainAspectRatio: false,
                                                        plugins: {
                                                            legend: {
                                                                position: 'top',
                                                                labels: {
                                                                    font: { family: '"Plus Jakarta Sans", sans-serif' },
                                                                },
                                                            },
                                                            title: {
                                                                display: true,
                                                                text: [
                                                                    'Data kunjungan mahasiswa ke perpustakaan',
                                                                    'mencatat jumlah dan frekuensi kehadiran mereka.'
                                                                ],
                                                                color: '#616161',
                                                                font: { family: '"Plus Jakarta Sans", sans-serif', size: 11, weight: '300' },
                                                                padding: { top: 10, bottom: 20 },
                                                                align: 'center',
                                                            },
                                                        },
                                                        scales: {
                                                            x: { grid: { display: false } },
                                                            y: {
                                                                beginAtZero: true,       // biar garis nggak datar
                                                                grid: { color: '#f3f4f6' },
                                                            },
                                                        },
                                                    }}
                                                />
                                            </div>
                                        )}
                                    </div>
                                </div>
                                {/* tabel kanan */}
                                <div className="flex flex-col h-full">

                                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
                                        <h3 className="font-semibold text-base mb-2 sm:mb-0">Setujui Data Bebas Pustaka</h3>
                                        <p className="font-light text-[#9A9A9A] text-sm cursor-pointer hover:underline"
                                            onClick={() => goto('/approvalSA')}
                                        >
                                            Lihat data &gt;
                                        </p>
                                    </div>

                                    <div className="shadow-sm border border-[#EDEDED] bg-white p-2 w-full h-full overflow-x-auto">

                                        <div className='text-[#616161] text-xs font-light text-center mb-3'>
                                            <p>Data bebas pustaka mencatat status pengajuan</p>
                                            <p>yang telah di-approve oleh admin.</p>
                                        </div>

                                        <div className="overflow-x-auto">
                                            <table className="w-full border-collapse">
                                                <thead>
                                                    <tr className="bg-[#667790]">
                                                        <th className="rounded-tl-lg px-2 py-2 text-xs text-white text-center">No</th>
                                                        <th className="px-2 py-2 text-xs text-white text-center">Nama</th>
                                                        <th className="px-2 py-2 text-xs text-white text-center">NIM</th>
                                                        <th className="px-2 py-2 text-xs text-white text-center">Jurusan</th>
                                                        <th className="px-2 py-2 text-xs text-white text-center">Status</th>
                                                    </tr>
                                                </thead>

                                                <tbody>
                                                    {data.length === 0 ? (
                                                        <tr>
                                                            <td colSpan="6" className="text-center py-4 text-xs text-gray-500">
                                                                Tidak ada data
                                                            </td>
                                                        </tr>
                                                    ) : (
                                                        data.map((item, index) => (
                                                            <tr
                                                                key={item.nim}
                                                                className="border-b text-xs text-[#616161] hover:bg-gray-50"
                                                            >
                                                                <td className="p-2 text-center">{index + 1}</td>

                                                                <td className="p-2 whitespace-nowrap">
                                                                    {item.name}
                                                                </td>

                                                                <td className="p-2 text-center">
                                                                    {item.nim}
                                                                </td>

                                                                <td className="p-2 text-center">
                                                                    {item.jurusan}
                                                                </td>

                                                                <td className="p-2 text-center">
                                                                    <span
                                                                        className={`px-2 py-1 rounded-full text-xs ${item.statusbebaspustakanya === 0
                                                                                ? "bg-yellow-100 text-yellow-800"
                                                                                : "bg-green-100 text-green-800"
                                                                            }`}
                                                                    >
                                                                        {item.statusbebaspustakanya === 0
                                                                            ? "Pending"
                                                                            : "Disetujui"}
                                                                    </span>
                                                                </td>

                                                            </tr>
                                                        ))
                                                    )}
                                                </tbody>

                                            </table>
                                        </div>


                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* //tutor bepus */}
                        <div className='bg-white w-full max-h-screen flex justify-center p-9 pb-16 mx-none mt-9'>
                            <div className='text-center mx-auto w-full max-w-5xl'>

                                <p className="text-2xl font-semibold mt-5">
                                    Konfirmasi data <span className='text-[#667790]'>bebas pustaka?</span> berikut alur pengajuannya!
                                </p>

                                <p className="text-sm font-base mt-4 px-5 text-[#616161] max-w-3xl mx-auto">
                                    Segera lakukan approval data bebas pustaka mahasiswa sebelum deadline berakhir. Jika tidak disetujui tepat waktu,
                                    mahasiswa tidak akan bisa mendapatkan status Bebas dan proses mereka akan tertunda.
                                </p>
                                <div className='flex flex-col lg:flex-row justify-center items-start mt-14 gap-10 bg-white'>

                                    {/* FOTO OVERLAP KIRI */}
                                    <div className='relative w-[330px] h-[220px] flex justify-center'>
                                        <div
                                            className="absolute w-[370px] h-[250px] bg-cover bg-center rounded-xl shadow-md"
                                            style={{
                                                backgroundImage:
                                                    "url('https://cdn.designfast.io/image/2025-12-11/2700e1a5-1ae3-4de3-b630-e51228368ff6.png')",
                                                top: "2px",
                                                left: "40%",
                                                transform: "translateX(-42%)",
                                            }}
                                        ></div>

                                        {/* Foto depan */}
                                        {/* <div
                                            className="absolute w-[335px] h-[240px] bg-cover bg-center rounded-xl shadow-lg"
                                            style={{
                                                backgroundImage:
                                                    "url('https://cdn.designfast.io/image/2025-12-11/b498b2f5-e51e-438f-ad9b-0557f0ea3760.png')",
                                                bottom: "-5px",
                                                left: "50%",
                                                transform: "translateX(-70%)",
                                            }}
                                        ></div> */}

                                    </div>

                                    {/* STEP KANAN */}
                                    <div className='relative flex flex-col gap-10 pl-10'>

                                        {/* garis timeline */}
                                        <div className="absolute left-[65px] top-0 h-full w-px bg-gray-300"></div>

                                        {/* STEP ITEM */}
                                        {[
                                            {
                                                no: "1",
                                                title: "Tahap 1 : Tahap Buka Dashboard Approval",
                                                desc: "Login ke sistem dan akses menu dashboard approval untuk melihat daftar pengajuan bebas pustaka mahasiswa.",
                                            },
                                            {
                                                no: "2",
                                                title: "Tahap 2 : Tahap Cari data mahasiswa",
                                                desc: "Temukan data mahasiswa yang akan disetujui, lalu klik tombol “Approve”.",
                                            },
                                            {
                                                no: "3",
                                                title: "Tahap 3 : Tahap Konfirmasi Data",
                                                desc: "Pastikan data sesuai, lalu klik tombol “Approve” untuk menyelesaikan proses.",
                                            },
                                        ].map((step, i) => (
                                            <div key={i} className="flex items-start relative">

                                                {/* BULATAN NOMOR */}
                                                <div className="w-12 h-12 rounded-full flex items-center justify-center border-2 border-[#023048] z-10">
                                                    <div className="w-10 h-10 rounded-full flex items-center justify-center border-4 border-[#023048] bg-white font-semibold">
                                                        {step.no}
                                                    </div>
                                                </div>

                                                {/* TEXT */}
                                                <div className='flex flex-col text-left ml-5 max-w-sm'>
                                                    <p className="text-base font-semibold">{step.title}</p>
                                                    <p className="text-xs text-gray-700 mt-1">{step.desc}</p>
                                                </div>

                                            </div>
                                        ))}

                                    </div>

                                </div>

                            </div>
                        </div>
                        <div className="sticky w-full z-50">
                            <AppLayout></AppLayout>
                        </div>
                    </div>
                    {/* batas ambang bawah */}

                </div>

            </div>


        </main>
    );
}

