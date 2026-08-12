-- DropForeignKey
ALTER TABLE "drivers" DROP CONSTRAINT "drivers_schoolUserId_fkey";

-- AlterTable
ALTER TABLE "drivers" ADD COLUMN     "fullName" TEXT,
ALTER COLUMN "schoolUserId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "drivers" ADD CONSTRAINT "drivers_schoolUserId_fkey" FOREIGN KEY ("schoolUserId") REFERENCES "school_users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
