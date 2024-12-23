import { prisma } from "../lib/prismaClient";


export async function getCampaigns() {
  return prisma.campaign.findMany()
}

export async function getCampaign(id: string) {
  return prisma.campaign.findUnique({
    where: { campaign_id: parseInt(id) },
  })
}

export async function getTickets(campaignId: string) {
  return prisma.ticket.findMany({
    where: { campaign_id: parseInt(campaignId) },
  })
}

