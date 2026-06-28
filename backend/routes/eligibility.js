const express = require('express');
const prisma = require('../prisma/client');
const verifyToken = require('../middleware/auth');

const router = express.Router();

function calculateAge(dob) {
  const diffMs = Date.now() - new Date(dob).getTime();
  return diffMs / (1000 * 60 * 60 * 24 * 365.25);
}

router.get('/', verifyToken, async (req, res) => {
  try {
    const profile = await prisma.profile.findUnique({ where: { userId: req.userId } });
    if (!profile) return res.status(400).json({ error: 'Complete onboarding first' });

    const { dateOfBirth, colorBlind, visionIssues, bpIssues, chosenRoute } = profile;

    let ageYears = null;
    if (dateOfBirth) ageYears = Math.round(calculateAge(dateOfBirth) * 100) / 100;

    const ndaReasons = [];
    let ndaEligible = null;
    let ndaMonthsRemaining = null;

    if (ageYears === null) {
      ndaReasons.push('Add your date of birth in onboarding to check NDA age eligibility.');
    } else {
      if (ageYears < 16.5) {
        ndaReasons.push(`You're ${ageYears} years old — NDA eligibility opens at 16.5 years.`);
        ndaEligible = false;
        ndaMonthsRemaining = Math.round((16.5 - ageYears) * 12);
      } else if (ageYears > 19.5) {
        ndaReasons.push(`NDA eligibility closes at 19.5 years — you're past that window.`);
        ndaEligible = false;
      } else {
        ndaMonthsRemaining = Math.round((19.5 - ageYears) * 12);
      }

      if (colorBlind) ndaReasons.push('Color blindness is generally disqualifying for Air Force flying duties.');
      if (visionIssues) ndaReasons.push('Reported vision issues beyond standard correctable myopia may disqualify you — confirm with an actual SSB medical.');
      if (bpIssues) ndaReasons.push('Blood pressure issues are commonly disqualifying for military aircrew medical standards.');

      if (ndaEligible !== false) {
        ndaEligible = !colorBlind && !visionIssues && !bpIssues;
      }
      if (ndaReasons.length === 0) ndaReasons.push('No flagged issues — you appear to meet basic NDA age and medical screening criteria.');
    }

    const civilianReasons = [];
    if (colorBlind) civilianReasons.push('Color blindness may restrict certain CPL categories — get a DGCA Class 1 medical assessment early before investing in training.');
    if (visionIssues) civilianReasons.push('Vision issues should be checked against DGCA Class 1 medical standards before committing to flight training costs.');
    if (bpIssues) civilianReasons.push('Blood pressure issues are evaluated case-by-case in DGCA medicals — get assessed early.');
    if (civilianReasons.length === 0) civilianReasons.push('No flagged issues — civilian route has no strict age limit either way.');

    const routeWarning =
      chosenRoute === 'NDA' && ndaEligible === false
        ? 'Your chosen NDA route may not currently be eligible based on your profile. Consider reviewing the civilian route instead.'
        : null;

    res.json({
      ageYears,
      nda: { eligible: ndaEligible, reasons: ndaReasons, monthsRemaining: ndaMonthsRemaining },
      civilian: { eligible: true, reasons: civilianReasons },
      routeWarning,
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to check eligibility', details: err.message });
  }
});

module.exports = router;