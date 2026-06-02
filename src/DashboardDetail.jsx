import axios from "axios";
import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useAuth } from "../utils/auth";

import logochurn from './assets/logo churn.png';

import {
    IconBrandMyOppo,
    IconUserCircle,
    IconLogout2
} from '@tabler/icons-react';
import Sidebar from "./SideBar";
import Header from "./Header";
export default function CostumerDetail() {
    const user = useAuth()
    const [disableButton, setDisableButton] = useState(false);
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const prediction_id = searchParams.get("prediction_id");
    const CustomerID = searchParams.get("CustomerID");

    const [detail, setDetail] = useState(null);
    const [loading, setLoading] = useState(true);

    const [chatMessage, setChatMessage] = useState("");
    const [emailMessage, setEmailMessage] = useState("");

    const [showPopup, setShowPopup] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    const [promoName, setPromoName] = useState("");
    const [promoDiscount, setPromoDiscount] = useState("");
    const [expiredDate, setExpiredDate] = useState("");
    const [loadingPromo, setLoadingPromo] = useState(false);

    const getRetentionRecommendation = () => {

        if (detail.Risk === "High") {

            if (detail.Segment === "Basic Frustrated User") {
                return "Berikan diskon besar dan rekomendasi film favorit customer untuk mencegah churn.";
            }

            if (detail.Segment === "Basic User") {
                return "Berikan promo subscription dan rekomendasi content populer.";
            }

            return "Berikan loyalty offer dan rekomendasi exclusive content.";
        }

        if (detail.Risk === "Medium") {

            if (detail.Segment === "Basic Frustrated User") {
                return "Kirim rekomendasi film dan reminder untuk meningkatkan engagement.";
            }

            if (detail.Segment === "Basic User") {
                return "Rekomendasikan film trending berdasarkan genre favorit.";
            }

            return "Berikan reward kecil dan rekomendasi content premium.";
        }

        return "Tidak perlu diskon, cukup rekomendasikan film populer.";
    };

    const handleGenerateEmail = async () => {
        // 1. Nyalakan loading tepat pas tombol diklik
        setLoadingPromo(true);

        try {
            const response = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/email/generate`,
                {
                    promo_name: promoName,
                    promo_discount: promoDiscount,
                    expired_date: expiredDate,
                    risk: detail.Risk,
                    segment: detail.Segment,
                    genre: detail.GenrePreference,
                    email: detail.email
                }
            );

            setEmailMessage(response.data.html);
            setChatMessage(response.data.html)
            setShowPopup(false);

        } catch (err) {
            console.log(err);
            // Opsional: lo bisa tambah alert/toast error di sini biar user tau kalau gagal
        } finally {
            // 2. Matikan loading secara otomatis, baik prosesnya berhasil maupun error
            setLoadingPromo(false);
        }
    };
    useEffect(() => {

        const fetchDataUserDetail = async () => {

            const token = localStorage.getItem("token");

            try {

                const response = await axios.get(
                    `${import.meta.env.VITE_BACKEND_URL}/prediction/costumer-detail?customerid=${CustomerID}&predictionid=${prediction_id}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                setDetail(response.data.data);
                setChatMessage(response.data.data.email_sent)

                setDisableButton(response.data.data.email_sent?.length > 0)

            } catch (error) {

                console.log(error);

            } finally {

                setLoading(false);

            }
        };

        fetchDataUserDetail();

    }, []);

    const handleSendChat = async () => {
        const token = localStorage.getItem('token')
        console.log("kiana")
        try {

            await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/email/send`,
                {
                    html: chatMessage,
                    email: detail.email
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setChatMessage("");
            setEmailMessage("");

        } catch (error) {

            console.log(error);

        }
    };

    if (loading) {

        return (
            <div className="flex justify-center items-center h-screen">
                Loading...
            </div>
        );

    }

    if (!detail) {

        return (
            <div className="flex justify-center items-center h-screen">
                Data tidak ditemukan
            </div>
        );

    }

    const stats = [
        {
            label: 'Customer ID',
            value: detail.CustomerID,
            icon: 'ti-id'
        },
        {
            label: 'Email',
            value: detail.email,
            icon: 'ti-mail'
        },
        {
            label: 'Usia Akun',
            value: `${detail.AccountAge} Bulan`,
            icon: 'ti-calendar-time'
        },
        {
            label: 'Tagihan Bulanan',
            value: `$${detail.MonthlyCharges}`,
            icon: 'ti-receipt-2'
        },
        {
            label: 'Jam Menonton',
            value: `${detail.ViewingHoursPerWeek}/minggu`,
            icon: 'ti-device-tv'
        },
        {
            label: 'Durasi Menonton',
            value: `${detail.AverageViewingDuration}m`,
            icon: 'ti-clock'
        },
        {
            label: 'Rating User',
            value: `${detail.UserRating} / 5`,
            icon: 'ti-star'
        },
        {
            label: 'Subscription',
            value: detail.SubscriptionType,
            icon: 'ti-crown'
        },
    ];

    return (

        <div className="flex min-h-screen bg-[#F9FAFB] font-['Plus_Jakarta_Sans',sans-serif] text-[#1F2937]">

            {/* SIDEBAR */}
            <Sidebar></Sidebar>

            {/* MAIN */}
            <main className="flex-grow flex flex-col">

                {/* HEADER */}
                <Header formData={user} profileImg={user?.avatar} />

                {/* CONTENT */}
                <div className="p-10 grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-[1600px]">

                    {/* LEFT */}
                    <div className="lg:col-span-8 space-y-6">

                        <div>

                            <h1 className="text-xl font-semibold">
                                Detail Customer Insight
                            </h1>

                            <div className="flex items-center gap-2 mt-1">

                                <span
                                    onClick={() => navigate('/DashboardUser')}
                                    className="text-[11px] text-gray-400 cursor-pointer hover:text-[#D82F5A]"
                                >
                                    Dashboard
                                </span>

                                <i className="ti ti-chevron-right text-[10px] text-gray-300"></i>

                                <span className="text-xs text-[#D82F5A]">
                                    Customer Insight
                                </span>

                            </div>

                        </div>

                        {/* TOP BOX */}
                        <div className="bg-white p-10 rounded-[4px] border border-gray-100 shadow-sm flex flex-col md:flex-row gap-12 items-center relative overflow-hidden">

                            {/* left accent line */}
                            <div className="absolute top-0 left-0 w-1.5 h-full bg-[#D82F5A]"></div>

                            {/* CIRCULAR PROGRESS */}
                            <div className="relative w-48 h-48 flex items-center justify-center">

                                <svg className="w-48 h-48 transform -rotate-90">

                                    {/* background circle */}
                                    <circle
                                        cx="96"
                                        cy="96"
                                        r="80"
                                        stroke="#e5e7eb"
                                        strokeWidth="14"
                                        fill="none"
                                    />

                                    {/* progress circle */}
                                    <circle
                                        cx="96"
                                        cy="96"
                                        r="80"
                                        stroke="#D82F5A"
                                        strokeWidth="14"
                                        fill="none"
                                        strokeLinecap="round"
                                        strokeDasharray={2 * Math.PI * 80}
                                        strokeDashoffset={
                                            2 * Math.PI * 80 * (1 - detail.Score / 100)
                                        }
                                        className="transition-all duration-500"
                                    />
                                </svg>

                                {/* center text */}
                                <div className="absolute text-center">
                                    <p className="text-sm text-gray-400 mb-2">
                                        Probabilitas
                                    </p>

                                    <p className="text-4xl font-semibold text-gray-900">
                                        {detail.Score}%
                                    </p>
                                </div>

                            </div>

                            {/* RIGHT SIDE INFO */}
                            <div className="grid grid-cols-2 gap-x-16 gap-y-8 flex-grow">

                                <div>
                                    <p className="text-xs text-gray-400 mb-1">
                                        Customer ID
                                    </p>
                                    <p className="text-sm font-semibold">
                                        {detail.CustomerID}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-xs text-gray-400 mb-1">
                                        Usia Akun
                                    </p>
                                    <p className="text-sm font-semibold">
                                        {detail.AccountAge} Bulan
                                    </p>
                                </div>

                                <div>
                                    <p className="text-base font-semibold text-[#D82F5A] mb-1">
                                        Churn Score
                                    </p>
                                    <p className="text-base font-semibold text-[#D82F5A]">
                                        {detail.Score}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-xs text-gray-400 mb-1">
                                        Prediksi
                                    </p>
                                    <p className="text-sm font-semibold">
                                        {detail.Prediction === 1 ? "Churn" : "Non-Churn"}
                                    </p>
                                </div>

                            </div>

                        </div>

                        {/* STATS */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">

                            {
                                stats.map((s, i) => (

                                    <div
                                        key={i}
                                        className="bg-white p-5 rounded-[4px] border border-gray-100 shadow-sm"
                                    >

                                        <div className="flex items-center gap-2 mb-2 text-gray-400">

                                            <i className={`ti ${s.icon} text-lg text-[#D82F5A]`}></i>

                                            <p className="text-xs">
                                                {s.label}
                                            </p>

                                        </div>

                                        <p className="text-xs font-semibold text-gray-800">
                                            {s.value}
                                        </p>

                                    </div>

                                ))
                            }

                        </div>

                    </div>

                    {/* RIGHT */}
                    <div className="lg:col-span-4 flex flex-col space-y-6">

                        <div className="bg-white rounded-[4px] border border-gray-100 shadow-sm overflow-hidden">

                            <div className="bg-gray-50 p-5 border-b border-gray-100 flex items-center gap-3">

                                <div className="w-8 h-8 bg-black rounded-[4px] flex items-center justify-center text-white">
                                    <i className="ti ti-messages text-lg"></i>
                                </div>

                                <div>
                                    <h2 className="font-semibold text-sm">
                                        Communication Center
                                    </h2>

                                    <p className="text-xs text-gray-400">
                                        Interaksi langsung pelanggan
                                    </p>
                                </div>

                            </div>

                            <div className="p-6 space-y-5">

                                {/* CHAT */}
                                <div>

                                    <label className="text-xs text-gray-400 flex items-center gap-2 mb-2">
                                        <i className="ti ti-message-2 text-[#D82F5A]"></i>
                                        Kirim Chat
                                    </label>

                                    <textarea
                                        value={chatMessage}
                                        onChange={(e) => setChatMessage(e.target.value)}
                                        placeholder="Tulis pesan..."
                                        className="w-full bg-gray-50 border border-gray-100 rounded-[4px] p-4 text-xs h-28 outline-none"
                                    />
                                    <div className="flex gap-3 mt-3">
                                        <button
                                            disabled={disableButton}
                                            onClick={handleSendChat}
                                            className={`
      flex-1 py-2.5 rounded-[4px] text-xs font-medium text-white transition-all duration-200
      ${disableButton
                                                    ? "bg-gray-300 cursor-not-allowed"
                                                    : "bg-[#D82F5A] hover:bg-[#bb244a] active:scale-[0.98]"
                                                }
    `}
                                        >
                                            Kirim pesan
                                        </button>

                                        <button
                                            onClick={() => {
                                                const previewWindow = window.open("", "_blank");
                                                previewWindow.document.write(chatMessage);
                                                previewWindow.document.close();
                                            }}
                                            className="flex-1 bg-[#1A1A1A] hover:bg-black text-white text-xs font-medium py-2.5 rounded-[4px] transition-all duration-200 active:scale-[0.98]"
                                        >
                                            Lihat pesan
                                        </button>
                                    </div>

                                </div>

                                <div className="border-t"></div>

                                {/* EMAIL */}
                                <div>

                                    <label className="text-xs text-gray-400 flex items-center gap-2 mb-2">
                                        <i className="ti ti-mail-fast text-[#D82F5A]"></i>
                                        Generated Email
                                    </label>

                                    <div className="bg-gray-50 border rounded-[4px] p-4 min-h-[200px] max-h-[250px] overflow-auto">

                                        {
                                            emailMessage ? (

                                                <div
                                                    dangerouslySetInnerHTML={{
                                                        __html: emailMessage
                                                    }}
                                                />

                                            ) : (

                                                <p className="text-xs text-gray-400">
                                                    Generated email preview...
                                                </p>

                                            )
                                        }

                                    </div>

                                    <div className="flex gap-3 mt-4">

                                        <button
                                            disabled={disableButton}
                                            onClick={() => setShowPopup(true)}
                                            className={`
                                            w-full py-2.5 rounded-[4px] text-xs text-white transition-all
                                            ${disableButton
                                                    ? "bg-gray-400 cursor-not-allowed"
                                                    : "bg-[#D82F5A] hover:bg-[#bb244a]"
                                                }
    `}
                                        >
                                            Generate Email
                                        </button>

                                        <button
                                            disabled={disableButton}
                                            onClick={() => {

                                                const previewWindow = window.open("", "_blank");

                                                previewWindow.document.write(emailMessage);

                                                previewWindow.document.close();

                                            }}
                                            className={`
                                            w-full py-2 rounded-[4px] text-xs text-white transition-all
                                            ${disableButton
                                                    ? "bg-gray-400 cursor-not-allowed"
                                                    : "bg-black hover:bg-[#bb244a]"
                                                }
    `}
                                        >
                                            Preview
                                        </button>

                                    </div>

                                </div>

                            </div>

                        </div>

                    </div>

                </div>

            </main>

            {/* POPUP */}
            {
                showPopup && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-6">
                        {/* max-h-[90vh] biar ga nempel atas bawah, flex-col biar layoutnya bener */}
                        <div className="bg-white w-full max-w-md rounded-[4px] shadow-2xl overflow-hidden border flex flex-col max-h-[90vh]">

                            {/* HEADER - Judul & Subjudul lebih santai */}
                            <div className="p-5 border-b bg-white flex justify-between items-start">
                                <div>
                                    <h3 className="text-lg font-semibold text-[#1A1A1A]">Atur penawaran promo</h3>
                                    <p className="text-xs text-gray-500 mt-1 font-medium">Sesuaikan hadiah yang pas buat tipe pengguna ini.</p>
                                </div>
                                <button
                                    onClick={() => setShowPopup(false)}
                                    className="text-gray-400 hover:text-black transition-colors p-1"
                                >
                                    <i className="ti ti-x text-xl"></i>
                                </button>
                            </div>

                            {/* CONTENT AREA - Bisa di-scroll */}
                            <div className="p-8 space-y-6 overflow-y-auto custom-scrollbar">

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
                                            Tingkat risiko
                                        </label>
                                        <div className="bg-gray-50 border rounded-[4px] p-3 text-xs font-semibold text-orange-500 mt-1">
                                            {detail.Risk}
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
                                            Kelompok pengguna
                                        </label>
                                        <div className="bg-gray-50 border rounded-[4px] p-3 text-xs mt-1 font-medium text-[#1A1A1A]">
                                            {detail.Segment}
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
                                        Saran langkah selanjutnya
                                    </label>
                                    <textarea
                                        readOnly
                                        value={getRetentionRecommendation()}
                                        className="w-full bg-gray-50 border rounded-[4px] p-3 text-xs h-24 mt-1 font-medium text-[#757575] resize-none outline-none"
                                    />
                                </div>

                                {/* Form Input Section */}
                                <div className="space-y-4 bg-gray-50 p-5 rounded-[4px] border border-gray-200">
                                    <div>
                                        <label className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
                                            Nama promo
                                        </label>
                                        <input
                                            type="text"
                                            value={promoName}
                                            onChange={(e) => setPromoName(e.target.value)}
                                            placeholder="Contoh: Promo kangen nonton"
                                            className="w-full border border-gray-200 rounded-[4px] p-3 text-xs mt-1 font-medium outline-none focus:border-[#D82F5A] transition-all"
                                        />
                                    </div>

                                    <div>
                                        <label className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
                                            Besar diskon (%)
                                        </label>
                                        <input
                                            type="number"
                                            value={promoDiscount}
                                            onChange={(e) => setPromoDiscount(e.target.value)}
                                            placeholder="0"
                                            className="w-full border border-gray-200 rounded-[4px] p-3 text-xs mt-1 font-medium outline-none focus:border-[#D82F5A] transition-all"
                                        />
                                    </div>

                                    <div>
                                        <label className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
                                            Batas waktu (Expired)
                                        </label>
                                        <input
                                            type="date"
                                            value={expiredDate}
                                            onChange={(e) => setExpiredDate(e.target.value)}
                                            className="w-full border border-gray-200 rounded-[4px] p-3 text-xs mt-1 font-medium outline-none focus:border-[#D82F5A] transition-all"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* FOOTER - Button Sejajar & Clean */}
                            {/* CONTAINER TOMBOL */}
                            <div className="p-6 bg-white border-t flex gap-3 font-['Plus_Jakarta_Sans',sans-serif]">
                                <button
                                    type="button"
                                    disabled={loadingPromo}
                                    onClick={() => setShowPopup(false)}
                                    className="flex-1 py-3 border border-gray-200 text-gray-600 font-medium rounded-[4px] text-sm hover:bg-gray-50 transition-all active:scale-[0.98] disabled:opacity-50"
                                >
                                    Batal
                                </button>

                                <button
                                    type="button"
                                    disabled={loadingPromo}
                                    onClick={handleGenerateEmail}
                                    className="flex-1 py-3 bg-[#1A1A1A] hover:bg-black text-white font-medium rounded-[4px] text-sm transition-all active:scale-[0.98] shadow-md disabled:bg-zinc-700"
                                >
                                    Buat pesan promo
                                </button>
                            </div>

                            {/* CUKUP POP-UP LOADING INI AJA */}
                            {loadingPromo && (
                                <div className="fixed inset-0 bg-slate-900/40 z-[9999] flex items-center justify-center animate-in fade-in duration-300 backdrop-blur-sm">
                                    <div className="bg-white p-6 rounded-[4px] shadow-[0_20px_50px_rgba(0,0,0,0.1)] flex flex-col items-center gap-3 max-w-xs w-full text-center border border-slate-50 scale-100 animate-in zoom-in-95 duration-300">
                                        {/* Spinner Bulat Pink Tua */}
                                        <div className="animate-spin h-8 w-8 border-4 border-[#D82F5A] border-t-transparent rounded-full"></div>

                                        <div className="space-y-1">
                                            <p className="text-sm font-bold text-slate-800 font-['Plus_Jakarta_Sans',sans-serif]">
                                                Menulis Pesan Promo
                                            </p>
                                            <p className="text-xs text-slate-400 font-medium font-['Plus_Jakarta_Sans',sans-serif] leading-relaxed">
                                                AI sedang menyusun penawaran terbaik berdasarkan preferensi pelanggan...
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}

                        </div>
                    </div>
                )
            }
        </div>
    );
}