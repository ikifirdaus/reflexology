import Layout from "@/components/dashboard/layouts/Layout";
import TitleBreadcrumb from "@/components/dashboard/layouts/TitleBreadcrumb";
import Button from "@/components/dashboard/ui/Button/Button";
import ButtonIcon from "@/components/dashboard/ui/Button/ButtonIcon";
import { Pencil, PlusCircle, Trash } from "lucide-react";

const dashboardPage = () => {
  return (
    <div>
      <Layout>
        <TitleBreadcrumb
          title="Dashboard"
          items={[{ text: "Dashboard", link: "/admin/dashboard" }]}
        />
        <div className="flex items-center gap-2">
          <Button
            className=""
            icon={<PlusCircle className="w-4 h-4" />}
            url="/admin/users/create"
            title="Create"
          />
          <ButtonIcon
            icon={
              <Pencil className="w-4 h-4 text-yellow-500 hover:text-yellow-800" />
            }
            url="/admin/users/edit"
          />

          <ButtonIcon
            icon={<Trash className="w-4 h-4 text-red-500 hover:text-red-800" />}
            url="/admin/users/edit"
          />
        </div>
      </Layout>
    </div>
  );
};

export default dashboardPage;
