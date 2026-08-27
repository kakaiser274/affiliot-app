export interface ProductData {
  source: {
    platform: "tiktok_shop";
    url: string;
    extractedAt: string;
  };
  product: {
    name: string | null;
    description: string | null;
    category: string | null;
    price: number | null;
    currency: string | null;
    images: string[];
  };
  seller: {
    name: string | null;
  };
  metrics: {
    rating: number | null;
    reviewCount: number | null;
    soldCount: number | null;
  };
  variants: {
    name: string | null;
    price: number | null;
  }[];
  attributes: Record<string, string>;
  reviews: {
    text: string;
    rating: number | null;
  }[];
}

export interface AnalysisResult {
  opportunityScore: {
    score: number;
    summary: string;
    strengths: string[];
    weaknesses: string[];
  };
  productDetails: {
    summary: string;
    keySellingPoints: string[];
    targetAudience: string[];
  };
  quickAnalysis: string;
  painPoints: {
    painPoint: string;
    explanation: string;
  }[];
  emotionTriggers: {
    emotion: string;
    explanation: string;
  }[];
  hooks: {
    hook: string;
    angle: string;
  }[];
  scripts: {
    title: string;
    script: string;
    angle: string;
  }[];
  captions: string[];
  cta: string[];
  hashtags: string[];
  videoIdeas: {
    title: string;
    concept: string;
    angle: string;
  }[];
}
