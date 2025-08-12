// config.js - 專門存放靜態設定資料

// AI 金鑰
export const apiKey = "AIzaSyAZUc69ryBPqw0Ss2ZV-f4Jg5kP3VjDd0c"; 

// 女神風格設定
export const styles = [
    // ✨ NEW: 新增 VIP 專屬風格
    { id: 'vip-exclusive', title: '👑 VIP 專屬', description: '獨一無二，只能在命運的邂逅中偶遇的稀有女神', prompt: "" },
    { id: 'beach-silhouette', title: '🏖️ 沙灘剪影', description: '黃昏、唯美、充滿想像的浪漫詩篇', prompt: "A beautiful Asian model as a silhouette against a sunset on a deserted beach. She wears a light, semi-transparent white dress. The mood is romantic and beautiful." },
    { id: 'morning-lazy', title: '☀️ 晨光私房', description: '慵懶、私密、屬於你的女友感瞬間', prompt: "A sexy and curvy Asian model with a lazy aura on a messy bed. She wears an oversized men's shirt, unbuttoned, with black stockings. Morning sun streams through blinds, creating a soft, intimate, and seductive atmosphere." },
    { id: 'neon-noir', title: '💦 濕身惡女', description: '霓虹、慾望、無法抗拒的危險魅力', prompt: "A tall, wild, and seductive Asian model in a white shirt caught in a city alley downpour, against a backdrop of blurry neon lights. Her eyes are defiant and confident." },
    { id: 'cyberpunk-warrior', title: '🤖 賽博龐克戰姬', description: '未來、科技、堅毅眼神中的致命吸引力', prompt: "Cyberpunk style. A female Asian warrior in glowing mechanical armor, holding an energy sword. The background is a futuristic city with flying vehicles and towering skyscrapers." }
];

// AI 算圖用的隨機關鍵字
export const randomKeywords = {
    hair: ['platinum blonde hair', 'long wavy brown hair', 'short pink hair', 'silver bob cut', 'fiery red braids', 'messy bun', 'sleek ponytail'],
    outfit: ['in a leather jacket', 'wearing a silk gown', 'in a futuristic jumpsuit', 'in a traditional kimono', 'in a simple t-shirt and jeans', 'wearing sheer lingerie', 'in a lace thong', 'wearing thigh-high stockings', 'in a wet see-through shirt'],
    setting: ['in a neon-lit tokyo street', 'in a lush green forest', 'on a rooftop overlooking the city', 'inside a cozy cafe', 'in a baroque-style room', 'in a sun-drenched bedroom', 'in the pouring rain'],
    artStyle: ['cinematic lighting', 'fantasy art style', 'oil painting style', 'vaporwave aesthetic', 'dramatic lighting', 'soft focus', 'lens flare'],
    bodyDetails: ['glistening skin', 'plump lips', 'slender waist', 'long legs', 'dewy skin', 'wet and glossy lips', 'curvaceous body'],
    expression: ['blushing shyly', 'seductive gaze', 'a playful wink', 'a mysterious smile', 'a look of longing', 'a shy glance'],
    mood: ['alluring', 'charming', 'enchanting', 'sultry', 'innocent but tempting', 'sun-kissed and radiant', 'captivating men\'s gaze']
};
