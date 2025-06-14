export default async function handler(req, res) {
  const { q } = req.query;

  if (!q) {
    return res.status(400).json({ error: "الطلب غير مكتمل" });
  }

  const API_KEY = "AIzaSyCncshKBdUuj5zSCTILvhXMcJrZJMw4P3U";

  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${API_KEY}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ role: "user", parts: [{ text: q }] }]
    })
  });

  const data = await response.json();
  const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text || "لا يوجد رد واضح";

  res.status(200).json({ reply });
}