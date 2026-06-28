const express = require('express');
const prisma = require('../prisma/client');
const verifyToken = require('../middleware/auth');

const router = express.Router();

router.post('/', verifyToken, async (req, res) => {
  try {
    const {
      currentStage,
      chosenRoute,
      budgetLakhs,
      dateOfBirth,
      colorBlind,
      visionIssues,
      bpIssues,
    } = req.body;

    const data = {
      currentStage,
      chosenRoute,
      budgetLakhs,
      dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
      colorBlind: !!colorBlind,
      visionIssues: !!visionIssues,
      bpIssues: !!bpIssues,
    };

    const profile = await prisma.profile.upsert({
      where: { userId: req.userId },
      update: data,
      create: { userId: req.userId, ...data },
    });

    res.json({ profile });
  } catch (err) {
    res.status(500).json({ error: 'Failed to save profile', details: err.message });
  }
});

router.get('/', verifyToken, async (req, res) => {
  try {
    const profile = await prisma.profile.findUnique({ where: { userId: req.userId } });
    res.json({ profile });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

module.exports = router;