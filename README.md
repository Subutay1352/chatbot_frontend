# Chatbot Frontend

Modern bir web chatbot uygulamasının React frontend kısmı.

## 🚀 Özellikler

- **Modern UI/UX**: Tailwind CSS ile tasarlanmış responsive arayüz
- **Real-time Chat**: Gerçek zamanlı mesajlaşma deneyimi
- **TypeScript**: Tip güvenliği için TypeScript kullanımı
- **Vite**: Hızlı development ve build süreci
- **API Integration**: Go backend ile entegrasyon
- **Responsive Design**: Mobil ve desktop uyumlu tasarım

## 🛠️ Teknolojiler

- **React 18** - UI framework
- **TypeScript** - Tip güvenliği
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Lucide React** - İkonlar
- **Axios** - HTTP client

## 📦 Kurulum

1. Bağımlılıkları yükleyin:
```bash
npm install
```

2. Development server'ı başlatın:
```bash
npm run dev
```

3. Tarayıcınızda `http://localhost:5173` adresini açın.

## 🔧 Konfigürasyon

Backend API URL'ini değiştirmek için `src/services/chatService.ts` dosyasındaki `API_BASE_URL` değişkenini güncelleyin.

Varsayılan olarak `http://localhost:8080` kullanılır.

## 📁 Proje Yapısı

```
src/
├── components/          # React bileşenleri
│   ├── ChatContainer.tsx    # Ana chat konteyner
│   ├── ChatMessage.tsx      # Mesaj bileşeni
│   └── ChatInput.tsx        # Mesaj girişi
├── services/            # API servisleri
│   └── chatService.ts       # Chat API servisi
├── types/               # TypeScript tip tanımları
│   └── chat.ts              # Chat tipleri
├── App.tsx              # Ana uygulama
└── main.tsx             # Uygulama giriş noktası
```

## 🔌 API Entegrasyonu

Chatbot backend'i ile iletişim için aşağıdaki endpoint kullanılır:

**POST** `/api/chat`

Request:
```json
{
  "message": "Kullanıcı mesajı",
  "sessionId": "opsiyonel-session-id"
}
```

Response:
```json
{
  "message": "Bot yanıtı",
  "sessionId": "session-id"
}
```

## 🎨 Özelleştirme

### Tema Değişiklikleri
`tailwind.config.js` dosyasını düzenleyerek renk paletini özelleştirebilirsiniz.

### Bileşen Stilleri
Her bileşen kendi CSS sınıflarına sahiptir ve Tailwind CSS kullanır.

## 🚀 Build

Production build oluşturmak için:

```bash
npm run build
```

Build dosyaları `dist/` klasöründe oluşturulur.

## 📝 Geliştirme Notları

- Mock API kullanımı: Development sırasında gerçek backend olmadan test edebilmek için mock response'lar kullanılır
- Session yönetimi: Her chat oturumu için benzersiz session ID'ler oluşturulur
- Error handling: Kapsamlı hata yönetimi ve kullanıcı dostu hata mesajları
- Loading states: Kullanıcı deneyimi için loading göstergeleri

## 🤝 Katkıda Bulunma

1. Fork yapın
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Commit yapın (`git commit -m 'Add amazing feature'`)
4. Push yapın (`git push origin feature/amazing-feature`)
5. Pull Request oluşturun

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır.