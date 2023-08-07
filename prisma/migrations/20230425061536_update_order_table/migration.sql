/*
  Warnings:

  - You are about to drop the column `note` on the `AnonymUser` table. All the data in the column will be lost.
  - You are about to drop the column `orderId` on the `Feature` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Order` table. All the data in the column will be lost.
  - Added the required column `message` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Feature" DROP CONSTRAINT "Feature_orderId_fkey";

-- AlterTable
ALTER TABLE "AnonymUser" DROP COLUMN "note",
ADD COLUMN     "companyName" TEXT,
ALTER COLUMN "phone" DROP NOT NULL,
ALTER COLUMN "country" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Feature" DROP COLUMN "orderId";

-- AlterTable
ALTER TABLE "Order" DROP COLUMN "description",
DROP COLUMN "name",
ADD COLUMN     "message" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "_FeatureToOrder" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_FeatureToOrder_AB_unique" ON "_FeatureToOrder"("A", "B");

-- CreateIndex
CREATE INDEX "_FeatureToOrder_B_index" ON "_FeatureToOrder"("B");

-- AddForeignKey
ALTER TABLE "_FeatureToOrder" ADD CONSTRAINT "_FeatureToOrder_A_fkey" FOREIGN KEY ("A") REFERENCES "Feature"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FeatureToOrder" ADD CONSTRAINT "_FeatureToOrder_B_fkey" FOREIGN KEY ("B") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;
