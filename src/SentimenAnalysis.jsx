import React, { useState } from 'react';
import {
    Upload,
    Play,
    Calendar,
    AlertCircle,
    Download,
    Smile,
    Meh,
    Frown,
    FileText,
    ChevronUp,
    ChevronDown,
    Loader2,
    BarChart3,
    CloudLightning,
    CheckCircle2,
    Cloud 
} from 'lucide-react';
import Sidebar from './SideBar.jsx';
import Header from './Header.jsx';
import Footer from './Footer';
import { useAuth } from '../utils/auth.js';
import AppSearchDropdown from './AppSearchDropdown.jsx';

const SentimenAnalysis = () => {
    const user = useAuth()
    const [activeTab, setActiveTab] = useState("positif");
    const [searchApp, setSearchApp] = useState("");
    const [selectedAppId, setSelectedAppId] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [startDate, setStartDate] = useState(""); 
    const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
    const [currentPage, setCurrentPage] = useState(1);
    const [popup, setPopup] = useState({ show: false, type: 'success', title: '', message: '' });

    const [loading, setLoading] = useState(false);
    const [totalReviews, setTotalReviews] = useState(0);
    const [analysisResult, setAnalysisResult] = useState(null);

    // State untuk tab utama halaman
    const [activeMainTab, setActiveMainTab] = useState("massal");

    // State untuk analisis teks manual
    const [textInput, setTextInput] = useState("");
    const [textAnalysisLoading, setTextAnalysisLoading] = useState(false);
    const [textAnalysisResult, setTextAnalysisResult] = useState(null);

    // State untuk mengontrol index accordion mana yang sedang terbuka
    const [openAccordionIdx, setOpenAccordionIdx] = useState(null);

    const [sentimentData, setSentimentData] = useState({
        positif: 0,
        netral: 0,
        negatif: 0
    });

    const [topWords, setTopWords] = useState({
        positif: [],
        netral: [],
        negatif: []
    });

    // Analisis dari Google Play Store
    const handleAnalyzePlayStore = async () => {
        if (!searchApp.trim()) {
            alert("⚠️ Masukkan nama aplikasi");
            return;
        }

        setLoading(true);
        try {
            const formData = new FormData();
            formData.append("app_name", searchApp);
            formData.append("limit", 1000);
            formData.append("start_date", startDate);
            formData.append("end_date", endDate);

            if (selectedAppId) {
                formData.append("app_id", selectedAppId);
            }

            const response = await fetch(`${import.meta.env.VITE_SENTIMEN_API}/sentimen/analyze-playstore`, {
                method: "POST",
                body: formData
            });

            const result = await response.json();

            if (result.status === "success") {
                const total = result.total_rows;
                const counts = result.sentiment_counts;

                setSentimentData({
                    positif: counts.positif || 0,
                    netral: counts.netral || 0,
                    negatif: counts.negatif || 0
                });

                setTopWords(result.top_words || {});
                setTotalReviews(total);
                setAnalysisResult(result);
                setOpenAccordionIdx(null);

                setPopup({
                    show: true,
                    type: 'success',
                    title: 'Analisis Berhasil',
                    message: `File ${selectedFile?.name || searchApp} berhasil diproses. Ditemukan ${total.toLocaleString('id-ID')} baris data ulasan.`
                });
            } else {
                setPopup({
                    show: true,
                    type: 'error',
                    title: 'Analisis Gagal',
                    message: result.message || 'Terjadi kesalahan saat memproses data.'
                });
            }
        } catch (err) {
            alert(`❌ Koneksi Error: ${err.message}\n⚠️ Pastikan Python API berjalan di port 8002`);
            console.error("Error:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleDownloadTemplate = () => {
        console.log("Template diunduh");
    };

    // Analisis dari File CSV
    const handleAnalyzeFile = async () => {
        if (!selectedFile) {
            alert("⚠️ Pilih file terlebih dahulu");
            return;
        }

        setLoading(true);
        try {
            const formData = new FormData();
            formData.append("file", selectedFile);

            const response = await fetch(`${import.meta.env.VITE_SENTIMEN_API}/sentimen/analyze-csv`, {
                method: "POST",
                body: formData
            });

            const result = await response.json();

            if (result.status === "success") {
                const total = result.total_rows;
                const counts = result.sentiment_counts;

                setSentimentData({
                    positif: counts.positif || 0,
                    netral: counts.netral || 0,
                    negatif: counts.negatif || 0
                });

                setTopWords(result.top_words || {});
                setTotalReviews(total);
                setAnalysisResult(result);
                setOpenAccordionIdx(null); 
                
                setPopup({
                    show: true,
                    type: 'success',
                    title: 'Analisis Berhasil',
                    message: `File ${selectedFile.name} berhasil diproses. Ditemukan ${total.toLocaleString('id-ID')} baris data ulasan.`
                });
            } else {
                alert(`❌ Error: ${result.message}`);
            }
        } catch (err) {
            alert(`❌ Error: ${err.message}`);
            console.error("Error:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleProcess = () => {
        if (selectedFile) {
            handleAnalyzeFile();
        } else if (searchApp.trim()) {
            handleAnalyzePlayStore();
        } else {
            alert("⚠️ Masukkan nama aplikasi atau pilih file");
        }
    };

    const handleExport = () => {
        if (!analysisResult || !analysisResult.data || analysisResult.data.length === 0) {
            alert("⚠️ Lakukan analisis terlebih dahulu");
            return;
        }

        let csv = "Content,Sentiment\n";
        analysisResult.data.forEach(item => {
            const content = (item.content || '').replace(/"/g, '""').replace(/\n/g, ' ');
            csv += `"${content}",${item.sentiment}\n`;
        });

        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `sentiment-analysis-${new Date().toISOString().split('T')[0]}.csv`;
        link.click();
        URL.revokeObjectURL(url);
        alert("✅ File berhasil diunduh");
    };

    const getPercentage = (sentiment) => {
        if (totalReviews === 0) return "0.0";
        return ((sentimentData[sentiment] / totalReviews) * 100).toFixed(1);
    };

    // Analisis teks manual via FastAPI backend
    const handleAnalyzeText = async () => {
        if (!textInput.trim()) return;
        setTextAnalysisLoading(true);
        setTextAnalysisResult(null);
        try {
            const response = await fetch(`${import.meta.env.VITE_SENTIMEN_API}/sentimen/analyze-text`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ text: textInput.trim() })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();

            if (result.status === "success") {
                setTextAnalysisResult({
                    text: result.text,
                    sentiment: result.sentiment  // "positif" | "netral" | "negatif"
                });
            } else {
                setPopup({
                    show: true,
                    type: "error",
                    title: "Analisis Gagal",
                    message: result.message || "Terjadi kesalahan saat memproses teks."
                });
            }
        } catch (err) {
            console.error("Text analysis error:", err);
            setPopup({
                show: true,
                type: "error",
                title: "Analisis Gagal",
                message: `Koneksi Error: ${err.message}. Pastikan Python API berjalan di port 8002.`
            });
        } finally {
            setTextAnalysisLoading(false);
        }
    };

    const TEXT_SAMPLES = {
        positif: "Aplikasi ini benar-benar luar biasa! Desainnya sangat bersih dan intuitif, performanya cepat, dan fitur-fiturnya sangat lengkap. Saya sangat puas dan akan terus menggunakannya. Highly recommended!",
        netral: "Aplikasi ini cukup standar. Fiturnya ada, tidak ada yang spesial, tapi juga tidak ada yang mengecewakan. Penggunaannya lumayan mudah dipahami.",
        negatif: "Sangat mengecewakan! Aplikasi sering crash dan loading-nya sangat lambat. Banyak fitur tidak berfungsi dengan baik. Support customer service juga tidak responsif."
    };

    return (
        <div className="flex h-screen w-screen bg-[#F9FAFB] font-['Plus_Jakarta_Sans',sans-serif] overflow-hidden">
            <style>{`
        @keyframes slow-pulse {
            0% { transform: scale(1); opacity: 0.8; }
            50% { transform: scale(1.05); opacity: 0.4; }
            100% { transform: scale(1); opacity: 0.8; }
        }
        .animate-slow-pulse {
            animation: slow-pulse 3s infinite ease-in-out;
        }
    `}</style>

            <Sidebar />

            <div className="flex-1 min-w-0 max-w-full flex flex-col h-full overflow-y-auto overflow-x-hidden">

                <div className="relative w-0 min-w-full shrink-0 pr-4">
                    <Header formData={user} profileImg={user?.avatar} />
                </div>

                <main className="p-4 sm:p-6 lg:p-8 w-full max-w-none mx-auto flex-grow min-w-0 flex-shrink space-y-6">

                    {/* Header Judul + Tab Switcher */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 w-full">
                        <div>
                            <h1 className="text-xl font-semibold text-[#111827]">Respon Pelanggan</h1>
                            <p className="text-sm text-gray-500 mt-1">
                                Tidak perlu baca ribuan ulasan di Play Store. Langsung intip apa yang diinginkan penontonmu sekarang!
                            </p>
                        </div>
                        <button
                            onClick={handleExport}
                            disabled={!analysisResult || totalReviews === 0}
                            className="bg-[#111827] hover:bg-[#D82F5A] disabled:opacity-50 disabled:cursor-not-allowed text-white text-[13px] font-medium px-6 py-2.5 rounded-[4px] transition-all flex items-center gap-2 shadow-sm active:scale-95 shrink-0">
                            <Download size={16} />
                            export data
                        </button>
                    </div>

                    {/* Tab Switcher Utama */}
                    <div className="flex items-center gap-1 bg-white border border-slate-100 rounded-[4px] p-1 w-fit shadow-sm mb-6">
                        {[
                            { key: "massal", label: "Analisis Massal", icon: <BarChart3 size={13} /> },
                            { key: "teks", label: "Analisis Teks", icon: <FileText size={13} /> }
                        ].map((tab) => (
                            <button
                                key={tab.key}
                                onClick={() => setActiveMainTab(tab.key)}
                                className={`flex items-center gap-2 px-4 py-2 rounded-[4px] text-xs font-semibold transition-all ${activeMainTab === tab.key
                                    ? "bg-[#d82f5a] text-white shadow-sm"
                                    : "text-slate-500 hover:text-slate-700 hover:bg-slate-50"
                                }`}
                            >
                                {tab.icon}
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    {activeMainTab === "massal" && (
                    <>
                    <div className="w-full bg-white rounded-[4px] p-4 shadow-sm border border-slate-100 space-y-4 min-w-0 font-jakarta">

                        {/* 1. SEKSI INPUT FILTER */}
                        <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-12 gap-3 items-stretch w-full">

                            {/* COLUMN 1: Dropdown Pencarian Aplikasi */}
                            <div className="grid-cols-1 lg:col-span-4 flex items-stretch w-full min-w-0 text-xs font-medium text-slate-600">
                                <AppSearchDropdown
                                    value={searchApp}
                                    onChange={(value) => {
                                        setSearchApp(value);
                                        setSelectedAppId(null);
                                        setSelectedFile(null);
                                    }}
                                    onSelect={(app) => {
                                        setSelectedAppId(app.appId);
                                    }}
                                    disabled={loading}
                                />
                            </div>

                            {/* COLUMN 2: Filter Range Tanggal */}
                            <div className="grid-cols-1 lg:col-span-4 flex items-center px-3 gap-2 bg-white border border-slate-200 rounded-[4px] h-11 text-slate-500 w-full min-w-0">
                                <Calendar size={15} className="text-slate-400 flex-shrink-0" />
                                <div className="flex items-center gap-1 w-full text-xs font-medium justify-between min-w-0">
                                    {selectedFile ? (
                                        <span className="text-slate-400 italic text-[11px] truncate">Tanggal dinonaktifkan (mode file)</span>
                                    ) : (
                                        <div className="flex items-center gap-2 w-full justify-between min-w-0">
                                            <input
                                                type="date"
                                                className="bg-transparent focus:outline-none cursor-pointer w-full text-slate-500 min-w-0 text-[11px] sm:text-xs"
                                                value={startDate}
                                                onChange={(e) => setStartDate(e.target.value)}
                                                disabled={loading}
                                            />
                                            <span className="text-slate-300 shrink-0 font-normal">to</span>
                                            <input
                                                type="date"
                                                className="bg-transparent focus:outline-none cursor-pointer w-full text-slate-500 min-w-0 text-[11px] sm:text-xs"
                                                value={endDate}
                                                onChange={(e) => setEndDate(e.target.value)}
                                                disabled={loading}
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* COLUMN 3: Area Upload File CSV */}
                            <div className="grid-cols-1 lg:col-span-2 flex items-center bg-slate-50/60 border border-slate-200 border-dashed rounded-[4px] h-11 px-3 hover:bg-slate-100 transition-colors cursor-pointer w-full min-w-0">
                                <label className="flex items-center gap-2 cursor-pointer w-full min-w-0">
                                    <Upload size={14} className="text-slate-400 flex-shrink-0" />
                                    <span className="text-xs font-semibold text-slate-500 truncate">
                                        {selectedFile ? selectedFile.name : "Upload CSV"}
                                    </span>
                                    <input
                                        type="file"
                                        className="hidden"
                                        accept=".csv"
                                        disabled={loading}
                                        onChange={(e) => {
                                            if (e.target.files && e.target.files[0]) {
                                                setSelectedFile(e.target.files[0]);
                                                setSearchApp("");
                                                setSelectedAppId(null);
                                            }
                                        }}
                                    />
                                </label>
                            </div>

                            {/* COLUMN 4: Tombol Proses Analisis */}
                            <button
                                onClick={handleProcess}
                                disabled={loading}
                                className="grid-cols-1 lg:col-span-2 h-11 bg-[#d82f5a] hover:bg-[#bd244b] disabled:opacity-50 text-white font-semibold text-xs rounded-[4px] transition-all shadow-sm flex items-center justify-center gap-2 active:scale-[0.98] w-full shrink-0"
                            >
                                <Play size={10} fill="currentColor" className="shrink-0" />
                                <span className="whitespace-nowrap">{loading ? "Analisis..." : "Mulai analisis"}</span>
                            </button>
                        </div>

                        {/* 2. SEKSI BANNER INFO & DOWNLOAD */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 text-[11px] font-medium text-slate-400 border-t border-slate-100">
                            <div className="flex items-center gap-1.5 min-w-0">
                                <AlertCircle size={13} className="text-amber-500 shrink-0" />
                                <p className="truncate text-slate-400">
                                    Maks. 5MB. Wajib kolom <code className="font-mono bg-slate-50 border border-slate-200 text-[#d82f5a] px-1 py-0.5 rounded-[2px] font-bold text-[10px]">content</code> yang berisi teks ulasan tontonan atau komplain dari penonton streaming yang ingin dianalisis secara otomatis.
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={handleDownloadTemplate}
                                className="shrink-0 flex items-center gap-1 text-slate-400 hover:text-[#d82f5a] transition-colors font-semibold self-start sm:self-auto"
                            >
                                <Download size={12} className="shrink-0" />
                                <span>Unduh Template CSV</span>
                            </button>
                        </div>
                    </div>
                    
                    {/* POP-UP LOADING OVERLAY SCREEN */}
                    {loading && (
                        <div className="fixed inset-0 bg-slate-900/40 z-[9999] flex items-center justify-center animate-in fade-in duration-300">
                            <div className="bg-white p-6 rounded-[4px] shadow-xl flex flex-col items-center gap-3 max-w-xs w-full text-center border-0 scale-100 animate-in zoom-in-95 duration-300">
                                <Loader2 size={32} className="animate-spin text-[#d82f5a]" />
                                <div>
                                    <p className="text-sm font-bold text-slate-800">Memproses analisis</p>
                                    <p className="text-xs text-slate-400 mt-0.5">Mengklasifikasikan data sentimen ulasan...</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* POP-UP MODAL LIGHT COMPACT (BG PUTIH - AKSEN PINK TUA) */}
                    {popup.show && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                            {/* Backdrop / Background Gelap Transparan Lembut */}
                            <div
                                className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm transition-opacity"
                                onClick={() => setPopup({ ...popup, show: false })}
                            ></div>

                            {/* Kotak Pop-up Utama - KEMBALI KE PUTIH BERSIH */}
                            <div className="relative bg-white text-slate-900 rounded-[4px] border border-slate-100 shadow-[0_20px_50px_rgba(15,23,42,0.06)] max-w-sm w-full p-6 text-left z-10 font-['Plus_Jakarta_Sans',sans-serif] animate-in fade-in zoom-in-95 duration-200">

                                {/* Tag Pilihan Anda / Status Indicator Mini */}
                                <div className="mb-4">
                                    <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-[3px] ${popup.type === 'success' ? 'bg-[#D82F5A]/10 text-[#D82F5A]' : 'bg-rose-50 text-rose-600'
                                        }`}>
                                        {popup.type === 'success' ? 'Sistem Sukses' : 'Sistem Error'}
                                    </span>
                                </div>

                                <div className="flex items-start gap-3.5">
                                    {/* Icon Indikator Status - Warna Pink Tua / Rose */}
                                    {popup.type === 'success' ? (
                                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#FFF1F2] text-[#D82F5A]">
                                            <i className="ti ti-circle-check text-lg"></i>
                                        </div>
                                    ) : (
                                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-rose-50 text-rose-600">
                                            <i className="ti ti-alert-circle text-lg"></i>
                                        </div>
                                    )}

                                    {/* Konten Teks - Gelap & Abu Lembut */}
                                    <div className="space-y-1 flex-1">
                                        <h3 className="text-sm font-semibold text-slate-900 tracking-tight leading-tight">
                                            {popup.title}
                                        </h3>
                                        <p className="text-xs text-slate-500 font-medium leading-relaxed">
                                            {popup.message}
                                        </p>
                                    </div>
                                </div>

                                {/* Garis Pembatas Tipis */}
                                <div className="h-px bg-slate-100 w-full my-4"></div>

                                {/* Tombol Aksi Akhir - TETEP PINK TUA SOLID */}
                                <div className="flex justify-end">
                                    <button
                                        onClick={() => setPopup({ ...popup, show: false })}
                                        className={`w-full sm:w-auto px-5 py-2.5 rounded-[4px] text-xs font-semibold tracking-wide transition-all duration-200 flex items-center justify-center gap-1.5 shadow-sm ${popup.type === 'success'
                                                ? 'bg-[#D82F5A] text-white hover:bg-[#b0264a] active:scale-[0.99]'
                                                : 'bg-rose-600 text-white hover:bg-rose-700 active:scale-[0.99]'
                                            }`}
                                    >
                                        <span>{popup.type === 'success' ? 'Buka Dashboard Analisis' : 'Mengerti'}</span>
                                        {popup.type === 'success' && <i className="ti ti-arrow-right text-xs"></i>}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ==================== KARTU METRIK RASIO (BAGIAN ATAS) ==================== */}
                    <div className="flex flex-col lg:flex-row gap-6 items-stretch w-full mb-6">

                        {/* Kiri: Tiga Kartu Metrik - Border Radius 4px */}
                        <div className="w-full lg:w-5/12 flex flex-col justify-between gap-4">
                            {[
                                { label: "Sentimen Positif", key: "positif", sub: "Tren kepuasan", desc: `${sentimentData['positif']} ulasan terkumpul`, bgBullet: "bg-emerald-500", textBg: "text-emerald-500", icon: <Smile size={18} /> },
                                { label: "Sentimen Netral", key: "netral", sub: "Tren posisi aman", desc: `${sentimentData['netral']} ulasan terpantau`, bgBullet: "bg-amber-500", textBg: "text-amber-500", icon: <Meh size={18} /> },
                                { label: "Sentimen Negatif", key: "negatif", sub: "Butuh intervensi", desc: `${sentimentData['negatif']} ulasan butuh tindakan`, bgBullet: "bg-[#d82f5a]", textBg: "text-[#d82f5a]", icon: <Frown size={18} /> }
                            ].map((item, i) => (
                                <div key={i} className="flex-1 bg-white rounded-[4px] p-5 shadow-[0_8px_30px_rgb(0,0,0,0.02)] border border-slate-100 flex items-center justify-between transition-all hover:shadow-md">
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2">
                                            <span className={`w-1.5 h-1.5 rounded-full ${item.bgBullet}`}></span>
                                            <span className="text-[10px] font-semibold text-slate-700 tracking-wider uppercase">{item.label}</span>
                                        </div>
                                        <p className="text-[10px] text-slate-400 font-medium mt-0.5">{item.sub}</p>
                                        <div className="flex items-baseline gap-2 pt-1">
                                            <h3 className="text-2xl font-semibold text-slate-800 tracking-tight">{getPercentage(item.key)}%</h3>
                                            <span className="text-[11px] text-slate-400 font-medium">({item.desc})</span>
                                        </div>
                                    </div>
                                    <div className={`bg-slate-50 p-2.5 rounded-[4px] border border-slate-100 ${item.textBg}`}>
                                        {item.icon}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Kanan: Chart Lingkaran Distribusi - Border Radius 4px */}
                        <div className="w-full lg:w-7/12 bg-white p-6 rounded-[4px] shadow-[0_8px_30px_rgb(0,0,0,0.02)] border border-slate-100 flex flex-col transition-all hover:shadow-md">
                            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-slate-100 text-slate-700 rounded-[4px]">
                                        <BarChart3 size={16} className="stroke-[2]" />
                                    </div>
                                    <div>
                                        <h4 className="text-xs font-semibold tracking-tight text-slate-800">Rasio Distribusi Sentimen</h4>
                                        <p className="text-[10px] text-slate-400 font-medium mt-0.5">Persentase total sebaran data</p>
                                    </div>
                                </div>
                                <span className="text-[10px] font-semibold text-rose-600 bg-rose-50/80 px-3 py-1 rounded-[4px] border border-rose-100 shadow-3xs select-none">
                                    Total: {totalReviews} Data Aplikasi
                                </span>
                            </div>

                            <div className="flex flex-col items-center justify-center flex-1 py-4 text-center">
                                <div className="relative w-44 h-44 flex items-center justify-center shrink-0 mb-5">
                                    <svg className="w-full h-full transform -rotate-90">
                                        <circle cx="50%" cy="50%" r="42%" stroke="#f8fafc" strokeWidth="12" fill="transparent" />
                                        <circle
                                            cx="50%" cy="50%" r="42%" stroke="#d82f5a" strokeWidth="12"
                                            strokeDasharray="263.89"
                                            strokeDashoffset={263.89 - (263.89 * parseFloat(getPercentage('positif'))) / 100}
                                            strokeLinecap="square" fill="transparent"
                                            className="transition-all duration-[1500ms] ease-out"
                                        />
                                    </svg>
                                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                                        <span className="text-3xl font-semibold text-slate-800 tracking-tight">{getPercentage('positif')}%</span>
                                        <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-widest mt-0.5">Positif</span>
                                    </div>
                                </div>

                                <div className="max-w-md space-y-1">
                                    <h5 className="text-xs font-semibold text-slate-700">Ringkasan Konklusi Citra</h5>
                                    <p className="text-[11px] text-slate-400 leading-relaxed font-medium">
                                        Grafik ini menunjukkan performa rasio kepuasan pengguna saat ini. Persentase dihitung secara langsung berdasarkan akumulasi data ulasan masuk dari Google Play Store.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ========================================================================= */}
                    {/* SECTION 2: DEEP ANALYSIS SPLIT (WORD CLOUD VS ACCORDION)                */}
                    {/* ========================================================================= */}
                    <div className="flex flex-col xl:flex-row gap-6 items-stretch w-full mb-10">

                        {/* Kiri: Top Keyword / Word Cloud - Border Radius 4px */}
                        <div className="w-full xl:w-1/2 bg-white rounded-[4px] shadow-[0_8px_30px_rgb(0,0,0,0.02)] border border-slate-100 flex flex-col h-[480px]">
                            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-slate-50/50 to-white rounded-t-[4px] shrink-0">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-slate-100 text-slate-700 rounded-[4px]">
                                        <CloudLightning size={16} className="stroke-[2]" />
                                    </div>
                                    <div>
                                        <h4 className="text-xs font-semibold tracking-tight text-slate-800">Top Keywords Cloud</h4>
                                        <p className="text-[10px] text-slate-400 font-medium mt-0.5">Kata yang paling sering muncul</p>
                                    </div>
                                </div>

                                {/* Filter Tab Kanan Atas - Border Radius 4px */}
                                <div className="flex gap-1 bg-slate-200/60 p-1 rounded-[4px]">
                                    {['positif', 'netral', 'negatif'].map((tab) => (
                                        <button
                                            key={tab}
                                            onClick={() => {
                                                setActiveTab(tab);
                                                if (typeof setOpenAccordionIdx === 'function') setOpenAccordionIdx(null);
                                            }}
                                            className={`px-3 py-1 text-[9px] font-semibold rounded-[4px] transition-all uppercase tracking-wider ${activeTab === tab ? 'bg-white text-slate-800 shadow-xs' : 'text-slate-500 hover:text-slate-700'}`}
                                        >
                                            {tab}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="p-8 flex-1 overflow-y-auto flex items-center justify-center bg-white rounded-b-[4px]">
                                <div className="flex flex-wrap gap-x-6 gap-y-5 justify-center items-center text-center max-w-md py-4">
                                    {topWords[activeTab] && topWords[activeTab].length > 0 ? (
                                        topWords[activeTab].map((word, idx) => {
                                            const sizeClasses = [
                                                'text-xl font-semibold text-[#d82f5a]',
                                                'text-xs font-medium text-slate-400',
                                                'text-sm font-medium text-slate-500',
                                                'text-2xl font-semibold text-slate-800',
                                                'text-base font-semibold text-[#d82f5a]',
                                                'text-[10px] font-medium text-slate-300'
                                            ];
                                            return (
                                                <span
                                                    key={idx}
                                                    className={`${sizeClasses[idx % sizeClasses.length]} hover:scale-105 hover:text-[#d82f5a] transition-all cursor-pointer block duration-150 transform`}
                                                    title={`Muncul ${word[1]} kali`}
                                                >
                                                    {word[0]}
                                                </span>
                                            );
                                        })
                                    ) : (
                                        <span className="text-xs text-slate-400 italic font-medium">Belum ada data kata kunci.</span>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Kanan: Accordion Konteks Ulasan - Border Radius 4px */}
                        <div className="w-full xl:w-1/2 bg-white rounded-[4px] shadow-[0_8px_30px_rgb(0,0,0,0.02)] border border-slate-100 flex flex-col h-[480px] transition-all">
                            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-slate-50/50 to-white rounded-t-[4px] shrink-0">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-slate-100 text-slate-700 rounded-[4px]">
                                        <FileText size={16} className="stroke-[2]" />
                                    </div>
                                    <div>
                                        <h3 className="text-xs font-semibold tracking-tight text-slate-800">Konteks Kalimat Ulasan</h3>
                                        <p className="text-[10px] text-slate-400 font-medium mt-0.5">Sampel ulasan asli dari pengguna</p>
                                    </div>
                                </div>

                                {/* Badge yang Selaras Kotak */}
                                <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200/80 px-3 py-1 rounded-[4px] shadow-3xs select-none">
                                    <span className={`w-1.5 h-1.5 rounded-full ${activeTab === 'positif' ? 'bg-emerald-500' : activeTab === 'negatif' ? 'bg-[#d82f5a]' : 'bg-amber-400'}`} />
                                    <span className="text-[9px] font-semibold uppercase tracking-wider text-slate-600">
                                        {activeTab}
                                    </span>
                                </div>
                            </div>

                            {/* Area List Accordion */}
                            <div className="p-4 flex-1 overflow-y-auto bg-white rounded-b-[4px] custom-scrollbar space-y-2.5">
                                {analysisResult && topWords[activeTab] && topWords[activeTab].length > 0 ? (
                                    <div className="space-y-2.5">
                                        {topWords[activeTab].map((word, idx) => {
                                            const isOpen = openAccordionIdx === idx;
                                            return (
                                                <div
                                                    key={idx}
                                                    className={`border rounded-[4px] overflow-hidden transition-all duration-200 ${isOpen ? 'border-[#d82f5a]/20 shadow-[0_4px_20px_rgba(216,47,90,0.03)] bg-slate-50/20' : 'border-slate-100 hover:border-slate-200 bg-white hover:shadow-2xs'}`}
                                                >
                                                    <button
                                                        onClick={() => setOpenAccordionIdx(isOpen ? null : idx)}
                                                        className="w-full px-4 py-3 flex justify-between items-center transition-colors focus:outline-none"
                                                    >
                                                        <div className="flex items-center gap-3 min-w-0">
                                                            <div className={`w-5 h-5 rounded-[4px] flex items-center justify-center text-[10px] font-semibold ${isOpen ? 'bg-[#d82f5a] text-white' : 'bg-slate-100 text-slate-500'}`}>
                                                                {idx + 1}
                                                            </div>
                                                            <span className="text-xs font-semibold text-slate-700 capitalize truncate tracking-wide">
                                                                {word[0]}
                                                            </span>
                                                        </div>
                                                        <div className={`p-1 rounded-[4px] transition-transform duration-200 ${isOpen ? 'bg-[#d82f5a]/10 text-[#d82f5a]' : 'text-slate-400'}`}>
                                                            {isOpen ? <ChevronUp size={12} className="stroke-[2.5]" /> : <ChevronDown size={12} className="stroke-[2.5]" />}
                                                        </div>
                                                    </button>

                                                    {isOpen && (
                                                        <div className="px-4 pb-3.5 pt-0.5 bg-white border-t border-slate-100/70 animate-in fade-in duration-150">
                                                            <div className="space-y-2 mt-2">
                                                                {word[2] && word[2].length > 0 ? (
                                                                    word[2].map((review, rIdx) => (
                                                                        <div key={rIdx} className="text-[11px] text-slate-600 flex items-start gap-2 bg-slate-50/60 hover:bg-slate-50 p-2.5 rounded-[4px] border border-slate-100 transition-colors">
                                                                            <span className="text-[#d82f5a] font-serif text-base leading-none select-none shrink-0 mt-0.5">“</span>
                                                                            <p className="leading-relaxed italic text-slate-600 flex-1 font-medium">{review}</p>
                                                                            <span className="text-[#d82f5a] font-serif text-base leading-none select-none shrink-0 align-bottom mt-auto">”</span>
                                                                        </div>
                                                                    ))
                                                                ) : (
                                                                    <div className="text-[11px] text-slate-400 italic text-center py-2.5 bg-slate-50/40 rounded-[4px] border border-dashed border-slate-200 font-medium">
                                                                        Tidak ada sampel ulasan.
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    <div className="text-center py-12 border border-dashed border-slate-200 rounded-[4px] h-full flex flex-col items-center justify-center p-6 bg-slate-50/30">
                                        <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-2">
                                            <FileText size={16} className="stroke-[1.5]" />
                                        </div>
                                        <p className="text-xs font-semibold text-slate-700">Belum Ada Data</p>
                                        <p className="text-[10px] text-slate-400 max-w-[200px] mt-0.5 leading-normal font-medium">
                                            Silakan jalankan proses analisis terlebih dahulu.
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    {/* ========================================================================= */}

                    {/* 1. KONDISI JIKA DATA SUDAH ADA (TABEL & PAGINASI) */}
                    {analysisResult && analysisResult.data && analysisResult.data.length > 0 && (
                        <div className="bg-white border border-slate-100 rounded-[4px] shadow-[0_8px_30px_rgb(0,0,0,0.02)] transition-all hover:shadow-md">
                            {(() => {
                                const itemsPerPage = 7;
                                const displayCount = Math.min(20, analysisResult.data.length);
                                const slicedData = analysisResult.data.slice(0, displayCount);

                                const totalPages = Math.ceil(displayCount / itemsPerPage);
                                const validCurrentPage = Math.max(1, Math.min(currentPage, totalPages));

                                const startIndex = (validCurrentPage - 1) * itemsPerPage;
                                const endIndex = startIndex + itemsPerPage;
                                const currentData = slicedData.slice(startIndex, endIndex);

                                const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

                                return (
                                    <>
                                        {/* Header Tabel */}
                                        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-slate-50/50 to-white rounded-t-[4px]">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-slate-100 text-slate-700 rounded-[4px]">
                                                    <FileText size={16} className="stroke-[2]" />
                                                </div>
                                                <div className="font-jakarta">
                                                    <h4 className="text-xs font-semibold tracking-tight text-slate-800">Sampel Data Ulasan</h4>
                                                    <p className="text-[10px] text-slate-400 font-medium mt-0.5">
                                                        Menampilkan {startIndex + 1} - {Math.min(endIndex, displayCount)} dari {displayCount} data teratas
                                                    </p>
                                                </div>
                                            </div>
                                            <span className="text-[10px] font-jakarta font-semibold text-slate-600 bg-slate-50 px-3 py-1 rounded-[4px] border border-slate-200/60 shadow-3xs select-none">
                                                Total Sampel: {displayCount} Ulasan
                                            </span>
                                        </div>

                                        {/* Container Table */}
                                        <div className="overflow-x-auto">
                                            <table className="w-full text-[11px] font-medium text-slate-600 font-jakarta">
                                                <thead>
                                                    <tr className="border-b border-slate-100 bg-slate-50/50 text-slate-400 uppercase tracking-wider text-[9px]">
                                                        <th className="text-left py-3 px-5 font-semibold w-16">No</th>
                                                        <th className="text-left py-3 px-4 font-semibold">Konten Ulasan</th>
                                                        <th className="text-center py-3 px-5 font-semibold w-32">Label Sentimen</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-slate-50">
                                                    {currentData.map((item, idx) => (
                                                        <tr key={idx} className="hover:bg-slate-50/50 transition-colors group">
                                                            <td className="py-3 px-5 text-slate-400 font-medium">
                                                                {startIndex + idx + 1}
                                                            </td>
                                                            <td className="py-3 px-4 text-slate-700 break-words whitespace-normal leading-relaxed italic pr-8">
                                                                “{item.content || "-"}”
                                                            </td>
                                                            <td className="text-center py-3 px-5">
                                                                <span
                                                                    className={`px-2.5 py-1 rounded-[4px] text-[10px] font-semibold tracking-wide inline-block uppercase border select-none ${item.sentiment === 'positif'
                                                                        ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
                                                                        : item.sentiment === 'netral'
                                                                            ? 'bg-amber-50 text-amber-600 border-amber-100'
                                                                            : 'bg-rose-50 text-[#d82f5a] border-rose-100'
                                                                        }`}
                                                                >
                                                                    {item.sentiment}
                                                                </span>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>

                                        {/* FOOTER: SYSTEM PAGINATION FIXED FONT JAKARTA */}
                                        <div className="p-5 border-t border-slate-100 flex items-center justify-center bg-white rounded-b-[4px]">
                                            <div className="flex items-center gap-5 select-none font-jakarta">

                                                {/* Tombol Sebelumnya */}
                                                <button
                                                    type="button"
                                                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                                    disabled={validCurrentPage === 1}
                                                    className={`text-[12px] font-medium transition-colors flex items-center gap-2 focus:outline-none ${validCurrentPage === 1
                                                        ? 'text-slate-300 cursor-not-allowed'
                                                        : 'text-slate-400 hover:text-slate-700'
                                                        }`}
                                                >
                                                    <span className={`text-sm font-bold ${validCurrentPage === 1 ? 'text-slate-300' : 'text-[#d82f5a]'}`}>←</span>
                                                    Sebelumnya
                                                </button>

                                                {/* Deretan Angka Halaman Dinamis */}
                                                <div className="flex items-center gap-4">
                                                    {pageNumbers.map((page) => {
                                                        const isActive = page === validCurrentPage;
                                                        return isActive ? (
                                                            <div
                                                                key={page}
                                                                className="w-8 h-8 flex items-center justify-center rounded-[10px] bg-rose-50 border border-rose-200 text-[12px] font-semibold text-[#d82f5a] shadow-3xs"
                                                            >
                                                                {page}
                                                            </div>
                                                        ) : (
                                                            <button
                                                                key={page}
                                                                type="button"
                                                                onClick={() => setCurrentPage(page)}
                                                                className="w-6 h-6 flex items-center justify-center text-[12px] font-medium text-[#d82f5a] hover:text-rose-800 transition-colors focus:outline-none"
                                                            >
                                                                {page}
                                                            </button>
                                                        );
                                                    })}
                                                </div>

                                                {/* Tombol Selanjutnya */}
                                                <button
                                                    type="button"
                                                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                                    disabled={validCurrentPage === totalPages}
                                                    className={`text-[12px] font-medium transition-colors flex items-center gap-2 focus:outline-none ${validCurrentPage === totalPages
                                                        ? 'text-slate-300 cursor-not-allowed'
                                                        : 'text-slate-500 hover:text-slate-800'
                                                        }`}
                                                >
                                                    Selanjutnya
                                                    <span className={`text-sm font-bold ${validCurrentPage === totalPages ? 'text-slate-300' : 'text-[#d82f5a]'}`}>→</span>
                                                </button>

                                            </div>
                                        </div>
                                    </>
                                );
                            })()}
                        </div>
                    )}

                    {/* 2. KONDISI JIKA BELUM ADA DATA SAMA SEKALI (EMPTY STATE SAAS STREAMING) */}
                    {(!analysisResult || !analysisResult.data || analysisResult.data.length === 0) && (
                        <div className="bg-white border border-dashed border-slate-200 rounded-[4px] p-12 text-center shadow-[0_8px_30px_rgb(0,0,0,0.01)] flex flex-col items-center justify-center font-jakarta">
                            <div className="w-12 h-12 rounded-[4px] bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 mb-4 shadow-3xs">
                                <CloudLightning size={20} className="stroke-[1.8]" />
                            </div>
                            <p className="text-xs font-semibold text-slate-700 tracking-tight">Belum Ada Data Analisis</p>
                            <p className="text-[11px] text-slate-400 font-medium max-w-sm mt-1 leading-relaxed">
                                Silakan masukkan nama aplikasi atau unggah dokumen berkstensi CSV terlebih dahulu untuk melihat ulasan streaming para penonton.
                            </p>
                        </div>
                    )}
                    </>
                    )} {/* END activeMainTab === "massal" */}

                    {/* ============================================================== */}
                    {/* TAB ANALISIS TEKS MANUAL                                       */}
                    {/* ============================================================== */}
                    {activeMainTab === "teks" && (
                        <div className="space-y-5 font-jakarta">

                            {/* Panel Input */}
                            <div className="bg-white rounded-[4px] border border-slate-100 shadow-sm p-5">
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center gap-2.5">
                                        <div className="w-7 h-7 rounded-[4px] bg-rose-50 border border-rose-100 flex items-center justify-center">
                                            <FileText size={13} className="text-[#d82f5a]" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-semibold text-slate-800 tracking-tight">Teks yang akan dianalisis</p>
                                            <p className="text-[10px] text-slate-400 font-medium">Tulis atau tempel teks ulasan di bawah ini</p>
                                        </div>
                                    </div>
                                    <span className="text-[10px] font-medium text-slate-400">{textInput.length} / 2000</span>
                                </div>

                                <textarea
                                    value={textInput}
                                    onChange={(e) => setTextInput(e.target.value.slice(0, 2000))}
                                    rows={7}
                                    placeholder='Tulis atau tempel teks di sini... Contoh: "Aplikasi ini sangat membantu dan mudah digunakan, tapi kadang agak lambat."'
                                    className="w-full resize-none border border-slate-200 rounded-[4px] px-4 py-3 text-[12px] text-slate-700 font-medium leading-relaxed placeholder:text-slate-300 focus:outline-none focus:border-[#d82f5a] transition-colors font-jakarta"
                                />

                                <div className="flex items-center justify-between mt-3 gap-3 flex-wrap">
                                    <div className="flex items-center gap-2 flex-wrap">
                                        {[
                                            { key: "positif", label: "Contoh positif", icon: <Smile size={11} /> },
                                            { key: "netral", label: "Contoh netral", icon: <Meh size={11} /> },
                                            { key: "negatif", label: "Contoh negatif", icon: <Frown size={11} /> },
                                        ].map((s) => (
                                            <button
                                                key={s.key}
                                                onClick={() => setTextInput(TEXT_SAMPLES[s.key])}
                                                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-[4px] text-[10px] font-semibold text-slate-500 hover:text-slate-700 transition-all"
                                            >
                                                {s.icon}
                                                {s.label}
                                            </button>
                                        ))}
                                        {textInput && (
                                            <button
                                                onClick={() => { setTextInput(""); setTextAnalysisResult(null); }}
                                                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-[4px] text-[10px] font-semibold text-slate-400 hover:text-slate-600 transition-all"
                                            >
                                                <AlertCircle size={11} />
                                                Hapus
                                            </button>
                                        )}
                                    </div>
                                    <button
                                        onClick={handleAnalyzeText}
                                        disabled={!textInput.trim() || textAnalysisLoading}
                                        className="flex items-center gap-2 px-5 py-2 bg-[#d82f5a] hover:bg-[#bd244b] disabled:opacity-50 disabled:cursor-not-allowed text-white text-[11px] font-semibold rounded-[4px] transition-all active:scale-[0.98] shadow-sm"
                                    >
                                        {textAnalysisLoading
                                            ? <><Loader2 size={12} className="animate-spin" /> Menganalisis...</>
                                            : <><Play size={10} fill="currentColor" /> Analisis Sentimen</>
                                        }
                                    </button>
                                </div>
                            </div>

                            {/* Hasil Analisis */}
                            {textAnalysisLoading && (
                                <div className="bg-white rounded-[4px] border border-slate-100 p-10 flex flex-col items-center justify-center gap-3 text-center shadow-sm">
                                    <Loader2 size={28} className="animate-spin text-[#d82f5a]" />
                                    <div>
                                        <p className="text-xs font-semibold text-slate-700">Menganalisis sentimen...</p>
                                        <p className="text-[10px] text-slate-400 mt-0.5 font-medium">Memproses teks ke server analisis...</p>
                                    </div>
                                </div>
                            )}

                            {textAnalysisResult && !textAnalysisLoading && (() => {
                                const r = textAnalysisResult;
                                const sent = r.sentiment || "netral";
                                const sentColor = sent === "positif" ? "#059669" : sent === "negatif" ? "#d82f5a" : "#d97706";
                                const sentBg   = sent === "positif" ? "#ecfdf5" : sent === "negatif" ? "#fff1f4" : "#fffbeb";
                                const sentBorder = sent === "positif" ? "#a7f3d0" : sent === "negatif" ? "#fecdd3" : "#fde68a";
                                const sentEmoji  = sent === "positif" ? "😊" : sent === "negatif" ? "😞" : "😐";
                                const SentIcon   = sent === "positif" ? Smile : sent === "negatif" ? Frown : Meh;

                                const SENTIMENT_ITEMS = [
                                    { key: "positif", label: "Positif", color: "#059669", bg: "#ecfdf5", border: "#d1fae5", icon: <Smile size={16} /> },
                                    { key: "netral",  label: "Netral",  color: "#d97706", bg: "#fffbeb", border: "#fde68a", icon: <Meh   size={16} /> },
                                    { key: "negatif", label: "Negatif", color: "#d82f5a", bg: "#fff1f4", border: "#ffe4e8", icon: <Frown  size={16} /> },
                                ];

                                return (
                                    <div className="space-y-4">
                                        {/* Header Hasil */}
                                        <div className="flex items-center gap-2.5 px-1">
                                            <div className="w-6 h-6 rounded-[4px] bg-emerald-50 border border-emerald-100 flex items-center justify-center">
                                                <CheckCircle2 size={12} className="text-emerald-500" />
                                            </div>
                                            <div>
                                                <p className="text-xs font-semibold text-slate-800 tracking-tight">Hasil Analisis Sentimen</p>
                                                <p className="text-[10px] text-slate-400 font-medium">Prediksi model berhasil diproses</p>
                                            </div>
                                        </div>

                                        {/* Sentimen Utama */}
                                        <div
                                            className="rounded-[4px] border p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                                            style={{ background: sentBg, borderColor: sentBorder }}
                                        >
                                            <div className="flex items-center gap-4">
                                                <div
                                                    className="w-12 h-12 rounded-[4px] flex items-center justify-center flex-shrink-0 border"
                                                    style={{ background: "white", borderColor: sentBorder }}
                                                >
                                                    <SentIcon size={22} style={{ color: sentColor }} />
                                                </div>
                                                <div>
                                                    <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400 mb-1">Sentimen Terdeteksi</p>
                                                    <p className="text-2xl font-bold capitalize" style={{ color: sentColor, letterSpacing: "-0.01em" }}>
                                                        {sent}
                                                    </p>
                                                </div>
                                            </div>
                                            <span className="text-4xl select-none" role="img" aria-label={sent}>{sentEmoji}</span>
                                        </div>

                                        {/* Teks Dianalisis */}
                                        <div className="bg-slate-50 rounded-[4px] border border-slate-100 p-4">
                                            <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400 mb-2.5">Teks yang Dianalisis</p>
                                            <p className="text-[12px] text-slate-600 font-medium leading-relaxed line-clamp-5 italic">
                                                &ldquo;{r.text}&rdquo;
                                            </p>
                                        </div>

                                        {/* Indikator Tiga Kelas */}
                                        <div className="grid grid-cols-3 gap-3">
                                            {SENTIMENT_ITEMS.map((item) => {
                                                const isActive = item.key === sent;
                                                return (
                                                    <div
                                                        key={item.key}
                                                        className="flex flex-col items-center gap-2 p-3.5 rounded-[4px] border transition-all"
                                                        style={{
                                                            background: isActive ? item.bg : "white",
                                                            borderColor: isActive ? item.border : "#f1f5f9",
                                                            opacity: isActive ? 1 : 0.45
                                                        }}
                                                    >
                                                        <div style={{ color: item.color }}>{item.icon}</div>
                                                        <p className="text-[10px] font-semibold text-slate-600">{item.label}</p>
                                                        {isActive && (
                                                            <CheckCircle2 size={11} style={{ color: item.color }} />
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                );
                            })()}

                            {!textAnalysisResult && !textAnalysisLoading && (
                                <div className="bg-white border border-dashed border-slate-200 rounded-[4px] p-12 text-center flex flex-col items-center justify-center">
                                    <div className="w-12 h-12 rounded-[4px] bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-300 mb-4">
                                        <CloudLightning size={20} className="stroke-[1.8]" />
                                    </div>
                                    <p className="text-xs font-semibold text-slate-600 tracking-tight">Hasil analisis akan muncul di sini</p>
                                    <p className="text-[11px] text-slate-400 font-medium max-w-xs mt-1 leading-relaxed">
                                        Masukkan teks di atas lalu klik tombol <span className="font-semibold text-[#d82f5a]">Analisis Sentimen</span> untuk memulai
                                    </p>
                                </div>
                            )}
                        </div>
                    )}
                </main>

                <Footer />
            </div>
        </div>
    );
};

export default SentimenAnalysis;