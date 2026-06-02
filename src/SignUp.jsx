import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useNotif } from "./NotificationContext"
import { Link } from "react-router-dom";
import imgpnj from "./assets/logo_pnj.jpg";
import { IconEye, IconEyeOff, IconMail, IconLock, IconArrowLeft } from "@tabler/icons-react";

function SignUp() {
    const { showNotif } = useNotif();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("")
    const [isSignup, setIsSignup] = useState(true);
    const [failedLogin, setFailedLogin] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const [rememberMe, setRememberMe] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const [step, setStep] = useState(1)
    const [otp, setOtp] = useState(Array(6).fill(""))
    const [timer, setTimer] = useState(60)
    const inputsRef = useRef([])
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
    const makeNewAcc = async () => {
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/auth/register/newAcc`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name: name, email: email, password: password }),
        })

        const data = await res.json()

        localStorage.setItem("token", data.token);
        navigate('/dashboardUser')
    }
    const handleLogin = async () => {
        try {

            const token = localStorage.getItem("token");

            const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: emailLogin, pass: password }),
            });

            const data = await res.json();

            if (!res.ok) {
                console.log("Login error:", data.message);
                return;
            }
            localStorage.setItem("token", data.token);
            navigate('/dashboardUser')
        } catch (err) {
            console.log("Login failed:", err);
        }
    };
    const handleOtpCheck = async () => {
        const otpCode = otp.join("");

        if (!otpCode.trim()) {
            showNotif("error", "Tolong isi kode OTP");
            return;
        }

        if (otpCode.length < 6) {
            showNotif("error", "OTP harus 6 digit");
            return;
        }

        try {
            const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/auth/register/check-otp`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: email,
                    otp: otpCode
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                showNotif("error", data.message || "OTP salah");
                return;
            }

            showNotif("success", "OTP berhasil diverifikasi");
            console.log("OTP benar");

            setStep(3);

        } catch (err) {
            console.log("OTP check failed:", err);
            showNotif("error", "Terjadi kesalahan saat verifikasi OTP");
        }
    };
    const handleOtpGet = async () => {
        try {
            const res = await fetch(
                `${import.meta.env.VITE_BACKEND_URL}/auth/register/get-otp?email=${email}`
            );
            showNotif(res.data.status, res.data.message)
        } catch (err) {
            console.log("Register failed:", err);
        }
    }
    const handleOtpNewGet = async () => {

        try {

            const res = await fetch(
                `${import.meta.env.VITE_BACKEND_URL}/auth/register/new-otp?email=${email}`
            );

            const data = await res.json();

            if (!res.ok) {

                return showNotif(
                    "error",
                    data.message
                );
            }

            setTimer(120);

            showNotif(
                "success",
                data.message
            );

        } catch (err) {

            console.log("Register failed:", err);

            showNotif(
                "error",
                "Server error"
            );
        }
    }

    const handleRegister = async () => {
        try {
            const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/auth/register/check-email`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: email }),
            });
            const data = await res.json();

            if (!res.ok) {
                showNotif("error", data.message);
                return;
            }
            console.log("Email available, show OTP");
            setStep(2)
            handleOtpGet()

        } catch (err) {
            console.log("Register failed:", err);
        }
    };
    const handleNext = (e) => {
        e.preventDefault()

        if (step < 3) {
            setStep(step + 1)
        } else {
            console.log("create acc")
        }
    }
    const handleChange = (e, index) => {
        const val = e.target.value.replace(/[^0-9]/g, "")
        const newOtp = [...otp]
        newOtp[index] = val
        setOtp(newOtp)

        if (val && index < 5) {
            inputsRef.current[index + 1].focus()
        }
    }
    const handleKeyDown = (e, index) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            inputsRef.current[index - 1].focus()
        }
    }
    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };


    const checks = { length: password.length >= 8, letter: /[a-z]/.test(password) && /[A-Z]/.test(password), number: /[0-9]/.test(password), special: /[^A-Za-z0-9]/.test(password), }
    const CheckIcon = ({ ok }) => (
        ok ? (
            <svg className="w-4 h-4 text-[#4ABC4C]" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
        ) : (
            <svg className="w-4 h-4 text-[#FF1515]" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 6l12 12M6 18L18 6" />
            </svg>
        )
    )

    const strength = Object.values(checks).filter(Boolean).length
    const strengthText = ["Lemah", "Lemah", "Sedang", "Kuat", "Sangat Kuat"][strength]
    const strengthColor = ["#FF1515", "#FF1515", "#FFCA00", "#4ABC4C", "#4ABC4C"][strength]

    useEffect(() => {
        const savedName = localStorage.getItem("remember_name");
        const savedPw = localStorage.getItem("remember_password");

        if (savedName && savedPw) {
            setName(savedName);
            setPassword(savedPw);
            setRememberMe(true);
        }
    }, []);
    useEffect(() => {
        if (timer === 0) return
        const interval = setInterval(() => setTimer(timer - 1), 1000)
        return () => clearInterval(interval)
    }, [timer])
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
            <div className="relative flex flex-col lg:flex-row min-h-screen overflow-hidden">
                {/* Kiriiiiiiiii*/}
                <section className="flex-1 relative flex flex-col justify-center items-center lg:items-start text-center">

                    <div className="hidden lg:flex flex-col gap-3 items-start lg:pl-20">

                        {/* LOGO */}
                        <div className="bg-[url('https://cdn.designfast.io/image/2026-05-01/ba3f37fa-e105-4c2b-b1e9-2f72ab10513a.png')] w-[90px] h-[90px] bg-cover bg-center absolute top-[30px]"></div>

                        {/* TAGLINE */}
                        <p className="text-sm text-[#D82F5A] bg-[#FEF5F6] border border-[#D82F5A] mt-8 px-4 py-1 rounded-full">
                            Predict the Unpredictable
                        </p>

                        {/* TITLE */}
                        <div className="text-left py-2">
                            <p className="text-3xl font-semibold">Pendaftaran Akun</p>
                            <p className="text-3xl font-semibold text-[#D82F5A]">ChurnGuard CRM</p>
                            <p className="text-sm text-[#929191]">Demi keamanan data pelanggan Anda, silakan selesaikan 3 tahap verifikasi ini untuk masuk.</p>

                        </div>
                        <div className="flex flex-col gap-6 mt-6 text-left">

                            {/* STEP 1 */}
                            <div className="flex items-start gap-4 max-w-[550px]">
                                <div className="w-8 h-8 shrink-0 bg-[#F6EAEC] rounded flex items-center justify-center text-[#D82F5A] text-xs">
                                    01
                                </div>

                                <div>
                                    <p className="text-sm font-medium text-black">Identifikasi Akun</p>
                                    <p className="text-xs text-[#616161]">
                                        Masukkan alamat email terdaftar Anda untuk memulai proses masuk. Kami akan mengenali identitas akun Anda untuk memastikan akses yang tepat.
                                    </p>
                                </div>
                            </div>

                            {/* STEP 2 */}
                            <div className="flex items-start gap-4 max-w-[550px]">
                                <div className="w-8 h-8 shrink-0 bg-[#F6EAEC] rounded flex items-center justify-center text-[#D82F5A] text-xs">
                                    02
                                </div>

                                <div>
                                    <p className="text-sm font-medium text-black">Verifikasi Keamanan</p>
                                    <p className="text-xs text-[#616161]">
                                        Masukkan 6 digit kode OTP yang telah kami kirimkan ke email Anda. Langkah ini diperlukan untuk membuktikan bahwa akses ini benar-benar dilakukan oleh Anda.
                                    </p>
                                </div>
                            </div>

                            {/* STEP 3 */}
                            <div className="flex items-start gap-4 max-w-[550px]">
                                <div className="w-8 h-8 shrink-0 bg-[#F6EAEC] rounded flex items-center justify-center text-[#D82F5A] text-xs">
                                    03
                                </div>

                                <div>
                                    <p className="text-sm font-medium text-black">Pengaturan Password</p>
                                    <p className="text-xs text-[#616161]">
                                        Buat atau konfirmasi kata sandi baru Anda untuk perlindungan maksimal. Pastikan kombinasi karakter sudah memenuhi standar keamanan data pelanggan kami.
                                    </p>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={() => navigate("/")}
                                className="mt-4 flex items-center gap-2 text-xs text-gray-400 hover:text-[#D82F5A] transition-colors duration-200 group cursor-pointer"
                            >
                                <IconArrowLeft size={16} className="transform group-hover:-translate-x-0.5 transition-transform" />
                                <span>Kembali ke Beranda</span>
                            </button>
                        </div>

                    </div>

                </section>

                <div className="flex-1 flex flex-col justify-center items-center min-h-screen lg:ml-40 z-10 px-4 py-8 relative">
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

                    <div className="w-full max-w-lg bg-[#F9FAFB] border border-[#EDEDED] rounded-lg p-6 sm:p-8 shadow-sm">
                        <div className="text-left pt-2">
                            <h2 className="text-xl font-semibold text-black">Daftar Akun</h2>
                            <p className="text-lg font-normal text-[#9A9A9A] mt-2 mb-8">
                                Masukkan detail akun Anda untuk mengakses dashboard!
                            </p>
                        </div>

                        {/* persimpangan login sign up */}
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

                        <div className="relative w-full h-[2px] bg-[#EDEDED] mb-4 overflow-hidden">

                            <div
                                className={`absolute top-0 left-0 h-full w-1/2 bg-[#D82F5A] transition-all duration-300 ease-in-out
                                ${isSignup ? "translate-x-full" : "translate-x-0"}`}
                            ></div>

                        </div>

                        <form className="relative text-sm items-center p-3 w-full mb-6"
                            onSubmit={handleNext}>
                            {step === 1 && (
                                <>
                                    <div className="relative w-full text-sm text-left">
                                        <p className="font-medium text-lg py-2">Otentikasi langkah ke satu</p>
                                        <p className="font-extralight text-[#616161]">Mulai langkah pertama Anda untuk menjaga setiap pelanggan tetap setia. Masukkan email kantor untuk mendaftar.</p>
                                    </div>
                                    <div className="relative text-left mt-6 font-['Plus_Jakarta_Sans',sans-serif]">
                                        <div className="w-full flex flex-col">
                                            <label className="text-sm font-medium text-slate-700 mb-2 tracking-wide">
                                                Email
                                            </label>

                                            <div className="flex items-center text-sm border border-slate-200 rounded-[4px] px-3.5 py-3 w-full bg-white transition-all focus-within:border-[#D82F5A] focus-within:ring-1 focus-within:ring-[#D82F5A] shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    width="18"
                                                    height="18"
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth="1.5"
                                                    className="text-slate-400 mr-2.5 shrink-0"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                >
                                                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                                    <path d="M3 7a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v10a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-10" />
                                                    <path d="M3 7l9 6l9 -6" />
                                                </svg>

                                                <input
                                                    type="email"
                                                    placeholder="guess@gmail.com"
                                                    value={email}
                                                    onChange={(e) => setEmail(e.target.value)}
                                                    className="outline-none w-full bg-transparent text-slate-800 placeholder-slate-400 text-sm"
                                                />
                                            </div>
                                        </div>

                                        <div className="flex justify-between items-center w-full text-xs text-[#929191] mt-5 mb-6">
                                            <label className="flex items-center space-x-2 cursor-pointer select-none">
                                                <input
                                                    type="checkbox"
                                                    className="accent-[#D82F5A] h-4 w-4 rounded border-gray-300 transition-all"
                                                    checked={rememberMe}
                                                    onChange={(e) => setRememberMe(e.target.checked)}
                                                />
                                                <span className="text-slate-500 font-medium">Apakah email ini sudah benar?</span>
                                            </label>
                                        </div>

                                        <button
                                            type="button"
                                            onClick={() => {
                                                if (!email.trim()) {
                                                    showNotif("error", "Tolong isi email");
                                                    return;
                                                }
                                                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

                                                if (!emailRegex.test(email)) {
                                                    showNotif("error", "Format email tidak valid");
                                                    return;
                                                }

                                                handleRegister();
                                            }}
                                            className="bg-[#000000] text-white w-full h-12 rounded-[4px] hover:bg-zinc-900 transition duration-200 font-semibold text-sm shadow-md active:scale-[0.99]"
                                        >
                                            Selanjutnya
                                        </button>
                                    </div>
                                    <div className="flex items-center w-full text-[#616161] text-sm py-4">
                                        <div className="flex-1 border-t border-[#BFC0C0]"></div>

                                        <span className="px-4 text-center">
                                            Atau
                                        </span>

                                        <div className="flex-1 border-t border-[#BFC0C0]"></div>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => openPopup(`${import.meta.env.VITE_BACKEND_URL}/auth/google/register`)}
                                        className="flex items-center justify-center gap-3 w-full border border-gray-300 rounded-lg p-3 text-[#616161] hover:bg-gray-50 transition"
                                    >
                                        <svg
                                            width="20"
                                            height="20"
                                            viewBox="0 0 48 48"
                                        >
                                            <path fill="#EA4335" d="M24 9.5c3.54 0 6.36 1.22 8.36 3.23l6.2-6.2C34.64 2.52 29.74 0 24 0 14.82 0 6.73 5.48 2.69 13.44l7.22 5.61C11.98 13.11 17.47 9.5 24 9.5z" />
                                            <path fill="#4285F4" d="M46.5 24c0-1.64-.15-3.22-.43-4.73H24v9.02h12.7c-.55 2.96-2.23 5.46-4.75 7.14l7.27 5.65C43.98 36.98 46.5 30.99 46.5 24z" />
                                            <path fill="#FBBC05" d="M9.91 28.05A14.5 14.5 0 0 1 9.5 24c0-1.41.24-2.77.67-4.05l-7.22-5.61A23.94 23.94 0 0 0 0 24c0 3.87.93 7.53 2.95 10.66l6.96-6.61z" />
                                            <path fill="#34A853" d="M24 48c6.48 0 11.92-2.14 15.9-5.82l-7.27-5.65c-2.02 1.36-4.61 2.17-8.63 2.17-6.53 0-12.02-3.61-14.09-8.95l-6.96 6.61C6.73 42.52 14.82 48 24 48z" />
                                        </svg>

                                        <span className="text-sm font-medium">
                                            Daftar dengan Google
                                        </span>
                                    </button>
                                </>
                            )}
                            {step === 2 && (
                                <>
                                    <div className="relative w-full text-sm text-left">
                                        <p className="font-medium text-lg py-2">Otentikasi langkah ke dua</p>
                                        <p className="font-extralight text-[#616161]">Masukkan kode verifikasi 6 digit yang dikirimkan ke placehorder kode ini berlaku selama 15 menit. Jika Anda belum menerimanya, coba minta kode tersebut lagi.</p>
                                    </div>
                                    <div>
                                        <div className="flex gap-3 my-6">
                                            {otp.map((digit, i) => (
                                                <input
                                                    key={i}
                                                    ref={(el) => (inputsRef.current[i] = el)}
                                                    type="text"
                                                    maxLength={1}
                                                    value={digit}
                                                    onChange={(e) => handleChange(e, i)}
                                                    onKeyDown={(e) => handleKeyDown(e, i)}
                                                    className={`w-[60px] h-[70px] text-center text-2xl border rounded outline-none focus:border-[#D82F5A]
                                            ${digit ? "border-[#D82F5A]" : "border-[#B3B3B3]"}`}
                                                />
                                            ))}
                                        </div>
                                        <div className="text-xs my-2 text-left">
                                            {timer > 0 ? (
                                                <span className="text-[#929191]">
                                                    Kirim ulang dalam {timer}s
                                                </span>
                                            ) : (
                                                <span
                                                    onClick={handleOtpNewGet}
                                                    className="text-[#D82F5A] cursor-pointer hover:underline"
                                                >
                                                    Kirim ulang kode
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={handleOtpCheck}
                                        className="bg-[#000000] text-white w-full h-12 rounded-lg hover:bg-[#667790] transition duration-200 font-semibold"
                                    >
                                        Selanjutnya
                                    </button>

                                </>
                            )}
                            {step === 3 && (
                                <>
                                    <form className="relative text-sm items-centerp-3 w-full mb-6"
                                        onSubmit={handleLogin}>
                                        <div className="relative w-full text-sm text-left">
                                            <p className="font-medium text-base py-2">Otentikasi langkah ke tiga</p>
                                            <p className="font-extralight text-sm text-[#616161]">Buat kata sandi yang kuat untuk melindungi data pelanggan Anda di dashboard ChurnGuard.</p>
                                        </div>
                                        <div className="relative text-left mt-4">
                                            <p className="text-regular">Username</p>
                                            <div className="flex text-sm items-center border border-[#B3B3B3] rounded-lg p-3 w-full focus-within:ring-2 focus-within:ring-[#023048] mb-3">
                                                <svg xmlns="http://www.w3.org/2000/svg"
                                                    width="20"
                                                    height="20"
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    stroke-width="2"
                                                    className="text-gray-400 mr-2"
                                                    stroke-linecap="round"
                                                    stroke-linejoin="round"
                                                    class="icon icon-tabler icons-tabler-outline icon-tabler-user">
                                                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                                    <path d="M8 7a4 4 0 1 0 8 0a4 4 0 0 0 -8 0" />
                                                    <path d="M6 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2" />
                                                </svg>

                                                <input
                                                    type="text"
                                                    placeholder="Username"
                                                    value={name}
                                                    onChange={(e) => {
                                                        setName(e.target.value);
                                                    }}
                                                    className="outline-none w-full"

                                                />
                                            </div>
                                        </div>
                                        {/* Password */}
                                        <div className="relative text-left mt-4">
                                            <p className="text-regular">Password</p>
                                            <div className="flex text-sm items-center border border-gray-300 rounded-lg p-3 w-full focus-within:ring-2 focus-within:ring-[#023048] mb-3">
                                                <svg xmlns="http://www.w3.org/2000/svg"
                                                    width="20" height="20" viewBox="0 0 24 24" fill="none"
                                                    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                                                    className="text-gray-400 mr-2">
                                                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                                    <path d="M5 13a2 2 0 0 1 2 -2h10a2 2 0 0 1 2 2v6a2 2 0 0 1 -2 2h-10a2 2 0 0 1 -2 -2v-6z" />
                                                    <path d="M11 16a1 1 0 1 0 2 0a1 1 0 0 0 -2 0" />
                                                    <path d="M8 11v-4a4 4 0 1 1 8 0v4" />
                                                </svg>

                                                <div className="relative w-full">
                                                    <input
                                                        type={showPassword ? "text" : "password"}
                                                        placeholder="Password"
                                                        value={password}
                                                        onChange={(e) => setPassword(e.target.value)}
                                                        className="outline-none w-full pr-8"
                                                    />
                                                    {showPassword ? (
                                                        <IconEyeOff
                                                            size={18}
                                                            className="absolute top-1/2 right-2 -translate-y-1/2 text-gray-400 cursor-pointer"
                                                            onClick={togglePasswordVisibility}
                                                        />
                                                    ) : (
                                                        <IconEye
                                                            size={18}
                                                            className="absolute top-1/2 right-2 -translate-y-1/2 text-gray-400 cursor-pointer"
                                                            onClick={togglePasswordVisibility}
                                                        />
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="mt-4 text-left text-xs">
                                            <p className="mb-2 text-black">Kata sandi Anda harus memiliki:</p>

                                            <div className="flex gap-8">
                                                <div className="flex flex-col gap-2">
                                                    <div className="flex items-start gap-2">
                                                        <CheckIcon ok={checks.length} />
                                                        <span className={checks.length ? "text-[#4ABC4C]" : "text-[#616161]"}>
                                                            Minimal 8 karakter
                                                        </span>
                                                    </div>
                                                    <div className="flex items-start gap-2">
                                                        <CheckIcon ok={checks.letter} />
                                                        <span className={checks.letter ? "text-[#4ABC4C]" : "text-[#616161]"}>
                                                            Huruf besar & kecil
                                                        </span>
                                                    </div>
                                                </div>

                                                {/* RIGHT */}
                                                <div className="flex flex-col gap-2">
                                                    <div className="flex items-start gap-2">
                                                        <CheckIcon ok={checks.number} />
                                                        <span className={checks.number ? "text-[#4ABC4C]" : "text-[#616161]"}>
                                                            Minimal 1 angka
                                                        </span>
                                                    </div>

                                                    <div className="flex items-start gap-2">
                                                        <CheckIcon ok={checks.special} />
                                                        <span className={checks.special ? "text-[#4ABC4C]" : "text-[#616161]"}>
                                                            1 karakter khusus
                                                        </span>
                                                    </div>
                                                </div>

                                            </div>
                                        </div>
                                        {/* Remember */}
                                        <div className="w-full h-[3px] bg-[#EDEDED] mt-4">
                                            <div
                                                className="h-[3px] transition-all"
                                                style={{
                                                    width: `${(strength / 4) * 100}%`,
                                                    backgroundColor: strengthColor,
                                                }}
                                            />
                                        </div>

                                        <p className="text-xs mt-2 text-[#929191]">
                                            Kekuatan kata sandi: <span style={{ color: strengthColor }}>{strengthText}</span>
                                        </p>
                                        <span className="px-4 text-center">
                                        </span>
                                        <button
                                            onClick={makeNewAcc}
                                            type="button"
                                            className="bg-[#000000] text-white w-full h-10 rounded-lg hover:bg-[#667790] transition duration-200 font-semibold"
                                        >
                                            Selanjutnya
                                        </button>
                                    </form>
                                </>
                            )}

                        </form>
                    </div>
                </div>
            </div>
        </main>

    );
}

export default SignUp;