import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const useAuthAdmin = (options = {}) => {

  const {
    redirect = true,
    requireRole = "admin",
    validateServer = false
  } = options;

  const [user, setUser] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {

    console.log("========== AUTH DEBUG ==========");

    const token = localStorage.getItem("token");

    console.log("TOKEN:", token);

    if (!token) {

      console.log("❌ TOKEN TIDAK ADA");

      if (redirect) navigate("/signup");

      return;
    }

    const fetchUser = async () => {

      try {

        console.log("🔍 DECODING TOKEN...");

        const decoded = jwtDecode(token);

        console.log("✅ DECODED:", decoded);

        const now = Date.now() / 1000;

        console.log("NOW:", now);
        console.log("EXP:", decoded.exp);

        if (decoded.exp < now) {

          console.log("❌ TOKEN EXPIRED");

          throw new Error("expired");
        }

        if (
          requireRole &&
          decoded.role !== requireRole
        ) {

          console.log("❌ ROLE TIDAK SESUAI");
          console.log("EXPECTED:", requireRole);
          console.log("FOUND:", decoded.role);

          navigate("/signup");

          return;
        }

        console.log("✅ ROLE VALID");

        if (validateServer) {

          console.log("🌐 TESTING SERVER CONNECTION...");

          const ping = await axios.get(
            `${import.meta.env.VITE_BACKEND_URL}/test/ping`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          console.log("✅ SERVER PING:", ping.data);

        }

        console.log("🌐 FETCHING /auth/meAdmin");

        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/auth/meAdmin`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log("✅ RESPONSE /auth/meAdmin:", res.data);

        setUser({
          ...res.data,
          role: decoded.role
        });

        console.log("✅ USER SET");

      } catch (error) {

        console.log("========== AUTH ERROR ==========");

        console.log("FULL ERROR:", error);

        console.log("MESSAGE:", error.message);

        console.log("RESPONSE:", error.response);

        console.log("STATUS:", error.response?.status);

        console.log("DATA:", error.response?.data);

        console.log("CONFIG:", error.config);

        console.log("================================");

        localStorage.removeItem("token");

        if (redirect) {
          navigate("/signup");
        }

      }

    };

    fetchUser();

  }, [navigate, redirect, requireRole, validateServer]);

  return user;
};