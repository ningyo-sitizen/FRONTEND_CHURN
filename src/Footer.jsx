import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-100 pt-8 px-4 sm:px-6 md:px-10 flex-shrink-0 font-['Plus_Jakarta_Sans',sans-serif]">
      
      {/* LAYOUT GRID YANG DIPERBAIKI:
          - Di HP/Mobile (default): Pecah langsung jadi 2 kolom (grid-cols-2) agar hemat ruang dan rapi.
          - Di Desktop (md ke atas): Kembali normal jadi 4 kolom (md:grid-cols-4).
          - text-left dipertahankan di semua ukuran agar tidak berantakan.
      */}
      <div className="w-full grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-8 border-b border-gray-100 pb-8">

        {/* BRAND SECTION (Memakan 2 kolom penuh di mobile agar deskripsinya leluasa) */}
        <div className="col-span-2 md:col-span-1 space-y-3">
          <h3 className="text-lg md:text-xl tracking-tight font-semibold text-[#111827]">
            ChurnGuard <span className="text-[#D82F5A]">CRM</span>
          </h3>
          <p className="text-[#616161] text-[12px] leading-relaxed max-w-sm md:max-w-xs font-medium">
            Solusi cerdas menjaga loyalitas dan memperkuat hubungan pelanggan Anda secara berkelanjutan.
          </p>
          <div className="flex gap-2.5 pt-1">
            {['brand-instagram', 'brand-x', 'brand-youtube'].map(s => (
              <div key={s} className="w-7 h-7 border border-[#D82F5A]/20 rounded-[4px] flex items-center justify-center text-[#D82F5A] hover:bg-[#D82F5A] hover:text-white transition-all cursor-pointer shadow-sm active:scale-90">
                <i className={`ti ti-${s} text-xs`}></i>
              </div>
            ))}
          </div>
        </div>

        {/* ADDRESS SECTION (Kolom 1 di baris kedua pada mobile) */}
        <div className="flex flex-col col-span-1">
          <h4 className="text-[13px] font-semibold mb-2.5 flex items-center gap-1.5 text-[#111827]">
            <i className="ti ti-map-pin text-[#D82F5A]"></i> Alamat
          </h4>
          <p className="text-[#616161] text-[11px] md:text-[12px] leading-relaxed font-medium">
            Gedung Perpustakaan PNJ, Beji, <br className="hidden md:block"/> 
            Depok, Jawa Barat 16425.
          </p>
        </div>

        {/* PHONE SECTION (Kolom 2 di baris kedua pada mobile) */}
        <div className="flex flex-col col-span-1">
          <h4 className="text-[13px] font-semibold mb-2.5 flex items-center gap-1.5 text-[#111827]">
            <i className="ti ti-phone text-[#D82F5A]"></i> No. Telepon
          </h4>
          <p className="text-[#616161] text-[11px] md:text-[12px] font-medium">+62 21 727 0036</p>
        </div>

        {/* EMAIL SECTION (Memakan 2 kolom di baris ketiga pada mobile agar email panjang tidak terpotong) */}
        <div className="flex flex-col col-span-2 md:col-span-1">
          <h4 className="text-[13px] font-semibold mb-2.5 flex items-center gap-1.5 text-[#111827]">
            <i className="ti ti-mail text-[#D82F5A]"></i> Email
          </h4>
          <p className="text-[#616161] text-[11px] md:text-[12px] font-medium underline underline-offset-4 decoration-[#D82F5A]/30 hover:text-[#D82F5A] transition-colors cursor-pointer break-all">
            petisatukan@pnj.ac.id
          </p>
        </div>
      </div>

      {/* COPYRIGHT SECTION */}
      <div className="bg-black py-4 -mx-4 sm:-mx-6 md:-mx-10 mt-0">
        <p className="text-center text-white text-[10px] md:text-xs opacity-70 tracking-wide font-medium px-4">
          © 2026 CHURNGUARD CRM. Hak Cipta Dilindungi Undang-Undang.
        </p>
      </div>
    </footer>
  );
};

export default Footer;