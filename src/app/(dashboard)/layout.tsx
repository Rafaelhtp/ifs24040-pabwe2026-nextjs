import React from "react";
import PostLayout from "@/features/posts/layouts/PostLayout";

export default function Layout({ children }: { children: React.ReactNode }) {
  return <PostLayout>{children}</PostLayout>;
}
