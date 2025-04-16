"use client";

import React, { useState, useEffect } from "react";
import Layout from "@/components/dashboard/layouts/Layout";
import CardMain from "@/components/dashboard/layouts/CardMain";
import TitleBreadcrumb from "@/components/dashboard/layouts/TitleBreadcrumb";
import Table from "@/components/dashboard/ui/Table/Table";
import Skeleton from "@/components/dashboard/ui/Skeleton/Skeleton";
import { Therapist } from "@/types/therapist";
import { ChevronLeft, ChevronRight } from "lucide-react";

const ReportPage = () => {
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedBranch, setSelectedBranch] = useState("");
  const [feedbackSummary, setFeedbackSummary] = useState<
    { therapist: Therapist; totalResult: number }[]
  >([]);
  const [branches, setBranches] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [perPage] = useState(10); // Number of items per page

  // Ambil daftar cabang unik dari Therapist
  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const res = await fetch("/api/branch");
        const data = await res.json();
        setBranches(data);
      } catch (error) {
        console.error("Gagal mengambil daftar cabang", error);
      }
    };

    fetchBranches();
  }, []);

  const handleFetchSummary = async () => {
    if (!selectedMonth) return;

    setLoading(true);
    const params = new URLSearchParams({
      month: selectedMonth,
      page: currentPage.toString(),
      perPage: perPage.toString(),
    });
    if (selectedBranch) params.set("branch", selectedBranch);

    try {
      const response = await fetch(
        `/api/feedback/summary?${params.toString()}`
      );
      const data = await response.json();
      setFeedbackSummary(data.items);
      setTotalItems(data.totalItems);
    } catch (error) {
      console.error("Gagal mengambil data summary", error);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { header: "No", accessor: "no" },
    {
      header: "Nama Terapis",
      accessor: "name",
      cell: (row: any) => row.therapist.name,
    },
    {
      header: "Branch/Cabang",
      accessor: "branch",
      cell: (row: any) => row.therapist.branch,
    },
    {
      header: "Total Feedback (Result)",
      accessor: "totalResult",
      cell: (row: any) => row.totalResult,
    },
  ];

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <Layout>
      {loading ? (
        <Skeleton className="h-8 w-48 mb-4" />
      ) : (
        <TitleBreadcrumb
          title="Feedback Summary"
          items={[
            { text: "Therapist", link: "/admin/therapist" },
            { text: "Therapist Report", link: "/admin/therapist/report" },
          ]}
        />
      )}

      <CardMain>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
          <div className="flex items-center gap-2">
            <label className="text-sm">Cabang:</label>
            <select
              value={selectedBranch}
              onChange={(e) => setSelectedBranch(e.target.value)}
              className="px-3 py-2 text-base border text-gray-400 border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            >
              <option value="">Semua</option>
              {branches.map((branch) => (
                <option key={branch} value={branch}>
                  {branch}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-sm">Bulan:</label>
            <input
              type="month"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="px-3 py-1 text-base border text-gray-400 border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleFetchSummary}
              disabled={loading}
              className="rounded bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-opacity-90 transition-all hover:transition-all w-full"
            >
              {loading ? "Loading..." : "Tampilkan Hasil"}
            </button>
          </div>
        </div>

        <div className="mt-4">
          <Table
            data={feedbackSummary}
            columns={columns}
            currentPage={currentPage}
            perPage={perPage}
          />
        </div>

        {/* Pagination Controls */}
        <div className="flex justify-center text-sm">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            // className="px-4 py-2 bg-blue-500 text-white rounded-l"
          >
            <ChevronLeft />
          </button>
          <span className="px-4 py-2">{currentPage}</span>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage * perPage >= totalItems}
            // className="px-4 py-2 bg-blue-500 text-white rounded-r"
          >
            <ChevronRight />
          </button>
        </div>
      </CardMain>
    </Layout>
  );
};

export default ReportPage;
