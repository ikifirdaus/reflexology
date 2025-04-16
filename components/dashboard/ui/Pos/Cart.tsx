// components/dashboard/ui/Pos/Cart.tsx
// components/dashboard/ui/Pos/Cart.tsx

import { Trash2 } from "lucide-react";

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface CartProps {
  cart: CartItem[];
  setCart: React.Dispatch<React.SetStateAction<CartItem[]>>;
}

// ... lanjutkan seperti sebelumnya

interface CartProps {
  cart: CartItem[];
  setCart: React.Dispatch<React.SetStateAction<CartItem[]>>;
}

export default function Cart({ cart, setCart }: CartProps) {
  const increase = (id: string) => {
    setCart((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  const decrease = (id: string) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.id === id ? { ...item, quantity: item.quantity - 1 } : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const remove = (id: string) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <div className="space-y-2">
      {cart.map((item) => (
        <div
          key={item.id}
          className="flex justify-between items-center border p-2 rounded-md"
        >
          <div>
            <div className="font-medium">{item.name}</div>
            <div className="text-sm text-gray-500">
              Rp {(item.price * item.quantity).toLocaleString()}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => decrease(item.id)}
              className="w-6 h-6 border rounded"
            >
              -
            </button>
            <div className="w-6 text-center">{item.quantity}</div>
            <button
              onClick={() => increase(item.id)}
              className="w-6 h-6 border rounded"
            >
              +
            </button>
            <button
              onClick={() => remove(item.id)}
              className="ml-2 text-red-500 hover:text-red-700"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
