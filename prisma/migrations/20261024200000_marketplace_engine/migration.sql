-- CreateEnum
CREATE TYPE "PricingPlan" AS ENUM ('COMMISSION', 'MEMBER');

-- CreateEnum
CREATE TYPE "ProducerOrderStatus" AS ENUM ('PENDING', 'PREPARING', 'READY', 'HANDED_OVER', 'CANCELLED');

-- CreateEnum
CREATE TYPE "PayoutStatus" AS ENUM ('PENDING', 'PAID', 'FAILED');

-- AlterTable
ALTER TABLE "Producer" ADD COLUMN     "payoutCarryOverOre" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "pricingPlan" "PricingPlan" NOT NULL DEFAULT 'COMMISSION',
ADD COLUMN     "stripeAccountId" TEXT;

-- CreateTable
CREATE TABLE "ProducerOrder" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "producerId" TEXT NOT NULL,
    "pricingPlan" "PricingPlan" NOT NULL,
    "grossOre" INTEGER NOT NULL,
    "vatOre" INTEGER NOT NULL,
    "commissionOre" INTEGER NOT NULL,
    "commissionVatOre" INTEGER NOT NULL,
    "payoutOre" INTEGER NOT NULL,
    "status" "ProducerOrderStatus" NOT NULL DEFAULT 'PENDING',
    "payoutId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProducerOrder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Payout" (
    "id" TEXT NOT NULL,
    "producerId" TEXT NOT NULL,
    "periodStart" TIMESTAMP(3) NOT NULL,
    "periodEnd" TIMESTAMP(3) NOT NULL,
    "grossOre" INTEGER NOT NULL,
    "commissionOre" INTEGER NOT NULL,
    "commissionVatOre" INTEGER NOT NULL,
    "monthlyFeeOre" INTEGER NOT NULL,
    "monthlyFeeVatOre" INTEGER NOT NULL,
    "netOre" INTEGER NOT NULL,
    "carryOverOre" INTEGER NOT NULL,
    "status" "PayoutStatus" NOT NULL DEFAULT 'PENDING',
    "stripeTransferId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Payout_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductDailyStat" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "day" DATE NOT NULL,
    "views" INTEGER NOT NULL DEFAULT 0,
    "purchases" INTEGER NOT NULL DEFAULT 0,
    "unitsSold" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "ProductDailyStat_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ProducerOrder_producerId_status_idx" ON "ProducerOrder"("producerId", "status");

-- CreateIndex
CREATE INDEX "ProducerOrder_payoutId_idx" ON "ProducerOrder"("payoutId");

-- CreateIndex
CREATE UNIQUE INDEX "ProducerOrder_orderId_producerId_key" ON "ProducerOrder"("orderId", "producerId");

-- CreateIndex
CREATE UNIQUE INDEX "Payout_stripeTransferId_key" ON "Payout"("stripeTransferId");

-- CreateIndex
CREATE INDEX "Payout_status_idx" ON "Payout"("status");

-- CreateIndex
CREATE UNIQUE INDEX "Payout_producerId_periodStart_key" ON "Payout"("producerId", "periodStart");

-- CreateIndex
CREATE INDEX "ProductDailyStat_day_idx" ON "ProductDailyStat"("day");

-- CreateIndex
CREATE UNIQUE INDEX "ProductDailyStat_productId_day_key" ON "ProductDailyStat"("productId", "day");

-- CreateIndex
CREATE UNIQUE INDEX "Producer_stripeAccountId_key" ON "Producer"("stripeAccountId");

-- AddForeignKey
ALTER TABLE "ProducerOrder" ADD CONSTRAINT "ProducerOrder_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProducerOrder" ADD CONSTRAINT "ProducerOrder_producerId_fkey" FOREIGN KEY ("producerId") REFERENCES "Producer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProducerOrder" ADD CONSTRAINT "ProducerOrder_payoutId_fkey" FOREIGN KEY ("payoutId") REFERENCES "Payout"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payout" ADD CONSTRAINT "Payout_producerId_fkey" FOREIGN KEY ("producerId") REFERENCES "Producer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductDailyStat" ADD CONSTRAINT "ProductDailyStat_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;


-- Same as 20261024124610_enable_rls: keep Supabase's public Data API out.
ALTER TABLE "ProducerOrder" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Payout" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "ProductDailyStat" ENABLE ROW LEVEL SECURITY;
