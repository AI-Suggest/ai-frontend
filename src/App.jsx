import React, { useState, useEffect } from 'react';
import AuthScreen from './components/AuthScreen';
import MainApp from './components/MainApp';

function App() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    console.log("helooo")
    const savedUser = localStorage.getItem('user');
 
  console.log(import.meta.env.VITE_API_URL,"hhhhhhhh");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
localStorage.setItem('user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen  bg-[#0d1b2a] from-slate-900 to-slate-900 flex items-center justify-center">
        <div className="animate-pulse">
          <div className="w-8 h-8 bg-purple-500 rounded-full"></div>
        </div>
      </div>
    );
  }

  return (
   <>
      {!user ? (
        <AuthScreen onLogin={handleLogin} />
      ) : (
        <MainApp user={user} onLogout={handleLogout} />
      )}
</>
  );
}

export default App;