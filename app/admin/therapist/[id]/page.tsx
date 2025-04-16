import CardMain from "@/components/dashboard/layouts/CardMain";
import Layout from "@/components/dashboard/layouts/Layout";
import TitleBreadcrumb from "@/components/dashboard/layouts/TitleBreadcrumb";
import TherapistForm from "@/components/dashboard/ui/Form/TherapistForm";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface Props {
  params: { id: string };
}

export default async function EditTherapistPage({ params }: Props) {
  const { id } = await Promise.resolve(params);

  const therapistId = Number(id);

  if (isNaN(therapistId)) {
    return <div>Invalid therapist ID</div>;
  }

  const therapist = await prisma.therapist.findUnique({
    where: { id: therapistId },
  });

  if (!therapist) {
    return <div>Therapist not found</div>;
  }

  return (
    <Layout>
      <TitleBreadcrumb
        title="Edit Therapist"
        items={[
          { text: "Therapist", link: "/admin/therapist" },
          { text: "Edit", link: `/admin/therapist/${therapistId}` },
        ]}
      />
      <CardMain>
        <TherapistForm therapist={therapist} />
      </CardMain>
    </Layout>
  );
}
