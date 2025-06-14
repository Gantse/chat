import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";

export default async function handler(req, res) { if (req.method !== "POST") { return res.status(405).json({ error: "الطريقة غير مدعومة" }); }

const { message, base64Image } = req.body;

if (!message && !base64Image) { return res.status(400).json({ error: "الطلب غير مكتمل" }); }

try { const API_KEY = process.env.GEMINI_API_KEY; if (!API_KEY) { return res.status(500).json({ error: "مفتاح API غير متوفر" }); }

const genAI = new GoogleGenerativeAI(API_KEY);

let responseText = "";

if (base64Image) {
  const model = genAI.getGenerativeModel({
    model: "gemini-pro-vision",
    safetySettings: [
      { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
      { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
      { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
      { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
    ]
  });

  const result = await model.generateContent({
    contents: [
      {
        role: "user",
        parts: [
          { text: message || "صف الصورة التالية" },
          {
            inlineData: {
              mimeType: "image/jpeg",
              data: base64Image
            }
          }
        ]
      }
    ]
  });

  responseText = result.response.text();
} else {
  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash-latest",
    safetySettings: [
      { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
      { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
      { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
      { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
    ]
  });

  const chat = model.startChat({ history: [] });
  const result = await chat.sendMessage(message);
  responseText = result.response.text();
}

return res.status(200).json({ reply: responseText });

} catch (error) { console.error("API Error:", error); return res.status(500).json({ error: "حدث خطأ أثناء معالجة الطلب." }); } }

