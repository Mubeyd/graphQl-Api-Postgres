/*
  Warnings:

  - You are about to drop the column `description` on the `Tag` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Tag` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Tag_name_key";

-- AlterTable
ALTER TABLE "Feature" ADD COLUMN     "translationsJson" JSONB;

-- AlterTable
ALTER TABLE "Tag" DROP COLUMN "description",
DROP COLUMN "name",
ADD COLUMN     "descriptionTxJson" JSONB,
ADD COLUMN     "imagePath" TEXT,
ADD COLUMN     "nameTxJson" JSONB;
