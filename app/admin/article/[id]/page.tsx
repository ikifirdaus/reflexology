import CardMain from "@/components/dashboard/layouts/CardMain";
import Layout from "@/components/dashboard/layouts/Layout";
import TitleBreadcrumb from "@/components/dashboard/layouts/TitleBreadcrumb";
import ArticleForm from "@/components/dashboard/ui/Form/ArticleForm";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface Props {
  params: { id: string }; // This is sufficient without needing the custom Params interface
}

export default async function EditArticlePage({ params }: Props) {
  const { id } = params; // Directly access params.id

  const articleId = Number(id);

  if (isNaN(articleId)) {
    return <div>Invalid article ID</div>;
  }

  const article = await prisma.article.findUnique({
    where: { id: articleId },
  });

  if (!article) {
    return <div>Article not found</div>;
  }

  return (
    <Layout>
      <TitleBreadcrumb
        title="Edit Article"
        items={[
          { text: "Article", link: "/admin/article" },
          { text: "Edit", link: `/admin/article/${articleId}` },
        ]}
      />
      <CardMain>
        <ArticleForm article={article} />
      </CardMain>
    </Layout>
  );
}
