import { apiSettings, randomKeywords_day, randomKeywords_night } from './game-config.js';
import { getState } from './stateManager.js';

function getRandomItems(arr, count) {
    const shuffled = [...arr].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
}

export async function generateImageWithRetry(prompt) {
    const retries = apiSettings.imageGenerationRetries;
    const delay = apiSettings.imageGenerationDelay;
    
    const currentTheme = getState('currentTheme');
    const keywords = currentTheme === 'day' ? randomKeywords_day : randomKeywords_night;
    
    const enhancedPrompt = `${prompt}, ${getRandomItems(keywords.hair, 1)}, ${getRandomItems(keywords.outfit, 2).join(', ')}, ${getRandomItems(keywords.setting, 1)}, ${getRandomItems(keywords.artStyle, 1)}, ${getRandomItems(keywords.bodyDetails, 2).join(', ')}, ${getRandomItems(keywords.expression, 1)}, ${getRandomItems(keywords.mood, 1)}.`;
    const fullPrompt = `${apiSettings.prompts.imagePrefix} ${enhancedPrompt} ${apiSettings.prompts.imageSuffix} Negative prompt: ${apiSettings.prompts.negativePrompt}`;

    for (let i = 0; i < retries; i++) {
        try {
            const selectedModel = 'gemini-flash'; 
            return await callImageGenerationAPI(fullPrompt, selectedModel);
        } catch (error) {
            console.error(`Attempt ${i + 1} failed:`, error);
            if (i === retries - 1) throw error; 
            await new Promise(res => setTimeout(res, delay * (i + 1)));
        }
    }
    return null;
}

async function callImageGenerationAPI(userPrompt, model) {
    const userApiKey = getState('userApiKey');
    const modelName = model === 'imagen-3' ? 'imagen-3.0-generate-002' : 'gemini-2.0-flash-preview-image-generation';
    const isImagen = model === 'imagen-3';
    const apiUrl = isImagen 
        ? `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:predict?key=${userApiKey}`
        : `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${userApiKey}`;

    const payload = isImagen
        ? { instances: [{ prompt: userPrompt }], parameters: { "sampleCount": 1 } }
        : {
            contents: [{ parts: [{ text: userPrompt }] }],
            generationConfig: { responseModalities: ['TEXT', 'IMAGE'] },
          };

    const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });

    if (!response.ok) {
        const errorData = await response.json();
        console.error('API Error Response:', errorData);
        throw new Error(`API 請求失敗: ${errorData?.error?.message || response.statusText}`);
    }

    const result = await response.json();
    
    const candidate = result?.candidates?.[0];
    if (isImagen) {
        const base64Data = result.predictions?.[0]?.bytesBase64Encoded;
        if (!base64Data) {
            console.error('Unexpected Imagen API response structure:', result);
            throw new Error("Imagen API 回應中找不到圖片資料。");
        }
        return `data:image/png;base64,${base64Data}`;
    }

    if (!candidate) {
        console.error('Unexpected API response: No candidates found.', result);
        throw new Error("API 回應無效，找不到候選項目。");
    }

    if (candidate.finishReason && candidate.finishReason !== 'STOP') {
        console.error('API generation finished with reason:', candidate.finishReason, candidate);
        throw new Error(`圖片生成因安全限制被阻擋，請嘗試更換提示詞。`);
    }

    const imagePart = candidate.content?.parts?.find(p => p.inlineData);
    const base64Data = imagePart?.inlineData?.data;

    if (!base64Data) {
        console.error('Unexpected API response structure:', result);
        throw new Error("API 回應中找不到圖片資料。");
    }
    
    return `data:image/png;base64,${base64Data}`;
}


export async function callTextGenerationAPI(prompt) {
    const userApiKey = getState('userApiKey');
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${userApiKey}`;
    const payload = {
        contents: [{ role: "user", parts: [{ text: prompt }] }]
    };

    const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`API 請求失敗: ${errorData?.error?.message || response.statusText}`);
    }

    const result = await response.json();
    const text = result.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) {
        throw new Error("API 回應中找不到文字資料。");
    }
    return text;
}

export async function callTTSAPI(text) {
    const userApiKey = getState('userApiKey');
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-tts:generateContent?key=${userApiKey}`;
    const payload = {
        contents: [{ parts: [{ text: text }] }],
        generationConfig: {
            responseModalities: ["AUDIO"],
            speechConfig: {
                voiceConfig: {
                    prebuiltVoiceConfig: { voiceName: apiSettings.ttsVoice } 
                }
            }
        },
        model: "gemini-2.5-flash-preview-tts"
    };

    const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`TTS API 請求失敗: ${errorData?.error?.message || response.statusText}`);
    }

    const result = await response.json();
    const part = result?.candidates?.[0]?.content?.parts?.[0];
    const audioData = part?.inlineData?.data;
    const mimeType = part?.inlineData?.mimeType;

    if (!audioData || !mimeType) {
        throw new Error("TTS API 回應中找不到音訊資料。");
    }
    return { audioData, mimeType };
}