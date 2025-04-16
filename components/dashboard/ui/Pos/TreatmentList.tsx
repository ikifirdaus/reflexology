// components/pos/TreatmentList.tsx
"use client";

import { useEffect, useState } from "react";

interface Treatment {
  id: string;
  name: string;
  price: number;
  duration?: number;
}

export default function TreatmentList() {
  const [treatments, setTreatments] = useState<Treatment[]>([]);

  useEffect(() => {
    fetch("/api/treatment")
      .then((res) => res.json())
      .then((data) => {
        // Perbaikan utama di sini
        setTreatments(data.treatments);
      })
      .catch((err) => console.error("Error fetching treatments:", err));
  }, []);

  const addToCart = (treatment: Treatment) => {
    const event = new CustomEvent("add-to-cart", { detail: treatment });
    window.dispatchEvent(event);
  };

  return (
    <div className="grid grid-cols-3 gap-2">
      {treatments.map((t) => (
        <button
          key={t.id}
          onClick={() => addToCart(t)}
          className="border p-4 rounded-lg shadow hover:bg-gray-100"
        >
          <div className="font-medium">{t.name}</div>
          <div className="text-sm text-gray-500">
            Rp {t.price.toLocaleString()}
          </div>
        </button>
      ))}
    </div>
  );
}
