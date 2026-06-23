const express = require('express');
const prisma = require('../prisma/client');
const verifyToken = require('../middleware/auth');

const router = express.Router();

router.post('/', verifyToken, async (req, res) => {
  try {
    const { currentStage, chosenRoute, budgetLakhs } = req.body;

    const profile = await prisma.profile.upsert({
      where: { userId: req.userId },
      update: { currentStage, chosenRoute, budgetLakhs },
      create: { userId: req.userId, currentStage, chosenRoute, budgetLakhs },
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