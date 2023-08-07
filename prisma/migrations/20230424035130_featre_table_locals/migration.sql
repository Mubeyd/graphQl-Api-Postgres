/*
  Warnings:

  - You are about to drop the column `description` on the `Feature` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Feature` table. All the data in the column will be lost.
  - You are about to drop the column `translationsJson` on the `Feature` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Feature_name_key";

-- AlterTable
ALTER TABLE "Feature" DROP COLUMN "description",
DROP COLUMN "name",
DROP COLUMN "translationsJson",
ADD COLUMN     "descriptionTxJson" JSONB,
ADD COLUMN     "imagePath" TEXT,
ADD COLUMN     "nameTxJson" JSONB;
