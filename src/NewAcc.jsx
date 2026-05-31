import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useNotif } from "./NotificationContext"
import { Link } from "react-router-dom";
import imgpnj from "./assets/logo_pnj.jpg";
import { IconEye, IconEyeOff } from "@tabler/icons-react";

function NewAcc() {
    const { showNotif } = useNotif();
    const [name, setName] = useState("");
    const [isSignup, setIsSignup] = useState(true);
    const [failedLogin, setFailedLogin] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const [rememberMe, setRememberMe] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

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
            const res = await fetch(`http://localhost:8080/api/auth/login`, {
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


    return (
        <main className="w-full min-h-screen font-jakarta mx-auto bg-gradient-to-b from-white to-[#F6EAEC]">
            <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.05)_2px,transparent_2px),linear-gradient(90deg,rgba(0,0,0,0.05)_1px,transparent_1px)]  bg-[size:30px_30px] 
              [mask-image:radial-gradient(ellipse_at_center,black_10%,transparent_60%)] pointer-events-none"
            />
            <div className="relative flex flex-col lg:flex-row min-h-screen overflow-hidden">
                {/* Kiriiiiiiiii*/}
                <section className="flex-1 relative flex flex-col justify-center items-center lg:items-start text-center py-10">
                    <div className="hidden lg:flex flex-col gap-3 items-start lg:pl-20">
                        <div className="bg-[url('https://cdn.designfast.io/image/2026-05-01/ba3f37fa-e105-4c2b-b1e9-2f72ab10513a.png')] w-[76px] h-[76px] bg-cover bg-center absolute top-[30px]"></div>
                        <p className="text-sm text-[#D82F5A] bg-[#FEF5F6] border border-[#D82F5A] px-4 py-1 rounded-full mt-10">
                            Predict the Unpredictable
                        </p>

                        {/* TITLE */}
                        <div className="text-left py-2">
                            <p className="text-3xl font-semibold">Pendaftaran Akun</p>
                            <p className="text-3xl font-semibold text-[#D82F5A]">ChurnGuard CRM</p>
                            <p className="text-sm text-[#929191] mt-4">Demi keamanan data pelanggan Anda, silakan selesaikan 3 tahap verifikasi ini untuk masuk.</p>

                        </div>
                        <div className="flex flex-col gap-6 text-left">

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

                        <div className="text-left mt-[5px]">
                            <h2 className="text-base font-semibold text-black">Daftar Akun</h2>
                            <p className="text-sm font-normal text-[#9A9A9A] mt-2 mb-2">
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

                        {/* Input usn pw */}
                        <form className="relative text-sm items-centerp-3 w-full mb-6"
                            onSubmit={handleLogin}>
                            {/* fungsi hanya placeholder */}
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

                                    {/* LEFT */}
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
                            <button
                                type="submit"
                                className="bg-[#000000] text-white w-full h-10 rounded-lg hover:bg-[#667790] transition duration-200 font-semibold"
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
                                className="flex items-center justify-center gap-3 h-10 w-full border border-gray-300 rounded-lg p-3 text-[#616161] hover:bg-gray-50 transition"
                            >

                                <span className="text-sm font-medium">
                                    Kembali
                                </span>
                            </button>

                            <p className="text-sm text-center mt-4">
                                <span className="text-black">
                                    Sudah punya akun?{" "}
                                </span>

                                <span
                                    onClick={() => setIsSignup(false)}
                                    className="text-[#FF1515] cursor-pointer font-medium hover:underline"
                                >
                                    Masuk di sini
                                </span>
                            </p>
                        </form>
                    </div>
                </div>
            </div>
        </main>

    );
}

export default NewAcc;