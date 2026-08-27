import { google } from '@ai-sdk/google';
import { generateText } from 'ai';
import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function POST(req: Request) {
  try {
    const { campaignId, type, prompt } = await req.json();

    if (!campaignId || !type) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Verify auth and fetch campaign data
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: campaign, error } = await supabase
      .from('campaigns')
      .select('*')
      .eq('id', campaignId)
      .eq('user_id', user.id)
      .single();

    if (error || !campaign) {
      return NextResponse.json({ error: 'Campaign not found' }, { status: 404 });
    }

    // Map type to a human-readable format for the AI
    const typeMap: Record<string, string> = {
      'hook': 'Hook/Kalimat Pembuka Video',
      'script': 'Naskah Video Lengkap (Script)',
      'caption': 'Caption TikTok',
      'cta': 'Call to Action (Kalimat Ajakan)',
      'video_idea': 'Ide Konsep Video'
    };

    const contentType = typeMap[type] || type;

    // Construct the prompt
    const systemPrompt = `Kamu adalah perwakilan dari "Dewan Pakar Riset Produk" (The Council of Product Researchers) khusus TikTok Affiliate di Indonesia.
Tugasmu adalah membuat materi konten (hook, script, dll) yang SANGAT REALISTIS dan berbasis psikologi konsumen Indonesia (Gen Z & Milenial).
Berikut adalah data produk yang dikampanyekan:
- Nama Produk: ${campaign.product_name}
${campaign.tiktok_shop_url ? `- Link Produk: ${campaign.tiktok_shop_url}` : ''}

ATURAN PENTING: 
1. Jangan membuat konten yang terlalu "salesy" atau menjanjikan hal yang tidak masuk akal. Buat se-natural mungkin seperti review jujur.
2. Gaya bahasa santai, tajam, to the point, dan menggunakan *slang* Indonesia yang relevan (tapi jangan *cringe*).
3. Gunakan pemicu emosi yang nyata (seperti FOMO beneran, bukan dibuat-buat).
4. JANGAN gunakan format markdown seperti bintang (**) untuk menebalkan teks.
5. Langsung berikan konten yang diminta tanpa basa-basi pembuka.`;

    let userPrompt = `Tolong buatkan **${contentType}** untuk produk di atas.`;
    
    if (prompt) {
      userPrompt += `\n\nPengguna memberikan instruksi tambahan berikut:\n"${prompt}"\n\nPastikan instruksi ini diikuti.`;
    }

    // Call Gemini AI using vercel ai sdk
    const { text } = await generateText({
      model: google('gemini-3.5-flash'), // Using gemini-3.5-flash
      system: systemPrompt,
      prompt: userPrompt,
    });

    return NextResponse.json({ result: text });
  } catch (error) {
    console.error('AI Generation Error:', error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: 'Failed to generate content: ' + errorMessage }, { status: 500 });
  }
}
