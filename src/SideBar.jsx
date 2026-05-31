import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import logochurn from './assets/logo churn.png';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const getMenuStyles = (path) => {
    const isActive = location.pathname === path;
    
    return isActive
      ? "bg-[#FEF5F6] text-[#D82F5A] flex items-center gap-4 px-6 py-4 rounded-[4px] cursor-pointer transition-all"
      : "text-[#E2A7B8] flex items-center gap-4 px-6 py-4 rounded-[4px] hover:bg-gray-50 cursor-pointer transition-all";
  };

  return (
    <aside className="w-[280px] bg-white border-r border-gray-100 flex flex-col h-screen sticky top-0 z-20 font-['Plus_Jakarta_Sans',sans-serif]">
      
      {/* Logo Section */}
      <div className="pt-6 pb-2 flex flex-col items-center">
        <div className="flex flex-col items-center mb-2">
          <img src={logochurn} alt="logochurn" className="w-28 h-auto" />
        </div>
        <div className="w-[85%] border-b border-gray-100"></div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 px-4 space-y-2 mt-4">
        
        {/* Dashboard */}
        <div 
          onClick={() => navigate('/dashboarduser')} 
          className={getMenuStyles('/dashboarduser')}
        >
          <i className="ti ti-home text-xl"></i>
          <span className="text-sm font-medium">Dashboard</span>
        </div>

        {/* Analisis Ulasan */}
        <div 
          onClick={() => navigate('/analisisUlasan')} 
          className={getMenuStyles('/analisisUlasan')}
        >
          <i className="ti ti-chart-bar text-xl"></i>
          <span className="text-sm font-medium">Analisis Ulasan</span>
        </div>

        {/* Sentimen Analysis -> Respon Pelanggan */}
        <div 
          onClick={() => navigate('/sentimenAnalysis')} 
          className={getMenuStyles('/sentimenAnalysis')}
        >
          <i className="ti ti-heart-rate-monitor text-xl"></i>
          <span className="text-sm font-medium">Respon Pelanggan</span>
        </div>

        {/* Riwayat Prediksi */}
        <div
          onClick={() => navigate('/riwayatPrediksi')}
          className={getMenuStyles('/riwayatPrediksi')}
        >
          <i className="ti ti-history text-xl"></i>
          <span className="text-sm font-medium">Riwayat Prediksi</span>
        </div>


        <div
          onClick={() => navigate('/feedback')}
          className={getMenuStyles('/feedback')}
        >
          <i className="ti ti-message text-xl"></i>
          <span className="text-sm font-medium">User Feedback</span>
        </div>

      </nav>
    </aside>
  );
};

export default Sidebar;