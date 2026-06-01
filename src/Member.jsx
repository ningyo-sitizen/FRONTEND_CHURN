import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import { useAuth } from '../utils/auth';
import axios from 'axios';
import Footer from './Footer';

const Member = () => {
    const user = useAuth();
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [loading, setLoading] = useState(false);
    const [tiersLoading, setTiersLoading] = useState(true);
    const [tiersError, setTiersError] = useState(null);
    const [pricingPlans, setPricingPlans] = useState([]);
    const navigate = useNavigate();

    // ─── Fetch tiers dari backend ────────────────────────────────────────────────
    useEffect(() => {
        const fetchTiers = async () => {
            // Hanya tampilkan loading skeleton saat pertama kali load
            if (pricingPlans.length === 0) setTiersLoading(true);
            setTiersError(null);
    
            try {
                const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/tier`);
    
                const tiers = Array.isArray(res.data)
                    ? res.data
                    : Array.isArray(res.data.data)
                    ? res.data.data
                    : [];
    
                const mapped = tiers.map((tier, index) => ({
                    id: tier.id,
                    title: tier.title,
                    price:
                        tier.price === 0
                            ? "Free"
                            : `Rp ${Number(tier.price).toLocaleString("id-ID")}`,
                    rawPrice: tier.price,
                    period: tier.price === 0 ? "Selamanya" : "per bulan",
                    description: tier.description ?? "",
                    features: Array.isArray(tier.descriptions)
                        ? tier.descriptions
                        : [],
                    isBestSeller: index === 1,
                }));
    
                setPricingPlans(mapped);
    
                // Jaga selectedPlan tetap valid jika title berubah
                setSelectedPlan(prev => {
                    const stillExists = mapped.find(
                        p => p.title.toLowerCase() === prev?.toLowerCase()
                    );
                    if (stillExists) return prev; // tidak berubah
                    return mapped[1]?.title ?? mapped[0]?.title ?? null;
                });
    
            } catch (err) {
                console.error("Gagal memuat data tier:", err);
                setTiersError("Gagal memuat paket harga. Silakan coba lagi.");
            } finally {
                setTiersLoading(false);
            }
        };
    
        // Fetch pertama kali
        fetchTiers();
    
        // Polling setiap 30 detik
        const interval = setInterval(fetchTiers, 30_000);
    
        // Cleanup saat komponen unmount
        return () => clearInterval(interval);
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    // ─── Handle klik tombol bayar / pilih paket ──────────────────────────────────
    const handleSubscription = async (plan) => {
        setLoading(true);
        try {
            navigate('/memberPayment', { state: { chosenPlan: plan } });
        } catch (error) {
            console.error('Gagal menghubungkan ke backend:', error);
            alert('Terjadi kesalahan sistem, coba lagi nanti.');
        } finally {
            setLoading(false);
        }
    };

    // ─── Render ──────────────────────────────────────────────────────────────────
    return (
        <div className="min-h-screen bg-[#F9FAFB] font-['Plus_Jakarta_Sans',sans-serif] text-[#0F172A] flex flex-col relative overflow-x-hidden">

            {/* NAVBAR */}
            <div className="relative z-20 bg-white border-b border-slate-100 w-full px-4 sm:px-8 lg:px-12">
                <Header formData={user} profileImg={user?.avatar} />
            </div>

            {/* MAIN CONTENT SPLIT GRID */}
            <main className="flex-1 w-full px-4 sm:px-8 lg:px-12 py-12 lg:py-16 relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center bg-[#F9FAFB]">

                {/* LEFT COLUMN: HERO */}
                <div className="lg:col-span-5 space-y-6 flex flex-col items-start text-left">
                    <div className="space-y-4">
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-[#D82F5A]/15 text-[#D82F5A] text-[11px] font-semibold bg-[#FFF1F2] tracking-wider uppercase">
                            <span className="w-1.5 h-1.5 bg-[#D82F5A] rounded-full animate-pulse"></span>
                            Membership Plan 2026
                        </div>

                        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-slate-900 tracking-tight leading-[1.1]">
                            Struktur harga <br className="hidden lg:block" />
                            yang <span className="text-[#D82F5A]">terkurasi.</span>
                        </h1>

                        <p className="text-sm text-slate-500 leading-relaxed max-w-xl mt-8">
                            Gunakan analitik prediktif berbasis AI untuk mengidentifikasi pelanggan yang berisiko pergi sebelum mereka melakukannya. Ambil tindakan tepat waktu dan tingkatkan nilai seumur hidup pelanggan anda.
                        </p>
                    </div>

                    {/* Trust Indicator */}
                    <div className="pt-6 border-t border-slate-200/80 w-full max-w-xs flex items-center gap-4 text-slate-400">
                        <div className="flex -space-x-2">
                            <div className="w-7 h-7 rounded-full bg-slate-200 border-2 border-white flex items-center justify-center text-[9px] font-semibold text-slate-600">AI</div>
                            <div className="w-7 h-7 rounded-full bg-[#FFF1F2] border-2 border-white flex items-center justify-center text-[9px] font-semibold text-[#D82F5A]">CRM</div>
                        </div>
                        <p className="text-[11px] font-semibold tracking-wide uppercase">Terintegrasi Sistem ChurnGuard</p>
                    </div>

                    <button
                        onClick={() => navigate('/dashboardUser')}
                        className="w-full sm:w-auto px-4 py-3 bg-black text-white rounded-[4px] hover:bg-zinc-900 active:scale-[0.99] transition-all text-xs shadow-md flex items-center justify-center gap-2 group mt-5"
                    >
                        <i className="ti ti-arrow-left text-sm group-hover:-translate-x-0.5 transition-transform"></i>
                        Kembali ke dashboard
                    </button>
                </div>

                {/* RIGHT COLUMN: TIER CARDS */}
                <div className="lg:col-span-7 w-full">

                    {/* ── Loading state ── */}
                    {tiersLoading && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {[1, 2].map(i => (
                                <div key={i} className="h-96 rounded-[4px] bg-slate-100 animate-pulse" />
                            ))}
                        </div>
                    )}

                    {/* ── Error state ── */}
                    {!tiersLoading && tiersError && (
                        <div className="flex flex-col items-center justify-center gap-4 py-16 text-center">
                            <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center">
                                <i className="ti ti-alert-circle text-[#D82F5A] text-xl"></i>
                            </div>
                            <p className="text-sm text-slate-500">{tiersError}</p>
                            <button
                                onClick={() => window.location.reload()}
                                className="text-xs px-4 py-2 border border-slate-200 rounded-[4px] hover:bg-slate-50 transition-colors"
                            >
                                Coba Lagi
                            </button>
                        </div>
                    )}

                    {/* ── Tier cards ── */}
                    {!tiersLoading && !tiersError && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
                            {pricingPlans.map((plan, index) => {
                                const isSelected = selectedPlan?.toLowerCase() === plan.title.toLowerCase();
                                const isFree = plan.rawPrice === 0;

                                return (
                                    <motion.div
                                        key={plan.id}
                                        onClick={() => setSelectedPlan(plan.title)}
                                        initial={{ opacity: 0, y: 30 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.1, duration: 0.4 }}
                                        whileHover={{ y: -6, transition: { duration: 0.2 } }}
                                        className={`relative p-6 sm:p-8 bg-white border rounded-[4px] transition-all duration-300 cursor-pointer flex flex-col justify-between h-full group ${
                                            isSelected
                                                ? 'border-[#D82F5A] ring-1 ring-[#D82F5A] shadow-[0_20px_40px_rgba(216,47,90,0.04)]'
                                                : 'border-[#EDEDED] hover:border-slate-300 shadow-[0_4px_12px_rgba(15,23,42,0.015)] hover:shadow-[0_10px_25px_rgba(15,23,42,0.03)]'
                                        }`}
                                    >
                                        {/* Badge Rekomendasi */}
                                        {plan.isBestSeller && (
                                            <div className="absolute -top-3 right-5">
                                                <span className="bg-[#D82F5A] text-white text-[9px] font-semibold px-2.5 py-1 rounded-[4px] shadow-sm tracking-wider uppercase inline-flex items-center gap-1">
                                                    <i className="ti ti-star-filled text-[8px]"></i> Rekomendasi
                                                </span>
                                            </div>
                                        )}

                                        <div>
                                            {/* Title badge */}
                                            <div className="flex items-center justify-between mb-4">
                                                <span className={`text-[10px] font-semibold uppercase tracking-widest px-2.5 py-0.5 rounded-[4px] ${
                                                    isSelected ? 'bg-[#FFF1F2] text-[#D82F5A]' : 'bg-slate-100 text-slate-500'
                                                }`}>
                                                    {plan.title}
                                                </span>
                                            </div>

                                            {/* Harga */}
                                            <div className="space-y-1 mb-4">
                                                <div className="flex items-baseline gap-1">
                                                    <span className="text-3xl font-semibold text-slate-900 tracking-tight">
                                                        {plan.price}
                                                    </span>
                                                    <span className="text-slate-400 text-xs font-semibold">/ {plan.period}</span>
                                                </div>

                                                <div className="h-5 flex items-center gap-2">
                                                    {isFree ? (
                                                        <span className="text-[11px] text-emerald-600 font-medium flex items-center gap-1">
                                                            <i className="ti ti-circle-check-filled text-xs"></i> Full Access
                                                        </span>
                                                    ) : (
                                                        <span className="text-[10px] bg-emerald-50 text-emerald-600 font-semibold px-1.5 py-0.5 rounded-[4px]">
                                                            Berbayar
                                                        </span>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Deskripsi */}
                                            {plan.description ? (
                                                <p className="text-xs text-slate-400 font-medium leading-relaxed mb-6">
                                                    {plan.description}
                                                </p>
                                            ) : (
                                                <div className="mb-6" />
                                            )}

                                            <div className="h-px bg-slate-100 w-full mb-6"></div>

                                            {/* Fitur-fitur */}
                                            <ul className="space-y-3.5 mb-8">
                                                {plan.features.length > 0
                                                    ? plan.features.map((feature, i) => (
                                                        <li key={i} className="flex items-start gap-2.5 text-left">
                                                            <div className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#FFF1F2] text-[#D82F5A] mt-0.5">
                                                                <i className="ti ti-check text-[10px] font-semibold"></i>
                                                            </div>
                                                            <span className="text-xs font-medium text-slate-600 leading-normal">
                                                                {feature}
                                                            </span>
                                                        </li>
                                                    ))
                                                    : (
                                                        <li className="text-xs text-slate-300 italic">Tidak ada fitur yang terdaftar.</li>
                                                    )
                                                }
                                            </ul>
                                        </div>

                                        {/* Tombol aksi */}
                                        <motion.button
                                            whileTap={{ scale: 0.98 }}
                                            disabled={loading}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleSubscription(plan);
                                            }}
                                            className={`w-full py-3.5 rounded-[4px] font-medium text-xs transition-all tracking-wide border ${
                                                isSelected
                                                    ? 'bg-[#D82F5A] border-[#D82F5A] text-white hover:bg-[#b0264a] shadow-md shadow-[#D82F5A]/15'
                                                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300'
                                            } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                        >
                                            {loading ? 'Processing...' : isSelected ? 'Lanjutkan Pembayaran' : 'Pilih Paket Ini'}
                                        </motion.button>
                                    </motion.div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </main>

            {/* FOOTER */}
            <Footer />
        </div>
    );
};

export default Member;