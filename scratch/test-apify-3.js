require('dotenv').config({ path: '.env.local' });

const actorId = process.env.APIFY_ACTOR_ID || 'Ulgy4k1tL8UcIisVf';
const apiToken = process.env.APIFY_API_TOKEN;

async function testApify(url) {
  const apifyUrl = `https://api.apify.com/v2/acts/${actorId}/run-sync-get-dataset-items?token=${apiToken}`;
  const requestBody = { productUrls: [{ url }] }; 

  const response = await fetch(apifyUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(requestBody)
  });

  const dataset = await response.json();
  const urlWithoutQuery = url.split('?')[0];
  const urlParts = urlWithoutQuery.split('/');
  const possibleId = urlParts[urlParts.length - 1]; 

  console.log("possibleId:", possibleId);
  
  const exactMatch = dataset.find((item) => {
     if (item.url && (item.url === url || item.url.includes(possibleId))) return true;
     if (item.product_id && item.product_id === possibleId) return true;
     return false;
  });

  if (exactMatch) {
    console.log("Found Exact Match:", exactMatch.title || exactMatch.name);
  } else {
    console.log("No exact match found!");
    // Print all product IDs to see why it didn't match
    dataset.forEach((i, idx) => {
      console.log(`[${idx}] id: ${i.product_id} | url: ${i.url?.substring(0,60)}`);
    });
  }
}

testApify('https://shop-id.tokopedia.com/view/product/1732882631128352222?_d=ekd53736jlhfhk&_svg=1');
