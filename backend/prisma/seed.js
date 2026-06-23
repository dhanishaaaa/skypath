require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  await prisma.roadmapStep.deleteMany();

  const ndaSteps = [
    { route: 'NDA', stepOrder: 1, title: 'Complete 10th with Science', description: 'Take Physics, Chemistry, Math in 10th to keep this route open.', estCostLakhs: 0, estDuration: '1 year' },
    { route: 'NDA', stepOrder: 2, title: '12th with PCM', description: 'Physics, Chemistry, Math compulsory. Minimum 50% aggregate, 50% in Maths for NDA eligibility.', estCostLakhs: 0, estDuration: '2 years' },
    { route: 'NDA', stepOrder: 3, title: 'Appear for NDA Written Exam', description: 'Conducted by UPSC twice a year. Age limit 16.5–19.5 years at time of joining. Unmarried male/female candidates only.', estCostLakhs: 0.01, estDuration: '6 months prep' },
    { route: 'NDA', stepOrder: 4, title: 'SSB Interview', description: '5-day Services Selection Board interview testing psychological, physical, and group tasks.', estCostLakhs: 0.05, estDuration: '5 days' },
    { route: 'NDA', stepOrder: 5, title: 'Medical Examination', description: 'Military medical standards — eyesight, height, BMI checked strictly.', estCostLakhs: 0, estDuration: '2-3 days' },
    { route: 'NDA', stepOrder: 6, title: 'NDA Training (Air Force Wing)', description: '3 years at NDA Khadakwasla, then 1 year specialized Air Force training.', estCostLakhs: 0, estDuration: '4 years' },
    { route: 'NDA', stepOrder: 7, title: 'Flying Training & Commission', description: 'Stage 1, 2, 3 flying training. Commissioned as Flying Officer.', estCostLakhs: 0, estDuration: '1-1.5 years' },
  ];

  const civilianSteps = [
    { route: 'CIVILIAN', stepOrder: 1, title: '10th — any stream', description: 'No specific stream required yet, but Science recommended.', estCostLakhs: 0, estDuration: '1 year' },
    { route: 'CIVILIAN', stepOrder: 2, title: '12th with PCM (or NIOS alternative)', description: 'Physics, Chemistry, Math required by DGCA. Non-science students can clear Physics & Math via NIOS later.', estCostLakhs: 0, estDuration: '2 years' },
    { route: 'CIVILIAN', stepOrder: 3, title: 'Class 2 Medical Certificate', description: 'Basic initial medical check — do this early, before spending on training, since eyesight/health can disqualify you.', estCostLakhs: 0.05, estDuration: '1 week' },
    { route: 'CIVILIAN', stepOrder: 4, title: 'Choose a DGCA-approved Flying School', description: 'Compare fees, location, fleet, and past placement record.', estCostLakhs: 0, estDuration: '1-2 months research' },
    { route: 'CIVILIAN', stepOrder: 5, title: 'Ground Classes (CPL theory)', description: 'Air Navigation, Aviation Meteorology, Air Regulations, Technical General & Specific — 5 DGCA papers.', estCostLakhs: 3, estDuration: '6-8 months' },
    { route: 'CIVILIAN', stepOrder: 6, title: 'Class 1 Medical Certificate', description: 'Stricter medical required before flying solo. Must be renewed periodically throughout your career.', estCostLakhs: 0.15, estDuration: '1-2 weeks' },
    { route: 'CIVILIAN', stepOrder: 7, title: 'Flight Training (200 hours)', description: 'Minimum 200 flying hours including solo, cross-country, instrument time.', estCostLakhs: 25, estDuration: '12-18 months' },
    { route: 'CIVILIAN', stepOrder: 8, title: 'Clear CPL Exam & Checkride', description: 'Final DGCA exam + practical flight test to get Commercial Pilot License.', estCostLakhs: 1, estDuration: '1-2 months' },
    { route: 'CIVILIAN', stepOrder: 9, title: 'Type Rating', description: 'Training specific to an aircraft type (e.g., A320, B737) — usually required by airlines before hiring.', estCostLakhs: 8, estDuration: '2-3 months' },
    { route: 'CIVILIAN', stepOrder: 10, title: 'Airline Interview & Placement', description: 'Apply to airlines, clear interview + simulator check, get hired as First Officer.', estCostLakhs: 0, estDuration: 'varies' },
  ];

  await prisma.roadmapStep.createMany({ data: [...ndaSteps, ...civilianSteps] });

  console.log('Seed complete:', ndaSteps.length + civilianSteps.length, 'steps created');
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());