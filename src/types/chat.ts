export interface Message {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  isTyping?: boolean;
  reactions?: MessageReaction[];
  isFavorite?: boolean;
  isRegenerated?: boolean;
  originalMessageId?: string;
  messageType?: 'text' | 'code' | 'image' | 'link';
  sessionId?: string;
  metadata?: {
    language?: string;
    codeBlock?: boolean;
    linkPreview?: LinkPreview;
  };
}

export interface MessageReaction {
  id: string;
  emoji: string;
  count: number;
  users: string[];
  messageId: string;
}

export interface LinkPreview {
  title: string;
  description: string;
  image?: string;
  url: string;
  domain: string;
}

export interface ChatState {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
  isTyping: boolean;
  currentTheme: 'light' | 'dark' | 'auto';
}

export interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
  isFavorite: boolean;
}
