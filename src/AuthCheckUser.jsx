import { useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

export default function AuthCheck() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login-register");
      return;
    }
    
    try {
      const decoded = jwtDecode(token);
      const now = Date.now() / 1000;
      if (decoded.exp < now) {
        throw new Error("Token expired");
      }
      if (decoded.role === "admin"){
        throw new Eror("admin tidak bisa mengakses page ini")
      }
      navigate("/login-success",{ replace: true });

    } catch (err) {
      localStorage.removeItem("token");
      navigate("/login-register");
    }
  }, [navigate]);

  return <p>Checking authentication...</p>;
}