"use client";

import { useEffect, useState } from "react";
import { RevenueData, InventoryData } from "@/types";
import RevenueReport from "@/components/reports/RevenueReport";
import InventoryReport from "@/components/reports/InventoryReport";
import { fetchRevenueData, fetchInventoryData } from "@/app/api/reports";

interface ReportPageProps {
  revenueData?: RevenueData[];
  inventoryData?: InventoryData[];
  error?: string;
}

export default function ReportPage({
  revenueData: initialRevenueData,
  inventoryData: initialInventoryData,
  error: initialError,
}: ReportPageProps) {
  const [revenueData, setRevenueData] = useState<RevenueData[]>(initialRevenueData || []);
  const [inventoryData, setInventoryData] = useState<InventoryData[]>(initialInventoryData || []);
  const [error, setError] = useState<string | undefined>(initialError);
  const [loading, setLoading] = useState(!initialRevenueData || !initialInventoryData);

  useEffect(() => {
    // Auth check is now handled by the admin layout
    if (!initialRevenueData || !initialInventoryData) {
      fetchData();
    }
  }, [initialRevenueData, initialInventoryData]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [revenueResult, inventoryResult] = await Promise.all([
        fetchRevenueData(),
        fetchInventoryData()
      ]);
      
      setRevenueData(revenueResult);
      setInventoryData(inventoryResult);
      setError(undefined);
    } catch (err) {
      console.error("Error fetching reports:", err);
      setError("Failed to load reports data");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

      {loading && (
        <div className="text-center py-12">
          <p className="text-gray-500">Loading reports data...</p>
        </div>
      )}

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900 text-red-800 dark:text-red-200 rounded-md p-4 mb-6">
          <p>{error}</p>
        </div>
      )}

      {!loading && !error && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <RevenueReport data={revenueData} />
          <InventoryReport data={inventoryData} />
        </div>
      )}
    </div>
  );
}
