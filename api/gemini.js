// /api/gemini.js

import { GoogleGenerativeAI } from "@google/generative-ai";

// لا تضع المفتاح هنا مباشرة. استخدم متغيرات البيئة.
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export default async function handler(req, res) {
  // رفض أي طلب غير POST
  if (req.method !== "POST") {
    return res.status(400).json({ error: "الطلب غير صالح – يجب أن يكون POST فقط" });
  }

  const { message } = req.body;

  // تحقق من وجود الرسالة
  if (!message || typeof message !== "string") {
    return res.status(400).json({ error: "يرجى إرسال نص الرسالة في body.message" });
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const result = await model.generateContent(message);
    const response = await result.response;
    const text = response.text();

    return res.status(200).json({ response: text });

  } catch (error) {
    console.error("خطأ في الاتصال بـ Gemini:", error);
    return res.status(500).json({
      error: "حدث خطأ أثناء استدعاء Gemini API.",
      details: error.message || error.toString()
    });
  }
}
