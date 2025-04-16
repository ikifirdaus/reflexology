import CardMain from "@/components/dashboard/layouts/CardMain";
import Layout from "@/components/dashboard/layouts/Layout";
import TitleBreadcrumb from "@/components/dashboard/layouts/TitleBreadcrumb";
import ArticleForm from "@/components/dashboard/ui/Form/ArticleForm";

const createPage = () => {
  return (
    <div>
      <Layout>
        <TitleBreadcrumb
          title="Add Article"
          items={[
            { text: "Article", link: "/admin/article" },
            { text: "Create", link: "/admin/article/create" },
          ]}
        />
        <CardMain>
          <div className="">
            <ArticleForm />
          </div>
        </CardMain>
      </Layout>
    </div>
  );
};

export default createPage;
