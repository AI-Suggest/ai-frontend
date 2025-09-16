import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AuthScreen from "./components/AuthScreen";
import MainApp from "./components/MainApp";
import ForgotPassword from "./components/ForgetPassword";
import ResetPassword from "./components/ResetPassword";

function App() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0d1b2a] flex items-center justify-center">
        <div className="animate-pulse">
          <div className="w-8 h-8 bg-purple-500 rounded-full"></div>
        </div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        {!user ? (
          <>
            <Route path="/" element={<AuthScreen onLogin={handleLogin} />} />
            <Route path="/forgotPassword" element={<ForgotPassword />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />
          </>
        ) : (
          <Route path="/*" element={<MainApp user={user} onLogout={handleLogout} />} />
        )}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
