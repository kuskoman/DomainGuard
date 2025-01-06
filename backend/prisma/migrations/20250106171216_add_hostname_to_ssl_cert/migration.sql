/*
  Warnings:

  - Added the required column `hostname` to the `ssl_certificates` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ssl_certificates" ADD COLUMN     "hostname" TEXT NOT NULL;
