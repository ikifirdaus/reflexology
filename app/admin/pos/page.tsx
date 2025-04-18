// app/admin/pos/page.tsx
"use client";

import Layout from "@/components/dashboard/layouts/Layout";
import CardMain from "@/components/dashboard/layouts/CardMain";
import Skeleton from "@/components/dashboard/ui/Skeleton/Skeleton";
import TitleBreadcrumb from "@/components/dashboard/layouts/TitleBreadcrumb";
import TreatmentList from "@/components/dashboard/ui/Pos/TreatmentList";
import Cart from "@/components/dashboard/ui/Pos/Cart";
import Receipt from "@/components/dashboard/ui/Pos/Receipt";
import { useEffect, useState } from "react";

interface Treatment {
  id: string;
  name: string;
  price: number;
  duration?: number;
}

interface CartItem extends Treatment {
  quantity: number;
}

export default function POSPage() {
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState<CartItem[]>([]);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleAddToCart = (e: Event) => {
      const treatment = (e as CustomEvent).detail as Treatment;

      setCart((prev) => {
        const found = prev.find((item) => item.id === treatment.id);
        if (found) {
          return prev.map((item) =>
            item.id === treatment.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          );
        }
        return [...prev, { ...treatment, quantity: 1 }];
      });
    };

    window.addEventListener("add-to-cart", handleAddToCart);
    return () => window.removeEventListener("add-to-cart", handleAddToCart);
  }, []);

  return (
    <Layout>
      {loading ? (
        <Skeleton className="h-8 w-48 mb-4" />
      ) : (
        <TitleBreadcrumb
          title="Point of Sale"
          items={[{ text: "POS", link: "/admin" }]}
        />
      )}

      <CardMain>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <h2 className="text-lg font-semibold mb-2">Daftar Treatment</h2>
            {loading ? (
              <div className="grid grid-cols-2 gap-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-24" />
                ))}
              </div>
            ) : (
              <TreatmentList />
            )}
          </div>

          <div className="md:col-span-1">
            <h2 className="text-lg font-semibold mb-2">Keranjang</h2>
            {loading ? (
              <Skeleton className="h-32" />
            ) : (
              <>
                <Cart cart={cart} setCart={setCart} />
                <Receipt cart={cart} />
              </>
            )}
          </div>
        </div>
      </CardMain>
    </Layout>
  );
}
