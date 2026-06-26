-- CreateTable
CREATE TABLE "FlyingSchool" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "ownership" TEXT NOT NULL,
    "feeMinLakhs" DOUBLE PRECISION NOT NULL,
    "feeMaxLakhs" DOUBLE PRECISION NOT NULL,
    "fleetType" TEXT NOT NULL,
    "website" TEXT,

    CONSTRAINT "FlyingSchool_pkey" PRIMARY KEY ("id")
);
