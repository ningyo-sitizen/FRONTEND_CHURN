import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import logochurn from './assets/logo churn.png';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // State untuk mengontrol jika user ingin toggle manual via button
  const [isCollapsed, setIsCollapsed] = useState(false);

  const getMenuStyles = (path) => {
    const isActive = location.pathname === path;

    return isActive
      ? "bg-[#FEF5F6] text-[#D82F5A] flex items-center lg:justify-start justify-center gap-4 px-4 lg:px-6 py-4 rounded-[4px] cursor-pointer transition-all duration-200"
      : "text-[#E2A7B8] flex items-center lg:justify-start justify-center gap-4 px-4 lg:px-6 py-4 rounded-[4px] hover:bg-gray-50 cursor-pointer transition-all duration-200";
  };

  return (
    <aside className="
      /* Default mode mini di layar kecil / zoom besar (Lebar cuma 80px) */
      w-[76px] min-w-[76px] 
      /* Otomatis melebar ke 280px hanya pada layar komputer normal (desktop) */
      lg:w-[280px] lg:min-w-[280px] 
      bg-white border-r border-gray-100 flex flex-col h-screen sticky top-0 z-20 
      font-['Plus_Jakarta_Sans',sans-serif] transition-all duration-300 ease-in-out"
    >

      {/* Logo Section */}
      <div className="pt-6 pb-2 flex flex-col items-center shrink-0 w-full px-2">
        <div className="flex flex-col items-center mb-2 min-h-[40px] justify-center">
          {/* Logo penuh muncul di desktop, di layar kecil diganti ikon kecil/sembunyikan */}
          <img
            src={logochurn}
            alt="logochurn"
            className="w-24 lg:w-28 h-auto object-contain hidden md:block"
          />
          {/* Alternatif pengganti logo saat sidebar menciut (Garis 2 / Hamburger-like Icon) */}
          <div className="lg:hidden flex flex-col gap-1 cursor-pointer p-2 hover:bg-slate-50 rounded" onClick={() => setIsCollapsed(!isCollapsed)}>
            <span className="w-5 h-0.5 bg-[#D82F5A]"></span>
            <span className="w-5 h-0.5 bg-[#D82F5A]"></span>
          </div>
        </div>
        <div className="w-[85%] border-b border-gray-100"></div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 px-2 lg:px-4 space-y-2 mt-4 overflow-y-auto">

        {/* Dashboard */}
        <div
          onClick={() => navigate('/dashboarduser')}
          className={getMenuStyles('/dashboarduser')}
          title="Dashboard"
        >
          <i className="ti ti-home text-xl shrink-0"></i>
          <span className="text-sm font-medium lg:block hidden whitespace-nowrap">Dashboard</span>
        </div>

        {/* Analisis Ulasan */}
        <div
          onClick={() => navigate('/analisisUlasan')}
          className={getMenuStyles('/analisisUlasan')}
          title="Analisis Ulasan"
        >
          <i className="ti ti-chart-bar text-xl shrink-0"></i>
          <span className="text-sm font-medium lg:block hidden whitespace-nowrap">Analisis Ulasan</span>
        </div>

        {/* Sentimen Analysis -> Respon Pelanggan */}
        <div
          onClick={() => navigate('/sentimenAnalysis')}
          className={getMenuStyles('/sentimenAnalysis')}
          title="Respon Pelanggan"
        >
          <i className="ti ti-heart-rate-monitor text-xl shrink-0"></i>
          <span className="text-sm font-medium lg:block hidden whitespace-nowrap">Respon Pelanggan</span>
        </div>

        {/* Riwayat Prediksi */}
        <div
          onClick={() => navigate('/riwayatPrediksi')}
          className={getMenuStyles('/riwayatPrediksi')}
          title="Riwayat Prediksi"
        >
          <i className="ti ti-history text-xl shrink-0"></i>
          <span className="text-sm font-medium lg:block hidden whitespace-nowrap">Riwayat Prediksi</span>
        </div>

        {/* User Feedback */}
        <div
          onClick={() => navigate('/feedback')}
          className={getMenuStyles('/feedback')}
          title="User Feedback"
        >
          <i className="ti ti-message text-xl shrink-0"></i>
          <span className="text-sm font-medium lg:block hidden whitespace-nowrap">User Feedback</span>
        </div>

      </nav>
    </aside>
  );
};

export default Sidebar;