/*
  Warnings:

  - Added the required column `role` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `subscription` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Subscription" AS ENUM ('FREE', 'PRO', 'BYOK');

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "role" TEXT NOT NULL,
ADD COLUMN     "subscription" "Subscription" NOT NULL;
