import { useState, useRef, useEffect } from "react";
import { Plus, X, MessageSquare, Trash2, LogOut,ArrowUpCircle,  User as UserIcon, Settings, Zap } from 'lucide-react';

const Sidebar = ({
  isOpen,
  onToggle,
  sessions,
  currentSession,
  onNewSession,
  onSelectSession,
  onDeleteSession,
  user,
  onLogout,
}) => {
  if (!isOpen) return null;

      const [open, setOpen] = useState(false);
  const menuRef = useRef(null);
  const formatDate = (date) => {
    const now = new Date();
    const messageDate = new Date(date);
    const diffInHours = (now - messageDate) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return messageDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffInHours < 168) { // 7 days
      return messageDate.toLocaleDateString([], { weekday: 'short' });
    } else {
      return messageDate.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };



   useEffect(() => {

      function handleClickOutside(e) {
        if (menuRef.current && !menuRef.current.contains(e.target)) {
          setOpen(false);
        }
      }
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);
  
      const userInitial = user?.name ? user.name.charAt(0).toUpperCase() : "U";

  return (
  <div
  className={`fixed top-0 left-0 h-full w-80 bg-[#0d0d0d] border-r border-gray-800 flex flex-col font-inter
    transform transition-transform duration-300
    ${isOpen ? 'translate-x-0' : '-translate-x-full'}
    md:translate-x-0
  `}
>
<div className="flex items-center justify-between  p-3 lg:px-6  lg:py-6 border-b border-gray-800">
  {/* Logo */}
  <div className="flex items-center gap-3">
    <div
      className="w-6 h-6 rounded-full shadow-lg"
      style={{ backgroundColor: "#558fd6", boxShadow: "0 0 12px #558fd6" }}
    ></div>
    <h1
      className="font-semibold text-xl font-inter drop-shadow-sm"
      style={{ color: "#765be9" }}
    >
      Logo Studio
    </h1>
  </div>


  <button
    onClick={onToggle}
    className="p-2 rounded-md hover:bg-gray-700/50 transition md:hidden"
  >
    <X className="w-5 h-5 text-gray-400" />
  </button>
</div>

      <div className='overflow-y-auto  custom-scrollbar '>
        
     <div className="flex-1 px-4 py-3 sm:px-6 sm:py-3 md:px-4 md:py-4  lg:px-4 lg:pt-8 lg:pb-4 ">
          <h3 className="text-gray-400  font-bold font-inter text-sm uppercase tracking-wide mb-3 md:mb-4 lg:mb-4">
            Workspace
          </h3>
          <div className="space-y-2">
            <button className="w-full text-left font-inter p-2 md:p-2 sm:p-2 lg:p-2 text-sm  sm:text-sm   md:text-lg lg:text-lg text-gray-300 rounded-md hover:bg-[#1a1a1a] transition">
              Prompts library
            </button>

          </div>
        </div>



        <div className="flex-1 px-4 py-2 sm:p-3 lg:p-4 ">
        <div className="flex items-center lg:mt-3 justify-between mb-0 sm:mb-4">
            <h3 className="text-gray-400   text-xs uppercase tracking-wide font-semibold">
              Recent Chats
            </h3>
            <span className="text-gray-500 text-xs">{sessions.length}</span>
          </div>

          <div className="space-y-2">
            {sessions.map((session) => (
              <div
                key={session.id}
                className={`group flex items-start gap-3 p-3 rounded-xl cursor-pointer transition-all duration-200 ${currentSession?.id === session.id
                    ? 'bg-slate-700/50 text-white'
                    : 'hover:bg-white/5 border border-transparent hover:border-gray-600/30'
                  }`}
                onClick={() => onSelectSession(session)}
              >

                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-medium truncate leading-tight">{session.title}</p>
                  <div className="flex items-center gap-2 mt-1">
                   <span className="text-gray-400 text-xs">
                       {session.messages?.length || 0} messages
                     </span>
                    <span className="text-gray-500 text-xs">•</span>
                    <span className="text-gray-500 text-xs">
                      {formatDate(session.createdAt)}
                    </span>
                  </div>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteSession(session.id);
                  }}
                  className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-red-500/20 rounded-lg transition-all duration-200"
                >
                  <Trash2 className="w-3.5 h-3.5 text-red-400" />
                </button>
              </div>
            ))}
          </div>

          {sessions.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-800/50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="w-8 h-8 text-gray-600" />
              </div>
              <p className="text-gray-500 text-sm font-medium">No sessions yet</p>
              <p className="text-gray-600 text-xs mt-1">Create your first image generation</p>
            </div>
          )}
        </div>
      </div>
      <div className="p-4 mt-auto border-t border-gray-700/50">
        <div className=" pb-2 space-y-3">
          <button onClick={onNewSession} className=" flex items-center font-inter justify-center  w-full py-2.5 text-sm text-gray-200 bg-[#1a1a1a] rounded-md hover:bg-[#262626] transition">
            <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform duration-200" />
            <span>New Chat</span>
          </button>

        </div>
       
    <div className="relative bg-[#1a1a1a] rounded-md block md:hidden"  ref={menuRef}>
        {/* User Section (clickable) */}
        <div
          onClick={() => setOpen(!open)}
          className="flex items-center gap-3 min-w-0 cursor-pointer hover:bg-gray-700/30 p-2 rounded-lg"
        >
         <div className="w-6 h-6 bg-gradient-to-r from-green-500 to-teal-500 rounded-full flex items-center justify-center">
            <span className="text-white font-semibold font-inter text-sm">
              {userInitial}
            </span>
          </div>
          <div className="min-w-0">
            <p className="text-white text-sm font-inter font-medium truncate">{user?.name}</p>
            
          </div>
        </div>

        {open && (
          <div className="absolute  top-[-145px] left-0  w-48 bg-neutral-800 border border-gray-700 rounded-xl shadow-lg overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-700">
              <p className="text-white text-sm font-medium font-inter  truncate">{user?.name}</p>
              <p className="text-gray-400 text-xs truncate font-inter ">{user?.email}</p>
            </div>
            <button
              onClick={() => alert("Upgrade Plan clicked")}
              className="w-full px-4 py-2 flex items-center gap-2 text-sm text-gray-200 hover:bg-gray-700"
            >
              <ArrowUpCircle className="w-4 h-4" />
              <span className="font-inter">Upgrade Plan</span>
            </button>
            <button
              onClick={onLogout}
              className="w-full px-4 py-2  font-inter flex items-center gap-2 text-sm text-gray-200 hover:bg-gray-700"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        )}
      </div>
       
      </div>
    </div>
  );
};

export default Sidebar;





