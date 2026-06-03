import React, { useState, useEffect } from 'react';
import axios from "axios";
import logochurn from './assets/logo churn.png';
import unggahdata from './assets/unggahdata.png';
import Header from "./Header";
import Sidebar from './SideBar';
import Footer from './Footer';
import { useSearchParams } from "react-router-dom";



import {
    IconBrandMyOppo,
    IconUserCircle,
    IconLogout2
} from '@tabler/icons-react';

import { useNavigate } from 'react-router-dom';
import { useAuth } from "../utils/auth";
import { useNotif } from "./NotificationContext";

const DashboarHistory = () => {

    const [disableButton, setDisableButton] = useState(true);
    const [searchParams] = useSearchParams();

    const prediction_id = searchParams.get("prediction_id");

    const navigate = useNavigate();
    const { showNotif } = useNotif();
    const user = useAuth();

    const [isOpen, setIsOpen] = useState(false);



    const [predictionData, setPredictionData] = useState([]);
    const [loading, setLoading] = useState(true);

    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalData, setTotalData] = useState(0);

    const [showBulkPopup, setShowBulkPopup] = useState(false);
    const [showPredictionPopup, setShowPredictionPopup] = useState(false);

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
                `${import.meta.env.VITE_BACKEND_URL}/prediction/prediction-history?page=${currentPage}&limit=${limit}&prediction_id=${prediction_id}`,
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
        console.log("1")
        try {
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
                    promo_L_R_M_L_S_expired: promo_L_R_M_L_S_expired
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            )
            showNotif('error', response.data.message)
            setShowBulkPopup(false)
        } catch (err) {
            console.log(err)
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

            console.log(err);

        }

    };

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
            className="flex min-h-screen bg-[#F9FAFB] text-[#111827]"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
        >

            {/* SIDEBAR */}
            <Sidebar>

            </Sidebar>

            {/* MAIN */}
            <main className="flex-1 overflow-x-hidden">

                {/* TOPBAR */}
                <Header formData={user} profileImg={user?.avatar} />

                {/* CONTENT */}
                <div className="p-8">

                    {/* HEADER */}
                    <div className="mb-8">

                        <h1 className="text-2xl font-semibold">
                            Dashboard
                        </h1>

                        <p className="text-sm text-gray-500 mt-1">
                            Analisis Risiko Kehilangan Pelanggan
                        </p>

                    </div>

                    {/* STAT CARD */}<div className="bg-white rounded-[4px] border border-[#EDEDED] shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-7 mb-12">
                        {/* Container Utama: Menggunakan flex untuk layout horizontal presisi lengkap dengan garis pembatas */}
                        <div className="flex flex-wrap md:flex-nowrap items-center justify-between gap-4">

                            {/* 1. Tingkat Pengunduran Diri (Ungu) */}
                            <div className="flex items-center gap-5 flex-1 min-w-[200px] px-4">
                                <div className="w-10 h-10 rounded-[4px] flex items-center justify-center text-2xl text-[#BE78E3] bg-[#F1EDF8]">
                                    <i className="ti ti-arrow-big-down-lines"></i>
                                </div>
                                <div className="flex flex-col">
                                    <p className="text-xs text-gray-400">Tingkat Pengunduran Diri</p>
                                    <p className="text-base font-semibold text-gray-800">
                                        {churnCustomer}%
                                    </p>
                                </div>
                            </div>

                            {/* Divider Vertikal */}
                            <div className="hidden md:block w-[1px] h-12 bg-[#EDEDED]"></div>

                            {/* 2. Total Pelanggan (Pink) */}
                            <div className="flex items-center gap-5 flex-1 min-w-[200px] px-4">
                                <div className="w-10 h-10 rounded-[4px] flex items-center justify-center text-2xl text-[#DE869D] bg-[#F6EAEC]">
                                    <i className="ti ti-users"></i>
                                </div>
                                <div className="flex flex-col">
                                    <p className="text-xs text-gray-400">Total Pelanggan</p>
                                    <p className="text-base font-semibold text-gray-800">
                                        {totalData} Orang
                                    </p>
                                </div>
                            </div>

                            {/* Divider Vertikal */}
                            <div className="hidden md:block w-[1px] h-12 bg-[#EDEDED]"></div>

                            {/* 3. Berisiko Tinggi (Orange) */}
                            <div className="flex items-center gap-5 flex-1 min-w-[200px] px-4">
                                <div className="w-10 h-10 rounded-[4px] flex items-center justify-center text-2xl text-[#EAAD62] bg-[#FDF0ED]">
                                    <i className="ti ti-trending-up"></i>
                                </div>
                                <div className="flex flex-col">
                                    <p className="text-xs text-gray-400">Berisiko Tinggi</p>
                                    <p className="text-base font-semibold text-gray-800">
                                        {highRisk}%
                                    </p>
                                </div>
                            </div>

                            {/* Divider Vertikal */}
                            <div className="hidden md:block w-[1px] h-12 bg-[#EDEDED]"></div>

                            {/* 4. Total Pages (Hijau) */}
                            <div className="flex items-center gap-5 flex-1 min-w-[200px] px-4">
                                <div className="w-10 h-10 rounded-[4px] flex items-center justify-center text-2xl text-[#C6CE56] bg-[#F6F7E6]">
                                    <i className="ti ti-database"></i>
                                </div>
                                <div className="flex flex-col">
                                    <p className="text-xs text-gray-400">Total Pages</p>
                                    <p className="text-base font-semibold text-gray-800">
                                        {totalPages}
                                    </p>
                                </div>
                            </div>

                        </div>
                    </div>

                    {/* TABLE */}
                    <div className="bg-white rounded-[4px] border overflow-hidden">

                        {/* HEADER SECTION (Tanpa Garis Bawah / border-b) */}
                        <div className="p-6 flex justify-between items-center">
                            <div>
                                <h2 className="text-xl font-semibold">
                                    Data Pelanggan & Prediksi Churn
                                </h2>
                                <p className="text-xs text-gray-400 mt-1">
                                    Daftar pelanggan berdasarkan hasil prediksi
                                </p>
                            </div>

                            {predictionData.length > 0 && (
                                <div className="flex gap-3">
                                    <button
                                        onClick={() => setShowBulkPopup(true)}
                                        disabled={disableButton}
                                        className={`
            flex items-center gap-2 px-4 py-2.5 rounded-[4px] text-white text-xs font-semibold transition-all
            ${disableButton
                                                ? "bg-gray-400 cursor-not-allowed"
                                                : "bg-[#D82F5A] hover:bg-[#bb244a]"
                                            }
          `}
                                    >
                                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                        </svg>
                                        Bulk Email
                                    </button>

                                    
                                </div>
                            )}
                        </div>

                        <div className="px-6 pb-6">
                            {loading ? (
                                <div className="text-center py-20">Loading...</div>
                            ) : predictionData.length === 0 ? (
                                <div className="py-24 flex flex-col items-center">
                                    <img src={unggahdata} className="w-40 mb-4" alt="" />
                                    <h2 className="text-2xl font-semibold mb-2">Belum Ada Data</h2>
                                    <p className="text-gray-500 text-sm mb-6">Upload data pelanggan terlebih dahulu</p>
                                    <button onClick={() => navigate('/uploadData')} className="bg-[#D82F5A] text-white px-8 py-3 rounded-[4px]">Upload Data</button>
                                </div>
                            ) : (
                                <>
                                    {/* TABLE SECTION */}
                                    <div className="overflow-x-auto">
                                        <table className="w-full border-collapse">
                                            <thead>
                                                <tr className="bg-[#D82F5A] text-white">
                                                    <th className="p-4 text-xs font-semibold text-center whitespace-nowrap">Customer ID</th>
                                                    <th className="p-4 text-xs font-semibold text-center whitespace-nowrap">Account Age</th>
                                                    <th className="p-4 text-xs font-semibold text-center whitespace-nowrap">Monthly Charges</th>
                                                    <th className="p-4 text-xs font-semibold text-center whitespace-nowrap">Total Charges</th>
                                                    <th className="p-4 text-xs font-semibold text-center whitespace-nowrap">Score</th>
                                                    <th className="p-4 text-xs font-semibold text-center whitespace-nowrap">Risk</th>
                                                    <th className="p-4 text-xs font-semibold text-center whitespace-nowrap">Prediction</th>
                                                    <th className="p-4 text-xs font-semibold text-center whitespace-nowrap">Segment</th>
                                                    <th className="p-4 text-xs font-semibold text-center whitespace-nowrap">Action</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-100">
                                                {predictionData.map((item, index) => (
                                                    <tr key={index} className="hover:bg-gray-50/40 transition-colors">
                                                        <td className="p-4 text-center text-xs text-gray-700 tracking-tight">{item.CustomerID}</td>
                                                        <td className="p-4 text-center text-xs text-gray-600">{item.AccountAge}</td>
                                                        <td className="p-4 text-center text-xs text-gray-700 tracking-tight">${item.MonthlyCharges}</td>
                                                        <td className="p-4 text-center text-xs text-gray-700 tracking-tight">${item.TotalCharges}</td>
                                                        <td className="p-4 text-center text-xs font-semibold text-gray-900">{item.Score}</td>

                                                        {/* RISK BADGE PASTEL BULAT SEMIBOLD */}
                                                        <td className="p-4 text-center">
                                                            <span className={`px-4 py-1 rounded-full text-[11px] font-semibold inline-block min-w-[75px] text-center ${item.Risk === "High" ? "bg-[#FFEBEB] text-[#FF4D4D]" :
                                                                    item.Risk === "Medium" ? "bg-[#FDF6E2] text-[#B27B12]" :
                                                                        "bg-[#F3E8FF] text-[#A855F7]"
                                                                }`}>{item.Risk}</span>
                                                        </td>

                                                        <td className="p-4 text-center text-xs">
                                                            <span className={`font-semibold ${item.Prediction === 1 ? "text-[#E11D48]" : "text-[#16A34A]"}`}>
                                                                {item.Prediction === 1 ? "Churn" : "Non-Churn"}
                                                            </span>
                                                        </td>

                                                        <td className="p-4 text-center text-xs text-gray-600">{item.Segment}</td>

                                                        {/* ACTION DENGAN KONDISI ASLI LU TANPA DIUBAH */}
                                                        <td className="p-4 text-center relative group">
                                                            {/* Tooltip Box saat hover */}
                                                            <span className="absolute -top-7 left-1/2 -translate-x-1/2 scale-0 group-hover:scale-100 px-2 py-1 bg-black/80 text-white text-[10px] font-semibold rounded-[4px] whitespace-nowrap z-10 transition-all origin-bottom">
                                                                Detail
                                                            </span>
                                                            <button
                                                                onClick={() =>
                                                                    item.Prediction === 1
                                                                        ? navigate(
                                                                            `/DashboardDetail?prediction_id=${item.prediction_id}&CustomerID=${item.CustomerID}`
                                                                        )
                                                                        : navigate(
                                                                            `/DashboardDetail?prediction_id=${item.prediction_id}&CustomerID=${item.CustomerID}`
                                                                        )
                                                                }
                                                                className="text-[#D82F5A] hover:text-[#bb244a] p-1 inline-flex justify-center items-center transition-colors"
                                                            >
                                                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                                                                </svg>
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>

                                    {/* PAGINATION SECTION (Sebelumnya / Bulat Angka / Selanjutnya) */}
                                    <div className="flex justify-center items-center gap-2 mt-8 text-xs font-semibold">
                                        <button
                                            disabled={page === 1}
                                            onClick={() => setPage(page - 1)}
                                            className={`flex items-center gap-1 px-2 py-1.5 transition-colors ${page === 1 ? "text-gray-300 cursor-not-allowed" : "text-gray-400 hover:text-gray-600"
                                                }`}
                                        >
                                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                                            </svg>
                                            <span>Sebelumnya</span>
                                        </button>

                                        <div className="flex items-center gap-1">
                                            {[...Array(totalPages)].map((_, index) => {
                                                const pageNum = index + 1;
                                                const isActive = page === pageNum;
                                                return (
                                                    <button
                                                        key={pageNum}
                                                        onClick={() => setPage(pageNum)}
                                                        className={`w-8 h-8 flex items-center justify-center rounded-[4px] text-xs font-semibold transition-all ${isActive ? "bg-[#FDF2F4] text-[#D82F5A] border border-[#F1C2CD]" : "text-gray-500 hover:bg-gray-50"
                                                            }`}
                                                    >
                                                        {pageNum}
                                                    </button>
                                                );
                                            })}
                                        </div>

                                        <button
                                            disabled={page === totalPages}
                                            onClick={() => setPage(page + 1)}
                                            className={`flex items-center gap-1 px-2 py-1.5 transition-colors ${page === totalPages ? "text-gray-300 cursor-not-allowed" : "text-gray-400 hover:text-gray-600"
                                                }`}
                                        >
                                            <span>Selanjutnya</span>
                                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                                            </svg>
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                    {
                        showBulkPopup && (

                            <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">

                                <div className="bg-white rounded-2xl p-8 w-[1500px] shadow-2xl">



                                    <div className="mb-8">

                                        <h3 className="text-xl font-bold mb-4">
                                            Retention Strategy
                                        </h3>

                                        <div className="overflow-x-auto">

                                            <table className="w-full border border-gray-300">

                                                <thead className="bg-gray-100">

                                                    <tr>

                                                        <th className="p-3 border">
                                                            Risk
                                                        </th>

                                                        <th className="p-3 border">
                                                            Segment
                                                        </th>

                                                        <th className="p-3 border">
                                                            Promo Strategy
                                                        </th>

                                                        <th className="p-3 border">
                                                            Movie Recommendation
                                                        </th>

                                                        <th className="p-3 border">
                                                            Promo Name
                                                        </th>

                                                        <th className="p-3 border">
                                                            Discount %
                                                        </th>

                                                        <th className="p-3 border">
                                                            ekspired
                                                        </th>
                                                    </tr>

                                                </thead>

                                                <tbody>

                                                    <tr className="hover:bg-gray-50">

                                                        <td className="p-3 border font-semibold text-red-500">
                                                            High, Medium, Low
                                                        </td>

                                                        <td className="p-3 border">
                                                            Basic Frustrated User
                                                        </td>

                                                        <td className="p-3 border">
                                                            30–40% comeback promo
                                                        </td>

                                                        <td className="p-3 border">
                                                            Favorite genre + trending movies
                                                        </td>

                                                        <td className="p-3 border">

                                                            <input
                                                                type="text"
                                                                value={promo_ALL_R_H_S}
                                                                onChange={(e) => { setpromo_ALL_R_H_S(e.target.value) }}
                                                                placeholder="Ex: Comeback Premium"
                                                                className="w-full border rounded-lg p-2"
                                                            />

                                                        </td>

                                                        <td className="p-3 border">

                                                            <input
                                                                type="number"
                                                                value={promo_ALL_R_H_S_value}
                                                                onChange={(e) => { setpromo_ALL_R_H_S_value(e.target.value) }}
                                                                placeholder="40"
                                                                className="w-full border rounded-lg p-2"
                                                            />

                                                        </td>

                                                        <td className="p-3 border">

                                                            <input
                                                                type="date"
                                                                value={promo_ALL_R_H_S_expired}
                                                                onChange={(e) => { setpromo_ALL_R_H_S_expired(e.target.value) }}
                                                                placeholder="2 weeks"
                                                                className="w-full border rounded-lg p-2"
                                                            />

                                                        </td>

                                                    </tr>

                                                    <tr className="hover:bg-gray-50">

                                                        <td className="p-3 border font-semibold text-orange-500">
                                                            High, Medium
                                                        </td>

                                                        <td className="p-3 border">
                                                            Experienced User
                                                        </td>

                                                        <td className="p-3 border">
                                                            Medium promo
                                                        </td>

                                                        <td className="p-3 border">
                                                            Popular movie recommendations
                                                        </td>

                                                        <td className="p-3 border">

                                                            <input
                                                                type="text"
                                                                value={promo_H_M_R_L_S}
                                                                onChange={(e) => { setpromo_H_M_R_L_S(e.target.value) }}
                                                                placeholder="Ex: Loyalty Reward"
                                                                className="w-full border rounded-lg p-2"
                                                            />

                                                        </td>

                                                        <td className="p-3 border">

                                                            <input
                                                                type="number"
                                                                value={promo_H_M_R_L_S_value}
                                                                onChange={(e) => { setpromo_H_M_R_L_S_value(e.target.value) }}
                                                                placeholder="20"
                                                                className="w-full border rounded-lg p-2"
                                                            />

                                                        </td>

                                                        <td className="p-3 border">

                                                            <input
                                                                type="date"
                                                                value={promo_H_M_R_L_S_expired}
                                                                placeholder="20"
                                                                onChange={(e) => { setpromo_H_M_R_L_S_expired(e.target.value) }}
                                                                className="w-full border rounded-lg p-2"
                                                            />

                                                        </td>

                                                    </tr>

                                                    <tr className="hover:bg-gray-50">

                                                        <td className="p-3 border font-semibold text-yellow-500">
                                                            Medium, High
                                                        </td>

                                                        <td className="p-3 border">
                                                            Basic User
                                                        </td>

                                                        <td className="p-3 border">
                                                            Limited promo
                                                        </td>

                                                        <td className="p-3 border">
                                                            Trending genre movies
                                                        </td>

                                                        <td className="p-3 border">

                                                            <input
                                                                type="text"
                                                                value={promo_M_H_R_M_S}
                                                                onChange={(e) => { setpromo_M_H_R_M_S(e.target.value) }}
                                                                placeholder="Ex: Weekend Promo"
                                                                className="w-full border rounded-lg p-2"
                                                            />

                                                        </td>

                                                        <td className="p-3 border">

                                                            <input
                                                                type="number"
                                                                value={promo_M_H_R_M_S_value}
                                                                onChange={(e) => { setpromo_M_H_R_M_S_value(e.target.value) }}
                                                                placeholder="15"
                                                                className="w-full border rounded-lg p-2"
                                                            />

                                                        </td>
                                                        <td className="p-3 border">

                                                            <input
                                                                type="date"
                                                                value={promo_M_H_R_M_S_expired}
                                                                onChange={(e) => { setpromo_M_H_R_M_S_expired(e.target.value) }}
                                                                placeholder="15"
                                                                className="w-full border rounded-lg p-2"
                                                            />

                                                        </td>


                                                    </tr>

                                                    <tr className="hover:bg-gray-50">

                                                        <td className="p-3 border font-semibold text-green-500">
                                                            Low
                                                        </td>

                                                        <td className="p-3 border">
                                                            Basic User, Experienced User
                                                        </td>

                                                        <td className="p-3 border">
                                                            Low promo
                                                        </td>

                                                        <td className="p-3 border">
                                                            Popular movie recommendations
                                                        </td>

                                                        <td className="p-3 border">

                                                            <input
                                                                type="text"
                                                                value={promo_L_R_M_L_S}
                                                                onChange={(e) => { setpromo_L_R_M_L_S(e.target.value) }}
                                                                placeholder="Ex: Member Special"
                                                                className="w-full border rounded-lg p-2"
                                                            />

                                                        </td>

                                                        <td className="p-3 border">

                                                            <input
                                                                type="number"
                                                                value={promo_L_R_M_L_S_value}
                                                                onChange={(e) => { setpromo_L_R_M_L_S_value(e.target.value) }}
                                                                placeholder="10"
                                                                className="w-full border rounded-lg p-2"
                                                            />

                                                        </td>

                                                        <td className="p-3 border">

                                                            <input
                                                                type="date"
                                                                value={promo_L_R_M_L_S_expired}
                                                                onChange={(e) => { setpromo_L_R_M_L_S_expired(e.target.value) }}
                                                                placeholder="10"
                                                                className="w-full border rounded-lg p-2"
                                                            />

                                                        </td>

                                                    </tr>

                                                </tbody>

                                            </table>

                                        </div>

                                    </div>

                                    {/* ACTION BUTTON */}
                                    <div className="flex justify-end gap-4">

                                        <button
                                            onClick={() => setShowBulkPopup(false)}
                                            className="bg-gray-400 hover:bg-gray-500 text-white px-6 py-3 rounded-xl font-semibold"
                                        >
                                            Cancel
                                        </button>

                                        <button
                                            onClick={handleBulkEmail}
                                            className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-xl font-semibold"
                                        >
                                            Send Bulk Email
                                        </button>

                                    </div>

                                </div>

                            </div>

                        )
                    }

                   
                </div>
                <Footer></Footer>
            </main>
        </div>

    );

};

export default DashboarHistory;