const express = require('express');
const prisma = require('../prisma/client');
const verifyToken = require('../middleware/auth');

const router = express.Router();

router.get('/', verifyToken, async (req, res) => {
  try {
    const bookmarks = await prisma.schoolBookmark.findMany({
      where: { userId: req.userId },
      include: { school: true },
      orderBy: { createdAt: 'desc' },
    });
    res.json({ bookmarks: bookmarks.map((b) => ({ ...b.school, bookmarkId: b.id })) });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch bookmarks' });
  }
});

router.post('/:schoolId', verifyToken, async (req, res) => {
  try {
    const bookmark = await prisma.schoolBookmark.create({
      data: { userId: req.userId, schoolId: req.params.schoolId },
    });
    res.json({ bookmark });
  } catch (err) {
    if (err.code === 'P2002') return res.status(400).json({ error: 'Already bookmarked' });
    res.status(500).json({ error: 'Failed to bookmark' });
  }
});

router.delete('/:schoolId', verifyToken, async (req, res) => {
  try {
    await prisma.schoolBookmark.deleteMany({
      where: { userId: req.userId, schoolId: req.params.schoolId },
    });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to remove bookmark' });
  }
});

module.exports = router;