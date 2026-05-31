import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  IconLayoutDashboard,
  IconChartBar,
  IconHistory,
  IconMessageHeart,
  IconBell,
  IconChevronDown,
  IconStar,
  IconSend,
  IconBrandInstagram,
  IconBrandX,
  IconBrandYoutube,
  IconCircleCheck,
  IconSearch,
  IconSettings
} from '@tabler/icons-react';
import logochurn from './assets/logo churn.png';
import unggahdata from './assets/unggahdata.png';
import { IconBrandMyOppo } from '@tabler/icons-react';
import { IconUserCircle } from '@tabler/icons-react';
import { IconLogout2 } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from './header';
import {useAuth} from '../utils/auth'
import Sidebar from './SideBar';


const Feedback = () => {
  const user = useAuth()
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  const [feedbackData, setFeedbackData] = useState({
    topik: "",
    subjek: "",
    isi_feed: ""
  });

  const sendFeed = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    try {

      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/feedback/sendFeed`,
        {
          topik: feedbackData.topik,
          subjek: feedbackData.subjek,
          isi_feed: feedbackData.isi_feed,
          rating: rating
        },
        {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          }
        }
      );

      console.log(response.data);

      setSubmitted(true);

      setTimeout(() => {
        setSubmitted(false);
      }, 3000);

      setFeedbackData({
        topik: "",
        subjek: "",
        isi_feed: ""
      });

      setRating(0);

    } catch (error) {

      console.log(error);

    }
  };

  return (
    <div className="min-h-screen bg-white font-['Plus_Jakarta_Sans',sans-serif] text-[#111827] flex flex-col">
      <div className="flex flex-1">
        {/* SIDEBAR - Sharp 4px edges */}
      <Sidebar></Sidebar>

        {/* MAIN CONTENT */}
        <main className="flex-1 flex flex-col min-w-0 bg-[#F9FAFB]">
          {/* TOPBAR - Full Stretch */}
        <Header formData={user} profileImg={user?.avatar} />

          {/* PAGE CONTENT */}
          <div className="p-8 w-full">
            <div className="mb-8">
              <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">Penilaian Pelanggan</h1>
              <p className="text-sm text-gray-500 mt-1">Berikan feedback teknis untuk membantu optimalisasi algoritma AI kami.</p>
            </div>

            {/* Layout Grid */}
            <div className="flex flex-col xl:flex-row gap-6 items-start">

              {/* FORM SECTION - Expanded Left */}
              <div className="flex-1 bg-white border border-gray-200 rounded-[4px] shadow-sm relative overflow-hidden w-full">
                <form className="p-8 space-y-8" onSubmit={handleSubmit}>

                  <div className="space-y-3">
                    <label className="text-sm font-medium text-black">Rating Sistem</label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onMouseEnter={() => setHover(star)}
                          onMouseLeave={() => setHover(0)}
                          onClick={() => setRating(star)}
                        >
                          <IconStar
                            size={24}
                            stroke={1.5}
                            className={`transition-all ${star <= (hover || rating)
                              ? 'fill-[#D82F5A] text-[#D82F5A]'
                              : 'text-gray-200'
                              }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-black">Topik Masukan</label>
                      <div className="relative">
                        <select
                          value={feedbackData.topik}
                          onChange={(e) =>
                            setFeedbackData({
                              ...feedbackData,
                              topik: e.target.value
                            })
                          }
                          className="w-full bg-white border border-[#ededed] h-10 px-3 rounded-[4px] outline-none text-xs text-gray-700 appearance-none focus:border-[#ededed] transition-colors"
                        >
                          <option value="">Pilih Kategori</option>
                          <option value="UI Accuracy">UI Accuracy</option>
                          <option value="Prediction Speed">Prediction Speed</option>
                          <option value="Data Security">Data Security</option>
                        </select>

                        {/* Icon Dropdown */}
                        <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-gray-400">
                          <IconChevronDown size={16} stroke={2} />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-black">Subjek</label>
                      <input
                        type="text"
                        value={feedbackData.subjek}
                        onChange={(e) =>
                          setFeedbackData({
                            ...feedbackData,
                            subjek: e.target.value
                          })
                        }
                        placeholder="Misal: Kendala sinkronisasi"
                        className="w-full bg-white border border-[#ededed] h-10 px-3 rounded-[4px] outline-none text-xs text-gray-700 focus:border-[#ededed] transition-colors"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-black">Deskripsi Ulasan</label>
                    <textarea
                      value={feedbackData.isi_feed}
                      onChange={(e) =>
                        setFeedbackData({
                          ...feedbackData,
                          isi_feed: e.target.value
                        })
                      }
                      placeholder="Deskripsikan masukan Anda secara mendetail..."
                      className="w-full border border-[#ededed] p-4 rounded-[4px] outline-none text-xs text-gray-700 focus:border-[#ededed] transition-colors min-h-[150px] resize-none"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    onClick={sendFeed}
                    className="bg-black text-white px-8 h-10 rounded-[4px] font-medium text-xs hover:bg-gray-800 transition-all flex items-center justify-center gap-2"
                  >
                    Kirim Feedback <IconSend size={14} />
                  </button>
                </form>

                <AnimatePresence>
                  {submitted && (
                    <motion.div
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                      className="absolute inset-0 bg-white/95 flex flex-col items-center justify-center z-20"
                    >
                      <IconCircleCheck className="text-green-600 mb-2" size={32} />
                      <p className="text-xs font-xs">Feedback Terkirim</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* SIDEBAR INFO - Right Aligned */}
              <div className="w-full xl:w-80 space-y-4">
                <div className="bg-[#111827] p-6 rounded-[4px] text-white">
                  <h4 className="text-sm font-semibold mb-2">Technical Support</h4>
                  <p className="text-xs text-gray-400 leading-relaxed mb-4">
                    Butuh bantuan integrasi data atau menemukan bug sistem?
                  </p>
                  <button className="w-full py-2.5 bg-[#D82F5A] text-white text-xs rounded-[4px] hover:bg-[#b52448] transition-colors">
                    Buka Tiket Bantuan
                  </button>
                </div>

                <div className="bg-white border border-gray-200 p-6 rounded-[4px]">
                  <h4 className="text-sm font-semibold mb-2 text-gray-900">Privacy</h4>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    Data ulasan Anda digunakan sepenuhnya untuk peningkatan machine learning model.
                  </p>
                </div>
              </div>

            </div>
          </div>
        </main>
      </div>

      {/* FOOTER - Full Width */}
      <footer className="bg-white border-t border-gray-100 pt-12 px-10 flex-shrink-0">
        <div className="max-w-[1400px] mx-auto grid md:grid-cols-4 gap-12 border-b border-gray-100 pb-8">

          {/* BRAND SECTION & SOCIALS */}
          <div className="space-y-8 text-left">
            <div className="space-y-6">
              <h3 className="text-2xl tracking-tight font-semibold">
                ChurnGuard <span className="text-[#D82F5A]">CRM</span>
              </h3>
              <p className="text-[#616161] text-sm leading-relaxed">
                Solusi cerdas menjaga loyalitas dan memperkuat hubungan pelanggan Anda secara berkelanjutan.
              </p>
            </div>

            {/* Social Media Icons moved here */}
            <div className="flex gap-4">
              {['brand-instagram', 'brand-x', 'brand-youtube'].map(s => (
                <div key={s} className="w-10 h-10 border border-[#D82F5A]/20 rounded-[4px] flex items-center justify-center text-[#D82F5A] hover:bg-[#D82F5A] hover:text-white hover:-translate-y-1 transition-all duration-300 cursor-pointer shadow-sm">
                  <i className={`ti ti-${s} text-lg`}></i>
                </div>
              ))}
            </div>
          </div>

          {/* ADDRESS */}
          <div>
            <h4 className="text-sm mb-6 flex items-center gap-2 text-[#111827]">
              <i className="ti ti-map-pin text-[#D82F5A]"></i> Alamat
            </h4>
            <p className="text-[#616161] text-[13px] leading-relaxed">
              Gedung Perpustakaan PNJ, Beji, Depok, Jawa Barat 16425.
            </p>
          </div>

          {/* PHONE */}
          <div>
            <h4 className="text-sm mb-6 flex items-center gap-2 text-[#111827]">
              <i className="ti ti-phone text-[#D82F5A]"></i> No. Telepon
            </h4>
            <p className="text-[#616161] text-[13px] leading-relaxed">
              +62 21 727 0036
            </p>
          </div>

          {/* EMAIL */}
          <div>
            <h4 className="text-sm mb-6 flex items-center gap-2 text-[#111827]">
              <i className="ti ti-mail text-[#D82F5A]"></i> Email
            </h4>
            <p className="text-[#616161] text-[13px] underline underline-offset-8 decoration-[#D82F5A]/30 hover:text-[#D82F5A] transition-colors cursor-pointer">
              petisatukan@pnj.ac.id
            </p>
          </div>

        </div>

        {/* COPYRIGHT */}
        <div className="bg-black py-6 -mx-10">
          <p className="text-center text-white text-sm opacity-70">
            © 2026 CHURNGUARD CRM. Hak Cipta Dilindungi Undang-Undang.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Feedback;