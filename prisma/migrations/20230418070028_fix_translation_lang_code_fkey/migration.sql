-- DropForeignKey
ALTER TABLE "Translation" DROP CONSTRAINT "Translation_langCode_fkey";

-- AddForeignKey
ALTER TABLE "Translation" ADD CONSTRAINT "Translation_langCode_fkey" FOREIGN KEY ("langCode") REFERENCES "Language"("langCode") ON DELETE RESTRICT ON UPDATE CASCADE;
