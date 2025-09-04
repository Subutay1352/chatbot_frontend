import React, { useState, useRef, useEffect } from 'react';
import { Send } from 'lucide-react';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

const ChatInput: React.FC<ChatInputProps> = ({ 
  onSendMessage, 
  disabled = false, 
  placeholder = "Mesajınızı yazın..." 
}) => {
  const [message, setMessage] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      onSendMessage(message.trim());
      setMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [message]);

  return (
    <form onSubmit={handleSubmit} className="flex items-end gap-3 p-4 bg-gray-900/95 backdrop-blur-sm border-t border-gray-800">
      <div className="flex-1 relative">
        <div className="relative">
          <textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={placeholder}
            disabled={disabled}
            className="w-full px-5 py-4 pr-14 bg-gray-800/80 backdrop-blur-sm border border-gray-700/50 rounded-3xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 disabled:bg-gray-800/30 disabled:cursor-not-allowed text-white placeholder-gray-400 text-base shadow-lg transition-all duration-200"
            rows={1}
            style={{ minHeight: '48px', maxHeight: '120px' }}
          />
          {/* Input glow effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-3xl opacity-0 focus-within:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
        </div>
      </div>
      
      <button
        type="submit"
        disabled={!message.trim() || disabled}
        className="group relative flex-shrink-0 w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full flex items-center justify-center hover:from-blue-600 hover:to-blue-700 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-blue-500/25 transform hover:scale-105 disabled:transform-none"
      >
        <Send size={20} className="group-hover:scale-110 transition-transform duration-200" />
        {/* Button glow effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full blur opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>
      </button>
    </form>
  );
};

export default ChatInput;
