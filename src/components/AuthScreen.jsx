import React, { useState,useEffect,useRef } from 'react';
import { Zap, Sparkles, Eye, EyeOff } from 'lucide-react';
import ParticleBackground from './ParticleBackground';
import { apiService } from '../services/api';
// import { login, signup, getProfile } from "../services/api";

const AuthScreen = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const[passwordError,setPasswordError]= useState("")
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const canvasRef = useRef(null);
 const handleSubmit = async (e) => {
  e.preventDefault();
  setIsLoading(true);
  setError('');

  // 👉 Check password validity before API call

  try {
    let user;
    if (isLogin) {
      user = await apiService.login({
        email: formData.email,
        password: formData.password,
      });
       onLogin(user);
    } else {
        const passwordErr = getPasswordError(formData.password);
  if (passwordErr) {
    setPasswordError(passwordErr);
    setIsLoading(false);
    return; // 🚫 stop submit if password invalid
  }
    
      user = await apiService.signup({
        username: formData.name,
        email: formData.email,
        password: formData.password,
      });
    }
    // setIsLogin(true);
 
         setSuccessMessage(user.message);
      setFormData({ name: '', email: '', password: '' });

    // ✅ Only call when user is available
   

  } catch (error) {
    setError(error.message || 'Authentication failed. Please try again.');
  } finally {
    
    setIsLoading(false); // ✅ only reset loading state here
  }
};


const getPasswordError = (password) => {
  if (password.length < 8) return "Password must be at least 8 characters.";
  if (!/[A-Z]/.test(password)) return "Add at least one uppercase letter.";
  if (!/[a-z]/.test(password)) return "Add at least one lowercase letter.";
  if (!/\d/.test(password)) return "Add at least one number.";
  if (!/[@$!%*?&]/.test(password)) return "Add at least one special character.";
  return ""; // valid
};

  const handleChange = (e) => {
  const { name, value } = e.target;
  setFormData({ ...formData, [name]: value });

  if (name === "password") {
    setPasswordError(getPasswordError(value));
  }else{
     setPasswordError("");
  }
     setError('');
};
  const handleDemoLogin = () => {
    const demoUser = {
      id: 'demo-user',
      email: 'demo@example.com',
      name: 'Demo User',
      token: 'demo-token',
    };
    onLogin(demoUser);
  };
    const handleCreateAccountClick = () => {
    setIsLogin(true); // Switch to 'Create account' view
    setError('');// Reset the user input (or any other state)
    setPasswordError("")
  };
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
         Turn your words into visuals — AI-powered text-to-image generation. Sign in to create now.
          </p>
        </div>

        {/* Auth Card */}
        <div className="hero-card">
            {error && (
              <div className="mb-3 p-2 bg-red-500/20 border border-red-500/30 rounded-lg">
                <p className="text-red-200 text-md">{error}</p>
              </div>
            )}
            {successMessage && (
  <div className="mb-3 p-2 bg-green-500/20 border border-green-500/30 rounded-lg">
    <p className="text-green-200 text-lg">{successMessage}</p>
  </div>
)}
          {isLogin ? (
            <form onSubmit={handleSubmit}>
              <h2>Welcome back</h2>
              <p className="lead">
                Sign in to access AI-powered suggestions tailored for you.
              </p>
              <div className="field">
                <input name="email"  value={formData.email}
                    onChange={handleChange}  type="email" placeholder="Email" required />
              </div>
              <div className="field relative">
                <input
                  name="password"
                   type={showPassword ? 'text' : 'password'}
                  placeholder="Password"
                  required
                  value={formData.password}
                    onChange={handleChange}
                />
                 <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
              </div>
              <div className="actions">
               <button type="submit" className="btn" disabled={isLoading}>
  {isLoading ? "Loading..." : "Sign in"}
</button>

            
              </div>
              <div className="toggle">
                Don’t have an account?
                <span onClick={() => setIsLogin(false)}> Create account</span>
              </div>
            </form>
          ) : (
            <form onSubmit={handleSubmit}>
              <h2>Create new account</h2>
              <p className="lead ">
                Join AI Suggest and start receiving personalized recommendations
                instantly.
              </p>
              <div className="field">
                <input name="name"  value={formData.name}
                    onChange={handleChange} type="text" placeholder="Full name" required={!isLogin} />
              </div>
              <div className="field ">
                <input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Email"
                  required
                />
              </div>
             
              <div className="field relative">
                <input className='focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparen'
                  name="password"
                   type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                    onChange={handleChange}
                  placeholder="Create password"
                  required
                />
                   <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
              </div>
               {passwordError && <p className="text-red-500 text-sm">{passwordError}</p>}
              <div className="actions">
                <button
  type="submit"
  className="btn"
  disabled={isLoading} // disables button while loading
>
  {isLoading ? "Creating..." : "Create account"} 
</button>
                {/* <button
                  type="button"
                  className="btn secondary"
                  onClick={() => fillDemo("signup")}
                >
                  Use demo
                </button> */}
              </div>
              <div className="toggle">
                Already a member?
                <span onClick={handleCreateAccountClick}> Sign in</span>
              </div>
            </form>
          )}
        </div>
      </div>
   
    </div>
  );
};

export default AuthScreen;
