import https from "https";

export async function handler(event, context) {
  const query = event.queryStringParameters || {};
  const prompt = query.prompt;
  const width = query.width || 512;
  const height = query.height || 512;

  if (!prompt) {
    return {
      statusCode: 400,
      body: "Missing prompt",
    };
  }

  const encodedPrompt = encodeURIComponent(prompt);
  const seed = Math.floor(Math.random() * 1000000);

  const url = `https://image.pollinations.ai/prompt/${encodedPrompt}?model=flux&width=${width}&height=${height}&nologo=true&private=true&enhance=true&safe=true&quality=2&steps=30&seed=${seed}`;

  // Return a Promise that resolves with the full response data as Buffer
  const getImageBuffer = () => new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode !== 200) {
        reject(new Error(`Status Code: ${res.statusCode}`));
        res.resume();
        return;
      }

      const data = [];
      res.on("data", (chunk) => data.push(chunk));
      res.on("end", () => resolve(Buffer.concat(data)));
    }).on("error", reject);
  });

  try {
    const imageBuffer = await getImageBuffer();
    // Default content-type to image/png (could be improved if needed)
    const contentType = "image/png";

    return {
      statusCode: 200,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "no-cache",
      },
      body: imageBuffer.toString("base64"),
      isBase64Encoded: true,
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: `Image proxy error: ${error.message}`,
    };
  }
}
