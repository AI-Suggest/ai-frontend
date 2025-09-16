import React, { useState, useRef, useEffect } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom"
import AuthScreen from "./AuthScreen";

const ResetPassword = ({ onBack }) => {
    const { token } = useParams(); // 🔹 This gets token from /reset-password/:token
    const navigate = useNavigate();
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const [showAuth, setShowAuth] = useState(false); // 🔹 toggle

    if (showAuth) {
        return <AuthScreen />; // 🔹 show AuthScreen instead of ResetPassword
    }

    const canvasRef = useRef(null);

    // 🔹 password validation
    const getPasswordError = (password) => {
        if (password.length < 8) return "Password must be at least 8 characters.";
        if (!/[A-Z]/.test(password)) return "Add at least one uppercase letter.";
        if (!/[a-z]/.test(password)) return "Add at least one lowercase letter.";
        if (!/\d/.test(password)) return "Add at least one number.";
        if (!/[@$!%*?&]/.test(password))
            return "Add at least one special character.";
        return "";
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccessMessage("");

        if (newPassword !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        const passwordErr = getPasswordError(newPassword);
        if (passwordErr) {
            setError(passwordErr);
            return;
        }

        try {
            setIsLoading(true);
            console.log("token",token)
            const response = await fetch(
                `http://localhost:3000/api/auth/reset-password/${token}`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ newPassword }),
                }
            );

            const data = await response.json();

            if (!response.ok) throw new Error(data.message || "Failed to update password.");

            setSuccessMessage(data.message || "Password updated successfully.");
            setNewPassword("");
            setConfirmPassword("");
        } catch (err) {
            setError(err.message || "Failed to update password. Try again.");
        } finally {
            setIsLoading(false);
        }
    };


    // 🔹 background particles (same as AuthScreen)
   useEffect(() => {
       const canvas = canvasRef.current;
       const ctx = canvas.getContext("2d");
       let w = (canvas.width = window.innerWidth);
       let h = (canvas.height = window.innerHeight);
       const DPR = window.devicePixelRatio || 1;
       canvas.width = w * DPR;
       canvas.height = h * DPR;
       canvas.style.width = w + "px";
       canvas.style.height = h + "px";
       ctx.scale(DPR, DPR);
   
       const resize = () => {
         w = window.innerWidth;
         h = window.innerHeight;
         canvas.width = w * DPR;
         canvas.height = h * DPR;
         canvas.style.width = w + "px";
         canvas.style.height = h + "px";
         ctx.scale(DPR, DPR);
       };
       window.addEventListener("resize", resize);
   
       const colors = [
         "rgba(106,17,203,0.14)",
         "rgba(37,117,252,0.12)",
         "rgba(0,198,255,0.10)",
         "rgba(255,117,140,0.09)",
       ];
       const rand = (min, max) => Math.random() * (max - min) + min;
   
       const orbs = Array.from(
         { length: Math.max(8, Math.round((w * h) / 150000)) },
         () => ({
           x: rand(0, w),
           y: rand(0, h),
           r: rand(14, 58),
           vx: rand(-0.15, 0.15),
           vy: rand(-0.05, 0.05),
           hue: colors[Math.floor(Math.random() * colors.length)],
           phase: Math.random() * Math.PI * 2,
           drift: rand(0.2, 1.2),
         })
       );
   
       function draw() {
         ctx.clearRect(0, 0, w, h);
         for (const o of orbs) {
           o.phase += 0.003 * o.drift;
           o.x += o.vx + Math.sin(o.phase) * 0.05;
           o.y += o.vy + Math.cos(o.phase) * 0.03;
   
           if (o.x < -o.r) o.x = w + o.r;
           if (o.x > w + o.r) o.x = -o.r;
           if (o.y < -o.r) o.y = h + o.r;
           if (o.y > h + o.r) o.y = -o.r;
   
           const g = ctx.createRadialGradient(
             o.x,
             o.y,
             Math.max(2, o.r * 0.05),
             o.x,
             o.y,
             o.r
           );
           g.addColorStop(0, o.hue.replace("0.", "0.9"));
           g.addColorStop(0.4, o.hue);
           g.addColorStop(1, "rgba(0,0,0,0)");
           ctx.beginPath();
           ctx.fillStyle = g;
           ctx.arc(o.x, o.y, o.r, 0, Math.PI * 2);
           ctx.fill();
         }
         requestAnimationFrame(draw);
       }
       draw();
   
       return () => window.removeEventListener("resize", resize);
     }, []);

    return (
        <div>
            <div className="bg-gradient" />
            <canvas ref={canvasRef} id="particles" />
            <div className="wrap">
                {/* Brand side */}
                <div className="brand">
                    <div className="logo">
                        <svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
                            <defs>
                                <linearGradient id="g1" x1="0" x2="1">
                                    <stop offset="0" stopColor="#6a11cb" />
                                    <stop offset="1" stopColor="#00c6ff" />
                                </linearGradient>
                            </defs>
                            <rect width="64" height="64" rx="14" fill="url(#g1)" />
                            <g transform="translate(10,10)" fill="#fff">
                                <circle cx="22" cy="18" r="8" opacity="0.95" />
                                <path
                                    d="M10 22c3-6 16-10 25-6"
                                    stroke="white"
                                    strokeWidth="2"
                                    fill="none"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    opacity="0.18"
                                />
                            </g>
                        </svg>
                        <div>
                            <h1>AI Suggest</h1>
                            <div className="subtitle">Smarter choices, instantly.</div>
                        </div>
                    </div>
                    <p className="tag">
                        Turn your words into visuals — AI-powered text-to-image generation.
                        Update your password to continue.
                    </p>
                </div>

                {/* Update Password Card */}
                <div className="hero-card">
                    <h2>Update Password</h2>
                    <p className="lead">
                        Enter your new password below to reset your account.
                    </p>

                    {error && (
                        <div className="mb-3 p-2 bg-red-500/20 border border-red-500/30 rounded-lg">
                            <p className="text-red-200">{error}</p>
                        </div>
                    )}
                    {successMessage && (
                        <div className="mb-3 p-2 bg-green-500/20 border border-green-500/30 rounded-lg">
                            <p className="text-green-200">{successMessage}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div className="field relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="New Password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                            >
                                {showPassword ? (
                                    <EyeOff className="w-5 h-5" />
                                ) : (
                                    <Eye className="w-5 h-5" />
                                )}
                            </button>
                        </div>

                        <div className="field">
                            <input
                                type="password"
                                placeholder="Confirm New Password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                        </div>

                        <div className="actions">
                            <button type="submit" className="btn" disabled={isLoading}>
                                {isLoading ? "Updating..." : "Update Password"}
                            </button>
                        </div>

                        <div className="toggle">
                            <span
                                className="cursor-pointer hover:underline text-[var(--accent-3)] ml-1.5"
                                onClick={() => navigate("/")}
                            >
                                Back to login
                            </span>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;
