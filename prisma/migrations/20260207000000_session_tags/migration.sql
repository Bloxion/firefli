-- CreateTable
CREATE TABLE "SessionTag" (
    "id" UUID NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "color" VARCHAR(100) NOT NULL,
    "workspaceGroupId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SessionTag_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SessionTag_id_key" ON "SessionTag"("id");

-- CreateIndex
CREATE INDEX "SessionTag_workspaceGroupId_idx" ON "SessionTag"("workspaceGroupId");

-- AlterTable
ALTER TABLE "Session" ADD COLUMN "sessionTagId" UUID;

-- AddForeignKey
ALTER TABLE "SessionTag" ADD CONSTRAINT "SessionTag_workspaceGroupId_fkey" FOREIGN KEY ("workspaceGroupId") REFERENCES "workspace"("groupId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_sessionTagId_fkey" FOREIGN KEY ("sessionTagId") REFERENCES "SessionTag"("id") ON DELETE SET NULL ON UPDATE CASCADE;
