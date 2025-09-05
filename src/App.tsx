import { useState, useCallback, useEffect } from 'react';
import type { Message, ChatSession } from './types/chat';
import ChatContainer from './components/ChatContainer';
import ChatHistory from './components/ChatHistory';
import { chatService } from './services/chatService';
import { Menu, X } from 'lucide-react';
import './App.css';

function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [showSidebar, setShowSidebar] = useState(false);
  const [sessionsCache, setSessionsCache] = useState<Map<string, ChatSession>>(new Map());

  const loadSessions = useCallback(async () => {
    try {
      const sessionsData = await chatService.getSessions();
      // Ensure sessionsData is an array
      if (Array.isArray(sessionsData)) {
        setSessions(sessionsData);
        // Update cache
        const newCache = new Map<string, ChatSession>();
        sessionsData.forEach(session => {
          newCache.set(session.id, session);
        });
        setSessionsCache(newCache);
      } else {
        console.warn('Invalid sessions data received:', sessionsData);
        setSessions([]);
      }
    } catch (error) {
      console.error('Failed to load sessions:', error);
      // Fallback to cached sessions if available
      if (sessionsCache.size > 0) {
        setSessions(Array.from(sessionsCache.values()));
      } else {
        setSessions([]);
      }
    }
  }, [sessionsCache]);

  // Load sessions from backend on mount
  useEffect(() => {
    loadSessions();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty dependency array to run only once

  const createNewSession = useCallback(async (): Promise<string> => {
    try {
      const response = await chatService.createSession({
        title: 'Yeni Sohbet'
      });
      setSessions(prev => [response.session, ...prev]);
      // Update cache
      setSessionsCache(prev => new Map(prev).set(response.session.id, response.session));
      setCurrentSessionId(response.session.id);
      setMessages([]);
      setSessionId(null);
      return response.session.id;
    } catch (error) {
      console.error('Failed to create session:', error);
      // Fallback to local session creation
      const newSession: ChatSession = {
        id: `session_${Date.now()}`,
        title: 'Yeni Sohbet',
        messages: [],
        createdAt: new Date(),
        updatedAt: new Date(),
        isFavorite: false
      };
      setSessions(prev => [newSession, ...prev]);
      // Update cache
      setSessionsCache(prev => new Map(prev).set(newSession.id, newSession));
      setCurrentSessionId(newSession.id);
      setMessages([]);
      setSessionId(null);
      return newSession.id;
    }
  }, []);

  const handleSendMessage = useCallback(async (content: string) => {
    let sessionIdToUse = currentSessionId;
    
    // Create new session if none exists
    if (!sessionIdToUse) {
      sessionIdToUse = await createNewSession();
    }

    // Add user message
    const userMessage: Message = {
      id: `user_${Date.now()}`,
      content,
      sender: 'user',
      timestamp: new Date(),
      messageType: 'text',
      sessionId: sessionIdToUse || undefined,
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    setError(null);

    try {
      // Try to send message to backend first
      const response = await chatService.sendMessage({
        message: content,
        sessionId: sessionIdToUse || undefined,
      });

      // Update session ID if provided
      if (response.sessionId && !sessionId) {
        setSessionId(response.sessionId);
      }

      // Add bot response
      if (response.message) {
        setMessages(prev => [...prev, response.message]);
      }

      // Reload sessions to get updated data
      await loadSessions();
    } catch (err) {
      // Fallback to mock response if backend is not available
      try {
        const mockResponse = await chatService.sendMessageMock({
          message: content,
          sessionId: sessionIdToUse || undefined,
        });

        const botMessage: Message = {
          id: `bot_${Date.now()}`,
          content: mockResponse.message.content,
          sender: 'bot',
          timestamp: new Date(),
          messageType: 'text',
          reactions: [],
          sessionId: sessionIdToUse || undefined,
        };

        setMessages(prev => [...prev, botMessage]);
      } catch {
        setError(err instanceof Error ? err.message : 'Bir hata oluştu');
      }
    } finally {
      setIsLoading(false);
    }
  }, [sessionId, currentSessionId, createNewSession, loadSessions]);

  const handleRegenerateMessage = useCallback(async (messageId: string) => {
    const messageToRegenerate = messages.find(m => m.id === messageId);
    if (!messageToRegenerate || messageToRegenerate.sender === 'user' || !currentSessionId) return;

    setIsLoading(true);
    setError(null);

    try {
      // Try to regenerate message via backend
      const response = await chatService.regenerateMessage({
        messageId,
        sessionId: currentSessionId,
      });

      // Add regenerated bot response
      setMessages(prev => [...prev, response.message]);

      // Reload sessions to get updated data
      await loadSessions();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Bir hata oluştu');
    } finally {
      setIsLoading(false);
    }
  }, [messages, currentSessionId, loadSessions]);

  const handleSelectSession = useCallback(async (sessionId: string) => {
    try {
      // Try to get from cache first
      const cachedSession = sessionsCache.get(sessionId);
      if (cachedSession) {
        setCurrentSessionId(sessionId);
        setMessages(cachedSession.messages || []);
        setShowSidebar(false);
        return;
      }

      // If not in cache, fetch from backend
      const session = await chatService.getSession(sessionId);
      setCurrentSessionId(sessionId);
      setMessages(session.messages || []);
      setShowSidebar(false);
      
      // Update cache
      setSessionsCache(prev => new Map(prev).set(sessionId, session));
    } catch (error) {
      console.error('Failed to load session:', error);
      // Fallback to local session data
      const session = sessions.find(s => s.id === sessionId);
      if (session) {
        setCurrentSessionId(sessionId);
        setMessages(session.messages || []);
        setShowSidebar(false);
      }
    }
  }, [sessions, sessionsCache]);

  const handleDeleteSession = useCallback(async (sessionId: string) => {
    try {
      await chatService.deleteSession(sessionId);
      setSessions(prev => prev.filter(s => s.id !== sessionId));
      // Remove from cache
      setSessionsCache(prev => {
        const newCache = new Map(prev);
        newCache.delete(sessionId);
        return newCache;
      });
      if (currentSessionId === sessionId) {
        setCurrentSessionId(null);
        setMessages([]);
      }
    } catch (error) {
      console.error('Failed to delete session:', error);
      // Fallback to local deletion
      setSessions(prev => prev.filter(s => s.id !== sessionId));
      // Remove from cache
      setSessionsCache(prev => {
        const newCache = new Map(prev);
        newCache.delete(sessionId);
        return newCache;
      });
      if (currentSessionId === sessionId) {
        setCurrentSessionId(null);
        setMessages([]);
      }
    }
  }, [currentSessionId]);

  const handleToggleFavorite = useCallback(async (sessionId: string) => {
    try {
      const updatedSession = await chatService.toggleFavorite(sessionId);
      setSessions(prev => prev.map(session => 
        session.id === sessionId ? updatedSession : session
      ));
      // Update cache
      setSessionsCache(prev => new Map(prev).set(sessionId, updatedSession));
    } catch (error) {
      console.error('Failed to toggle favorite:', error);
      // Fallback to local toggle
      setSessions(prev => prev.map(session => 
        session.id === sessionId 
          ? { ...session, isFavorite: !session.isFavorite }
          : session
      ));
      // Update cache
      setSessionsCache(prev => {
        const newCache = new Map(prev);
        const session = newCache.get(sessionId);
        if (session) {
          newCache.set(sessionId, { ...session, isFavorite: !session.isFavorite });
        }
        return newCache;
      });
    }
  }, []);

  return (
    <div className="min-h-screen dark bg-background text-foreground">
      <div className="w-full h-screen flex">
        {/* Sidebar */}
        <div className={`${showSidebar ? 'w-80' : 'w-0'} transition-all duration-300 overflow-hidden bg-gray-900 border-r border-gray-800`}>
          <div className="h-full flex flex-col">
            <ChatHistory
              sessions={sessions}
              currentSessionId={currentSessionId || undefined}
              onSelectSession={handleSelectSession}
              onDeleteSession={handleDeleteSession}
              onToggleFavorite={handleToggleFavorite}
              isDarkMode={true}
            />
          </div>
        </div>

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col">
          {/* Mobile Header */}
          <div className="lg:hidden flex items-center justify-between p-4 bg-gray-900 border-b border-gray-800">
            <button
              onClick={() => setShowSidebar(!showSidebar)}
              className="p-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-gray-300"
            >
              {showSidebar ? <X size={20} /> : <Menu size={20} />}
            </button>
            <h1 className="text-white font-semibold">ATTT Assistant</h1>
            <div className="w-8"></div>
          </div>

          <div className="flex-1 flex flex-col">
            <ChatContainer
              messages={messages}
              onSendMessage={handleSendMessage}
              onRegenerateMessage={handleRegenerateMessage}
              isLoading={isLoading}
              error={error}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
