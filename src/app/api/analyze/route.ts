import { google } from '@ai-sdk/google';
import { generateObject } from 'ai';
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { createClient } from '@/utils/supabase/server';

export async function POST(req: Request) {
  try {
    const { productName, category, price, usp } = await req.json();

    if (!productName) {
      return NextResponse.json({ error: 'Product name is required' }, { status: 400 });
    }

    // Verify auth
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const systemPrompt = `You are Affilot, an elite AI Affiliate Coach operating in "Ask the Council" mode. Your job is to critically evaluate products for affiliate creators with BRUTAL HONESTY and ZERO sugar-coating.
Rules:
- MUST respond in natural, conversational Indonesian language (Gunakan Bahasa Indonesia yang santai, gaul, mengalir, dan manusiawi layaknya mentor ke anak didiknya, namun SANGAT KRITIS dan TAJAM).
- DO NOT be a people pleaser. If a product is bad, saturated, or hard to sell, say it bluntly. Punish bad products with low opportunity scores.
- Be highly objective. Act as a council of expert e-commerce strategists debating the true viability of the product.
- Use only the provided product information. Do not invent data.
- Point out potential red flags, intense competition, or low margins if applicable.
- Focus on short-form content such as TikTok.`;

    const userPrompt = `CRITICALLY analyze the following product for an affiliate marketer with brutal honesty:
- Nama Produk: ${productName}
${category ? `- Kategori: ${category}` : ''}
${price ? `- Harga: ${price}` : ''}
${usp ? `- Keunggulan (USP) yang diketahui: ${usp}` : ''}

Jika informasi kategori, harga, atau USP belum lengkap, tolong berikan estimasi terbaik yang realistis untuk pasar Indonesia, selain menganalisis target audiens, pain points, dan pemicu emosinya.`;

    // Call Gemini AI
    const { object } = await generateObject({
      model: google('gemini-3.5-flash'), // Using gemini-3.5-flash
      system: systemPrompt,
      prompt: userPrompt,
      schema: z.object({
        category: z.string().describe('Kategori produk yang paling tepat (misal: "Elektronik", "Peralatan Dapur"). Jika sudah diberikan, gunakan yang paling masuk akal.'),
        price: z.string().describe('Perkiraan harga wajar dalam Rupiah. Format: "Rp 150.000" atau "Rp 50.000 - Rp 100.000". Jika sudah diberikan, gunakan saja.'),
        usp: z.string().describe('3-5 Selling points atau keunggulan utama dari produk ini, digabungkan dalam satu paragraf pendek.'),
        target_audience: z.string().describe('Penjelasan singkat tentang siapa target pasar utamanya (contoh: "Gen Z dan Milenial, 18-35 tahun, pengguna aktif TikTok")'),
        selling_points: z.array(z.string()).describe('3-5 keunggulan spesifik produk dalam kalimat singkat (array string)'),
        pain_points: z.array(z.string()).describe('3 masalah utama target pasar yang bisa diselesaikan oleh produk ini'),
        emotion_triggers: z.array(z.string()).describe('3-4 pemicu emosi (contoh: "FOMO", "Insecurity", "Convenience", dll) yang cocok untuk produk ini'),
        opportunity_score: z.number().describe('Skor jujur dan brutal dari 0-100. Jangan ragu memberi skor di bawah 50 jika produknya pasaran atau susah laku di TikTok Shop Indonesia.'),
        quick_analysis: z.string().describe('1 kalimat tajam berisi kesimpulan cepat mengapa skor opportunity tersebut diberikan (bisa berupa kritikan tajam atau pujian realistis)')
      })
    });

    return NextResponse.json({ result: object });
  } catch (error) {
    console.error('AI Analysis Error:', error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: 'Failed to analyze product: ' + errorMessage }, { status: 500 });
  }
}
