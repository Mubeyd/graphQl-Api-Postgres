/*
  Warnings:

  - You are about to drop the `Language` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Translation` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Translation" DROP CONSTRAINT "Translation_langCode_fkey";

-- DropTable
DROP TABLE "Language";

-- DropTable
DROP TABLE "Translation";

-- DropEnum
DROP TYPE "TranslationModelType";
