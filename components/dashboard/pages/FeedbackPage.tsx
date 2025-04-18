"use client";

import CardMain from "@/components/dashboard/layouts/CardMain";
import Layout from "@/components/dashboard/layouts/Layout";
import TitleBreadcrumb from "@/components/dashboard/layouts/TitleBreadcrumb";
import Table from "@/components/dashboard/ui/Table/Table";
import React, { useState, useEffect } from "react";
import Pagination from "@/components/dashboard/ui/Pagination/Pagination";
import { useSearchParams } from "next/navigation";
import SearchColumn from "@/components/dashboard/ui/Search/SearchColumn";
import TableSkeleton from "@/components/dashboard/ui/TableSkeleton/TableSkeleton";
import Skeleton from "@/components/dashboard/ui/Skeleton/Skeleton";

interface Feedback {
  id: number;
  therapistId: number;
  customerId: number;
  cleanliness: string;
  politeness: string;
  pressure: string;
  punctuality: string;
  result: string;
  customer: {
    name: string;
  };
  therapist: {
    name: string;
  };
}

const FeedbackPage = () => {
  const [loading, setLoading] = useState(true);
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const searchParams = useSearchParams();
  const page = parseInt(searchParams.get("page") || "1");
  const perPage = parseInt(searchParams.get("per_page") || "10");
  const query = searchParams.get("query") || "";
  const fromDate = searchParams.get("fromDate") || "";
  const toDate = searchParams.get("toDate") || "";

  useEffect(() => {
    async function fetchFeedbacks() {
      setLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        per_page: perPage.toString(),
      });
      if (query) params.set("query", query);
      if (fromDate) params.set("fromDate", fromDate);
      if (toDate) params.set("toDate", toDate);

      const response = await fetch(
        `/api/feedbackCustomer?${params.toString()}`
      );
      const data = await response.json();
      setFeedbacks(data.therapists || []);
      setTotalItems(data.totalItems || 0);
      setLoading(false);
    }

    fetchFeedbacks();
  }, [page, perPage, query, fromDate, toDate]);

  const hasNextPage = page * perPage < totalItems;
  const hasPrevPage = page > 1;

  const getBadgeStyle = (value: string) => {
    switch (value) {
      case "Sangat_Memuaskan":
        return "bg-green-100 text-green-800";
      case "Memuaskan":
        return "bg-blue-100 text-blue-800";
      case "Cukup":
        return "bg-yellow-100 text-yellow-800";
      case "Tidak_Memuaskan":
        return "bg-orange-100 text-orange-800";
      case "Sangat_Tidak_Memuaskan":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const columns = [
    {
      header: "No",
      accessor: "no",
    },
    {
      header: "Terapis",
      accessor: "therapist.name",
      cell: (row: Feedback) => row.therapist?.name || "-",
    },
    {
      header: "Customer",
      accessor: "customer.name",
      cell: (row: Feedback) => row.customer?.name || "-",
    },
    {
      header: "Cleanliness",
      accessor: "cleanliness",
      cell: (row: Feedback) => (
        <span
          className={`inline-block p-2 text-xs rounded-lg ${getBadgeStyle(
            row.cleanliness
          )}`}
        >
          {row.cleanliness.replaceAll("_", " ")}
        </span>
      ),
    },
    {
      header: "Politeness",
      accessor: "politeness",
      cell: (row: Feedback) => (
        <span
          className={`inline-block p-2 text-xs rounded-lg ${getBadgeStyle(
            row.politeness
          )}`}
        >
          {row.politeness.replaceAll("_", " ")}
        </span>
      ),
    },
    {
      header: "Pressure",
      accessor: "pressure",
      cell: (row: Feedback) => (
        <span
          className={`inline-block p-2 text-xs rounded-lg ${getBadgeStyle(
            row.pressure
          )}`}
        >
          {row.pressure.replaceAll("_", " ")}
        </span>
      ),
    },
    {
      header: "Punctuality",
      accessor: "punctuality",
      cell: (row: Feedback) => (
        <span
          className={`inline-block p-2 text-xs rounded-lg ${getBadgeStyle(
            row.punctuality
          )}`}
        >
          {row.punctuality.replaceAll("_", " ")}
        </span>
      ),
    },
    {
      header: "Result",
      accessor: "result",
    },
  ];

  return (
    <Layout>
      {loading ? (
        <Skeleton className="h-8 w-48 mb-4" />
      ) : (
        <TitleBreadcrumb
          title="Feedback Customer Data"
          items={[
            { text: "Feedback Customer", link: "/admin/feedbackCustomer" },
          ]}
        />
      )}

      <CardMain>
        <div className="flex md:items-center md:justify-between flex-col md:flex-row w-full">
          <div className="flex flex-col md:flex-row gap-2 w-full">
            {loading ? (
              <Skeleton className="h-10 w-full md:w-64 mb-2" />
            ) : (
              <>
                <div className="w-full">
                  <SearchColumn />
                </div>
              </>
            )}
          </div>
        </div>

        {loading ? (
          <TableSkeleton />
        ) : (
          <>
            <Table
              data={feedbacks}
              columns={columns}
              currentPage={page}
              perPage={10}
            />

            <div className="mt-3">
              {feedbacks.length > 0 && (
                <div className="mt-4 text-sm font-semibold text-right">
                  Total Result:{" "}
                  {feedbacks.reduce(
                    (acc, item) => acc + parseInt(item.result),
                    0
                  )}
                </div>
              )}
              <Pagination
                hasNextPage={hasNextPage}
                hasPrevPage={hasPrevPage}
                totalItems={totalItems}
              />
            </div>
          </>
        )}
      </CardMain>
    </Layout>
  );
};

export default FeedbackPage;
