-- AlterTable
ALTER TABLE "domains" ADD COLUMN     "last_notified_at" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "ssl_certificates" ADD COLUMN     "last_notified_at" TIMESTAMP(3);
