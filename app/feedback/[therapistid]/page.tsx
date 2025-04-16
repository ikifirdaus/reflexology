import FeedbackForm from "@/components/frontend/ui/Form/FeedbackForm";
import FeedbackLayout from "@/components/frontend/layouts/FeedbackLayout";

interface Props {
  params: { therapistid: string };
}

export default async function FeedbackPage({ params }: Props) {
  const { therapistid } = await Promise.resolve(params); // Fix error

  return (
    <FeedbackLayout>
      <FeedbackForm therapistId={therapistid} />
    </FeedbackLayout>
  );
}
