import CardMain from "@/components/dashboard/layouts/CardMain";
import Layout from "@/components/dashboard/layouts/Layout";
import TitleBreadcrumb from "@/components/dashboard/layouts/TitleBreadcrumb";
import BranchForm from "@/components/dashboard/ui/Form/BranchForm";

const createPage = () => {
  return (
    <div>
      <Layout>
        <TitleBreadcrumb
          title="Add Branch"
          items={[
            { text: "Branch", link: "/admin/branch" },
            { text: "Create", link: "/admin/branch/create" },
          ]}
        />
        <CardMain>
          <div className="">
            <BranchForm />
          </div>
        </CardMain>
      </Layout>
    </div>
  );
};

export default createPage;
