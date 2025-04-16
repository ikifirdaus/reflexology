import CardMain from "@/components/dashboard/layouts/CardMain";
import Layout from "@/components/dashboard/layouts/Layout";
import TitleBreadcrumb from "@/components/dashboard/layouts/TitleBreadcrumb";
import CustomerForm from "@/components/dashboard/ui/Form/CustomerForm";

const createPage = () => {
  return (
    <div>
      <Layout>
        <TitleBreadcrumb
          title="Add Customer"
          items={[
            { text: "Customer", link: "/admin/customer" },
            { text: "Create", link: "/admin/customer/create" },
          ]}
        />
        <CardMain>
          <div className="">
            <CustomerForm />
          </div>
        </CardMain>
      </Layout>
    </div>
  );
};

export default createPage;
