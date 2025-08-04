// netlify/functions/callGemini.js

exports.handler = async function(event, context) {
    // 從前端請求中獲取使用者輸入的 prompt
    const { userPrompt } = JSON.parse(event.body);

    // 從安全的環境變數中讀取 API 金鑰
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

    const fullPrompt = `Based on the theme "${userPrompt}", generate a color scheme for a bouncing ball animation. Provide a JSON object with a hex code for the ball's color, a hex code for the background color, and a short, creative explanation in Traditional Chinese.`;

    const chatHistory = [{ role: "user", parts: [{ text: fullPrompt }] }];
    const payload = {
        contents: chatHistory,
        generationConfig: {
            responseMimeType: "application/json",
            responseSchema: {
                type: "OBJECT",
                properties: {
                    "ball_color": { "type": "STRING" },
                    "background_color": { "type": "STRING" },
                    "explanation": { "type": "STRING" }
                },
                required: ["ball_color", "background_color", "explanation"]
            }
        }
    };

    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${GEMINI_API_KEY}`;

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            return { statusCode: response.status, body: response.statusText };
        }

        const result = await response.json();

        return {
            statusCode: 200,
            body: JSON.stringify(result)
        };

    } catch (error) {
        return { statusCode: 500, body: error.toString() };
    }
};
