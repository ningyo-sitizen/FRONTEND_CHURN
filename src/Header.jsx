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
        setShowLogoutModal(false);
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
            <header className="h-20 bg-white/80 backdrop-blur-md border-b border-gray-100 flex items-center justify-end px-10 sticky top-0 z-[50]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>

                {/* Sisi Kanan - Actions (Tetap sesuai design asli kamu) */}
                <div className="flex items-center gap-4">
                    <Link to={`/` + memberTo} className="relative group block mr-2">
                        <div className="flex items-center gap-2.5 px-3 py-1.5 bg-gradient-to-r from-amber-50 to-orange-50/50 rounded-[4px] border border-amber-200/60 hover:border-amber-400 hover:shadow-sm transition-all duration-300">
                            {/* Lingkaran Ikon Mahkota */}
                            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-500 text-white shadow-sm group-hover:scale-105 transition-transform">
                                <Crown size={12} strokeWidth={2.5} fill="currentColor" />
                            </div>

                            {/* Detail Status */}
                            <div className="flex flex-col text-left">
                                <span className="text-[10px] font-medium text-amber-600 leading-none">
                                    Member Status
                                </span>
                                <span className="text-xs font-semibold text-amber-900 capitalize mt-0.5">
                                    {formData?.member || "Regular"}
                                </span>
                            </div>
                        </div>
                    </Link>

                    <div className="relative border-l border-gray-100 pl-6">
                        <div className="flex items-center gap-3 cursor-pointer group" onClick={() => setIsOpen(!isOpen)}>
                            <div className="w-10 h-10 rounded-xl overflow-hidden bg-gray-100 ring-1 ring-gray-100 shadow-sm">
                                <img src={profileImg} alt="avatar" className="w-full h-full object-cover" />
                            </div>
                            <div className="flex flex-col text-left mr-2">
                                <p className="text-[13px] font-semibold text-[#1a1a1a] leading-tight">Hai, {formData?.name?.split(' ')[0]}</p>
                                <p className="text-[11px] text-rose-500 leading-tight">{formData?.email}</p>
                            </div>
                            <ChevronDown size={16} className={`text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                        </div>

                        {isOpen && (
                            <>
                                <div className="fixed inset-0 z-[-1]" onClick={() => setIsOpen(false)}></div>
                                <div className="absolute right-0 mt-4 w-72 bg-white rounded-[4px] shadow-[0px_10px_40px_rgba(0,0,0,0.08)] border border-gray-100 overflow-hidden z-50">
                                    <div className="p-5 flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-xl overflow-hidden bg-gray-100">
                                            <img src={profileImg} alt="profile" className="w-full h-full object-cover" />
                                        </div>
                                        <div className="flex flex-col text-left leading-tight">
                                            <p className="text-sm font-semibold text-[#111827]">{formData?.name}</p>
                                            <p className="text-xs text-[#D82F5A] font-small tracking-wider">{formData?.email}</p>
                                        </div>
                                    </div>
                                    <div className="border-b border-gray-100 mx-5"></div>
                                    <div className="p-2">
                                        <Link to="/profile" onClick={() => setIsOpen(false)} className="flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-[#FEF5F6] text-[#E2A7B8] hover:text-[#D82F5A] transition-all no-underline">
                                            <UserCircle size={22} strokeWidth={1.5} />
                                            <span className="text-[13px] font-semibold">Profile</span>
                                        </Link>
                                        <button
                                            onClick={() => { setIsOpen(false); setShowLogoutModal(true); }}
                                            className="w-full flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-[#FEF5F6] text-[#E2A7B8] hover:text-red-600 transition-all border-none bg-transparent cursor-pointer"
                                        >
                                            <LogOut size={22} strokeWidth={1.5} />
                                            <span className="text-[13px] font-semibold">Keluar</span>
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
                    <div className="bg-white w-full max-w-[340px] rounded-[4px] shadow-xl border border-gray-100 p-8 text-center animate-in fade-in zoom-in duration-200">

                        {/* Icon Only */}
                        <div className="text-[#D82F5A] mb-4 flex justify-center">
                            <AlertCircle size={40} strokeWidth={1.5} />
                        </div>

                        <h2 className="text-lg font-semibold text-[#111827] mb-2 tracking-tight">Konfirmasi Keluar</h2>
                        <p className="text-[13px] text-gray-400 font-medium mb-8">Apakah anda yakin ingin mengakhiri sesi ini?</p>

                        <div className="flex flex-col gap-2">
                            <button
                                onClick={handleLogout}
                                className="w-full bg-[#111827] text-white py-3 rounded-[4px] text-[12px] font-semibold hover:bg-black transition-all"
                            >
                                Keluar Aplikasi
                            </button>
                            <button
                                onClick={() => setShowLogoutModal(false)}
                                className="w-full bg-white text-gray-400 py-3 rounded-[4px] text-[12px] font-semibold hover:text-[#111827] transition-all"
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