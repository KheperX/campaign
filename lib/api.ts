"use server";
import { prisma } from "../lib/prismaClient";

export async function getCampaigns() {
  return prisma.campaign.findMany();
}

export async function getCampaign(id: string) {
  const campaign = await prisma.campaign.findUnique({
    where: { campaign_id: parseInt(id) },
  });

  if (!campaign) {
    throw new Error("Campaign not found");
  }

  // Get total available tickets count
  const availableTickets = await prisma.ticket.count({
    where: {
      campaign_id: parseInt(id),
      status: "AVAILABLE",
    },
  });

  return {
    ...campaign,
    ticket_count: availableTickets,
  };
}

export async function getTickets(campaignId: string) {
  return prisma.ticket.findMany({
    where: { campaign_id: parseInt(campaignId) },
  });
}
