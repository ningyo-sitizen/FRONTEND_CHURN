import React, { useState, useRef, useEffect } from 'react';
import { Search, Loader, AlertCircle } from 'lucide-react';

const AppSearchDropdown = ({ value, onChange, onSelect, disabled }) => {
    const [searchResults, setSearchResults] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [isSearching, setIsSearching] = useState(false);
    const [error, setError] = useState(null);
    const [selectedAppIcon, setSelectedAppIcon] = useState(null);
    const [hasSelected, setHasSelected] = useState(false); // State baru untuk penanda aplikasi sudah diklik
    const dropdownRef = useRef(null);
    const searchTimeoutRef = useRef(null);

    // Debounced search
    useEffect(() => {
        console.log(import.meta.env.VITE_SENTIMEN_API);
        if (searchTimeoutRef.current) {
            clearTimeout(searchTimeoutRef.current);
        }


        if (value.trim().length < 2) {
            setSearchResults([]);
            setIsOpen(false);
            return;
        }

        // Jika perubahan value dipicu karena memilih aplikasi dari list, jangan hit API lagi
        if (hasSelected) {
            return;
        }

        setIsSearching(true);
        setError(null);

        searchTimeoutRef.current = setTimeout(async () => {
            try {
                setError(null);

                // Menggunakan URLSearchParams agar terbaca sebagai Form oleh FastAPI
                const formDetails = new URLSearchParams();
                formDetails.append('query', value);
                formDetails.append('count', '8');

                const response = await fetch(`${import.meta.env.VITE_SENTIMEN_API}/sentimen/search-apps`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded",
                    },
                    body: formDetails
                });

                if (!response.ok) {
                    throw new Error(`HTTP Error! Status: ${response.status}`);
                }

                const result = await response.json();

                if (result.status === "success") {
                    setSearchResults(result.results || []);
                    setIsOpen((result.results || []).length > 0);
                } else {
                    setError(result.message || "Gagal mengambil data aplikasi");
                    setSearchResults([]);
                }
            } catch (err) {
                console.error("Detail Error API:", err);
                setError("Gagal connect ke API");
                setSearchResults([]);
            } finally {
                setIsSearching(false);
            }
        }, 300); // 300ms debounce
    }, [value, hasSelected]);

    // Close dropdown ketika click di luar
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSelectApp = (app) => {
        setHasSelected(true); // Tandai bahwa user sudah sukses memilih aplikasi
        onChange(app.title);
        setSelectedAppIcon(app.icon);
        setIsOpen(false); // Langsung tutup popup pencarian seketika
        onSelect(app);
    };

    return (
        <div className="flex-[2] relative w-full md:w-auto" ref={dropdownRef}>
            {/* Input - FIXED: Ditambahkan h-11, perbaikan border color slate-200 agar presisi setara boks tanggal */}
            <div className="flex items-center px-3 gap-2.5 border border-slate-200 rounded-[4px] bg-white h-11 focus-within:border-slate-300 transition-all w-full">
                {selectedAppIcon ? (
                    <img
                        src={selectedAppIcon}
                        alt="app"
                        className="w-5 h-5 rounded flex-shrink-0 object-contain border border-slate-100"
                        onError={(e) => {
                            e.target.style.display = 'none';
                            if (e.target.nextElementSibling) {
                                e.target.nextElementSibling.style.display = 'block';
                            }
                        }}
                    />
                ) : (
                    <Search size={15} className="text-slate-400 flex-shrink-0" />
                )}
                <input
                    type="text"
                    placeholder="cari aplikasi..."
                    className="w-full bg-transparent text-xs font-medium text-slate-600 placeholder:text-slate-400 focus:outline-none flex-1 h-full"
                    value={value}
                    onChange={(e) => {
                        setHasSelected(false); // Reset tanda jika user mulai mengetik ulang/menghapus
                        onChange(e.target.value);
                        if (!e.target.value) setSelectedAppIcon(null);
                    }}
                    disabled={disabled}
                    // FIX: Dropdown hanya akan terbuka jika teks >= 2 karakter DAN user belum menekan tombol aplikasi apapun
                    onFocus={() => value.trim().length >= 2 && !hasSelected && setIsOpen(true)}
                />
                {isSearching && (
                    <Loader size={14} className="text-[#D82F5A] animate-spin flex-shrink-0" />
                )}
            </div>

            {/* Dropdown Menu - FIXED: Menggunakan rounded-[4px] dan border-slate-200 */}
            {isOpen && (
                <div className="absolute top-full left-0 right-0 mt-1.5 bg-white border border-slate-200 rounded-[4px] shadow-lg z-50 max-h-[280px] overflow-y-auto py-1">
                    {error ? (
                        <div className="px-4 py-3 flex items-center gap-2 text-red-500 text-xs font-medium">
                            <AlertCircle size={14} />
                            {error}
                        </div>
                    ) : searchResults.length > 0 ? (
                        searchResults.map((app) => (
                            <button
                                key={app.appId}
                                type="button"
                                onClick={() => handleSelectApp(app)}
                                className="w-full px-3 py-2.5 text-left hover:bg-slate-50 transition-colors border-b border-slate-50 last:border-b-0 flex items-center gap-3 group"
                            >
                                {/* Icon */}
                                <img
                                    src={app.icon}
                                    alt={app.title}
                                    className="w-8 h-8 rounded-[2px] flex-shrink-0 object-contain border border-slate-100 bg-white"
                                    onError={(e) => {
                                        e.target.src = 'https://via.placeholder.com/40?text=App';
                                    }}
                                />

                                {/* Info */}
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs font-semibold text-slate-700 group-hover:text-[#D82F5A] transition-colors truncate">
                                        {app.title}
                                    </p>
                                    <p className="text-[10px] text-slate-400 truncate mt-0.5">
                                        {app.developer}
                                    </p>
                                </div>
                            </button>
                        ))
                    ) : (
                        <div className="px-4 py-3 text-slate-400 text-xs font-medium text-center">
                            Aplikasi tidak ditemukan
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default AppSearchDropdown;