-- CreateTable
CREATE TABLE "Person" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "firstname" TEXT NOT NULL,
    "surename" TEXT NOT NULL,
    "degree" TEXT NOT NULL,
    "birthdate" DATETIME NOT NULL,
    "email" TEXT NOT NULL,
    "phone" INTEGER NOT NULL,
    "insuraceNumber" INTEGER NOT NULL,
    "insuranceId" TEXT NOT NULL,
    "addressId" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    CONSTRAINT "Person_insuranceId_fkey" FOREIGN KEY ("insuranceId") REFERENCES "InsuranceCompany" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Person_addressId_fkey" FOREIGN KEY ("addressId") REFERENCES "Address" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "InsuranceCompany" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "number" INTEGER NOT NULL,
    "name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Address" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "country" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "postalCode" INTEGER NOT NULL,
    "street" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Reservation" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "personId" TEXT NOT NULL,
    "doctorId" TEXT NOT NULL,
    "from" DATETIME NOT NULL,
    "personComment" TEXT NOT NULL,
    "doctorComment" TEXT NOT NULL,
    "created" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Reservation_personId_fkey" FOREIGN KEY ("personId") REFERENCES "Person" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Reservation_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "Doctor" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Doctor" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "specialization" TEXT NOT NULL,
    "actuality" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "link" TEXT NOT NULL,
    "profilePicture" TEXT NOT NULL,
    "addressId" TEXT NOT NULL,
    "personId" TEXT NOT NULL,
    CONSTRAINT "Doctor_personId_fkey" FOREIGN KEY ("personId") REFERENCES "Person" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Doctor_addressId_fkey" FOREIGN KEY ("addressId") REFERENCES "Address" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Reference" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "doctorId" TEXT NOT NULL,
    "comment" TEXT NOT NULL,
    "rate" INTEGER NOT NULL,
    "author" TEXT NOT NULL,
    "doctor_comment" TEXT NOT NULL,
    "created" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Reference_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "Doctor" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "DoctorLanguage" (
    "doctorId" TEXT NOT NULL,
    "language" TEXT NOT NULL,
    CONSTRAINT "DoctorLanguage_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "Doctor" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "OpeningHours" (
    "doctorId" TEXT NOT NULL,
    "day" TEXT NOT NULL,
    "fromTime" DATETIME NOT NULL,
    "toTime" DATETIME NOT NULL,
    "fromDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "OpeningHours_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "Doctor" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Person_addressId_key" ON "Person"("addressId");

-- CreateIndex
CREATE UNIQUE INDEX "Doctor_addressId_key" ON "Doctor"("addressId");

-- CreateIndex
CREATE UNIQUE INDEX "Doctor_personId_key" ON "Doctor"("personId");

-- CreateIndex
CREATE UNIQUE INDEX "DoctorLanguage_doctorId_language_key" ON "DoctorLanguage"("doctorId", "language");

-- CreateIndex
CREATE UNIQUE INDEX "OpeningHours_doctorId_day_key" ON "OpeningHours"("doctorId", "day");
