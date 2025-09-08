import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import ChatInterface from './ChatInterface';
import { apiService } from '../services/api';
import { storage } from '../utils/storage';
// import { getSessions } from '../services/api';
import { stabilityAI } from "../services/stabilityApi";

const MainApp = ({ user, onLogout }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [currentSession, setCurrentSession] = useState(null);
  const [sessions, setSessions] = useState([]);
  // const [isLoading, setIsLoading] = useState(true);
useEffect(() => {
  function handleUpdateSessionId(e) {
    const { oldId, newId } = e.detail;

    setSessions((prev) =>
      prev.map((s) => (s.id === oldId ? { ...s, id: newId } : s))
    );

    setCurrentSession((prev) =>
      prev && prev.id === oldId ? { ...prev, id: newId } : prev
    );
  }

  window.addEventListener("updateSessionId", handleUpdateSessionId);
  return () => window.removeEventListener("updateSessionId", handleUpdateSessionId);
}, []);
  
  useEffect(() => {
    loadSessions();

    // Listen for session creation from ChatInterface (if needed)
    const handleCreateSession = (event) => {
      const newSession = event.detail;
      setSessions((prev) => [newSession, ...prev]);
      setCurrentSession(newSession);
    };

    window.addEventListener("createSession", handleCreateSession);
    return () => {
      window.removeEventListener("createSession", handleCreateSession);
    };
  }, []);

  const handlePreviousChatClick = async (session) => {
  try {
    console.log(session, "session___");

    if (!session.id) {
      // 🛡️ No DB id, so skip API and just load local messages
      console.log("No chatId found, showing local session only.");
      setCurrentSession(session);
      return;
    }

    // fetch full messages from backend
    const messages = await apiService.getPreviousChat(session.id);
    console.log("sidebar___", messages);

    // update session with messages
    setCurrentSession({
      ...session,
      messages,
    });
  } catch (err) {
    console.error("Failed to load previous chat:", err);
  }
};


  // 🔹 Load sessions from API instead of local storage
  const loadSessions = async () => {
    try {
      const history = await stabilityAI.getGenerationAllHistory(50);
 
      // transform backend response → sidebar-friendly format
      const formatted = history.map((item) => ({
        id: item.chatId,
        title: item.title || "Untitled Prompt",
        createdAt: item.createdAt,
        messages: [item], // ensure array so Sidebar count works
      }));

      setSessions(formatted);
    } catch (err) {
      console.error("Failed to load sessions:", err);
    }
  };

  const createNewSession = async () => {
    const newSession = {
      id: null,
      title: "New Image Generation",
      messages: [],
      createdAt: new Date(),
      test:false
    };
 
    setSessions((prev) => [newSession, ...prev]);
    setCurrentSession(newSession);
  };

  // const updateSession = async (sessionId, updatedSession) => {
  //   setSessions((prev) =>
  //     prev.map((session) =>
  //       session.id === sessionId
  //         ? { ...session, ...updatedSession }
  //         : session
  //     )
  //   );

  //   if (currentSession?.id === sessionId) {
  //     setCurrentSession((prev) =>
  //       prev ? { ...prev, ...updatedSession } : null
  //     );
  //   }
  // };


  const updateSession = (sessionId, updatedSession) => {
    console.log(sessionId,"sessionId___");
    console.log(updatedSession,"updatedSession____")
  setSessions((prev) =>
    prev.map((session) =>
      session.id === sessionId
        ? { ...session, ...updatedSession }
        : session
    )
  );

  setCurrentSession((prev) => {
    if (!prev || prev.id === sessionId) {
      return { ...updatedSession };
    }
    return prev;
  });
};
  const deleteSession = async (sessionId) => {
    try {
      await stabilityAI.deleteGeneration(sessionId);
      setSessions((prev) => prev.filter((session) => session.id !== sessionId));

      if (currentSession?.id === sessionId) {
        setCurrentSession(null);
      }
    } catch (err) {
      console.error("Failed to delete session:", err);
    }
  };
  // if (isLoading) {
  //   return (
  //     <div className="min-h-screen bg-[#0d1b2a] from-slate-900  to-slate-900 flex items-center justify-center">
  //       <div className="text-center">
  //         <div className="w-12 h-12 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mx-auto mb-4"></div>
  //         <p className="text-white">Loading your workspace...</p>
  //       </div>
  //     </div>
  //   );
  // }

  return (
    <div className="flex h-screen bg-neutral-800">
      <Sidebar
        isOpen={isSidebarOpen}
        onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
        sessions={sessions}
        currentSession={currentSession}
        onNewSession={createNewSession}
        onSelectSession={handlePreviousChatClick}
        onDeleteSession={deleteSession}
        user={user}
        onLogout={onLogout}
      />
      
      <div className={`flex-1 transition-all duration-300
  ${isSidebarOpen ? 'ml-0 md:ml-80' : 'ml-0'}
`}>
        <ChatInterface
          session={currentSession}
          user={user}
           setCurrentSession={setCurrentSession}
          onUpdateSession={updateSession}
          onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          isSidebarOpen={isSidebarOpen}
           onLogout={onLogout}
        />
      </div>
    </div>
  );
};

export default MainApp;