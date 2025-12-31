/*
  Warnings:

  - Added the required column `caption_areas` to the `templates` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "templates" ADD COLUMN     "caption_areas" JSONB NOT NULL;
