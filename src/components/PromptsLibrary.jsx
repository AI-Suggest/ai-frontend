import { useState } from "react";
import { Sparkles } from "lucide-react"; // for the ✨ icon
import { motion } from "framer-motion";
const prompts = [
  "A majestic dragon flying over a cyberpunk city skyline",
  "Abstract art with vibrant neon colors and geometric shapes",
  "Peaceful mountain landscape at sunset with glowing sky",
  "Minimalist flat logo of a wolf with sharp clean lines",
  "Futuristic city with floating cars and neon lights",
];

const PromptsLibrary = () => {
   const [copied, setCopied] = useState(null);

  const handleCopy = (text, index) => {
    navigator.clipboard.writeText(text);
    setCopied(index);
    setTimeout(() => setCopied(null), 1200);
  };


  return (
        <div className="relative min-h-screen bg-[#121212] text-white flex flex-col items-center px-6 py-12">

    

    <div className="w-full flex justify-center items-center py-8">
      <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-green-400 bg-clip-text text-transparent">
          Prompts Library
        </h1>
</div>
      

       
  
      {/* Prompt Grid */}
      <div className="grid gap-6 w-full max-w-5xl sm:grid-cols-2 lg:grid-cols-3">
        {prompts.map((prompt, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.15 }}
            className="relative bg-gradient-to-br from-[#1E1E1E] to-[#2A2A2A] rounded-2xl p-6 shadow-md 
            border border-transparent hover:border-purple-400/60 hover:shadow-purple-500/30 
            transition-transform hover:scale-[1.02]"
          >
            <p className="text-sm leading-relaxed mt-6">{prompt}</p>

            {/* Copy Button */}
            <button
              onClick={() => handleCopy(prompt, index)}
              className={`absolute top-3 right-3 px-3 py-1 rounded-md text-xs font-medium 
              transition transform hover:scale-105 
              ${
                copied === index
                  ? "bg-green-500"
                  : "bg-gradient-to-r from-purple-500 to-green-400 text-white"
              }`}
            >
              {copied === index ? "Copied!" : "Copy"}
            </button>
          </motion.div>
        ))}
      </div>

      {/* Tailwind keyframes for gradient animation */}
      <style jsx>{`
        @keyframes gradientMove {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
        .animate-gradientMove {
          animation: gradientMove 5s ease infinite;
        }
      `}</style>
    </div>
  );
};

export default PromptsLibrary;
