import React from 'react';
import type { ChatSession } from '../types/chat';
import { MessageSquare, Star, Clock, Trash2 } from 'lucide-react';

interface ChatHistoryProps {
  sessions: ChatSession[];
  currentSessionId?: string;
  onSelectSession: (sessionId: string) => void;
  onDeleteSession: (sessionId: string) => void;
  onToggleFavorite: (sessionId: string) => void;
  isDarkMode: boolean;
}

const ChatHistory: React.FC<ChatHistoryProps> = ({
  sessions = [],
  currentSessionId,
  onSelectSession,
  onDeleteSession,
  onToggleFavorite,
  isDarkMode
}) => {
  const formatDate = (date: Date | string) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    if (isNaN(dateObj.getTime())) {
      return 'Bilinmeyen tarih';
    }
    
    const now = new Date();
    const diff = now.getTime() - dateObj.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) {
      return dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (days === 1) {
      return 'Dün';
    } else if (days < 7) {
      return `${days} gün önce`;
    } else {
      return dateObj.toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' });
    }
  };

  const getPreviewText = (messages: unknown[]) => {
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return 'Yeni sohbet';
    }
    const lastMessage = messages[messages.length - 1] as { content: string };
    if (!lastMessage || !lastMessage.content) return 'Yeni sohbet';
    return lastMessage.content.length > 50 
      ? lastMessage.content.substring(0, 50) + '...'
      : lastMessage.content;
  };

  return (
    <div className={`h-full flex flex-col ${isDarkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
      {/* Header */}
      <div className={`p-4 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
        <h2 className={`font-semibold text-lg ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          Sohbet Geçmişi
        </h2>
        <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          {sessions.length} sohbet
        </p>
      </div>

      {/* Sessions List */}
      <div className="flex-1 overflow-y-auto">
        {sessions.length === 0 ? (
          <div className={`flex flex-col items-center justify-center h-full p-6 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            <MessageSquare size={48} className="mb-4 opacity-50" />
            <p className="text-center">Henüz sohbet geçmişi yok</p>
            <p className="text-center text-sm mt-2">İlk mesajınızı gönderin!</p>
          </div>
        ) : (
          <div className="p-2 space-y-1">
            {sessions.map((session) => (
              <div
                key={session.id}
                onClick={() => onSelectSession(session.id)}
                className={`group relative p-3 rounded-lg cursor-pointer transition-all duration-200 hover:scale-[1.02] ${
                  currentSessionId === session.id
                    ? isDarkMode 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-blue-500 text-white'
                    : isDarkMode
                    ? 'bg-gray-800 hover:bg-gray-700 text-gray-300'
                    : 'bg-white hover:bg-gray-50 text-gray-700'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className={`font-medium text-sm truncate ${
                        currentSessionId === session.id ? 'text-white' : isDarkMode ? 'text-white' : 'text-gray-900'
                      }`}>
                        {session.title}
                      </h3>
                      {session.isFavorite && (
                        <Star size={14} className="text-yellow-400 fill-current flex-shrink-0" />
                      )}
                    </div>
                    <p className={`text-xs truncate mb-2 ${
                      currentSessionId === session.id 
                        ? 'text-blue-100' 
                        : isDarkMode 
                        ? 'text-gray-400' 
                        : 'text-gray-500'
                    }`}>
                      {getPreviewText(session.messages || [])}
                    </p>
                    <div className="flex items-center gap-2 text-xs">
                      <Clock size={12} className={currentSessionId === session.id ? 'text-blue-200' : isDarkMode ? 'text-gray-500' : 'text-gray-400'} />
                      <span className={currentSessionId === session.id ? 'text-blue-200' : isDarkMode ? 'text-gray-500' : 'text-gray-400'}>
                        {formatDate(session.updatedAt)}
                      </span>
                    </div>
                  </div>
                  
                  {/* Actions */}
                  <div className={`flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity ${
                    currentSessionId === session.id ? 'opacity-100' : ''
                  }`}>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleFavorite(session.id);
                      }}
                      className={`p-1 rounded hover:bg-opacity-20 transition-colors ${
                        session.isFavorite 
                          ? 'text-yellow-400 hover:bg-yellow-400' 
                          : currentSessionId === session.id
                          ? 'text-blue-200 hover:bg-white'
                          : isDarkMode
                          ? 'text-gray-400 hover:bg-gray-600'
                          : 'text-gray-500 hover:bg-gray-200'
                      }`}
                      title={session.isFavorite ? 'Favorilerden çıkar' : 'Favorilere ekle'}
                    >
                      <Star size={14} className={session.isFavorite ? 'fill-current' : ''} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteSession(session.id);
                      }}
                      className={`p-1 rounded hover:bg-opacity-20 transition-colors ${
                        currentSessionId === session.id
                          ? 'text-red-200 hover:bg-red-500'
                          : isDarkMode
                          ? 'text-gray-400 hover:bg-red-600'
                          : 'text-gray-500 hover:bg-red-200'
                      }`}
                      title="Sohbeti sil"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatHistory;
