import { useEffect, useState } from "react";
import axios from "axios";
import {
    IconTrendingUp,
    IconTrendingDown,
    IconUsers,
    IconCashBanknote,
    IconMinus,
} from "@tabler/icons-react";

const BASE_URL = `${import.meta.env.VITE_BACKEND_URL}`;

const formatRp = (val) =>
    "Rp " + Number(val || 0).toLocaleString("id-ID");

function ChangeBadge({ change, suffix = "" }) {
    if (!change || change === 0) {
        return (
            <span className="flex items-center gap-1 text-xs text-gray-400">
                <IconMinus size={12} />
                <span>0 no change</span>
            </span>
        );
    }
    const isUp = change > 0;
    return (
        <span className={`flex items-center gap-1 text-xs font-medium ${isUp ? "text-green-500" : "text-red-500"}`}>
            {isUp ? <IconTrendingUp size={12} /> : <IconTrendingDown size={12} />}
            <span>{isUp ? "+" : ""}{change}{suffix}</span>
        </span>
    );
}

function Card({ icon: Icon, iconBg, iconColor, label, value, change, changeSuffix, note }) {
    return (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col gap-2 min-w-0">
            {/* Icon + Label */}
            <div className="flex items-center gap-2">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${iconBg}`}>
                    <Icon size={18} className={iconColor} />
                </div>
                <span className="text-sm text-gray-500 font-medium truncate">{label}</span>
            </div>

            {/* Value */}
            <p className="text-2xl font-bold text-[#023048] truncate">{value}</p>

            {/* Change + Note */}
            <div className="flex items-center justify-between gap-2 flex-wrap">
                <ChangeBadge change={change} suffix={changeSuffix} />
                <span className="text-xs text-gray-400 text-right shrink-0">{note}</span>
            </div>
        </div>
    );
}

export default function InfoCards() {
    const [data,        setData]        = useState(null);
    const [loading,     setLoading]     = useState(true);
    const [lastUpdated, setLastUpdated] = useState("");

    useEffect(() => {
        const fetchSummary = async () => {
            try {
                const token = localStorage.getItem("token");
                const res   = await axios.get(`${BASE_URL}/api/dashboard/summary`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setData(res.data.data);
                setLastUpdated(
                    new Date().toLocaleString("id-ID", {
                        day: "2-digit", month: "numeric", year: "numeric",
                        hour: "2-digit", minute: "2-digit", second: "2-digit",
                    })
                );
            } catch (err) {
                console.error("InfoCards fetch error:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchSummary();
    }, []);

    if (loading) {
        return (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-2">
                {[...Array(3)].map((_, i) => (
                    <div key={i} className="bg-white rounded-2xl border border-gray-100 p-5 h-[110px] animate-pulse" />
                ))}
            </div>
        );
    }

    const cards = [
        {
            icon:         IconCashBanknote,
            iconBg:       "bg-purple-100",
            iconColor:    "text-purple-500",
            label:        "Total MRR",
            value:        formatRp(data?.mrr?.value),
            change:       data?.mrr?.change,
            changeSuffix: "%",
            note:         "generated this month",
        },
        {
            icon:         IconTrendingUp,
            iconBg:       "bg-pink-100",
            iconColor:    "text-pink-500",
            label:        "Total ARR",
            value:        formatRp(data?.arr?.value),
            change:       data?.arr?.change,
            changeSuffix: "%",
            note:         "compared to last year",
        },
        {
            icon:         IconUsers,
            iconBg:       "bg-green-100",
            iconColor:    "text-green-500",
            label:        "Total Subs",
            value:        Number(data?.totalSubs?.value ?? 0).toLocaleString("id-ID"),
            change:       data?.totalSubs?.change,
            changeSuffix: "",
            note:         "active subscribers",
        },
    ];

    return (
        <div className="mb-2">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {cards.map((c, i) => <Card key={i} {...c} />)}
            </div>
            {lastUpdated && (
                <p className="text-right text-[11px] text-gray-400 mt-2">
                    Terakhir diperbarui: {lastUpdated}
                </p>
            )}
        </div>
    );
}