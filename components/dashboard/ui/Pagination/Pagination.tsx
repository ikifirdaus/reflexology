"use client";

import { FC } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  hasNextPage: boolean;
  hasPrevPage: boolean;
  totalItems: number;
}

const Pagination: FC<PaginationProps> = ({
  hasNextPage,
  hasPrevPage,
  totalItems,
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const page = parseInt(searchParams.get("page") || "1");
  const perPage = parseInt(searchParams.get("per_page") || "10");

  const totalPages = Math.ceil(totalItems / perPage);

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams as any);
    params.set("page", newPage.toString());
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="flex items-center justify-center gap-2 text-sm">
      <button
        className="text-2xl hover:text-gray-500"
        disabled={!hasPrevPage}
        onClick={() => handlePageChange(page - 1)}
      >
        <ChevronLeft size={20} />
      </button>

      <div>
        {page} / {totalPages} (Total Data: {totalItems})
      </div>

      <button
        className="text-2xl hover:text-gray-500"
        disabled={!hasNextPage}
        onClick={() => handlePageChange(page + 1)}
      >
        <ChevronRight size={20} />
      </button>
    </div>
  );
};

export default Pagination;
