-- CreateEnum
CREATE TYPE "LeadStage" AS ENUM ('STARTED', 'PROFILE_DONE', 'SUBMITTED', 'APPROVED', 'DECLINED', 'CLOSED');

-- CreateTable
CREATE TABLE "ProducerLead" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "contactName" TEXT NOT NULL,
    "farmName" TEXT NOT NULL,
    "sells" TEXT NOT NULL,
    "stage" "LeadStage" NOT NULL DEFAULT 'STARTED',
    "stageChangedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "tokenNonce" TEXT NOT NULL,
    "profile" JSONB,
    "firstProduct" JSONB,
    "unsubscribedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProducerLead_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LeadEmail" (
    "id" TEXT NOT NULL,
    "leadId" TEXT NOT NULL,
    "template" TEXT NOT NULL,
    "sentAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LeadEmail_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ProducerLead_email_key" ON "ProducerLead"("email");

-- CreateIndex
CREATE INDEX "ProducerLead_stage_idx" ON "ProducerLead"("stage");

-- CreateIndex
CREATE UNIQUE INDEX "LeadEmail_leadId_template_key" ON "LeadEmail"("leadId", "template");

-- AddForeignKey
ALTER TABLE "LeadEmail" ADD CONSTRAINT "LeadEmail_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "ProducerLead"("id") ON DELETE CASCADE ON UPDATE CASCADE;


-- Same as 20261024124610_enable_rls: keep Supabase's public Data API out.
ALTER TABLE "ProducerLead" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "LeadEmail" ENABLE ROW LEVEL SECURITY;
