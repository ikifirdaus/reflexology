import { PrismaClient } from "@prisma/client";
import Layout from "@/components/dashboard/layouts/Layout";
import TitleBreadcrumb from "@/components/dashboard/layouts/TitleBreadcrumb";
import CardMain from "@/components/dashboard/layouts/CardMain";
import BranchForm from "@/components/dashboard/ui/Form/BranchForm";

const prisma = new PrismaClient();

interface Props {
  params: { id: string };
}

export default async function EditBranchPage({ params }: Props) {
  const { id } = await Promise.resolve(params); // <--- pakai Promise.resolve di sini

  const branchId = Number(id);

  if (isNaN(branchId)) {
    return <div>Invalid branch ID</div>;
  }

  const branch = await prisma.branch.findUnique({
    where: { id: branchId },
  });

  if (!branch) {
    return <div>Branch not found</div>;
  }

  return (
    <Layout>
      <TitleBreadcrumb
        title="Edit Branch"
        items={[
          { text: "Branch", link: "/admin/branch" },
          { text: "Edit", link: `/admin/branch/${branchId}` },
        ]}
      />
      <CardMain>
        <BranchForm branch={branch} />
      </CardMain>
    </Layout>
  );
}
