"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import CardMain from "@/components/dashboard/layouts/CardMain";
import Layout from "@/components/dashboard/layouts/Layout";
import TitleBreadcrumb from "@/components/dashboard/layouts/TitleBreadcrumb";
import Button from "@/components/dashboard/ui/Button/Button";
import ButtonIcon from "@/components/dashboard/ui/Button/ButtonIcon";
import Table from "@/components/dashboard/ui/Table/Table";
import Pagination from "@/components/dashboard/ui/Pagination/Pagination";
import SearchColumn from "@/components/dashboard/ui/Search/SearchColumn";
import TableSkeleton from "@/components/dashboard/ui/TableSkeleton/TableSkeleton";
import Skeleton from "@/components/dashboard/ui/Skeleton/Skeleton";
import { PlusCircle, Trash2, FilePenLine } from "lucide-react";

interface Article {
  id: number;
  title: string;
  content: string;
}

const ArticlePage = () => {
  const [loading, setLoading] = useState(true);
  const [articles, setArticles] = useState<Article[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const searchParams = useSearchParams();

  const page = parseInt(searchParams.get("page") || "1");
  const perPage = parseInt(searchParams.get("per_page") || "10");
  const query = searchParams.get("query") || "";
  const fromDate = searchParams.get("fromDate") || "";
  const toDate = searchParams.get("toDate") || "";

  useEffect(() => {
    async function fetchArticles() {
      setLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        per_page: perPage.toString(),
      });
      if (query) params.set("query", query);
      if (fromDate) params.set("fromDate", fromDate);
      if (toDate) params.set("toDate", toDate);

      const response = await fetch(`/api/article?${params.toString()}`);
      const data = await response.json();
      setArticles(data.articles || []);
      setTotalItems(data.totalItems || 0);
      setLoading(false);
    }

    fetchArticles();
  }, [page, perPage, query, fromDate, toDate]);

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this article?")) {
      const response = await fetch(`/api/article/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setArticles((prev) => prev.filter((article) => article.id !== id));
      } else {
        alert("Failed to delete the article.");
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
    { header: "Title", accessor: "title" },
    { header: "Content", accessor: "content" },
    {
      header: "Action",
      accessor: "action",
      cell: (row: Article) => (
        <div className="flex items-center gap-2">
          <ButtonIcon
            url={`/admin/article/${row.id}`}
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
          title="Article Data"
          items={[{ text: "Article", link: "/admin/article" }]}
        />
      )}

      <CardMain>
        <div className="flex md:items-center md:justify-between flex-col md:flex-row">
          <div className="flex flex-col md:flex-row gap-2">
            {loading ? (
              <Skeleton className="h-10 w-full md:w-64 mb-2" />
            ) : (
              <>
                <SearchColumn />
                <div className="flex mt-2 md:mt-0">
                  <Button
                    className=""
                    icon={<PlusCircle className="w-4 h-4" />}
                    url="/admin/article/create"
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
              data={articles}
              columns={columns}
              currentPage={page}
              perPage={perPage}
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

export default ArticlePage;
