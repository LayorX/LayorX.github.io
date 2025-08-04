// netlify/functions/callGemini.js

exports.handler = async function(event, context) {
    // 從前端請求中獲取使用者輸入的 prompt
    const userPrompt = JSON.parse(event.body);

    // 從安全的環境變數中讀取所有 API 金鑰，並過濾掉未設定的空值
    const apiKeys = [
        process.env.GEMINI_API_KEY,
        process.env.GEMINI_API_KEY_2,
        process.env.GEMINI_API_KEY_3
    ].filter(Boolean); // filter(Boolean) 會移除所有 falsy 值 (如 undefined, null, '')

    if (apiKeys.length === 0) {
        return { statusCode: 500, body: "伺服器未設定任何 API 金鑰。" };
    }

    // 依序嘗試每個 API 金鑰
    for (const key of apiKeys) {
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${key}`;

        try {
            console.log(`正在嘗試金鑰: ${key.substring(0, 5)}...`); // 方便除錯
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userPrompt)
            });

            // 如果 API 呼叫成功 (HTTP 狀態碼 200-299)，則直接回傳結果並結束函式
            if (response.ok) {
                const result = await response.json();
                console.log(`金鑰 ${key.substring(0, 5)}... 成功！`);
                return {
                    statusCode: 200,
                    body: JSON.stringify(result)
                };
            }
            // 如果金鑰無效或額度用完 (通常是 4xx 錯誤)，迴圈會繼續嘗試下一個金鑰
            console.log(`金鑰 ${key.substring(0, 5)}... 嘗試失敗，狀態碼: ${response.status}`);

        } catch (error) {
            console.error(`使用金鑰 ${key.substring(0, 5)}... 發生網路錯誤:`, error);
            // 如果發生網路層級的錯誤，也繼續嘗試下一個金鑰
        }
    }

    // 如果所有金鑰都嘗試失敗，回傳最終的錯誤訊息
    console.error("所有備援金鑰均嘗試失敗。");
    return {
        statusCode: 500,
        body: "所有備援 API 金鑰均嘗試失敗。"
    };
};






/////////////////////////////////////////////////






/* netlify/functions/callGemini.js

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
            body: JSON.stringify(userPrompt)
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
*/