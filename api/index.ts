import express, { Request, Response } from 'express';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(express.json({ limit: '2mb' }));

// Initialize Gemini SDK with server-side API Key
const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not configured on the server');
  }
  return new GoogleGenAI({ apiKey });
};

// Health check endpoint
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    geminiConfigured: !!process.env.GEMINI_API_KEY,
  });
});

// Interactive AI Tutor endpoint (Ustadz Al-Bayan)
app.post('/api/tutor', async (req: Request, res: Response) => {
  try {
    const { message, history = [], topic = 'umum' } = req.body;

    if (!message || typeof message !== 'string') {
      res.status(400).json({ error: 'Pesan (message) wajib diisi' });
      return;
    }

    const ai = getGeminiClient();

    const systemInstruction = `Anda adalah "Ustadz Al-Bayan", guru dan tutor bahasa Arab ahli kurikulum Madrasah Aliyah (KMA 183 Kemenag RI) khususnya Kelas 10 (X).
Gaya penyampaian:
1. Selalu sertakan teks Arab berharakat lengkap (fathah, kasrah, dhammah, sukun, tanwin, tasydid).
2. Sertakan cara baca (transliterasi latin) dan arti bahasa Indonesia di setiap contoh kalimat atau kosakata.
3. Jelaskan tata bahasa (Nahwu & Shorof) dengan pendekatan yang sesuai materi Kelas 10 MA (Aqsamul Kalam: Isim-Fi'il-Huruf, 14 Dhomir Munfashil & Muttashil, Na'at-Man'ut, Isim Isyarah, Jumlah Ismiyyah & Fi'liyyah, Tashrif Fi'il).
4. Berikan contoh kontekstual kehidupan madrasah, pesantren, dan keluarga.
5. Berikan apresiasi dan motivasi islami (seperti: "Mumtaz!", "Baarakallaahu fiik").
6. Format jawaban dengan rapi menggunakan Markdown (tebalkan kata kunci, gunakan bullet points).`;

    // Format chat history for context
    const contents: any[] = [];
    if (Array.isArray(history)) {
      for (const item of history.slice(-6)) {
        if (item.role && item.text) {
          contents.push({
            role: item.role === 'user' ? 'user' : 'model',
            parts: [{ text: item.text }],
          });
        }
      }
    }

    contents.push({
      role: 'user',
      parts: [
        {
          text: `[Topik: ${topic}]\nPertanyaan/Pesan murid: ${message}`,
        },
      ],
    });

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    res.json({
      reply: response.text || 'Maaf, ustadz belum bisa memberikan jawaban saat ini.',
    });
  } catch (error: any) {
    console.error('Error in /api/tutor:', error);
    res.status(500).json({
      error: 'Terjadi kesalahan saat memproses jawaban tutor AI.',
      details: error?.message || String(error),
    });
  }
});

// Analyze Arabic sentence (I'rab & Word-by-Word breakdown)
app.post('/api/analyze-sentence', async (req: Request, res: Response) => {
  try {
    const { sentence } = req.body;
    if (!sentence || typeof sentence !== 'string') {
      res.status(400).json({ error: 'Kalimat bahasa Arab wajib diisi' });
      return;
    }

    const ai = getGeminiClient();

    const prompt = `Analisis kalimat bahasa Arab berikut secara mendalam dan terstruktur untuk media belajar siswa Indonesia:
Kalimat: "${sentence}"

Sajikan dalam format JSON murni dengan struktur:
{
  "original": "kalimat lengkap berharokat",
  "transliteration": "cara baca latin",
  "translation": "terjemahan bahasa Indonesia yang wajar",
  "sentenceType": "Jumlah Ismiyyah atau Jumlah Fi'liyyah",
  "words": [
    {
      "arabic": "kata berharokat",
      "transliteration": "cara baca",
      "type": "Isim / Fi'il / Huruf",
      "meaning": "arti kata",
      "irab": "penjelasan kedudukan tata bahasa (misal: Mubtada' marfu' bil-dhammah)"
    }
  ],
  "grammarNotes": "penjelasan kaidah ringkas dan hikmah/catatan penting"
}

Pastikan respons hanya valid JSON tanpa markdown blok code (atau hanya JSON yang bisa di-JSON.parse).`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        temperature: 0.2,
      },
    });

    const text = response.text || '{}';
    const parsed = JSON.parse(text);
    res.json(parsed);
  } catch (error: any) {
    console.error('Error in /api/analyze-sentence:', error);
    res.status(500).json({
      error: 'Gagal menganalisis kalimat.',
      details: error?.message || String(error),
    });
  }
});

// Check user's Arabic writing or translation exercise
app.post('/api/check-writing', async (req: Request, res: Response) => {
  try {
    const { promptText, userSubmission, targetLanguage = 'arabic' } = req.body;

    if (!userSubmission) {
      res.status(400).json({ error: 'Latihan/tulisan wajib diisi' });
      return;
    }

    const ai = getGeminiClient();

    const prompt = `Sebagai guru bahasa Arab, periksa dan evaluasi latihan tulisan/terjemahan berikut:
Soal/Tantangan: "${promptText || 'Tulis dalam bahasa Arab atau terjemahkan'}"
Jawaban Siswa: "${userSubmission}"
Arah Latihan: ${targetLanguage === 'arabic' ? 'Menulis/Menerjemahkan ke Bahasa Arab' : 'Menerjemahkan ke Bahasa Indonesia'}

Berikan hasil dalam format JSON:
{
  "score": <angka 0 - 100>,
  "isCorrect": <boolean>,
  "feedback": "Komentar ramah dan evaluasi singkat",
  "correctedArabic": "Kalimat Arab yang benar dan berharakat lengkap",
  "transliteration": "cara baca yang benar",
  "indonesianTranslation": "terjemahan akurat",
  "tips": "Tips tata bahasa atau pemilihan kosakata yang lebih tepat"
}
Keluarkan hanya JSON yang valid.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        temperature: 0.3,
      },
    });

    const text = response.text || '{}';
    const parsed = JSON.parse(text);
    res.json(parsed);
  } catch (error: any) {
    console.error('Error in /api/check-writing:', error);
    res.status(500).json({
      error: 'Gagal memeriksa tulisan.',
      details: error?.message || String(error),
    });
  }
});

// Generate dynamic Arabic quiz questions
app.post('/api/generate-quiz', async (req: Request, res: Response) => {
  try {
    const { topic = 'mufrodat', level = 'pemula', count = 5 } = req.body;

    const ai = getGeminiClient();

    const prompt = `Buatlah ${count} soal kuis pilihan ganda bahasa Arab untuk topik "${topic}" dengan tingkat kesulitan "${level}".
Setiap soal harus memiliki 4 pilihan jawaban (A, B, C, D) dan 1 jawaban benar.
Sertakan teks Arab berharakat, cara baca (transliterasi), dan arti.

Format output WAJIB JSON:
{
  "topic": "${topic}",
  "level": "${level}",
  "questions": [
    {
      "id": 1,
      "question": "Pertanyaan (misal: Apa arti dari kata كِتَابٌ (kitābun)?)",
      "arabicPhrase": "kata/kalimat Arab terkait berharokat (opsional jika ada)",
      "options": ["Pilihan A", "Pilihan B", "Pilihan C", "Pilihan D"],
      "correctIndex": <indeks 0, 1, 2, atau 3>,
      "explanation": "Penjelasan mengapa jawaban tersebut benar dengan harakat dan artinya"
    }
  ]
}
Keluarkan hanya JSON yang valid.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        temperature: 0.4,
      },
    });

    const text = response.text || '{"questions":[]}';
    const parsed = JSON.parse(text);
    res.json(parsed);
  } catch (error: any) {
    console.error('Error in /api/generate-quiz:', error);
    res.status(500).json({
      error: 'Gagal membuat soal kuis.',
      details: error?.message || String(error),
    });
  }
});

// Export default app (Vercel serverless format, without app.listen)
export default app;
