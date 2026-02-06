-- AlterTable
ALTER TABLE "SavedView" ADD COLUMN     "createdBy" BIGINT,
ADD COLUMN     "isLocal" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "SavedView" ADD COLUMN     "order" INTEGER NOT NULL DEFAULT 0;

-- CreateIndex
CREATE INDEX "SavedView_createdBy_idx" ON "SavedView"("createdBy");
CREATE INDEX "SavedView_workspaceGroupId_isLocal_order_idx" ON "SavedView"("workspaceGroupId", "isLocal", "order");

-- AddForeignKey
ALTER TABLE "SavedView" ADD CONSTRAINT "SavedView_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "user"("userid") ON DELETE SET NULL ON UPDATE CASCADE;
