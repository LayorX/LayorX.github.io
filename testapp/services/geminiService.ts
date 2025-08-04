import { GoogleGenAI } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  // In a real app, you'd want to handle this more gracefully.
  // For this concept, we'll log an error.
  console.error("Gemini API key not found. Please set the API_KEY environment variable.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY as string });

export const geminiService = {
  generateSummary: async (eventTitle: string): Promise<string> => {
    try {
      const prompt = `請針對以下事件標題，生成一段約100字的客觀、中立、不帶偏見的事件摘要，專注於事實陳述，不包含任何猜測或評論：\n\n事件：「${eventTitle}」`;
      
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });
      
      return response.text;
    } catch (error) {
      console.error("Error generating summary:", error);
      return "AI 模型呼叫失敗，請檢查 API 金鑰或稍後再試。";
    }
  },

  analyzeArgument: async (argumentText: string): Promise<string> => {
    try {
      const prompt = `請針對以下論述進行分析，你的目標是促進更深度的對話。請用繁體中文回答，並遵循以下結構，使用 markdown 格式化：\n\n論述：「${argumentText}」\n\n1. **核心論點總結**：用一兩句話總結這段話的主要觀點。\n2. **可探索的問題**：提出2-3個開放性問題，這些問題能引導讀者從不同角度思考，或質疑論述的前提。\n\n請確保你的回應是中立且客觀的。`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });
      
      return response.text;
    } catch (error) {
      console.error("Error analyzing argument:", error);
      return "AI 模型呼叫失敗，請檢查 API 金鑰或稍後再試。";
    }
  },
};
