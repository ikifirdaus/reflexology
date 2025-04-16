import CardMain from "@/components/dashboard/layouts/CardMain";
import Layout from "@/components/dashboard/layouts/Layout";
import TitleBreadcrumb from "@/components/dashboard/layouts/TitleBreadcrumb";
import TherapistForm from "@/components/dashboard/ui/Form/TherapistForm";

const createPage = () => {
  return (
    <div>
      <Layout>
        <TitleBreadcrumb
          title="Add Therapist"
          items={[
            { text: "Therapist", link: "/admin/therapist" },
            { text: "Create", link: "/admin/therapist/create" },
          ]}
        />
        <CardMain>
          <div className="">
            <TherapistForm />
          </div>
        </CardMain>
      </Layout>
    </div>
  );
};

export default createPage;
