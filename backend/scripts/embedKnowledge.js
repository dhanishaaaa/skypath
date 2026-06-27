require('dotenv').config();
const { GoogleGenAI } = require('@google/genai');
const { PrismaClient } = require('@prisma/client');
const knowledgeChunks = require('../prisma/knowledgeData');

const prisma = new PrismaClient();
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function main() {
  await prisma.$executeRawUnsafe('DELETE FROM "KnowledgeChunk"');
  console.log('Cleared old knowledge chunks.');

  for (const chunk of knowledgeChunks) {
    const result = await ai.models.embedContent({
      model: 'gemini-embedding-001',
      contents: chunk.content,
      config: { outputDimensionality: 768 },
    });

    const vector = result.embeddings[0].values;
    const vectorString = `[${vector.join(',')}]`;

    await prisma.$executeRawUnsafe(
      `INSERT INTO "KnowledgeChunk" (id, topic, content, embedding) VALUES (gen_random_uuid(), $1, $2, $3::vector)`,
      chunk.topic,
      chunk.content,
      vectorString
    );

    console.log('Embedded:', chunk.topic);
  }

  console.log('Done. Total chunks embedded:', knowledgeChunks.length);
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());