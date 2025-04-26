"use client";

import CardMain from "@/components/dashboard/layouts/CardMain";
import Layout from "@/components/dashboard/layouts/Layout";
import TitleBreadcrumb from "@/components/dashboard/layouts/TitleBreadcrumb";
import Button from "@/components/dashboard/ui/Button/Button";
import Table from "@/components/dashboard/ui/Table/Table";
import { PlusCircle, Trash2, FilePenLine } from "lucide-react";
import React, { useState, useEffect } from "react";
import ButtonIcon from "@/components/dashboard/ui/Button/ButtonIcon";
import Pagination from "@/components/dashboard/ui/Pagination/Pagination";
import { useSearchParams } from "next/navigation";
import SearchColumn from "@/components/dashboard/ui/Search/SearchColumn";
import TableSkeleton from "@/components/dashboard/ui/TableSkeleton/TableSkeleton";
import Skeleton from "@/components/dashboard/ui/Skeleton/Skeleton";

interface Customer {
  id: number;
  name: string;
  contact: string;
  createdAt: string;
}

const CustomerPage = () => {
  const [loading, setLoading] = useState(true);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const searchParams = useSearchParams();

  const page = parseInt(searchParams.get("page") || "1");
  const perPage = parseInt(searchParams.get("per_page") || "10");
  const query = searchParams.get("query") || "";
  const fromDate = searchParams.get("fromDate") || "";
  const toDate = searchParams.get("toDate") || "";

  useEffect(() => {
    async function fetchCustomers() {
      setLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        per_page: perPage.toString(),
      });
      if (query) params.set("query", query);
      if (fromDate) params.set("fromDate", fromDate);
      if (toDate) params.set("toDate", toDate);

      const response = await fetch(`/api/customer?${params.toString()}`);
      const data = await response.json();
      setCustomers(data.customers || []);
      setTotalItems(data.totalItems || 0);
      setLoading(false);
    }

    fetchCustomers();
  }, [page, perPage, query, fromDate, toDate]);

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this customer?")) {
      const response = await fetch(`/api/customer/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setCustomers(customers.filter((customer) => customer.id !== id));
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
    { header: "Name", accessor: "name" },
    { header: "Contact", accessor: "contact" },
    {
      header: "Reservation Date",
      accessor: "createdAt",
      cell: (row: Customer) => {
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
      cell: (row: Customer) => (
        <div className="flex items-center gap-2">
          <ButtonIcon
            url={`/admin/customer/${row.id}`}
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
          title="Customer Reservation Data"
          items={[{ text: "Customer", link: "/admin/customer" }]}
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
                    url="/admin/customer/create"
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
              data={customers}
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

export default CustomerPage;
