import { useNavigate } from "react-router-dom";
import { IconLogout } from "@tabler/icons-react";

export default function LogoutAlert({ onClose }) {
  const navigate = useNavigate();

  return (
    <div className="fixed inset-0 bg-[#333333]/60 flex items-center justify-center z-50">
      <div className="bg-white rounded-md w-80 text-center py-6 px-6">
        <div className="w-[55px] h-[55px] bg-[#FFE1E1] mx-28 rounded-full flex items-center justify-center">
          <IconLogout className="text-[#F92B2B]" size={30}></IconLogout>
        </div>

        <p className="text-xl mt-5 font-semibold">Apakah Anda ingin Keluar?</p>
        <p className="text-xs mt-3 font-light">
          Jika kamu keluar, kamu akan keluar dari akun dan perlu login kembali untuk mengakses sistem.
        </p>

        <div className="flex gap-3 justify-center mt-6">
          <button
            onClick={onClose}
            className="px-5 py-1 border border-[#FF1515] bg-[#FFE1E1] rounded-md text-[#FF1515]
                       active:scale-90 transition"
          >
            Batal
          </button>

          <button
            onClick={() => navigate("/logout")}
            className="px-5 py-1 rounded-md bg-[#FF1515] text-white
                       active:scale-90 transition"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
