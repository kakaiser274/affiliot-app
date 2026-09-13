async function testRedirect(shortUrl) {
  try {
    const response = await fetch(shortUrl, {
      method: 'GET',
      redirect: 'follow', // fetch follows redirects by default up to 20 times
    });
    console.log("Original URL:", shortUrl);
    console.log("Resolved URL:", response.url);
  } catch (err) {
    console.error("Error:", err.message);
  }
}

testRedirect('https://vt.tokopedia.com/t/ZS9SHJJQYEuaE-1wLEi/');
