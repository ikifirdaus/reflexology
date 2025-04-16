"use client";

import CardMain from "@/components/dashboard/layouts/CardMain";
import Layout from "@/components/dashboard/layouts/Layout";
import TitleBreadcrumb from "@/components/dashboard/layouts/TitleBreadcrumb";
import Button from "@/components/dashboard/ui/Button/Button";
import { PlusCircle, Trash2, FilePenLine } from "lucide-react";

const BlogPage = () => {
  return (
    <Layout>
      <TitleBreadcrumb
        title="Blog Data"
        items={[{ text: "Blog", link: "/admin/blog" }]}
      />
      <CardMain>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2"></div>
          <div className="flex items-center justify-end">
            <Button
              icon={<PlusCircle className="w-4 h-4" />}
              url="/admin/blog/create"
              title="Create"
            />
          </div>
        </div>

        {/* <Table data={articles} columns={columns} /> */}
      </CardMain>
    </Layout>
  );
};

export default BlogPage;
