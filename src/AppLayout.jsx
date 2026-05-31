// src/components/AppLayout.jsx

import React, { useState } from 'react';
import {
    IconMapPin,
    IconPhone,
    IconMail,
    IconBrandInstagram,
    IconWorld,
    IconBrandYoutube,
    IconBrandTiktok,
} from '@tabler/icons-react';


// Tinggi Footer disimulasikan agar padding bawah main dapat disesuaikan
const FOOTER_HEIGHT_CLASS = 'pb-36';

const AppLayout = () => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    // --- 1. NAVBAR DIHAPUS ---
    const Navbar = null; // Menghapus definisi Navbar

    // --- 2. FOOTER (Kode yang Sudah Rapi) ---
    const Footer = (
        <footer className="w-full font-jakarta z-20 fixed sticky">

            <div className="bg-white border-t border-gray-300">
                <div className={'grid grid-cols-4 w-full px-12 py-8 gap-x-6'}>

                    {/* Kolom 1: Info PNJ */}
                    <div className="col-span-1">
                        <h3 className="text-base font-semibold mb-3 text-[#023048] text-left">
                            BEBAS PUSTAKA PNJ
                        </h3>
                        <p className="text-xs mb-4 leading-relaxed text-[#4A4848] text-left">
                            Platform online untuk pengecekan status dan persetujuan data Bebas Pustaka mahasiswa Politeknik Negeri Jakarta.
                        </p>
                        <div className="flex space-x-3 mt-4">
                            <a href="https://www.instagram.com/politekniknegerijakarta/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-7 h-7 border border-gray-400 rounded-full flex items-center justify-center transition-colors hover:border-blue-500">
                                <IconBrandInstagram className="w-4 h-4 text-gray-700" stroke={1.5} />
                            </a>
                            <a href="https://opac.pnj.ac.id/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-7 h-7 border border-gray-400 rounded-full flex items-center justify-center transition-colors hover:border-blue-500">
                                <IconWorld className="w-4 h-4 text-gray-700" stroke={1.5} />
                            </a>
                            <a href="https://youtube.com/@perpustakaanpnj3567?si=oZUHDzj9r_SHK2Cv"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-7 h-7 border border-gray-400 rounded-full flex items-center justify-center transition-colors hover:border-blue-500">
                                <IconBrandYoutube className="w-4 h-4 text-gray-700" stroke={1.5} />
                            </a>
                             <a href="https://www.tiktok.com/@perpustakaanpnj?_r=1&_t=ZS-92Lz0hoOnaO"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-7 h-7 border border-gray-400 rounded-full flex items-center justify-center transition-colors hover:border-blue-500">
                                <IconBrandTiktok className="w-4 h-4 text-gray-700" stroke={1.5}/>
                            </a>
                        </div>
                    </div>

                    {/* Kolom 2: Alamat */}
                    <div className="col-span-1">
                        <h4 className="flex items-center font-normal mb-3 text-sm text-[#4A4848] text-left">
                            <IconMapPin className="w-5 h-5 mr-2 text-[#667790]" stroke={1.5} /> Alamat
                        </h4>
                        <p className="text-xs leading-relaxed text-[#4A4848] text-left">
                            Universitas Indonesia, Gedung Perpustakaan, Politeknik Negeri Jakarta, Kukusan, Kecamatan Beji, Kota Depok, Jawa Barat 16425
                        </p>
                    </div>

                    {/* Kolom 3: Telepon */}
                    <div className="col-span-1">
                        <h4 className="flex items-center font-normal mb-3 text-sm text-[#4A4848] text-left">
                            <IconPhone className="w-5 h-5 mr-2 text-[#667790]" stroke={1.5} /> Telepon
                        </h4>
                        <p className="text-xs leading-relaxed text-[#4A4848] text-left">
                            021-7270036 ext.303
                            <br />
                            087886168799
                        </p>
                    </div>

                    {/* Kolom 4: Email */}
                    <div className="col-span-1">
                         <h4 className="flex items-center font-normal mb-3 text-sm text-[#4A4848] text-left">
                            <IconMail className="w-5 h-5 mr-2 text-[#667790]" stroke={1.5} /> Email
                        </h4>
                        <a className="block text-xs leading-relaxed text-[#4A4848] text-left hover:underline"
                        href="mailto:humas@pnj.ac.id">
                        humas@pnj.ac.id
                        </a>

                    </div>
                </div>
            </div>

            {/* Bagian Copyright */}
            <div className="bg-[#023048] py-4 text-center w-full">
                <p className="text-xs text-white">
                    Copyright Bebas Pustaka PNJ © 2025
                </p>
            </div>
        </footer>
    );

    // --- LAYOUT UTAMA ---
    return (
        <>

            {Footer}
        </>
    );
};

export default AppLayout;