const express = require('express');
const { GoogleGenAI } = require('@google/genai');
const prisma = require('../prisma/client');
const verifyToken = require('../middleware/auth');

const router = express.Router();
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

router.post('/search', verifyToken, async (req, res) => {
  try {
    const { query } = req.body;
    if (!query) return res.status(400).json({ error: 'query is required' });

    const result = await ai.models.embedContent({
      model: 'gemini-embedding-001',
      contents: query,
      config: { outputDimensionality: 768 },
    });

    const vector = result.embeddings[0].values;
    const vectorString = `[${vector.join(',')}]`;

    const matches = await prisma.$queryRawUnsafe(
      `SELECT topic, content, 1 - (embedding <=> $1::vector) AS similarity
       FROM "KnowledgeChunk"
       ORDER BY embedding <=> $1::vector
       LIMIT 3`,
      vectorString
    );

    res.json({ query, matches });
  } catch (err) {
    res.status(500).json({ error: 'Search failed', details: err.message });
  }
});

module.exports = router;