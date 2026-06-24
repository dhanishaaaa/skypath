const express = require('express');
const prisma = require('../prisma/client');
const verifyToken = require('../middleware/auth');

const router = express.Router();

router.get('/', verifyToken, async (req, res) => {
  try {
    const profile = await prisma.profile.findUnique({ where: { userId: req.userId } });
    if (!profile) return res.status(400).json({ error: 'Complete onboarding first' });

    const steps = await prisma.roadmapStep.findMany({
      where: { route: profile.chosenRoute },
      orderBy: { stepOrder: 'asc' },
    });

    const totalCostLakhs = steps.reduce((sum, s) => sum + (s.estCostLakhs || 0), 0);
    const totalDurationMonths = steps.reduce((sum, s) => sum + (s.estDurationMonths || 0), 0);

    const budget = profile.budgetLakhs || 0;
    const budgetGapLakhs = budget - totalCostLakhs;

    res.json({
      route: profile.chosenRoute,
      totalCostLakhs: Math.round(totalCostLakhs * 100) / 100,
      totalDurationMonths: Math.round(totalDurationMonths * 10) / 10,
      totalDurationYears: Math.round((totalDurationMonths / 12) * 10) / 10,
      userBudgetLakhs: budget,
      budgetGapLakhs: Math.round(budgetGapLakhs * 100) / 100,
      isBudgetSufficient: budgetGapLakhs >= 0,
      breakdown: steps.map((s) => ({
        title: s.title,
        costLakhs: s.estCostLakhs,
        durationMonths: s.estDurationMonths,
      })),
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to calculate', details: err.message });
  }
});

module.exports = router;