import React, { useState, useEffect } from 'react';
import { Crown, ChevronDown, UserCircle, LogOut, AlertCircle, X } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const Header = ({ formData, profileImg }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const navigate = useNavigate();
    const [memberTo, setMemberTo] = useState("");

    const handleLogout = () => {
        localStorage.removeItem("token");
        setShowLogoutModal(false);
        navigate('/login');
    };

    useEffect(() => {
        if (formData?.member === 'active') {
            setMemberTo("profile");
        } else {
            setMemberTo("member");
        }
    }, [formData]);

    return (
        <>
            {/* Header: Padding dinamis (px-4 di HP, px-10 di Desktop) */}
            <header className="h-20 bg-white/80 backdrop-blur-md border-b border-gray-100 flex items-center justify-between md:justify-end px-4 md:px-10 sticky top-0 z-[50]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                
                {/* Judul/Brand kiri hanya muncul di HP supaya tidak kosong */}
                <div className="block md:hidden">
                    <span className="font-bold text-sm text-[#111827] tracking-tight">
                        ChurnGuard <span className="text-[#D82F5A]">CRM</span>
                    </span>
                </div>

                {/* Sisi Kanan - Actions (Tetap sejajar horizontal di HP & Desktop) */}
                <div className="flex items-center gap-2.5 md:gap-4">
                    
                    {/* STATUS MEMBER */}
                    <Link to={`/` + memberTo} className="relative group block">
                        <div className="flex items-center gap-1.5 md:gap-2.5 px-2 md:px-3 py-1.5 bg-gradient-to-r from-amber-50 to-orange-50/50 rounded-[4px] border border-amber-200/60 hover:border-amber-400 hover:shadow-sm transition-all duration-300">
                            {/* Lingkaran Ikon Mahkota */}
                            <div className="flex h-5 w-5 md:h-6 md:w-6 flex-shrink-0 items-center justify-center rounded-full bg-amber-500 text-white shadow-sm group-hover:scale-105 transition-transform">
                                <Crown size={10} className="md:w-3 md:h-3" strokeWidth={2.5} fill="currentColor" />
                            </div>

                            {/* Detail Status: Teks dikecilkan di HP agar muat satu baris */}
                            <div className="flex flex-col text-left">
                                <span className="text-[8px] md:text-[10px] font-medium text-amber-600 leading-none">
                                    Status
                                </span>
                                <span className="text-[10px] md:text-xs font-semibold text-amber-900 capitalize mt-0.5">
                                    {formData?.member || "Regular"}
                                </span>
                            </div>
                        </div>
                    </Link>

                    {/* MENU DROPDOWN PROFIL */}
                    <div className="relative border-l border-gray-100 pl-2.5 md:pl-6">
                        <div className="flex items-center gap-2 md:gap-3 cursor-pointer group" onClick={() => setIsOpen(!isOpen)}>
                            {/* Foto Profil */}
                            <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl overflow-hidden bg-gray-100 ring-1 ring-gray-100 shadow-sm flex-shrink-0">
                                <img src={profileImg} alt="avatar" className="w-full h-full object-cover" />
                            </div>
                            
                            {/* Nama & Email (Disembunyikan di HP sangat kecil jika space habis, atau dibuat ringkas) */}
                            <div className="hidden sm:flex flex-col text-left mr-1 md:mr-2">
                                <p className="text-[12px] md:text-[13px] font-semibold text-[#1a1a1a] leading-tight">
                                    Hai, {formData?.name?.split(' ')[0]}
                                </p>
                                <p className="text-[10px] md:text-[11px] text-rose-500 leading-tight truncate max-w-[100px] md:max-w-none">
                                    {formData?.email}
                                </p>
                            </div>
                            <ChevronDown size={14} className={`text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                        </div>

                        {/* Dropdown Menu Box */}
                        {isOpen && (
                            <>
                                <div className="fixed inset-0 z-[-1]" onClick={() => setIsOpen(false)}></div>
                                {/* right-0 memastikan modal box tidak keluar dari layar HP */}
                                <div className="absolute right-0 mt-4 w-64 md:w-72 bg-white rounded-[4px] shadow-[0px_10px_40px_rgba(0,0,0,0.08)] border border-gray-100 overflow-hidden z-50">
                                    <div className="p-4 md:p-5 flex items-center gap-3 md:gap-4">
                                        <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                                            <img src={profileImg} alt="profile" className="w-full h-full object-cover" />
                                        </div>
                                        <div className="flex flex-col text-left leading-tight overflow-hidden">
                                            <p className="text-xs md:text-sm font-semibold text-[#111827] truncate">{formData?.name}</p>
                                            <p className="text-[10px] md:text-xs text-[#D82F5A] font-small tracking-wider truncate">{formData?.email}</p>
                                        </div>
                                    </div>
                                    <div className="border-b border-gray-100 mx-4 md:mx-5"></div>
                                    <div className="p-2">
                                        <Link to="/profile" onClick={() => setIsOpen(false)} className="flex items-center gap-3 md:gap-4 px-4 py-2.5 md:py-3 rounded-xl hover:bg-[#FEF5F6] text-[#E2A7B8] hover:text-[#D82F5A] transition-all no-underline">
                                            <UserCircle size={20} strokeWidth={1.5} />
                                            <span className="text-[12px] md:text-[13px] font-semibold">Profile</span>
                                        </Link>
                                        <button
                                            onClick={() => { setIsOpen(false); setShowLogoutModal(true); }}
                                            className="w-full flex items-center gap-3 md:gap-4 px-4 py-2.5 md:py-3 rounded-xl hover:bg-[#FEF5F6] text-[#E2A7B8] hover:text-red-600 transition-all border-none bg-transparent cursor-pointer"
                                        >
                                            <LogOut size={20} strokeWidth={1.5} />
                                            <span className="text-[12px] md:text-[13px] font-semibold">Keluar</span>
                                        </button>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </header>

            {/* SIMPLE CLEAN LOGOUT MODAL */}
            {showLogoutModal && (
                <div className="fixed inset-0 bg-[#111827]/30 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
                    <div className="bg-white w-full max-w-[320px] md:w-full md:max-w-[340px] rounded-[4px] shadow-xl border border-gray-100 p-6 md:p-8 text-center animate-in fade-in zoom-in duration-200">
                        <div className="text-[#D82F5A] mb-3 md:mb-4 flex justify-center">
                            <AlertCircle size={36} md:size={40} strokeWidth={1.5} />
                        </div>

                        <h2 className="text-base md:text-lg font-semibold text-[#111827] mb-1.5 md:mb-2 tracking-tight">Konfirmasi Keluar</h2>
                        <p className="text-[12px] md:text-[13px] text-gray-400 font-medium mb-6 md:mb-8">Apakah anda yakin ingin mengakhiri sesi ini?</p>

                        <div className="flex flex-col gap-2">
                            <button
                                onClick={handleLogout}
                                className="w-full bg-[#111827] text-white py-2.5 md:py-3 rounded-[4px] text-[11px] md:text-[12px] font-semibold hover:bg-black transition-all"
                            >
                                Keluar Aplikasi
                            </button>
                            <button
                                onClick={() => setShowLogoutModal(false)}
                                className="w-full bg-white text-gray-400 py-2.5 md:py-3 rounded-[4px] text-[11px] md:text-[12px] font-semibold hover:text-[#111827] transition-all"
                            >
                                Batal
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Header;