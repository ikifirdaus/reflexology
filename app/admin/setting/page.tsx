import Layout from "@/components/dashboard/layouts/Layout";
import TitleBreadcrumb from "@/components/dashboard/layouts/TitleBreadcrumb";

const settingPage = () => {
  return (
    <div>
      <Layout>
        <TitleBreadcrumb
          title="Settings"
          items={[{ text: "Settings", link: "/admin/setting" }]}
        />
      </Layout>
    </div>
  );
};

export default settingPage;
