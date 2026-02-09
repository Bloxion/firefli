import type { NextApiRequest, NextApiResponse } from "next"
import prisma from "@/utils/database"
import { withPublicApiRateLimit } from "@/utils/prtl"
import { validateApiKey } from "@/utils/api-auth"

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") return res.status(405).json({ success: false, error: "Method not allowed" })

  const apiKey = req.headers.authorization?.replace("Bearer ", "")
  if (!apiKey) return res.status(401).json({ success: false, error: "Missing API key" })

  const workspaceId = Number.parseInt(req.query.id as string)
  if (!workspaceId) return res.status(400).json({ success: false, error: "Missing workspace ID" })

  try {
    const key = await validateApiKey(apiKey, workspaceId)
    if (!key) {
      return res.status(401).json({ success: false, error: "Invalid or expired API key" })
    }

    // Fetch members
    const members = await prisma.user.findMany({
      where: {
        roles: {
          some: {
            workspaceGroupId: workspaceId,
          },
        },
      },
      select: {
        userid: true,
        username: true,
        picture: true,
        roles: {
          where: {
            workspaceGroupId: workspaceId,
          },
          select: {
            id: true,
            name: true,
            permissions: true,
          },
        },
      },
    })

    const formattedMembers = members.map((member) => ({
      userId: Number(member.userid),
      username: member.username,
      thumbnail: member.picture,
      role: member.roles[0],
    }))

    return res.status(200).json({
      success: true,
      members: formattedMembers,
      total: formattedMembers.length,
    })
  } catch (error) {
    console.error("Error in public API:", error)
    return res.status(500).json({ success: false, error: "Internal server error" })
  }
}

export default withPublicApiRateLimit(handler)
