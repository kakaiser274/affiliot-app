import { streamText } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';

export const runtime = 'edge';

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    const openrouter = createOpenAI({
      baseURL: 'https://openrouter.ai/api/v1',
      apiKey: process.env.OPENROUTER_API_KEY,
      fetch: async (url, options) => {
        const headers = new Headers(options?.headers || {});
        headers.set('HTTP-Referer', 'http://localhost:3000');
        headers.set('X-Title', 'Affiliot AI');
        return fetch(url, { ...options, headers });
      }
    });

    const result = streamText({
      model: openrouter('openrouter/free'),
      maxRetries: 0,
      messages,
      system: `Kamu adalah Affiliot AI, asisten konten pintar yang ahli dalam pemasaran, copywriting, hook, script video, dan ide konten untuk kreator afiliasi. 
Tugas utamamu adalah membantu pengguna membuat, merangkai ulang, atau memperbaiki konten promosi mereka. 
Gunakan bahasa Indonesia yang natural, asik, persuasif, dan profesional (bisa disesuaikan dengan konteks). 
Bantu pengguna meracik strategi penjualan yang menarik perhatian!`,
    });

    return result.toTextStreamResponse();
  } catch (error) {
    console.error('Chat API Error:', error);
    return new Response(JSON.stringify({ error: 'Gagal memproses permintaan AI.' }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
