import type { Metadata } from "next";
import Link from "next/link";

import { generateBreadcrumbSchema, generateMetadata as buildSeoMetadata } from "@atlas/seo";
import { Card, CardDescription, CardTitle } from "@atlas/design-system";

import { getAllBlogPosts } from "@/features/blog/posts";

const TITLE = "Blog — guías para decidir con datos, no con miedo";
const DESCRIPTION =
  "Artículos sobre hipotecas, ahorro, independencia financiera y gastos de comprar vivienda, explicados sin jerga bancaria.";
const PATH = "/blog";

export const metadata: Metadata = buildSeoMetadata({
  title: TITLE,
  description: DESCRIPTION,
  path: PATH,
});

const breadcrumbSchema = generateBreadcrumbSchema([
  { name: "Inicio", path: "/" },
  { name: "Blog", path: PATH },
]);

export default function BlogIndexPage() {
  const posts = getAllBlogPosts();

  return (
    <div className="bg-background flex min-h-screen flex-col items-center px-6 py-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <div className="w-full max-w-[760px]">
        <Link href="/" className="text-muted-foreground text-sm hover:underline">
          ← Inicio
        </Link>
      </div>

      <main className="mt-4 flex w-full max-w-[760px] flex-col items-center gap-4 text-center">
        <h1 className="text-foreground text-4xl leading-tight font-semibold tracking-tight text-balance sm:text-5xl">
          Blog
        </h1>
        <p className="text-muted-foreground max-w-md text-lg">{DESCRIPTION}</p>
      </main>

      <section className="mt-16 flex w-full max-w-[760px] flex-col gap-4">
        {posts.map((post) => (
          <Link key={post.slug} href={`/blog/${post.slug}`} className="group">
            <Card className="group-hover:border-primary/30 transition-colors duration-200">
              <CardTitle>{post.title}</CardTitle>
              <CardDescription>{post.description}</CardDescription>
              <span className="text-primary mt-4 inline-flex items-center gap-1 text-sm font-medium">
                Leer artículo
                <span aria-hidden className="transition-transform group-hover:translate-x-0.5">
                  →
                </span>
              </span>
            </Card>
          </Link>
        ))}
      </section>
    </div>
  );
}
