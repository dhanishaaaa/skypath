const express = require('express');
const { GoogleGenAI } = require('@google/genai');
const prisma = require('../prisma/client');
const verifyToken = require('../middleware/auth');

const router = express.Router();
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

router.get('/history', verifyToken, async (req, res) => {
  try {
    const messages = await prisma.chatMessage.findMany({
      where: { userId: req.userId },
      orderBy: { createdAt: 'asc' },
    });
    res.json({ messages });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch chat history' });
  }
});

router.delete('/history', verifyToken, async (req, res) => {
  try {
    await prisma.chatMessage.deleteMany({ where: { userId: req.userId } });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to clear chat history' });
  }
});

router.post('/', verifyToken, async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) return res.status(400).json({ error: 'message is required' });

    const profile = await prisma.profile.findUnique({ where: { userId: req.userId } });
    let profileContext = '';
    if (profile) {
      const parts = [];
      if (profile.currentStage) parts.push(`currently at stage: ${profile.currentStage}`);
      if (profile.chosenRoute && profile.chosenRoute !== 'UNDECIDED') parts.push(`considering the ${profile.chosenRoute} route`);
      if (profile.budgetLakhs) parts.push(`has a budget of around ₹${profile.budgetLakhs} lakhs`);
      if (parts.length > 0) {
        profileContext = `\n\nUser's profile: This user is ${parts.join(', ')}. Tailor your answer to be relevant to their specific situation where helpful, but still answer strictly from the verified context below.`;
      }
    }

    await prisma.chatMessage.create({
      data: { userId: req.userId, role: 'user', content: message, sources: [] },
    });

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
    let answerText;
    let sources = [];

    if (topSimilarity < 0.45) {
      answerText = "I don't have verified information on that. I can only answer questions about the pilot career path in India — roadmap steps, costs, flying schools, NDA vs civilian routes, and exam basics. Try rephrasing, or ask something within that scope.";
    } else {
      const context = matches.map((m, i) => `[${i + 1}] (${m.topic}): ${m.content}`).join('\n\n');

      const prompt = `You are SkyPath's Aviation Knowledge Assistant. Answer the user's question using ONLY the verified context below. Do not use any outside knowledge. If the context does not fully answer the question, say so honestly rather than guessing or inventing numbers or dates. Keep the answer concise and practical, in plain language.${profileContext}

Context:
${context}

User question: ${message}`;

      const result = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });

      answerText = result.text;

      const noAnswerPhrases = [
        'does not contain', 'does not provide', 'do not have', "don't have",
        'doesn\'t contain', 'cannot tell', 'cannot provide', 'no information', 'not contain any',
      ];
      const usedContext = !noAnswerPhrases.some((p) => answerText.toLowerCase().includes(p));
      sources = usedContext ? matches.map((m) => m.topic) : [];
    }

    await prisma.chatMessage.create({
      data: { userId: req.userId, role: 'assistant', content: answerText, sources },
    });

    res.json({ answer: answerText, sources });
  } catch (err) {
    res.status(500).json({ error: 'Chat failed', details: err.message });
  }
});

module.exports = router;