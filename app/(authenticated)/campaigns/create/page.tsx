"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CreateCampaignPage() {
  const [formData, setFormData] = useState({
    campaign_name: "",
    campaign_start_date: "",
    campaign_end_date: "",
    daily_limit: 0,
    campaign_type: "",
    tier_requirement: "",
    ticket_count: 0,
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]:
        name === "daily_limit" || name === "ticket_count"
          ? Number(value)
          : value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");

    if (formData.daily_limit > formData.ticket_count) {
      setErrorMessage("Daily limit must not exceed ticket count.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/campaigns/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        router.push("/campaigns");
      } else {
        setErrorMessage(
          data.message ||
            `Something went wrong: ${data.error ?? "Unknown error"}`
        );
      }
    } catch (error) {
      if (error instanceof Error) {
        setErrorMessage("Error creating campaign: " + error.message);
      } else {
        setErrorMessage("An unexpected error occurred.");
      }
    }

    setLoading(false);
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900">Create Campaign</h1>
      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        {errorMessage && (
          <div className="bg-red-100 text-red-700 p-3 rounded-md">
            <strong>Error: </strong>
            {errorMessage}
          </div>
        )}

        <div>
          <label
            htmlFor="campaign_name"
            className="block text-sm font-medium text-gray-700"
          >
            Campaign Name
          </label>
          <input
            type="text"
            id="campaign_name"
            name="campaign_name"
            value={formData.campaign_name}
            onChange={handleInputChange}
            className="mt-1 p-2 border border-gray-300 rounded-md w-full"
            required
          />
        </div>

        <div>
          <label
            htmlFor="campaign_start_date"
            className="block text-sm font-medium text-gray-700"
          >
            Start Date
          </label>
          <input
            type="date"
            id="campaign_start_date"
            name="campaign_start_date"
            value={formData.campaign_start_date}
            onChange={handleInputChange}
            className="mt-1 p-2 border border-gray-300 rounded-md w-full"
            required
          />
        </div>

        <div>
          <label
            htmlFor="campaign_end_date"
            className="block text-sm font-medium text-gray-700"
          >
            End Date
          </label>
          <input
            type="date"
            id="campaign_end_date"
            name="campaign_end_date"
            value={formData.campaign_end_date}
            onChange={handleInputChange}
            className="mt-1 p-2 border border-gray-300 rounded-md w-full"
            required
          />
        </div>

        <div>
          <label
            htmlFor="daily_limit"
            className="block text-sm font-medium text-gray-700"
          >
            Daily Limit
          </label>
          <input
            type="number"
            id="daily_limit"
            name="daily_limit"
            value={formData.daily_limit}
            onChange={handleInputChange}
            className="mt-1 p-2 border border-gray-300 rounded-md w-full"
            required
          />
        </div>

        <div>
          <label
            htmlFor="campaign_type"
            className="block text-sm font-medium text-gray-700"
          >
            Campaign Type
          </label>
          <select
            id="campaign_type"
            name="campaign_type"
            value={formData.campaign_type}
            onChange={handleInputChange}
            className="mt-1 p-2 border border-gray-300 rounded-md w-full"
            required
          >
            <option value="">Select Campaign Type</option>
            <option value="Reward">Reward</option>
            <option value="Privilege">Privilege</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="tier_requirement"
            className="block text-sm font-medium text-gray-700"
          >
            Tier Requirement
          </label>
          <select
            id="tier_requirement"
            name="tier_requirement"
            value={formData.tier_requirement}
            onChange={handleInputChange}
            className="mt-1 p-2 border border-gray-300 rounded-md w-full"
          >
            <option value="">Select Tier</option>
            <option value="Silver">Silver</option>
            <option value="Gold">Gold</option>
            <option value="Platinum">Platinum</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="ticket_count"
            className="block text-sm font-medium text-gray-700"
          >
            Ticket Count
          </label>
          <input
            type="number"
            id="ticket_count"
            name="ticket_count"
            value={formData.ticket_count}
            onChange={handleInputChange}
            className="mt-1 p-2 border border-gray-300 rounded-md w-full"
            required
          />
        </div>

        <div>
          <button
            type="submit"
            className={`w-full py-2 px-4 rounded-md ${
              loading ? "bg-gray-400" : "bg-indigo-600"
            } text-white text-sm font-medium`}
            disabled={loading}
          >
            {loading ? "Creating..." : "Create Campaign"}
          </button>
        </div>
      </form>
    </div>
  );
}
