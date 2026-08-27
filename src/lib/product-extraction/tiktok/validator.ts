export function isValidTikTokProductUrl(urlStr: string): boolean {
  try {
    const url = new URL(urlStr);
    
    // Check protocol
    if (url.protocol !== 'https:') {
      return false;
    }

    // Must be exactly one of the allowed hostnames
    const allowedHostnames = ['www.tiktok.com', 'shop.tiktok.com', 'shop-id.tokopedia.com'];
    if (!allowedHostnames.includes(url.hostname)) {
      return false;
    }

    // Check path based on hostname
    let productId = '';
    if (url.hostname === 'shop-id.tokopedia.com') {
      if (!url.pathname.startsWith('/pdp/')) return false;
      
      // Path format: /pdp/product-slug/product-id
      const pathParts = url.pathname.replace('/pdp/', '').split('/');
      // ID is typically the last part of the path
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
