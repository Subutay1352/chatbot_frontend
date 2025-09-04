import React, { useRef, useEffect } from 'react';
import type { Message } from '../types/chat';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import { Bot } from 'lucide-react';

interface ChatContainerProps {
  messages: Message[];
  onSendMessage: (message: string) => void;
  isLoading: boolean;
  error: string | null;
}

const ChatContainer: React.FC<ChatContainerProps> = ({
  messages,
  onSendMessage,
  isLoading,
  error
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="flex flex-col h-full bg-black">
      {/* Header */}
      <div className="flex items-center gap-4 p-4 bg-gray-900 border-b border-gray-800">
        <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center">
          <Bot className="text-gray-300" size={20} />
        </div>
        <div className="flex-1">
          <h2 className="font-semibold text-white text-lg">ATTT Assistant</h2>
          <p className="text-gray-400 text-sm">Online</p>
        </div>
        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-white px-6">
            <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mb-6">
              <Bot size={32} className="text-gray-300" />
            </div>
            
            <h3 className="text-2xl font-semibold mb-3 text-white">
              Merhaba! 👋
            </h3>
            
            <p className="text-center text-gray-400 leading-relaxed mb-8">
              Ben AI asistanınızım. Size nasıl yardımcı olabilirim?
            </p>
            
            <div className="flex flex-wrap gap-3 justify-center">
              <div className="px-4 py-2 bg-gray-800 rounded-full border border-gray-700">
                <span className="text-sm text-gray-300">💡 Soru sorabilirsiniz</span>
              </div>
              <div className="px-4 py-2 bg-gray-800 rounded-full border border-gray-700">
                <span className="text-sm text-gray-300">🚀 Yardım alabilirsiniz</span>
              </div>
              <div className="px-4 py-2 bg-gray-800 rounded-full border border-gray-700">
                <span className="text-sm text-gray-300">💬 Sohbet edebiliriz</span>
              </div>
            </div>
          </div>
        ) : (
          messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))
        )}
        
        {/* Loading indicator - Modern typing animation */}
        {isLoading && (
          <div className="flex justify-start mb-3 px-4">
            <div className="flex items-end gap-2">
              <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center">
                <Bot size={16} className="text-gray-300" />
              </div>
              <div className="bg-gray-800 text-white rounded-3xl rounded-bl-md px-4 py-3">
                <div className="flex items-center gap-1">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full typing-dot"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full typing-dot"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full typing-dot"></div>
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
