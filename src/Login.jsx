import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useNotif } from "./NotificationContext";
import { IconEye, IconEyeOff, IconMail, IconLock, IconArrowLeft} from "@tabler/icons-react";
import { jwtDecode } from "jwt-decode";


function Login() {
  const { showNotif } = useNotif();

  const navigate = useNavigate();
  const location = useLocation();

  const isSignup = location.pathname === "/SignUp";

  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [failedLogin, setFailedLogin] = useState("");

  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // SHOW/HIDE PASSWORD
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // GOOGLE POPUP
  const openPopup = (url) => {
    const width = 500;
    const height = 600;

    const left = window.screenX + (window.innerWidth - width) / 2;
    const top = window.screenY + (window.innerHeight - height) / 2;

    window.open(
      url,
      "Google OAuth",
      `width=${width},height=${height},top=${top},left=${left}`
    );
  };

  // LOGIN NORMAL
  const handleLogin = async (e) => {
    e.preventDefault();

    if (!name || !password) {
      setFailedLogin("*Harap input username dan password");
      return;
    }

    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: name,
          pass: password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setFailedLogin(data.message);
        return;
      }

      localStorage.setItem("token", data.token);

      if (rememberMe) {
        localStorage.setItem("remember_name", name);
        localStorage.setItem("remember_password", password);
      } else {
        localStorage.removeItem("remember_name");
        localStorage.removeItem("remember_password");
      }

      showNotif("success", "Login berhasil!");


      const decoded = jwtDecode(data.token);

      console.log(decoded)


      if (decoded.role === "admin") {
        navigate("/dashboardSa", { replace: true });
      } else {
        navigate("/dashboardUser", { replace: true });
      }

    } catch (err) {
      console.log("Login failed:", err);

      setFailedLogin(
        "*Terjadi kesalahan saat login, silahkan coba lagi"
      );
    }
  };

  // REMEMBER ME
  useEffect(() => {
    console.log(`${import.meta.env.VITE_BACKEND_URL}`)
    const savedName = localStorage.getItem("remember_name");
    const savedPw = localStorage.getItem("remember_password");

    if (savedName && savedPw) {
      setName(savedName);
      setPassword(savedPw);
      setRememberMe(true);
    }
  }, []);

  useEffect(() => {
    
    const params = new URLSearchParams(window.location.search);
    const error = params.get("error");

    if (error === "cancelled") {
      console.log("User cancel login");
      window.close();
    }
    const frontend_url = `${import.meta.env.VITE_BACKEND_URL}`
    const handleMessage = (event) => {
      if (
        event.origin !== frontend_url &&
        !event.origin.includes("railway.app")
      ) {
        return;
      }

      const { token } = event.data;

      if (token) {
        localStorage.setItem("token", token);

        console.log("Google Token:", token);

        navigate("/dashboardUser");
      }

      if (event.data?.error) {
        showNotif("err", event.data.error)
        console.log("Error:", event.data.error);
      }
    };

    window.addEventListener("message", handleMessage);

    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, [navigate]);

  return (
 <main className="w-full min-h-screen font-jakarta mx-auto bg-gradient-to-b from-white to-[#F6EAEC] relative overflow-hidden">      {/* BACKGROUND */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 
        w-[900px] h-[900px] 
        bg-[linear-gradient(rgba(0,0,0,0.04)_2px,transparent_2px),linear-gradient(90deg,rgba(0,0,0,0.04)_1px,transparent_1px)] 
        bg-[size:32px_32px] 
        [mask-image:radial-gradient(circle_at_center,black_25%,transparent_70%)] 
        pointer-events-none z-0"
      />

      <div className="relative flex flex-col lg:flex-row min-h-screen z-10">
        {/* LEFT SIDE (Hanya muncul di desktop lg keatas) */}
        <section className="hidden lg:flex flex-1 relative flex-col justify-center items-start text-center">
          <div className="flex flex-col gap-3 items-start lg:pl-20">
            {/* LOGO */}
            <div className="bg-[url('https://cdn.designfast.io/image/2026-05-01/ba3f37fa-e105-4c2b-b1e9-2f72ab10513a.png')] w-[90px] h-[90px] bg-cover bg-center absolute top-[30px]" />

            {/* ILLUSTRATION */}
            <div className="flex flex-col items-center justify-center mt-20 self-center">
              <div className="bg-[url('https://cdn.designfast.io/image/2026-05-07/0c45e1a2-3eca-4cf0-8825-7e33b2f77ffd.png')] w-[300px] h-[300px] bg-cover bg-center" />
            </div>

            {/* TAGLINE */}
            <p className="text-sm justify-start text-[#D82F5A] bg-[#FEF5F6] border border-[#D82F5A] px-4 py-1 rounded-full">
              Predict the Unpredictable
            </p>

            {/* TITLE & DESCRIPTION */}
            <div className="text-left py-2 flex flex-col items-start">
              <p className="text-3xl font-semibold text-gray-800">
                Siap cegah churn hari ini bersama
              </p>

              <p className="text-3xl font-semibold text-[#D82F5A]">
                ChurnGuard CRM?
              </p>

              <p className="text-sm text-[#929191] mt-4 max-w-sm">
                Masuk untuk mendeteksi risiko churn lebih awal dan amankan pertumbuhan bisnismu hari ini.
              </p>

              {/* TOMBOL KEMBALI DESKTOP */}
              <button
                type="button"
                onClick={() => navigate("/")}
                className="mt-6 flex items-center gap-2 text-xs text-gray-400 hover:text-[#D82F5A] transition-colors duration-200 group cursor-pointer"
              >
                <IconArrowLeft size={16} className="transform group-hover:-translate-x-0.5 transition-transform" />
                <span>Kembali ke Beranda</span>
              </button>
            </div>
          </div>
        </section>

        {/* RIGHT SIDE (Card Login yang adaptif di Mobile & Desktop) */}
        <div className="flex-1 flex flex-col justify-center items-center min-h-screen lg:ml-40 z-10 px-4 py-8 relative">

          {/* TOMBOL KEMBALI MOBILE (Hanya muncul di mobile/tablet < lg) */}
          <div className="w-full max-w-lg mb-4 flex lg:hidden">
            <button
              type="button"
              onClick={() => navigate("/")}
              className="flex items-center gap-2 text-xs text-gray-400 hover:text-[#D82F5A] transition-colors duration-200 group cursor-pointer"
            >
              <IconArrowLeft size={16} className="transform group-hover:-translate-x-0.5 transition-transform" />
              <span>Kembali ke Beranda</span>
            </button>
          </div>

          {/* CARD FORM LOGIN - Ukuran max-w-lg asli dipertahaman total */}
          <div className="w-full max-w-lg bg-[#F9FAFB] border border-[#EDEDED] rounded-lg p-6 sm:p-8 shadow-sm">
            {/* HEADER */}
            <div className="text-left pt-2">
              <h2 className="text-xl font-semibold text-gray-800">
                Login
              </h2>

              <p className="text-base font-normal text-gray-400 mt-2 mb-8">
                Masukkan detail akun Anda untuk mengakses dashboard!
              </p>
            </div>

            {/* PERSIMPANGAN LOGIN SIGN UP */}
            <div className="flex text-sm mb-2">
              <span
                onClick={() => navigate("/Login")}
                className={`w-1/2 text-center cursor-pointer ${!isSignup ? "text-black font-medium" : "text-[#929191]"
                  }`}
              >
                Login
              </span>

              <span
                onClick={() => navigate("/SignUp")}
                className={`w-1/2 text-center cursor-pointer ${isSignup ? "text-black font-medium" : "text-[#929191]"
                  }`}
              >
                Sign Up
              </span>
            </div>

            {/* TAB INDICATOR */}
            <div className="relative w-full h-[2px] bg-[#EDEDED] mb-6 overflow-hidden">
              <div
                className={`absolute top-0 left-0 h-full w-1/2 bg-[#D82F5A]
                transition-all duration-300 ease-in-out
                ${isSignup ? "translate-x-full" : "translate-x-0"}`}
              />
            </div>

            {/* FORM */}
            <form
              className="relative text-sm items-center w-full"
              onSubmit={handleLogin}
            >
              {/* EMAIL WITH ICON */}
              <div className="relative text-left mb-5">
                <p className="text-sm font-medium text-gray-700 mb-2">Email</p>

                <div className="flex text-sm items-center gap-2.5 border border-gray-300 bg-white rounded-lg p-3 w-full focus-within:ring-2 focus-within:ring-[#023048] focus-within:border-transparent transition-all">
                  <IconMail size={18} className="text-gray-400 shrink-0" />
                  <input
                    type="text"
                    placeholder="guess@gmail.com"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="outline-none w-full bg-transparent text-gray-800 placeholder-gray-400"
                  />
                </div>
              </div>

              {/* PASSWORD WITH ICON */}
              <div className="relative text-left mb-5">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium text-gray-700">Password</p>

                  <p className="text-xs font-medium text-[#D82F5A] cursor-pointer hover:underline">
                    Lupa password?
                  </p>
                </div>

                <div className="flex text-sm items-center gap-2.5 border border-gray-300 bg-white rounded-lg p-3 w-full focus-within:ring-2 focus-within:ring-[#023048] focus-within:border-transparent transition-all">
                  <IconLock size={18} className="text-gray-400 shrink-0" />
                  <div className="relative w-full flex items-center">
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="outline-none w-full pr-8 bg-transparent text-gray-800 placeholder-gray-400"
                    />

                    {showPassword ? (
                      <IconEyeOff
                        size={18}
                        className="absolute right-0 text-gray-400 cursor-pointer hover:text-gray-600"
                        onClick={togglePasswordVisibility}
                      />
                    ) : (
                      <IconEye
                        size={18}
                        className="absolute right-0 text-gray-400 cursor-pointer hover:text-gray-600"
                        onClick={togglePasswordVisibility}
                      />
                    )}
                  </div>
                </div>
              </div>

              {/* REMEMBER */}
              <div className="flex items-center justify-between mb-6">
                <label className="flex items-center gap-2 cursor-pointer text-[#929191] select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={() => setRememberMe(!rememberMe)}
                    className="rounded border-gray-300 text-[#D82F5A] focus:ring-[#D82F5A]"
                  />
                  <span className="text-xs">Remember me</span>
                </label>
              </div>

              {/* ERROR */}
              {failedLogin && (
                <p className="text-red-500 text-sm mb-4 font-medium">
                  {failedLogin}
                </p>
              )}

              {/* LOGIN BUTTON */}
              <button
                type="submit"
                className="bg-gray-900 text-white w-full h-12 rounded-lg hover:bg-gray-800 transition duration-200 font-semibold shadow-sm"
              >
                Login
              </button>

              {/* DIVIDER */}
              <div className="flex items-center w-full text-gray-400 text-xs py-5">
                <div className="flex-1 border-t border-gray-200" />
                <span className="px-3 uppercase tracking-wider font-medium">Atau</span>
                <div className="flex-1 border-t border-gray-200" />
              </div>

              {/* GOOGLE LOGIN */}
              <button
                type="button"
                onClick={() => openPopup(`${import.meta.env.VITE_BACKEND_URL}/auth/google/login`)}
                className="flex items-center justify-center gap-3 w-full border border-gray-300 bg-white rounded-lg p-3 text-gray-600 hover:bg-gray-50 hover:border-gray-400 transition"
              >
                <svg width="18" height="18" viewBox="0 0 48 48">
                  <path fill="#EA4335" d="M24 9.5c3.54 0 6.36 1.22 8.36 3.23l6.2-6.2C34.64 2.52 29.74 0 24 0 14.82 0 6.73 5.48 2.69 13.44l7.22 5.61C11.98 13.11 17.47 9.5 24 9.5z" />
                  <path fill="#4285F4" d="M46.5 24c0-1.64-.15-3.22-.43-4.73H24v9.02h12.7c-.55 2.96-2.23 5.46-4.75 7.14l7.27 5.65C43.98 36.98 46.5 30.99 46.5 24z" />
                  <path fill="#FBBC05" d="M9.91 28.05A14.5 14.5 0 0 1 9.5 24c0-1.41.24-2.77.67-4.05l-7.22-5.61A23.94 23.94 0 0 0 0 24c0 3.87.93 7.53 2.95 10.66l6.96-6.61z" />
                  <path fill="#34A853" d="M24 48c6.48 0 11.92-2.14 15.9-5.82l-7.27-5.65c-2.02 1.36-4.61 2.17-8.63 2.17-6.53 0-12.02-3.61-14.09-8.95l-6.96 6.61C6.73 42.52 14.82 48 24 48z" />
                </svg>
                <span className="text-sm font-medium text-gray-700">
                  Masuk dengan Google
                </span>
              </button>

              {/* FOOTER TEXT */}
              <div className="text-center text-xs text-[#929191] mt-5">
                Belum punya akun?{" "}
                <span
                  onClick={() => navigate("/SignUp")}
                  className="text-[#D82F5A] cursor-pointer hover:underline font-medium"
                >
                  Daftar di sini
                </span>
              </div>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}

export default Login;