import {
  BookUser,
  CircleDollarSign,
  LayoutDashboard,
  MenuSquare,
  MessageSquareDiff,
  Newspaper,
  Settings,
  Users,
  UserSquare2,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const Sidebar = () => {
  const menuItems = [
    // { icon: LayoutDashboard, label: "Dashboard", path: "/admin/dashboard" },
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
    // { icon: Settings, label: "Setting", path: "/admin/setting" },
    // { icon: Newspaper, label: "Article", path: "/admin/article" },
    // { icon: LucideSquareDashedKanban, label: "Blog", path: "/admin/blog" },
  ];

  const pathname = usePathname();

  const [loadingPath, setLoadingPath] = useState("");

  return (
    <aside className="w-64 bg-slate-800 text-white min-h-screen h-full">
      <div className="p-6">
        <h1 className="text-2xl font-bold">Admin Panel</h1>
      </div>

      <nav className="mt-6">
        {menuItems.map((item) => {
          const Icon = item.icon;

          return (
            <Link
              key={item.path}
              href={item.path}
              onClick={() => setLoadingPath(item.path)}
              className={`flex items-center px-6 py-3 transition delay-75 duration-300 ease-in-out hover:bg-slate-700 hover:mx-2 hover:transition-all my-1 rounded-lg ${
                pathname === item.path
                  ? "bg-slate-700 mx-2 rounded-lg my-1"
                  : ""
              }`}
            >
              {/* {loadingPath === item.path ? (
                <span>Loading...</span>
              ) : ( */}
              <>
                <Icon className="w-5 h-5 mr-3" />
                {item.label}
              </>
              {/* )} */}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;
