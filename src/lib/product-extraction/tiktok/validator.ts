export function isValidTikTokProductUrl(urlStr: string): boolean {
  try {
    const url = new URL(urlStr);
    
    // Check protocol
    if (url.protocol !== 'https:') {
      return false;
    }

    // Must be one of the allowed hostnames (including mobile shortened domains)
    const allowedHostnames = [
      'www.tiktok.com', 
      'shop.tiktok.com', 
      'vt.tiktok.com', // TikTok mobile short link
      'shop-id.tokopedia.com',
      'tokopedia.link' // Tokopedia mobile short link
    ];
    if (!allowedHostnames.includes(url.hostname)) {
      return false;
    }

    let productId = '';
    
    // For mobile short links, we don't strictly validate the path structure
    // because they redirect to the actual product page later.
    if (url.hostname === 'tokopedia.link' || url.hostname === 'vt.tiktok.com') {
      productId = 'shortlink'; // Bypass strict ID extraction
    } else if (url.hostname === 'shop-id.tokopedia.com') {
      if (!url.pathname.startsWith('/pdp/')) return false;
      const pathParts = url.pathname.replace('/pdp/', '').split('/');
      productId = pathParts[pathParts.length - 1];
    } else {
      if (!url.pathname.startsWith('/view/product/')) return false;
      const pathParts = url.pathname.replace('/view/product/', '').split('/');
      productId = pathParts[0];
    }
    
    if (!productId || productId.length === 0) {
      return false;
    }

    return true;
  } catch (e) {
    // URL parsing failed
    return false;
  }
}
