"use client";
import Link from "next/link";
import { getCampaigns } from "@/lib/api";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function CampaignsPage() {
  const [data, setData] = useState();
  const router = useRouter();

  useEffect(() => {
    const fetchCampaign = async () => {
      const campaign = await getCampaigns();
      setData(campaign);
    };
    fetchCampaign();
  }, []);

  // ฟังก์ชันจัดการการลบแคมเปญ
  const handleDeleteClick = async (campaignId: number) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this campaign?"
    );

    if (confirmed) {
      try {
        const response = await fetch(`/api/campaigns/${campaignId}`, {
          method: "DELETE",
        });

        const data = await response.json();

        if (response.ok) {
          // ลบแคมเปญออกจาก state data โดยไม่ต้องรีเฟรชหน้า
          setData((prevData: any) =>
            prevData.filter(
              (campaign: any) => campaign.campaign_id !== campaignId
            )
          );
        } else {
          alert(data.message || "Failed to delete campaign.");
        }
      } catch (error) {
        alert("Error deleting campaign: " + error.message);
      }
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900">Campaigns</h1>
      <div className="mt-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900">All Campaigns</h2>

          <div
            onClick={() => router.push("campaigns/create")}
            className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700"
          >
            Create Campaign
          </div>
        </div>
        <div className="mt-4 flex flex-col">
          <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
              <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Name
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Start Date
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        End Date
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Type
                      </th>
                      <th scope="col" className="relative px-6 py-3">
                        <span className="sr-only">View</span>
                      </th>
                      <th scope="col" className="relative px-6 py-3">
                        <span className="sr-only">Edit</span>
                      </th>
                      <th scope="col" className="relative px-6 py-3">
                        <span className="sr-only">Delete</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {data?.map((campaign) => (
                      <tr key={campaign.campaign_id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {campaign.campaign_name}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {new Date(
                              campaign.campaign_start_date
                            ).toLocaleDateString()}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {new Date(
                              campaign.campaign_end_date
                            ).toLocaleDateString()}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {campaign.campaign_type}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <Link
                            href={`/campaigns/${campaign.campaign_id}`}
                            className="text-indigo-600 hover:text-indigo-900"
                          >
                            View
                          </Link>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <Link
                            href={`/campaigns/edit/${campaign.campaign_id}`}
                            className="text-indigo-600 hover:text-indigo-900"
                          >
                            Edit
                          </Link>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() =>
                              handleDeleteClick(campaign.campaign_id)
                            }
                            className="text-red-600 hover:text-red-900"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
