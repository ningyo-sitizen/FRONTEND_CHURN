import { useState, useEffect } from "react";

export default function Notif({ type, message, onClose }) {
  const [closing, setClosing] = useState(false);
  const isSuccess = type === "success";

  const handleClose = () => {
    setClosing(true);
    setTimeout(() => {
      onClose();
    }, 350); 
  };

  return (
    <>
      <style>{`
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to   { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOut {
          from { transform: translateX(0); opacity: 1; }
          to   { transform: translateX(100%); opacity: 0; }
        }
        .slide-in { animation: slideIn .35s ease-out forwards; }
        .slide-out { animation: slideOut .35s ease-in forwards; }
      `}</style>

      <div
        className={`fixed top-5 right-5 z-[9999] w-[300px] bg-white shadow-xl rounded-md p-4 border-l-4 ${
          closing ? "slide-out" : "slide-in"
        }`}
        style={{ borderColor: isSuccess ? "#4ABC4C" : "#FF3B30" }}
      >
        <div className="flex justify-between items-start">
          <div className="flex gap-3">
            {isSuccess ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28">
                <circle cx="14" cy="14" r="12" fill="#4ABC4C" />
                <path
                  d="M9 14 l3.5 3.5 l7 -7"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28">
                <circle cx="14" cy="14" r="12" fill="#FF3B30" />
                <path
                  d="M9 14 l3.5 3.5 l7 -7"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            )}

            <div>
              <p className="font-semibold text-black text-sm mb-0.5">
                {isSuccess ? "Berhasil!" : "Gagal!"}
              </p>
              <p className="text-xs text-[#9A9A9A]">{message}</p>
            </div>
          </div>

          <button
            onClick={handleClose}
            className="text-black font-bold text-lg hover:text-red-500"
          >
            ×
          </button>
        </div>
      </div>
    </>
  );
}
