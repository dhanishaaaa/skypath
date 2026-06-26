const express = require('express');
const prisma = require('../prisma/client');
const verifyToken = require('../middleware/auth');

const router = express.Router();

router.get('/recommendations', verifyToken, async (req, res) => {
  try {
    const profile = await prisma.profile.findUnique({ where: { userId: req.userId } });
    if (!profile) return res.status(400).json({ error: 'Complete onboarding first' });

    const budget = profile.budgetLakhs;

    let schools = await prisma.flyingSchool.findMany();

    const scored = schools.map((school) => {
    let score = 0;
    const reasons = [];
    let overBudget = false;

    if (budget) {
        if (budget >= school.feeMinLakhs && budget <= school.feeMaxLakhs) {
        score += 3;
        reasons.push('Fits your budget range');
        } else if (budget > school.feeMaxLakhs) {
        score += 2;
        reasons.push('Within your budget, room to spare');
        } else if (budget >= school.feeMinLakhs * 0.85) {
        score += 1;
        reasons.push('Close to your budget, slightly above');
        } else {
        overBudget = true;
        reasons.push(`Roughly ₹${Math.round((school.feeMinLakhs - budget) * 100) / 100}L over your budget`);
        }
    } else {
        score += 1;
    }

      if (school.ownership.toLowerCase().includes('government')) {
        score += 1;
        reasons.push('Government-backed, generally lower cost');
      }

      return { ...school, score, reasons, overBudget };
    });

    scored.sort((a, b) => b.score - a.score);

    res.json({ budget, schools: scored });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch recommendations', details: err.message });
  }
});

module.exports = router;