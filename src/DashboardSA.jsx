import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuthAdmin } from "../utils/authadmin";
import { Line, Bar } from "react-chartjs-2";
import Footer from "./footer";
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
    Filler,
} from "chart.js";
import {
    IconBell,
    IconBellRinging,
    IconChevronDown,
    IconLogout,
    IconUser,
} from "@tabler/icons-react";
import SidebarSA from "./sideBaradmin";
import LogoutAlert from "./logoutConfirm";
import InfoCards from "./infoCards";
import HeaderSA from './HeaderSA';


ChartJS.register(
    CategoryScale, LinearScale, PointElement, LineElement,
    BarElement, ArcElement, Title, Tooltip, Legend, Filler
);

const BASE_URL = `${import.meta.env.VITE_BACKEND_URL}`;

export default function DashboardSA() {
    const user = useAuthAdmin()
    const goto = useNavigate();
    const [imgError, setImgError] = useState(false);
    const [loading, setLoading] = useState(true);
    const [showLogout, setShowLogout] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
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
    const subscriptionAxisLabel = (yLabel, xLabel) => ({
        id: `axis-${yLabel}`,
        afterDatasetsDraw(chart) {
            const { ctx, chartArea } = chart;
            ctx.save();
            ctx.fillStyle = "#616161";
            ctx.font = '600 12px "Plus Jakarta Sans"';
            ctx.fillText("User", chartArea.left - 20, chartArea.top - 25);
            ctx.fillText("Bulan", chartArea.right - 39, chartArea.bottom + 25);
            ctx.restore();
        },
    });
    const [profileData, setProfileData] = useState({ name: "Loading...", role: "Admin" });
    const [profileImg, setProfileImg] = useState({ name: "Loading...", role: "Admin" });

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
    const [chartData, setChartData] = useState({
        revenueChart: null,
        emailChart: null,
        subscriptionChart: null,
    });

    // ── Fetch Profile ────────────────────────
    const fetchProfile = async () => {
        try {
            const token = localStorage.getItem("token");
    
            if (!token) {
                goto("/login", { replace: true });
                return;
            }
    
            const res = await axios.get(
                `${BASE_URL}/api/dashboard/userInfo`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
    
            setProfileData(res.data);
    
        } catch (err) {
            console.error("❌ Error fetch profile:", err);
    
            if (err.response?.status === 401) {
                goto("/login", { replace: true });
            }
    
            setProfileData({
                name: "Gagal Memuat",
                role: "N/A"
            });
    
        } finally {
            setLoading(false);
        }
    };

    // ── Fetch Chart Data dari API ────────────
    const fetchChartData = async () => {
        try {
            const token = localStorage.getItem("token");
            const year = new Date().getFullYear();

            const res = await axios.get(
                `${BASE_URL}/api/dashboard/charts?year=${year}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            const { revenue, email, subscription } = res.data.data;
            console.log(subscription)
            // ── Revenue chart ──
            const revenueChart = {
                labels: revenue.map(r => r.month),
                datasets: [{
                    label: "",
                    data: revenue.map(r => r.value),
                    borderColor: "#D82F5A",
                    backgroundColor: "rgba(216,47,90,0.1)",
                    fill: true,
                    tension: 0.4,
                    pointRadius: 4,
                    pointBackgroundColor: "#D82F5A",
                }],
            };

            // ── Email chart ──
            const emailChart = {
                labels: email.map(e => e.month),
                datasets: [{
                    label: "",
                    data: email.map(e => e.value),
                    borderColor: "#023048",
                    backgroundColor: "rgba(2,48,72,0.1)",
                    fill: true,
                    tension: 0.4,
                    pointRadius: 4,
                    pointBackgroundColor: "#023048",
                }],
            };

            // ── Subscription chart ──
            // Kumpulkan semua bulan unik dari semua tipe
            const allMonths = [...new Set(
                subscription.flatMap(s => s.months.map(m => m.month))
            )];

            const subscriptionChart = {
                labels: allMonths,
                datasets: subscription.map((s, index) => ({
                    label: s.type,
                    data: allMonths.map(month => {
                        const found = s.months.find(m => m.month === month);
                        return found ? found.value : 0;
                    }),

                    backgroundColor:
                        index === 0 ? "#D6B485" :
                            index === 1 ? "#B81B52" :
                                "rgba(245, 158, 11, 0.8)",

                    borderRadius: 10,
                })),
            };

            setChartData({ revenueChart, emailChart, subscriptionChart });

        } catch (err) {
            console.error("❌ Error fetch chart:", err);

            // Fallback dummy kalau API gagal

        }
    };

    useEffect(() => {
        fetchProfile();
        fetchChartData();
    }, []);

    // ── Chart Options ────────────────────────
    const lineOptions = (title) => ({
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: true, position: "top" },
            title: { display: true, text: title, color: "#616161", font: { size: 14, weight: "600" } },
        },
        scales: {
            x: { grid: { display: false } },
            y: { beginAtZero: true, grid: { color: "#F1F5F9" } },
        },
    });

    const barOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { position: "top" },
            title: { display: true, text: "Subscription Activity", color: "#616161", font: { size: 14, weight: "600" } },
        },
        scales: {
            x: { grid: { display: false } },
            y: { beginAtZero: true, grid: { color: "#F1F5F9" } },
        },
    };

    return (
        <main className="bg-[#F9FAFB] min-h-screen font-jakarta">
            <div className="flex">

                {/* SIDEBAR */}
                <SidebarSA />

                {/* MAIN */}
                <div className="flex-1 flex flex-col min-h-screen">

                    {/* HEADER */}
                    <HeaderSA
                        profileData={user}
                        loading={loading}
                        profileImg={profileImg}
                        setShowLogout={setShowLogout}
                    />

                    {showLogout && <LogoutAlert onClose={() => setShowLogout(false)} />}

                    {/* BODY */}
                    <div className="flex-1 overflow-y-auto p-8">

                        {/* HERO */}
                        <div className="bg-[#920428] rounded-2xl overflow-hidden shadow-sm mb-8 flex items-center justify-between">
                            <div className="p-10 text-white flex flex-col justify-start text-left">
                                <p className="font-semibold text-4xl mb-4">Selamat Datang!</p>
                                <p className="font-normal text-xl mb-2">Di Dashboard admin ChurnGuard CRM</p>
                                <p className="font-light text-lg">
                                    Tempat Admin memantau dan mengelola data serta status churn dengan lebih mudah dan terarah.
                                </p>
                            </div>
                            <img
                                src="https://cdn.designfast.io/image/2026-05-10/0467bd0b-b516-4236-aeb5-b74297f5126c.png"
                                alt="dashboard"
                                className="w-56 h-56 object-cover mr-6 hidden md:block"
                            />
                        </div>

                        {/* INFO CARDS */}
                        <InfoCards />

                        {/* LINE CHARTS */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
                            <div className="bg-white border rounded-2xl shadow-sm p-5">
                                <div style={{ height: "320px" }}>
                                    {chartData.revenueChart && (
                                        <Line data={chartData.revenueChart} 
                                            options={{
                                                responsive: true,
                                                maintainAspectRatio: false,
                                                plugins: basePlugin("Revenue Growth"),
                                                layout: { padding: { bottom: 35, left: 20, top: 10, right: 10 } },
                                            }}
                                            plugins={[axisLabel("Rupiah", "Bulan")]}

                                        />
                                    )}
                                </div>
                            </div>
                            <div className="bg-white border rounded-2xl shadow-sm p-5">
                                <div style={{ height: "320px" }}>
                                    {chartData.emailChart && (
                                        <Line data={chartData.emailChart}
                                            options={{
                                                responsive: true,
                                                maintainAspectRatio: false,
                                                plugins: basePlugin("Email Sent"),
                                                layout: { padding: { bottom: 35, left: 20, top: 10, right: 10 } },
                                            }}
                                            plugins={[axisLabel("Emails", "Bulan")]}
                                        />
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* BAR CHART */}
                        <div className="bg-white border rounded-2xl shadow-sm p-5 my-8">
                            <div style={{ height: "340px" }}>
                                {chartData.subscriptionChart && (
                                    <Bar
                                        data={chartData.subscriptionChart}
                                        options={barOptions}
                                        plugins={[subscriptionAxisLabel("User", "Bulan")]} />
                                )}
                            </div>
                        </div>

                    </div>
                </div>
            </div>
            <Footer></Footer>
        </main>
    );
}