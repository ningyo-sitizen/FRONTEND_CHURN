import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import coverLanding from './assets/coverlandingpage.png';
import ayoBergabung from './assets/Group 1000002792.png';
import churnrate from './assets/Group 1000002793.png';
import kotachurn from './assets/kotachurn.png';
import logochurn from './assets/logo churn.png';
import Footer from './footer';
import { useLocation } from 'react-router-dom';
import { CheckCircle2, X } from 'lucide-react';

const Counter = ({ target, duration = 2000 }) => {
  const [count, setCount] = useState(0);
  

  useEffect(() => {
    const targetNumber = parseInt(target.replace(/[^0-9]/g, ""));
    const suffix = target.replace(/[0-9]/g, ""); // Simpan "+" atau "%" nya
    

    let start = 0;
    const increment = targetNumber / (duration / 16); // 16ms per frame (60fps)

    const timer = setInterval(() => {
      start += increment;
      if (start >= targetNumber) {
        setCount(targetNumber);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [target, duration]);

  return <span>{count}{target.includes("+") ? "+" : target.includes("%") ? "%" : ""}</span>;
};

function LandingPage() {
  const [faqOpen, setFaqOpen] = useState(5);
  const navigate = useNavigate();
  const [showToast, setShowToast] = useState(false);

    useEffect(() => {
        // Cek apakah user datang dari proses logout sukses
        if (location.state?.loggedOut) {
            setShowToast(true);
            // Sembunyikan otomatis setelah 4 detik
            const timer = setTimeout(() => setShowToast(false), 4000);
            return () => clearTimeout(timer);
        }
    }, [location]);

  const faqs = [
    { id: 1, q: "Bagaimana ChurnGuard CRM memprediksi pelanggan yang akan berhenti?", a: "Sistem kami menggunakan algoritma cerdas untuk menganalisis pola perilaku dari data yang Anda unggah." },
    { id: 2, q: "Apa yang membuat ChurnGuard CRM berbeda?", a: "Fokus kami bukan sekedar menyimpan data, tapi memberikan solusi otomatis (playbook) untuk mempertahankan pelanggan secara real-time." },
    { id: 3, q: "Bagaimana keamanan data di ChurnGuard CRM?", a: "Data Anda dienkripsi dengan standar keamanan tinggi dan hanya dapat diakses oleh tim Anda sendiri." },
    { id: 4, q: "Apakah hasil analisis bisa di-export?", a: "Ya, Anda bisa mengunduh laporan analitik dalam berbagai format untuk kebutuhan strategi bisnis." },
    { id: 5, q: "Apa yang membedakan ChurnGuard dengan CRM biasa?", a: "CRM biasa hanya mencatat data, tapi ChurnGuard menjaga data tersebut. Fokus utama kami bukan sekedar menyimpan nama pelanggan, tapi memastikan mereka tetap menjadi pelanggan setia Anda selamanya." },
  ];

  return (
    
    
    <div className="bg-[#F9FAFB] text-[#111827] font-['Plus_Jakarta_Sans'] antialiased selection:bg-[#D82F5A]/10">

      {/* Tambahkan Style ini di file CSS global Anda (misal index.css) */}
      <style>{`
        html {
          scroll-behavior: smooth;
        }
      `}</style>
      

      {/* ================= NAVBAR ================= */}
      <header className="fixed w-full bg-white/80 backdrop-blur-md z-[100] py-2 border-b border-[#EDEDED]">
        <div className="max-w-[1440px] mx-auto flex justify-between items-center px-10">
          <div className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity duration-300">
            <img
              src={logochurn} // Pastikan sudah di-import: import ayoBergabung from './assets/Group_1000002792.png'
              alt="logochurn"
              className="w-30 h-auto drop-shadow-lg"
            />
          </div>
          <nav className="hidden md:flex gap-20 text-xs text-[#616161]">
            {[
              { name: "Home", link: "#home" },
              { name: "Tentang kami", link: "#about" },
              { name: "Fitur", link: "#fitur" },
              { name: "FAQs", link: "#faqs" }
            ].map((item) => (
              <a
                key={item.name}
                href={item.link}
                className="relative hover:text-black transition-colors duration-300 group"
              >
                {item.name}
                <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-[#D82F5A] transition-all duration-300 group-hover:w-full"></span>
              </a>
            ))}
          </nav>
          <button
            onClick={() => navigate("/login")} // Ini yang mengarahkan ke page /login
            className="bg-black text-white px-8 py-2 rounded-[4px] text-[13px] hover:bg-[#D82F5A] hover:shadow-lg hover:shadow-[#D82F5A]/20 transition-all duration-300 transform active:scale-95"
          >
            Masuk
          </button>
        </div>
      </header>

      {/* ================= SECTION ================= */}
      <section id="home" className="relative pt-32  overflow-hidden flex flex-col items-center bg-white min-h-screen">

        {/* 1. Background Gradient - Sekarang memakai absolute agar tidak mendorong konten */}
        <div className="absolute inset-0 bg-gradient-to-b from-white to-[#F6EAEC] z-0"></div>

        {/* Content Wrapper */}
        <div className="max-w-5xl mx-auto text-center px-6 relative z-10 flex flex-col items-center">

          {/* Badge */}
          <div className="inline-block border border-[#D82F5A] text-[#D82F5A] px-4 py-1.5 rounded-full text-xs bg-[#FEF5F6] mb-5 shadow-sm">
            Predict the Unpredictable
          </div>

          {/* Title */}
          <h1 className="text-[32px] font-semibold leading-tight mb-4 tracking-tight text-gray-900">
            Kuasai Retensi Pelanggan dengan <span className="text-[#D82F5A]">ChurnGuard CRM</span>
          </h1>

          {/* Description */}
          <p className="text-[#616161] text-base max-w-2xl mx-auto mb-8 leading-relaxed">
            Jangan tunggu sampai mereka pergi. Deteksi risiko kehilangan pelanggan lebih awal dan ambil langkah tepat untuk mempertahankan mereka secara otomatis.
          </p>

          {/* Button */}
          <button
           onClick={() => navigate("/login")}
           className="bg-black text-white px-4 py-3 rounded-[4px] text-sm shadow-xl hover:bg-[#D82F5A] transition-all duration-300 mb-10">
            Coba Sekarang
            <i className="ti ti-chevron-right ml-2"></i>
          </button>

          {/* 3. AREA MOCKUP (DASHBOARD) */}
          <div className="relative w-full max-w-[950px] mx-auto">

            {/* GRID KOTAK-KOTAK - Disesuaikan agar lebih lebar ke samping */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 
    /* Lebar ditingkatkan ke 180% agar jauh lebih lebar ke kanan-kiri */
    w-[180%] h-[150%] 
    bg-[linear-gradient(rgba(0,0,0,0.05)_2px,transparent_2px),linear-gradient(90deg,rgba(0,0,0,0.05)_1px,transparent_1px)] 
    bg-[size:30px_30px] 
    /* Masking diubah: black 40% agar grid di samping lebih tegas, transparent 90% agar fading di ujung lebih jauh */
    [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_90%)] 
    pointer-events-none z-0"
            />

            {/* Label Churn Rate (Kiri) */}
            <div className="absolute -left-14 top-12 z-20 hidden lg:block">
              <img src={churnrate} alt="churnrate" className="w-32 h-auto drop-shadow-xl" />
            </div>

            {/* Label Ayo Bergabung (Kanan) */}
            <div className="absolute -right-20 bottom-20 z-20 hidden lg:block">
              <img src={ayoBergabung} alt="Ayo Bergabung" className="w-30 h-auto drop-shadow-xl" />
            </div>

            {/* Frame Gambar */}
            <div className="relative rounded-[4px] ">
              <img
                src={coverLanding}
                alt="Dashboard"
                className="rounded-[10px] w-full block"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ================= STATS SECTION ================= */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 border border-[#EDEDED] rounded-[4px] py-12 shadow-sm bg-white hover:shadow-md transition-shadow duration-500">
            {[
              { n: "100+", t: "Perusahaan Terlindungi" },
              { n: "85%", t: "Tingkat Kepuasan Klien" },
              { n: "1000000", t: "Pola Perilaku Teranalisis", display: "1 Juta+" }, // Khusus yang teksnya campur, kita sesuaikan
              { n: "2", t: "Waktu Pemulihan Rata-rata", prefix: "< " }
            ].map((item, i) => (
              <div
                key={i}
                className={`relative px-4 text-center ${i !== 3 ? 'after:hidden md:after:block after:absolute after:right-0 after:top-1/4 after:h-1/2 after:w-[1px] after:bg-[#EDEDED]' : ''}`}
              >
                <div className="text-[32px] font-bold text-[#111827] tracking-tight mb-2">
                  {/* Pakai Komponen Counter di sini */}
                  {item.prefix && item.prefix}
                  {item.display ? item.display : <Counter target={item.n} />}
                </div>
                <div className="text-[#616161] text-[15px] leading-snug">
                  {item.t}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= TENTANG KAMI SECTION ================= */}
      <section id="about" className="py-32 px-10 max-w-7xl mx-auto grid md:grid-cols-2 gap-20 items-center">
        <div className="relative w-full flex justify-start items-start overflow-hidden">
          <img
            src={kotachurn}
            className="grayscale w-full h-[495px] object-cover shadow-xl hover:grayscale-0 transition-all duration-700 hover:scale-105 origin-top-left"
            alt="About"
          />
        </div>
        <div>
          <div className="inline-block border border-[#D82F5A] text-[#D82F5A] px-4 py-1 rounded-[25px] text-xs bg-[#FEF5F6] mb-4 shadow-sm">
            Tentang Kami
          </div>
          <h2 className="text-[32px] font-semibold leading-tight mb-5 text-[#111827]">Apa Itu <span className="text-[#D82F5A]">ChurnGuard CRM ?</span></h2>
          <div className="text-[#616161] space-y-6 text-base leading-relaxed text-justify">
            <p>ChurnGuard CRM bukan sekadar tempat penyimpanan database; ini adalah sistem pertahanan pendapatan bisnis Anda. Menggunakan mesin analitik cerdas, ChurnGuard memantau setiap sinyal penurunan aktivitas pelanggan secara real-time.</p>
            <p>Saat sistem mendeteksi pelanggan yang menunjukkan tanda-tanda akan berhenti (churn), ChurnGuard tidak hanya memberi peringatan, tapi juga menyajikan Automated Solution Playbook. Mulai dari pemberian diskon otomatis, pengiriman email personal, hingga pengingat untuk tim CS Anda untuk melakukan follow-up khusus. Bersama ChurnGuard, Anda tidak lagi hanya melihat angka yang hilang, tapi membangun hubungan yang bertahan lama.</p>
          </div>
          <button 
          onClick={() => navigate("/login")}
          className="mt-8 inline-flex items-center justify-center gap-2 text-sm bg-black text-white px-8 py-3 rounded-[4px] shadow-lg transition-all duration-300 hover:bg-[#D82F5A] hover:-translate-y-1">
            <span>Coba Sekarang</span>
            <i className="ti ti-chevron-right"></i>
          </button>
        </div>
      </section>

      {/* ================= FITUR SECTION ================= */}
      <section id="fitur" className="py-32 bg-[#FEF5F6]/40 border-y border-[#EDEDED]">
        <div className="max-w-7xl mx-auto px-10">
          <div className="text-center mb-20">
            <div className="inline-block border border-[#D82F5A] text-[#D82F5A] px-4 py-1 rounded-[25px] text-xs bg-[#FEF5F6] mb-2 ">
              Fitur
            </div>
            <h2 className="text-[32px] font-semibold text-[#111827] mb-2">Bagaimana <span className="text-[#D82F5A]">ChurnGuard CRM</span> Bekerja?</h2>
            <p className="text-[#616161] text-base max-w-2xl mx-auto">ChurnGuard mendeteksi risiko kehilangan pelanggan secara otomatis. Cukup upload data CSV Anda, dan sistem kami akan memvalidasi serta mengelompokkan pelanggan.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { id: "01", t: "Upload Data CSV", d: "Unggah data transaksi atau interaksi pelanggan Anda dalam format CSV. Sistem kami terintegrasi secara aman untuk membaca pola data tanpa proses setup yang rumit." },
              { id: "02", t: "Validasi & Proses", d: "Sistem secara otomatis memvalidasi keakuratan data yang Anda unggah. Setelah data tervalidasi, mesin cerdas kami akan langsung mengolah secara otomatis." },
              { id: "03", t: "Hasil Akhir", d: "Dapatkan hasil analisis lengkap dalam satu tampilan. Pantau siapa saja pelanggan yang berisiko churn dan segera ambil langkah tepat." }
            ].map((f) => (
              <div key={f.id} className="bg-white p-8 rounded-[4px] border border-[#EDEDED] shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-500 group">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-11 h-9 bg-[#D82F5A] text-white rounded-[4px] flex items-center justify-center text-sm font-bold flex-shrink-0 group-hover:scale-110 transition-transform">
                    {f.id}
                  </div>
                  <h3 className="text-[19px] font-bold text-[#111827] leading-tight">
                    {f.t}
                  </h3>
                </div>
                <p className="text-[#616161] text-sm leading-relaxed">
                  {f.d}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= FAQ SECTION ================= */}
      <section id="faqs" className="py-32 px-10 max-w-7xl mx-auto flex flex-col md:flex-row gap-20">
        <div className="md:w-3/5 space-y-4 order-2 md:order-1">
          {faqs.map((faq) => (
            <div key={faq.id} className={`border rounded-[4px] transition-all duration-500 overflow-hidden ${faqOpen === faq.id ? 'border-[#D82F5A]/30 bg-white ring-1 ring-[#D82F5A]/10' : 'border-gray-100 bg-white'}`}>
              <button
                onClick={() => setFaqOpen(faq.id === faqOpen ? null : faq.id)}
                className="w-full p-6 text-left flex justify-between items-center transition-colors hover:bg-gray-50"
              >
                <span className={`text-sm font-medium transition-colors duration-300 ${faqOpen === faq.id ? 'text-[#D82F5A]' : 'text-black'}`}>
                  {faq.q}
                </span>

                {/* Ikon diganti ke Chevron dengan animasi rotasi */}
                <i className={`ti ${faqOpen === faq.id ? 'ti-chevron-up rotate-180' : 'ti-chevron-down'} text-[#D82F5A] transition-transform duration-500`}></i>
              </button>
              <div className={`transition-all duration-500 ease-in-out ${faqOpen === faq.id ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                <div className="px-6 pb-6 text-[#616161] text-sm leading-relaxed border-t border-gray-50 pt-4">
                  {faq.a}
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="md:w-2/5 text-right order-1 md:order-2 self-center">
          <div className="inline-block border border-[#D82F5A] text-[#D82F5A] px-4 py-1 rounded-[25px] text-xs bg-[#FEF5F6] mb-4 ">
            FAQs
          </div>
          <h2 className="text-[32px] font-semibold leading-tight mb-5">
            Frequently Asked Questions <br />
            <span className="text-[#D82F5A]">ChurnGuard CRM</span>
          </h2>
          <p className="text-gray-500 text-base ">Temukan jawaban dari berbagai pertanyaan yang sering diajukan seputar layanan dan proses ChurnGuard CRM.</p>
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <Footer />
    </div>
  );
}

export default LandingPage;