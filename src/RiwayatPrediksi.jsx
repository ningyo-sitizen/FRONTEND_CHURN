import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import axios from "axios";
import { useAuth } from "../utils/auth";
// ASSETS
import CSVicon from './assets/csv.png';
import unggahdata from './assets/unggahdata.png';
import logochurn from './assets/logo churn.png';
import Header from './Header';
import Sidebar from './SideBar';
import Footer from './Footer';

// ICONS - TABLER (Dikelompokkan jadi satu biar rapi)
import {
    IconLayoutDashboard,
    IconChartBar,
    IconHistory,
    IconSearch,
    IconFilter,
    IconBell,
    IconChevronDown,
    IconBrandInstagram,
    IconBrandX,
    IconBrandYoutube,
    IconCircleCheckFilled,
    IconAlertTriangle,
    IconTrash,
    IconUpload,
    IconBrandMyOppo,
    IconUserCircle,
    IconLogout2
} from '@tabler/icons-react';


const RiwayatPrediksi = () => {
    const navigate = useNavigate();
    const user = useAuth()
    const [isOpen, setIsOpen] = useState(false);

    // State Data
    const [dataHistory, setDataHistory] = useState([

    ]);

    // State Modal
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedId, setSelectedId] = useState(null);

    const openConfirmModal = (id) => {
        setSelectedId(id);
        setIsModalOpen(true);
    };

    const handleDelete = async () => {
        try {

            const token = localStorage.getItem("token");

            const response = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/prediction/delete`,
                {
                    id: selectedId
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            console.log(response.data);

            getHistory();

            setIsModalOpen(false);

            setSelectedId(null);

        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {

        getHistory();

    }, []);

    const getHistory = async () => {

        try {

            const token = localStorage.getItem("token");

            const res = await axios.get(
                `${import.meta.env.VITE_BACKEND_URL}/prediction/history`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setDataHistory(res.data.data);

        } catch (err) {

            console.log(err);
        }
    };

    return (
        <div className="min-h-screen bg-white font-['Plus_Jakarta_Sans',sans-serif] text-[#111827] flex flex-col relative">

            {/* MODAL KONFIRMASI HAPUS */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                        {/* Backdrop: Glassmorphism tipis */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsModalOpen(false)}
                            className="absolute inset-0 bg-[#000000]/10 backdrop-blur-[4px]"
                        />

                        {/* Modal Card: Horizontal Rectangle Clean Style */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.98, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.98, y: 10 }}
                            className="bg-white w-full max-w-[480px] rounded-[4px] shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-gray-100 relative z-10 overflow-hidden"
                        >
                            <div className="p-8">
                                <div className="flex gap-6">
                                    {/* Icon Section: Background Soft Red */}
                                    <div className="flex-shrink-0">
                                        <div className="w-12 h-12 bg-red-50 rounded-[4px] flex items-center justify-center text-red-500">
                                            <IconTrash size={24} stroke={2} />
                                        </div>
                                    </div>

                                    {/* Content Section */}
                                    <div className="flex-1">
                                        <h3 className="text-[16px] font-bold text-gray-900 mb-1 tracking-tight">
                                            Hapus riwayat data CSV?
                                        </h3>
                                        <p className="text-[13px] text-gray-400 leading-relaxed font-medium">
                                            Data akan dihapus secara permanen dari server. Tindakan ini tidak dapat dibatalkan kembali.
                                        </p>
                                    </div>
                                </div>

                                {/* Action Buttons: Rapi di Pojok Kanan Bawah */}
                                <div className="flex justify-end gap-3 mt-10">
                                    <button
                                        onClick={() => setIsModalOpen(false)}
                                        className="px-6 py-2.5 rounded-[4px] text-[11px] font-bold text-gray-400 hover:text-gray-900 transition-all uppercase tracking-widest"
                                    >
                                        Batalkan
                                    </button>
                                    <button
                                        onClick={handleDelete}
                                        className="bg-[#111827] hover:bg-red-600 text-white px-8 py-2.5 rounded-[4px] text-[11px] font-bold shadow-sm transition-all uppercase tracking-widest active:scale-95"
                                    >
                                        Ya, Hapus
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <div className="flex flex-1">
                {/* SIDEBAR */}
                <Sidebar></Sidebar>

                {/* MAIN CONTENT */}
                <main className="flex-1 flex flex-col min-w-0 bg-[#F9FAFB]">
                    <Header formData={user} profileImg={user?.avatar} />

                    <div className="p-8 w-full">
                        <div className="mb-8">
                            <h1 className="text-2xl font-semibold text-gray-900 ">Riwayat Prediksi</h1>
                            <p className="text-sm text-gray-500 mt-1 leading-relaxed">
                                Arsip lengkap seluruh hasil prediksi yang pernah dilakukan di sistem ChurnGuard.
                            </p>
                        </div>

                        {/* Render Data atau Empty State */}
                        {dataHistory.length > 0 ? (
                            <>
                                <div className="flex justify-end gap-3 mb-8">
                                    <div className="relative w-64">
                                        <IconSearch size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                        <input type="text" placeholder="Cari........" className="w-full bg-white border border-gray-200 rounded-[4px] py-2 pl-10 pr-4 text-xs outline-none focus:border-[#D82F5A]" />
                                    </div>
                                    <button className="flex items-center gap-2 bg-white border border-gray-200 px-4 py-2 rounded-[4px] text-xs font-medium text-gray-500 hover:bg-gray-50 transition-all">
                                        Filter <IconFilter size={14} />
                                    </button>
                                </div>

                                <motion.div layout className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                    <AnimatePresence>
                                        {dataHistory.map((item) => (
                                            <motion.div
                                                key={item.prediction_id}
                                                layout
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, scale: 0.9 }}
                                                className="bg-white border border-gray-200 rounded-[4px] p-6 shadow-sm hover:shadow-md transition-all group"
                                            >

                                                {/* HEADER */}
                                                <div className="flex items-start gap-4 mb-3">

                                                    <img
                                                        src={CSVicon}
                                                        alt="CSV Icon"
                                                        className="w-10 h-10 object-contain"
                                                    />

                                                    <div className="flex-1 min-w-0">

                                                        <h4 className="text-sm font-semibold text-gray-900 truncate">
                                                            {item.filename}
                                                        </h4>

                                                        <div className="flex items-center gap-1.5 mt-0.5">

                                                            <div className="flex items-center gap-1 text-[#22C55E]">
                                                                <IconCircleCheckFilled size={14} />

                                                                <span className="text-xs text-gray-400 font-medium tracking-tight">
                                                                    Selesai
                                                                </span>
                                                            </div>

                                                        </div>
                                                    </div>
                                                </div>

                                                {/* DATE */}
                                                <p className="text-xs mt-4 text-gray-400 pb-3 border-b border-[#EDEDED]">
                                                    {new Date(item.created_at).toLocaleDateString("id-ID", {
                                                        weekday: "long",
                                                        day: "numeric",
                                                        month: "long",
                                                        year: "numeric"
                                                    })}
                                                </p>

                                                {/* DETAIL */}
                                                <div className="space-y-4 border-t border-gray-50 pt-3 mb-7 text-xs">

                                                    <div className="flex justify-between items-center">
                                                        <span className="text-gray-400">
                                                            Tingkat Pengunduran Diri
                                                        </span>

                                                        <span className="font-medium">
                                                            : {item.total_churn} Orang
                                                        </span>
                                                    </div>

                                                    <div className="flex justify-between items-center">
                                                        <span className="text-gray-400">
                                                            Total Pelanggan
                                                        </span>

                                                        <span className="font-medium">
                                                            : {item.total_customer} Orang
                                                        </span>
                                                    </div>

                                                    <div className="flex justify-between items-center">
                                                        <span className="text-gray-400">
                                                            Beresiko Tinggi
                                                        </span>

                                                        <span className="font-medium">
                                                            : {item.high_risk_percentage}%
                                                        </span>
                                                    </div>

                                                    <div className="flex justify-between items-center">
                                                        <span className="text-gray-400">
                                                            Total High Risk
                                                        </span>

                                                        <span className="font-medium">
                                                            : {item.total_high_risk} Orang
                                                        </span>
                                                    </div>

                                                </div>

                                                {/* BUTTON */}
                                                <div className="grid grid-cols-2 gap-3">

                                                    <button
                                                        onClick={() => openConfirmModal(item.prediction_id)}
                                                        className="bg-white border border-[#D82F5A] text-[#D82F5A] py-2.5 rounded-[4px] text-xs font-medium hover:bg-pink-50 transition-all"
                                                    >
                                                        Hapus
                                                    </button>

                                                    <button
                                                        onClick={() =>
                                                            navigate(
                                                                `/dashboardhistory?prediction_id=${item.prediction_id}`
                                                            )
                                                        }
                                                        className="bg-black text-white py-2.5 rounded-[4px] text-xs font-medium hover:bg-gray-800 transition-all">
                                                        Rincian
                                                    </button>

                                                </div>

                                            </motion.div>
                                        ))}
                                    </AnimatePresence>
                                </motion.div>
                            </>
                        ) : (
                            /* EMPTY STATE */
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="py-24 flex flex-col items-center justify-center text-center bg-white border border-dashed border-gray-200 rounded-[4px]"
                            >
                                <img src={unggahdata} alt="Unggah Data" className="w-56 h-auto mb-6" />
                                <h3 className="text-xl font-semibold text-[#111827] mb-2 tracking-tight">Belum ada riwayat prediksi</h3>
                                <p className="text-gray-400 text-xs mb-10 max-w-sm leading-relaxed px-4">
                                    Data riwayat prediksi akan ditampilkan di sini setelah Anda mengunggah file pelanggan untuk dianalisis.
                                </p>
                                <button
                                    onClick={() => navigate('/uploadData')}
                                    className="bg-[#D82F5A] text-white px-10 py-3.5 rounded-[4px] text-xs font-medium flex items-center gap-3 hover:bg-[#b5264b] transition-all duration-300 active:scale-95 shadow-xl shadow-[#D82F5A]/20"
                                >
                                    <IconUpload size={18} />
                                    <span>Mulai Unggah Data</span>
                                </button>
                            </motion.div>
                        )}
                    </div>
                    <footer></footer>
                </main>
            </div>

        </div>
    );
};

export default RiwayatPrediksi;