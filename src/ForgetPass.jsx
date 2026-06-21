import { useState, useEffect, useRef } from "react";

import { useNavigate } from "react-router-dom";
import { useNotif } from "./NotificationContext"
import { Link } from "react-router-dom";
import imgpnj from "./assets/logo_pnj.jpg";
import { IconEye, IconEyeOff } from "@tabler/icons-react";

function ForgetPass() {
    const [confirmPassword, setConfirmPassword] = useState("");
    const { showNotif } = useNotif();
    const [name, setName] = useState("");
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




    const handleForgetPassEmailCheck = async () => {
        try {

            const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/auth/forgetpass/check-email`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: name })
            });

            const data = await res.json();

            console.log("DEBUG:", data);

            if (data.status !== "success") {
                showNotif("error", data.message);
                return;
            }

            showNotif("success", data.message);
            handleOtpGet()
            setStep(2);


        } catch (err) {
            console.log("Register failed:", err);
            showNotif("error", "Server error");
        }
    };
    const handleOtpGet = async () => {
        try {
            const res = await fetch(
                `${import.meta.env.VITE_BACKEND_URL}/auth/register/get-otp?email=${name}`
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
                    email: name,
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
    const handleResetPassword = async (e) => {

        e.preventDefault();

        try {

            const res = await fetch(
                `${import.meta.env.VITE_BACKEND_URL}/auth/forget_pass/password`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        email: name,
                        password: confirmPassword
                    }),
                }
            );

            const data = await res.json();

            if (data.status === "success") {
                navigate('/login')
            }


            showNotif(data.status, data.message);

        } catch (err) {

            console.log(err);

            showNotif("error", "Server error");
            if (data.status === "error") {
                navigate('/login')
            }
        }
    }
    const handleNext = (e) => {
        e.preventDefault();

        if (step === 1 && !emailValid) {
            showNotif("error", "Email belum valid");
            return;
        }

        if (step < 3) {
            setStep(step + 1);
        } else {
            console.log("create acc");
        }
    };
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
                <div className="flex-1 flex justify-start lg:justify-start items-center min-h-screen lg:pl-20 z-10">

                    <div className="relative w-full max-w-lg lg:max-w-lg bg-[#F9FAFB] border border-[#EDEDED] rounded-lg p-8 shadow-sm"
                    >

                        <div className="text-left pt-2">
                            <h2 className="text-xl font-semibold text-black">Reset Akun </h2>
                            <p className="text-lg font-normal text-[#9A9A9A] mt-2 mb-8">
                                Masukkan detail akun Anda untuk mengganti password
                            </p>
                        </div>



                        {/* Input Email */}
                        <form className="relative text-sm items-center w-full mb-6"
                            onSubmit={handleNext}>
                            {/* fungsi hanya placeholder */}
                            {step === 1 && (
                                <>
                                    <div className="relative w-full text-sm text-left">
                                        <p className="font-medium text-lg py-2">Otentikasi langkah ke satu</p>
                                        <p className="font-extralight text-[#616161]">Mulai langkah pertama Anda untuk menjaga setiap pelanggan tetap setia. Masukkan email kantor untuk mendaftar.</p>
                                    </div>
                                    <div className="relative text-left mt-4">
                                        <p className="text-regular">Email</p>
                                        <div className="flex text-sm items-center border border-gray-300 rounded-lg p-3 w-full focus-within:ring-2 focus-within:ring-[#023048] mb-3">
                                            <svg xmlns="http://www.w3.org/2000/svg"
                                                width="24"
                                                height="24"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                stroke-width="1.25"
                                                className="text-[#B3B3B3] mr-2"
                                                stroke-linecap="round"
                                                stroke-linejoin="round"
                                                class="icon icon-tabler icons-tabler-outline icon-tabler-mail">
                                                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                                <path d="M3 7a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v10a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-10" />
                                                <path d="M3 7l9 6l9 -6" />
                                            </svg>

                                            <input
                                                type="text"
                                                placeholder="guess@gmail.com"
                                                value={name}
                                                onChange={(e) => {
                                                    setName(e.target.value);
                                                }}
                                                className="outline-none w-full"

                                            />
                                        </div>
                                    </div>
                                    {/* Remember */}
                                    <div className="flex justify-between items-center w-full text-xs text-[#929191] my-5">
                                        <label className="flex items-center space-x-2">
                                            <input type="checkbox" className="accent-[#D82F5A]"
                                                checked={rememberMe}
                                                onChange={(e) => setRememberMe(e.target.checked)} />
                                            <span>Apakah email ini sudah benar?</span>
                                        </label>
                                    </div>
                                    <button
                                        type="submit"
                                        onClick={handleForgetPassEmailCheck}
                                        className="bg-[#000000] text-white w-full h-12 rounded-lg hover:bg-[#667790] transition duration-200 font-semibold"
                                    >
                                        Selanjutnya
                                    </button>

                                    <p className="text-sm text-center mt-4">
                                        <span className="text-black">
                                            Sudah punya akun?{" "}
                                        </span>

                                        <span
                                            onClick={() => navigate("/login")}
                                            className="text-[#FF1515] cursor-pointer font-medium hover:underline"
                                        >
                                            Masuk di sini
                                        </span>
                                    </p>
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
                                                    onClick={() => setTimer(60)}
                                                    className="text-[#D82F5A] cursor-pointer hover:underline"
                                                >
                                                    Kirim ulang kode
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <button
                                        onClick={handleOtpCheck}
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
                                        onClick={() => navigate("/login")}
                                        type="button"
                                        className="flex items-center justify-center gap-3 w-full border border-gray-300 rounded-lg p-3 text-[#616161] hover:bg-gray-50 transition"
                                    >
                                        <span className="text-sm font-medium">
                                            Kembali
                                        </span>
                                    </button>
                                </>
                            )}
                            {step === 3 && (
                                <div className="relative text-sm items-center p-3 w-full mb-6">
                                    <div className="relative w-full text-sm text-left">
                                        <p className="font-medium text-base py-2">
                                            Otentikasi langkah ke tiga
                                        </p>

                                        <p className="font-extralight text-sm text-[#616161]">
                                            Buat kata sandi yang kuat untuk melindungi data pelanggan Anda di dashboard ChurnGuard.
                                        </p>
                                    </div>

                                    {/* PASSWORD */}
                                    <div className="relative text-left mt-4">
                                        <p className="text-regular">Password Baru</p>

                                        <div className="flex text-sm items-center border border-gray-300 rounded-lg p-3 w-full focus-within:ring-2 focus-within:ring-[#023048] mb-3">

                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="20"
                                                height="20"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                className="text-gray-400 mr-2"
                                            >
                                                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                                <path d="M5 13a2 2 0 0 1 2 -2h10a2 2 0 0 1 2 2v6a2 2 0 0 1 -2 2h-10a2 2 0 0 1 -2 -2v-6z" />
                                                <path d="M11 16a1 1 0 1 0 2 0a1 1 0 0 0 -2 0" />
                                                <path d="M8 11v-4a4 4 0 1 1 8 0v4" />
                                            </svg>

                                            <div className="relative w-full">
                                                <input
                                                    type={showPassword ? "text" : "password"}
                                                    placeholder="Masukkan password baru"
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

                                    {/* KONFIRMASI PASSWORD */}
                                    <div className="relative text-left mt-4">
                                        <p className="text-regular">Konfirmasi Password</p>

                                        <div className="flex text-sm items-center border border-gray-300 rounded-lg p-3 w-full focus-within:ring-2 focus-within:ring-[#023048] mb-3">

                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="20"
                                                height="20"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                className="text-gray-400 mr-2"
                                            >
                                                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                                <path d="M5 13a2 2 0 0 1 2 -2h10a2 2 0 0 1 2 2v6a2 2 0 0 1 -2 2h-10a2 2 0 0 1 -2 -2v-6z" />
                                                <path d="M11 16a1 1 0 1 0 2 0a1 1 0 0 0 -2 0" />
                                                <path d="M8 11v-4a4 4 0 1 1 8 0v4" />
                                            </svg>

                                            <div className="relative w-full">
                                                <input
                                                    type={showPassword ? "text" : "password"}
                                                    placeholder="Konfirmasi password"
                                                    value={confirmPassword}
                                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                                    className="outline-none w-full pr-8"
                                                />
                                            </div>
                                        </div>

                                        {/* VALIDASI */}
                                        {confirmPassword.length > 0 && (
                                            <p
                                                className={`text-xs mt-1 ${password === confirmPassword
                                                    ? "text-[#4ABC4C]"
                                                    : "text-[#FF1515]"
                                                    }`}
                                            >
                                                {password === confirmPassword
                                                    ? "Password cocok"
                                                    : "Password tidak cocok"}
                                            </p>
                                        )}
                                    </div>

                                    {/* PASSWORD CHECK */}
                                    <div className="mt-4 text-left text-xs">
                                        <p className="mb-2 text-black">
                                            Kata sandi Anda harus memiliki:
                                        </p>

                                        <div className="flex gap-8">

                                            <div className="flex flex-col gap-2">

                                                <div className="flex items-start gap-2">
                                                    <CheckIcon ok={checks.length} />

                                                    <span
                                                        className={
                                                            checks.length
                                                                ? "text-[#4ABC4C]"
                                                                : "text-[#616161]"
                                                        }
                                                    >
                                                        Minimal 8 karakter
                                                    </span>
                                                </div>

                                                <div className="flex items-start gap-2">
                                                    <CheckIcon ok={checks.letter} />

                                                    <span
                                                        className={
                                                            checks.letter
                                                                ? "text-[#4ABC4C]"
                                                                : "text-[#616161]"
                                                        }
                                                    >
                                                        Huruf besar & kecil
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="flex flex-col gap-2">

                                                <div className="flex items-start gap-2">
                                                    <CheckIcon ok={checks.number} />

                                                    <span
                                                        className={
                                                            checks.number
                                                                ? "text-[#4ABC4C]"
                                                                : "text-[#616161]"
                                                        }
                                                    >
                                                        Minimal 1 angka
                                                    </span>
                                                </div>

                                                <div className="flex items-start gap-2">
                                                    <CheckIcon ok={checks.special} />

                                                    <span
                                                        className={
                                                            checks.special
                                                                ? "text-[#4ABC4C]"
                                                                : "text-[#616161]"
                                                        }
                                                    >
                                                        1 karakter khusus
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* STRENGTH BAR */}
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
                                        Kekuatan kata sandi:
                                        <span style={{ color: strengthColor }}>
                                            {" "} {strengthText}
                                        </span>
                                    </p>

                                    <button
                                        type="button"
                                        onClick={handleResetPassword}
                                        disabled={password !== confirmPassword}
                                        className="bg-[#000000] text-white w-full h-10 rounded-lg hover:bg-[#667790] transition duration-200 font-semibold disabled:bg-gray-400 disabled:cursor-not-allowed mt-4"
                                    >
                                        Simpan Password Baru
                                    </button>

                                </div>
                            )}

                        </form>
                    </div>
                </div>
            </div>
        </main>

    );
}

export default ForgetPass;