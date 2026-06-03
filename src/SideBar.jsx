import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import logochurn from './assets/logo churn.png';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Helper untuk menentukan menu aktif
  const getMenuStyles = (path) => {
    const isActive = location.pathname === path;

    return isActive
      ? "bg-[#FEF5F6] text-[#D82F5A] flex flex-col lg:flex-row items-center lg:justify-start justify-center gap-1 lg:gap-4 px-2 lg:px-6 py-2 lg:py-4 rounded-[4px] cursor-pointer transition-all duration-200 flex-1 lg:flex-none"
      : "text-[#E2A7B8] hover:text-[#D82F5A] lg:hover:bg-gray-50 flex flex-col lg:flex-row items-center lg:justify-start justify-center gap-1 lg:gap-4 px-2 lg:px-6 py-2 lg:py-4 rounded-[4px] cursor-pointer transition-all duration-200 flex-1 lg:flex-none";
  };

  return (
    <>
      {/* ========================================================================
        1. ASIDE SIDEBAR (Hanya muncul di Desktop / Layar Lebar: lg:flex hidden)
        ========================================================================
      */}
      <aside className="
        hidden lg:flex flex-col 
        w-[280px] min-w-[280px] 
        bg-white border-r border-gray-100 h-screen sticky top-0 z-20 
        font-['Plus_Jakarta_Sans',sans-serif]"
      >
        {/* Logo Section */}
        <div className="pt-6 pb-2 flex flex-col items-center shrink-0 w-full px-2">
          <div className="flex flex-col items-center mb-2 min-h-[40px] justify-center">
            <img
              src={logochurn}
              alt="logochurn"
              className="w-28 h-auto object-contain"
            />
          </div>
          <div className="w-[85%] border-b border-gray-100"></div>
        </div>

        {/* Navigation Menu Desktop */}
        <nav className="flex-1 px-4 space-y-2 mt-4 overflow-y-auto">
          <div onClick={() => navigate('/dashboarduser')} className={getMenuStyles('/dashboarduser')}>
            <i className="ti ti-home text-xl shrink-0"></i>
            <span className="text-sm font-medium whitespace-nowrap">Dashboard</span>
          </div>

          <div onClick={() => navigate('/analisisUlasan')} className={getMenuStyles('/analisisUlasan')}>
            <i className="ti ti-chart-bar text-xl shrink-0"></i>
            <span className="text-sm font-medium whitespace-nowrap">Analisis Ulasan</span>
          </div>

          <div onClick={() => navigate('/sentimenAnalysis')} className={getMenuStyles('/sentimenAnalysis')}>
            <i className="ti ti-heart-rate-monitor text-xl shrink-0"></i>
            <span className="text-sm font-medium whitespace-nowrap">Respon Pelanggan</span>
          </div>

          <div onClick={() => navigate('/riwayatPrediksi')} className={getMenuStyles('/riwayatPrediksi')}>
            <i className="ti ti-history text-xl shrink-0"></i>
            <span className="text-sm font-medium whitespace-nowrap">Riwayat Prediksi</span>
          </div>

          <div onClick={() => navigate('/feedback')} className={getMenuStyles('/feedback')}>
            <i className="ti ti-message text-xl shrink-0"></i>
            <span className="text-sm font-medium whitespace-nowrap">User Feedback</span>
          </div>
        </nav>
      </aside>

      {/* ========================================================================
        2. BOTTOM NAVIGATION BAR (Hanya muncul di HP / Layar Kecil: lg:hidden)
        ========================================================================
      */}
      <div className="
        lg:hidden fixed bottom-0 left-0 right-0 
        bg-white border-t border-gray-100 
        h-16 px-2 flex items-center justify-around z-[99] 
        font-['Plus_Jakarta_Sans',sans-serif] shadow-[0_-4px_20px_rgba(0,0,0,0.03)]"
      >
        <div onClick={() => navigate('/dashboarduser')} className={getMenuStyles('/dashboarduser')}>
          <i className="ti ti-home text-lg"></i>
          <span className="text-[9px] font-semibold tracking-tight">Dashboard</span>
        </div>

        <div onClick={() => navigate('/analisisUlasan')} className={getMenuStyles('/analisisUlasan')}>
          <i className="ti ti-chart-bar text-lg"></i>
          <span className="text-[9px] font-semibold tracking-tight">Analisis</span>
        </div>

        <div onClick={() => navigate('/sentimenAnalysis')} className={getMenuStyles('/sentimenAnalysis')}>
          <i className="ti ti-heart-rate-monitor text-lg"></i>
          <span className="text-[9px] font-semibold tracking-tight">Respon</span>
        </div>

        <div onClick={() => navigate('/riwayatPrediksi')} className={getMenuStyles('/riwayatPrediksi')}>
          <i className="ti ti-history text-lg"></i>
          <span className="text-[9px] font-semibold tracking-tight">Riwayat</span>
        </div>

        <div onClick={() => navigate('/feedback')} className={getMenuStyles('/feedback')}>
          <i className="ti ti-message text-lg"></i>
          <span className="text-[9px] font-semibold tracking-tight">Feedback</span>
        </div>
      </div>
    </>
  );
};

export default Sidebar;