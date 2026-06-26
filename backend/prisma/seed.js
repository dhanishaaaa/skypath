require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  await prisma.progress.deleteMany();
  await prisma.roadmapStep.deleteMany();
  await prisma.flyingSchool.deleteMany();

const ndaSteps = [
  { route: 'NDA', stepOrder: 1, title: 'Complete 10th with Science', description: 'Take Physics, Chemistry, Math in 10th to keep this route open.', estCostLakhs: 0, estDuration: '1 year', estDurationMonths: 12 },
  { route: 'NDA', stepOrder: 2, title: '12th with PCM', description: 'Physics, Chemistry, Math compulsory. Minimum 50% aggregate, 50% in Maths for NDA eligibility.', estCostLakhs: 0, estDuration: '2 years', estDurationMonths: 24 },
  { route: 'NDA', stepOrder: 3, title: 'Appear for NDA Written Exam', description: 'Conducted by UPSC twice a year. Age limit 16.5–19.5 years at time of joining. Unmarried male/female candidates only.', estCostLakhs: 0.01, estDuration: '6 months prep', estDurationMonths: 6 },
  { route: 'NDA', stepOrder: 4, title: 'SSB Interview', description: '5-day Services Selection Board interview testing psychological, physical, and group tasks.', estCostLakhs: 0.05, estDuration: '5 days', estDurationMonths: 0.2 },
  { route: 'NDA', stepOrder: 5, title: 'Medical Examination', description: 'Military medical standards — eyesight, height, BMI checked strictly.', estCostLakhs: 0, estDuration: '2-3 days', estDurationMonths: 0.1 },
  { route: 'NDA', stepOrder: 6, title: 'NDA Training (Air Force Wing)', description: '3 years at NDA Khadakwasla, then 1 year specialized Air Force training.', estCostLakhs: 0, estDuration: '4 years', estDurationMonths: 48 },
  { route: 'NDA', stepOrder: 7, title: 'Flying Training & Commission', description: 'Stage 1, 2, 3 flying training. Commissioned as Flying Officer.', estCostLakhs: 0, estDuration: '1-1.5 years', estDurationMonths: 15 },
];

const civilianSteps = [
  { route: 'CIVILIAN', stepOrder: 1, title: '10th — any stream', description: 'No specific stream required yet, but Science recommended.', estCostLakhs: 0, estDuration: '1 year', estDurationMonths: 12 },
  { route: 'CIVILIAN', stepOrder: 2, title: '12th with PCM (or NIOS alternative)', description: 'Physics, Chemistry, Math required by DGCA. Non-science students can clear Physics & Math via NIOS later.', estCostLakhs: 0, estDuration: '2 years', estDurationMonths: 24 },
  { route: 'CIVILIAN', stepOrder: 3, title: 'Class 2 Medical Certificate', description: 'Basic initial medical check — do this early, before spending on training, since eyesight/health can disqualify you.', estCostLakhs: 0.05, estDuration: '1 week', estDurationMonths: 0.25 },
  { route: 'CIVILIAN', stepOrder: 4, title: 'Choose a DGCA-approved Flying School', description: 'Compare fees, location, fleet, and past placement record.', estCostLakhs: 0, estDuration: '1-2 months research', estDurationMonths: 1.5 },
  { route: 'CIVILIAN', stepOrder: 5, title: 'Ground Classes (CPL theory)', description: 'Air Navigation, Aviation Meteorology, Air Regulations, Technical General & Specific — 5 DGCA papers.', estCostLakhs: 3, estDuration: '6-8 months', estDurationMonths: 7 },
  { route: 'CIVILIAN', stepOrder: 6, title: 'Class 1 Medical Certificate', description: 'Stricter medical required before flying solo. Must be renewed periodically throughout your career.', estCostLakhs: 0.15, estDuration: '1-2 weeks', estDurationMonths: 0.5 },
  { route: 'CIVILIAN', stepOrder: 7, title: 'Flight Training (200 hours)', description: 'Minimum 200 flying hours including solo, cross-country, instrument time.', estCostLakhs: 25, estDuration: '12-18 months', estDurationMonths: 15 },
  { route: 'CIVILIAN', stepOrder: 8, title: 'Clear CPL Exam & Checkride', description: 'Final DGCA exam + practical flight test to get Commercial Pilot License.', estCostLakhs: 1, estDuration: '1-2 months', estDurationMonths: 1.5 },
  { route: 'CIVILIAN', stepOrder: 9, title: 'Type Rating', description: 'Training specific to an aircraft type (e.g., A320, B737) — usually required by airlines before hiring.', estCostLakhs: 8, estDuration: '2-3 months', estDurationMonths: 2.5 },
  { route: 'CIVILIAN', stepOrder: 10, title: 'Airline Interview & Placement', description: 'Apply to airlines, clear interview + simulator check, get hired as First Officer.', estCostLakhs: 0, estDuration: 'varies', estDurationMonths: 2 },
];

const flyingSchools = [
  { name: 'Indira Gandhi Rashtriya Uran Akademi (IGRUA)', city: 'Amethi', state: 'Uttar Pradesh', ownership: 'Government', feeMinLakhs: 38, feeMaxLakhs: 42, fleetType: 'Cessna 172, Piper Seneca', website: 'www.igrua.gov.in' },
  { name: 'The Bombay Flying Club', city: 'Mumbai', state: 'Maharashtra', ownership: 'Society', feeMinLakhs: 22, feeMaxLakhs: 26, fleetType: 'Cessna 172, Cessna 152, Piper Seneca', website: 'www.bombayflyingclub.com' },
  { name: 'Madhya Pradesh Flying Club', city: 'Indore', state: 'Madhya Pradesh', ownership: 'State Government', feeMinLakhs: 18, feeMaxLakhs: 22, fleetType: 'Cessna 172' },
  { name: 'National Flying Training Institute (NFTI)', city: 'Gondia', state: 'Maharashtra', ownership: 'Government (Alliance Air JV)', feeMinLakhs: 24, feeMaxLakhs: 28, fleetType: 'Cessna 172' },
  { name: 'Rajiv Gandhi Academy for Aviation Technology (RGAAT)', city: 'Hyderabad', state: 'Telangana', ownership: 'Private Ltd', feeMinLakhs: 22, feeMaxLakhs: 26, fleetType: 'Cessna 152, Cessna 172' },
  { name: 'Wings Aviation Pvt. Ltd.', city: 'Hyderabad', state: 'Telangana', ownership: 'Private Ltd', feeMinLakhs: 20, feeMaxLakhs: 24, fleetType: 'Cessna 152, Cessna 172, Technam P2006T' },
  { name: 'Academy of Carver Aviation', city: 'Baramati', state: 'Maharashtra', ownership: 'Private Ltd', feeMinLakhs: 20, feeMaxLakhs: 24, fleetType: 'Cessna 172' },
  { name: 'Ambitions Flying Club', city: 'Karad', state: 'Maharashtra', ownership: 'Private Ltd', feeMinLakhs: 20, feeMaxLakhs: 24, fleetType: 'Cessna 172' },
  { name: 'Government Aviation Training Institute', city: 'Bhopal', state: 'Madhya Pradesh', ownership: 'State Government', feeMinLakhs: 16, feeMaxLakhs: 20, fleetType: 'Cessna 172' },
  { name: 'Asia Pacific Flight Training Academy', city: 'Jalgaon', state: 'Maharashtra', ownership: 'Private Ltd', feeMinLakhs: 26, feeMaxLakhs: 30, fleetType: 'Diamond DA40, DA42' },
  { name: 'Vision Flying Training Institute', city: 'Amreli', state: 'Gujarat', ownership: 'Private Ltd', feeMinLakhs: 22, feeMaxLakhs: 26, fleetType: 'Cessna 172' },
  { name: 'Chetak Aviation', city: 'Aligarh', state: 'Uttar Pradesh', ownership: 'Society', feeMinLakhs: 16, feeMaxLakhs: 20, fleetType: 'Cessna 172, Cessna 152' },
];

await prisma.roadmapStep.createMany({ data: [...ndaSteps, ...civilianSteps] });
await prisma.flyingSchool.createMany({ data: flyingSchools });

console.log('Seed complete:', ndaSteps.length + civilianSteps.length, 'steps,', flyingSchools.length, 'schools');
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());