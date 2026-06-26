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
        yourAnswer: a.selectedOption,
        correctOption: q?.correctOption,
        isCorrect,
        explanation: q?.explanation,
      };
    });

    await prisma.quizAttempt.create({
      data: {
        userId: req.userId,
        topic: questions[0]?.topic || 'General Aviation Knowledge',
        score,
        totalQuestions: answers.length,
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

module.exports = router;