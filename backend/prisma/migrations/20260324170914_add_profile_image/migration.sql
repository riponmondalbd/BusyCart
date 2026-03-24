-- AlterTable
ALTER TABLE "User" ADD COLUMN     "imagePublicId" TEXT,
ADD COLUMN     "imageUrl" TEXT,
ALTER COLUMN "name" DROP NOT NULL;
