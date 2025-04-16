import CardMain from "@/components/dashboard/layouts/CardMain";
import Layout from "@/components/dashboard/layouts/Layout";
import TitleBreadcrumb from "@/components/dashboard/layouts/TitleBreadcrumb";
import TreatmentForm from "@/components/dashboard/ui/Form/TreatmentForm";

const createPage = () => {
  return (
    <div>
      <Layout>
        <TitleBreadcrumb
          title="Add Treatment"
          items={[
            { text: "Treatment", link: "/admin/treatment" },
            { text: "Create", link: "/admin/treatment/create" },
          ]}
        />
        <CardMain>
          <div className="">
            <TreatmentForm />
          </div>
        </CardMain>
      </Layout>
    </div>
  );
};

export default createPage;
