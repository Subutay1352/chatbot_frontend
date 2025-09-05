import React, { useState } from 'react';
import type { Message } from '../types/chat';
import { Bot, Copy, RotateCcw, Heart, ThumbsUp, ThumbsDown } from 'lucide-react';

interface ChatMessageProps {
  message: Message;
  onReaction?: (messageId: string, emoji: string) => void;
  onCopy?: (content: string) => void;
  onRegenerate?: (messageId: string) => void;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ 
  message, 
  onReaction, 
  onCopy, 
  onRegenerate
}) => {
  // Guard against undefined message
  if (!message) {
    return null;
  }
  
  const isUser = message.sender === 'user';
  const [showActions, setShowActions] = useState(false);
  const [copied, setCopied] = useState(false);
  
  const handleCopy = () => {
    if (onCopy) {
      onCopy(message.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleReaction = (emoji: string) => {
    if (onReaction) {
      onReaction(message.id, emoji);
    }
  };

  const handleRegenerate = () => {
    if (onRegenerate) {
      onRegenerate(message.id);
    }
  };


  const renderContent = () => {
    if (message.messageType === 'code' && message.metadata?.codeBlock) {
      return (
        <div className="bg-gray-900 rounded-lg p-3 mt-2">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-gray-400 font-mono">
              {message.metadata.language || 'code'}
            </span>
            <button
              onClick={handleCopy}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <Copy size={14} />
            </button>
          </div>
          <pre className="text-sm text-gray-100 overflow-x-auto">
            <code>{message.content}</code>
          </pre>
        </div>
      );
    }

    if (message.messageType === 'link' && message.metadata?.linkPreview) {
      const preview = message.metadata.linkPreview;
      return (
        <div className="mt-2">
          <p className="text-sm leading-relaxed whitespace-pre-wrap mb-2">
            {message.content}
          </p>
          <div className="bg-gray-700 rounded-lg p-3 border border-gray-600">
            <div className="flex gap-3">
              {preview.image && (
                <img 
                  src={preview.image} 
                  alt={preview.title}
                  className="w-16 h-16 rounded object-cover flex-shrink-0"
                />
              )}
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium text-white truncate">
                  {preview.title}
                </h4>
                <p className="text-xs text-gray-300 mt-1 line-clamp-2">
                  {preview.description}
                </p>
                <p className="text-xs text-gray-400 mt-1 truncate">
                  {preview.domain}
                </p>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <p className="text-sm leading-relaxed whitespace-pre-wrap">
        {message.content}
      </p>
    );
  };

  return (
    <div 
      className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-3 px-4 group ${
        isUser ? 'message-slide-in-right' : 'message-slide-in-left'
      }`}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
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
          } hover-lift`}>
            {renderContent()}
            
            {/* Timestamp and Actions */}
            <div className={`flex items-center justify-between mt-2 ${
              isUser ? 'text-gray-500' : 'text-gray-400'
            }`}>
              <div className="text-xs">
                {message.timestamp.toLocaleTimeString([], { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
                {message.isRegenerated && (
                  <span className="ml-2 text-xs text-blue-400">(Regenerated)</span>
                )}
              </div>
              
              {/* Message Actions */}
              <div className={`flex items-center gap-1 transition-opacity duration-200 ${
                showActions ? 'opacity-100' : 'opacity-0'
              }`}>
                {!isUser && (
                  <>
                    <button
                      onClick={() => handleReaction('👍')}
                      className="p-1 hover:bg-gray-600 rounded transition-colors"
                      title="Like"
                    >
                      <ThumbsUp size={12} />
                    </button>
                    <button
                      onClick={() => handleReaction('👎')}
                      className="p-1 hover:bg-gray-600 rounded transition-colors"
                      title="Dislike"
                    >
                      <ThumbsDown size={12} />
                    </button>
                    <button
                      onClick={handleRegenerate}
                      className="p-1 hover:bg-gray-600 rounded transition-colors"
                      title="Regenerate"
                    >
                      <RotateCcw size={12} />
                    </button>
                  </>
                )}
                <button
                  onClick={handleCopy}
                  className={`p-1 hover:bg-gray-600 rounded transition-colors ${
                    copied ? 'text-green-400' : ''
                  }`}
                  title={copied ? "Copied!" : "Copy"}
                >
                  <Copy size={12} />
                </button>
                <button
                  onClick={() => handleReaction('❤️')}
                  className="p-1 hover:bg-gray-600 rounded transition-colors"
                  title="Favorite"
                >
                  <Heart size={12} className={message.isFavorite ? 'text-red-400 fill-current' : ''} />
                </button>
              </div>
            </div>
          </div>

          {/* Reactions */}
          {message.reactions && message.reactions.length > 0 && (
            <div className="flex gap-1 mt-1 ml-2">
              {message.reactions.map((reaction) => (
                <button
                  key={reaction.id}
                  onClick={() => handleReaction(reaction.emoji)}
                  className="flex items-center gap-1 px-2 py-1 bg-gray-700 rounded-full text-xs hover:bg-gray-600 transition-colors"
                >
                  <span>{reaction.emoji}</span>
                  <span className="text-gray-300">{reaction.count}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
