import React from 'react';

const LoadingOverlay = ({ isLoading }) => {

    return (
        <div className="fixed inset-0 bg-[#151C22]/70 backdrop-blur-[2px] z-[9999] flex items-center justify-center">
            <div className="bg-white p-6 rounded-[4px] shadow-xl flex flex-col items-center gap-4 max-w-xs w-full text-center border border-gray-100 font-['Plus_Jakarta_Sans',sans-serif]">    <div className="relative w-10 h-10">
                    <div className="w-10 h-10 rounded-full border-4 border-gray-100"></div>
                    <div className="absolute top-0 left-0 w-10 h-10 rounded-full border-4 border-t-[#D82F5A] border-r-transparent border-b-transparent border-l-transparent animate-spin"></div>
                </div>
                <div className="space-y-1">
                    <p className="text-sm font-bold text-[#222222]">Memproses Analisis</p>
                    <p className="text-xs text-gray-400">Harap Menunggu, sedang menngklasifikasikan data...</p>
                </div>
            </div>
        </div>
    );
};
export default LoadingOverlay;