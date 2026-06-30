const express = require('express');
const PDFDocument = require('pdfkit');
const prisma = require('../prisma/client');
const verifyToken = require('../middleware/auth');

const router = express.Router();

router.get('/pdf', verifyToken, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.userId } });
    const profile = await prisma.profile.findUnique({ where: { userId: req.userId } });
    if (!profile) return res.status(400).json({ error: 'Complete onboarding first' });

    const steps = await prisma.roadmapStep.findMany({
      where: { route: profile.chosenRoute },
      orderBy: { stepOrder: 'asc' },
      include: { progress: { where: { profile: { userId: req.userId } } } },
    });

    const quizAttempts = await prisma.quizAttempt.findMany({
      where: { userId: req.userId },
      orderBy: { takenAt: 'desc' },
      take: 5,
    });

    let ndaEligibility = null;
    if (profile.dateOfBirth) {
      const ageYears = (Date.now() - new Date(profile.dateOfBirth).getTime()) / (1000 * 60 * 60 * 24 * 365.25);
      const flagged = profile.colorBlind || profile.visionIssues || profile.bpIssues;
      ndaEligibility = {
        ageYears: Math.round(ageYears * 10) / 10,
        eligible: ageYears >= 16.5 && ageYears <= 19.5 && !flagged,
      };
    }

    const totalCostLakhs = steps.reduce((sum, s) => sum + (s.estCostLakhs || 0), 0);
    const totalDurationMonths = steps.reduce((sum, s) => sum + (s.estDurationMonths || 0), 0);

    const doc = new PDFDocument({ margin: 50, bufferPages: true });
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=SkyPath_Roadmap_${user.name.replace(/\s+/g, '_')}.pdf`);
    doc.pipe(res);

    doc.fontSize(22).fillColor('#14121F').text('SkyPath', { continued: true }).fillColor('#D98E3E').text(' | Pilot Career Plan');
    doc.fontSize(10).fillColor('#888888').text('Personalized Pilot Career Roadmap');
    doc.moveDown(1.5);

    doc.fontSize(14).fillColor('#000000').text(`Prepared for: ${user.name}`);
    doc.fontSize(10).fillColor('#555555').text(`Route: ${profile.chosenRoute}    Stage: ${profile.currentStage}`);
    doc.text(`Generated: ${new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}`);
    doc.moveDown(1);

    doc.fontSize(13).fillColor('#14121F').text('Summary');
    doc.moveDown(0.3);
    doc.fontSize(10).fillColor('#000000');
    doc.text(`Total Estimated Cost: Rs. ${Math.round(totalCostLakhs * 100) / 100} Lakhs`);
    doc.text(`Total Estimated Duration: ${Math.round((totalDurationMonths / 12) * 10) / 10} years (${Math.round(totalDurationMonths * 10) / 10} months)`);
    if (profile.budgetLakhs) {
      const gap = profile.budgetLakhs - totalCostLakhs;
      doc.text(`Your Stated Budget: Rs. ${profile.budgetLakhs} Lakhs (${gap >= 0 ? `Surplus of Rs. ${Math.round(gap * 100) / 100}L` : `Short by Rs. ${Math.round(Math.abs(gap) * 100) / 100}L`})`);
    }
    doc.moveDown(1);

    if (ndaEligibility) {
      doc.fontSize(13).fillColor('#14121F').text('NDA Eligibility Snapshot');
      doc.moveDown(0.3);
      doc.fontSize(10).fillColor(ndaEligibility.eligible ? '#1a8a3a' : '#a83232');
      doc.text(`Age: ${ndaEligibility.ageYears} years — ${ndaEligibility.eligible ? 'Currently within NDA eligibility window' : 'Outside NDA eligibility window or medical flags present'}`);
      doc.fillColor('#888888').fontSize(8).text('Based on age and self-reported medical flags. Confirm with an official SSB medical examination.');
      doc.moveDown(1);
    }

    doc.fontSize(13).fillColor('#14121F').text('Step-by-Step Roadmap');
    doc.moveDown(0.5);

    steps.forEach((step, i) => {
      const done = step.progress?.[0]?.completed;
      doc.fontSize(11).fillColor(done ? '#1a8a3a' : '#000000').text(`${i + 1}. ${step.title}${done ? '  (Completed)' : ''}`);
      doc.fontSize(9).fillColor('#555555').text(step.description, { indent: 15 });
      const meta = [];
      if (step.estCostLakhs !== null) meta.push(`Cost: Rs. ${step.estCostLakhs}L`);
      if (step.estDuration) meta.push(`Duration: ${step.estDuration}`);
      if (meta.length) doc.fontSize(9).fillColor('#888888').text(meta.join('   '), { indent: 15 });
      doc.moveDown(0.6);

      if (doc.y > 700) doc.addPage();
    });

    if (quizAttempts.length > 0) {
      doc.fontSize(13).fillColor('#14121F').text('Recent Quiz Performance');
      doc.moveDown(0.3);
      quizAttempts.forEach((a) => {
        const pct = Math.round((a.score / a.totalQuestions) * 100);
        doc.fontSize(10).fillColor('#000000').text(
          `${new Date(a.takenAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })} — ${a.score}/${a.totalQuestions} (${pct}%)`
        );
      });
      doc.moveDown(1);
    }

    const range = doc.bufferedPageRange();
    for (let i = range.start; i < range.start + range.count; i++) {
      doc.switchToPage(i);
      doc.fontSize(8).fillColor('#999999').text(
        `SkyPath — Page ${i + 1} of ${range.count}. Cost and duration figures are estimates, not official quotes.`,
        50, 770, { align: 'center', width: 500 }
      );
    }

    doc.end();
  } catch (err) {
    res.status(500).json({ error: 'Failed to generate PDF', details: err.message });
  }
});

module.exports = router;