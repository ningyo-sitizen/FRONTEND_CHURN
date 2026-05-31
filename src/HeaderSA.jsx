import React, { useState } from "react";
import {
    IconChevronDown,
    IconLogout,
    IconUser,
} from "@tabler/icons-react";
import { Link } from "react-router-dom";

const HeaderSA = ({
    profileData,
    loading,
    profileImg,
    setShowLogout,
}) => {
    const [imgError, setImgError] = useState(false);    
    const [isOpen, setIsOpen] = useState(false);

    return (
        <header
            className="h-20 bg-white/80 backdrop-blur-md border-b border-gray-100 flex items-center justify-end px-10 sticky top-0 z-[50]"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
        >

            <div className="flex items-center gap-4">

                <div className="relative border-l border-gray-100 pl-6">

                    <div
                        className="flex items-center gap-3 cursor-pointer group"
                        onClick={() => setIsOpen(!isOpen)}
                    >

                        {/* AVATAR */}
                        <div className="w-10 h-10 rounded-xl overflow-hidden bg-gray-100 ring-1 ring-gray-100 shadow-sm flex items-center justify-center">
                            {profileImg && !imgError ? (
                                <img
                                    src={profileImg}
                                    alt="avatar"
                                    className="w-full h-full object-cover"
                                    onError={() => setImgError(true)}
                                />
                            ) : (
                                <IconUser size={24} className="text-gray-500" />
                            )}
                        </div>

                        {/* TEXT */}
                        <div className="flex flex-col text-left mr-2">
                            <p className="text-[13px] font-semibold text-[#1a1a1a] leading-tight">
                                Hai, {profileData?.name}
                            </p>

                            <p className="text-[11px] text-[#D82F5A] leading-tight">
                                {profileData?.email}
                            </p>
                        </div>

                        <IconChevronDown
                            size={16}
                            className={`text-gray-400 transition-transform duration-300 ${isOpen ? "rotate-180" : ""
                                }`}
                        />
                    </div>

                    {/* DROPDOWN */}
                    {isOpen && (
                        <>
                            <div
                                className="fixed inset-0 z-[-1]"
                                onClick={() => setIsOpen(false)}
                            />

                            <div className="absolute right-0 mt-4 w-72 bg-white rounded-xl shadow-[0px_10px_40px_rgba(0,0,0,0.08)] border border-gray-100 overflow-hidden z-50">

                                <div className="p-5 flex items-center gap-4">

                                    <div className="w-12 h-12 rounded-xl overflow-hidden bg-gray-100 flex items-center justify-center">
                                        {profileImg ? (
                                            <img
                                                src={profileImg}
                                                alt="profile"
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <IconUser size={24} className="text-gray-500" />
                                        )}
                                    </div>

                                    <div className="flex flex-col text-left leading-tight">
                                        <p className="text-sm font-semibold text-[#111827]">
                                            {profileData?.name}
                                        </p>

                                        <p className="text-xs text-[#D82F5A] font-medium">
                                            {profileData?.email}
                                        </p>
                                    </div>
                                </div>

                                <div className="border-b border-gray-100 mx-5"></div>

                                <div className="p-2">

                                    <Link
                                        to="/ProfilePageSA"
                                        onClick={() => setIsOpen(false)}
                                        className="flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-[#FEF5F6] text-[#E2A7B8] hover:text-[#D82F5A] transition-all duration-200 group no-underline"
                                    >
                                        <IconUser
                                            size={22}
                                            className="group-hover:text-[#D82F5A] transition-colors"
                                        />

                                        <span className="text-[13px] font-semibold">
                                            Profile
                                        </span>
                                    </Link>

                                    <button
                                        onClick={() => {
                                            setIsOpen(false);
                                            setShowLogout(true);
                                        }}
                                        className="w-full flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-[#FEF5F6] text-[#E2A7B8] hover:text-red-600 transition-all group"
                                    >
                                        <IconLogout
                                            size={22}
                                            className="group-hover:text-red-600 transition-colors"
                                        />

                                        <span className="text-[13px] font-semibold">
                                            Keluar
                                        </span>
                                    </button>

                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
};

export default HeaderSA;