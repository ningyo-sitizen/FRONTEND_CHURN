import React, { useState, useEffect } from 'react'; // Tambahin useState biar gak error
import logochurn from './assets/logo churn.png';
import unggahdata from './assets/unggahdata.png';
import { IconBrandMyOppo } from '@tabler/icons-react';
import { IconUserCircle } from '@tabler/icons-react';
import { IconLogout2 } from '@tabler/icons-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from "../utils/auth";
import { jwtDecode } from "jwt-decode";
import { useNotif } from "./NotificationContext";
import Header from './Header';
import Footer from './Footer';
import Sidebar from './SideBar';
import axios from 'axios';
import { Loader2 } from 'lucide-react';

const ValidasiProses = () => {
    const [disableButton, setDisableButton] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [showRowDetail, setShowRowDetail] = useState(false);
    const [showHeaderDetail, setShowHeaderDetail] = useState(false);
    const navigate = useNavigate();

    const { showNotif } = useNotif()

    const user = useAuth()


    const [isLoadingProcess, setIsLoadingProcess] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [loadingProgress, setLoadingProgress] = useState(0);

    const location = useLocation();

    const validation = location.state?.validation;
    const file = location.state?.file;

    useEffect(() => {
        console.log(validation)
        if (!validation) {
            navigate("/uploadData", { replace: true });
            showNotif("error", "mohon isi ulang file");
        }

    }, [validation, navigate]);
    const handleProcessData = () => {
        setLoadingProgress(0);
        setIsLoadingProcess(true);

        const timer = setInterval(() => {
            setLoadingProgress((oldProgress) => {
                if (oldProgress >= 100) {
                    clearInterval(timer);

                    setTimeout(() => {
                        setIsLoadingProcess(false);
                        navigate('/dashboardUser');
                    }, 800);

                    return 100;
                }

                // Simulasi kecepatan loading yang natural
                const diff = Math.random() * 15;
                return Math.min(oldProgress + diff, 100);
            });
        }, 150);
    };

    const handleUploadpy = async () => {
        if (!file) return alert("Pilih file dulu");

        try {
            // Pemicu modal loading aktif pas proses mulai
            setIsLoading(true);

            const formData = new FormData();
            formData.append("file", file.raw);

            const token = localStorage.getItem("token");
            jwtDecode(token);

            await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/csv/upload-csv-py`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            navigate("/dashboardUser");
        } catch (err) {
            console.log("Upload error:", err);
        } finally {
            // Loading otomatis mati di sini setelah proses axios selesai (sukses/gagal)
            setIsLoading(false);
        }
    };
    const {
        totalRows = 0,
        totalError = 0,
        headerError = null,
        missingData = [],
        columnSummary = []
    } = validation || {};

    useEffect(() => {
        const noHeaderError =
            !headerError || Object.keys(headerError).length === 0;

        if (
            totalError === 0 &&
            noHeaderError &&
            missingData?.length === 0
        ) {
            setDisableButton(false);
        } else {
            setDisableButton(true);
        }
    }, [totalError, headerError, missingData]);


    return (
        <div className="flex min-h-screen bg-[#F9FAFB] text-[#111827]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            {/* SIDEBAR */}
            <Sidebar />
            {/* MAIN CONTENT */}
            <div className="flex-1 flex flex-col">
                {/* HEADER - Benerin typo z-50 */}
                <Header formData={user} profileImg={user?.profileImg} />
                {/* CONTENT AREA */}
                <main className="p-10 flex-1">
                    <div className="mb-8">
                        <h1 className="text-2xl font-semibold text-gray-800">Dashboard</h1>
                    </div>

                    {/* STEPPER */}
                    <div className="flex flex-col items-center mb-[85px] w-full max-w-4xl mx-auto">
                        <div className="relative flex items-center justify-between w-full">
                            <div className="absolute top-1/2 left-0 w-full h-[1px] bg-gray-200 -translate-y-1/2 z-0"></div>

                            {/* Garis Progress: Pink */}
                            <div className="absolute top-1/2 left-0 w-1/2 h-[1px] bg-[#D82F5A] -translate-y-1/2 z-0"></div>

                            {/* Step 01 */}
                            <div className="relative z-10 flex flex-col items-center bg-[#F8F9FA] px-4">
                                <div className="w-8 h-8 rounded-full bg-[#D82F5A] text-white flex items-center justify-center text-sm font-bold shadow-lg shadow-pink-100">
                                    <i className="ti ti-check"></i>
                                </div>
                                <span className="absolute -bottom-8 whitespace-nowrap text-xs font-medium text-[#111827]">Upload File</span>
                            </div>

                            {/* Step 02 */}
                            <div className="relative z-10 flex flex-col items-center bg-[#F8F9FA] px-4">
                                <div className="w-8 h-8 rounded-full border-2 border-[#D82F5A] bg-white flex items-center justify-center shadow-[0_0_10px_rgba(216,47,90,0.2)]">
                                    <span className="text-[#D82F5A] text-xs font-medium">02</span>
                                </div>
                                <span className="absolute -bottom-8 whitespace-nowrap text-xs font-medium text-gray-400">Validasi & Proses</span>
                            </div>

                            {/* Step 03 */}
                            <div className="relative z-10 flex flex-col items-center bg-[#F8F9FA] px-4">
                                <div className="w-8 h-8 rounded-full border-2 border-gray-100 bg-white flex items-center justify-center">
                                    <span className="text-gray-300 text-xs font-medium">03</span>
                                </div>
                                <span className="absolute -bottom-8 whitespace-nowrap text-xs font-medium text-gray-400">Proses & Hasil</span>
                            </div>
                        </div>
                    </div>

                    {/* WARNING ALERT */}
                    <div className="bg-white border border-[#EDEDED] p-3 rounded-[4px] flex items-center gap-3 mb-8 shadow-sm">
                        <i className="ti ti-alert-triangle text-amber-400 text-xl"></i>
                        <p className="text-[#929191] text-sm">
                            Total <span className="font-bold text-[#111827]"> {totalError} </span> masalah ditemukan pada data Anda
                        </p>
                    </div>

                    {/* ERROR SUMMARY TITLE */}
                    <h3 className="text-sm font-semibold mb-4 text-[#111827]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                        Ringkasan Validasi
                    </h3>

                    {/* HORIZONTAL COMPACT CARDS */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
                        {[
                            {
                                title: 'Total Rows',
                                count: `${columnSummary.length} data`,
                                desc: 'Jumlah total data yang berhasil diterima.',
                                isRows: true,
                                icon: 'ti-database',
                                iconBg: 'bg-blue-50',
                                iconColor: 'text-blue-500'
                            },
                            {
                                title: 'Missing Data',
                                count: `${totalError} error ditemukan`,
                                desc: 'Data kosong akan menghalangi proses upload.',
                                isError: true,
                                icon: 'ti-alert-circle',
                                iconBg: 'bg-[#FEF5F6]',
                                iconColor: 'text-[#D82F5A]',
                                action: () => setShowRowDetail(true)
                            },
                            {
                                title: 'Header Error',
                                count: headerError?.type ? '1 Masalah' : '0 Masalah',
                                desc: 'Ketidaksesuaian nama kolom pada file CSV.',
                                isHeader: true,
                                icon: 'ti-layout-navbar',
                                iconBg: 'bg-amber-50',
                                iconColor: 'text-amber-500',
                                action: () => setShowHeaderDetail(true)
                            }
                        ].map((err, i) => (
                            <div key={i} className="bg-white border border-[#EDEDED] p-4 rounded-[4px] shadow-sm flex items-start gap-3 relative transition-all">
                                {/* ICON */}
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${err.iconBg}`}>
                                    <i className={`ti ${err.icon} ${err.iconColor} text-xl`}></i>
                                </div>

                                {/* CONTENT */}
                                <div className="flex-1 pr-6">
                                    <div className="flex items-baseline gap-2 mb-1">
                                        <h4 className="text-sm font-semibold text-[#111827] leading-none">{err.title}</h4>
                                        <span className={`text-[11px] font-bold ${err.isRows ? 'text-blue-500' : 'text-[#D82F5A]'}`}>
                                            {err.count}
                                        </span>
                                    </div>
                                    <p className="text-[11px] text-[#929191] leading-tight">
                                        {err.desc}
                                    </p>
                                </div>

                                {/* NEXT BUTTON */}
                                {err.action && (
                                    <button
                                        onClick={err.action}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-300 hover:text-[#D82F5A] transition-colors"
                                    >
                                        <i className="ti ti-chevron-right text-lg"></i>
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* ========================= */}
                    {/* POP UP DETAIL SYSTEM */}
                    {/* ========================= */}
                    {(showRowDetail || showHeaderDetail) && (
                        <div className="fixed inset-0 z-[99] flex items-center justify-center p-6 bg-[#111827]/40 backdrop-blur-md transition-all">
                            <div className="bg-white rounded-[4px] shadow-2xl w-full max-w-lg flex flex-col overflow-hidden border border-white/20 animate-in fade-in slide-in-from-bottom-4 duration-300">

                                {/* Header Pop Up */}
                                <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-white">
                                    <div>
                                        <h3 className="font-semibold text-[#111827] text-sm">
                                            {showRowDetail ? 'Detail Temuan Data' : 'Validasi Struktur Header'}
                                        </h3>
                                        <p className="text-[10px] text-[#929191]">Tinjau kembali data sebelum melakukan impor</p>
                                    </div>
                                    <button
                                        onClick={() => { setShowRowDetail(false); setShowHeaderDetail(false); }}
                                        className="w-8 h-8 flex items-center justify-center rounded-[4px] hover:bg-gray-100 text-gray-400 transition-colors"
                                    >
                                        <i className="ti ti-x text-lg"></i>
                                    </button>
                                </div>

                                {/* Content Pop Up */}
                                <div className="p-6 max-h-[400px] overflow-y-auto bg-[#FAFBFC]">

                                    {/* MISSING DATA DETAIL */}
                                    {showRowDetail && (
                                        <div className="space-y-3">
                                            {missingData?.map((item, idx) => (
                                                <div key={idx} className="bg-white border border-[#EDEDED] p-4 rounded-[4px] shadow-sm flex flex-col gap-2 transition-all">
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center gap-2">
                                                            <span className="px-2 py-0.5 bg-[#FEF2F2] text-[#D82F5A] rounded-[4px] text-[10px] font-bold border border-red-100 uppercase">Baris {item.row}</span>
                                                            <span className="px-2 py-0.5 bg-[#F0F7FF] text-[#0061FF] rounded-[4px] text-[10px] font-bold border border-blue-100 uppercase">{item.column}</span>
                                                        </div>
                                                        <i className="ti ti-alert-circle text-[#D82F5A] text-sm"></i>
                                                    </div>
                                                    <p className="text-xs font-medium text-[#4B5563] leading-relaxed">
                                                        {item.message}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {/* HEADER ERROR DETAIL */}
                                    {showHeaderDetail && headerError && (
                                        <div className="space-y-6">
                                            <div className="bg-white border-l-4 border-red-500 shadow-sm p-4 rounded-[4px]">
                                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Tipe Masalah</p>
                                                <p className="text-sm font-semibold text-[#111827]">{headerError.type}</p>
                                            </div>

                                            <div className="space-y-5">
                                                <div>
                                                    <p className="text-[11px] font-bold text-gray-500 mb-3 flex items-center gap-2">
                                                        <i className="ti ti-check text-green-600"></i> Format Kolom Standar
                                                    </p>
                                                    <div className="flex flex-wrap gap-2">
                                                        {headerError.expected?.map((item, idx) => (
                                                            <span key={idx} className="px-2.5 py-1.5 bg-white border border-[#EDEDED] rounded-[4px] text-[11px] font-semibold text-gray-600 shadow-sm">
                                                                {item}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>

                                                <div className="pt-5 border-t border-gray-200">
                                                    <p className="text-[11px] font-bold text-gray-500 mb-3 flex items-center gap-2">
                                                        <i className="ti ti-x text-red-600"></i> Kolom Ditemukan
                                                    </p>
                                                    <div className="flex flex-wrap gap-2">
                                                        {headerError.got?.map((item, idx) => (
                                                            <span key={idx} className={`px-2.5 py-1.5 border rounded-[4px] text-[11px] font-semibold shadow-sm ${!headerError.expected?.includes(item) ? 'bg-red-50 border-red-200 text-[#D82F5A]' : 'bg-white border-[#EDEDED] text-gray-400'}`}>
                                                                {item}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Footer Pop Up */}
                                <div className="px-6 py-4 border-t border-gray-100 bg-white flex justify-end">
                                    <button
                                        onClick={() => { setShowRowDetail(false); setShowHeaderDetail(false); }}
                                        className="px-6 py-2 bg-[#111827] hover:bg-black text-white text-[11px] font-bold rounded-[4px] transition-all shadow-md active:scale-95 uppercase tracking-wide"
                                    >
                                        Tutup Detail
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* TABLE PREVIEW */}
                    <h3 className="text-base font-medium mb-5">Panduan Pemetaan</h3>
                    <div className="bg-white border border-gray-100 rounded-[4px] overflow-hidden shadow-sm">
                        <table className="w-full text-left">
                            <thead className="bg-[#D82F5A] text-white text-xs text-center">
                                <tr>
                                    <th className="p-5">Nama Kolom</th>
                                    <th className="p-5">Tipe Data</th>
                                    <th className="p-5 text-center">Data Unik</th>
                                    <th className="p-5">Data Sample</th>
                                    <th className="p-5 text-center">Status</th>
                                </tr>
                            </thead>
                            {/* GANTI BAGIAN TBODY DI KODE SEBELUMNYA DENGAN INI */}
                            <tbody className="text-[12px] text-gray-600 text-center">
                                {columnSummary?.length > 0 ? (
                                    columnSummary.map((row, i) => (
                                        <tr
                                            key={i}
                                            className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors"
                                        >

                                            {/* Nama Kolom */}
                                            <td className="p-5 font-semibold text-gray-800">
                                                {row.column}
                                            </td>

                                            {/* Tipe Data */}
                                            <td className="p-5">
                                                <div className="relative inline-block">
                                                    <select
                                                        className="appearance-none bg-gray-50 border border-gray-100 rounded-[4px] px-3 py-1.5 pr-8 outline-none focus:border-[#D82F5A]"
                                                        defaultValue={row.type}
                                                    >
                                                        <option value="string">String</option>
                                                        <option value="number">Number</option>
                                                        <option value="boolean">Boolean</option>
                                                    </select>

                                                    <i className="ti ti-chevron-down absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-gray-400"></i>
                                                </div>
                                            </td>


                                            {/* Unique Count */}
                                            <td className="p-5 text-center font-semibold">
                                                {row.uniqueCount}
                                            </td>

                                            {/* Sample */}
                                            <td className="p-5 text-gray-400 font-mono tracking-tighter">
                                                {row.sample || "-"}
                                            </td>



                                            {/* Status */}
                                            <td className="p-5 text-gray-400 font-mono tracking-tighter">
                                                {row.status || "-"}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td
                                            colSpan="8"
                                            className="p-10 text-center text-gray-400"
                                        >
                                            Tidak ada data validasi
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* ACTION BUTTONS */}
                    <div className="mt-12 flex justify-between">
                        <div className="w-full flex items-center justify-between gap-4 mt-6">
                            {/* TOMBOL KEMBALI (Ukurannya disamakan) */}
                            <button
                                onClick={() => navigate('/uploadData')}
                                className="flex items-center gap-2 px-5 py-3 border border-[#D82F5A] text-[#D82F5A] rounded-[4px] text-xs font-medium hover:bg-pink-50/50 transition-all duration-300 active:scale-95 shrink-0"
                            >
                                <i className="ti ti-arrow-left text-sm"></i>
                                <span>Kembali</span>
                            </button>

                            {/* TOMBOL PROSES DATA (Ukurannya disamakan) */}
                            <button
                                disabled={disableButton || isLoading}
                                onClick={handleUploadpy}
                                className={`flex items-center gap-2 px-5 py-3 rounded-[4px] text-xs font-medium transition-all duration-300 active:scale-95 group shrink-0 ${disableButton || isLoading
                                        ? "bg-gray-100 text-gray-300 cursor-not-allowed"
                                        : "bg-[#111827] text-white hover:bg-black shadow-md"
                                    }`}
                            >
                                <span>Proses Data</span>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <path d="M9 6l6 6l-6 6" />
                                </svg>
                            </button>

                            {/* POP-UP OVERLAY LOADING SCREEN (Muncul saat isLoading === true) */}
                            {isLoading && (
                                <div className="fixed inset-0 bg-slate-900/40 z-[9999] flex items-center justify-center animate-in fade-in duration-300">
                                    <div className="bg-white p-6 rounded-[4px] shadow-xl flex flex-col items-center gap-3 max-w-xs w-full text-center border-0 scale-100 animate-in zoom-in-95 duration-300">
                                        <Loader2 size={32} className="animate-spin text-[#D82F5A]" />
                                        <div>
                                            <p className="text-sm font-bold text-slate-800">Memproses analisis</p>
                                            <p className="text-xs text-slate-400 mt-0.5">Mengklasifikasikan data sentimen ulasan...</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* 2. MODAL LOADING (HANYA SATU KALI SAJA) */}
                        <AnimatePresence>
                            {isLoadingProcess && (
                                <div className="fixed inset-0 z-[150] flex items-center justify-center p-6">
                                    {/* Backdrop */}
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="absolute inset-0 bg-white/40 backdrop-blur-[4px]"
                                    />

                                    {/* Modal Card */}
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.99, y: 10 }}
                                        animate={{ opacity: 1, scale: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.99, y: 10 }}
                                        className="bg-white w-full max-w-[380px] rounded-[4px] border border-[#ededed] shadow-[0_10px_40px_rgba(0,0,0,0.02)] relative z-10 overflow-hidden"
                                    >
                                        {/* TOMBOL X (CLOSE) - Di Pojok Kanan Atas */}
                                        <button
                                            onClick={() => {
                                                setIsLoadingProcess(false);
                                                setLoadingProgress(0);
                                                // Jangan lupa kalau ada variable interval di luar, di clear di sini
                                            }}
                                            className="absolute top-4 right-4 text-gray-300 hover:text-[#D82F5A] transition-colors p-1"
                                        >
                                            <i className="ti ti-x text-xl"></i>
                                        </button>

                                        <div className="p-12">
                                            {/* Header Section */}
                                            <div className="flex justify-between items-end mb-8">
                                                <div className="space-y-1">
                                                    <h3 className="text-base font-semibold text-gray-900">
                                                        Analisis Data
                                                    </h3>
                                                    <p className="text-xs text-gray-400 font-medium ">
                                                        {loadingProgress === 100 ? "Validasi Selesai" : "Sedang Berjalan"}
                                                    </p>
                                                </div>

                                                <span className="text-xl font-bold text-[#D82F5A] leading-none tabular-nums tracking-tighter">
                                                    {Math.round(loadingProgress)}%
                                                </span>
                                            </div>

                                            {/* Progress Bar */}
                                            <div className="relative w-full h-[4px] bg-gray-50 rounded-full overflow-hidden">
                                                <motion.div
                                                    className="absolute top-0 left-0 h-full bg-[#D82F5A]"
                                                    style={{ width: `${loadingProgress}%` }}
                                                    transition={{ ease: "easeInOut" }}
                                                />
                                            </div>

                                            {/* Footer Info */}
                                            <div className="mt-8 flex items-center gap-3">
                                                <div className="flex gap-1">
                                                    <motion.div
                                                        animate={{ opacity: [0.3, 1, 0.3] }}
                                                        transition={{ repeat: Infinity, duration: 1.5 }}
                                                        className="w-1.5 h-1.5 rounded-full bg-[#D82F5A]"
                                                    />
                                                    <motion.div
                                                        animate={{ opacity: [0.3, 1, 0.3] }}
                                                        transition={{ repeat: Infinity, duration: 1.5, delay: 0.2 }}
                                                        className="w-1.5 h-1.5 rounded-full bg-[#D82F5A]"
                                                    />
                                                </div>
                                                <span className="text-xs text-gray-400 font-medium">
                                                    Processing files...
                                                </span>
                                            </div>
                                        </div>
                                    </motion.div>
                                </div>
                            )}
                        </AnimatePresence>
                    </div>
                </main>

                {/* FOOTER */}
                <footer className="bg-white border-t border-gray-100 pt-16 px-10">
                    <div className="max-w-[1200px] mx-auto grid md:grid-cols-4 gap-12 border-b border-gray-100 pb-20">

                        {/* BRAND SECTION & SOCIALS */}
                        <div className="space-y-8 text-left">
                            <div className="space-y-6">
                                <h3 className="text-xl tracking-tight font-semibold ">
                                    ChurnGuard <span className="text-[#D82F5A]">CRM</span>
                                </h3>
                                <p className="text-[#616161] text-sm leading-relaxed">
                                    solusi cerdas menjaga loyalitas pelanggan anda. jangan biarkan mereka pergi tanpa perjuangan.
                                </p>
                            </div>

                            {/* Social Media Icons */}
                            <div className="flex gap-4">
                                {['brand-instagram', 'brand-x', 'brand-youtube'].map(s => (
                                    <div key={s} className="w-10 h-10 border border-[#D82F5A]/20 rounded-[4px] flex items-center justify-center text-[#D82F5A] hover:bg-[#D82F5A] hover:text-white hover:-translate-y-1 transition-all duration-300 cursor-pointer shadow-sm">
                                        <i className={`ti ti-${s} text-lg`}></i>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* ADDRESS */}
                        <div>
                            <h4 className="text-sm font-medium mb-6 flex items-center gap-2 text-[#111827]">
                                <i className="ti ti-map-pin text-[#D82F5A]"></i> Alamat
                            </h4>
                            <p className="text-[#616161] text-[13px] leading-relaxed">
                                Universitas indonesia, gedung perpustakaan, politeknik negeri jakarta, beji, depok.
                            </p>
                        </div>

                        {/* PHONE */}
                        <div>
                            <h4 className="text-sm font-medium mb-6 flex items-center gap-2 text-[#111827]">
                                <i className="ti ti-phone text-[#D82F5A]"></i> Kontak
                            </h4>
                            <p className="text-[#616161] text-[13px] leading-relaxed">
                                021-7270036 ext 303
                            </p>
                        </div>

                        {/* EMAIL */}
                        <div>
                            <h4 className="text-sm font-medium mb-6 flex items-center gap-2 text-[#111827]">
                                <i className="ti ti-mail text-[#D82F5A]"></i> Email
                            </h4>
                            <p className="text-[#616161] text-[13px] underline underline-offset-8 decoration-[#D82F5A]/30 hover:text-[#D82F5A] transition-colors cursor-pointer">
                                perpustakaan@pnj.ac.id
                            </p>
                        </div>

                    </div>

                    {/* COPYRIGHT SECTION - BACKGROUND BLACK */}
                    <div className="bg-[#111827] py-4 -mx-10">
                        <p className="text-center text-white text-xs opacity-80">
                            © 2026 CHURNGUARD CRM. Hak Cipta Dilindungi Undang-Undang.
                        </p>
                    </div>
                </footer>
            </div>
        </div>
    );
};

export default ValidasiProses;