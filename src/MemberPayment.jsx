import React, { useState } from 'react';
import axios from 'axios';
import {
  IconChevronRight,
  IconCreditCard,
  IconShieldCheck,
  IconCircleCheck,
  IconCalendarEvent,
  IconSparkles,
  IconArrowUpRight
} from '@tabler/icons-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from "../utils/auth";
import Header from './Header';
import Footer from './Footer';
import LoadingOverlay from './LoadingOverlay';


const MemberPayment = () => {
  const user = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // ─── Ambil data plan yang dipilih dari Member.jsx ─────────────────────────────
  // Member.jsx sudah kirim: navigate('/memberPayment', { state: { chosenPlan: plan } })
  const chosenPlan = location.state?.chosenPlan;

  // Fallback jika user akses halaman ini langsung tanpa memilih plan
  if (!chosenPlan) {
    return (
      <div className="min-h-screen bg-[#F9FAFB] font-['Plus_Jakarta_Sans',sans-serif] flex flex-col">
        <div className="relative z-20 bg-white border-b border-slate-100 w-full px-4 sm:px-8 lg:px-12">
          <Header formData={user} profileImg={user?.avatar} />
        </div>
        <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center px-4">
          <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center">
            <IconCreditCard size={24} className="text-[#D82F5A]" />
          </div>
          <p className="text-sm font-semibold text-slate-700">Tidak ada paket yang dipilih.</p>
          <p className="text-xs text-slate-400">Silakan pilih paket terlebih dahulu dari halaman Member.</p>
          <button
            onClick={() => navigate('/member')}
            className="mt-2 px-5 py-2.5 bg-black text-white text-xs rounded-[4px] hover:bg-zinc-800 transition-all"
          >
            Kembali ke Halaman Member
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  // ─── Data dari plan yang dipilih ──────────────────────────────────────────────
  // chosenPlan berisi: { id, title, price (string "Rp 499.000"), rawPrice (number), period, features, description, ... }
  const isFree = chosenPlan.rawPrice === 0;
  const [loading, setLoading] = useState(false);
  const [isLoading, setisLoading] = useState(false);
  const handleConnect = (walletName) => {

    alert(`Menghubungkan ke ${walletName}...`);

    if (!linkedWallets.includes(walletName)) {
      setLinkedWallets([...linkedWallets, walletName]);
    }
  };

  const handlePayment = async () => {

    console.log("BUTTON CLICKED");

    try {
      
      console.log("START REQUEST");

      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/payment/create-transaction`,
        {
          name: user?.name,
          email: user?.email,
          amount: Number(chosenPlan.rawPrice),
          plan: chosenPlan.title,
          payment: "qris"
        }
      );

      console.log("RESPONSE MASUK");
      console.log(response);

      const token = response.data.token;

      window.snap.pay(token, {

        onSuccess: function (result) {

          console.log("PAYMENT SUCCESS");
          console.log(result);

          alert("Pembayaran berhasil!");
          navigate("/profile")
        },

        onPending: function (result) {

          console.log("PAYMENT PENDING");
          console.log(result);

          alert("payment cancel");
        },

        onError: function (result) {

          console.log("PAYMENT ERROR");
          console.log(result);

          alert("Pembayaran gagal");
        },

        onClose: async function () {

          console.log("USER CLOSED POPUP");

          try {

            await axios.post(
              `${import.meta.env.VITE_BACKEND_URL}/api/payment/cancel-payment`,
              {
                order_id: response.data.order_id
              }
            );

            console.log("STATUS UPDATED TO CANCEL");

          } catch (err) {

            console.log("CANCEL ERROR");
            console.log(err);
          }

          alert("Pembayaran dibatalkan");
        }
      });

    } catch (err) {

      console.log("ERROR:");
      console.log(err);
    }
  };

  // Tanggal transaksi dinamis
  const today = new Date().toLocaleDateString('id-ID', {
    day: 'numeric', month: 'long', year: 'numeric'
  });

  return (
    <div className="min-h-screen bg-[#F9FAFB] font-['Plus_Jakarta_Sans',sans-serif] text-[#0F172A] flex flex-col relative overflow-x-hidden">

      {/* HEADER */}
      <div className="relative z-20 bg-white border-b border-slate-100 w-full px-4 sm:px-8 lg:px-12">
        <Header formData={user} profileImg={user?.avatar} />
      </div>

      {/* MAIN */}
      <main className="flex-1 w-full px-4 sm:px-8 lg:px-12 pt-6 lg:pt-8 pb-14 relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start bg-[#F9FAFB]">

        {/* KIRI */}
        <div className="lg:col-span-8 space-y-6 w-full">
          <div className="w-full flex flex-col items-start">
            <h2 className="text-xl font-semibold text-slate-900 tracking-tight leading-none">
              Detail Langganan
            </h2>
            <div className="flex items-center gap-1.5 mt-3 font-medium text-xs">
              <span
                onClick={() => navigate('/member')}
                className="text-slate-400 cursor-pointer hover:text-[#D82F5A] transition-colors"
              >
                Member
              </span>
              <IconChevronRight size={14} className="text-slate-300" />
              <span className="text-[#D82F5A]">Pembayaran</span>
            </div>
          </div>

          {/* DETAIL PACK CARD */}
          <div className="w-full bg-white border border-[#EDEDED] rounded-[4px] p-6 sm:p-8 shadow-[0_4px_20px_rgba(15,23,42,0.015)] relative overflow-hidden">

            <div className="w-full flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 border-b border-slate-100 pb-6">
              <div className="space-y-3">
                <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-[4px] bg-[#FFF1F2] text-[#D82F5A]">
                  PAKET PILIHAN ANDA
                </span>
                {/* ── Nama paket dari data tier ── */}
                <h3 className="text-slate-900 text-base font-semibold tracking-tight">
                  {chosenPlan.title}
                </h3>
                <div className="flex items-center gap-2 text-slate-400 text-xs font-medium">
                  <IconCalendarEvent size={14} className="text-slate-400" />
                  <span>Masa Aktif: {chosenPlan.period}</span>
                </div>
              </div>

              <div className="w-full sm:w-auto text-left sm:text-right">
                {/* ── Harga dari data tier ── */}
                <span className="text-xl font-semibold text-slate-950 tracking-tight">
                  {isFree ? 'Gratis' : `Rp ${Number(chosenPlan.rawPrice).toLocaleString('id-ID')}`}
                </span>
                <span className="text-slate-400 text-xs font-medium"> / {chosenPlan.period}</span>
              </div>
            </div>

            {/* FITUR dari descriptions di DB */}
            <div className="pt-6 w-full">
              <h4 className="text-xs font-semibold text-slate-900 uppercase tracking-wider mb-4">
                Fitur Yang Anda Dapatkan:
              </h4>
              {chosenPlan.features?.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
                  {chosenPlan.features.map((feature, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between text-xs text-slate-600 font-medium w-full bg-slate-50/50 p-2.5 border border-slate-100 rounded-[4px]"
                    >
                      <span>{feature}</span>
                      <IconCircleCheck size={16} className="text-emerald-500 shrink-0 ml-2" />
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-300 italic">Tidak ada fitur terdaftar.</p>
              )}
            </div>
          </div>

          {/* STEP AKTIVASI */}
          <div className="w-full bg-white border border-[#EDEDED] rounded-[4px] p-5 shadow-[0_4px_20px_rgba(15,23,42,0.015)]">
            <h4 className="text-xs font-semibold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
              <IconSparkles size={16} className="text-[#D82F5A]" />
              3 Langkah Mudah Aktivasi Akun Premium
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { num: '01', title: 'Bayar Tagihan', desc: 'Klik tombol bayar sekarang dan selesaikan transaksi via e-wallet atau QRIS di pop-up.' },
                { num: '02', title: 'Verifikasi Instan', desc: 'Sistem Midtrans akan memverifikasi dana Anda secara otomatis tanpa bukti transfer.' },
                { num: '03', title: 'Buka Akses AI', desc: 'Akun premium otomatis aktif saat itu juga dan fitur langsung terbuka penuh.' },
              ].map(step => (
                <div key={step.num} className="flex gap-3 items-start">
                  <span className="text-lg font-bold text-slate-200 font-mono leading-none pt-0.5">{step.num}</span>
                  <div>
                    <h5 className="text-xs font-semibold text-slate-800">{step.title}</h5>
                    <p className="text-[11px] text-slate-400 mt-1 leading-normal">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* SECURITY NOTE */}
          <div className="w-full flex items-center gap-3 border border-[#EDEDED] bg-white p-4 rounded-[4px]">
            <div className="w-9 h-9 rounded-[4px] bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <IconShieldCheck size={20} />
            </div>
            <div className="text-left">
              <h5 className="text-xs font-semibold text-slate-900">Enkripsi Midtrans 256-bit</h5>
              <p className="text-[11px] text-slate-400 font-medium">Data transaksi Anda dilindungi dengan standar keamanan perbankan global terenkripsi.</p>
            </div>
          </div>
        </div>

        {/* KANAN - INVOICE */}
        <div className="lg:col-span-4 w-full lg:sticky lg:top-24">
          <div className="w-full bg-black text-white rounded-[4px] p-6 sm:p-8 shadow-[0_20px_40px_rgba(0,0,0,0.15)] space-y-6">

            <h3 className="w-full font-semibold text-base text-white border-b border-slate-800 pb-4 flex items-center gap-2">
              <IconCreditCard size={18} className="text-[#D82F5A]" />
              Ringkasan Pembelian
            </h3>

            <div className="space-y-4 w-full">
              {[
                { label: 'Nama Pengguna', value: user?.name ?? user?.username ?? user?.full_name ?? user?.email ?? 'User Pelanggan' },
                { label: 'Paket', value: chosenPlan.title },
                { label: 'Masa Aktif', value: chosenPlan.period },
                { label: 'Metode Pembayaran', value: isFree ? 'Gratis' : 'E-Wallet / Midtrans' },
                { label: 'Tanggal Transaksi', value: today },
              ].map((item, idx) => (
                <div key={idx} className="flex justify-between items-start text-xs w-full gap-2">
                  <span className="text-slate-400 font-medium shrink-0">{item.label}</span>
                  <span className="text-slate-200 font-semibold text-right">{item.value}</span>
                </div>
              ))}
            </div>

            {/* TOTAL */}
            <div className="pt-5 border-t border-dashed border-slate-800 space-y-3.5 w-full">
              <div className="flex justify-between items-center pt-3 border-t border-slate-900 w-full">
                <span className="text-xs font-semibold text-slate-400">Total Tagihan</span>
                <span className="text-xl font-semibold text-white tracking-tight">
                  {isFree ? 'Gratis' : `Rp ${Number(chosenPlan.rawPrice).toLocaleString('id-ID')}`}
                </span>
              </div>
            </div>

            {/* TOMBOL BAYAR */}
            <button
              onClick={handlePayment}
              disabled={loading}
              className={`w-full bg-[#D82F5A] text-white py-4 rounded-[4px] font-semibold text-xs tracking-wider uppercase hover:bg-[#b0264a] active:scale-[0.99] transition-all shadow-md flex items-center justify-center gap-2 ${loading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
            >
              <span>
                {loading
                  ? 'Memproses Transaksi...'
                  : isFree
                    ? 'AKTIVASI GRATIS'
                    : 'BAYAR SEKARANG'}
              </span>
              {!loading && <IconArrowUpRight size={16} />}
            </button>

            {!isFree && (
              <div className="w-full bg-zinc-900 border border-zinc-800 p-3.5 rounded-[4px]">
                <p className="text-[11px] text-slate-400 leading-relaxed font-medium">
                  <span className="text-[#D82F5A] font-semibold">*Klik "Bayar Sekarang"</span> untuk memunculkan gerbang pembayaran aman Midtrans. Anda dapat memilih OVO, Dana, ShopeePay, atau QRIS di dalam pop-up.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
      {isLoading && <LoadingOverlay />}
    </div>
  );
};

export default MemberPayment;