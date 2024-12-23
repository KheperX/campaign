import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../lib/prismaClient";

async function getCampaigns(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query; // รับ `id` จาก query parameters

  try {
    if (id) {
      // ดึงข้อมูลแคมเปญเฉพาะ ID ที่ระบุ
      const campaign = await prisma.campaign.findUnique({
        where: { campaign_id: parseInt(id as string) },
      });

      if (!campaign) {
        return res.status(404).json({ message: "Campaign not found" });
      }

      // คำนวณจำนวนตั๋ว AVAILABLE
      const availableTicketCount = await prisma.ticket.count({
        where: {
          campaign_id: campaign.campaign_id,
          status: "AVAILABLE",
        },
      });

      return res.status(200).json({
        message: "Campaign retrieved successfully",
        campaign: { ...campaign, ticket_count: availableTicketCount },
      });
    } else {
      // ดึงข้อมูลแคมเปญทั้งหมด
      const campaigns = await prisma.campaign.findMany();

      // เพิ่ม ticket_count ให้แต่ละแคมเปญ
      const campaignsWithTicketCount = await Promise.all(
        campaigns.map(async (campaign) => {
          const availableTicketCount = await prisma.ticket.count({
            where: {
              campaign_id: campaign.campaign_id,
              status: "AVAILABLE",
            },
          });

          return { ...campaign, ticket_count: availableTicketCount };
        })
      );

      return res.status(200).json({
        message: "Campaigns retrieved successfully",
        campaigns: campaignsWithTicketCount,
      });
    }
  } catch (error) {
    console.error("Error fetching campaigns:", error);
    return res.status(500).json({ message: "Error fetching campaigns" });
  }
}

// API Handler
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    return getCampaigns(req, res);
  }

  return res.status(405).json({ message: "Method Not Allowed" });
}
