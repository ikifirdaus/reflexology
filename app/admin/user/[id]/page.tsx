import CardMain from "@/components/dashboard/layouts/CardMain";
import Layout from "@/components/dashboard/layouts/Layout";
import TitleBreadcrumb from "@/components/dashboard/layouts/TitleBreadcrumb";
import UserForm from "@/components/dashboard/ui/Form/UserForm";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface Props {
  params: { id: string };
}

export default async function EditUserPage({ params }: Props) {
  const { id } = await Promise.resolve(params);

  const userId = Number(id);

  if (isNaN(userId)) {
    return <div>Invalid user ID</div>;
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      branch: true, // ← tambahkan ini untuk ambil data relasi
    },
  });

  if (!user) {
    return <div>User not found</div>;
  }

  return (
    <Layout>
      <TitleBreadcrumb
        title="Edit User"
        items={[
          { text: "User", link: "/admin/user" },
          { text: "Edit", link: `/admin/user/${userId}` },
        ]}
      />
      <CardMain>
        <UserForm user={user} />
      </CardMain>
    </Layout>
  );
}
