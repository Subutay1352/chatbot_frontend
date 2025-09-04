import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

export interface ChatRequest {
  message: string;
  sessionId?: string;
}

export interface ChatResponse {
  message: string;
  sessionId: string;
}

class ChatService {
  private baseURL: string;

  constructor() {
    this.baseURL = API_BASE_URL;
  }

  async sendMessage(request: ChatRequest): Promise<ChatResponse> {
    try {
      const response = await axios.post(`${this.baseURL}/api/chat`, request, {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 30000, // 30 seconds timeout
      });

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.code === 'ECONNREFUSED') {
          throw new Error('Backend sunucusuna bağlanılamıyor. Lütfen backend\'in çalıştığından emin olun.');
        }
        if (error.response?.status === 404) {
          throw new Error('Chat API endpoint bulunamadı.');
        }
        if (error.response?.status >= 500) {
          throw new Error('Sunucu hatası. Lütfen daha sonra tekrar deneyin.');
        }
        throw new Error(error.response?.data?.message || 'Bilinmeyen bir hata oluştu.');
      }
      throw new Error('Ağ hatası oluştu.');
    }
  }

  // Mock response for development/testing
  async sendMessageMock(request: ChatRequest): Promise<ChatResponse> {
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
    
    return {
      message: randomResponse,
      sessionId: request.sessionId || `session_${Date.now()}`
    };
  }
}

export const chatService = new ChatService();
