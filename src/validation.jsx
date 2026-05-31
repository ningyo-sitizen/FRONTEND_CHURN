import axios from "axios";
import { useAuth } from "../utils/auth";
import { useState, useRef } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";

import logochurn from "./assets/logo churn.png";

export default function Validation() {
    const user = useAuth();
    const navigate = useNavigate();

    const fileInputRef = useRef(null);

    const [file, setFile] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);

    const [headerError, setHeaderError] = useState(null);
    const [missingData, setMissingData] = useState([]);
    const [totalError, setTotalError] = useState(0);
    const [columnSummary, setColumnSummary] = useState([]);

    const [loading, setLoading] = useState(false);
    const [hasChecked, setHasChecked] = useState(false);
    const [showNext, setshowNext] = useState(false);

    const [isDragging, setIsDragging] = useState(false);

    const [openDetail, setOpenDetail] = useState({
        header: false,
        missing: false,
        status: false
    });

    if (!user) return <p>Loading...</p>;

    const resetAll = () => {
        setFile(null);
        setSelectedFile(null);

        setHeaderError(null);
        setMissingData([]);
        setTotalError(0);
        setColumnSummary([]);

        setHasChecked(false);
        setshowNext(false);

        setOpenDetail({
            header: false,
            missing: false,
            status: false
        });
    };

    const toggle = (key) => {
        setOpenDetail({
            header: false,
            missing: false,
            status: false,
            [key]: !openDetail[key]
        });
    };

    const processFile = (selected) => {
        if (
            selected &&
            (selected.type === "text/csv" ||
                selected.name.endsWith(".csv"))
        ) {
            setFile(selected);

            setSelectedFile({
                name: selected.name,
                size: (selected.size / 1024).toFixed(1) + " kb",
                raw: selected
            });
        } else {
            alert("Mohon upload file CSV");
        }
    };

    const handleFileChange = (e) => {
        processFile(e.target.files[0]);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);

        processFile(e.dataTransfer.files[0]);
    };

    const handleUpload = async () => {
        if (!file) return alert("Pilih file dulu");

        try {
            setLoading(true);

            const formData = new FormData();
            formData.append("file", file);

            const token = localStorage.getItem("token");

            const res = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/csv/upload-csv`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setHeaderError(res.data.headerError);
            setMissingData(res.data.missingData || []);
            setTotalError(res.data.totalError || 0);
            setColumnSummary(res.data.columnSummary || []);

            setHasChecked(true);

            if (
                res.data.headerError === null &&
                res.data.missingData.length === 0
            ) {
                setshowNext(true);
            }
        } catch (err) {
            console.log("Upload error:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleUploadpy = async () => {
        if (!file) return alert("Pilih file dulu");

        try {
            setLoading(true);

            const formData = new FormData();
            formData.append("file", file);

            const token = localStorage.getItem("token");

            jwtDecode(token);

            await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/csv/upload-csv-py`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            resetAll();

            navigate("/dashboardUser");
        } catch (err) {
            console.log("Upload error:", err);
        } finally {
            setLoading(false);
        }
    };

    const isValid =
        hasChecked &&
        !headerError &&
        missingData.length === 0;

    const grouped = missingData.reduce((acc, curr) => {
        if (!acc[curr.row]) acc[curr.row] = [];

        acc[curr.row].push(curr.column);

        return acc;
    }, {});

    return (
        <div className="flex min-h-screen bg-[#F9FAFB]">
            {/* SIDEBAR */}
            <aside className="w-[280px] bg-white border-r border-gray-100 p-8">
                <img
                    src={logochurn}
                    alt="logo"
                    className="w-32"
                />
            </aside>

            {/* MAIN */}
            <main className="flex-1 p-10">
                <h1 className="text-3xl font-semibold text-[#111827]">
                    Upload & Validation CSV
                </h1>

                {/* UPLOAD AREA */}
                {!hasChecked && (
                    <div className="mt-10 grid grid-cols-12 gap-8">
                        {/* LEFT */}
                        <div className="col-span-7">
                            <h3 className="text-sm font-medium mb-4">
                                Upload File
                            </h3>

                            <input
                                type="file"
                                accept=".csv"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                className="hidden"
                            />

                            <div
                                onDragOver={(e) => {
                                    e.preventDefault();
                                    setIsDragging(true);
                                }}
                                onDragLeave={() =>
                                    setIsDragging(false)
                                }
                                onDrop={handleDrop}
                                className={`border-2 border-dashed rounded-[4px] p-20 bg-white flex flex-col items-center justify-center transition-all
                                
                                ${
                                    isDragging
                                        ? "border-[#D82F5A]"
                                        : "border-[#E5E7EB]"
                                }
                                `}
                            >
                                <i className="ti ti-upload text-5xl text-[#D82F5A]"></i>

                                <p className="mt-4 font-semibold">
                                    Pilih file atau drag file ke sini
                                </p>

                                <p className="text-xs text-gray-400 mt-1">
                                    Format CSV
                                </p>

                                <button
                                    onClick={() =>
                                        fileInputRef.current.click()
                                    }
                                    className="mt-6 px-5 py-2 border rounded-[4px] text-sm"
                                >
                                    Browse File
                                </button>
                            </div>
                        </div>

                        {/* RIGHT */}
                        <div className="col-span-5">
                            <h3 className="text-sm font-medium mb-4">
                                Preview File
                            </h3>

                            {selectedFile ? (
                                <div className="bg-white border rounded-[4px] p-5">
                                    <div className="flex items-center gap-4">
                                        <i className="ti ti-file-spreadsheet text-5xl text-green-700"></i>

                                        <div>
                                            <p className="font-medium">
                                                {selectedFile.name}
                                            </p>

                                            <p className="text-xs text-gray-400">
                                                {selectedFile.size}
                                            </p>
                                        </div>
                                    </div>

                                    <button
                                        onClick={handleUpload}
                                        disabled={loading}
                                        className="mt-6 w-full bg-[#111827] text-white py-3 rounded-[4px]"
                                    >
                                        {loading
                                            ? "Processing..."
                                            : "Upload & Validate"}
                                    </button>
                                </div>
                            ) : (
                                <div className="h-[250px] border border-dashed rounded-[4px] bg-white flex items-center justify-center text-gray-400">
                                    Belum ada file
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* RESULT */}
                {hasChecked && (
                    <>
                        {/* CARDS */}
                        <div className="grid grid-cols-3 gap-5 mt-10">
                            {/* HEADER */}
                            <div className="bg-red-50 border border-red-200 rounded-[4px] p-5">
                                <h3 className="font-semibold">
                                    Header Validation
                                </h3>

                                <p className="mt-3 text-sm">
                                    {!headerError
                                        ? "✅ Valid"
                                        : "❌ Error ditemukan"}
                                </p>

                                <button
                                    onClick={() =>
                                        toggle("header")
                                    }
                                    className="mt-4 text-sm text-red-500"
                                >
                                    {openDetail.header
                                        ? "Tutup"
                                        : "Lihat Detail"}
                                </button>

                                {openDetail.header &&
                                    headerError && (
                                        <pre className="mt-4 text-xs bg-white p-3 rounded overflow-auto">
                                            {JSON.stringify(
                                                headerError,
                                                null,
                                                2
                                            )}
                                        </pre>
                                    )}
                            </div>

                            {/* MISSING */}
                            <div className="bg-yellow-50 border border-yellow-200 rounded-[4px] p-5">
                                <h3 className="font-semibold">
                                    Missing Data
                                </h3>

                                <p className="mt-3 text-sm">
                                    {missingData.length === 0
                                        ? "✅ Tidak ada missing"
                                        : `${totalError} error ditemukan`}
                                </p>

                                <button
                                    onClick={() =>
                                        toggle("missing")
                                    }
                                    className="mt-4 text-sm text-yellow-700"
                                >
                                    {openDetail.missing
                                        ? "Tutup"
                                        : "Lihat Detail"}
                                </button>

                                {openDetail.missing &&
                                    missingData.length > 0 && (
                                        <div className="mt-4 bg-white p-3 rounded text-xs">
                                            {Object.entries(
                                                grouped
                                            ).map(
                                                ([row, cols]) => (
                                                    <div
                                                        key={row}
                                                        className="mb-3"
                                                    >
                                                        <strong>
                                                            Row {row}
                                                        </strong>

                                                        <ul className="list-disc ml-5">
                                                            {cols.map(
                                                                (
                                                                    c,
                                                                    i
                                                                ) => (
                                                                    <li
                                                                        key={
                                                                            i
                                                                        }
                                                                    >
                                                                        {
                                                                            c
                                                                        }
                                                                    </li>
                                                                )
                                                            )}
                                                        </ul>
                                                    </div>
                                                )
                                            )}
                                        </div>
                                    )}
                            </div>

                            {/* STATUS */}
                            <div
                                className={`rounded-[4px] p-5 border
                                
                                ${
                                    isValid
                                        ? "bg-green-50 border-green-200"
                                        : "bg-gray-100 border-gray-200"
                                }
                                `}
                            >
                                <h3 className="font-semibold">
                                    Status
                                </h3>

                                <p className="mt-3 text-sm">
                                    {isValid
                                        ? "✅ Data siap diproses"
                                        : "⚠ Perlu diperbaiki"}
                                </p>

                                <button
                                    onClick={() =>
                                        toggle("status")
                                    }
                                    className="mt-4 text-sm"
                                >
                                    {openDetail.status
                                        ? "Tutup"
                                        : "Lihat Detail"}
                                </button>

                                {openDetail.status && (
                                    <div className="mt-4 bg-white p-3 rounded text-xs">
                                        {isValid
                                            ? "Semua validasi lolos"
                                            : "Masih ada error"}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* TABLE */}
                        {columnSummary.length > 0 && (
                            <div className="mt-10 bg-white border rounded-[4px] overflow-hidden">
                                <div className="p-5 border-b">
                                    <h3 className="font-semibold">
                                        Column Summary
                                    </h3>
                                </div>

                                <table className="w-full text-sm">
                                    <thead className="bg-[#D82F5A] text-white">
                                        <tr>
                                            <th className="p-4 text-left">
                                                Column
                                            </th>
                                            <th className="p-4 text-left">
                                                Type
                                            </th>
                                            <th className="p-4 text-left">
                                                Unique
                                            </th>
                                            <th className="p-4 text-left">
                                                Sample
                                            </th>
                                            <th className="p-4 text-left">
                                                Status
                                            </th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {columnSummary.map(
                                            (col, i) => (
                                                <tr
                                                    key={i}
                                                    className="border-b"
                                                >
                                                    <td className="p-4">
                                                        {
                                                            col.column
                                                        }
                                                    </td>

                                                    <td className="p-4">
                                                        {col.type}
                                                    </td>

                                                    <td className="p-4">
                                                        {
                                                            col.uniqueCount
                                                        }
                                                    </td>

                                                    <td className="p-4">
                                                        {col.sample?.join(
                                                            ", "
                                                        )}
                                                    </td>

                                                    <td className="p-4">
                                                        {
                                                            col.status
                                                        }
                                                    </td>
                                                </tr>
                                            )
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        <div className="flex gap-4 mt-10">
                            <button
                                onClick={resetAll}
                                className="px-6 py-3 border border-[#D82F5A] text-[#D82F5A] rounded-[4px]"
                            >
                                Upload File Baru
                            </button>

                            {showNext && (
                                <button
                                    onClick={handleUploadpy}
                                    disabled={loading}
                                    className="px-6 py-3 bg-[#111827] text-white rounded-[4px]"
                                >
                                    {loading
                                        ? "Processing..."
                                        : "Next"}
                                </button>
                            )}
                        </div>
                    </>
                )}
            </main>
        </div>
    );
}