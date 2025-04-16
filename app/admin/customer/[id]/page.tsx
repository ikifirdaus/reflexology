import CardMain from "@/components/dashboard/layouts/CardMain";
import Layout from "@/components/dashboard/layouts/Layout";
import TitleBreadcrumb from "@/components/dashboard/layouts/TitleBreadcrumb";
import CustomerForm from "@/components/dashboard/ui/Form/CustomerForm";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface Props {
  params: { id: string };
}

export default async function EditCustomerPage({ params }: Props) {
  const { id } = await Promise.resolve(params);

  const customerId = Number(id);

  if (isNaN(customerId)) {
    return <div>Invalid customer ID</div>;
  }

  const customer = await prisma.customer.findUnique({
    where: { id: customerId },
  });

  if (!customer) {
    return <div>Customer not found</div>;
  }

  return (
    <Layout>
      <TitleBreadcrumb
        title="Edit Customer"
        items={[
          { text: "Customer", link: "/admin/customer" },
          { text: "Edit", link: `/admin/customer/${customerId}` },
        ]}
      />
      <CardMain>
        <CustomerForm customer={customer} />
      </CardMain>
    </Layout>
  );
}
