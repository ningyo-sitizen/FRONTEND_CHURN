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
            <div className="flex-1 flex flex-col min-w-0">
                {/* HEADER */}
                <Header formData={user} profileImg={user?.profileImg} />

                {/* CONTENT AREA */}
                <main className="p-4 sm:p-6 md:p-10 flex-1 w-full max-w-7xl mx-auto">
                    <div className="mb-6 md:mb-8">
                        <h1 className="text-xl md:text-2xl font-semibold text-gray-800">Dashboard</h1>
                    </div>

                    {/* STEPPER RESPONSIVE HORIZONTAL (TANPA SCROLL - BERDASARKAN image_313806.png) */}
                    <div className="w-full mb-10 md:mb-[85px] max-w-4xl mx-auto px-1 sm:px-4">
                        <div className="relative flex items-center justify-between w-full">
                            {/* Garis Progress Background */}
                            <div className="absolute top-4 sm:top-1/2 left-0 w-full h-[1px] bg-gray-200 -translate-y-1/2 z-0"></div>

                            {/* Garis Progress Aktif: Pink (Sampai Step 2) */}
                            <div className="absolute top-4 sm:top-1/2 left-0 w-1/2 h-[1px] bg-[#D82F5A] -translate-y-1/2 z-0"></div>

                            {/* Step 01 */}
                            <div className="relative z-10 flex flex-col items-center bg-[#F9FAFB] px-1 sm:px-3 max-w-[30%] text-center">
                                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#D82F5A] text-white flex items-center justify-center text-xs sm:text-sm font-bold shadow-lg shadow-pink-100 shrink-0">
                                    <i className="ti ti-check"></i>
                                </div>
                                <span className="mt-2 sm:absolute sm:-bottom-7 sm:mt-0 whitespace-normal sm:whitespace-nowrap text-[10px] sm:text-xs font-medium text-[#111827] transition-all">
                                    Upload File
                                </span>
                            </div>

                            {/* Step 02 */}
                            <div className="relative z-10 flex flex-col items-center bg-[#F9FAFB] px-1 sm:px-3 max-w-[35%] text-center">
                                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border-2 border-[#D82F5A] bg-white flex items-center justify-center shadow-[0_0_10px_rgba(216,47,90,0.2)] shrink-0">
                                    <span className="text-[#D82F5A] text-xs font-bold">02</span>
                                </div>
                                <span className="mt-2 sm:absolute sm:-bottom-7 sm:mt-0 whitespace-normal sm:whitespace-nowrap text-[10px] sm:text-xs font-semibold text-[#111827] transition-all">
                                    Validasi & Proses
                                </span>
                            </div>

                            {/* Step 03 */}
                            <div className="relative z-10 flex flex-col items-center bg-[#F9FAFB] px-1 sm:px-3 max-w-[35%] text-center">
                                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border-2 border-gray-100 bg-white flex items-center justify-center shrink-0">
                                    <span className="text-gray-300 text-xs font-medium">03</span>
                                </div>
                                <span className="mt-2 sm:absolute sm:-bottom-7 sm:mt-0 whitespace-normal sm:whitespace-nowrap text-[10px] sm:text-xs font-medium text-gray-400 transition-all">
                                    Proses & Hasil
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* WARNING ALERT */}
                    <div className="bg-white border border-[#EDEDED] p-3 rounded-[4px] flex items-start sm:items-center gap-3 mb-6 md:mb-8 shadow-sm">
                        <i className="ti ti-alert-triangle text-amber-400 text-xl mt-0.5 sm:mt-0"></i>
                        <p className="text-[#929191] text-xs md:text-sm">
                            Total <span className="font-bold text-[#111827]"> {totalError} </span> masalah ditemukan pada data Anda
                        </p>
                    </div>

                    {/* ERROR SUMMARY TITLE */}
                    <h3 className="text-xs md:text-sm font-semibold mb-4 text-[#111827]">
                        Ringkasan Validasi
                    </h3>

                    {/* HORIZONTAL COMPACT CARDS */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 md:mb-10">
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
                                count: `${totalError} error`,
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
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${err.iconBg}`}>
                                    <i className={`ti ${err.icon} ${err.iconColor} text-xl`}></i>
                                </div>

                                <div className="flex-1 pr-6">
                                    <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5 mb-1">
                                        <h4 className="text-xs md:text-sm font-semibold text-[#111827] leading-none">{err.title}</h4>
                                        <span className={`text-[10px] md:text-[11px] font-bold ${err.isRows ? 'text-blue-500' : 'text-[#D82F5A]'}`}>
                                            {err.count}
                                        </span>
                                    </div>
                                    <p className="text-[10px] md:text-[11px] text-[#929191] leading-tight">
                                        {err.desc}
                                    </p>
                                </div>

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

                    {/* POP UP DETAIL SYSTEM */}
                    {(showRowDetail || showHeaderDetail) && (
                        <div className="fixed inset-0 z-[99] flex items-center justify-center p-4 bg-[#111827]/40 backdrop-blur-md transition-all">
                            <div className="bg-white rounded-[4px] shadow-2xl w-full max-w-lg flex flex-col max-h-[85vh] overflow-hidden border border-white/20">

                                <div className="px-4 py-3 sm:px-6 sm:py-4 border-b border-gray-100 flex items-center justify-between bg-white">
                                    <div>
                                        <h3 className="font-semibold text-[#111827] text-xs sm:text-sm">
                                            {showRowDetail ? 'Detail Temuan Data' : 'Validasi Struktur Header'}
                                        </h3>
                                        <p className="text-[9px] sm:text-[10px] text-[#929191]">Tinjau kembali data sebelum melakukan impor</p>
                                    </div>
                                    <button
                                        onClick={() => { setShowRowDetail(false); setShowHeaderDetail(false); }}
                                        className="w-8 h-8 flex items-center justify-center rounded-[4px] hover:bg-gray-100 text-gray-400 transition-colors"
                                    >
                                        <i className="ti ti-x text-lg"></i>
                                    </button>
                                </div>

                                <div className="p-4 sm:p-6 overflow-y-auto bg-[#FAFBFC] flex-1">
                                    {showRowDetail && (
                                        <div className="space-y-3">
                                            {missingData?.map((item, idx) => (
                                                <div key={idx} className="bg-white border border-[#EDEDED] p-3 sm:p-4 rounded-[4px] shadow-sm flex flex-col gap-2">
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex flex-wrap gap-1.5">
                                                            <span className="px-2 py-0.5 bg-[#FEF2F2] text-[#D82F5A] rounded-[4px] text-[9px] sm:text-[10px] font-bold border border-red-100 uppercase">Baris {item.row}</span>
                                                            <span className="px-2 py-0.5 bg-[#F0F7FF] text-[#0061FF] rounded-[4px] text-[9px] sm:text-[10px] font-bold border border-blue-100 uppercase">{item.column}</span>
                                                        </div>
                                                        <i className="ti ti-alert-circle text-[#D82F5A] text-sm"></i>
                                                    </div>
                                                    <p className="text-[11px] sm:text-xs font-medium text-[#4B5563] leading-relaxed">
                                                        {item.message}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {showHeaderDetail && headerError && (
                                        <div className="space-y-5">
                                            <div className="bg-white border-l-4 border-red-500 shadow-sm p-3 sm:p-4 rounded-[4px]">
                                                <p className="text-[9px] sm:text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Tipe Masalah</p>
                                                <p className="text-xs sm:text-sm font-semibold text-[#111827]">{headerError.type}</p>
                                            </div>

                                            <div className="space-y-4">
                                                <div>
                                                    <p className="text-[10px] sm:text-[11px] font-bold text-gray-500 mb-2 flex items-center gap-2">
                                                        <i className="ti ti-check text-green-600"></i> Format Kolom Standar
                                                    </p>
                                                    <div className="flex flex-wrap gap-1.5">
                                                        {headerError.expected?.map((item, idx) => (
                                                            <span key={idx} className="px-2 py-1 bg-white border border-[#EDEDED] rounded-[4px] text-[10px] sm:text-[11px] font-semibold text-gray-600 shadow-sm">
                                                                {item}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>

                                                <div className="pt-4 border-t border-gray-200">
                                                    <p className="text-[10px] sm:text-[11px] font-bold text-gray-500 mb-2 flex items-center gap-2">
                                                        <i className="ti ti-x text-red-600"></i> Kolom Ditemukan
                                                    </p>
                                                    <div className="flex flex-wrap gap-1.5">
                                                        {headerError.got?.map((item, idx) => (
                                                            <span key={idx} className={`px-2 py-1 border rounded-[4px] text-[10px] sm:text-[11px] font-semibold shadow-sm ${!headerError.expected?.includes(item) ? 'bg-red-50 border-red-200 text-[#D82F5A]' : 'bg-white border-[#EDEDED] text-gray-400'}`}>
                                                                {item}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="px-4 py-3 sm:px-6 sm:py-4 border-t border-gray-100 bg-white flex justify-end">
                                    <button
                                        onClick={() => { setShowRowDetail(false); setShowHeaderDetail(false); }}
                                        className="px-4 py-2 bg-[#111827] hover:bg-black text-white text-[10px] sm:text-[11px] font-bold rounded-[4px] uppercase tracking-wide"
                                    >
                                        Tutup Detail
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* TABLE PREVIEW */}
                    <h3 className="text-sm md:text-base font-medium mb-4">Panduan Pemetaan</h3>
                    <div className="bg-white border border-gray-100 rounded-[4px] overflow-hidden shadow-sm w-full">
                        <div className="overflow-x-auto w-full">
                            <table className="w-full text-left min-w-[700px]">
                                <thead className="bg-[#D82F5A] text-white text-xs">
                                    <tr>
                                        <th className="p-4 text-center">Nama Kolom</th>
                                        <th className="p-4 text-center">Tipe Data</th>
                                        <th className="p-4 text-center">Data Unik</th>
                                        <th className="p-4 text-center">Data Sample</th>
                                        <th className="p-4 text-center">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="text-[11px] md:text-[12px] text-gray-600">
                                    {columnSummary?.length > 0 ? (
                                        columnSummary.map((row, i) => (
                                            <tr key={i} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors text-center">
                                                <td className="p-4 font-semibold text-gray-800">{row.column}</td>
                                                <td className="p-4">
                                                    <div className="relative inline-block text-left">
                                                        <select
                                                            className="appearance-none bg-gray-50 border border-gray-100 rounded-[4px] px-3 py-1.5 pr-8 outline-none focus:border-[#D82F5A] text-[11px]"
                                                            defaultValue={row.type}
                                                        >
                                                            <option value="string">String</option>
                                                            <option value="number">Number</option>
                                                            <option value="boolean">Boolean</option>
                                                        </select>
                                                        <i className="ti ti-chevron-down absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-gray-400 pointer-events-none"></i>
                                                    </div>
                                                </td>
                                                <td className="p-4 font-semibold">{row.uniqueCount}</td>
                                                <td className="p-4 text-gray-400 font-mono tracking-tighter">{row.sample || "-"}</td>
                                                <td className="p-4 text-gray-400 font-mono tracking-tighter">{row.status || "-"}</td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="5" className="p-10 text-center text-gray-400">Tidak ada data validasi</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* ACTION BUTTONS */}
                    <div className="mt-8 md:mt-12 w-full flex items-center justify-between gap-4">
                        <button
                            onClick={() => navigate('/uploadData')}
                            className="flex items-center gap-2 px-4 py-2.5 md:px-5 md:py-3 border border-[#D82F5A] text-[#D82F5A] rounded-[4px] text-xs font-medium hover:bg-pink-50/50 transition-all shrink-0"
                        >
                            <i className="ti ti-arrow-left text-sm"></i>
                            <span>Kembali</span>
                        </button>

                        <button
                            disabled={disableButton || isLoading}
                            onClick={handleUploadpy}
                            className={`flex items-center gap-2 px-4 py-2.5 md:px-5 md:py-3 rounded-[4px] text-xs font-medium transition-all group shrink-0 ${disableButton || isLoading
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
                    </div>
                </main>

                {/* FOOTER */}
                <Footer />
            </div>
        </div>
    );
};

export default ValidasiProses;