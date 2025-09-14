import React, { useState } from 'react';

// import { useAuth } from '../../hooks/useAuth.jsx';
import { Eye, EyeOff } from 'lucide-react';

const Login = ({ onToggleMode }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
//   const { login } = useAuth();

  const handleSubmit = async (e) => {
    // e.preventDefault();
    // setLoading(true);
    // setError('');

    // try {
    //   const result = await login(email, password);
    //   if (!result.success) {
    //     setError(result.error);
    //   }
    // } catch (err) {
    //   setError('An unexpected error occurred');
    // } finally {
    //   setLoading(false);
    // }
  };

  const handleDemo = () => {
    setEmail('demo@aisuggest.com');
    setPassword('demo123');
  };

  return (
    <div className="h-screen w-screen flex items-center justify-center bg-[#0d1b2a] relative overflow-hidden">
      {/* Animated background particles */}
    <div className="absolute w-full h-full overflow-hidden">
   <span className="absolute top-10 left-1/3 w-6 h-6 bg-purple-500 rounded-full opacity-90 blur-sm"></span>
   <span className="absolute bottom-20 right-40 w-8 h-8 bg-blue-400 rounded-full opacity-90 blur-sm"></span>
   <span className="absolute top-1/2 left-10 w-5 h-5 bg-pink-400 rounded-full opacity-90 blur-sm"></span>
  <span className="absolute bottom-10 left-1/2 w-7 h-7 bg-cyan-400 rounded-full opacity-90 blur-sm"></span>
   <span className="absolute top-1/3 right-1/4 w-6 h-6 bg-indigo-400 rounded-full opacity-90 blur-sm"></span>
  <span className="absolute top-20 right-1/3 w-5 h-5 bg-yellow-400 rounded-full opacity-90 blur-sm"></span>
   <span className="absolute bottom-1/4 left-1/4 w-6 h-6 bg-green-400 rounded-full opacity-90 blur-sm"></span>
   <span className="absolute top-3/4 right-10 w-7 h-7 bg-red-400 rounded-full opacity-90 blur-sm"></span>
 </div>


<div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
        <div className="absolute top-40 right-32 w-1 h-1 bg-blue-400 rounded-full animate-ping"></div>
        <div className="absolute bottom-32 left-1/4 w-1.5 h-1.5 bg-pink-400 rounded-full animate-pulse"></div>
        <div className="absolute top-1/3 right-20 w-1 h-1 bg-cyan-400 rounded-full animate-ping"></div>
        <div className="absolute bottom-20 right-1/4 w-2 h-2 bg-purple-300 rounded-full animate-pulse"></div>
      </div>
      <div className="flex max-w-6xl w-full">
        {/* Left side - Brand */}
        <div className="hidden md:flex flex-1 items-center justify-center p-8">
          <div className="text-left">
            <div className="flex items-center  mb-8">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center mr-4">
                <div className="w-8 h-8 bg-white rounded-full"></div>
              </div>
              <div className="text-left">
                <h1 className="text-3xl font-bold font-inter  text-white">AI Suggest</h1>
                <p className="text-gray-400 font-inter ">Smarter choices, instantly.</p>
              </div>
            </div>
            <p className="text-gray-300 text-left  font-inter  text-lg leading-relaxed max-w-md">
              Personalized suggestions powered by AI — for products, content, and decisions. 
              Sign in to access your suggestion dashboard.
            </p>
          </div>
        </div>

        {/* Right side - Login form */}
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="w-full  hh  max-w-2xl">
            <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-8 border border-slate-700/50 shadow-2xl">
              <div className="text-center mb-4">
                <h2 className="text-2xl text-left font-bold  font-inter   text-white mb-2">Welcome back</h2>
                <p className="text-gray-400 font-inter    text-left ">Sign in to access AI-powered suggestions tailored for you.</p>
              </div>

              {error && (
                <div className="mb-6 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-gray-400"
                    placeholder="Email"
                    required
                  />
                </div>

                <div>
                 
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-gray-400 pr-12"
                      placeholder="Password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 font-inter   bg-gradient-to-r from-purple-500 to-blue-500 text-white py-3 px-6 rounded-lg font-medium hover:from-purple-600 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-slate-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Signing in...' : 'Sign in'}
                  </button>
                  
                  <button
                    type="button"
                    onClick={handleDemo}
                    className="px-6 py-3 border border-slate-600 text-gray-300 rounded-lg hover:bg-slate-700/50 focus:outline-none focus:ring-2 focus:ring-slate-500 transition-all duration-200"
                  >
                    Use demo
                  </button>
                </div>
              </form>

              <div className="mt-6 text-center">
                <span className="text-gray-400 font-inter   ">Don't have an account? </span>
                <button
                  onClick={onToggleMode}
                  className="text-cyan-400 font-inter   hover:text-cyan-300 font-medium transition-colors"
                >
                  Create account
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;


