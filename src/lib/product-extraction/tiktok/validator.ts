export function isValidTikTokProductUrl(text: string): boolean {
  try {
    // Extract the actual URL if the user pasted text containing a URL (e.g., from mobile app "Share" button)
    const urlMatch = text.match(/(https?:\/\/[^\s]+)/);
    const urlStr = urlMatch ? urlMatch[0] : text;
    
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

    // As long as the hostname is allowed, we trust the URL and let the backend scraper handle it.
    // TikTok/Tokopedia frequently change their URL structures (e.g., query params instead of paths)
    return true;

    return true;
  } catch (e) {
    // URL parsing failed
    return false;
  }
}
