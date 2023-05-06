-- AlterTable
ALTER TABLE "domains" ADD COLUMN     "last_checked_at" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "ssl_certificates" ADD COLUMN     "last_checked_at" TIMESTAMP(3);
