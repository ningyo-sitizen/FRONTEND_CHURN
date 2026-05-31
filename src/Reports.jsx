import { Line, Bar, Doughnut } from 'react-chartjs-2';
import AppLayout from './AppLayout';
import axios from 'axios';
import SidebarSA from "./sideBaradmin";
import LogoutAlert from "./logoutConfirm";
import jsPDF from "jspdf";
import CardDashboard from "./cardDashboard";
import { useAuthAdmin } from '../utils/authadmin';
import Footer from './Footer';

import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { useNavigate } from "react-router-dom";
import {
    IconBell,
    IconBellRinging,
    IconLogout,
    IconUser,
    IconChevronDown,
    IconMenu2,
    IconFileTypePdf,
    IconFileTypeCsv,
} from "@tabler/icons-react";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { useState, useEffect } from 'react';
import HeaderSA from './HeaderSA';
ChartJS.register(
    CategoryScale, LinearScale, PointElement, LineElement,
    BarElement, ArcElement, Title, Tooltip, Legend
);

// ── Warna brand ──────────────────────────────
const BRAND = "#D82F5A";
const BRAND_LIGHT = "#E48CA3";
const BRAND_MID = "#C91F5B";
const API_URL = `${import.meta.env.VITE_BACKEND_URL}`;

export default function Reports() {
    const goto = useNavigate();
    const user = useAuthAdmin()
    const [showLogout, setShowLogout] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [profileImg, setProfileImg] = useState({ name: "Loading...", role: "Admin" });
    const [profileData, setProfileData] = useState({ name: "Loading...", role: "Admin" });

    // ── Data state ───────────────────────────
    const [summary, setSummary] = useState(null);
    const [revenue, setRevenue] = useState(null);
    const [prediction, setPrediction] = useState(null);
    const [feedback, setFeedback] = useState(null);
    const [loading, setLoading] = useState(true);

    const toggleDropdown = () => setIsDropdownOpen(p => !p);
    const toggleSidebar = () => setIsSidebarOpen(p => !p);

    // ── Fetch semua data ─────────────────────
    useEffect(() => {
        
        const token      = localStorage.getItem("token");
        const userString = localStorage.getItem("user");
    
        if (!token) { goto("/login"); return; }
        
        const headers = { Authorization: `Bearer ${token}` };
    
        const fetchAll = async () => {
            try {
                const [summRes, revRes, predRes, fbRes] = await Promise.all([
                    axios.get(`${API_URL}/api/reports/summary`,    { headers }),
                    axios.get(`${API_URL}/api/reports/revenue`,    { headers }),
                    axios.get(`${API_URL}/api/reports/prediction`, { headers }),
                    axios.get(`${API_URL}/api/reports/feedback`,   { headers }),
                ]);
    
                setSummary(summRes.data.data);
                setRevenue(revRes.data.data);
                setPrediction(predRes.data.data);
                setFeedback(fbRes.data.data);
            } catch (err) {
                console.error("Gagal fetch reports:", err);
                if (err.response?.status === 401) {
                    localStorage.removeItem("token");
                    localStorage.removeItem("user");
                    goto("/login");
                }
            } finally {
                setLoading(false);
            }
        };
    
        fetchAll();
    }, [goto]);

    // ── Chart: Revenue line ──────────────────
    const revenueChartData = revenue ? {
        labels: revenue.monthlyRevenue.map(r => r.month),
        datasets: [{
            label: "",
            data: revenue.monthlyRevenue.map(r => r.total_revenue),
            borderColor: BRAND,
            fill: true,
            backgroundColor: "rgba(216,47,90,0.25)",  // ← naikkan opacity-nya
            tension: 0.4,
            pointRadius: 4,        // ← kasih titik biar keliatan
            pointBackgroundColor: BRAND,
            pointHoverRadius: 6,
        }],
    } : null;


    // ── Chart: Email sent (dari prediction_detail) ──
    const emailChartData = prediction ? {
        labels: prediction.emailMonthly.map(e => e.month),
        datasets: [{
            label: "Email Sent",
            data: prediction.emailMonthly.map(e => e.total_sent),
            backgroundColor: BRAND_LIGHT,
            borderColor: BRAND_LIGHT,
            borderWidth: 2,
            borderRadius: 14,
            borderSkipped: false,
            hoverBackgroundColor: BRAND_MID,
            barThickness: 38,
            maxBarThickness: 42,
        }],
    } : null;

    // ── Chart: Genre churn (bar) ─────────────
    const genreChartData = prediction ? {
        labels: prediction.genreChurn.map(g => g.genre),
        datasets: [{
            label: "Churn %",
            data: prediction.genreChurn.map(g => g.churn_percentage),
            backgroundColor: BRAND_MID,
            borderRadius: 8,
        }],
    } : null;

    // ── Chart: Feedback doughnut ─────────────
    const feedbackChartData = feedback ? (() => {
        const keluhan = feedback.byTopik.find(t => t.topik?.toLowerCase().includes("keluhan"));
        const pujian = feedback.byTopik.find(t => t.topik?.toLowerCase().includes("pujian"));
        const kPct = keluhan ? parseFloat(keluhan.percentage) : 0;
        const pPct = pujian ? parseFloat(pujian.percentage) : 0;
        const rest = Math.max(0, 100 - kPct - pPct);
        return {
            labels: ["Keluhan", "Pujian", "Lainnya"],
            datasets: [{
                data: [kPct, pPct, rest],
                backgroundColor: [BRAND_MID, BRAND_LIGHT, "#F5E2E8"],
                borderWidth: 0,
                hoverOffset: 8,
                cutout: "70%",
            }],
        };
    })() : null;

    // ── Chart options ────────────────────────
    const basePlugin = (titleText) => ({
        legend: { display: false },
        title: {
            display: true,
            text: titleText,
            color: "#616161",
            font: { family: '"Plus Jakarta Sans", sans-serif', size: 11, weight: "300" },
            padding: { top: 10, bottom: 20 },
        },
    });

    const axisLabel = (yLabel, xLabel) => ({
        id: `axis-${yLabel}`,
        afterDatasetsDraw(chart) {
            const { ctx, chartArea } = chart;
            ctx.save();
            ctx.fillStyle = "#616161";
            ctx.font = '600 12px "Plus Jakarta Sans"';
            ctx.fillText(yLabel, chartArea.left - 40, chartArea.top - 18);
            ctx.fillText(xLabel, chartArea.right - 30, chartArea.bottom + 40);
            ctx.restore();
        },
    });

    //INFO CARD//
    const cards = summary ? [
        {
            label: "Revenue Bulan Ini",
            value: `Rp ${Number(summary.revenue).toLocaleString("id-ID")}`,
            color: "bg-pink-50 text-[#B2153D]"
        },
        {
            label: "User Aktif",
            value: summary.activeUsers,
            color: "bg-blue-50 text-blue-700"
        },
        {
            label: "Feedback Bulan Ini",
            value: summary.feedbackThisMonth,
            color: "bg-green-50 text-green-700"
        }
    ] : [];

    // ================= EXPORT PDF =================
const handleExportPDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();

    doc.setFillColor(201, 31, 91);
    doc.rect(0, 0, pageWidth, 28, "F");

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("Reports Admin", 14, 12);

    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.text("Laporan Analisis", 14, 20);

    const now = new Date();
    const dateStr = now.toLocaleDateString("id-ID", { day: "2-digit", month: "long", year: "numeric" });
    doc.text(`Dicetak: ${dateStr}`, pageWidth - 14, 20, { align: "right" });
    doc.setTextColor(0, 0, 0);

    const sectionTitle = (y, text) => {
        doc.setFillColor(245, 226, 232);
        doc.rect(14, y, pageWidth - 28, 8, "F");
        doc.setFont("helvetica", "bold");
        doc.setFontSize(10);
        doc.setTextColor(201, 31, 91);
        doc.text(text, 16, y + 5.5);
        doc.setTextColor(0, 0, 0);
        return y + 12;
    };

    const tableStyles = {
        headStyles: { fillColor: [201, 31, 91], textColor: 255, fontStyle: "bold", fontSize: 9 },
        bodyStyles: { fontSize: 9, textColor: [60, 60, 60] },
        alternateRowStyles: { fillColor: [255, 244, 247] },
        margin: { left: 14, right: 14 },
        styles: { cellPadding: 3 },
    };

    // 1. Summary
    let y = sectionTitle(34, "1. Ringkasan Umum");
    autoTable(doc, {
        startY: y,
        head: [["Kategori", "Nilai"]],
        body: [
            ["Revenue Bulan Ini", `Rp ${Number(summary?.revenue || 0).toLocaleString("id-ID")}`],
            ["User Aktif", summary?.activeUsers || 0],
            ["Feedback Bulan Ini", summary?.feedbackThisMonth || 0],
        ],
        ...tableStyles,
        columnStyles: { 0: { cellWidth: 80 } },
    });

    // 2. Revenue
    y = sectionTitle(doc.lastAutoTable.finalY + 10, "2. Revenue Bulanan");
    autoTable(doc, {
        startY: y,
        head: [["Bulan", "Revenue (Rp)", "Jumlah Transaksi"]],
        body: revenue?.monthlyRevenue.map(item => [
            item.month,
            Number(item.total_revenue).toLocaleString("id-ID"),
            item.total_transaksi,
        ]) || [],
        ...tableStyles,
        columnStyles: { 1: { halign: "right" }, 2: { halign: "center" } },
    });

    // 3. Email Sent  ← section baru
    y = sectionTitle(doc.lastAutoTable.finalY + 10, "3. Email Terkirim per Bulan");
    autoTable(doc, {
        startY: y,
        head: [["Bulan", "Jumlah Email Terkirim"]],
        body: prediction?.emailMonthly.map(item => [
            item.month,
            item.total_sent,
        ]) || [],
        ...tableStyles,
        columnStyles: { 1: { halign: "center" } },
    });

    // 4. Feedback
    y = sectionTitle(doc.lastAutoTable.finalY + 10, "4. Feedback Pengguna");
    autoTable(doc, {
        startY: y,
        head: [["Topik", "Persentase (%)"]],
        body: feedback?.byTopik.map(item => [
            item.topik,
            `${item.percentage}%`,
        ]) || [],
        ...tableStyles,
        columnStyles: { 1: { halign: "center" } },
    });

    // 5. Perilaku Pengguna
    if (prediction?.userBehavior) {
        y = sectionTitle(doc.lastAutoTable.finalY + 10, "5. Perilaku Pengguna");
        autoTable(doc, {
            startY: y,
            head: [["Metrik", "Nilai"]],
            body: [
                ["Avg Usia Akun",          `${prediction.userBehavior.avg_account_age} hari`],
                ["Avg Jam Tonton/Minggu",  `${prediction.userBehavior.avg_viewing_hours} jam`],
                ["Avg Durasi Tonton",      `${prediction.userBehavior.avg_viewing_duration} menit`],
                ["Avg Biaya Bulanan",      `Rp ${Number(prediction.userBehavior.avg_monthly_charges).toLocaleString("id-ID")}`],
                ["Avg Probabilitas",       `${(prediction.userBehavior.avg_churn_probability * 100).toFixed(1)}%`],
            ],
            ...tableStyles,
            columnStyles: { 0: { cellWidth: 80 } },
        });
    }

    // Footer
    const totalPages = doc.internal.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i);
        doc.setDrawColor(201, 31, 91);
        doc.setLineWidth(0.5);
        doc.line(14, doc.internal.pageSize.getHeight() - 12, pageWidth - 14, doc.internal.pageSize.getHeight() - 12);
        doc.setFontSize(8);
        doc.setTextColor(150);
        doc.text("Reports Admin – Laporan Analisis", 14, doc.internal.pageSize.getHeight() - 6);
        doc.text(`Halaman ${i} / ${totalPages}`, pageWidth - 14, doc.internal.pageSize.getHeight() - 6, { align: "right" });
    }

    doc.save("Laporan_Analisis.pdf");
};

// ================= EXPORT EXCEL =================
const handleExportExcel = () => {
    const wb = XLSX.utils.book_new();

    const headerStyle = {
        font: { bold: true, color: { rgb: "FFFFFF" }, sz: 11 },
        fill: { fgColor: { rgb: "C91F5B" } },
        alignment: { horizontal: "center", vertical: "center" },
        border: {
            top:    { style: "thin", color: { rgb: "C91F5B" } },
            bottom: { style: "thin", color: { rgb: "C91F5B" } },
            left:   { style: "thin", color: { rgb: "C91F5B" } },
            right:  { style: "thin", color: { rgb: "C91F5B" } },
        },
    };

    const titleStyle = {
        font: { bold: true, sz: 13, color: { rgb: "C91F5B" } },
        alignment: { horizontal: "left" },
    };

    const subStyle = {
        font: { sz: 9, italic: true, color: { rgb: "888888" } },
    };

    const addTitleRows = (ws, title, sub, colCount) => {
        const titleRow = Array(colCount).fill(null);
        titleRow[0] = { v: title, t: "s", s: titleStyle };
        XLSX.utils.sheet_add_aoa(ws, [titleRow], { origin: "A1" });

        const subRow = Array(colCount).fill(null);
        subRow[0] = { v: sub, t: "s", s: subStyle };
        XLSX.utils.sheet_add_aoa(ws, [subRow], { origin: "A2" });

        XLSX.utils.sheet_add_aoa(ws, [[""]], { origin: "A3" });
    };

    const now = new Date();
    const dateStr = now.toLocaleDateString("id-ID", { day: "2-digit", month: "long", year: "numeric" });
    const subtitle = `Reports Admin  |  Laporan Analisis  |  ${dateStr}`;

    // Sheet: Summary
    const wsSummary = XLSX.utils.aoa_to_sheet([]);
    addTitleRows(wsSummary, "Reports Admin – Ringkasan Umum", subtitle, 2);
    XLSX.utils.sheet_add_aoa(wsSummary, [
        [{ v: "Kategori", s: headerStyle }, { v: "Nilai", s: headerStyle }],
        ["Revenue Bulan Ini", `Rp ${Number(summary?.revenue || 0).toLocaleString("id-ID")}`],
        ["User Aktif", summary?.activeUsers || 0],
        ["Feedback Bulan Ini", summary?.feedbackThisMonth || 0],
    ], { origin: "A4" });
    wsSummary["!cols"] = [{ wch: 28 }, { wch: 22 }];
    XLSX.utils.book_append_sheet(wb, wsSummary, "Summary");

    // Sheet: Revenue
    const wsRevenue = XLSX.utils.aoa_to_sheet([]);
    addTitleRows(wsRevenue, "Reports Admin – Revenue Bulanan", subtitle, 3);
    XLSX.utils.sheet_add_aoa(wsRevenue, [
        [
            { v: "Bulan",            s: headerStyle },
            { v: "Revenue (Rp)",     s: headerStyle },
            { v: "Jumlah Transaksi", s: headerStyle },
        ],
        ...(revenue?.monthlyRevenue.map(item => [
            item.month,
            Number(item.total_revenue),
            item.total_transaksi,
        ]) || []),
    ], { origin: "A4" });
    wsRevenue["!cols"] = [{ wch: 16 }, { wch: 20 }, { wch: 18 }];
    XLSX.utils.book_append_sheet(wb, wsRevenue, "Revenue");

    // Sheet: Email Sent  ← sheet baru, gantikan Genre
    const wsEmail = XLSX.utils.aoa_to_sheet([]);
    addTitleRows(wsEmail, "Reports Admin – Email Terkirim", subtitle, 2);
    XLSX.utils.sheet_add_aoa(wsEmail, [
        [{ v: "Bulan", s: headerStyle }, { v: "Jumlah Email Terkirim", s: headerStyle }],
        ...(prediction?.emailMonthly.map(item => [item.month, item.total_sent]) || []),
    ], { origin: "A4" });
    wsEmail["!cols"] = [{ wch: 16 }, { wch: 24 }];
    XLSX.utils.book_append_sheet(wb, wsEmail, "Email Terkirim");

    // Sheet: Feedback
    const wsFeedback = XLSX.utils.aoa_to_sheet([]);
    addTitleRows(wsFeedback, "Reports Admin – Feedback Pengguna", subtitle, 2);
    XLSX.utils.sheet_add_aoa(wsFeedback, [
        [{ v: "Topik", s: headerStyle }, { v: "Persentase (%)", s: headerStyle }],
        ...(feedback?.byTopik.map(item => [item.topik, item.percentage]) || []),
    ], { origin: "A4" });
    wsFeedback["!cols"] = [{ wch: 22 }, { wch: 16 }];
    XLSX.utils.book_append_sheet(wb, wsFeedback, "Feedback");

    // Sheet: Perilaku Pengguna
    if (prediction?.userBehavior) {
        const wsPerilaku = XLSX.utils.aoa_to_sheet([]);
        addTitleRows(wsPerilaku, "Reports Admin – Perilaku Pengguna", subtitle, 2);
        XLSX.utils.sheet_add_aoa(wsPerilaku, [
            [{ v: "Metrik", s: headerStyle }, { v: "Nilai", s: headerStyle }],
            ["Avg Usia Akun",         `${prediction.userBehavior.avg_account_age} hari`],
            ["Avg Jam Tonton/Minggu", `${prediction.userBehavior.avg_viewing_hours} jam`],
            ["Avg Durasi Tonton",     `${prediction.userBehavior.avg_viewing_duration} menit`],
            ["Avg Biaya Bulanan",     `Rp ${Number(prediction.userBehavior.avg_monthly_charges).toLocaleString("id-ID")}`],
            ["Avg Probabilitas",      `${(prediction.userBehavior.avg_churn_probability * 100).toFixed(1)}%`],
        ], { origin: "A4" });
        wsPerilaku["!cols"] = [{ wch: 28 }, { wch: 22 }];
        XLSX.utils.book_append_sheet(wb, wsPerilaku, "Perilaku Pengguna");
    }

    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const file = new Blob([excelBuffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    saveAs(file, "Laporan_Analisis.xlsx");
};

    return (
        <main className="font-jakarta bg-[#F9FAFB] min-h-screen overflow-hidden">
            <div className="flex h-full">

                {/* ── SIDEBAR (desktop sticky, mobile overlay) ── */}
                <SidebarSA />

                {/* mobile overlay sidebar */}
                <aside
                    className={`fixed inset-y-0 left-0 z-40 w-64 bg-white border-r transform transition-transform duration-300
                        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:hidden`}
                >
                    <SidebarSA />
                </aside>
                {isSidebarOpen && (
                    <div className="fixed inset-0 bg-black opacity-50 z-30 lg:hidden" onClick={toggleSidebar} />
                )}

                {/* ── MAIN ── */}
                <div className="flex-1 flex flex-col h-screen">

                    {/* HEADER */}
                   <HeaderSA
                        profileData={user}
                        loading={loading}
                        profileImg={user?.name}
                        setShowLogout={setShowLogout}
                    />

                    {showLogout && <LogoutAlert onClose={() => setShowLogout(false)} />}

                    {/* CONTENT */}
                    <div className="flex-1 overflow-y-auto">
                        <div className="p-8">

                            <p className="font-semibold text-xl text-left text-black mb-4">
                                Laporan – Analisis Churn
                            </p>

                            {/* Export */}
                            <div className='flex justify-end gap-2 mb-2'>
                                <button
                                    onClick={handleExportPDF}
                                    className="hover:scale-110 transition"
                                >
                                    <IconFileTypePdf color="#FF1515" />
                                </button>

                                <button
                                    onClick={handleExportExcel}
                                    className="hover:scale-110 transition"
                                >
                                    <IconFileTypeCsv color="#4ABC4C" />
                                </button>
                            </div>


                            {/* Info Cards */}
                            {loading ? (
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                                    {[...Array(4)].map((_, i) => (
                                        <div key={i} className="bg-white rounded-lg border border-[#EDEDED] p-4 animate-pulse h-20" />
                                    ))}
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                                    {cards.map((c, i) => (
                                        <div key={i} className={`rounded-lg border border-[#EDEDED] p-4 ${c.color}`}>
                                            <p className="text-xs font-medium opacity-70">{c.label}</p>
                                            <p className="text-xl font-bold mt-1">{c.value}</p>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* ── ROW 1: Revenue + Email | Genre table ── */}
                            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 lg:gap-6">

                                {/* Kiri: Revenue + Email charts */}
                                <div className="lg:col-span-2 ">
                                    <div className="shadow-sm border border-[#EDEDED] bg-white p-6 w-full overflow-x-auto rounded-sm">
                                        {revenueChartData ? (
                                            <div style={{ height: 300 }}>
                                                <Line
                                                    data={revenueChartData}
                                                    options={{
                                                        responsive: true,
                                                        maintainAspectRatio: false,
                                                        plugins: basePlugin("Revenue Growth"),
                                                        layout: { padding: { bottom: 35, left: 20, top: 10, right: 10 } },
                                                    }}
                                                    plugins={[axisLabel("Rupiah", "Bulan")]}
                                                />
                                            </div>
                                        ) : <div className="h-72 bg-gray-100 rounded animate-pulse" />}
                                    </div>


                                </div>
                                <div className="lg:col-span-2">
                                    <div className="shadow-sm border border-[#EDEDED] bg-white p-6 w-full overflow-x-auto rounded-sm">
                                        {emailChartData ? (
                                            <div style={{ height: 300 }}>
                                                <Line
                                                    data={emailChartData}
                                                    options={{
                                                        responsive: true,
                                                        maintainAspectRatio: false,
                                                        plugins: basePlugin("Email Sent"),
                                                        layout: { padding: { bottom: 35, left: 20, top: 10, right: 10 } },
                                                    }}
                                                    plugins={[axisLabel("Emails", "Bulan")]}
                                                />
                                            </div>
                                        ) : <div className="h-72 bg-gray-100 rounded animate-pulse" />}
                                    </div>
                                </div>


                            </div>

                            {/* ── ROW 2: Feedback + Perilaku Pengguna ── */}
                            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 lg:gap-6 mt-8">

                                {/* Kiri: Feedback table + doughnut */}
                                <div className="lg:col-span-2">
                                    <div className="shadow-sm border border-[#EDEDED] bg-white p-4 rounded-sm">
                                        <h3 className="text-sm font-semibold mb-4">Feedback</h3>
                                        <table className="min-w-full border-collapse">
                                            <thead>
                                                <tr className="bg-[#C91F5B] text-white">
                                                    <th className="px-6 py-4 text-sm font-semibold text-left">Topik</th>
                                                    <th className="px-6 py-4 text-sm font-semibold text-center">Tingkat Feedback</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {feedback?.byTopik.map((item, i) => (
                                                    <tr key={i} className="transition-all duration-200 hover:bg-[#FFF4F7] border-b border-[#F7DCE4]">
                                                        <td className="px-6 py-4">
                                                            <div className="flex items-center gap-2">
                                                                <div className="w-2 h-2 rounded-full bg-[#C91F5B]" />
                                                                <span className="text-sm font-medium text-[#555]">{item.topik}</span>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 text-center">
                                                            <div className="flex items-center justify-center gap-3">
                                                                <div className="w-[120px] h-2 rounded-full bg-[#F5E2E8] overflow-hidden">
                                                                    <div
                                                                        className="h-full rounded-full bg-gradient-to-r from-[#C91F5B] to-[#E58CAB]"
                                                                        style={{ width: `${item.percentage}%` }}
                                                                    />
                                                                </div>
                                                                <span className="text-sm font-semibold text-[#C91F5B] min-w-[40px]">
                                                                    {item.percentage}%
                                                                </span>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>

                                        {feedbackChartData && (
                                            <div className="mt-4" style={{ height: 200 }}>
                                                <Doughnut
                                                    data={feedbackChartData}
                                                    options={{
                                                        responsive: true,
                                                        maintainAspectRatio: false,
                                                        animation: { animateRotate: true, animateScale: true, duration: 1800, easing: "easeOutQuart" },
                                                        plugins: {
                                                            legend: { position: "bottom", labels: { usePointStyle: true, pointStyle: "circle", padding: 20 } },
                                                            tooltip: { backgroundColor: "#fff", titleColor: BRAND_MID, bodyColor: "#555", borderColor: "#F3D5DE", borderWidth: 1, padding: 12, cornerRadius: 12 },
                                                        },
                                                        cutout: "72%",
                                                    }}
                                                />
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Kanan: Perilaku pengguna */}
                                <div className="lg:col-span-2">
                                    <div className="shadow-sm border border-[#EDEDED] bg-white p-4 rounded-sm h-full">
                                        <h3 className="text-sm font-semibold mb-4">Perilaku Pengguna</h3>
                                        <table className="min-w-full border-collapse">
                                            <thead>
                                                <tr className="bg-[#C91F5B] text-white">
                                                    <th className="px-6 py-4 text-sm font-semibold text-left">Kategori</th>
                                                    <th className="px-6 py-4 text-sm font-semibold text-left">Keaktifan</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {prediction?.userBehavior ? (
                                                    <>
                                                        {[
                                                            ["Avg Usia Akun", `${prediction.userBehavior.avg_account_age} hari`],
                                                            ["Avg Jam Tonton/Minggu", `${prediction.userBehavior.avg_viewing_hours} jam`],
                                                            ["Avg Durasi Tonton", `${prediction.userBehavior.avg_viewing_duration} menit`],
                                                            ["Avg Biaya Bulanan", `Rp ${Number(prediction.userBehavior.avg_monthly_charges).toLocaleString("id-ID")}`],
                                                            ["Avg Probabilitas Churn", `${(prediction.userBehavior.avg_churn_probability * 100).toFixed(1)}%`],
                                                        ].map(([label, val], i) => (
                                                            <tr key={i} className="transition-all hover:bg-[#FFF4F7] border-b border-[#F7DCE4] text-left">
                                                                <td className="px-6 py-4 text-sm text-[#444]">{label}</td>
                                                                <td className="px-6 py-4 text-sm font-medium text-[#C91F5B]">{val}</td>
                                                            </tr>
                                                        ))}
                                                    </>
                                                ) : (
                                                    <tr><td colSpan={2} className="px-6 py-4 text-sm text-gray-400">Loading...</td></tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>

                    <Footer></Footer>
                    </div>
                </div>
            </div>
        </main>
    );
}