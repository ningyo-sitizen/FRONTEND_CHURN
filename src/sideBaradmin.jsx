import React from "react";
import { Link, useLocation } from "react-router-dom";

import {
  IconHome,
  IconChartBar,
  IconHistory,
  IconFileReport,
  IconCashBanknote,
  IconAdjustmentsHorizontal,
  IconBell,
} from "@tabler/icons-react";

const Sidebar = () => {

  const location = useLocation();

  const menuItems = [
    {
      path: "/dashboardSA",
      label: "Dashboard",
      icon: <IconHome size={20} />,
    },

    {
      path: "/user-management",
      label: "User Management",
      icon: <IconChartBar size={20} />,
    },

    {
      path: "/feedbackSA",
      label: "Feedback",
      icon: <IconHistory size={20} />,
    },

    {
      path: "/reports",
      label: "Reports",
      icon: <IconFileReport size={20} />,
    },

    {
      path: "/rekap-payment",
      label: "History Payment",
      icon: <IconCashBanknote size={20} />,
    },

    {
      path: "/pengaturan-tier",
      label: "Pengaturan Tier",
      icon: <IconAdjustmentsHorizontal size={20} />,
    },

    {
      path: "/history-sa",
      label: "Logger",
      icon: <IconBell size={20} />,
    },
  ];

  const getSidebarItemClass = (isActive) => {

    const base =
      "flex items-center gap-3 p-3 rounded-xl font-medium transition-all duration-200 text-sm";

    return isActive
        ? `${base} bg-[#F2EEEF] text-[#D82F5A] font-semibold`
        : `${base} text-[#DA839A] hover:bg-gray-100`;

  };

  return (

    <aside className="w-64 bg-white border-r min-h-screen">

      <div className="flex flex-col h-full">

        {/* LOGO */}
        <div className="flex flex-col items-center">

          <div className="flex items-center gap-4 py-5">

            <div
              className="
                bg-[url('https://cdn.designfast.io/image/2026-05-01/ba3f37fa-e105-4c2b-b1e9-2f72ab10513a.png')]
                w-[70px]
                h-[70px]
                bg-cover
                bg-center
              "
            />

          </div>

          <div className="w-full border-b border-gray-200"></div>

        </div>

        {/* NAVIGATION */}
        <nav className="flex-1 px-5 py-5 space-y-2">

          {menuItems.map((item) => (

            <Link
              key={item.path}
              to={item.path}
              className={getSidebarItemClass(
                location.pathname === item.path
              )}
            >

              {item.icon}

              <span>{item.label}</span>

            </Link>

          ))}

        </nav>

      </div>

    </aside>
  );
};

export default Sidebar;