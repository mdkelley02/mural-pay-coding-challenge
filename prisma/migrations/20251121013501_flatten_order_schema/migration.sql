/*
  Warnings:

  - You are about to drop the column `customerEmail` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `totalAmount` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `price` on the `OrderItem` table. All the data in the column will be lost.
  - You are about to drop the `Payment` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Payout` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[muralPayDepositTxId]` on the table `Order` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[muralPayPayoutId]` on the table `Order` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `totalAmountUsdc` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `priceUsdc` to the `OrderItem` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "OrderItem" DROP CONSTRAINT "OrderItem_orderId_fkey";

-- DropForeignKey
ALTER TABLE "Payment" DROP CONSTRAINT "Payment_orderId_fkey";

-- DropForeignKey
ALTER TABLE "Payout" DROP CONSTRAINT "Payout_orderId_fkey";

-- AlterTable
ALTER TABLE "Order" DROP COLUMN "customerEmail",
DROP COLUMN "totalAmount",
ADD COLUMN     "blockchainTxHash" TEXT,
ADD COLUMN     "muralPayDepositTxId" TEXT,
ADD COLUMN     "muralPayPayoutId" TEXT,
ADD COLUMN     "muralPayTransferId" TEXT,
ADD COLUMN     "payoutAmountUsd" INTEGER,
ADD COLUMN     "payoutStatus" TEXT,
ADD COLUMN     "totalAmountUsdc" BIGINT NOT NULL,
ALTER COLUMN "status" SET DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE "OrderItem" DROP COLUMN "price",
ADD COLUMN     "priceUsdc" BIGINT NOT NULL;

-- DropTable
DROP TABLE "Payment";

-- DropTable
DROP TABLE "Payout";

-- CreateIndex
CREATE UNIQUE INDEX "Order_muralPayDepositTxId_key" ON "Order"("muralPayDepositTxId");

-- CreateIndex
CREATE UNIQUE INDEX "Order_muralPayPayoutId_key" ON "Order"("muralPayPayoutId");

-- AddForeignKey
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;
