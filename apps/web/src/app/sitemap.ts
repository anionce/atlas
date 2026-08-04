import type { MetadataRoute } from "next";

import { SITE_URL } from "@atlas/seo";

const routes = [
  { path: "/", priority: 1 },
  { path: "/comprar-vivienda", priority: 0.9 },
  { path: "/gastos-compra-vivienda", priority: 0.9 },
  { path: "/interes-compuesto", priority: 0.9 },
  { path: "/fire", priority: 0.9 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map((route) => ({
    url: new URL(route.path, SITE_URL).toString(),
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: route.priority,
  }));
}
