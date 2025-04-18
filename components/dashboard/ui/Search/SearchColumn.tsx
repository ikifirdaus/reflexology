"use client";

import { SearchIcon } from "lucide-react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useState } from "react";

const SearchColumn = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [query, setQuery] = useState(searchParams.get("query") || "");
  const [fromDate, setFromDate] = useState(searchParams.get("fromDate") || "");
  const [toDate, setToDate] = useState(searchParams.get("toDate") || "");

  const handleSearch = () => {
    // Tidak perlu menggunakan 'any', cukup menggunakan URLSearchParams
    const params = new URLSearchParams(searchParams as URLSearchParams);
    params.set("query", query);
    params.set("fromDate", fromDate);
    params.set("toDate", toDate);
    params.set("page", "1"); // Reset to the first page when filtering
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="flex flex-col md:flex-row gap-2">
      <input
        type="text"
        placeholder="Search..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="pl-3 pr-4 py-1 w-full border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <p className="flex items-center">from:</p>
      <input
        type="date"
        value={fromDate}
        onChange={(e) => setFromDate(e.target.value)}
        className="w-full px-3 py-1 text-base border text-gray-400 border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <p className="flex items-center">to:</p>
      <input
        type="date"
        value={toDate}
        onChange={(e) => setToDate(e.target.value)}
        className="w-full px-3 py-1 text-base border text-gray-400 border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button
        onClick={handleSearch}
        className=" text-sm font-medium text-slate-500 hover:bg-primary hover:bg-slate-200 hover:text-white flex items-center justify-center border md:w-28 h-9 rounded w-full"
      >
        <SearchIcon width={18} height={18} />
      </button>
    </div>
  );
};

export default SearchColumn;
