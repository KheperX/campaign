import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../lib/prismaClient";
import { v4 as uuidv4 } from "uuid";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const {
    campaign_name,
    campaign_start_date,
    campaign_end_date,
    daily_limit,
    campaign_type,
    tier_requirement,
    ticket_count,
  } = req.body;

  // ตรวจสอบเงื่อนไขว่าจำนวน daily_limit ต้องน้อยกว่าหรือเท่ากับจำนวน ticket_count
  if (daily_limit > ticket_count) {
    return res.status(400).json({
      message: "daily_limit must be less than or equal to ticket_count",
    });
  }

  if (
    !campaign_name ||
    !campaign_start_date ||
    !campaign_end_date ||
    !daily_limit ||
    !campaign_type ||
    !ticket_count
  ) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    // Create Campaign
    const newCampaign = await prisma.campaign.create({
      data: {
        campaign_name,
        campaign_start_date: new Date(campaign_start_date),
        campaign_end_date: new Date(campaign_end_date),
        daily_limit,
        campaign_type,
        tier_requirement,
      },
    });

    // Create Tickets based on the ticket_count
    const tickets = []; // Array to store the created tickets
    for (let i = 0; i < ticket_count; i++) {
      const ticketCode = `TICKET-${newCampaign.campaign_id}-${uuidv4()}`; // สร้าง ticket_code ด้วย UUID
      const ticket = await prisma.ticket.create({
        data: {
          ticket_code: ticketCode,
          campaign_id: newCampaign.campaign_id,
        },
      });
      tickets.push(ticket);
    }

    // Respond with campaign and tickets details
    return res.status(201).json({
      message: "Campaign created successfully",
      campaign: newCampaign,
      tickets: tickets, // Send the created tickets as part of the response
    });
  } catch (error) {
    console.error("Error creating campaign:", error);
    return res.status(500).json({ message: "Error creating campaign" });
  }
}
