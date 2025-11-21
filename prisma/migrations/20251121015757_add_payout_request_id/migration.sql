/*
  Warnings:

  - A unique constraint covering the columns `[muralPayPayoutRequestId]` on the table `Order` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "muralPayPayoutRequestId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Order_muralPayPayoutRequestId_key" ON "Order"("muralPayPayoutRequestId");
