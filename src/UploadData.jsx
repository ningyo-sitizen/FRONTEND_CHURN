import React, { useState, useRef } from 'react';
import logochurn from './assets/logo churn.png';
import unggahdata from './assets/unggahdata.png';
import { IconBrandMyOppo } from '@tabler/icons-react';
import Sidebar from './SideBar.jsx';
import { IconUserCircle } from '@tabler/icons-react';
import { IconLogout2 } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from "../utils/auth";
import Header from './Header';
import Footer from './Footer';
import { useNotif } from "./NotificationContext"
import LoadingOverlay from './LoadingOverlay';


const UploadDataFull = () => {
    const [isLoading, setisLoading] = useState(false);
    const [isLoadingProcess, setIsLoadingProcess] = useState(false);
    const [loadingProgress, setLoadingProgress] = useState(0);
    const { showNotif } = useNotif();
    const [isOpen, setIsOpen] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [uploadMethod, setUploadMethod] = useState('update');
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef(null);
    const navigate = useNavigate();
    const [csvData, setCsvData] = useState([]);
    const [csvHeaders, setCsvHeaders] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const handleBrowseClick = () => fileInputRef.current.click();

    const user = useAuth()

    const parseCsvContent = (file) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const text = e.target.result;
            const lines = text.split(/\r?\n/).filter(line => line.trim() !== "");

            console.log(text)

            if (lines.length > 0) {
                const delimiter = lines[0].includes(";") ? ";" : ",";

                const headers = lines[0].split(delimiter).map(h => h.replace(/['"]+/g, '').trim());
                const rows = lines.slice(1).map(line => {
                    return line.split(delimiter).map(cell => cell.replace(/['"]+/g, '').trim());
                });

                setCsvHeaders(headers);
                setCsvData(rows);
            }
        };
        reader.readAsText(file);
    };

    const processFile = (file) => {
        console.log(file)
        parseCsvContent(file)
        if (file && (file.type === "text/csv" || file.name.endsWith('.csv'))) {
            setSelectedFile({
                name: file.name,
                size: (file.size / 1024).toFixed(1) + " kb",
                raw: file
            });
        } else {
            alert("mohon unggah file format .csv");
        }
    };
    const handleUpload = async () => {
        const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

        setisLoading(true)

        await delay(2000);

        if (!selectedFile) {
            return alert("Pilih file dulu");
        }

        try {
            const formData = new FormData();

            formData.append("file", selectedFile.raw);

            const token = localStorage.getItem("token");

            const res = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/csv/upload-csv`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "multipart/form-data"
                    }
                }
            );

            setisLoading(false)

            navigate("/validasiProses", {
                state: {
                    file: selectedFile,
                    validation: res.data
                }
            });

        } catch (err) {

            showNotif(
                "error",
                err.response?.data?.message || "Upload gagal"
            );
            setisLoading(false)

        }

    };
    const handleFileChange = (e) => processFile(e.target.files[0]);

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        processFile(e.dataTransfer.files[0]);
    };


    return (
        <div className="flex min-h-screen bg-[#F9FAFB] text-[#111827]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>

            {/* --- SIDEBAR --- */}
            <Sidebar />
            {/* --- MAIN SECTION --- */}
            <main className="flex-1 overflow-x-hidden">

                {/* TOPBAR */}
                <Header formData={user} profileImg={user?.avatar} />

                <div className="p-8 w-full">
                    <div className="mb-8">
                        {/* --- BREADCRUMB --- */}
                        <div className="mb-10">
                            <h1 className="text-xl font-semibold text-[#111827]">Dashboard</h1>
                            <div className="flex items-center gap-2 mt-1 transition-all">
                                {/* Link Dashboard - Bisa di klik */}
                                <span
                                    onClick={() => navigate('/dashboardUser')}
                                    className="text-xs text-gray-400  cursor-pointer hover:text-[#D82F5A] transition-colors"
                                >
                                    Dashboard
                                </span>

                                {/* Icon Next / Chevron */}
                                <i className="ti ti-chevron-right text-sm text-gray-300"></i>

                                {/* Current Page */}
                                <span className="text-xs text-[#D82F5A] ">
                                    Unggah Data
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Stepper */}
                    {/* --- STEPPER SECTION --- */}
                    <div className="flex flex-col items-center mb-[85px] w-full max-w-4xl mx-auto">
                        <div className="relative flex items-center justify-between w-full">

                            {/* Background Line (Garis Abu-abu di Belakang) */}
                            <div className="absolute top-1/2 left-0 w-full h-[2px] bg-gray-200 -translate-y-1/2 z-0"></div>

                            {/* Step 01 */}
                            <div className="relative z-10 flex flex-col items-center bg-[#FDFDFD] px-4">
                                <div className="w-8 h-8 rounded-full border-2 border-[#D82F5A] bg-white flex items-center justify-center shadow-[0_0_10px_rgba(216,47,90,0.2)]">
                                    <span className="text-[#D82F5A] text-xs font-medium">01</span>
                                </div>
                                <span className="absolute -bottom-8 whitespace-nowrap text-xs font-medium text-[#111827]">Upload File</span>
                            </div>

                            {/* Step 02 */}
                            <div className="relative z-10 flex flex-col items-center bg-[#FDFDFD] px-4">
                                <div className="w-8 h-8 rounded-full border-2 border-gray-100 bg-white flex items-center justify-center">
                                    <span className="text-gray-300 text-xs font-medium">02</span>
                                </div>
                                <span className="absolute -bottom-8 whitespace-nowrap text-xs font-medium text-gray-400">Validasi & Proses</span>
                            </div>

                            {/* Step 03 */}
                            <div className="relative z-10 flex flex-col items-center bg-[#FDFDFD] px-4">
                                <div className="w-8 h-8 rounded-full border-2 border-gray-100 bg-white flex items-center justify-center">
                                    <span className="text-gray-300 text-xs font-medium">03</span>
                                </div>
                                <span className="absolute -bottom-8 whitespace-nowrap text-xs font-medium text-gray-400">Proses & Hasil</span>
                            </div>

                        </div>

                    </div>

                    {/* USER GUIDE SECTION */}
                    <div className="mb-5 w-full">
                        <div className="bg-white border border-[#EDEDED] p-5 rounded-[4px] shadow-[0_2px_8px_rgba(0,0,0,0.01)] space-y-4">

                            {/* Bagian Utama (Info & Tombol) */}
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
                                <div className="flex items-start gap-3.5">
                                    <div className="p-2.5 bg-rose-50 text-[#D82F5A] rounded-[4px] shrink-0 flex items-center justify-center">
                                        <i className="ti ti-info-circle text-lg leading-none"></i>
                                    </div>

                                    <div className="space-y-1.5">
                                        <h4 className="text-xs font-semibold text-slate-900">
                                            Panduan Format File Data & Deskripsi Kolom
                                        </h4>
                                        <p className="text-[11px] text-slate-400 leading-relaxed max-w-2xl">
                                            Pastikan file berformat <span className="font-semibold text-slate-600 bg-slate-50 px-1 py-0.5 rounded-[4px] border border-slate-100">.csv (Comma Separated)</span>. Di bawah ini adalah 4 kolom wajib yang harus ada di dalam file Anda:
                                        </p>
                                    </div>
                                </div>

                                {/* Tombol Unduh */}
                                <div className="shrink-0 self-start md:self-center">
                                    <a
                                        href="/data_descriptions.csv"
                                        download="data_descriptions.csv"
                                        className="inline-flex items-center gap-2 bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700 text-[11px] font-semibold px-3 py-2 rounded-[4px] shadow-sm transition-all no-underline"
                                    >
                                        <i className="ti ti-download text-xs text-[#D82F5A]"></i>
                                        Unduh Template .CSV
                                    </a>
                                </div>
                            </div>

                            {/* Detail Tiap Kolom Tanpa Garis Pembatas & Naik Sedikit */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1.5 mt-1.5">

                                {/* Kolom 1 */}
                                <div className="bg-slate-50/60 p-3 border border-slate-100 rounded-[4px] space-y-1">
                                    <span className="font-mono bg-white border border-slate-200 px-1.5 py-0.5 rounded-[4px] text-[10px] text-slate-700 font-semibold inline-block">
                                        Column_name
                                    </span>
                                    <p className="text-[11px] text-slate-500 leading-relaxed">
                                        Nama teknis kolom data Anda di database. <span className="text-slate-400 italic">(Contoh: customer_id, tenure)</span>.
                                    </p>
                                </div>

                                {/* Kolom 2 */}
                                <div className="bg-slate-50/60 p-3 border border-slate-100 rounded-[4px] space-y-1">
                                    <span className="font-mono bg-white border border-slate-200 px-1.5 py-0.5 rounded-[4px] text-[10px] text-slate-700 font-semibold inline-block">
                                        Column_type
                                    </span>
                                    <p className="text-[11px] text-slate-500 leading-relaxed">
                                        Kategori peran kolom. Diisi antara: <span className="text-slate-600 font-medium">Dimension</span> (kategori) atau <span className="text-slate-600 font-medium">Metric</span> (angka).
                                    </p>
                                </div>

                                {/* Kolom 3 */}
                                <div className="bg-slate-50/60 p-3 border border-slate-100 rounded-[4px] space-y-1">
                                    <span className="font-mono bg-white border border-slate-200 px-1.5 py-0.5 rounded-[4px] text-[10px] text-slate-700 font-semibold inline-block">
                                        Data_type
                                    </span>
                                    <p className="text-[11px] text-slate-500 leading-relaxed">
                                        Tipe format data. Biasa diisi dengan: <span className="text-slate-600 font-medium">string, integer, float, boolean,</span> atau <span className="text-slate-600 font-medium">date</span>.
                                    </p>
                                </div>

                                {/* Kolom 4 */}
                                <div className="bg-slate-50/60 p-3 border border-slate-100 rounded-[4px] space-y-1">
                                    <span className="font-mono bg-white border border-slate-200 px-1.5 py-0.5 rounded-[4px] text-[10px] text-slate-700 font-semibold inline-block">
                                        Description
                                    </span>
                                    <p className="text-[11px] text-slate-500 leading-relaxed">
                                        Penjelasan singkat mengenai arti kolom tersebut agar AI tidak salah membaca konteks data Anda.
                                    </p>
                                </div>

                            </div>

                        </div>
                    </div>
                    <div className="grid grid-cols-12 gap-10 mt-8">
                        {/* Area Upload */}
                        <div className="col-span-12 xl:col-span-7">
                            <h3 className="text-sm font-medium mb-4 text-black">Unggah file</h3>

                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                accept=".csv"
                                className="hidden"
                            />

                            <div
                                onDragOver={(e) => {
                                    e.preventDefault();
                                    setIsDragging(true);
                                }}
                                onDragLeave={() => setIsDragging(false)}
                                onDrop={handleDrop}
                                className={`border-2 border-dashed bg-white rounded-[4px] p-16 flex flex-col items-center justify-center transition-all ${isDragging
                                        ? "border-[#D82F5A] bg-red-50/20"
                                        : "border-[#D82F5A] bg-white hover:border-red-100"
                                    }`}
                            >
                                <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="48"
                                        height="48"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="#D82F5A"
                                        strokeWidth="1.5"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="transition-all duration-300 group-hover:scale-110"
                                    >
                                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                        <path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2 -2v-2" />
                                        <path d="M7 9l5 -5l5 5" />
                                        <path d="M12 4l0 12" />
                                    </svg>
                                </div>

                                <p className="text-base font-semibold">
                                    Pilih file atau seret dan lepaskan ke sini.
                                </p>

                                <p className="text-xs text-gray-400 mt-1">
                                    format .csv (maksimal 10 mb)
                                </p>

                                <button
                                    onClick={handleBrowseClick}
                                    className="mt-6 px-6 py-2 border border-[#D9D9D9] rounded-[4px] text-xs hover:bg-gray-50"
                                >
                                    Telusuri file
                                </button>
                            </div>
                        </div>

                        {/* Pratinjau Data */}
                        <div className="col-span-12 xl:col-span-5">
                            <h3 className="text-sm font-medium mb-4 text-black">
                                Pratinjau data
                            </h3>

                            {selectedFile ? (
                                <div className="bg-white border border-[#EDEDED] p-4 rounded-[4px] overflow-hidden shadow-sm animate-in fade-in zoom-in-95 duration-300">
                                    <div className="h-36 bg-gray-50 flex items-center justify-center">
                                        <i className="ti ti-file-spreadsheet text-[#1D6F42] text-5xl"></i>
                                    </div>

                                    <div className="p-5">
                                        <h4 className="text-sm font-medium truncate">
                                            {selectedFile.name}
                                        </h4>

                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="text-[12px] text-gray-400">
                                                {selectedFile.size} dari {selectedFile.size}
                                            </span>

                                            <span className="text-gray-300 text-[10px]">●</span>

                                            <div className="flex items-center gap-1.5">
                                                <div className="w-4 h-4 bg-[#4ADE80] rounded-full flex items-center justify-center">
                                                    <i className="ti ti-check text-white text-xs"></i>
                                                </div>

                                                <span className="text-xs text-gray-500">
                                                    Selesai
                                                </span>
                                            </div>
                                        </div>

                                        <div className="flex gap-2 mt-4">
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setShowModal(true);
                                                }}
                                                className="flex-1 py-2 bg-[#111827] text-white text-[11px] md:text-xs rounded-[4px] hover:bg-gray-800 transition-colors cursor-pointer"
                                            >
                                                Rincian
                                            </button>

                                            <button
                                                onClick={() => setSelectedFile(null)}
                                                className="flex-1 py-2 border border-[#D82F5A] text-[#D82F5A] text-xs rounded-[4px]"
                                            >
                                                Hapus
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="h-[305px] bg-white border border-[#EDEDED] border-dashed rounded-[4px] flex flex-col items-center justify-center text-center p-8 transition-all hover:border-red-200 group">

                                    <div className="w-15 h-15 bg-white rounded-full flex items-center justify-center mb-6 shadow-sm border border-red-50 group-hover:scale-110 transition-transform duration-300">
                                        <i className="ti ti-file-search text-[#D82F5A] text-2xl"></i>
                                    </div>

                                    <h4 className="text-sm font-medium text-[#111827] mb-2 tracking-tight">
                                        Pratinjau data belum tersedia
                                    </h4>

                                    <p className="text-xs text-gray-500 max-w-[300px] leading-relaxed">
                                        unggah file csv anda di area sebelah kiri untuk melihat ringkasan data di sini.
                                    </p>

                                </div>
                            )}
                        </div>

                        {/* Metode & Footer Actions */}
                        <div className="col-span-12 mt-2">
                            {/* SELECTION METHOD SECTION */}

                            <div className="flex flex-row items-end gap-5">
                                {/* Opsi 1 */}



                                {/* Tombol Selanjutnya */}
                                <div className="flex-none ml-auto">
                                    <button
                                        disabled={!selectedFile}
                                        onClick={handleUpload}
                                        className={`flex items-center gap-2 px-5 py-3 rounded-[4px] text-xs font-medium transition-all duration-300 active:scale-95 ${selectedFile
                                            ? 'bg-[#111827] text-white hover:bg-black shadow-md'
                                            : 'bg-gray-100 text-gray-300 cursor-not-allowed'
                                            }`}
                                    >
                                        <span>Mulai Analisis</span>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M9 6l6 6l-6 6" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>                    </div>
                </div >
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
                {/* MODAL POP-UP (Otomatis Full Screen di HP / Pop-up Center di Laptop) */}
                {showModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 sm:p-4 animate-in fade-in duration-200">
                        <div className="bg-white w-full h-full sm:rounded-[4px] sm:shadow-xl sm:w-full sm:max-w-5xl sm:h-auto sm:max-h-[85vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">

                            {/* HEADER MODAL */}
                            <div className="px-4 py-4 md:px-6 md:py-5 border-b border-[#EDEDED] flex items-center justify-between bg-white shrink-0">
                                <div className="min-w-0 flex-1 pr-4">
                                    <h3 className="text-xs md:text-base font-bold text-gray-900 tracking-tight truncate">
                                        Isi File Konten
                                    </h3>
                                    <p className="text-[11px] md:text-xs text-gray-400 mt-0.5 font-normal truncate">
                                        {selectedFile?.name}
                                    </p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="text-gray-400 hover:text-gray-600 text-xs md:text-sm p-2 transition-colors cursor-pointer"
                                >
                                    ✕
                                </button>
                            </div>

                            {/* AREA SCROLL TABEL (Mulus di-swipe pakai jempol) */}
                            <div className="p-3 md:p-6 overflow-auto flex-1 bg-white">
                                {csvData.length > 0 ? (
                                    <div className="border border-[#EDEDED] rounded-[4px] overflow-x-auto w-full">
                                        <table className="w-full text-left text-[10px] md:text-[11px] border-collapse font-sans min-w-full">
                                            <thead className="bg-[#F9FAFB] border-b border-[#EDEDED] sticky top-0 z-10">
                                                <tr>
                                                    {csvHeaders.map((header, idx) => (
                                                        <th key={idx} className="px-3 py-2 md:px-4 md:py-3 text-gray-500 font-semibold uppercase tracking-wider border-r border-[#EDEDED] last:border-0 whitespace-nowrap bg-[#F9FAFB]">
                                                            {header}
                                                        </th>
                                                    ))}
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-[#EDEDED] text-[#52525B] font-normal">
                                                {csvData.map((row, rowIdx) => (
                                                    <tr key={rowIdx} className="hover:bg-gray-50/70 transition-colors">
                                                        {row.map((cell, cellIdx) => (
                                                            <td key={cellIdx} className="px-3 py-2 md:px-4 md:py-2.5 border-r border-[#EDEDED] last:border-0 whitespace-nowrap max-w-xs truncate">
                                                                {cell || "-"}
                                                            </td>
                                                        ))}
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                ) : (
                                    <div className="text-center py-16 text-xs text-gray-400">
                                        Gagal memuat isi dokumen atau file CSV kosong.
                                    </div>
                                )}
                            </div>

                            {/* FOOTER MODAL (Ditambahkan mb-safe untuk layar HP berponi bawah) */}
                            <div className="px-4 py-3 md:px-6 md:py-4 border-t border-[#EDEDED] flex justify-end bg-white shrink-0 mb-safe">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="w-full sm:w-auto px-5 py-2.5 sm:py-2 bg-[#111827] hover:bg-gray-800 text-white text-xs rounded-[4px] font-medium transition-colors cursor-pointer"
                                >
                                    Tutup
                                </button>
                            </div>

                        </div>
                    </div>
                )}
                {/* --- FOOTER --- */}
                <Footer />
                {isLoading && <LoadingOverlay />}
            </main >
        </div >
    );
};

export default UploadDataFull;