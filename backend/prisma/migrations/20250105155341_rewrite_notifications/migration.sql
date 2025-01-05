/*
  Warnings:

  - The values [PENDING,SENT,FAILED] on the enum `notification_statuses` will be removed. If these variants are still used in the database, this will fail.
  - The values [DOMAIN_EXPIRATION,SSL_EXPIRATION] on the enum `notification_types` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `type` on the `notifications` table. All the data in the column will be lost.
  - Added the required column `topic` to the `notifications` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "notification_statuses_new" AS ENUM ('unread', 'read');
ALTER TABLE "notifications" ALTER COLUMN "status" TYPE "notification_statuses_new" USING ("status"::text::"notification_statuses_new");
ALTER TYPE "notification_statuses" RENAME TO "notification_statuses_old";
ALTER TYPE "notification_statuses_new" RENAME TO "notification_statuses";
DROP TYPE "notification_statuses_old";
COMMIT;

-- AlterTable
ALTER TABLE "notifications" DROP COLUMN "type",
ADD COLUMN     "topic" "notification_types" NOT NULL,
ALTER COLUMN "status" SET DEFAULT 'unread';


-- AlterEnum
BEGIN;
CREATE TYPE "notification_types_new" AS ENUM ('domain_expiration', 'ssl_expiration');
ALTER TABLE "notifications" ALTER COLUMN "topic" TYPE "notification_types_new" USING ("topic"::text::"notification_types_new");
ALTER TYPE "notification_types" RENAME TO "notification_types_old";
ALTER TYPE "notification_types_new" RENAME TO "notification_types";
DROP TYPE "notification_types_old";
COMMIT;

