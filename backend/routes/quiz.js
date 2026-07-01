const express = require('express');
const prisma = require('../prisma/client');
const verifyToken = require('../middleware/auth');

const router = express.Router();

router.get('/', verifyToken, async (req, res) => {
  try {
    const questions = await prisma.quizQuestion.findMany({
      select: {
        id: true,
        topic: true,
        question: true,
        optionA: true,
        optionB: true,
        optionC: true,
        optionD: true,
      },
    });
    res.json({ questions });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch quiz', details: err.message });
  }
});

router.post('/submit', verifyToken, async (req, res) => {
  try {
    const { answers } = req.body;
    if (!answers || !Array.isArray(answers)) {
      return res.status(400).json({ error: 'answers array required' });
    }

    const questionIds = answers.map((a) => a.questionId);
    const questions = await prisma.quizQuestion.findMany({
      where: { id: { in: questionIds } },
    });

    let score = 0;
    const results = answers.map((a) => {
      const q = questions.find((q) => q.id === a.questionId);
      const isCorrect = q && q.correctOption === a.selectedOption;
      if (isCorrect) score++;
      return {
        questionId: a.questionId,
        question: q?.question,
        topic: q?.topic,
        yourAnswer: a.selectedOption,
        correctOption: q?.correctOption,
        isCorrect,
        explanation: q?.explanation,
      };
    });

    const attempt = await prisma.quizAttempt.create({
      data: {
        userId: req.userId,
        topic: 'Mixed',
        score,
        totalQuestions: answers.length,
        answers: {
          create: results.map((r) => ({
            topic: r.topic || 'Unknown',
            isCorrect: r.isCorrect,
          })),
        },
      },
    });

    res.json({ score, total: answers.length, results });
  } catch (err) {
    res.status(500).json({ error: 'Failed to submit quiz', details: err.message });
  }
});

router.get('/history', verifyToken, async (req, res) => {
  try {
    const attempts = await prisma.quizAttempt.findMany({
      where: { userId: req.userId },
      orderBy: { takenAt: 'desc' },
    });
    res.json({ attempts });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch history' });
  }
});

router.get('/weak-topics', verifyToken, async (req, res) => {
  try {
    const answers = await prisma.attemptAnswer.findMany({
      where: { attempt: { userId: req.userId } },
    });

    const topicStats = {};
    answers.forEach((a) => {
      if (!topicStats[a.topic]) topicStats[a.topic] = { correct: 0, total: 0 };
      topicStats[a.topic].total++;
      if (a.isCorrect) topicStats[a.topic].correct++;
    });

    const breakdown = Object.entries(topicStats).map(([topic, stats]) => ({
      topic,
      correct: stats.correct,
      total: stats.total,
      accuracy: Math.round((stats.correct / stats.total) * 100),
    })).sort((a, b) => a.accuracy - b.accuracy);

    res.json({ breakdown });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch weak topics' });
  }
});

module.exports = router;