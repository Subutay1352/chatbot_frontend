import axios from 'axios';
import type { Message, ChatSession } from '../types/chat';

const API_BASE_URL = 'http://localhost:5432';

export interface SendMessageRequest {
  message: string;
  sessionId?: string;
}

export interface SendMessageResponse {
  message: Message;
  sessionId: string;
}

export interface RegenerateMessageRequest {
  messageId: string;
  sessionId: string;
}

export interface RegenerateMessageResponse {
  message: Message;
}

export interface CreateSessionRequest {
  title: string;
}

export interface CreateSessionResponse {
  session: ChatSession;
}

export interface UpdateSessionRequest {
  title?: string;
  isFavorite?: boolean;
}

export interface UpdateSessionResponse {
  session: ChatSession;
}

class ChatService {
  private baseURL: string;

  constructor() {
    this.baseURL = API_BASE_URL;
  }

  // Health check
  async healthCheck(): Promise<boolean> {
    try {
      const response = await axios.get(`${this.baseURL}/health`, {
        timeout: 5000,
      });
      return response.status === 200;
    } catch {
      return false;
    }
  }

  // Send message
  async sendMessage(request: SendMessageRequest): Promise<SendMessageResponse> {
    try {
      const response = await axios.post(`${this.baseURL}/api/chat/send`, request, {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 30000,
      });

      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  // Regenerate message
  async regenerateMessage(request: RegenerateMessageRequest): Promise<RegenerateMessageResponse> {
    try {
      const response = await axios.post(`${this.baseURL}/api/chat/regenerate`, request, {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 30000,
      });

      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  // Get messages for a session
  async getMessages(sessionId: string): Promise<Message[]> {
    try {
      const response = await axios.get(`${this.baseURL}/api/chat/messages/${sessionId}`, {
        timeout: 10000,
      });

      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  // Get all sessions
  async getSessions(): Promise<ChatSession[]> {
    try {
      const response = await axios.get(`${this.baseURL}/api/sessions`, {
        timeout: 10000,
      });

      // Backend returns { sessions: ChatSession[] }
      return response.data.sessions || [];
    } catch (error) {
      this.handleError(error);
      // Return empty array instead of throwing to prevent infinite loops
      return [];
    }
  }

  // Create new session
  async createSession(request: CreateSessionRequest): Promise<CreateSessionResponse> {
    try {
      const response = await axios.post(`${this.baseURL}/api/sessions`, request, {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 10000,
      });

      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  // Get specific session
  async getSession(sessionId: string): Promise<ChatSession> {
    try {
      const response = await axios.get(`${this.baseURL}/api/sessions/${sessionId}`, {
        timeout: 10000,
      });

      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  // Update session
  async updateSession(sessionId: string, request: UpdateSessionRequest): Promise<UpdateSessionResponse> {
    try {
      const response = await axios.put(`${this.baseURL}/api/sessions/${sessionId}`, request, {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 10000,
      });

      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  // Delete session
  async deleteSession(sessionId: string): Promise<void> {
    try {
      await axios.delete(`${this.baseURL}/api/sessions/${sessionId}`, {
        timeout: 10000,
      });
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  // Toggle favorite
  async toggleFavorite(sessionId: string): Promise<ChatSession> {
    try {
      const response = await axios.post(`${this.baseURL}/api/sessions/${sessionId}/favorite`, {}, {
        timeout: 10000,
      });

      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  // Mock response for development/testing (fallback)
  async sendMessageMock(request: SendMessageRequest): Promise<SendMessageResponse> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
    
    const responses = [
      "Merhaba! Size nasıl yardımcı olabilirim?",
      "Bu konuda size yardımcı olmaktan mutluluk duyarım.",
      "İlginç bir soru! Biraz daha detay verebilir misiniz?",
      "Anladım. Bu durumda şunları önerebilirim...",
      "Teşekkürler! Başka bir konuda yardıma ihtiyacınız var mı?",
      "Bu konuda size daha fazla bilgi verebilirim.",
      "Harika bir soru! Size detaylı bir açıklama yapayım.",
      "Bu konuda deneyimim var. Size yardımcı olabilirim."
    ];
    
    const randomResponse = responses[Math.floor(Math.random() * responses.length)];
    
    const mockMessage: Message = {
      id: `bot_${Date.now()}`,
      content: randomResponse,
      sender: 'bot',
      timestamp: new Date(),
      messageType: 'text',
      reactions: [],
    };
    
    return {
      message: mockMessage,
      sessionId: request.sessionId || `session_${Date.now()}`
    };
  }

  private handleError(error: unknown): void {
    if (axios.isAxiosError(error)) {
      if (error.code === 'ECONNREFUSED') {
        throw new Error('Backend sunucusuna bağlanılamıyor. Lütfen backend\'in çalıştığından emin olun.');
      }
      if (error.response?.status === 404) {
        throw new Error('API endpoint bulunamadı.');
      }
      if (error.response?.status && error.response.status >= 500) {
        throw new Error('Sunucu hatası. Lütfen daha sonra tekrar deneyin.');
      }
      throw new Error(error.response?.data?.message || 'Bilinmeyen bir hata oluştu.');
    }
    throw new Error('Ağ hatası oluştu.');
  }
}

export const chatService = new ChatService();
