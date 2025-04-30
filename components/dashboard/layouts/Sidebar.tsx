import {
  BookUser,
  CircleDollarSign,
  MenuSquare,
  MessageSquareDiff,
  Users,
  UserSquare2,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Sidebar = () => {
  const menuItems = [
    {
      icon: MessageSquareDiff,
      label: "Feedback",
      path: "/admin/feedbackCustomer",
    },
    { icon: UserSquare2, label: "Therapist", path: "/admin/therapist" },
    { icon: BookUser, label: "Customer", path: "/admin/customer" },
    {
      icon: MenuSquare,
      label: "Treatment",
      path: "/admin/treatment",
    },
    { icon: CircleDollarSign, label: "Pos", path: "/admin/pos" },
    { icon: Users, label: "Users/Staff", path: "/admin/user" },
  ];

  const pathname = usePathname();

  return (
    <aside className="w-64 bg-slate-800 text-white min-h-screen h-full">
      <div className="p-6">
        <Image src="/logo6.png" alt="" width={150} height={90} />
      </div>

      <nav className="mt-6">
        {menuItems.map((item) => {
          const Icon = item.icon;

          return (
            <Link
              key={item.path}
              href={item.path}
              className={`flex items-center px-6 py-3 transition delay-75 duration-300 ease-in-out hover:bg-slate-700 hover:mx-2 hover:transition-all my-1 rounded-lg ${
                pathname === item.path
                  ? "bg-slate-700 mx-2 rounded-lg my-1"
                  : ""
              }`}
            >
              <>
                <Icon className="w-5 h-5 mr-3" />
                {item.label}
              </>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;
