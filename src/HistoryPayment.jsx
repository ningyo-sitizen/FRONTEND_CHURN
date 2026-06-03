import React, { useState, useEffect } from 'react';
import { FileText, CreditCard, CheckCircle2, XCircle, Download, Printer, X, Filter, ArrowUpRight, ArrowLeft } from 'lucide-react';
import Sidebar from './SideBar.jsx';
import Header from './Header.jsx';
import Footer from './Footer';
import { useAuth } from '../utils/auth.js';
import { useLocation, useNavigate } from "react-router-dom";

const HistoryPayment = () => {

    const [payment, setpayment] = useState([])
    const [sum, setsum] = useState()
    const [success, setsuccess] = useState()
    const navigate = useNavigate();
    const user = useAuth()
    const [selectedInvoice, setSelectedInvoice] = useState(null);
    const fetchhistorypayment = async () => {
        try {
            console.log("kiana")

            const token = localStorage.getItem("token");

            const response = await fetch(
                `${import.meta.env.VITE_BACKEND_URL}/auth/paymenthistory`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    }
                }
            );

            const data = await response.json();

            setpayment(data.data)
            setsum(data.sum)
            setsuccess(data.success)

            console.log(data);
        } catch (err) {
            console.log(err);
        }
    }
    useEffect(() => {
        fetchhistorypayment()
    }, []);
    const paymentData = [
        { id: "INV-2026-001", packageName: "Insight Enthusiast", memberName: "Budi Setiawan", purchaseDate: "13 Mei 2026", expiryDate: "13 Mei 2027", method: "GoPay", amount: "Rp 1.250.000", status: "Success" },
    ];

    return (
        <div className="flex min-h-screen bg-[#F9FAFB] font-['Plus_Jakarta_Sans',sans-serif] text-[#111827]">
            <Sidebar />

            {/* KONTROLLER UTAMA: Menjaga fleksibilitas ruang sisa layar */}
            <div className="flex-1 flex flex-col min-w-0">
                
                {/* FIX HEADER ANTI-MEPET: w-0 min-w-full mengunci lebar, relative mengamankan posisi dropdown absolut */}
                <div className="relative w-0 min-w-full shrink-0 pr-4">
                    <Header formData={user} profileImg={user?.avatar} />
                </div>

                <main className="p-8 flex-1">

                    {/* Main Header Section */}
                    <div className="mb-8">
                        <h1 className="text-xl font-semibold tracking-tight">History Pembayaran</h1>
                        <div className="flex items-center gap-2 mt-1 transition-all">
                            {/* Link Dashboard - Bisa di klik */}
                            <span
                                onClick={() => navigate('/profile')}
                                className="text-xs text-gray-400  cursor-pointer hover:text-[#D82F5A] transition-colors"
                            >
                                Profile
                            </span>

                            {/* Icon Next / Chevron */}
                            <i className="ti ti-chevron-right text-sm text-gray-300"></i>

                            {/* Current Page */}
                            <span className="text-xs text-[#D82F5A] ">
                                Informasi Member
                            </span>
                        </div>
                    </div>

                    {/* Statistik Ringkas Area - SETIAP CARD WARNA BEDA & TETEP ROUNDED 4PX */}
                    <div className="grid grid-cols-4 gap-6 mb-10">
                        {[
                            { label: "Total Pengeluaran", value: sum, color: "bg-[#111827]", text: "text-white" },
                            { label: "Transaksi Berhasil", value: success, color: "bg-[#F0FDF4] border-emerald-100", text: "text-emerald-800" },
                            { label: "Status Langganan", value: user?.member, color: "bg-[#FFFBEB] border-amber-100", text: "text-amber-800" },
                            { label: "Paket Langganan", value: user?.member_plan, color: "bg-[#FEF5F6] border-rose-100", text: "text-[#D82F5A]" },
                        ].map((stat, i) => (
                            <div key={i} className={`${stat.color} border border-gray-100 p-6 rounded-[4px] shadow-sm relative`}>
                                <p className={`text-[11px] font-medium uppercase tracking-wider mb-2 ${stat.text} opacity-70`}>{stat.label}</p>
                                <h3 className={`text-xl font-semibold ${stat.text}`}>{stat.value}</h3>
                            </div>
                        ))}
                    </div>

                    {/* Kontrol Tabel Header - EXPORT DAN FILTER SUDAH DIAPUS */}
                    <div className="flex justify-between items-center mb-4">
                        <div className="flex items-center gap-4">
                            <h2 className="text-[15px] font-semibold">Daftar Transaksi</h2>
                            <span className="bg-gray-100 text-gray-500 text-[10px] px-2 py-0.5 rounded-[2px] font-medium uppercase tracking-tight"></span>
                        </div>
                    </div>

                    {/* Table Container - STRUKTUR 100% ASLI & ROUNDED 4PX */}
                    <div className="bg-white border border-gray-100 rounded-[4px] shadow-sm overflow-hidden">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-gray-50/50 border-b border-gray-100">
                                    <th className="px-6 py-4 text-xs font-medium text-gray-400 text-center">No.</th>
                                    <th className="px-6 py-4 text-xs font-medium text-gray-400 ">Detail Paket</th>
                                    <th className="px-6 py-4 text-xs font-medium text-gray-400 ">Email</th>
                                    <th className="px-6 py-4 text-xs font-medium text-gray-400 ">Waktu Pembayaran</th>
                                    <th className="px-6 py-4 text-xs font-medium text-gray-400 ">Total</th>
                                    <th className="px-6 py-4 text-xs font-medium text-gray-400  text-center">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {payment?.map((item, index) => (
                                    <tr key={item.order_id} className="group hover:bg-[#FEF5F6]/20 transition-all">
                                        <td className="px-6 py-5 text-center text-[12px] text-gray-400 font-medium">
                                            {String(index + 1).padStart(2, '0')}
                                        </td>
                                        <td className="px-6 py-5">
                                            <p className="text-[13px] font-semibold mb-0.5">{item.plan}</p>
                                            <p className="text-[11px] text-gray-400 font-medium">ID: {item.order_id}</p>
                                        </td>
                                        <td className="px-6 py-5">
                                            <p className="text-[11px] text-gray-400 font-medium">{item.email}</p>
                                        </td>
                                        <td className="px-6 py-5">
                                            <p className="text-[13px] text-gray-600 font-medium">{new Date(item.created_at).toLocaleDateString("id-ID")}</p>
                                            <p className="text-[11px] text-[#D82F5A] font-medium">{item.status}</p>
                                        </td>
                                        <td className="px-6 py-5">
                                            <p className="text-[13px] font-semibold mb-0.5">{item.price}</p>
                                            <p className="text-[11px] text-gray-400 flex items-center gap-1 font-medium">
                                                <CreditCard size={12} className="opacity-60" /> {item.payment_method}
                                            </p>
                                        </td>
                                        <td className="px-6 py-5 text-center">
                                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-[4px] text-[10px] font-semibold uppercase tracking-tight ${item.status === 'success' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-gray-50 text-gray-400 border border-gray-100'
                                                }`}>
                                                {item.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </main>

                {/* MODAL INVOICE - ASLI & ROUNDED 4PX */}
                {selectedInvoice && (
                    <div className="fixed inset-0 bg-[#111827]/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                        <div className="bg-white w-full max-w-[380px] rounded-[4px] shadow-2xl overflow-hidden border border-gray-100">
                            <div className="p-8">
                                <div className="flex justify-between items-start mb-6">
                                    <div className="bg-[#D82F5A] p-2 rounded-[4px]">
                                        <FileText className="text-white" size={20} />
                                    </div>
                                    <button onClick={() => setSelectedInvoice(null)} className="p-1 hover:bg-gray-100 rounded-[4px] transition-all">
                                        <X size={18} className="text-gray-400" />
                                    </button>
                                </div>

                                <h2 className="text-xl font-semibold tracking-tight mb-1">Invoice Tagihan</h2>
                                <p className="text-[12px] text-gray-400 mb-8 font-medium italic">{selectedInvoice.id}</p>

                                <div className="space-y-4 mb-8">
                                    <div className="flex justify-between py-2 border-b border-gray-50">
                                        <span className="text-[11px] font-medium text-gray-400 uppercase tracking-widest">Layanan</span>
                                        <span className="text-[12px] font-semibold">{selectedInvoice.packageName}</span>
                                    </div>
                                    <div className="flex justify-between py-2 border-b border-gray-50">
                                        <span className="text-[11px] font-medium text-gray-400 uppercase tracking-widest">Metode Bayar</span>
                                        <span className="text-[12px] font-semibold">{selectedInvoice.method}</span>
                                    </div>
                                    <div className="flex justify-between py-2 border-b border-gray-50">
                                        <span className="text-[11px] font-medium text-gray-400 uppercase tracking-widest">Tanggal</span>
                                        <span className="text-[12px] font-semibold">{selectedInvoice.purchaseDate}</span>
                                    </div>
                                </div>

                                <div className="bg-[#111827] p-5 rounded-[4px] mb-8 shadow-inner border border-white/5">
                                    <p className="text-gray-400 text-[9px] uppercase font-semibold tracking-[2px] mb-1">Total Transaksi</p>
                                    <p className="text-2xl font-semibold text-white">{selectedInvoice.amount}</p>
                                </div>

                                <button className="w-full bg-[#D82F5A] text-white py-3 rounded-[4px] text-[12px] font-semibold hover:bg-[#b0264a] transition-all flex items-center justify-center gap-2">
                                    <Printer size={14} /> Cetak Invoice
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* FOOTER - Diletakkan di sini agar nempel di bawah konten utama */}
                <Footer />
            </div>
        </div>
    );
};

export default HistoryPayment;