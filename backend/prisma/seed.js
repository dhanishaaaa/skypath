require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  await prisma.progress.deleteMany();
  await prisma.roadmapStep.deleteMany();
  await prisma.flyingSchool.deleteMany();
  await prisma.quizAttempt.deleteMany();
  await prisma.quizQuestion.deleteMany();


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

const quizQuestions = [
  { topic: 'General Aviation Knowledge', question: 'What is the international distress squawk code?', optionA: '7500', optionB: '7600', optionC: '7700', optionD: '7000', correctOption: 'C', explanation: '7700 is the universal emergency transponder code.' },
  { topic: 'General Aviation Knowledge', question: 'Squawk code 7500 indicates:', optionA: 'Radio failure', optionB: 'Hijacking', optionC: 'Engine failure', optionD: 'Low fuel', correctOption: 'B', explanation: '7500 specifically signals unlawful interference/hijacking.' },
  { topic: 'General Aviation Knowledge', question: 'Squawk code 7600 indicates:', optionA: 'Hijacking', optionB: 'Radio communication failure', optionC: 'Emergency', optionD: 'VFR flight', correctOption: 'B', explanation: '7600 signals loss of radio communication.' },
  { topic: 'General Aviation Knowledge', question: 'What does ICAO stand for?', optionA: 'International Civil Aviation Organization', optionB: 'Indian Civil Aviation Office', optionC: 'International Cargo Aviation Operations', optionD: 'Inter-Continental Aviation Office', correctOption: 'A', explanation: 'ICAO sets global aviation standards under the UN.' },
  { topic: 'General Aviation Knowledge', question: 'The standard ICAO VFR conspicuity transponder code (used in India) is:', optionA: '1200', optionB: '7000', optionC: '7700', optionD: '2000', correctOption: 'B', explanation: '7000 is the ICAO-standard VFR code; 1200 is US-specific.' },
  { topic: 'General Aviation Knowledge', question: 'Minimum age to obtain a Student Pilot License (SPL) in India is:', optionA: '14', optionB: '16', optionC: '18', optionD: '21', correctOption: 'B', explanation: 'DGCA sets the minimum SPL age at 16 years.' },
  { topic: 'General Aviation Knowledge', question: 'Minimum age to obtain a Commercial Pilot License (CPL) in India is:', optionA: '16', optionB: '17', optionC: '18', optionD: '21', correctOption: 'C', explanation: 'CPL requires a minimum age of 18 per DGCA rules.' },
  { topic: 'General Aviation Knowledge', question: '"QNH" altimeter setting allows the altimeter to read:', optionA: 'Airfield elevation when on the ground', optionB: 'Height above ground only', optionC: 'Wind speed', optionD: 'Runway length', correctOption: 'A', explanation: 'QNH is set so the altimeter shows field elevation at touchdown.' },
  { topic: 'General Aviation Knowledge', question: 'A distress call "Mayday" should be repeated how many times?', optionA: 'Once', optionB: 'Twice', optionC: 'Three times', optionD: 'Five times', correctOption: 'C', explanation: 'Standard radio procedure: "Mayday, Mayday, Mayday."' },
  { topic: 'General Aviation Knowledge', question: 'A "PAN-PAN" radio call indicates:', optionA: 'Distress', optionB: 'Urgency, not immediate danger', optionC: 'All clear', optionD: 'Routine traffic', correctOption: 'B', explanation: 'PAN-PAN signals urgency below the severity of Mayday.' },
  { topic: 'General Aviation Knowledge', question: 'When two aircraft converge at the same altitude, right of way generally goes to the aircraft on the:', optionA: 'Left', optionB: 'Right', optionC: 'Above', optionD: 'Below', correctOption: 'B', explanation: 'Standard rule of the air: yield to traffic on your right.' },
  { topic: 'General Aviation Knowledge', question: 'DGCA stands for:', optionA: 'Directorate General of Civil Aviation', optionB: 'Department of Government Civil Airlines', optionC: 'Defense General Civil Aviation', optionD: 'Domestic General Civil Authority', correctOption: 'A', explanation: 'DGCA is India\'s civil aviation regulatory body.' },
  { topic: 'General Aviation Knowledge', question: 'A Class 1 Medical Certificate in India is mandatory for:', optionA: 'Private Pilot License holders only', optionB: 'Commercial Pilot License holders', optionC: 'Cabin crew only', optionD: 'Air Traffic Controllers only', correctOption: 'B', explanation: 'CPL holders require the stricter Class 1 medical; PPL needs only Class 2.' },
  { topic: 'Air Regulations', question: 'Under DGCA rules, who is responsible for ensuring an aircraft is airworthy before flight?', optionA: 'Air Traffic Control', optionB: 'The Pilot-in-Command', optionC: 'The airline\'s marketing department', optionD: 'The passengers', correctOption: 'B', explanation: 'The Pilot-in-Command holds final responsibility for confirming airworthiness before flight.' },
  { topic: 'Air Regulations', question: 'A Notice to Airmen is commonly abbreviated as:', optionA: 'NOTAM', optionB: 'ATIS', optionC: 'METAR', optionD: 'TAF', correctOption: 'A', explanation: 'NOTAM (Notice to Airmen) communicates time-critical information about hazards or changes to flight operations.' },
  { topic: 'Air Regulations', question: 'VFR stands for:', optionA: 'Visual Flight Rules', optionB: 'Vertical Flight Range', optionC: 'Variable Frequency Radio', optionD: 'Verified Flight Record', correctOption: 'A', explanation: 'VFR (Visual Flight Rules) governs flying primarily by visual reference outside the aircraft.' },
  { topic: 'Air Regulations', question: 'IFR stands for:', optionA: 'Internal Flight Regulation', optionB: 'Instrument Flight Rules', optionC: 'International Flight Route', optionD: 'Inflight Refueling', correctOption: 'B', explanation: 'IFR (Instrument Flight Rules) governs flying primarily by reference to cockpit instruments, often in poor visibility.' },
  { topic: 'Air Regulations', question: 'A pilot\'s logbook is primarily used to record:', optionA: 'Passenger complaints', optionB: 'Flight hours and experience', optionC: 'Airline ticket prices', optionD: 'Airport restaurant reviews', correctOption: 'B', explanation: 'Logbooks officially document flight hours, which are required for license upgrades and currency.' },
  { topic: 'Air Regulations', question: 'ATC stands for:', optionA: 'Aircraft Technical Control', optionB: 'Air Traffic Control', optionC: 'Automated Terminal Computer', optionD: 'Airline Ticketing Center', correctOption: 'B', explanation: 'Air Traffic Control manages and separates aircraft in controlled airspace.' },
  { topic: 'Air Navigation', question: 'A nautical mile is approximately equal to:', optionA: '1.15 statute miles', optionB: '1.60 statute miles', optionC: '0.85 statute miles', optionD: '2.0 statute miles', correctOption: 'A', explanation: 'One nautical mile equals approximately 1.15 statute (regular) miles, or 1.852 kilometers.' },
  { topic: 'Air Navigation', question: 'In aviation, altitude is most commonly measured in:', optionA: 'Meters', optionB: 'Feet', optionC: 'Kilometers', optionD: 'Miles', correctOption: 'B', explanation: 'Feet is the standard unit for altitude in most of the world\'s aviation, including India.' },
  { topic: 'Air Navigation', question: 'Magnetic North differs from True North due to:', optionA: 'Aircraft instrument error', optionB: 'Magnetic variation caused by Earth\'s magnetic field', optionC: 'Pilot calculation error', optionD: 'Daylight saving time', correctOption: 'B', explanation: 'Magnetic variation is a natural difference between true geographic north and magnetic north, varying by location.' },
  { topic: 'Air Navigation', question: 'A VOR is a type of:', optionA: 'Weather radar', optionB: 'Ground-based radio navigation aid', optionC: 'Fuel gauge', optionD: 'Landing gear sensor', correctOption: 'B', explanation: 'VOR (VHF Omnidirectional Range) is a ground-based radio navigation system pilots use to determine position and direction.' },
  { topic: 'Air Navigation', question: 'Wind correction angle is applied during flight planning to account for:', optionA: 'Engine temperature', optionB: 'Wind drift affecting the aircraft\'s actual path', optionC: 'Fuel consumption rate', optionD: 'Cabin pressure', correctOption: 'B', explanation: 'Wind correction angle compensates for crosswind drift to keep the aircraft on its intended track.' },
  { topic: 'Air Navigation', question: 'The acronym METAR refers to:', optionA: 'A type of aircraft engine', optionB: 'A routine surface weather observation report', optionC: 'A navigation chart', optionD: 'A pilot certification level', correctOption: 'B', explanation: 'METAR is a standardized format for reporting current weather conditions at an airport.' },
];

await prisma.roadmapStep.createMany({ data: [...ndaSteps, ...civilianSteps] });
await prisma.flyingSchool.createMany({ data: flyingSchools });
await prisma.quizQuestion.createMany({ data: quizQuestions });

console.log('Seed complete:', ndaSteps.length + civilianSteps.length, 'steps,', flyingSchools.length, 'schools,', quizQuestions.length, 'questions');
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());