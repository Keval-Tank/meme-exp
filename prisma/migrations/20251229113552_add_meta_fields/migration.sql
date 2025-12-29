/*
  Warnings:

  - Added the required column `description` to the `templates` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tone` to the `templates` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "templates" ADD COLUMN     "description" TEXT NOT NULL,
ADD COLUMN     "keywords" TEXT[],
ADD COLUMN     "tone" TEXT NOT NULL,
ADD COLUMN     "topics" TEXT[];
