// netlify/functions/callGemini.js

exports.handler = async function(event, context) {
    // 從前端請求中獲取使用者輸入的 prompt
    const userPrompt = JSON.parse(event.body);

    // 從安全的環境變數中讀取 API 金鑰

    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;


    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${GEMINI_API_KEY}`;

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: userPrompt
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
