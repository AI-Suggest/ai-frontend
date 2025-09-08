// import React, { useState } from "react";
// import { Eye, EyeOff, Sparkles } from "lucide-react";
// import { apiService } from "../../services/api";

// const Signup = ({ onLogin, switchToLogin }) => {
//   const [showPassword, setShowPassword] = useState(false);
//   const [formData, setFormData] = useState({ name: "", email: "", password: "" });
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState("");

//   const handleChange = (e) => {
//     setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
//     setError("");
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setIsLoading(true);
//     setError("");
//     try {
//       const user = await apiService.signup(formData);
//       onLogin(user);
//     } catch (err) {
//       setError(err.message || "Signup failed. Try again.");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit} className="space-y-6">
//       {error && <p className="text-red-400">{error}</p>}
//       <div>
//         <label className="block text-sm text-blue-200">Full Name</label>
//         <input
//           type="text"
//           name="name"
//           className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white"
//           placeholder="Enter your name"
//           value={formData.name}
//           onChange={handleChange}
//           required
//         />
//       </div>

//       <div>
//         <label className="block text-sm text-blue-200">Email</label>
//         <input
//           type="email"
//           name="email"
//           className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white"
//           placeholder="Enter your email"
//           value={formData.email}
//           onChange={handleChange}
//           required
//         />
//       </div>

//       <div>
//         <label className="block text-sm text-blue-200">Password</label>
//         <div className="relative">
//           <input
//             type={showPassword ? "text" : "password"}
//             name="password"
//             className="w-full px-4 py-3 pr-12 bg-white/5 border border-white/20 rounded-xl text-white"
//             placeholder="Enter your password"
//             value={formData.password}
//             onChange={handleChange}
//             required
//           />
//           <button
//             type="button"
//             onClick={() => setShowPassword(!showPassword)}
//             className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-300"
//           >
//             {showPassword ? <EyeOff /> : <Eye />}
//           </button>
//         </div>
//       </div>

//       <button
//         type="submit"
//         disabled={isLoading}
//         className="w-full py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-xl flex items-center justify-center gap-2"
//       >
//         {isLoading ? (
//           <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
//         ) : (
//           <>
//             <Sparkles className="w-4 h-4" /> Create Account
//           </>
//         )}
//       </button>

//       <p className="text-blue-200 text-sm text-center mt-4">
//         Already have an account?{" "}
//         <button
//           type="button"
//           onClick={switchToLogin}
//           className="text-purple-400 hover:underline"
//         >
//           Sign in
//         </button>
//       </p>
//     </form>
//   );
// };

// export default Signup;


// components/Signup.jsx
import React, { useState } from "react";
import { Eye, EyeOff, Sparkles } from "lucide-react";
import { apiService } from "../../services/api";

const Signup = ({ onLogin, switchToLogin }) => {
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const user = await apiService.signup(formData);
      onLogin(user);
    } catch (error) {
      setError(error.message || "Signup failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-2">Create account</h2>
      <p className="text-blue-200 text-sm mb-6">
        Join us to start creating amazing AI images
      </p>

      {error && (
        <div className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-lg">
          <p className="text-red-200 text-sm">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-blue-200 mb-2">
            Full Name
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-blue-300/50"
            placeholder="Enter your full name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-blue-200 mb-2">
            Email
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-blue-300/50"
            placeholder="Enter your email"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-blue-200 mb-2">
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 pr-12 bg-white/5 border border-white/20 rounded-xl text-white placeholder-blue-300/50"
              placeholder="Enter your password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-300"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white font-semibold rounded-xl flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
          ) : (
            <>
              <Sparkles size={16} /> Create Account
            </>
          )}
        </button>
      </form>

      <p className="mt-6 text-blue-200 text-sm text-center">
        Already have an account?{" "}
        <button
          onClick={switchToLogin}
          className="text-purple-400 hover:text-purple-300 font-medium"
        >
          Sign in
        </button>
      </p>
    </div>
  );
};

export default Signup;
