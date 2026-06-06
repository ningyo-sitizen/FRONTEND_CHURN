import React, { useState, useEffect } from 'react';
import axios from "axios";
import logochurn from './assets/logo churn.png';
import unggahdata from './assets/unggahdata.png';
import Sidebar from './SideBar.jsx';
import Header from './Header.jsx';
import { ChevronRight } from 'lucide-react';
import { ChevronLeft } from 'lucide-react';
import LoadingOverlay from './LoadingOverlay.jsx';

import {
    IconBrandMyOppo,
    IconUserCircle,
    IconLogout2
} from '@tabler/icons-react';

import { useNavigate } from 'react-router-dom';
import { useAuth } from "../utils/auth";
import { useNotif } from "./NotificationContext";

const DashboardUser = () => {

    const navigate = useNavigate();
    const { showNotif } = useNotif();
    const user = useAuth();

    const [isOpen, setIsOpen] = useState(false);



    const [predictionData, setPredictionData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isLoading, setisLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalData, setTotalData] = useState(0);

    const [showBulkPopup, setShowBulkPopup] = useState(false);
    const [showPredictionPopup, setShowPredictionPopup] = useState(false);
    const [showProfilePopup, setShowProfilePopup] = useState(false);

    const [promo_ALL_R_H_S, setpromo_ALL_R_H_S] = useState("")
    const [promo_ALL_R_H_S_value, setpromo_ALL_R_H_S_value] = useState("")
    const [promo_ALL_R_H_S_expired, setpromo_ALL_R_H_S_expired] = useState("")

    const [promo_H_M_R_L_S, setpromo_H_M_R_L_S] = useState("")
    const [promo_H_M_R_L_S_value, setpromo_H_M_R_L_S_value] = useState("")
    const [promo_H_M_R_L_S_expired, setpromo_H_M_R_L_S_expired] = useState("")


    const [promo_M_H_R_M_S, setpromo_M_H_R_M_S] = useState("")
    const [promo_M_H_R_M_S_value, setpromo_M_H_R_M_S_value] = useState("")
    const [promo_M_H_R_M_S_expired, setpromo_M_H_R_M_S_expired] = useState("")

    const [promo_L_R_M_L_S, setpromo_L_R_M_L_S] = useState("")
    const [promo_L_R_M_L_S_value, setpromo_L_R_M_L_S_value] = useState("")
    const [promo_L_R_M_L_S_expired, setpromo_L_R_M_L_S_expired] = useState("")

    const limit = 10;
    const [formData] = useState({
        nama: "Zahrah Purnama",
        email: "zahrah.purnama@gmail.com"
    });
    const profileImg = null;

    useEffect(() => {

        if (user) {
            fetchPredictionData(page);
        }

    }, [user, page]);

    const fetchPredictionData = async (currentPage = 1) => {

        try {

            setLoading(true);

            const token = localStorage.getItem("token");

            const response = await fetch(
                `${import.meta.env.VITE_BACKEND_URL}/prediction/prediction-data?page=${currentPage}&limit=${limit}`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    }
                }
            );

            const data = await response.json();

            if (data.status === "success") {

                setPredictionData(data.data || []);
                setPage(data.page || 1);
                setTotalPages(data.totalPages || 1);
                setTotalData(data.totalData || 0);

            } else {

                setPredictionData([]);

            }

        } catch (err) {

            console.log(err);
            setPredictionData([]);

        } finally {

            setLoading(false);

        }

    };
    const handleBulkEmail = async () => {
        try {
            setisLoading(true)
            const token = localStorage.getItem("token")
            console.log(promo_ALL_R_H_S)
            const response = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/email/bulk-send`,
                {
                    promo_ALL_R_H_S: promo_ALL_R_H_S,
                    promo_ALL_R_H_S_value: promo_ALL_R_H_S_value,
                    promo_ALL_R_H_S_expired: promo_ALL_R_H_S_expired,

                    promo_H_M_R_L_S: promo_H_M_R_L_S,
                    promo_H_M_R_L_S_value: promo_H_M_R_L_S_value,
                    promo_H_M_R_L_S_expired: promo_H_M_R_L_S_expired,

                    promo_M_H_R_M_S: promo_M_H_R_M_S,
                    promo_M_H_R_M_S_value: promo_M_H_R_M_S_value,
                    promo_M_H_R_M_S_expired: promo_M_H_R_M_S_expired,

                    promo_L_R_M_L_S: promo_L_R_M_L_S,
                    promo_L_R_M_L_S_value: promo_L_R_M_L_S_value,
                    promo_L_R_M_L_S_expired: promo_L_R_M_L_S_expired,

                    nama_perusahaan : user?.nama_perusahaan,
                    link_app : user?.link_app,
                    nama_app : user?.nama_app
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            )
            showNotif('success', response.data.message)
            setisLoading(false)
            setShowBulkPopup(false)
        } catch (err) {
            showNotif('error', response.data.message)
            console.log(err)
        }finally{
            setisLoading(false)
        }
    }

    const handleNOsave = async () => {

        try {

            const token = localStorage.getItem("token");

            const response = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/prediction/no-save`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            showNotif("success", response.data.message);

            setShowPredictionPopup(false);

            fetchPredictionData(page);

        } catch (err) {
            showNotif("error", response.data.message);
            console.log(err);

        }

    };

    const makeprediction = async () => {
        if (
            (!user?.nama_perusahaan || user?.nama_perusahaan === "unknown") &&
            (!user?.nama_app || user?.nama_app === "unknown") &&
            (!user?.link_app || user?.link_app === "unknown")
        ) {
            setShowProfilePopup(true)
        } else {
            navigate('/uploadData')
        }
    }
    const handleYESsave = async () => {

        try {

            const token = localStorage.getItem("token");

            const response = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/prediction/yes-save`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            showNotif("success", response.data.message);

            setShowPredictionPopup(false);

            fetchPredictionData(page);

        } catch (err) {

            console.log(err);

        }

    };

    const highRisk =
        predictionData.filter(item => item.Risk === "High").length;

    const churnCustomer =
        predictionData.filter(item => item.Prediction === 1).length;

    return (

        <div
            className="flex h-screen w-screen bg-[#F9FAFB] text-[#111827] overflow-hidden"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
        >

            {/* SIDEBAR */}
            <Sidebar />
            {/* MAIN */}
            <main className="flex-1 h-full overflow-y-auto overflow-x-hidden">

                {/* TOPBAR */}
                <Header formData={user} profileImg={user?.avatar} />

                {/* CONTENT */}
                <div className="p-8">

                    {/* HEADER */}
                    <div className="mb-8">
                        <h1 className="text-xl font-semibold">
                            Dashboard
                        </h1>

                        <p className="text-sm text-gray-500 mt-1">
                            Analisis Risiko Kehilangan Pelanggan
                        </p>

                    </div>

                    {/* STAT CARD */}
                    <div className="bg-white rounded-[4px] border border-[#EDEDED] shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-7 mb-12">
                        {/* TOP ROW: Stats dengan warna & teks yang persis sesuai gambar */}
                        <div className="flex flex-wrap md:flex-nowrap items-center justify-between gap-4 mb-5">
                            {[
                                {
                                    label: "Tingkat Pengunduran Diri",
                                    val: totalData, // Biasanya ini angka churn
                                    suffix: "%",
                                    icon: "ti-arrow-big-down-lines",
                                    col: "text-[#BE78E3] bg-[#F1EDF8]" // Ungu sesuai gambar
                                },
                                {
                                    label: "Total Pelanggan",
                                    val: highRisk, // Ganti ke variabel total pelangganmu
                                    suffix: " Orang",
                                    icon: "ti-users",
                                    col: "text-[#DE869D] bg-[#F6EAEC]" // Pink sesuai gambar
                                },
                                {
                                    label: "Berisiko Tinggi",
                                    val: churnCustomer, // Ganti ke variabel risiko tinggi
                                    suffix: "%",
                                    icon: "ti-trending-up",
                                    col: "text-[#EAAD62] bg-[#FDF0ED]" // Orange sesuai gambar
                                },
                                {
                                    label: "Total Pages",
                                    val: totalPages,
                                    suffix: "",
                                    icon: "ti-database",
                                    col: "text-[#C6CE56] bg-[#F6F7E6]" // Hijau kekuningan sesuai gambar
                                }
                            ].map((item, idx) => (
                                <React.Fragment key={idx}>
                                    <div className="flex items-center gap-5 flex-1 min-w-[200px] px-4">
                                        {/* Icon Box */}
                                        <div className={`w-10 h-10 rounded-[4px] flex items-center justify-center text-2xl ${item.col}`}>
                                            <i className={`ti ${item.icon}`}></i>
                                        </div>

                                        {/* Label & Value */}
                                        <div className="flex flex-col">
                                            <p className="text-xs text-gray-400">{item.label}</p>
                                            <p className="text-base font-semibold text-gray-800">
                                                {item.val}{item.suffix}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Divider Vertikal */}
                                    {idx !== 3 && <div className="hidden md:block w-[1px] h-12 bg-gray-100"></div>}
                                </React.Fragment>
                            ))}
                        </div>

                        {/* BOTTOM ROW: Analisis Note */}
                        <div className="flex items-center justify-between bg-gray-50/50 border border-[#DCDBDB] rounded-[4px] p-4 px-8 group cursor-pointer hover:bg-gray-50 transition-colors">
                            <div className="flex items-center gap-2 text-xs">
                                <span className="text-[#D82F5A] font-semibold">statistik</span>
                                <span className="text-gray-400 text-xs">|</span>
                                <span className="text-gray-600 text-xs">
                                    Ini adalah hasil analisis data statistik di atas
                                </span>
                            </div>

                            <div className="flex items-center gap-2 text-gray-400 group-hover:text-[#D82F5A] transition-colors text-xs">
                                <span onClick={() => navigate('/analisisUlasan')}>Lihat detail analitik</span>
                                <i className="ti ti-arrow-right"></i>
                            </div>
                        </div>
                    </div>

                    {/* TABLE */}
                    <div className="bg-white rounded-[4px] border border-[#ededed] overflow-hidden">

                        <div className="p-6 flex justify-between items-center">

                            <div>

                                <h2 className="text-lg font-semibold">
                                    Data Pelanggan & Prediksi Churn
                                </h2>

                                <p className="text-xs text-gray-400 mt-1">
                                    Daftar pelanggan berdasarkan hasil prediksi
                                </p>

                            </div>

                            {
                                predictionData.length > 0 && (

                                    <div className="flex gap-3">

                                        <div className="flex gap-3">
                                            {/* Tombol Bulk Email */}
                                            <button
                                                onClick={() => setShowBulkPopup(true)}
                                                className="bg-[#D82F5A] hover:bg-[#E48CA3] text-xs text-white px-5 py-2 rounded-[4px] flex items-center gap-2 transition-colors shadow-sm"
                                            >
                                                <i className="ti ti-mail-fast text-base"></i>
                                                Bulk Email
                                            </button>

                                            {/* Tombol Prediksi Baru */}
                                            <button
                                                onClick={() => setShowPredictionPopup(true)}
                                                className="bg-[#111827] hover:bg-gray-800 text-xs text-white px-4 py-1 rounded-[4px] flex items-center gap-2 transition-colors shadow-sm"
                                            >
                                                <i className="ti ti-plus text-lg"></i>
                                                Prediksi Baru
                                            </button>
                                        </div>

                                    </div>

                                )
                            }

                        </div>

                        <div className="p-6">

                            {
                                loading ? (

                                    <div className="text-center py-20">
                                        Loading...
                                    </div>

                                ) : predictionData.length === 0 ? (

                                    <div className="py-24 flex flex-col items-center">

                                        <img
                                            src={unggahdata}
                                            className="w-40 mb-4"
                                            alt=""
                                        />

                                        <h2 className="text-xl font-semibold mb-2">
                                            Belum ada data pelanggan
                                        </h2>

                                        <p className="text-gray-500 text-sm mb-6">
                                            Data pelanggan akan ditampilkan di sini setelah Anda mengunggah file.
                                        </p>

                                        <button
                                            onClick={() => {
                                                makeprediction();
                                            }}             
                                            className="bg-[#D82F5A] text-white text-sm px-4 py-3 rounded-[4px]"
                                        >
                                            Upload Data
                                        </button>

                                    </div>

                                ) : (

                                    <>
                                        <div className="overflow-x-auto">

                                            <table className="w-full">

                                                <thead>

                                                    <tr className="bg-[#D82F5A] text-white">

                                                        <th className="p-4 text-xs">
                                                            Customer ID
                                                        </th>

                                                        <th className="p-4 text-xs">
                                                            Account Age
                                                        </th>

                                                        <th className="p-4 text-xs">
                                                            Monthly Charges
                                                        </th>

                                                        <th className="p-4 text-xs">
                                                            Total Charges
                                                        </th>

                                                        <th className="p-4 text-xs">
                                                            Score
                                                        </th>

                                                        <th className="p-4 text-xs">
                                                            Risk
                                                        </th>

                                                        <th className="p-4 text-xs">
                                                            Prediction
                                                        </th>

                                                        <th className="p-4 text-xs">
                                                            Segment
                                                        </th>

                                                        <th className="p-4 text-xs">
                                                            Action
                                                        </th>

                                                    </tr>

                                                </thead>

                                                <tbody>

                                                    {
                                                        predictionData.map((item, index) => (

                                                            <tr
                                                                key={index}
                                                                className="border-b hover:bg-gray-50"
                                                            >

                                                                <td className="p-4 text-center text-xs">
                                                                    {item.CustomerID}
                                                                </td>

                                                                <td className="p-4 text-center text-xs">
                                                                    {item.AccountAge}
                                                                </td>

                                                                <td className="p-4 text-center text-xs">
                                                                    ${item.MonthlyCharges}
                                                                </td>

                                                                <td className="p-4 text-center text-xs">
                                                                    ${item.TotalCharges}
                                                                </td>

                                                                <td className="p-4 text-center text-xs font-semibold">
                                                                    {item.Score}
                                                                </td>

                                                                <td className="p-4 text-center">
                                                                    <span
                                                                        className="px-4 py-1 rounded-full text-xs font-semibold"
                                                                        style={{
                                                                            backgroundColor:
                                                                                item.Risk === "High"
                                                                                    ? "#FFE1E1"
                                                                                    : item.Risk === "Medium"
                                                                                        ? "#F6F7E6"
                                                                                        : "#F5E4FF",
                                                                            color:
                                                                                item.Risk === "High"
                                                                                    ? "#FF1515"
                                                                                    : item.Risk === "Medium"
                                                                                        ? "#EAAD62"
                                                                                        : "#BE78E3",
                                                                        }}
                                                                    >
                                                                        {item.Risk}
                                                                    </span>
                                                                </td>
                                                                <td className="p-4 text-center text-xs">

                                                                    {
                                                                        item.Prediction === 1
                                                                            ? (
                                                                                <span className="text-red-500 font-bold">
                                                                                    Churn
                                                                                </span>
                                                                            )
                                                                            : (
                                                                                <span className="text-green-500 font-bold">
                                                                                    Non-Churn
                                                                                </span>
                                                                            )
                                                                    }

                                                                </td>

                                                                <td className="p-4 text-center text-xs">
                                                                    {item.Segment}
                                                                </td>

                                                                <td className="p-4 text-center">
                                                                    <div className="group relative flex justify-center items-center">
                                                                        <button
                                                                            onClick={() =>
                                                                                navigate(`/DashboardDetail?prediction_id=${item.prediction_id}&CustomerID=${item.CustomerID}`)
                                                                            }
                                                                            className="p-2 text-[#D82F5A] hover:bg-[#FFE1E1] rounded-full transition-all duration-200 flex items-center justify-center"
                                                                        >
                                                                            {/* Icon panah ala 'next' */}
                                                                            <ChevronRight size={20} strokeWidth={2} />
                                                                        </button>

                                                                        {/* Tooltip Tulisan Detail pas di Hover */}
                                                                        <span className="absolute bottom-full mb-2 scale-0 group-hover:scale-100 transition-all duration-150 origin-bottom bg-gray-800 text-white text-[10px] px-2 py-1 rounded shadow-md whitespace-nowrap z-10">
                                                                            Detail
                                                                        </span>
                                                                    </div>
                                                                </td>

                                                            </tr>

                                                        ))
                                                    }

                                                </tbody>

                                            </table>

                                        </div>

                                        {/* PAGINATION */}
                                        <div className="flex justify-center items-center gap-2 mt-8 font-['Plus_Jakarta_Sans',_sans-serif]">
                                            {/* Tombol Sebelumnya */}
                                            <button
                                                disabled={page === 1}
                                                onClick={() => setPage(page - 1)}
                                                className={`flex items-center gap-2 px-3 py-1 text-sm transition-colors ${page === 1 ? "text-[#B3B3B3] cursor-not-allowed" : "text-[#757575] hover:text-[#D82F5A]"
                                                    }`}
                                            >
                                                <ChevronLeft size={18} strokeWidth={2.5} color={page === 1 ? "#B3B3B3" : "#D82F5A"} />
                                                <span className="font-medium">Sebelumnya</span>
                                            </button>

                                            {/* Render Angka Halaman */}
                                            <div className="flex items-center gap-1.5">
                                                {[...Array(totalPages)].map((_, index) => {
                                                    const pageNum = index + 1;
                                                    const isActive = page === pageNum;

                                                    return (
                                                        <button
                                                            key={pageNum}
                                                            onClick={() => setPage(pageNum)}
                                                            className={`w-9 h-9 flex items-center justify-center rounded-xl text-sm transition-all ${isActive
                                                                ? "bg-[#F6EAEC] text-[#D82F5A] border border-[#DE869D] font-bold shadow-sm"
                                                                : "text-[#D82F5A] hover:bg-[#F6EAEC]/50 font-medium"
                                                                }`}
                                                        >
                                                            {pageNum}
                                                        </button>
                                                    );
                                                })}
                                            </div>

                                            {/* Tombol Selanjutnya */}
                                            <button
                                                disabled={page === totalPages}
                                                onClick={() => setPage(page + 1)}
                                                className={`flex items-center gap-2 px-3 py-1 text-sm transition-colors ${page === totalPages ? "text-[#B3B3B3] cursor-not-allowed" : "text-[#757575] hover:text-[#D82F5A]"
                                                    }`}
                                            >
                                                <span className="font-medium text-[#757575]">Selanjutnya</span>
                                                <ChevronRight size={18} strokeWidth={2.5} color={page === totalPages ? "#B3B3B3" : "#D82F5A"} />
                                            </button>
                                        </div>                                    </>
                                )
                            }

                        </div>

                    </div>
                    {showBulkPopup && (
                        <div className="fixed inset-0 bg-[#1A1A1A]/60 backdrop-blur-sm flex justify-center items-center z-50 p-4 font-['Plus_Jakarta_Sans',_sans-serif]">
                            <div className="bg-white rounded-[4px] w-full max-w-[1200px] shadow-xl overflow-hidden border border-gray-100">

                                {/* HEADER */}
                                <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-white">
                                    <div>
                                        <h3 className="text-xl font-semibold mt-3 text-[#1A1A1A]">Strategi pertahankan pengguna</h3>
                                        <p className="text-[#757575] text-sm mt-1 font-medium">Atur promo spesial agar masing-masing kelompok pengguna berlangganan kembali.</p>
                                    </div>
                                    <button
                                        onClick={() => setShowBulkPopup(false)}
                                        className="p-1 hover:bg-gray-100 rounded-[4px] transition-colors"
                                    >
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#757575" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                                    </button>
                                </div>

                                {/* TABLE AREA */}
                                <div className="p-6">
                                    <div className="overflow-hidden border border-gray-200 rounded-[4px]">
                                        <table className="w-full text-center border-collapse">
                                            <thead>
                                                <tr className="bg-[#F6EAEC] border-b border-[#DE869D]/30">
                                                    <th className="p-3 text-[#D82F5A] font-medium text-xs tracking-normal">Status risiko</th>
                                                    <th className="p-3 text-[#D82F5A] font-medium text-xs tracking-normal">Kelompok pengguna</th>
                                                    <th className="p-3 text-[#D82F5A] font-medium text-xs tracking-normal">Saran konten</th>
                                                    <th className="p-3 text-[#D82F5A] font-medium text-xs tracking-normal">Nama promo</th>
                                                    <th className="p-3 text-[#D82F5A] font-medium text-xs tracking-normal w-24">Diskon %</th>
                                                    <th className="p-3 text-[#D82F5A] font-medium text-xs tracking-normal">Batas waktu</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-100 text-[#1A1A1A]">

                                                {/* HIGH - Basic Frustrated User */}
                                                <tr className="hover:bg-gray-50 transition-colors font-medium">
                                                    <td className="p-3">
                                                        <span className="inline-block px-3 py-1 rounded-full bg-[#FFE1E1] text-[#D82F5A] text-xs border border-[#DE869D]/20">
                                                            High-Medium-Low
                                                        </span>
                                                    </td>

                                                    <td className="p-3 text-sm">
                                                        Low Engagement Users
                                                    </td>

                                                    <td className="p-3 text-xs text-[#757575]">
                                                        Diskon besar + rekomendasi film favorit customer untuk mencegah churn.
                                                    </td>

                                                    <td className="p-3">
                                                        <input
                                                            type="text"
                                                            value={promo_ALL_R_H_S}
                                                            onChange={(e) => setpromo_ALL_R_H_S(e.target.value)}
                                                            placeholder="promo"
                                                            className="w-full text-center border border-gray-200 rounded-[4px] p-2 text-sm focus:border-[#D82F5A] outline-none transition-all font-medium"
                                                        />

                                                        <p className="text-[10px] text-gray-400 mt-1">
                                                            Rekomendasi: Cashback Premium / Free 1 Month
                                                        </p>
                                                    </td>

                                                    <td className="p-3">
                                                        <input
                                                            type="number"
                                                            value={promo_ALL_R_H_S_value}
                                                            onChange={(e) => setpromo_ALL_R_H_S_value(e.target.value)}
                                                            placeholder="50"
                                                            className="w-full text-center border border-gray-200 rounded-[4px] p-2 text-sm outline-none focus:border-[#D82F5A] font-medium"
                                                        />

                                                        <p className="text-[10px] text-gray-400 mt-1">
                                                            Rekomendasi: 40% - 50%
                                                        </p>
                                                    </td>

                                                    <td className="p-3">
                                                        <input
                                                            type="date"
                                                            value={promo_ALL_R_H_S_expired}
                                                            onChange={(e) => setpromo_ALL_R_H_S_expired(e.target.value)}
                                                            className="w-full text-center border border-gray-200 rounded-[4px] p-2 text-xs outline-none focus:border-[#D82F5A] font-medium"
                                                        />

                                                        <p className="text-[10px] text-gray-400 mt-1">
                                                            Rekomendasi: 3 - 7 Hari
                                                        </p>
                                                    </td>
                                                </tr>

                                                {/* HIGH-MEDIUM - Experienced User */}
                                                <tr className="hover:bg-gray-50 transition-colors font-medium">
                                                    <td className="p-3">
                                                        <span className="inline-block px-3 py-1 rounded-full bg-[#FFF4E5] text-[#EAAD62] text-xs border border-[#EAAD62]/20">
                                                            High - Medium
                                                        </span>
                                                    </td>

                                                    <td className="p-3 text-sm">
                                                        High Engagement Users
                                                    </td>

                                                    <td className="p-3 text-xs text-[#757575]">
                                                        medium offer + rekomendasi exclusive content premium.
                                                    </td>

                                                    <td className="p-3">
                                                        <input
                                                            type="text"
                                                            value={promo_H_M_R_L_S}
                                                            onChange={(e) => setpromo_H_M_R_L_S(e.target.value)}
                                                            placeholder="promo"
                                                            className="w-full text-center border border-gray-200 rounded-[4px] p-2 text-sm focus:border-[#D82F5A] outline-none transition-all font-medium"
                                                        />

                                                        <p className="text-[10px] text-gray-400 mt-1">
                                                            Rekomendasi: medium value promo
                                                        </p>
                                                    </td>

                                                    <td className="p-3">
                                                        <input
                                                            type="number"
                                                            value={promo_H_M_R_L_S_value}
                                                            onChange={(e) => setpromo_H_M_R_L_S_value(e.target.value)}
                                                            placeholder="30"
                                                            className="w-full text-center border border-gray-200 rounded-[4px] p-2 text-sm outline-none focus:border-[#D82F5A] font-medium"
                                                        />

                                                        <p className="text-[10px] text-gray-400 mt-1">
                                                            Rekomendasi: 20% - 35%
                                                        </p>
                                                    </td>

                                                    <td className="p-3 text-center">
                                                        <input
                                                            type="date"
                                                            value={promo_H_M_R_L_S_expired}
                                                            onChange={(e) => setpromo_H_M_R_L_S_expired(e.target.value)}
                                                            className="w-full text-center border border-gray-200 rounded-[4px] p-2 text-xs outline-none focus:border-[#D82F5A] font-medium"
                                                        />

                                                        <p className="text-[10px] text-gray-400 mt-1">
                                                            Rekomendasi: 7 - 14 Hari
                                                        </p>
                                                    </td>
                                                </tr>

                                                {/* MEDIUM-HIGH - Basic User */}
                                                <tr className="hover:bg-gray-50 transition-colors font-medium">
                                                    <td className="p-3">
                                                        <span className="inline-block px-3 py-1 rounded-full bg-[#F6F7E6] text-[#C6CE56] text-xs border border-[#C6CE56]/20">
                                                            Medium - High
                                                        </span>
                                                    </td>

                                                    <td className="p-3 text-sm">
                                                        Moderate Engagement Users
                                                    </td>

                                                    <td className="p-3 text-xs text-[#757575]">
                                                        Promo subscription + rekomendasi content populer & trending.
                                                    </td>

                                                    <td className="p-3">
                                                        <input
                                                            type="text"
                                                            value={promo_M_H_R_M_S}
                                                            onChange={(e) => setpromo_M_H_R_M_S(e.target.value)}
                                                            placeholder="promo"
                                                            className="w-full text-center border border-gray-200 rounded-[4px] p-2 text-sm focus:border-[#D82F5A] outline-none transition-all font-medium"
                                                        />

                                                        <p className="text-[10px] text-gray-400 mt-1">
                                                            Rekomendasi: Paket Hemat Streaming
                                                        </p>
                                                    </td>

                                                    <td className="p-3">
                                                        <input
                                                            type="number"
                                                            value={promo_M_H_R_M_S_value}
                                                            onChange={(e) => setpromo_M_H_R_M_S_value(e.target.value)}
                                                            placeholder="25"
                                                            className="w-full text-center border border-gray-200 rounded-[4px] p-2 text-sm outline-none focus:border-[#D82F5A] font-medium"
                                                        />

                                                        <p className="text-[10px] text-gray-400 mt-1">
                                                            Rekomendasi: 15% - 30%
                                                        </p>
                                                    </td>

                                                    <td className="p-3">
                                                        <input
                                                            type="date"
                                                            value={promo_M_H_R_M_S_expired}
                                                            onChange={(e) => setpromo_M_H_R_M_S_expired(e.target.value)}
                                                            className="w-full text-center border border-gray-200 rounded-[4px] p-2 text-xs outline-none focus:border-[#D82F5A] font-medium"
                                                        />

                                                        <p className="text-[10px] text-gray-400 mt-1">
                                                            Rekomendasi: 7 Hari
                                                        </p>
                                                    </td>
                                                </tr>

                                                {/* LOW - Basic User / Experienced User */}
                                                <tr className="hover:bg-gray-50 transition-colors font-medium">
                                                    <td className="p-3">
                                                        <span className="inline-block px-3 py-1 rounded-full bg-[#F5E4FF] text-[#BE78E3] text-xs border border-[#BE78E3]/20">
                                                            Low
                                                        </span>
                                                    </td>

                                                    <td className="p-3 text-sm">
                                                        Moderate Engagement Users - High Engagement Users
                                                    </td>

                                                    <td className="p-3 text-xs text-[#757575]">
                                                        Reward kecil + rekomendasi film populer untuk menjaga engagement.
                                                    </td>

                                                    <td className="p-3">
                                                        <input
                                                            type="text"
                                                            value={promo_L_R_M_L_S}
                                                            onChange={(e) => setpromo_L_R_M_L_S(e.target.value)}
                                                            placeholder="promo"
                                                            className="w-full text-center border border-gray-200 rounded-[4px] p-2 text-sm focus:border-[#D82F5A] outline-none transition-all font-medium"
                                                        />

                                                        <p className="text-[10px] text-gray-400 mt-1">
                                                            Rekomendasi: Bonus Voucher
                                                        </p>
                                                    </td>

                                                    <td className="p-3">
                                                        <input
                                                            type="number"
                                                            value={promo_L_R_M_L_S_value}
                                                            onChange={(e) => setpromo_L_R_M_L_S_value(e.target.value)}
                                                            placeholder="10"
                                                            className="w-full text-center border border-gray-200 rounded-[4px] p-2 text-sm outline-none focus:border-[#D82F5A] font-medium"
                                                        />

                                                        <p className="text-[10px] text-gray-400 mt-1">
                                                            Rekomendasi: 5% - 15%
                                                        </p>
                                                    </td>

                                                    <td className="p-3">
                                                        <input
                                                            type="date"
                                                            value={promo_L_R_M_L_S_expired}
                                                            onChange={(e) => setpromo_L_R_M_L_S_expired(e.target.value)}
                                                            className="w-full text-center border border-gray-200 rounded-[4px] p-2 text-xs outline-none focus:border-[#D82F5A] font-medium"
                                                        />

                                                        <p className="text-[10px] text-gray-400 mt-1">
                                                            Rekomendasi: 14 - 30 Hari
                                                        </p>
                                                    </td>
                                                </tr>

                                            </tbody>
                                        </table>
                                    </div>
                                </div>

                                {/* FOOTER ACTION */}
                                <div className="px-6 py-5 bg-white border-t border-gray-100 flex justify-end mb-3 items-center gap-3">
                                    <button
                                        onClick={() => setShowBulkPopup(false)}
                                        className="px-5 py-2 rounded-[4px] font-medium text-[#757575] bg-white border border-gray-200 hover:bg-gray-100 active:bg-gray-200 transition-all text-sm"
                                    >
                                        Batal
                                    </button>
                                    <button
                                        onClick={handleBulkEmail}
                                        className="bg-[#1A1A1A] hover:bg-[#333333] active:scale-[0.98] text-white px-6 py-2 rounded-[4px] font-medium text-sm transition-all flex items-center gap-2 shadow-sm"
                                    >
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m22 2-7 20-4-9-9-4Z" /><path d="M22 2 11 13" /></svg>
                                        <span>Kirim email ke semua</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                    {/* NEW PREDICTION POPUP */}
                    {
                        showPredictionPopup && (
                            <div className="fixed inset-0 bg-black/40 backdrop-blur-[2px] flex justify-center items-center z-50 p-4">
                                <div className="bg-[#F9FAFB] rounded-[4px] w-full max-w-[400px] shadow-[0_10px_25px_-5px_rgba(0,0,0,0.1)] border border-[#EDEDED]">

                                    <div className="p-8">
                                        {/* Header Clean dengan Icon Kecil */}
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="w-8 h-8 bg-white border border-[#EDEDED] rounded-[4px] flex items-center justify-center shadow-sm">
                                                <i className="ti ti-plus text-[#D82F5A] text-lg"></i>
                                            </div>
                                            <h2 className="text-sm font-bold text-gray-800 uppercase tracking-[1.5px]">
                                                Prediksi Baru
                                            </h2>
                                        </div>

                                        {/* Content area dengan background abu-abu yang lebih kontras sedikit */}
                                        <div className="bg-white border border-[#EDEDED] p-5 rounded-[4px] mb-6">
                                            <p className="text-xs text-gray-500 leading-relaxed">
                                                Sistem mendeteksi adanya data aktif. Apakah Anda ingin
                                                <span className="text-gray-800 font-semibold"> menyimpan hasil prediksi</span> saat ini sebelum memulai sesi baru?
                                            </p>
                                        </div>

                                        {/* Action Buttons */}
                                        <div className="flex flex-col gap-2">
                                            <button
                                                onClick={handleYESsave}
                                                className="w-full bg-[#111827] hover:bg-[#D82F5A] text-white py-2.5 rounded-[4px] text-[11px] font-bold uppercase tracking-widest transition-all"
                                            >
                                                Simpan & Lanjutkan
                                            </button>

                                            <button
                                                onClick={handleNOsave}
                                                className="w-full bg-transparent hover:bg-gray-100 text-gray-400 hover:text-gray-600 py-2 rounded-[4px] text-[10px] font-bold uppercase tracking-widest transition-all"
                                            >
                                                Abaikan & Buat Baru
                                            </button>
                                        </div>
                                    </div>

                                    {/* Footer info tipis */}
                                    <div className="bg-gray-50 px-8 py-3 border-t border-[#EDEDED] flex justify-end">
                                        <button
                                            onClick={() => setShowPredictionPopup(false)}
                                            className="text-[9px] text-gray-400 hover:text-red-500 font-bold uppercase tracking-tighter transition-colors"
                                        >
                                            [ Tutup ]
                                        </button>
                                    </div>
                                </div>
                            </div>

                        )
                    }

                    {
                        showProfilePopup && (
                            <div className="fixed inset-0 bg-black/40 backdrop-blur-[2px] flex justify-center items-center z-50 p-4">
                                <div className="bg-[#F9FAFB] rounded-[4px] w-full max-w-[400px] shadow-[0_10px_25px_-5px_rgba(0,0,0,0.1)] border border-[#EDEDED]">

                                    <div className="p-8">
                                        {/* Header Clean dengan Icon Kecil */}
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="w-8 h-8 bg-white border border-[#EDEDED] rounded-[4px] flex items-center justify-center shadow-sm">
                                                <i className="ti ti-plus text-[#D82F5A] text-lg"></i>
                                            </div>
                                            <h2 className="text-sm font-bold text-gray-800 uppercase tracking-[1.5px]">
                                                membuat prediction
                                            </h2>
                                        </div>

                                        {/* Content area dengan background abu-abu yang lebih kontras sedikit */}
                                        <div className="bg-white border border-[#EDEDED] p-5 rounded-[4px] mb-6">
                                            <p className="text-xs text-gray-500 leading-relaxed">
                                                Sistem mendeteksi bahwa profile and belum lengkap
                                                data detail <span className="text-gray-800 font-semibold">perusahaan</span> mu berlum lengkap semua mohon dilengkapi
                                            </p>
                                        </div>

                                        {/* Action Buttons */}
                                        <div className="flex flex-col gap-2">
                                            <button
                                                onClick={() => navigate('/profile')}
                                                className="w-full bg-[#111827] hover:bg-[#D82F5A] text-white py-2.5 rounded-[4px] text-[11px] font-bold uppercase tracking-widest transition-all"
                                            >
                                                pergi ke profile
                                            </button>

                                            <button
                                                onClick={() => setShowProfilePopup(false)}
                                                className="w-full bg-transparent hover:bg-gray-100 text-gray-400 hover:text-gray-600 py-2 rounded-[4px] text-[10px] font-bold uppercase tracking-widest transition-all"
                                            >
                                                tutup
                                            </button>
                                        </div>
                                    </div>

                                    {/* Footer info tipis */}
                                    <div className="bg-gray-50 px-8 py-3 border-t border-[#EDEDED] flex justify-end">
                                        <button
                                            onClick={() => setShowProfilePopup(false)}
                                            className="text-[9px] text-gray-400 hover:text-red-500 font-bold uppercase tracking-tighter transition-colors"
                                        >
                                            [ Tutup ]
                                        </button>
                                    </div>
                                </div>
                            </div>

                        )
                    }

                </div>

            </main>
        {isLoading && <LoadingOverlay />}
        </div>
    );
};

export default DashboardUser;