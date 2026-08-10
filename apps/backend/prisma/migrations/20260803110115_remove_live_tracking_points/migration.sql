/*
  Warnings:

  - You are about to drop the `trip_location_points` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "trip_location_points" DROP CONSTRAINT "trip_location_points_tripId_fkey";

-- DropTable
DROP TABLE "trip_location_points";
