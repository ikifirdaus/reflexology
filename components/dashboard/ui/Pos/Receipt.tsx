// components/dashboard/ui/Pos/Receipt.tsx
interface ReceiptProps {
  cart: {
    id: string;
    name: string;
    price: number;
    quantity: number;
  }[];
}

export default function Receipt({ cart }: ReceiptProps) {
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="mt-4 p-2 border-t pt-2 text-right font-semibold">
      Total: Rp {total.toLocaleString()}
    </div>
  );
}
