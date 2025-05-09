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
import Image from "next/image";

interface Therapist {
  id: number;
  name: string;
  branch?: {
    name: string;
  };
  image: string;
  qrCodeUrl: string;
}

const TherapistPage = () => {
  const [loading, setLoading] = useState(true);
  const [therapists, setTherapists] = useState<Therapist[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const searchParams = useSearchParams();

  const page = parseInt(searchParams.get("page") || "1");
  const perPage = parseInt(searchParams.get("per_page") || "10");
  const query = searchParams.get("query") || "";
  const fromDate = searchParams.get("fromDate") || "";
  const toDate = searchParams.get("toDate") || "";

  useEffect(() => {
    async function fetchTherapists() {
      setLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        per_page: perPage.toString(),
      });
      if (query) params.set("query", query);
      if (fromDate) params.set("fromDate", fromDate);
      if (toDate) params.set("toDate", toDate);

      const response = await fetch(`/api/therapist?${params.toString()}`);
      const data = await response.json();
      setTherapists(data.therapists || []);
      setTotalItems(data.totalItems || 0);
      setLoading(false);
    }

    fetchTherapists();
  }, [page, perPage, query, fromDate, toDate]);

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this therapist?")) {
      const response = await fetch(`/api/therapist/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setTherapists(therapists.filter((therapist) => therapist.id !== id));
      } else {
        alert("Failed to delete the therapist.");
      }
    }
  };

  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [showImageModal, setShowImageModal] = useState(false);

  const hasNextPage = page * perPage < totalItems;
  const hasPrevPage = page > 1;

  const columns = [
    {
      header: "No",
      accessor: "no",
    },
    { header: "Nama Terapis", accessor: "name" },
    {
      header: "Branch",
      accessor: "branch",
      cell: (row: Therapist) => row.branch?.name ?? "-",
    },
    {
      header: "Foto Profile",
      accessor: "image",
      cell: (row: Therapist) => {
        const imageUrl = row.image.startsWith("http")
          ? row.image
          : `https://res.cloudinary.com/dhjjemlz9/image/upload/v1744961492/therapist/${row.image}`;
        return (
          <div>
            <Image
              src={imageUrl}
              width={40}
              height={40}
              alt={row.name}
              className="w-10 h-10 rounded-full cursor-pointer object-cover"
              onClick={() => {
                setSelectedImage(imageUrl);
                setShowImageModal(true);
              }}
            />
          </div>
        );
      },
    },

    {
      header: "QrCode",
      accessor: "qrCodeUrl",
      cell: (row: Therapist) => {
        const qrCodeUrl = row.qrCodeUrl.startsWith("http")
          ? row.qrCodeUrl
          : `https://res.cloudinary.com/dhjjemlz9/image/upload/v1744961492/therapist/${row.qrCodeUrl}`;
        return (
          <div className="flex items-center gap-2">
            <Image
              src={qrCodeUrl}
              width={40}
              height={40}
              alt={row.name}
              className="w-10 h-10 rounded-full cursor-pointer object-cover"
              onClick={() => {
                setSelectedImage(qrCodeUrl);
                setShowImageModal(true);
              }}
            />
          </div>
        );
      },
    },

    {
      header: "Action",
      accessor: "action",
      cell: (row: Therapist) => (
        <div className="flex items-center gap-2">
          <ButtonIcon
            url={`/admin/therapist/${row.id}`}
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
          title="Therapist Data"
          items={[{ text: "Therapist", link: "/admin/therapist" }]}
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
                    url="/admin/therapist/create"
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
              data={therapists}
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

            {showImageModal && selectedImage && (
              <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
                <div className="bg-white p-4 rounded-lg shadow-lg relative w-full max-w-[90vw] md:max-w-[500px] max-h-[90vh] overflow-auto">
                  <button
                    onClick={() => setShowImageModal(false)}
                    className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-xl"
                  >
                    ✕
                  </button>
                  <div className="flex justify-center items-center">
                    <Image
                      src={selectedImage}
                      alt="Full View"
                      width={0}
                      height={0}
                      sizes="100vw"
                      className="w-full h-auto object-contain rounded"
                    />
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </CardMain>
    </Layout>
  );
};

export default TherapistPage;
