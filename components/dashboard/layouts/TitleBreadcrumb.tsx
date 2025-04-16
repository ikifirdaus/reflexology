"use client";

import Link from "next/link";
import { useState } from "react";

interface BreadcrumbItem {
  text: string; // Display text for the breadcrumb item
  link?: string; // Optional link for the breadcrumb item
}

interface TitleBreadcrumbProps {
  title: string; // Title of the page
  items: BreadcrumbItem[]; // Array of breadcrumb items
}

export default function TitleBreadcrumb({
  title,
  items,
}: TitleBreadcrumbProps) {
  // Track loading state for each breadcrumb item
  const [loadingIndex, setLoadingIndex] = useState<number | null>(null);

  return (
    <div className="flex items-center justify-between mb-3">
      {/* Page Title */}
      <h1 className="text-2xl font-bold">{title}</h1>

      {/* Breadcrumb Navigation */}
      <nav aria-label="breadcrumb">
        <ol className="flex space-x-1">
          {items.map((item, index) => (
            <li
              key={index}
              className={`breadcrumb-item ${
                index === items.length - 1 ? "text-gray-500" : "text-blue-500"
              }`}
            >
              {index === items.length - 1 ? (
                // Last item is not a link
                <span>{item.text}</span>
              ) : (
                <Link
                  href={item.link || "#"}
                  onClick={() => setLoadingIndex(index)} // Set loading state for this specific item
                  className="hover:text-blue-700"
                >
                  {loadingIndex === index ? "Loading..." : item.text}
                </Link>
              )}
              {/* Add a separator (/) between items, except for the last one */}
              {index < items.length - 1 && <span className="mx-1">/</span>}
            </li>
          ))}
        </ol>
      </nav>
    </div>
  );
}
