import React, { useRef, useEffect, useState } from 'react';
import type { Message } from '../types/chat';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import { Bot, Settings, Moon, Sun } from 'lucide-react';

interface ChatContainerProps {
  messages: Message[];
  onSendMessage: (message: string) => void;
  onRegenerateMessage?: (messageId: string) => void;
  isLoading: boolean;
  error: string | null;
}

const ChatContainer: React.FC<ChatContainerProps> = ({
  messages = [],
  onSendMessage,
  onRegenerateMessage,
  isLoading,
  error
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [showSettings, setShowSettings] = useState(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleReaction = (messageId: string, emoji: string) => {
    // TODO: Implement reaction handling
    console.log('Reaction:', messageId, emoji);
  };

  const handleCopy = (content: string) => {
    navigator.clipboard.writeText(content);
  };

  const handleRegenerate = (messageId: string) => {
    if (onRegenerateMessage) {
      onRegenerateMessage(messageId);
    }
  };


  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <div className={`flex flex-col h-full ${isDarkMode ? 'bg-black' : 'bg-gray-50'}`}>
      {/* Header */}
      <div className={`flex items-center gap-4 p-4 ${isDarkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'} border-b`}>
        <div className={`w-10 h-10 rounded-full ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'} flex items-center justify-center`}>
          <Bot className={isDarkMode ? 'text-gray-300' : 'text-gray-600'} size={20} />
        </div>
        <div className="flex-1">
          <h2 className={`font-semibold text-lg ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            ATTT Assistant
          </h2>
          <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            {isLoading ? 'Typing...' : 'Online'}
          </p>
        </div>
        
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className={`p-2 rounded-full transition-colors ${
            isDarkMode 
              ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' 
              : 'bg-gray-200 hover:bg-gray-300 text-gray-600'
          }`}
          title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        {/* Settings */}
        <button
          onClick={() => setShowSettings(!showSettings)}
          className={`p-2 rounded-full transition-colors ${
            isDarkMode 
              ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' 
              : 'bg-gray-200 hover:bg-gray-300 text-gray-600'
          }`}
          title="Settings"
        >
          <Settings size={18} />
        </button>

        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <div className={`p-4 border-b ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-100 border-gray-200'}`}>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Theme: {isDarkMode ? 'Dark' : 'Light'}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className={`flex flex-col items-center justify-center h-full px-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            <div className={`w-16 h-16 rounded-full ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'} flex items-center justify-center mb-6`}>
              <Bot size={32} className={isDarkMode ? 'text-gray-300' : 'text-gray-600'} />
            </div>
            
            <h3 className={`text-2xl font-semibold mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Merhaba! 👋
            </h3>
            
            <p className={`text-center leading-relaxed mb-8 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Ben Kamil. Benimle sohbet edebilir ya da öğrenmek istediğin şeyleri sorabilirsin?
            </p>
            
            <div className="flex flex-wrap gap-3 justify-center">
              <div className={`px-4 py-2 rounded-full border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-300'}`}>
                <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  💡 Soru sorabilirsiniz
                </span>
              </div>
              <div className={`px-4 py-2 rounded-full border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-300'}`}>
                <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  🚀 Yardım alabilirsiniz
                </span>
              </div>
              <div className={`px-4 py-2 rounded-full border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-300'}`}>
                <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  💬 Sohbet edebiliriz
                </span>
              </div>
            </div>
          </div>
        ) : (
          messages.map((message) => (
            <ChatMessage 
              key={message.id} 
              message={message} 
              onReaction={handleReaction}
              onCopy={handleCopy}
              onRegenerate={handleRegenerate}
            />
          ))
        )}
        
        {/* Loading indicator - Modern typing animation */}
        {isLoading && (
          <div className="flex justify-start mb-3 px-4">
            <div className="flex items-end gap-2">
              <div className={`w-8 h-8 rounded-full ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'} flex items-center justify-center`}>
                <Bot size={16} className={isDarkMode ? 'text-gray-300' : 'text-gray-600'} />
              </div>
              <div className={`${isDarkMode ? 'bg-gray-800 text-white' : 'bg-gray-200 text-gray-800'} rounded-3xl rounded-bl-md px-4 py-3`}>
                <div className="flex items-center gap-1">
                  <div className="flex gap-1">
                    <div className={`w-2 h-2 rounded-full typing-dot ${isDarkMode ? 'bg-gray-400' : 'bg-gray-500'}`}></div>
                    <div className={`w-2 h-2 rounded-full typing-dot ${isDarkMode ? 'bg-gray-400' : 'bg-gray-500'}`}></div>
                    <div className={`w-2 h-2 rounded-full typing-dot ${isDarkMode ? 'bg-gray-400' : 'bg-gray-500'}`}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Error message */}
        {error && (
          <div className="flex justify-center mb-4">
            <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-2 rounded-lg text-sm">
              {error}
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <ChatInput 
        onSendMessage={onSendMessage}
        disabled={isLoading}
        placeholder="Bir mesaj yazın..."
      />
    </div>
  );
};

export default ChatContainer;
