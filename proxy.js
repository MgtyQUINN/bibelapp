// netlify/functions/proxy.js
export async function handler(event) {
  const targetUrl = event.queryStringParameters.url;

  if (!targetUrl) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Missing URL parameter" }),
    };
  }

  try {
    const response = await fetch(targetUrl, {
      headers: {
        "api-key": "51658bcd81eabe502071d3f9b2d28780", // din API.Bible-nøkkel
      },
    });

    const data = await response.text();

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
      },
      body: data,
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
}
