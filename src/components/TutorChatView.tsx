import React, { useState, useRef, useEffect } from 'react';
import { speakArabic } from '../lib/audio';
import {
  BotMessageSquare,
  Send,
  Loader2,
  Volume2,
  Sparkles,
  User,
  Trash2,
} from 'lucide-react';

interface Message {
  id: string;
  sender: 'user' | 'tutor';
  text: string;
}

export const TutorChatView: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'tutor',
      text: `السَّلَامُ عَلَيْكُمْ وَرَحْمَةُ اللهِ وَبَرَكَاتُهُ!

Ahlan wa Sahlan! Saya **Ustadz Al-Bayan**, tutor belajar bahasa Arab interaktif Anda. 
Ada yang ingin ditanyakan seputar:
1. **Mufrodat** (Kosakata dan artinya)
2. **Kaidah Nahwu & Shorof** (Tata bahasa dan harakat)
3. **Maharah Kalam** (Percakapan sehari-hari)
4. **Terjemahan atau contoh kalimat**

Silakan tulis pertanyaan Anda di bawah ini!`,
    },
  ]);
  const [inputText, setInputText] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const samplePrompts = [
    'Jelaskan perbedaan Isim, Fi\'il, dan Huruf beserta contohnya',
    'Bagaimana cara menanyakan kabar dalam bahasa Arab untuk wanita?',
    'Buatkan contoh kalimat Jumlah Ismiyyah dan Jumlah Fi\'liyyah',
    'Apa arti dari "طَلَبُ الْعِلْمِ فَرِيْضَةٌ" dan bagaimana I\'rab-nya?',
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSend = async (textToSend?: string) => {
    const query = (textToSend || inputText).trim();
    if (!query || loading) return;

    const userMsg: Message = {
      id: `usr_${Date.now()}`,
      sender: 'user',
      text: query,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setLoading(true);

    try {
      const history = messages.map((m) => ({
        role: m.sender === 'user' ? 'user' : 'model',
        text: m.text,
      }));

      const res = await fetch('/api/tutor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query,
          history,
        }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || 'Gagal menerima tanggapan ustadz.');
      }

      const data = await res.json();
      const tutorMsg: Message = {
        id: `tutor_${Date.now()}`,
        sender: 'tutor',
        text: data.reply || 'Mohon maaf, ustadz belum bisa menjawab pertanyaan tersebut.',
      };
      setMessages((prev) => [...prev, tutorMsg]);
    } catch (err: any) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          id: `err_${Date.now()}`,
          sender: 'tutor',
          text: `Mohon maaf, terjadi gangguan: ${err.message || 'Koneksi ke server terputus.'}`,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSpeakArabicInText = (text: string) => {
    // Extract Arabic characters block
    const arabicRegex = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]+/g;
    const arabicMatches = text.match(arabicRegex);
    if (arabicMatches && arabicMatches.length > 0) {
      speakArabic(arabicMatches.join(' '));
    } else {
      speakArabic(text);
    }
  };

  return (
    <div className="space-y-4 max-w-4xl mx-auto pb-12 flex flex-col h-[calc(100vh-180px)] min-h-[550px]">
      {/* Title */}
      <div className="flex items-center justify-between border-b border-slate-200/80 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-emerald-700 text-white flex items-center justify-center shadow-xs">
            <BotMessageSquare className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <span>Tutor AI Ustadz Al-Bayan</span>
              <span className="font-arabic text-emerald-800 text-base font-bold">المُعَلِّمُ الذَّكِيّ</span>
            </h1>
            <p className="text-[11px] text-slate-500">
              Tanyakan kaidah nahwu, mufrodat, atau percakapan bahasa Arab 24/7.
            </p>
          </div>
        </div>

        <button
          onClick={() =>
            setMessages([
              {
                id: 'welcome',
                sender: 'tutor',
                text: 'Percakapan telah diatur ulang. Apa yang ingin Anda tanyakan hari ini?',
              },
            ])
          }
          title="Bersihkan riwayat percakapan"
          className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Chat Messages Scrollable Box */}
      <div className="flex-1 bg-white rounded-3xl p-4 sm:p-6 border border-slate-200/90 shadow-xs overflow-y-auto space-y-4">
        {messages.map((m) => {
          const isUser = m.sender === 'user';
          return (
            <div
              key={m.id}
              className={`flex gap-3 items-start ${isUser ? 'justify-end' : 'justify-start'}`}
            >
              {!isUser && (
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-700 to-teal-600 text-white flex items-center justify-center shrink-0 text-xs font-bold shadow-xs">
                  <span className="font-arabic text-sm">ب</span>
                </div>
              )}

              <div
                className={`max-w-2xl rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
                  isUser
                    ? 'bg-emerald-700 text-white rounded-tr-xs'
                    : 'bg-slate-50 border border-slate-200 text-slate-800 rounded-tl-xs space-y-2'
                }`}
              >
                <div className="whitespace-pre-wrap font-sans">{m.text}</div>

                {/* Audio button for tutor responses */}
                {!isUser && (
                  <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px] text-slate-500">
                    <button
                      onClick={() => handleSpeakArabicInText(m.text)}
                      className="flex items-center gap-1 text-emerald-800 hover:text-emerald-950 font-semibold cursor-pointer"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>Dengarkan Teks Arab</span>
                    </button>
                    <span className="text-[10px] text-slate-400">Ustadz AI Gemini</span>
                  </div>
                )}
              </div>

              {isUser && (
                <div className="w-8 h-8 rounded-xl bg-slate-200 text-slate-700 flex items-center justify-center shrink-0 text-xs font-bold">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          );
        })}

        {loading && (
          <div className="flex gap-3 items-center text-slate-500 text-xs py-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-700 text-white flex items-center justify-center shrink-0">
              <Loader2 className="w-4 h-4 animate-spin" />
            </div>
            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 text-xs flex items-center gap-2">
              <span className="font-arabic font-bold text-emerald-800 text-sm">يَكْتُبُ...</span>
              <span>Ustadz sedang menyusun jawaban berharakat...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Quick Prompts */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
        <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
        {samplePrompts.map((prompt, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(prompt)}
            disabled={loading}
            className="px-3 py-1 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200/60 text-[11px] font-medium whitespace-nowrap transition-colors cursor-pointer shrink-0 disabled:opacity-50"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Input Form */}
      <div className="flex gap-2 bg-white p-2 rounded-2xl border border-slate-200 shadow-xs">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSend();
          }}
          placeholder="Tanyakan apa saja seputar bahasa Arab..."
          disabled={loading}
          className="flex-1 px-4 py-2 text-xs sm:text-sm bg-transparent focus:outline-none text-slate-900"
        />
        <button
          onClick={() => handleSend()}
          disabled={loading || !inputText.trim()}
          className="p-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl transition-all cursor-pointer disabled:opacity-40"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
};
