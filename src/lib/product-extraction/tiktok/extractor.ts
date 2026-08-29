import { ProductData } from '../types';

export class ExtractionError extends Error {
  public code: string;
  constructor(code: string, message: string) {
    super(message);
    this.code = code;
  }
}

export async function extractTikTokProduct(url: string): Promise<ProductData> {
  const apiToken = process.env.APIFY_API_TOKEN;
  // Memungkinkan user mengganti ID scraper ke scraper khusus Indonesia (misal: kulqiz~tiktok-shop-indonesia-scraper)
  const actorId = process.env.APIFY_ACTOR_ID || 'unseenuser~tiktok-shop-scraper';

  if (!apiToken) {
    throw new ExtractionError(
      'PRODUCT_DATA_UNAVAILABLE',
      'API Token Apify belum dipasang. Silakan cek .env.local Anda.'
    );
  }

  try {
    const apifyUrl = `https://api.apify.com/v2/acts/${actorId}/run-sync-get-dataset-items?token=${apiToken}`;
    let response;
    try {
        // Jika menggunakan scraper kulqiz (Indonesia), gunakan startUrls. Jika scraper default, gunakan productUrls.
        const isKulqiz = actorId.includes('kulqiz') || actorId.includes('Ulgy4k1t');
        const requestBody = isKulqiz
          ? { productUrls: [{ url }] } // productUrls memaksa mode "Detail" (1 produk)
          : { mode: "ProductDetails", productUrls: [url] };

        response = await fetch(apifyUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody),
          signal: AbortSignal.timeout(240000) // Beri waktu 4 menit untuk Apify
        });
    } catch (e: any) {
      if (e.name === 'TimeoutError' || e.name === 'AbortError') {
        throw new ExtractionError('PRODUCT_DATA_UNAVAILABLE', 'Proses ekstraksi data memakan waktu terlalu lama (Time Out).');
      }
      throw e;
    }

    if (!response.ok) {
      if (response.status === 429) {
        throw new ExtractionError('RATE_LIMIT_EXCEEDED', 'API rate limit exceeded. Please try again later.');
      }
      throw new ExtractionError('PRODUCT_DATA_UNAVAILABLE', `Provider API returned status ${response.status}`);
    }

    const dataset = await response.json();

    if (!dataset || dataset.length === 0) {
       throw new ExtractionError('PRODUCT_DATA_UNAVAILABLE', 'Apify tidak mengembalikan data produk.');
    }

    // Beberapa scraper mengembalikan daftar produk (misal rekomendasi produk). Kita cari yang paling cocok dengan URL kita.
    let data = dataset[0];
    const urlParts = url.split('/');
    const possibleId = urlParts[urlParts.length - 1]; // ID biasanya ada di akhir URL
    
    const exactMatch = dataset.find((item: any) => {
       if (item.url && (item.url === url || item.url.includes(possibleId))) return true;
       if (item.product_id && item.product_id === possibleId) return true;
       return false;
    });

    if (exactMatch) {
       data = exactMatch;
    } else if (dataset.length === 1) {
       // Jika hanya 1 hasil (mode detail), pakai itu
       data = dataset[0];
    } else {
       // Jika crawler mengembalikan banyak produk tapi tidak ada yang cocok
       throw new ExtractionError('PRODUCT_DATA_UNAVAILABLE', 'Produk spesifik tidak ditemukan di halaman toko. Pastikan link produk sudah benar.');
    }

    // Map response dari Apify ke standar ProductData kita (mendukung format scraper US maupun Indonesia)
    const productData: ProductData = {
      source: {
        platform: 'tiktok_shop',
        url: data.url || url,
        extractedAt: new Date().toISOString()
      },
      product: {
        name: data.title || data.name || null,
        description: data.description || null,
        category: data.category || null,
        price: data.price || data.originalPrice || data.sale_price_value || data.sale_price || null,
        currency: data.currency || 'IDR',
        images: Array.isArray(data.images) ? data.images : (data.image ? [data.image] : [])
      },
      seller: {
        name: data.sellerName || data.shopName || data.shop_name || null
      },
      metrics: {
        rating: data.rating || null,
        reviewCount: data.reviews || data.reviewCount || data.review_count || null,
        soldCount: data.sold || data.sales || data.sold_count || null
      },
      variants: Array.isArray(data.variants) ? data.variants : [],
      attributes: data.attributes || {},
      reviews: []
    };

    return productData;

  } catch (error) {
    if (error instanceof ExtractionError) {
      throw error;
    }
    
    if (error instanceof Error && error.name === 'TimeoutError') {
      throw new ExtractionError('TIMEOUT', 'The extraction request timed out.');
    }

    console.error('Extraction error:', error);
    throw new ExtractionError(
      'PRODUCT_DATA_UNAVAILABLE',
      'An error occurred while fetching product data.'
    );
  }
}
