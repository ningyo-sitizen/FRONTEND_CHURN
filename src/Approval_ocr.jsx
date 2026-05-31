import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';

// ====================== TABLE COMPONENT ======================
function TableBepus({ item, selected, onSelect, onApprove, onDetail }) {
    if (!item) return null;

    // Menentukan apakah bisa di-approve
    const canApprove =
        item.status_peminjaman === 'Sudah Dikembalikan' &&
        (!item.total_denda || item.total_denda === 0);

    return (
        <tr className="border-b hover:bg-gray-50 transition">
            {/* Checkbox Select */}
            <td className="p-3 text-center">
                <input
                    type="checkbox"
                    checked={selected}
                    onChange={(e) => onSelect(e.target.checked)}
                />
            </td>

            {/* Nama + Avatar */}
            <td className="p-3 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                    👤
                </div>
                <div>
                    <div className="font-medium">{item.nama}</div>
                    <div className="text-xs text-gray-500">{item.nim}</div>
                </div>
            </td>

            {/* NIM */}
            <td className="p-3 text-center">{item.nim}</td>

            {/* Status Peminjaman */}
            <td
                className={`p-3 text-center ${item.status_peminjaman === 'Sudah Dikembalikan'
                        ? 'text-green-600'
                        : 'text-red-600'
                    }`}
            >
                {item.status_peminjaman}
            </td>

            {/* Status Bebas Pustaka */}
            <td
                className={`p-3 text-center ${item.status_bepus === 'Bebas Pustaka'
                        ? 'text-green-600'
                        : 'text-red-600'
                    }`}
            >
                {item.status_bepus}
            </td>

            {/* Tombol Setujui */}
            <td className="p-3 text-center">
                <button
                    disabled={!canApprove}
                    className={`px-3 py-1 rounded transition ${canApprove
                            ? 'bg-blue-600 hover:bg-blue-700 text-white'
                            : 'bg-gray-200 cursor-not-allowed text-gray-500'
                        }`}
                    onClick={() => onApprove(item.nim, item.nama)}
                >
                    Setujui
                </button>
            </td>

            {/* Tombol Detail */}
            <td className="p-3 text-center">
                <button
                    className="underline text-sm text-blue-600 hover:text-blue-800"
                    onClick={onDetail}
                >
                    Lihat
                </button>
            </td>
        </tr>
    );
}

// ====================== MAIN COMPONENT ======================
export default function Bepus() {
    const [data, setData] = useState([]);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(6);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(false);
    const [detailData, setDetailData] = useState(null);

    // Checkbox state
    const [selectedNim, setSelectedNim] = useState([]);
    const [selectAll, setSelectAll] = useState(false);

    // 🔥 Fetch Data
    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const res = await axios.get('http://localhost:8000/api/bepus/data', {
                params: { page, limit, search }
            });

            const result =
                res.data?.data?.rows || res.data?.data || res.data || [];

            const formatted = result.map(d => ({
                nim: d.nim || d.member_id,
                nama: d.nama || d.member_name,
                status_peminjaman: d.status_peminjaman || (d.is_return ? 'Sudah Dikembalikan' : 'Belum'),
                status_bepus: d.status_bepus || (d.approved ? 'Bebas Pustaka' : 'Belum'),
                total_denda: d.total_denda || d.denda || 0,
                ...d
            }));

            setData(formatted);
        } catch (err) {
            console.error(err);
            alert('❌ Gagal mengambil data. Pastikan backend berjalan.');
        } finally {
            setLoading(false);
        }
    }, [page, limit, search]);

    useEffect(() => { fetchData(); }, [fetchData]);

    // Reset checkbox ketika data berubah
    useEffect(() => {
        setSelectedNim([]);
        setSelectAll(false);
    }, [data]);

    // Auto centang jika semua data dipilih
    useEffect(() => {
        setSelectAll(selectedNim.length === data.length && data.length > 0);
    }, [selectedNim, data]);

    // APPROVE SATUAN
    const handleApprove = async (nim, nama) => {
        if (!window.confirm(`Yakin ingin approve ${nama} (${nim})?`)) return;

        try {
            await axios.post('http://localhost:8000/api/bepus/approve', {
                nim,
                nama
            });

            alert('✔ Sukses approve');
            fetchData();
        } catch (err) {
            console.error(err);
            alert('❌ Gagal approve. Coba cek backend.');
        }
    };

    // APPROVE BULK
    const handleApproveBulk = async () => {
        const selectedRows = data.filter(d => selectedNim.includes(d.nim));

        if (selectedRows.length === 0)
            return alert('Pilih minimal 1 data');

        if (!window.confirm(`Yakin ingin approve ${selectedRows.length} mahasiswa?`))
            return;

        try {
            await axios.post('http://localhost:8000/api/bepus/approve/bulk', {
                data: selectedRows.map(d => ({ nim: d.nim, nama: d.nama }))
            });

            alert('✔ Bulk approval berhasil');
            fetchData();
        } catch (err) {
            console.error(err);
            alert('❌ Error approve bulk');
        }
    };


    return (
        <div className="min-h-screen p-8">
            <div className="max-w-6xl mx-auto">
                {/* HEADER */}
                <header className="flex items-center justify-between mb-6">
                    <h1 className="text-2xl font-bold">Konfirmasi Data Bebas Pustaka</h1>
                    <img src="/screenshot.png" alt="screenshot" className="w-12 h-12 rounded-full" />
                </header>

                {/* FILTER */}
                <div className="flex gap-3 items-center mb-4">
                    <select className="border rounded px-3 py-2" value={limit} onChange={(e) => { setLimit(+e.target.value); setPage(1); }}>
                        <option>5</option>
                        <option>10</option>
                        <option>20</option>
                    </select>
                    <button className="px-3 py-2 border rounded" onClick={fetchData}>Refresh</button>

                    <div className="ml-auto flex items-center gap-2">
                        <input
                            className="border p-2 rounded"
                            placeholder="Cari NIM/Nama..."
                            value={search}
                            onChange={(e) => { setPage(1); setSearch(e.target.value); }}
                        />
                        <button className="px-3 py-2 bg-blue-600 text-white rounded" onClick={fetchData}>Cari</button>
                    </div>
                </div>

                {/* TABLE */}
                <div className="bg-white shadow rounded-lg overflow-hidden">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-100 border-b">
                            <tr>
                                <th className="p-3 w-10">
                                    <input
                                        type="checkbox"
                                        checked={selectAll}
                                        onChange={(e) => setSelectedNim(e.target.checked ? data.map(d => d.nim) : [])}
                                    />
                                </th>
                                <th className="p-3">Nama</th>
                                <th className="p-3 text-center">NIM</th>
                                <th className="p-3 text-center">Status Peminjaman</th>
                                <th className="p-3 text-center">Status</th>
                                <th className="p-3 text-center">Tindakan</th>
                                <th className="p-3 text-center">Keterangan</th>
                            </tr>
                        </thead>

                        <tbody>
                            {loading ? (
                                <tr><td colSpan={7} className="p-6 text-center">Loading...</td></tr>
                            ) : data.length === 0 ? (
                                <tr><td colSpan={7} className="p-6 text-center">Tidak ada data</td></tr>
                            ) : (
                                data.map((d) => (
                                    <TableBepus
                                        key={d.nim}
                                        item={d}
                                        selected={selectedNim.includes(d.nim)}
                                        onSelect={(checked) =>
                                            setSelectedNim(prev => checked ? [...prev, d.nim] : prev.filter(x => x !== d.nim))
                                        }
                                        onApprove={handleApprove}
                                        onDetail={() => setDetailData(d)}
                                    />
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* BUTTON GROUP */}
                <div className="flex items-center justify-between mt-4">
                    <button className="px-4 py-2 bg-emerald-800 text-white rounded" onClick={() => window.open('http://localhost:8000/api/bepus/export/pdf', '_blank')}>
                        Export PDF
                    </button>
                    <button className="px-4 py-2 bg-emerald-800 text-white rounded" onClick={() => window.open('http://localhost:8000/api/bepus/export/excel', '_blank')}>
                        Export Excel
                    </button>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded" onClick={handleApproveBulk}>
                        Approve Semua
                    </button>

                    <div className="flex items-center gap-2">
                        <button className="px-3 py-1 border rounded" disabled={page === 1} onClick={() => setPage(p => p - 1)}>Prev</button>
                        <div className="px-3 py-1 border rounded">{page}</div>
                        <button className="px-3 py-1 border rounded" disabled={data.length < limit} onClick={() => setPage(p => p + 1)}>Next</button>
                    </div>
                </div>

                {/* MODAL DETAIL */}
                {detailData && (
                    <div className="fixed inset-0 bg-black/50 flex justify-center items-center">
                        <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                            <h2 className="text-lg font-medium mb-4">Detail Mahasiswa</h2>
                            <p><b>Nama:</b> {detailData.nama}</p>
                            <p><b>NIM:</b> {detailData.nim}</p>
                            <p><b>Status Peminjaman:</b> {detailData.status_peminjaman}</p>
                            <p><b>Total Denda:</b> Rp{detailData.total_denda}</p>

                            <button
                                className="mt-4 px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                                onClick={() => setDetailData(null)}
                            >
                                Tutup
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}