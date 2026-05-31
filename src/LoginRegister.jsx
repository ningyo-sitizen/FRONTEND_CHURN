import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function LoginRegister() {
    const [email, setName] = useState("");
    const [emailREG, setEmailREG] = useState("");
    const [emailLogin, setEmailLogin] = useState("");
    const [password, setPassword] = useState("");
    const [otp, setOtp] = useState("");
    const [showOtp, setShowOtp] = useState(false);
    const [showRegis,setshowRegis] = useState(false)
    const [nameREG,setnameREG] = useState("")
    const [passREG,setpassREG] = useState("")

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const error = params.get("error");

        if (error === "cancelled") {
            console.log("User cancel login");
            window.close();
        }

        const handleMessage = (event) => {
            if (!event.origin.includes("localhost")) return;

            const { token } = event.data;

            if (token) {
                localStorage.setItem("token", token);
                console.log("Google Token:", token);

                window.location.href = "/auth-check";
            }

            if (event.data?.error) {
                console.log("Error:", event.data.error);
            }
        };

        window.addEventListener("message", handleMessage);

        return () => {
            window.removeEventListener("message", handleMessage);
        };
    }, []);
    const handleOtpGet = async () => {
        try {
            const res = await fetch(
                `http://localhost:5000/auth/register/get-otp?email=${emailREG}`
            );
        } catch (err) {
            console.log("Register failed:", err);
        }
    }

    const handleRegister = async () => {
        try {
            const res = await fetch("http://localhost:5000/auth/register/check-email", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({email: emailREG }),
            });
            const data = await res.json();

            if (!res.ok) {
                console.log("Register error:", data.message);
                return;
            }
            setShowOtp(true);
            console.log("Email available, show OTP");
            handleOtpGet()
        } catch (err) {
            console.log("Register failed:", err);
        }
    };

    const handleOtpCheck = async () =>{
        try{
            const res  = await fetch("http://localhost:5000/auth/register/check-otp",{
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({email : emailREG,otp : otp}),
            })
            const data = await res.json()

            if (!res.ok){
                console.log("otp salah")
                return
            }
            console.log("otp benar")
            setshowRegis(true)
        }catch(err){
            console.log("Register failed:", err);
        }
    }
    const navigate = useNavigate();
    const handleLogin = async () => {
        try {

            const token = localStorage.getItem("token");
            
            const res = await fetch("http://localhost:5000/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({email: emailLogin, pass: password }),
            });

            const data = await res.json();

            if (!res.ok) {
                console.log("Login error:", data.message);
                return;
            }
            localStorage.setItem("token", data.token);
            navigate('/login-success')

        } catch (err) {
            console.log("Login failed:", err);
        }
    };
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
        const res = await fetch("http://localhost:5000/auth/register/newAcc",{
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({name : nameREG, email: emailREG ,password: passREG}),
        })

        const data = await res.json()

        localStorage.setItem("token", data.token);
        Navigate('/login-success')
    }

    return (
        <div>
            <h2>Auth</h2>

            <input
                placeholder="email"
                value={emailLogin}
                onChange={(e) => setEmailLogin(e.target.value)}
            />

            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />

            <div>
                <button onClick={handleLogin}>Login</button>
            </div>

            <hr />
            <input
                placeholder="Email"
                value={emailREG}
                onChange={(e) => setEmailREG(e.target.value)}
            />
            <div>
                <button onClick={handleRegister}>Register</button>
            </div>

            <hr />
            {showOtp && (
                <div>
                    <input
                        placeholder="Enter OTP"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                    />
                    <button onClick={handleOtpCheck}>
                        Verify OTP
                    </button>
                </div>
            )}
            <hr />
            {showRegis && (
                <div>
                    <input
                        placeholder="Enter nama mu"
                        value={nameREG}
                        onChange={(e) => setnameREG(e.target.value)}
                    />
                    <input
                        placeholder="Enter pass mu"
                        value={passREG}
                        onChange={(e) => setpassREG(e.target.value)}
                    />
                    <button onClick={makeNewAcc}>
                        Verify OTP
                    </button>
                </div>
            )}
            <hr />
            <div>
                <button onClick={() => openPopup("http://localhost:5000/auth/google/login")}>
                    Login with Google
                </button>

                <button onClick={() => openPopup("http://localhost:5000/auth/google/register")}>
                    Register with Google
                </button>
            </div>
        </div>
    );
}