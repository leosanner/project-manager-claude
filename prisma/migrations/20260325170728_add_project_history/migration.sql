-- CreateEnum
CREATE TYPE "ProjectHistoryEventType" AS ENUM ('FEATURE_CREATED', 'FEATURE_DELETED', 'FEATURE_CONCLUDED');

-- CreateTable
CREATE TABLE "project_history_event" (
    "id" TEXT NOT NULL,
    "eventType" "ProjectHistoryEventType" NOT NULL,
    "featureTitle" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "projectId" TEXT NOT NULL,

    CONSTRAINT "project_history_event_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "project_history_event" ADD CONSTRAINT "project_history_event_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "project"("id") ON DELETE CASCADE ON UPDATE CASCADE;
