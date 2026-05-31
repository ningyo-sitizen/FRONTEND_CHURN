import React, { useState, useEffect } from 'react';
import Sidebar from './SideBar.jsx';
import Header from './Header.jsx';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
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
    const [ageData, setAgeData] = useState([]);
    const [clusterData, setClusterData] = useState([]);
    const [contentTypeData, setContentTypeData] = useState([]);
    const [chargesData, setChargesData] = useState([]);
    const [fileName, setFileName] = useState();
    const [genreData, setGenreData] = useState([]);
    const [subscriptionRevenueData, setSubscriptionRevenueData] = useState([]);

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
        <div className="flex min-h-screen bg-[#F9FAFB] font-['Plus_Jakarta_Sans',sans-serif]">
            <Sidebar />

            <main className="flex-1 flex flex-col">
                {/* Header Section dengan data user asli */}
                <Header formData={user} profileImg={user?.profileImg} />

                <div className="p-8 flex-1">
                    {/* JUDUL DAN SUBJUDUL HALAMAN */}
                    <div className="mb-8">
                        <h1 className="text-2xl font-semibold text-gray-800">Analisis Statistik Pelanggan</h1>
                        <p className="text-sm text-gray-400 mt-1">
                            Visualisasi data churn customer dan insight bisnis secara real-time.
                        </p>
                    </div>

                    {/* Filter & Dataset Info (Static placeholder from previous design) */}
                    <div className="flex items-center gap-4 mb-6">
                        <div className="bg-white border border-gray-100 px-4 py-2 rounded-[4px] flex items-center gap-3 shadow-sm">
                            <span className="text-xs text-gray-400">Dataset :</span>
                            <select className="text-xs font-medium outline-none bg-transparent">
                                <option>{fileName}</option>
                            </select>
                        </div>
                        <span className="text-xs text-gray-400">{stats.totalCustomer.toLocaleString()} Data terdeteksi</span>
                    </div>

                    {/* Stats Cards dengan Design Berwarna & Divider */}
                    <div className="bg-white rounded-[4px] border border-[#EDEDED] shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-7 mb-12">
                        <div className="flex flex-wrap md:flex-nowrap items-center justify-between gap-4 mb-5">
                            {[
                                {
                                    label: "Total Pelanggan",
                                    val: stats.totalCustomer,
                                    icon: "ti-users", // UTUH ASLI LU
                                    col: "text-[#DE869D] bg-[#F6EAEC]" // UTUH ASLI LU
                                },
                                {
                                    label: "Berisiko Tinggi",
                                    val: stats.highRisk,
                                    icon: "ti-trending-up", // UTUH ASLI LU
                                    col: "text-[#EAAD62] bg-[#FDF0ED]" // UTUH ASLI LU
                                },
                                {
                                    label: "Pelanggan Churn",
                                    val: stats.churnCustomer,
                                    icon: "ti-arrow-big-down-lines", // UTUH ASLI LU
                                    col: "text-[#BE78E3] bg-[#F1EDF8]" // UTUH ASLI LU
                                },
                                {
                                    label: "Total Pendapatan",
                                    val: `$${stats.totalRevenue.toLocaleString()}`,
                                    icon: "ti-cash", // UTUH ASLI LU
                                    col: "text-[#C6CE56] bg-[#F6F7E6]" // UTUH ASLI LU
                                },
                                {
                                    label: "Total Pendapatan dalam bahaya",
                                    val: `$${stats.churnRevenue.toLocaleString()}`,
                                    icon: "ti-wallet", // ICON SUDAH BEDA (ti-wallet, bukan ti-cash)
                                    col: "text-[#5A92C6] bg-[#EFF4FA]" // WARNA BIRU SOFT PASTEL
                                }
                            ].map((item, idx, arr) => (
                                <React.Fragment key={idx}>
                                    <div className="flex items-center gap-5 flex-1 min-w-[200px] px-4">
                                        {/* shrink-0 dipasang agar kotak background tetep simetris persegi & gak bakal benyek lagi */}
                                        <div className={`w-10 h-10 rounded-[4px] flex items-center justify-center text-2xl shrink-0 ${item.col}`}>
                                            <i className={`ti ${item.icon}`}></i>
                                        </div>
                                        <div className="flex flex-col">
                                            <p className="text-xs text-gray-400">{item.label}</p>
                                            <p className="text-base font-semibold text-gray-800">{item.val}</p>
                                        </div>
                                    </div>
                                    {/* FIX LOGIKA DIVIDER: Menggunakan arr.length agar pembatas membagi semua 5 kolom secara adil dan presisi */}
                                    {idx !== arr.length - 1 && <div className="hidden md:block w-[1px] h-12 bg-gray-100"></div>}
                                </React.Fragment>
                            ))}
                        </div>

                        {/* Analisis Note Design */}
                        <div className="flex items-center justify-between bg-gray-50/50 border border-[#DCDBDB] rounded-[4px] p-4 px-8 group cursor-pointer hover:bg-gray-50 transition-colors">
                            <div className="flex items-center gap-2 text-xs">
                                <span className="text-[#D82F5A] font-semibold">Dashboard Data Insight</span>
                                <span className="text-gray-400 text-xs">|</span>
                                <span className="text-gray-600 text-xs">
                                    Data didapat dari dashboard
                                </span>
                            </div>
                        </div>
                    </div>
                    {/* Main Charts - Grid Layout */}
                    <div>
                        {/* GRID BARIS 1: Langganan vs Prediksi Churn & Distribusi Risiko */}
                        <div className="grid grid-cols-12 gap-6 mb-12 items-stretch">
                            {/* Bar Chart Section */}
                            <div className="col-span-12 lg:col-span-8 bg-white p-6 pb-6 rounded-[4px] border border-gray-100 shadow-sm flex flex-col justify-between h-full">
                                <div>
                                    <div className="flex justify-between items-start mb-4">
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

                                    {/* mt-6 diset biar ada jarak aman dari deskripsi ke chart */}
                                    <div className="h-[200px] flex items-end mt-6">
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
                                                <Bar dataKey="churn" fill={PINK_DARK} radius={[3, 3, 0, 0]} barSize={20} />
                                                <Bar dataKey="nonChurn" fill={PINK_MEDIUM} radius={[3, 3, 0, 0]} barSize={20} />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>
                            </div>

                            {/* Pie Chart Section */}
                            <div className="col-span-12 lg:col-span-4 bg-white p-6 pb-6 rounded-[4px] border border-gray-100 shadow-sm flex flex-col justify-between h-full">
                                <div>
                                    <h3 className="text-sm font-semibold mb-1 text-[#111827]">Distribusi Risiko</h3>
                                    <p className="text-[10px] text-gray-400 mb-4">Sebaran pelanggan berdasarkan tingkat risiko</p>

                                    {/* mt-6 diset biar seimbang dengan bar chart sebelahnya */}
                                    <div className="h-44 flex items-center justify-center mt-6">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <PieChart>
                                                <Pie data={riskData} innerRadius={55} outerRadius={75} paddingAngle={4} dataKey="value">
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

                                <div className="flex flex-wrap items-center justify-start gap-x-4 gap-y-1 mt-4 text-[11px] text-gray-500 font-medium pl-1">
                                    {riskData.map((item, i) => (
                                        <span key={i} className="flex items-center gap-1.5">
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

                        {/* GRID BARIS 2: Analisis Preferensi Genre & Kerugian Pendapatan */}
                        <div className="grid grid-cols-12 gap-6 mb-12 items-stretch">
                            {/* Genre Chart */}
                            <div className="col-span-12 lg:col-span-6 bg-white p-6 pb-6 rounded-[4px] border border-gray-100 shadow-sm flex flex-col justify-between h-full">
                                <div>
                                    <div className="mb-4">
                                        <h3 className="text-sm font-semibold text-[#111827]">Analisis Preferensi Genre</h3>
                                        <p className="text-[10px] text-gray-400 mt-1">Distribusi pelanggan berdasarkan genre favorit</p>
                                    </div>

                                    {/* mt-8 ngasih ruang atas ideal biar grafik keliatan lega */}
                                    <div className="h-[200px] flex items-end mt-8">
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
                                                <Bar dataKey="COUNT(*)" fill={PINK_DARK} radius={[3, 3, 0, 0]} barSize={20} />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>
                            </div>

                            {/* Revenue Loss Chart */}
                            <div className="col-span-12 lg:col-span-6 bg-white p-6 pb-6 rounded-[4px] border border-gray-100 shadow-sm flex flex-col justify-between h-full">
                                <div>
                                    <div className="mb-4">
                                        <h3 className="text-sm font-semibold text-[#111827]">Kerugian Pendapatan Berdasarkan Langganan</h3>
                                        <p className="text-[10px] text-gray-400 mt-1">Estimasi kerugian pendapatan akibat churn</p>
                                    </div>

                                    {/* mt-8 dipasang biar konsisten dengan genre chart sebelah kiri */}
                                    <div className="h-[200px] flex items-end mt-8">
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
                                                <Bar dataKey="lostRevenue" fill="#D82F5A" radius={[3, 3, 0, 0]} barSize={20} />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="mb-8">
                        {/* Header */}
                        <div className="mb-5 flex items-center justify-between">
                            <div>
                                <h3 className="text-base font-semibold text-gray-950 tracking-tight">Segment insight</h3>
                                <p className="text-xs text-gray-500 mt-0.5">Analisis performa berdasarkan segmentasi pelanggan</p>
                            </div>
                            <span className="px-2.5 py-1 bg-[#FEF5F6] text-[#D82F5A] text-xs font-semibold rounded-[2px]">
                                {segmentData.length} Segments
                            </span>
                        </div>

                        {/* List Container Memanjang ke Bawah */}
                        <div className="border border-gray-200 rounded-[4px] bg-white divide-y divide-gray-100 shadow-[0_1px_3px_rgba(0,0,0,0.02)] overflow-hidden">
                            {segmentData.map((item, i) => (
                                <div
                                    key={i}
                                    className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-6 hover:bg-[#FEF5F6]/15 transition-colors duration-150 group"
                                >
                                    {/* 1. Nama Segmen (Bintik Pink Udah Dihapus Total) */}
                                    <div className="sm:w-1/4 min-w-0">
                                        <span className="text-xs font-semibold text-gray-900 block group-hover:text-[#D82F5A] transition-colors duration-150">
                                            {item.segment}
                                        </span>
                                        <span className="text-xs text-gray-400 mt-0.5 block">Customer segment</span>
                                    </div>

                                    {/* 2. Total Customer */}
                                    <div className="sm:w-1/4">
                                        <span className="text-xs text-gray-400 block mb-1">Total customer</span>
                                        <span className="text-base font-semibold text-[#D82F5A] tracking-tight">
                                            {Number(item.total).toLocaleString()}
                                        </span>
                                    </div>

                                    {/* 3. Avg Monthly Charges */}
                                    <div className="sm:w-1/4">
                                        <span className="text-xs text-gray-400 block mb-1">Avg monthly charges</span>
                                        <span className="text-xs font-semibold text-gray-800">${item.avgMonthly}</span>
                                    </div>

                                    {/* 4. Avg Watch Hours */}
                                    <div className="sm:w-1/4">
                                        <span className="text-xs text-gray-400 block mb-1">Avg weekly watch hours</span>
                                        <span className="text-xs font-semibold text-gray-800">{item.avgView}h</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>                </div>

                <Footer />
            </main>
        </div>
    );
};

export default AnalisisUlasan;