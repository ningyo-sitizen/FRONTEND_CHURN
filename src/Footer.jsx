import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-100 pt-8 px-10 flex-shrink-0 font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Gap antar kolom dikecilkan dari 12 jadi 8 */}
      <div className="max-w-[1400px] mx-auto grid md:grid-cols-4 gap-8 border-b border-gray-100 pb-6">

        {/* BRAND */}
        <div className="space-y-4 text-left"> {/* space-y dikurangi */}
          <h3 className="text-xl tracking-tight font-semibold">
            ChurnGuard <span className="text-[#D82F5A]">CRM</span>
          </h3>
          <p className="text-[#616161] text-xs leading-relaxed max-w-[250px]">
            Solusi cerdas menjaga loyalitas dan memperkuat hubungan pelanggan Anda secara berkelanjutan.
          </p>
          <div className="flex gap-3"> {/* gap icon dikurangi */}
            {['brand-instagram', 'brand-x', 'brand-youtube'].map(s => (
              <div key={s} className="w-8 h-8 border border-[#D82F5A]/20 rounded-[4px] flex items-center justify-center text-[#D82F5A] hover:bg-[#D82F5A] hover:text-white transition-all cursor-pointer shadow-sm">
                <i className={`ti ti-${s} text-base`}></i>
              </div>
            ))}
          </div>
        </div>

        {/* ADDRESS */}
        <div>
          <h4 className="text-sm font-semibold mb-4 flex items-center gap-2 text-[#111827]">
            <i className="ti ti-map-pin text-[#D82F5A]"></i> Alamat
          </h4>
          <p className="text-[#616161] text-[12px] leading-relaxed">
            Gedung Perpustakaan PNJ, Beji, Depok, Jawa Barat 16425.
          </p>
        </div>

        {/* PHONE */}
        <div>
          <h4 className="text-sm font-semibold mb-4 flex items-center gap-2 text-[#111827]">
            <i className="ti ti-phone text-[#D82F5A]"></i> No. Telepon
          </h4>
          <p className="text-[#616161] text-[12px]">+62 21 727 0036</p>
        </div>

        {/* EMAIL */}
        <div>
          <h4 className="text-sm font-semibold mb-4 flex items-center gap-2 text-[#111827]">
            <i className="ti ti-mail text-[#D82F5A]"></i> Email
          </h4>
          <p className="text-[#616161] text-[12px] underline underline-offset-4 decoration-[#D82F5A]/30 hover:text-[#D82F5A] transition-colors cursor-pointer">
            petisatukan@pnj.ac.id
          </p>
        </div>
      </div>

      {/* COPYRIGHT */}
      <div className="bg-black py-4 -mx-10 mt-6"> {/* py-6 jadi py-4 */}
        <p className="text-center text-white text-xs opacity-70 ">
          © 2026 CHURNGUARD CRM. Hak Cipta Dilindungi Undang-Undang.
        </p>
      </div>
    </footer>
  );
};

export default Footer;