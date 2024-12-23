// pages/api/campaigns/[id].ts
import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../lib/prismaClient"; // Prisma Client
import { v4 as uuidv4 } from "uuid"; // สำหรับการสร้าง UUID

// Handler สำหรับการลบแคมเปญ
async function deleteCampaign(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (req.method !== "DELETE") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    // ลบ Tickets ที่เกี่ยวข้องกับแคมเปญ
    await prisma.ticket.deleteMany({
      where: { campaign_id: parseInt(id as string) },
    });

    // ลบแคมเปญ
    const deletedCampaign = await prisma.campaign.delete({
      where: { campaign_id: parseInt(id as string) },
    });

    return res.status(200).json({
      message: "Campaign deleted successfully",
      campaign: deletedCampaign,
    });
  } catch (error) {
    console.error("Error deleting campaign:", error);
    return res.status(500).json({ message: "Error deleting campaign" });
  }
}

async function updateCampaign(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (req.method !== "PATCH") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const {
    campaign_name,
    campaign_start_date,
    campaign_end_date,
    daily_limit,
    campaign_type,
    tier_requirement,
    ticket_count, // เพิ่ม ticket_count
  } = req.body;

  try {
    // ตรวจสอบว่า daily_limit ไม่เกิน ticket_count
    if (daily_limit > ticket_count) {
      return res.status(400).json({
        message: "daily_limit must be less than or equal to ticket_count",
      });
    }

    // ตรวจสอบจำนวนตั๋วที่มีอยู่ในแคมเปญ
    const existingTickets = await prisma.ticket.findMany({
      where: { campaign_id: parseInt(id as string), status: "AVAILABLE" },
    });

    const existingTicketCount = existingTickets.length;

    // ถ้าจำนวน ticket_count น้อยกว่าที่มีอยู่ ให้ลบออก
    if (ticket_count < existingTicketCount) {
      const ticketsToDelete = existingTickets.slice(ticket_count); // เก็บตั๋วที่เกิน
      const ticketIdsToDelete = ticketsToDelete.map(
        (ticket) => ticket.ticket_id
      );

      await prisma.ticket.deleteMany({
        where: {
          ticket_id: { in: ticketIdsToDelete },
        },
      });
    }

    // ถ้าจำนวน ticket_count มากกว่าที่มีอยู่ ให้เพิ่มตั๋วใหม่
    if (ticket_count > existingTicketCount) {
      const ticketsToCreate = ticket_count - existingTicketCount; // คำนวณจำนวนตั๋วที่ต้องการสร้างเพิ่ม

      for (let i = 0; i < ticketsToCreate; i++) {
        const ticketCode = `TICKET-${id}-${uuidv4()}`; // สร้าง ticket_code ด้วย UUID
        await prisma.ticket.create({
          data: {
            ticket_code: ticketCode,
            campaign_id: parseInt(id as string),
            status: "AVAILABLE", // กำหนดสถานะเป็น AVAILABLE
          },
        });
      }
    }

    // อัปเดตแคมเปญ
    const updatedCampaign = await prisma.campaign.update({
      where: { campaign_id: parseInt(id as string) },
      data: {
        campaign_name,
        campaign_start_date: new Date(campaign_start_date),
        campaign_end_date: new Date(campaign_end_date),
        daily_limit,
        campaign_type,
        tier_requirement,
      },
    });

    // คำนวณจำนวนตั๋วที่มีสถานะเป็น AVAILABLE
    const availableTicketCount = await prisma.ticket.count({
      where: {
        campaign_id: parseInt(id as string),
        status: "AVAILABLE",
      },
    });

    return res.status(200).json({
      message: "Campaign updated successfully",
      campaign: updatedCampaign,
      ticket_count: availableTicketCount, // ส่งจำนวนตั๋วที่มีสถานะเป็น AVAILABLE
    });
  } catch (error) {
    console.error("Error updating campaign:", error);
    return res.status(500).json({ message: "Error updating campaign" });
  }
}

// เลือก handler ตาม HTTP method
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "DELETE") {
    return deleteCampaign(req, res);
  }

  if (req.method === "PATCH") {
    return updateCampaign(req, res);
  }

  return res.status(405).json({ message: "Method Not Allowed" });
}
