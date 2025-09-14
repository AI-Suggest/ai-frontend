import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import ChatInterface from './ChatInterface';
import PromptsLibrary from './PromptsLibrary';
import ChatHeader from './ChatHeader';
import { apiService } from '../services/api';
import { storage } from '../utils/storage';
// import { getSessions } from '../services/api';
import { stabilityAI } from "../services/stabilityApi";

const MainApp = ({ user, onLogout }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [currentSession, setCurrentSession] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [activePage, setActivePage] = useState("chat")
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

    if (!session.id) {
      // 🛡️ No DB id, so skip API and just load local messages
      
      setCurrentSession(session);
      return;
    }

    // fetch full messages from backend
    const messages = await apiService.getPreviousChat(session.id);


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
     setActivePage("chat");
  };




  const updateSession = (sessionId, updatedSession) => {
    
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
  // const deleteSession = async (sessionId) => {
  //   console.log(sessionId,"sessionId__")
  //   try {
  //     await stabilityAI.deleteGeneration(sessionId);
  //     setSessions((prev) => prev.filter((session) => session.id !== sessionId));

  //     if (currentSession?.id === sessionId) {
  //       setCurrentSession(null);
  //     }
  //   } catch (err) {
  //     console.error("Failed to delete session:", err);
  //   }
  // };
  
const deleteSession = async (sessionId, index) => {
  console.log(sessionId, "sessionId__");

  try {
    if (!sessionId) {
      // Remove only the clicked new chat by index
      setSessions((prev) => prev.filter((_, i) => i !== index));
      if (!currentSession?.id) {
        setCurrentSession(null);
      }
      return;
    }

    // Saved chat (with id)
    await stabilityAI.deleteGeneration(sessionId);
    setSessions((prev) => prev.filter((session) => session.id !== sessionId));

    if (currentSession?.id === sessionId) {
      setCurrentSession(null);
    }
  } catch (err) {
    console.error("Failed to delete session:", err);
  }
};


  return (
    <div className="flex h-screen bg-neutral-800">
      <Sidebar
        isOpen={isSidebarOpen}
        onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
        sessions={sessions}
        currentSession={currentSession}
        onNewSession={createNewSession}
         onSelectSession={(session) => {
        handlePreviousChatClick(session);
        setActivePage("chat"); // 🔹 ensure chat page shows when session clicked
      }}
        onDeleteSession={deleteSession}
        user={user}
        onLogout={onLogout}
         setActivePage={setActivePage}
      />
      
      <div className={`flex-1 transition-all duration-300
  ${isSidebarOpen ? 'ml-0 md:ml-80' : 'ml-0'}
`}>
      <ChatHeader user={user} isSidebarOpen={isSidebarOpen} onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}  onLogout={onLogout}/>
        {activePage === "chat" && (

    <ChatInterface
      session={currentSession}
      user={user}
      setCurrentSession={setCurrentSession}
      onUpdateSession={updateSession}
      onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
      isSidebarOpen={isSidebarOpen}
      onLogout={onLogout}
    />
  )}

  {activePage === "prompts" && <PromptsLibrary />}
    
      </div>
    </div>
  );
};

export default MainApp;
