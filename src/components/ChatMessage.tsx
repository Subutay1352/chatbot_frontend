import React from 'react';
import type { Message } from '../types/chat';
import { Bot } from 'lucide-react';

interface ChatMessageProps {
  message: Message;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.sender === 'user';
  
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-3 px-4`}>
      <div className={`flex max-w-[85%] ${isUser ? 'flex-row-reverse' : 'flex-row'} items-end gap-2`}>
        {/* Avatar - Only show for bot messages */}
        {!isUser && (
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center">
            <Bot size={16} className="text-gray-300" />
          </div>
        )}
        
        {/* Message Content */}
        <div className={`relative ${
          isUser 
            ? 'ml-auto' 
            : 'mr-auto'
        }`}>
          {/* Message Bubble */}
          <div className={`px-4 py-3 ${
            isUser 
              ? 'bg-white text-black rounded-3xl rounded-br-md' 
              : 'bg-gray-800 text-white rounded-3xl rounded-bl-md'
          }`}>
            <p className="text-sm leading-relaxed whitespace-pre-wrap">
              {message.content}
            </p>
            
            {/* Timestamp */}
            <div className={`text-xs mt-1 ${
              isUser ? 'text-gray-500' : 'text-gray-400'
            }`}>
              {message.timestamp.toLocaleTimeString([], { 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
