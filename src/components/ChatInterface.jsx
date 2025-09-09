import React, { useState, useRef, useEffect } from 'react';
import { Send, Menu, Download,User as UserIcon,LogOut, Loader, ImageIcon, Copy, RefreshCw } from 'lucide-react';
import { apiService } from '../services/api';

// import { login, signup, getProfile } from "../services/api";
import ChatHeader from './ChatHeader';
const ChatInterface = ({
  session,
  user,
   setCurrentSession,
  onUpdateSession,
  onToggleSidebar,
  isSidebarOpen,
   onLogout
}) => {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);
const[error,setError]=useState("")
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  

  useEffect(() => {

    scrollToBottom();
  }, [session?.messages]);

  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px';
    }
  };

  useEffect(() => {
    adjustTextareaHeight();
  }, [prompt]);

  const isValidPrompt = (text) => {
  if (!text) return false;

  const trimmed = text.trim();

  // Must be at least 3 characters
  if (trimmed.length < 3) return false;

  // Must contain at least one **space** (so single random letters are blocked)
  if (!/\s/.test(trimmed)) return false;

  // Must contain **mostly letters** (not just numbers or gibberish)
  const letters = trimmed.replace(/[^a-zA-Z]/g, "");
  if (letters.length < 3) return false;

  // Optional: no super long single words like "asdhjasdhjashdj"
  const words = trimmed.split(/\s+/);
  if (words.some((w) => w.length > 30)) return false;

  return true; // ✅ looks like a real prompt
};


 
const generateImage = async (userPrompt) => {
   if (!userPrompt.trim()) return;

  // ❌ Handle invalid prompt before calling backend
  if (!isValidPrompt(userPrompt)) {
    const errorMessage = {
      id: Date.now().toString(),
      type: "error",
      originalPrompt: userPrompt,
      prompt: "❌ Incorrect prompt. Please enter a valid description.",
      timestamp: new Date(),
    };

    onUpdateSession(session?.id || null, {
      ...session,
      messages: [...(session?.messages || []), errorMessage],
    });

    setError("❌ Incorrect prompt. Please enter a valid description.");
    return true;
  }


  try {
    let currentSession = session;
  if (currentSession) {
    const updatedSession = { ...currentSession, title: userPrompt };
    setCurrentSession(updatedSession);
    // Optionally, update the session in the backend as well (if necessary)
    onUpdateSession(updatedSession.id, updatedSession);
  }
  
    if (!currentSession) {
      currentSession = {
        id: null,     
        title: userPrompt.slice(0, 50),
        messages: [],
        createdAt: new Date(),
          
      };

      onUpdateSession(currentSession.id, currentSession);
      window.dispatchEvent(new CustomEvent("createSession", { detail: currentSession }));
    }


   if (!userPrompt) {
     
      const userMessage = {
        id: Date.now().toString(),
        type: "user",
        prompt: userPrompt,
        timestamp: new Date(),
      };

      onUpdateSession(currentSession.id, {
        ...currentSession,
        messages: [...currentSession.messages, userMessage],
      });

      return; 
    }

    
    const serverChatId = currentSession.id ?? undefined;

    const userMessage = {
      id: Date.now().toString(),
      type: "user",
      prompt: userPrompt,
      timestamp: new Date(),
    };

    const updatedMessages = [...(currentSession.messages || []), userMessage];

    onUpdateSession(currentSession.id, {
      ...currentSession,

      messages: updatedMessages,
    });

    // 4) Call backend
    // IMPORTANT: apiService should not include chatId in the payload if it's undefined.
  const res = await apiService.generateImage(userPrompt, serverChatId);


const backendChatId = res?.chatId;
const latestAssistant = res?.newMessage;
 const assistantMessage = {
      id: Date.now().toString(),
      type: "assistant",
      prompt: latestAssistant.prompt,
      genImgUrl: latestAssistant.genImgUrl,
      timestamp: new Date(),
    };
   const updatedSession = {
      ...currentSession,
      id: res?.chatId ?? currentSession.id,
      messages: [...updatedMessages, assistantMessage],
    };

    onUpdateSession(currentSession.id, updatedSession);
  } catch (error) {

    console.error("Image generation failed:", error);
       const errorMessage = {
      id: Date.now().toString(),
      type: "error",
       originalPrompt: userPrompt,  
      prompt: "⚠️ Failed to generate image. Please try again.",
      timestamp: new Date(),
    };

    onUpdateSession(session?.id || null, {
      ...session,
      messages: [...(session?.messages || []), errorMessage],
    });

    setError(error.message || "Something went wrong while generating image.");
  } finally {
    setIsGenerating(false);
  }
};





const handleSubmit = (e) => {
    e.preventDefault();
    if (!prompt.trim() || isGenerating ) return;
    
    generateImage(prompt);
    setPrompt('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

const downloadImage = async (url, filename = "download.png") => {
  try {
    const response = await fetch(url, { mode: "cors" }); // fetch the image
    const blob = await response.blob();
    const blobUrl = window.URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = blobUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // cleanup
    window.URL.revokeObjectURL(blobUrl);
  } catch (err) {
    console.error("Download failed:", err);
  }
}
  const copyPrompt = (prompt) => {
    navigator.clipboard.writeText(prompt);
  };
 const handleNoSessionSubmit =  (e) => {
    e.preventDefault();
    if (!prompt.trim() || isGenerating) return;

    // Create a new session automatically when user submits a prompt
    const newSession = {
      id: Date.now().toString(),
      title: prompt.slice(0, 50) + (prompt.length > 50 ? '...' : ''),
      messages: [],
      createdAt: new Date(),
    };

   // Update the session first, then generate the image
   onUpdateSession(newSession.id, newSession);
    
  //  Add this session to the parent component
   window.dispatchEvent(new CustomEvent('createSession', { detail: newSession }));
    
  //  Generate the image with the new session
    setTimeout(() => {
     generateImage(prompt);
    }, 100);
    
     setPrompt('');
  };


  const regenerateImage = (prompt) => {
  
    generateImage(prompt);
  };


 
  if (!session) {
    return (
        <div className="flex-1 flex flex-col">
        <ChatHeader user={user} isSidebarOpen={isSidebarOpen} onToggleSidebar={onToggleSidebar}  onLogout={onLogout}/>
    
    <div className='bg-neutral-900'>
          <div className="flex-1 flex items-center  justify-center p-4 sm:p-8">
          <div className="text-center max-w-md">
            <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <ImageIcon className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-4">Start Creating</h2>
            <p className="text-gray-400 mb-8 leading-relaxed">
              Describe anything you can imagine and watch it come to life with AI-powered image generation.
            </p>
            <div className="space-y-3 text-sm text-gray-500 mb-8">
              <p>💡 Try: "A majestic dragon flying over a cyberpunk city"</p>
              <p>🎨 Try: "Abstract art with vibrant colors and geometric shapes"</p>
              <p>🌅 Try: "Peaceful mountain landscape at sunset"</p>
            </div>
          </div>
        </div>

        {/* Prompt input for when no session exists */}
        <div className="p-4  mt-3 border-t border-gray-700/50 bg-zinc-900 backdrop-blur-sm">
         <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3"> 

            <div className="flex-1 relative">
              <textarea
                ref={textareaRef}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={window.innerWidth < 640 ? "Describe your image..." : "Describe the image you want to generate..."}
                className="w-full px-3 sm:px-4 py-3 bg-neutral-800 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none transition-all duration-200 backdrop-blur-sm text-sm sm:text-base"
             
                disabled={isGenerating}
                rows={1}
                style={{ minHeight: '48px', maxHeight: '120px' }}
              />
            </div>
            <button
              type="submit"
              disabled={!prompt.trim() || isGenerating}
              className="px-4 sm:px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-xl hover:from-purple-600 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2 font-medium text-sm sm:text-base"
            >
              {isGenerating ? (
                <Loader className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
              ) : (
                <Send className="w-4 h-4 sm:w-5 sm:h-5" />
              )}
              <span className="hidden sm:inline">{isGenerating ? 'Generating...' : 'Generate'}</span>
            </button>
          </form>
          
          <div className="mt-3 flex flex-wrap gap-2 overflow-x-auto pb-2">
            {['Realistic portrait', 'Abstract art', 'Landscape painting', 'Sci-fi concept'].map((suggestion) => (
              <button
                key={suggestion}
                onClick={() => setPrompt(suggestion)}
                className="px-3 py-1 text-xs bg-gray-700/50 text-gray-300 rounded-full hover:bg-gray-600/50 transition-colors whitespace-nowrap flex-shrink-0"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
</div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-screen">
      <ChatHeader user={user} isSidebarOpen={isSidebarOpen} onToggleSidebar={onToggleSidebar}  onLogout={onLogout}/>

      <div className="flex-1 overflow-y-auto p-4 space-y-6 bg-neutral-900">
        
        {session.messages.map((message) => (
  <div
    key={message.id}
    className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}
  >
    <div
      className={`max-w-3xl ${
        message.type === "user"
          ? "bg-gradient-to-r from-purple-600 to-blue-600"
          : "bg-zinc-950 backdrop-blur-sm border border-gray-700/50"
      } rounded-2xl p-4 shadow-lg`}
    >
      {message.type === "user" ? (
        // === USER BUBBLE ===
        <p className="text-white whitespace-pre-wrap">{message.prompt}</p>
      ) : (
        // === ASSISTANT BUBBLE ===
        <div>
          {/* If it's an error */}
          {message.type =="error" ? (
          <div className="text-red-400 flex flex-col gap-2">
    {/* Show original user prompt */}
    <p className="mb-0 font-medium text-white"> {message.originalPrompt}</p>
    
    {/* Show error message */}
    <p className="mb-0">{message.prompt}</p>
    
    {/* Retry button */}
    <button
      onClick={() => regenerateImage(message.originalPrompt)}
      className="self-start px-3 py-1 text-sm bg-red-600 hover:bg-red-700 text-white rounded-md transition"
    >
      Retry
    </button>
  </div>
          ) : (
            <div>
            <p className={`text-white ${!message.error ? "mb-4 g" : "hhh"}`}>
  {message.prompt}
</p>
              {message.genImgUrl && (
                <div className="relative group">
                  <img
                    src={message.genImgUrl}
                    alt="Generated"
                    className="rounded-xl max-w-full h-auto shadow-xl border border-gray-600/30"
                  />
                  <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 flex gap-2 transition-all duration-200">
                    <button
                      onClick={() =>
                        downloadImage(message.genImgUrl, message.prompt || "image.png")
                      }
                      className="p-2 bg-black/70 hover:bg-black/90 rounded-lg transition-all duration-200 backdrop-blur-sm"
                      title="Download image"
                    >
                      <Download className="w-4 h-4 text-white" />
                    </button>
                    <button
                      onClick={() => copyPrompt(message.prompt || message.content)}
                      className="p-2 bg-black/70 hover:bg-black/90 rounded-lg transition-all duration-200 backdrop-blur-sm"
                      title="Copy prompt"
                    >
                      <Copy className="w-4 h-4 text-white" />
                    </button>
                    <button
                      onClick={() =>
                        regenerateImage(message.prompt || message.content)
                      }
                      className="p-2 bg-black/70 hover:bg-black/90 rounded-lg transition-all duration-200 backdrop-blur-sm"
                      title="Regenerate image"
                    >
                      <RefreshCw className="w-4 h-4 text-white" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  </div>
))}
        
        {isGenerating && (
          <div className="flex justify-start">
            <div className="max-w-3xl bg-gray-800/80 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <Loader className="w-5 h-5 text-purple-400 animate-spin" />
                <p className="text-white">Generating your image...</p>
              </div>
              <div className="w-full bg-gray-700/50 rounded-full h-2">
                <div className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full animate-pulse" style={{width: '60%'}}></div>
              </div>
              <p className="text-gray-400 text-sm mt-2">This may take 30-40 seconds</p>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t border-gray-700/50 bg-zinc-900 backdrop-blur-sm">
        <form onSubmit={handleSubmit} className="flex gap-3">
          <div className="flex-1 relative">
            <textarea
              ref={textareaRef}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={window.innerWidth < 640 ? "Describe your image..." : "Describe the image you want to generate..."}
                className="w-full px-3 sm:px-4 py-3 bg-neutral-800 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none transition-all duration-200 backdrop-blur-sm text-sm sm:text-base"
              disabled={isGenerating}
              rows={1}
              style={{ minHeight: '48px', maxHeight: '120px' }}
            />
          </div>
          <button
            type="submit"
            disabled={!prompt.trim() || isGenerating}
            className="px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-xl hover:from-purple-600 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center gap-2 font-medium"
          >
            {isGenerating ? (
              <Loader className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
            {isGenerating ? 'Generating...' : 'Generate'}
          </button>
        </form>
        
        <div className="mt-3 flex flex-wrap gap-2">
          {['Realistic portrait', 'Abstract art', 'Landscape painting', 'Sci-fi concept'].map((suggestion) => (
            <button
              key={suggestion}
              onClick={() => setPrompt(suggestion)}
              className="px-3 py-1 text-xs bg-gray-700/50 text-gray-300 rounded-full hover:bg-gray-600/50 transition-colors"
            >
              {suggestion}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;