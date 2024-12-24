import { getCampaign, getTickets } from "@/lib/api";

export default async function CampaignDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const campaign = await getCampaign(params.id);
  const tickets = await getTickets(params.id);
  if (!campaign) {
    return <div>Campaign not found.</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900">
        {campaign.campaign_name}
      </h1>
      <div className="mt-4">
        <h2 className="text-xl font-semibold text-gray-900">
          Campaign Details
        </h2>
        <div className="mt-2 grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium text-gray-500">Start Date</p>
            <p className="mt-1 text-sm text-gray-900">
              {new Date(campaign.campaign_start_date).toLocaleDateString()}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">End Date</p>
            <p className="mt-1 text-sm text-gray-900">
              {new Date(campaign.campaign_end_date).toLocaleDateString()}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Type</p>
            <p className="mt-1 text-sm text-gray-900">
              {campaign.campaign_type}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Daily Limit</p>
            <p className="mt-1 text-sm text-gray-900">{campaign.daily_limit}</p>
          </div>
        </div>
      </div>
      <div className="mt-8">
        <h2 className="text-xl font-semibold text-gray-900">Tickets</h2>
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
                        Ticket Code
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Status
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Created At
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Used At
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {tickets.map((ticket) => (
                      <tr key={ticket.ticket_id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {ticket.ticket_code}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {ticket.status}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {new Date(ticket.createdAt).toLocaleString()}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {ticket.usedAt
                              ? new Date(ticket.usedAt).toLocaleString()
                              : "-"}
                          </div>
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
