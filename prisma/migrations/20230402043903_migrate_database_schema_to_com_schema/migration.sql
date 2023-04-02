/*
  Warnings:

  - You are about to drop the `Token` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "bin";

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "com";

-- DropForeignKey
ALTER TABLE "public"."Token" DROP CONSTRAINT "Token_userId_fkey";

-- DropTable
DROP TABLE "public"."Token";

-- DropTable
DROP TABLE "public"."User";

-- CreateTable
CREATE TABLE "com"."User" (
    "id" SERIAL NOT NULL,
    "email" VARCHAR(250) NOT NULL,
    "firstName" VARCHAR(30) NOT NULL,
    "lastName" VARCHAR(30) NOT NULL,
    "password" VARCHAR(250) NOT NULL,
    "isAdmin" BOOLEAN DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "com"."Token" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "refreshToken" TEXT NOT NULL,
    "expiresIn" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Token_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "com"."User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Token_userId_key" ON "com"."Token"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Token_refreshToken_key" ON "com"."Token"("refreshToken");

-- AddForeignKey
ALTER TABLE "com"."Token" ADD CONSTRAINT "Token_userId_fkey" FOREIGN KEY ("userId") REFERENCES "com"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
