/*
  Warnings:

  - You are about to alter the column `refreshToken` on the `Token` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(250)`.
  - You are about to alter the column `expiresIn` on the `Token` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(64)`.

*/
-- AlterTable
ALTER TABLE "com"."Token" ALTER COLUMN "refreshToken" SET DATA TYPE VARCHAR(250),
ALTER COLUMN "expiresIn" SET DATA TYPE VARCHAR(64);
