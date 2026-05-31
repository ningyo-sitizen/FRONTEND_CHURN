
import { useNavigate } from "react-router-dom";
import { useNotif } from "./NotificationContext"
import { Link } from "react-router-dom";
import { useState, useRef, useEffect } from "react"
import { IconEye, IconEyeOff } from "@tabler/icons-react";

function OTP() {
    const { showNotif } = useNotif();
    const [name, setName] = useState("");
    const [isSignup, setIsSignup] = useState(true);
    const [failedLogin, setFailedLogin] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const [rememberMe, setRememberMe] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const [otp, setOtp] = useState(Array(6).fill(""))
    const [timer, setTimer] = useState(60)
    const inputsRef = useRef([])
    const handleChange = (e, index) => {
        const val = e.target.value.replace(/[^0-9]/g, "") // cuma angka
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
    const handleLogin = async (e) => {
        e.preventDefault();

        if (!name || !password) {
            setFailedLogin("*Harap input username dan password");
            return;
        }
        try {
            const res = await fetch("http://localhost:8080/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, password }),
            });

            const data = await res.json();
            console.log("Response:", data);

            if (res.ok) {
                setFailedLogin("");
                localStorage.setItem("token", data.token);
                localStorage.setItem("user", JSON.stringify(data.user));

                const userk = JSON.parse(localStorage.getItem('user'))
                console.log("LOCALSTORAGE USER:", localStorage.getItem("user"));
                console.log("PARSED:", JSON.parse(localStorage.getItem("user")));
                const user_name = userk.username || userk.name;
                const role = userk.role;
                const user_action = "user malakukan login"
                const action_status = "berhasil"

                //token if login
                const now = new Date();
                const pad = (n) => n.toString().padStart(2, "0");
                const token = localStorage.getItem('token');
                const datePart = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
                const timePart = `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;

                const time = `${datePart} ${timePart}`;

                const res = await fetch("http://localhost:8080/api/logger/logging", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                    body: JSON.stringify({ user_name, role, user_action, action_status, time })


                })
                if (rememberMe) {
                    localStorage.setItem("remember_name", name);
                    localStorage.setItem("remember_password", (password));
                } else {
                    localStorage.removeItem("remember_name");
                    localStorage.removeItem("remember_password");
                }

                const logger = await res.json();
                console.log(logger);

                showNotif("success", `selamat datang di sistem! ${user_name}`);

                if (data.user.role == "super admin") {
                    navigate("/dashboardSA")

                } else {
                    navigate("/dashboard");
                }
                fetch("http://localhost:8080/api/summary/sync", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    }
                }).catch(err => {
                    console.log("SYNC ERROR (diabaikan):", err);
                });
            } else {
                setFailedLogin("*Maaf, Username/Password yang anda masukan salah, silahkan coba lagi!");
            }

        } catch (err) {
            console.error("Error:", err);
            setFailedLogin("*Maaf, Username/Password yang anda masukan salah, silahkan coba lagi!");
        }
    };
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

    return (
        <main className="w-full min-h-screen font-jakarta mx-auto bg-gradient-to-b from-white to-[#F6EAEC]">
            <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.05)_2px,transparent_2px),linear-gradient(90deg,rgba(0,0,0,0.05)_1px,transparent_1px)]  bg-[size:30px_30px] 
              [mask-image:radial-gradient(ellipse_at_center,black_10%,transparent_60%)] pointer-events-none"
            />
            <div className="relative flex flex-col lg:flex-row min-h-screen overflow-hidden">
                {/* Kiriiiiiiiii*/}
                <section className="flex-1 relative flex flex-col justify-center items-center lg:items-start text-center">

                    <div className="hidden lg:flex flex-col gap-3 items-start lg:pl-20">

                        {/* LOGO */}
                        <div className="bg-[url('https://cdn.designfast.io/image/2026-05-01/ba3f37fa-e105-4c2b-b1e9-2f72ab10513a.png')] w-[90px] h-[90px] bg-cover bg-center absolute top-[30px]"></div>

                        {/* TAGLINE */}
                        <p className="text-sm text-[#D82F5A] bg-[#FEF5F6] border border-[#D82F5A] px-4 py-1 rounded-full">
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

                        </div>

                    </div>

                </section>

                {/* Kanannnnnnnn */}
                <div className="flex-1 flex justify-start lg:justify-start items-center min-h-screen ml-40 z-10">

                    <div className="absolute max-w-lg lg:max-w-lg bg-[#F9FAFB] border border-[#EDEDED] rounded-lg p-8 shadow-sm"
                    >

                        <div className="text-left pt-2">
                            <h2 className="text-xl font-semibold text-black">Daftar Akun</h2>
                            <p className="text-base font-normal text-[#9A9A9A] mt-2 mb-8">
                                Masukkan detail akun Anda untuk mengakses dashboard!
                            </p>
                        </div>

                        {/* persimpangan login sign up */}
                        <div className="flex text-sm mb-2">
                            <span
                                onClick={() => setIsSignup(false)}
                                className={`w-1/2 text-center cursor-pointer ${!isSignup ? "text-black font-medium" : "text-[#929191]"
                                    }`}
                            >
                                Login
                            </span>

                            <span
                                onClick={() => setIsSignup(true)}
                                className={`w-1/2 text-center cursor-pointer ${isSignup ? "text-black font-medium" : "text-[#929191]"
                                    }`}
                            >
                                Sign Up
                            </span>
                        </div>

                        <div className="relative w-full border-t border-[#EDEDED] mb-4">
                            <div
                                className={`absolute top-0 w-1/2 border-t-2 border-[#D82F5A] transition-all ${isSignup ? "left-1/2" : "left-0"
                                    }`}
                            ></div>
                        </div>

                        {/* Input OTP */}
                        <form className="relative text-sm items-centerp-3 w-full mb-6"
                            onSubmit={handleLogin}>
                            {/* fungsi hanya placeholder */}
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
                                            onClick={() => setTimer(60)}
                                            className="text-[#D82F5A] cursor-pointer hover:underline"
                                        >
                                            Kirim ulang kode
                                        </span>
                                    )}
                                </div>
                            </div>
                            <button
                                type="submit"
                                className="bg-[#000000] text-white w-full h-12 rounded-lg hover:bg-[#667790] transition duration-200 font-semibold"
                            >
                                Selanjutnya
                            </button>
                            <div className="flex items-center w-full text-[#616161] text-sm py-4">
                                <div className="flex-1 border-t border-[#BFC0C0]"></div>

                                <span className="px-4 text-center">
                                    Atau
                                </span>

                                <div className="flex-1 border-t border-[#BFC0C0]"></div>
                            </div>
                            <button
                                type="button"
                                className="flex items-center justify-center gap-3 w-full border border-gray-300 rounded-lg p-3 text-[#616161] hover:bg-gray-50 transition"
                            >
                                <span className="text-sm font-medium">
                                    Kembali
                                </span>
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </main>

    );
}

export default OTP;