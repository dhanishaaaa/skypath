const express = require('express');
const prisma = require('../prisma/client');
const verifyToken = require('../middleware/auth');

const router = express.Router();

router.get('/', verifyToken, async (req, res) => {
  try {
    const profile = await prisma.profile.findUnique({ where: { userId: req.userId } });
    if (!profile) return res.status(400).json({ error: 'Complete onboarding first' });

    const quizAttempts = await prisma.quizAttempt.findMany({
      where: { userId: req.userId },
      orderBy: { takenAt: 'desc' },
      take: 3,
    });

    let quizAccuracy = 50;
    if (quizAttempts.length > 0) {
      const totalScore = quizAttempts.reduce((sum, a) => sum + a.score, 0);
      const totalQs = quizAttempts.reduce((sum, a) => sum + a.totalQuestions, 0);
      quizAccuracy = Math.round((totalScore / totalQs) * 100);
    }

    let age = 20;
    if (profile.dateOfBirth) {
      age = Math.round(((Date.now() - new Date(profile.dateOfBirth).getTime()) / (1000 * 60 * 60 * 24 * 365.25)) * 10) / 10;
    }

    const payload = {
      age,
      pcm_percent: profile.pcmPercent || 60,
      budget_lakhs: profile.budgetLakhs || 0,
      color_blind: profile.colorBlind ? 1 : 0,
      vision_issues: profile.visionIssues ? 1 : 0,
      bp_issues: profile.bpIssues ? 1 : 0,
      quiz_accuracy: quizAccuracy,
      route: profile.chosenRoute === 'NDA' ? 1 : 0,
    };

    const mlResponse = await fetch('http://localhost:5001/predict', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!mlResponse.ok) throw new Error('ML service unavailable');
    const mlData = await mlResponse.json();

    res.json({
      ...mlData,
      note: profile.pcmPercent ? null : 'PCM percentage not set — update your profile for a more accurate score.',
      inputUsed: payload,
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to get readiness score', details: err.message });
  }
});

module.exports = router;