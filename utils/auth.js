import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const useAuth = (options = {}) => {

  const {
    redirect = true,
    requireRole = "user",
    validateServer = false
  } = options;

  const [user, setUser] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {

    const token = localStorage.getItem("token");

    if (!token) {
      if (redirect) navigate("/signup");
      return;
    }

    const fetchUser = async () => {

      try {

        const decoded = jwtDecode(token);

        const now = Date.now() / 1000;

        if (decoded.exp < now) {
          throw new Error("expired");
        }

        if (
          requireRole &&
          decoded.role !== requireRole
        ) {
          navigate("/signup");
          return;
        }

        if (validateServer) {

          await axios.get(
            `${import.meta.env.VITE_BACKEND_URL}/test/ping`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

        }
         const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/auth/me`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setUser({
          ...res.data,
          role: decoded.role
        });

      } catch (error) {

        console.log(error);

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