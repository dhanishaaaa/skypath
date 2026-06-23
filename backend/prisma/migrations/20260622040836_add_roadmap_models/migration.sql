-- CreateEnum
CREATE TYPE "Route" AS ENUM ('NDA', 'CIVILIAN', 'UNDECIDED');

-- CreateEnum
CREATE TYPE "Stage" AS ENUM ('TENTH', 'TWELFTH', 'AFTER_TWELFTH', 'AFTER_GRADUATION');

-- CreateTable
CREATE TABLE "Profile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "currentStage" "Stage" NOT NULL,
    "chosenRoute" "Route" NOT NULL DEFAULT 'UNDECIDED',
    "budgetLakhs" INTEGER,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Profile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RoadmapStep" (
    "id" TEXT NOT NULL,
    "route" "Route" NOT NULL,
    "stepOrder" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "estCostLakhs" DOUBLE PRECISION,
    "estDuration" TEXT,

    CONSTRAINT "RoadmapStep_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Progress" (
    "id" TEXT NOT NULL,
    "profileId" TEXT NOT NULL,
    "stepId" TEXT NOT NULL,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "completedAt" TIMESTAMP(3),

    CONSTRAINT "Progress_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Profile_userId_key" ON "Profile"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Progress_profileId_stepId_key" ON "Progress"("profileId", "stepId");

-- AddForeignKey
ALTER TABLE "Profile" ADD CONSTRAINT "Profile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Progress" ADD CONSTRAINT "Progress_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Progress" ADD CONSTRAINT "Progress_stepId_fkey" FOREIGN KEY ("stepId") REFERENCES "RoadmapStep"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
