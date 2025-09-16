import React, { useState } from "react";
import { apiService } from "../services/api";

const ForgotPassword = ({ onBack }) => {
    const [email, setEmail] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");
        setSuccessMessage("");

        try {
            const response = await fetch("http://localhost:3000/api/auth/forgot-password", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Failed to send reset link.");
            }

            setSuccessMessage(data.message || "Password reset link sent to your email.");
            setEmail("");
        } catch (err) {
            setError(err.message || "Something went wrong.");
        } finally {
            setIsLoading(false);
        }
    };


    return (
        <form onSubmit={handleSubmit}>
            <h2>Forgot Password</h2>
            <p className="lead">Enter your email to reset your password.</p>

            {error && (
                <div className="mb-3 p-2 bg-red-500/20 border border-red-500/30 rounded-lg">
                    <p className="text-red-200 text-md">{error}</p>
                </div>
            )}
            {successMessage && (
                <div className="mb-3 p-2 bg-green-500/20 border border-green-500/30 rounded-lg">
                    <p className="text-green-200 text-md">{successMessage}</p>
                </div>
            )}

            <div className="field">
                <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
            </div>

            <div className="actions">
                <button type="submit" className="btn" disabled={isLoading}>
                    {isLoading ? "Sending..." : "Send Reset Link"}
                </button>
            </div>

            <div className="toggle">
                Remembered your password?
                <span onClick={onBack}> Back to Sign in</span>
            </div>
        </form>
    );
};

export default ForgotPassword;
