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
  
  dataset.forEach((i, idx) => {
     if (i.title && i.title.toLowerCase().includes('celana') || i.name && i.name.toLowerCase().includes('celana')) {
        console.log(`[${idx}] Found: ${i.title || i.name}`);
     }
  });
}

testApify('https://shop-id.tokopedia.com/view/product/1732882631128352222?_d=ekd53736jlhfhk&_svg=1');
