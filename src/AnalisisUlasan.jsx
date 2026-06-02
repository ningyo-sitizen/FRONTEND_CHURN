import React, { useState, useEffect } from 'react';
import Sidebar from './SideBar.jsx';
import Header from './Header.jsx';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell
} from 'recharts';
import Footer from './Footer';
import { useAuth } from "../utils/auth";
import { useNotif } from "./NotificationContext";

// Color Palette dari design sebelumnya
const PINK_DARK = "#D82F5A";
const PINK_MEDIUM = "#E2A7B8";
const PINK_LIGHT = "#FEF5F6";
const BLACK_MAROON = "#4A0E1C";
// Ditambah satu warna abu gelap agar pas dengan 4 segmen pada tabel legenda riskData
const COLORS_PIE = [BLACK_MAROON, PINK_DARK, PINK_MEDIUM, "#374151"];

const AnalisisUlasan = () => {
    const { showNotif } = useNotif();
    const user = useAuth();
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalCustomer: 0,
        highRisk: 0,
        churnCustomer: 0,
        totalRevenue: 0,
        churnRevenue: 0
    });

    const [riskData, setRiskData] = useState([]);
    const [subscriptionData, setSubscriptionData] = useState([]);
    const [segmentData, setSegmentData] = useState([]);
    const [genreData, setGenreData] = useState([]);
    const [subscriptionRevenueData, setSubscriptionRevenueData] = useState([]);
    const [fileName, setFileName] = useState("");

    useEffect(() => {
        fetchAnalytics();
    }, []);

    const fetchAnalytics = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem("token");
            const response = await fetch(
                `${import.meta.env.VITE_BACKEND_URL}/prediction/analytics`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    }
                }
            );
            const data = await response.json();
            showNotif("success", "data analitik berhasil diambil");
            console.log(data);
            if (data.status === "success") {
                setStats(data.stats);
                setRiskData(data.riskDistribution);
                setSubscriptionData(data.subscriptionVsChurn);
                setSegmentData(data.segmentInsight);
                setFileName(data.filename);
                setGenreData(data.genreInsight);
                setSubscriptionRevenueData(data.subscriptionRevenueLoss);
            }
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col lg:flex-row min-h-screen bg-[#F9FAFB] font-['Plus_Jakarta_Sans',sans-serif]">
            {/* Sidebar otomatis menyesuaikan diri */}
            <Sidebar />

            {/* Konten Utama */}
            <main className="flex-1 flex flex-col min-w-0 pb-20 lg:pb-0">
                {/* Header Section - Menggunakan struktur properti yang sama seperti halaman Profile */}
                <Header formData={user} profileImg={user?.image} />

                {/* Wrapper Pembungkus Dashboard */}
                <div className="p-4 lg:p-8 flex-1">
                    {/* JUDUL DAN SUBJUDUL HALAMAN */}
                    <div className="mb-6 lg:mb-8">
                        <h1 className="text-xl lg:text-xl font-semibold text-gray-800">Analisis Statistik Pelanggan</h1>
                        <p className="text-xs lg:text-sm text-gray-400 mt-1">
                            Visualisasi data churn customer dan insight bisnis secara real-time.
                        </p>
                    </div>

                    {/* Filter & Dataset Info */}
                    <div className="flex flex-wrap items-center gap-3 mb-6">
                        <div className="bg-white border border-gray-100 px-3 py-1.5 rounded-[4px] flex items-center gap-2 shadow-sm max-w-full">
                            <span className="text-xs text-gray-400 whitespace-nowrap">Dataset :</span>
                            <select className="text-xs font-medium outline-none bg-transparent max-w-[180px] truncate">
                                <option>{fileName}</option>
                            </select>
                        </div>
                        <span className="text-xs text-gray-400">{stats.totalCustomer.toLocaleString()} Data terdeteksi</span>
                    </div>

                    {/* STATS CARDS - DIJAMIN SATU BARIS HORIZONTAL PRESETS */}
                    <div className="bg-white rounded-[4px] border border-[#EDEDED] shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-4 lg:p-6 mb-8 lg:mb-12">
                        {/* Flexbox row no-wrap memaksa semua kartu berjajar lurus ke samping tanpa patah ke bawah */}
                        <div className="flex flex-row items-center justify-between gap-4 overflow-x-auto pb-4 lg:pb-0 scrollbar-none">
                            {[
                                {
                                    label: "Total Pelanggan",
                                    val: stats.totalCustomer,
                                    icon: "ti-users",
                                    col: "text-[#DE869D] bg-[#F6EAEC]"
                                },
                                {
                                    label: "Berisiko Tinggi",
                                    val: stats.highRisk,
                                    icon: "ti-trending-up",
                                    col: "text-[#EAAD62] bg-[#FDF0ED]"
                                },
                                {
                                    label: "Pelanggan Churn",
                                    val: stats.churnCustomer,
                                    icon: "ti-arrow-big-down-lines",
                                    col: "text-[#BE78E3] bg-[#F1EDF8]"
                                },
                                {
                                    label: "Total Pendapatan",
                                    val: `$${stats.totalRevenue.toLocaleString()}`,
                                    icon: "ti-cash",
                                    col: "text-[#C6CE56] bg-[#F6F7E6]"
                                },
                                {
                                    label: "Total Bahaya",
                                    val: `$${stats.churnRevenue.toLocaleString()}`,
                                    icon: "ti-wallet",
                                    col: "text-[#5A92C6] bg-[#EFF4FA]"
                                }
                            ].map((item, idx, arr) => (
                                <React.Fragment key={idx}>
                                    {/* Setiap item membagi ruang setara dan aman di layar desktop */}
                                    <div className="flex items-center gap-3 lg:gap-4 flex-1 min-w-[160px] justify-start px-2">
                                        <div className={`w-9 h-9 lg:w-10 lg:h-10 rounded-[4px] flex items-center justify-center text-xl lg:text-2xl shrink-0 ${item.col}`}>
                                            <i className={`ti ${item.icon}`}></i>
                                        </div>
                                        <div className="flex flex-col min-w-0">
                                            <p className="text-[10px] lg:text-xs text-gray-400 whitespace-nowrap overflow-hidden text-ellipsis" title={item.label}>
                                                {item.label}
                                            </p>
                                            <p className="text-sm lg:text-base font-semibold text-gray-800 truncate">
                                                {item.val}
                                            </p>
                                        </div>
                                    </div>
                                    {/* Garis pembatas vertikal antar kartu (hilang di kartu terakhir) */}
                                    {idx !== arr.length - 1 && <div className="w-[1px] h-10 bg-gray-100 shrink-0"></div>}
                                </React.Fragment>
                            ))}
                        </div>

                        {/* Analisis Note Design - FIXED CSS CONFLICT (Duplikasi Border Dihapus) */}
                        <div className="flex items-center justify-between bg-gray-50/50 border border-[#DCDBDB] rounded-[4px] p-3 lg:p-4 px-4 lg:px-8 mt-5 group cursor-pointer hover:bg-gray-50 transition-colors">
                            <div className="flex items-center gap-2 text-[11px] lg:text-xs">
                                <span className="text-[#D82F5A] font-semibold whitespace-nowrap">Dashboard Data Insight</span>
                                <span className="text-gray-400">|</span>
                                <span className="text-gray-600 truncate">
                                    Data didapat dari dashboard
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* MAIN CHARTS AREA */}
                    <div>
                        {/* BARIS UTAMA GRAFIK: Langganan & Distribusi Risiko */}
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6 lg:mb-12 items-stretch">
                            
                            {/* Bar Chart Section */}
                            <div className="col-span-1 lg:col-span-8 bg-white p-4 lg:p-6 rounded-[4px] border border-gray-100 shadow-sm flex flex-col justify-between">
                                <div>
                                    <div className="flex flex-col sm:flex-row justify-between items-start gap-2 mb-4">
                                        <div>
                                            <h3 className="text-sm font-semibold text-[#111827]">Langganan vs Prediksi Churn</h3>
                                            <p className="text-[10px] text-gray-400 mt-1">Perbandingan churn berdasarkan jenis paket</p>
                                        </div>
                                        <div className="flex gap-4 text-[10px] font-semibold mt-1">
                                            <span className="flex items-center gap-1.5">
                                                <div className="w-2 h-2 rounded-full bg-[#D82F5A]"></div>
                                                <span className="text-gray-600">Churn</span>
                                            </span>
                                            <span className="flex items-center gap-1.5">
                                                <div className="w-2 h-2 rounded-full bg-[#E2A7B8]"></div>
                                                <span className="text-gray-600">Non-Churn</span>
                                            </span>
                                        </div>
                                    </div>

                                    {/* Tinggi container grafik di-lock agar seimbang */}
                                    <div className="h-[260px] w-full mt-2">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <BarChart data={subscriptionData} margin={{ top: 10, right: 5, left: -25, bottom: 0 }}>
                                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                                                <XAxis dataKey="name" fontSize={10} axisLine={false} tickLine={false} height={30} />
                                                <YAxis fontSize={10} axisLine={false} tickLine={false} />
                                                <Tooltip
                                                    cursor={{ fill: '#F9FAFB', radius: 4 }}
                                                    content={({ active, payload, label }) => {
                                                        if (active && payload && payload.length) {
                                                            return (
                                                                <div className="bg-white border border-gray-100 p-2 shadow-md rounded text-[10px]">
                                                                    <p className="font-bold text-gray-800 mb-0.5">{label}</p>
                                                                    <p className="text-[#D82F5A]">Churn: {payload[0].value}</p>
                                                                    <p className="text-[#E2A7B8]">Non-Churn: {payload[1].value}</p>
                                                                </div>
                                                            );
                                                        }
                                                        return null;
                                                    }}
                                                />
                                                <Bar dataKey="churn" fill={PINK_DARK} radius={[3, 3, 0, 0]} barSize={16} />
                                                <Bar dataKey="nonChurn" fill={PINK_MEDIUM} radius={[3, 3, 0, 0]} barSize={16} />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>
                            </div>

                            {/* Pie Chart Section */}
                            <div className="col-span-1 lg:col-span-4 bg-white p-4 lg:p-6 rounded-[4px] border border-gray-100 shadow-sm flex flex-col justify-between">
                                <div>
                                    <h3 className="text-sm font-semibold mb-1 text-[#111827]">Distribusi Risiko</h3>
                                    <p className="text-[10px] text-gray-400 mb-4">Sebaran pelanggan berdasarkan tingkat risiko</p>

                                    {/* Tinggi kontainer pie diselaraskan dengan bar chart */}
                                    <div className="h-[260px] w-full flex items-center justify-center">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <PieChart>
                                                <Pie data={riskData} innerRadius={60} outerRadius={85} paddingAngle={4} dataKey="value">
                                                    {riskData.map((entry, index) => (
                                                        <Cell key={`cell-${index}`} fill={COLORS_PIE[index % COLORS_PIE.length]} />
                                                    ))}
                                                </Pie>
                                                <Tooltip
                                                    content={({ active, payload }) => {
                                                        if (active && payload && payload.length) {
                                                            return (
                                                                <div className="bg-white border border-gray-100 p-1.5 shadow-sm rounded text-[10px]">
                                                                    <p className="font-medium" style={{ color: payload[0].payload.fill }}>
                                                                        {payload[0].name}: {payload[0].value}
                                                                    </p>
                                                                </div>
                                                            );
                                                        }
                                                        return null;
                                                    }}
                                                />
                                            </PieChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>

                                {/* Legenda Pie Chart */}
                                <div className="flex flex-wrap items-center justify-start gap-x-3 gap-y-1.5 mt-2 text-[10px] lg:text-[11px] text-gray-500 font-medium pl-1">
                                    {riskData.map((item, i) => (
                                        <span key={i} className="flex items-center gap-1">
                                            <div
                                                className="w-1.5 h-1.5 rounded-full shrink-0"
                                                style={{ backgroundColor: COLORS_PIE[i % COLORS_PIE.length] }}
                                            ></div>
                                            <span className="capitalize">{item.name.toLowerCase()}</span>
                                            <span className="text-gray-400">({item.value})</span>
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* SECONDARY CHARTS AREA: Preferensi Genre & Kerugian Pendapatan */}
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-12 items-stretch">
                            {/* Genre Chart */}
                            <div className="col-span-1 lg:col-span-6 bg-white p-4 lg:p-6 pb-6 rounded-[4px] border border-gray-100 shadow-sm flex flex-col justify-between h-full">
                                <div>
                                    <div className="mb-4">
                                        <h3 className="text-sm font-semibold text-[#111827]">Analisis Preferensi Genre</h3>
                                        <p className="text-[10px] text-gray-400 mt-1">Distribusi pelanggan berdasarkan genre favorit</p>
                                    </div>

                                    <div className="h-[200px] flex items-end mt-8 w-full">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <BarChart data={genreData} margin={{ top: 10, right: 5, left: -25, bottom: 0 }}>
                                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                                                <XAxis dataKey="GenrePreference" fontSize={10} axisLine={false} tickLine={false} height={30} />
                                                <YAxis fontSize={10} axisLine={false} tickLine={false} />
                                                <Tooltip
                                                    cursor={{ fill: '#F9FAFB', radius: 4 }}
                                                    content={({ active, payload, label }) => {
                                                        if (active && payload && payload.length) {
                                                            return (
                                                                <div className="bg-white border border-gray-100 p-2 shadow-md rounded text-[10px]">
                                                                    <p className="font-bold text-gray-800 mb-0.5">{label}</p>
                                                                    <p className="text-[#D82F5A] font-medium">Total: {payload[0].value}</p>
                                                                </div>
                                                            );
                                                        }
                                                        return null;
                                                    }}
                                                />
                                                <Bar dataKey="COUNT(*)" fill={PINK_DARK} radius={[3, 3, 0, 0]} barSize={16} />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>
                            </div>

                            {/* Revenue Loss Chart */}
                            <div className="col-span-1 lg:col-span-6 bg-white p-4 lg:p-6 pb-6 rounded-[4px] border border-gray-100 shadow-sm flex flex-col justify-between h-full">
                                <div>
                                    <div className="mb-4">
                                        <h3 className="text-sm font-semibold text-[#111827]">Kerugian Pendapatan Berdasarkan Langganan</h3>
                                        <p className="text-[10px] text-gray-400 mt-1">Estimasi kerugian pendapatan akibat churn</p>
                                    </div>

                                    <div className="h-[200px] flex items-end mt-8 w-full">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <BarChart data={subscriptionRevenueData} margin={{ top: 10, right: 5, left: -25, bottom: 0 }}>
                                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                                                <XAxis dataKey="subscription" fontSize={10} axisLine={false} tickLine={false} height={30} />
                                                <YAxis fontSize={10} axisLine={false} tickLine={false} />
                                                <Tooltip
                                                    cursor={{ fill: '#F9FAFB', radius: 4 }}
                                                    content={({ active, payload, label }) => {
                                                        if (active && payload && payload.length) {
                                                            return (
                                                                <div className="bg-white border border-gray-100 p-2 shadow-md rounded text-[10px]">
                                                                    <p className="font-bold text-gray-800 mb-0.5">{label}</p>
                                                                    <p className="text-[#D82F5A] font-medium">Kerugian: ${payload[0].value}</p>
                                                                </div>
                                                            );
                                                        }
                                                        return null;
                                                    }}
                                                />
                                                <Bar dataKey="lostRevenue" fill={PINK_DARK} radius={[3, 3, 0, 0]} barSize={16} />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* SEGMENT INSIGHT SECTION */}
                    <div className="mb-8">
                        <div className="mb-5 flex items-center justify-between">
                            <div>
                                <h3 className="text-base font-semibold text-gray-950 tracking-tight">Segment insight</h3>
                                <p className="text-xs text-gray-500 mt-0.5">Analisis performa berdasarkan segmentasi pelanggan</p>
                            </div>
                            <span className="px-2.5 py-1 bg-[#FEF5F6] text-[#D82F5A] text-xs font-semibold rounded-[2px] shrink-0">
                                {segmentData.length} Segments
                            </span>
                        </div>

                        {/* List Container Memanjang ke Bawah */}
                        <div className="border border-gray-200 rounded-[4px] bg-white divide-y divide-gray-100 shadow-[0_1px_3px_rgba(0,0,0,0.02)] overflow-hidden">
                            {segmentData.map((item, i) => (
                                <div
                                    key={i}
                                    className="p-4 grid grid-cols-2 sm:flex sm:flex-row sm:items-center justify-between gap-4 sm:gap-6 hover:bg-[#FEF5F6]/15 transition-colors duration-150 group"
                                >
                                    <div className="col-span-2 sm:w-1/4 min-w-0 border-b sm:border-b-0 pb-2 sm:pb-0">
                                        <span className="text-xs font-semibold text-gray-900 block group-hover:text-[#D82F5A] transition-colors duration-150">
                                            {item.segment}
                                        </span>
                                        <span className="text-[10px] text-gray-400 mt-0.5 block">Customer segment</span>
                                    </div>

                                    <div className="sm:w-1/4">
                                        <span className="text-[10px] lg:text-xs text-gray-400 block mb-0.5">Total customer</span>
                                        <span className="text-sm lg:text-base font-semibold text-[#D82F5A] tracking-tight">
                                            {Number(item.total).toLocaleString()}
                                        </span>
                                    </div>

                                    <div className="sm:w-1/4">
                                        <span className="text-[10px] lg:text-xs text-gray-400 block mb-0.5">Avg monthly charges</span>
                                        <span className="text-xs font-semibold text-gray-800">${item.avgMonthly}</span>
                                    </div>

                                    <div className="sm:w-1/4">
                                        <span className="text-[10px] lg:text-xs text-gray-400 block mb-0.5">Avg weekly watch hours</span>
                                        <span className="text-xs font-semibold text-gray-800">{item.avgView}h</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Footer Section */}
                <Footer />
            </main>
        </div>
    );
};

export default AnalisisUlasan;