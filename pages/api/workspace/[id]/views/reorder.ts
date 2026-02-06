import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/utils/database";
import { withSessionRoute } from "@/lib/withSession";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res
      .status(405)
      .json({ success: false, error: "Method not allowed" });
  }
  const workspaceId = Number(req.query.id as string);
  if (!workspaceId)
    return res
      .status(400)
      .json({ success: false, error: "Missing workspace ID" });
  if (!req.session?.userid)
    return res.status(401).json({ success: false, error: "Unauthorized" });
  try {
    const userId = BigInt(req.session.userid);
    const user = await prisma.user.findFirst({
      where: { userid: userId },
      include: {
        roles: { where: { workspaceGroupId: workspaceId } },
        workspaceMemberships: { where: { workspaceGroupId: workspaceId } },
      },
    });
    if (!user || !user.roles.length) {
      return res.status(401).json({ success: false, error: "Unauthorized" });
    }
    const membership = user.workspaceMemberships[0];
    const isAdmin = membership?.isAdmin || false;
    const hasEditPermission =
      isAdmin || user.roles[0].permissions.includes("edit_views");
    const { viewIds } = req.body;
    if (!Array.isArray(viewIds)) {
      return res.status(400).json({ success: false, error: "Invalid viewIds" });
    }
    const views = await prisma.savedView.findMany({
      where: {
        id: { in: viewIds },
        workspaceGroupId: workspaceId,
      },
    });
    const teamViewIds = views.filter((v) => !v.isLocal).map((v) => v.id);
    const localViewIds = views
      .filter((v) => v.isLocal && v.createdBy && v.createdBy === userId)
      .map((v) => v.id);
    if (teamViewIds.length > 0 && !hasEditPermission) {
      return res
        .status(403)
        .json({ success: false, error: "No permission to reorder team views" });
    }

    const updatePromises = viewIds.map((viewId: string, index: number) => {
      const isTeamView = teamViewIds.includes(viewId);
      const isOwnLocalView = localViewIds.includes(viewId);
      if (isTeamView || isOwnLocalView) {
        return prisma.savedView.updateMany({
          where: {
            id: viewId,
            workspaceGroupId: workspaceId,
          },
          data: {
            order: index,
          },
        });
      }
      return Promise.resolve();
    });

    await Promise.all(updatePromises);
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("Error reordering views:", error);
    return res
      .status(500)
      .json({ success: false, error: "Internal server error" });
  }
}

export default withSessionRoute(handler);