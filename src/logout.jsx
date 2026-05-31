import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useNotif } from "./NotificationContext"


export default function Logout() {
  const navigate = useNavigate();
  const { showNotif } = useNotif();

  useEffect(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");

    showNotif("success", "Berhasil logout dari sistem");
    navigate("/login");

  }, []);

  return null;
}
