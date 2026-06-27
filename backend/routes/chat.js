const express = require('express');
const { GoogleGenAI } = require('@google/genai');
const prisma = require('../prisma/client');
const verifyToken = require('../middleware/auth');

const router = express.Router();
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

router.post('/', verifyToken, async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) return res.status(400).json({ error: 'message is required' });

    const embedResult = await ai.models.embedContent({
      model: 'gemini-embedding-001',
      contents: message,
      config: { outputDimensionality: 768 },
    });
    const vector = embedResult.embeddings[0].values;
    const vectorString = `[${vector.join(',')}]`;

    const matches = await prisma.$queryRawUnsafe(
      `SELECT topic, content, 1 - (embedding <=> $1::vector) AS similarity
       FROM "KnowledgeChunk"
       ORDER BY embedding <=> $1::vector
       LIMIT 3`,
      vectorString
    );

    const topSimilarity = matches[0]?.similarity || 0;

    if (topSimilarity < 0.45) {
      return res.json({
        answer: "I don't have verified information on that. I can only answer questions about the pilot career path in India — roadmap steps, costs, flying schools, NDA vs civilian routes, and exam basics. Try rephrasing, or ask something within that scope.",
        sources: [],
      });
    }

    const context = matches.map((m, i) => `[${i + 1}] (${m.topic}): ${m.content}`).join('\n\n');

    const prompt = `You are SkyPath's Aviation Knowledge Assistant. Answer the user's question using ONLY the verified context below. Do not use any outside knowledge. If the context does not fully answer the question, say so honestly rather than guessing or inventing numbers or dates. Keep the answer concise and practical, in plain language.

Context:
${context}

User question: ${message}`;

    const result = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    const answerText = result.text;
    const noAnswerPhrases = [
    'does not contain',
    'does not provide',
    'do not have',
    "don't have",
    'doesn\'t contain',
    'cannot tell',
    'cannot provide',
    'no information',
    'not contain any',
    ];
    const usedContext = !noAnswerPhrases.some((phrase) =>
    answerText.toLowerCase().includes(phrase)
    );

    res.json({
    answer: answerText,
    sources: usedContext ? matches.map((m) => m.topic) : [],
    });
  } catch (err) {
    res.status(500).json({ error: 'Chat failed', details: err.message });
  }
});

module.exports = router;