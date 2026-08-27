import { NextResponse } from 'next/server';
import { isValidTikTokProductUrl } from '@/lib/product-extraction/tiktok/validator';
import { extractTikTokProduct, ExtractionError } from '@/lib/product-extraction/tiktok/extractor';
import { google } from '@ai-sdk/google';
import { generateObject } from 'ai';
import { z } from 'zod';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { url } = body;

    if (!url) {
      return NextResponse.json(
        { success: false, error: { code: 'MISSING_URL', message: 'URL is required.' } },
        { status: 400 }
      );
    }

    // 1. Validate TikTok Shop URL
    if (!isValidTikTokProductUrl(url)) {
      return NextResponse.json(
        { success: false, error: { code: 'INVALID_URL', message: 'The provided URL is not a valid TikTok Shop product URL.' } },
        { status: 400 }
      );
    }

    // 2. Extract Product Data
    let productData;
    try {
      productData = await extractTikTokProduct(url);
    } catch (error) {
      if (error instanceof ExtractionError) {
        return NextResponse.json(
          { success: false, error: { code: error.code, message: error.message } },
          { status: 422 } // Unprocessable Entity
        );
      }
      throw error;
    }

    // 3. Ensure Minimum Product Data for AI
    if (!productData.product.name && !productData.product.description) {
      return NextResponse.json(
        { success: false, error: { code: 'INSUFFICIENT_PRODUCT_DATA', message: 'Not enough product information was available for analysis.' } },
        { status: 422 }
      );
    }

    // 4. AI Analysis Layer
    const result = await generateObject({
      model: google('gemini-3.5-flash'),
      system: `You are Affilot, an elite AI Affiliate Coach operating in "Ask the Council" mode. Your job is to critically evaluate products for affiliate creators with BRUTAL HONESTY and ZERO sugar-coating.
Rules:
- MUST respond in natural, conversational Indonesian language (Gunakan Bahasa Indonesia yang santai, gaul, mengalir, dan manusiawi layaknya mentor ke anak didiknya, namun SANGAT KRITIS dan TAJAM).
- DO NOT be a people pleaser. If a product is bad, saturated, or hard to sell, say it bluntly. Punish bad products with low opportunity scores.
- Be highly objective. Act as a council of expert e-commerce strategists debating the true viability of the product.
- Use only the provided product information. Do not invent data.
- Point out potential red flags, intense competition, or low margins if applicable.
- Focus on short-form content such as TikTok.
- If information is missing, say that it is unavailable rather than inventing it.`,
      prompt: `CRITICALLY analyze the following product data with brutal honesty:\n${JSON.stringify(productData, null, 2)}`,
      schema: z.object({
        opportunityScore: z.object({
          score: z.number().min(0).max(100),
          summary: z.string(),
          strengths: z.array(z.string()),
          weaknesses: z.array(z.string())
        }),
        productDetails: z.object({
          summary: z.string(),
          keySellingPoints: z.array(z.string()),
          targetAudience: z.array(z.string())
        }),
        quickAnalysis: z.string(),
        painPoints: z.array(z.object({
          painPoint: z.string(),
          explanation: z.string()
        })),
        emotionTriggers: z.array(z.object({
          emotion: z.string(),
          explanation: z.string()
        })),
        hooks: z.array(z.object({
          hook: z.string(),
          angle: z.string()
        })),
        scripts: z.array(z.object({
          title: z.string(),
          script: z.string(),
          angle: z.string()
        })),
        captions: z.array(z.string()),
        cta: z.array(z.string()),
        hashtags: z.array(z.string()),
        videoIdeas: z.array(z.object({
          title: z.string(),
          concept: z.string(),
          angle: z.string()
        }))
      })
    });

    return NextResponse.json({ 
      success: true, 
      product: productData,
      analysis: result.object 
    });

  } catch (error) {
    console.error('Error in /api/tiktok-analyze:', error);
    return NextResponse.json(
      { success: false, error: { code: 'INTERNAL_ERROR', message: error instanceof Error ? error.message : 'An internal server error occurred.' } },
      { status: 500 }
    );
  }
}
