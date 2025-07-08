import https from "https";

export async function handler(event, context) {
  const query = event.queryStringParameters || {};
  const prompt = query.prompt;

  if (!prompt) {
    return {
      statusCode: 400,
      body: "Missing prompt",
    };
  }

  const encodedPrompt = encodeURIComponent(prompt);
  const url = `https://text.pollinations.ai/prompt/${encodedPrompt}`;

  // Return a promise that wraps the https request
  const getText = () => new Promise((resolve, reject) => {
    https.get(url, { headers: { Accept: "text/plain" } }, (res) => {
      if (res.statusCode !== 200) {
        reject(new Error(`Status Code: ${res.statusCode}`));
        res.resume(); // Consume response data to free memory
        return;
      }

      let rawData = "";
      res.setEncoding("utf8");
      res.on("data", (chunk) => rawData += chunk);
      res.on("end", () => resolve(rawData));
    }).on("error", reject);
  });

  try {
    const text = await getText();
    return {
      statusCode: 200,
      body: text,
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: "Error fetching from Pollinations: " + error.message,
    };
  }
}
