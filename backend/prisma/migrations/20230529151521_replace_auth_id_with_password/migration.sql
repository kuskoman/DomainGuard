/*
  Warnings:

  - You are about to drop the column `auth_id` on the `users` table. All the data in the column will be lost.
  - Added the required column `password_digest` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "users_auth_id_key";

-- AlterTable
ALTER TABLE "users" DROP COLUMN "auth_id",
ADD COLUMN     "password_digest" TEXT NOT NULL;
