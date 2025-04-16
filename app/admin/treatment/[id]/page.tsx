import CardMain from "@/components/dashboard/layouts/CardMain";
import Layout from "@/components/dashboard/layouts/Layout";
import TitleBreadcrumb from "@/components/dashboard/layouts/TitleBreadcrumb";
import ArticleForm from "@/components/dashboard/ui/Form/ArticleForm";
import TreatmentForm from "@/components/dashboard/ui/Form/TreatmentForm";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface Props {
  params: { id: string };
}

export default async function EditTreatmentPage({ params }: Props) {
  const { id } = await Promise.resolve(params);

  const treatmentId = Number(id);

  if (isNaN(treatmentId)) {
    return <div>Invalid treatment ID</div>;
  }

  const treatment = await prisma.treatment.findUnique({
    where: { id: treatmentId },
  });

  if (!treatment) {
    return <div>Treatment not found</div>;
  }

  return (
    <Layout>
      <TitleBreadcrumb
        title="Edit Treatment"
        items={[
          { text: "Treatment", link: "/admin/treatment" },
          { text: "Edit", link: `/admin/treatment/${treatmentId}` },
        ]}
      />
      <CardMain>
        <TreatmentForm treatment={treatment} />
      </CardMain>
    </Layout>
  );
}
