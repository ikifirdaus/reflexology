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
import ButtonIcon from "../ui/Button/ButtonIcon";
import { FilePenLine, PlusCircle, Trash2 } from "lucide-react";
import Button from "../ui/Button/Button";

interface Branch {
  id: number;
  name: string;
  createdAt: string;
}

const BranchPage = () => {
  const [loading, setLoading] = useState(true);
  const [branchs, setBranchs] = useState<Branch[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const searchParams = useSearchParams();

  const page = parseInt(searchParams.get("page") || "1");
  const perPage = parseInt(searchParams.get("per_page") || "10");
  const query = searchParams.get("query") || "";
  const fromDate = searchParams.get("fromDate") || "";
  const toDate = searchParams.get("toDate") || "";

  useEffect(() => {
    async function fetchBranchs() {
      setLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        per_page: perPage.toString(),
      });
      if (query) params.set("query", query);
      if (fromDate) params.set("fromDate", fromDate);
      if (toDate) params.set("toDate", toDate);

      const response = await fetch(`/api/branch?${params.toString()}`);
      const data = await response.json();
      setBranchs(data.branchs || []);
      setTotalItems(data.totalItems || 0);
      setLoading(false);
    }

    fetchBranchs();
  }, [page, perPage, query, fromDate, toDate]);

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this branch?")) {
      const response = await fetch(`/api/branch/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setBranchs(branchs.filter((branch) => branch.id !== id));
      } else {
        alert("Failed to delete the customer.");
      }
    }
  };

  const hasNextPage = page * perPage < totalItems;
  const hasPrevPage = page > 1;

  const columns = [
    {
      header: "No",
      accessor: "no",
    },
    { header: "Branch Name", accessor: "name" },
    {
      header: "Created",
      accessor: "createdAt",
      cell: (row: Branch) => {
        const date = new Date(row.createdAt);
        return date.toLocaleDateString("id-ID", {
          day: "numeric",
          month: "long",
          year: "numeric",
        });
      },
    },
    {
      header: "Action",
      accessor: "action",
      cell: (row: Branch) => (
        <div className="flex items-center gap-2">
          <ButtonIcon
            url={`/admin/branch/${row.id}`}
            icon={<FilePenLine className="w-4 h-4" />}
          />
          <button
            onClick={() => handleDelete(row.id)}
            className="p-1 bg-red-400 text-white rounded hover:bg-red-600"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <Layout>
      {loading ? (
        <Skeleton className="h-8 w-48 mb-4" />
      ) : (
        <TitleBreadcrumb
          title="Branch Data"
          items={[{ text: "Branch", link: "/admin/branch" }]}
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
                <div className="flex mt-2 md:mt-0">
                  <Button
                    className=""
                    icon={<PlusCircle className="w-4 h-4" />}
                    url="/admin/branch/create"
                    title="Create"
                  />
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
              data={branchs}
              columns={columns}
              currentPage={page}
              perPage={10}
            />

            <div className="mt-3">
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

export default BranchPage;
