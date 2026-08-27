import type { MetadataRoute } from "next";

import { SITE_URL } from "@atlas/seo";

import { getAllBlogPosts } from "@/features/blog/posts";

const routes = [
  { path: "/", priority: 1 },
  { path: "/comprar-vivienda", priority: 0.9 },
  { path: "/gastos-compra-vivienda", priority: 0.9 },
  { path: "/interes-compuesto", priority: 0.9 },
  { path: "/fire", priority: 0.9 },
  { path: "/tasa-de-ahorro", priority: 0.9 },
  { path: "/blog", priority: 0.7 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const staticEntries = routes.map((route) => ({
    url: new URL(route.path, SITE_URL).toString(),
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: route.priority,
  }));

  const postEntries = getAllBlogPosts().map((post) => ({
    url: new URL(`/blog/${post.slug}`, SITE_URL).toString(),
    lastModified: new Date(post.publishedAt),
    changeFrequency: "yearly" as const,
    priority: 0.6,
  }));

  return [...staticEntries, ...postEntries];
}
