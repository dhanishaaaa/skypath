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
      include: { progress: { where: { profile: { userId: req.userId } } } },
    });

    res.json({ route: profile.chosenRoute, steps });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch roadmap', details: err.message });
  }
});

router.post('/:stepId/complete', verifyToken, async (req, res) => {
  try {
    const profile = await prisma.profile.findUnique({ where: { userId: req.userId } });
    if (!profile) return res.status(400).json({ error: 'No profile found' });

    const progress = await prisma.progress.upsert({
      where: { profileId_stepId: { profileId: profile.id, stepId: req.params.stepId } },
      update: { completed: true, completedAt: new Date() },
      create: { profileId: profile.id, stepId: req.params.stepId, completed: true, completedAt: new Date() },
    });

    res.json({ progress });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update progress', details: err.message });
  }
});

module.exports = router;