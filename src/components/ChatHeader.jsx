
import { useState, useRef, useEffect } from "react";
import { Menu, User as UserIcon, LogOut, ArrowUpCircle } from "lucide-react";

export default function ChatHeader({ user, isSidebarOpen, onToggleSidebar, onLogout }){


      const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

 useEffect(() => {

    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

    const userInitial = user?.user?.username ? user?.user?.username.charAt(0).toUpperCase() : "U";
      return (
    <header className="bg-neutral-800 border-b border-gray-700/50 px-4  py-3 flex items-center justify-between">
   
      <div className="flex items-center gap-4">
        
        {!isSidebarOpen && (
          <button
            onClick={onToggleSidebar}
            className="p-1 hover:bg-gray-700/50 rounded-lg transition-colors"
          >
            <Menu className="w-5 h-5 text-gray-400" />
          </button>
        )}
        <h1 className="text-white font-inter text-lg font-semibold">AI Logo Generator</h1>
      </div>

      {/* Right side (user profile dropdown) */}
       <div className="relative  hidden md:block"  ref={menuRef}>
        {/* User Section (clickable) */}
        <div
          onClick={() => setOpen(!open)}
          className="flex items-center gap-3 min-w-0 cursor-pointer hover:bg-gray-700/30 p-2 rounded-lg"
        >
         <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-teal-500 rounded-full flex items-center justify-center">
            <span className="text-white font-semibold font-inter text-sm">
              {userInitial}
            </span>
          </div>
          <div className="min-w-0">
            <p className="text-white text-sm font-inter font-medium truncate">{user?.user.username}</p>
            
          </div>
        </div>

        {open && (
          <div className="absolute right-0 mt-2 w-48 bg-neutral-800 border border-gray-700 rounded-xl shadow-lg overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-700">
              <p className="text-white text-sm font-medium font-inter  truncate">{user?.user.username}</p>
              <p className="text-gray-400 text-xs truncate font-inter ">{user?.user.email}</p>
            </div>
           
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
    </header>
  );

}