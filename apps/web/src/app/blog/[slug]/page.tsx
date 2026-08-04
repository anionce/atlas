import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import {
  generateBreadcrumbSchema,
  generateFAQSchema,
  generateMetadata as buildSeoMetadata,
} from "@atlas/seo";
import { Card, CardDescription, CardTitle } from "@atlas/design-system";

import { getAllBlogPosts, getBlogPostBySlug } from "@/features/blog/posts";

const PROSE_CLASSNAME =
  "[&_h2]:text-foreground [&_h2]:mt-10 [&_h2]:mb-4 [&_h2]:text-2xl [&_h2]:font-semibold " +
  "[&_h3]:text-foreground [&_h3]:mt-8 [&_h3]:mb-3 [&_h3]:text-xl [&_h3]:font-semibold " +
  "[&_p]:text-foreground [&_p]:mb-4 [&_p]:leading-relaxed " +
  "[&_ul]:mb-4 [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-6 " +
  "[&_ol]:mb-4 [&_ol]:list-decimal [&_ol]:space-y-2 [&_ol]:pl-6 " +
  "[&_li]:text-foreground [&_li]:leading-relaxed " +
  "[&_strong]:text-foreground [&_strong]:font-semibold " +
  "[&_a]:text-primary [&_a]:underline [&_a]:underline-offset-2 hover:[&_a]:opacity-80 " +
  "[&_table]:mb-6 [&_table]:block [&_table]:w-full [&_table]:overflow-x-auto [&_table]:text-sm " +
  "[&_th]:border-border [&_th]:bg-muted [&_th]:border [&_th]:px-3 [&_th]:py-2 [&_th]:text-left [&_th]:font-medium " +
  "[&_td]:border-border [&_td]:border [&_td]:px-3 [&_td]:py-2";

export async function generateStaticParams() {
  return getAllBlogPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: PageProps<"/blog/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);
  if (!post) return {};

  return buildSeoMetadata({
    title: post.title,
    description: post.description,
    path: `/blog/${post.slug}`,
  });
}

export default async function BlogPostPage({ params }: PageProps<"/blog/[slug]">) {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);
  if (!post) notFound();

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Inicio", path: "/" },
    { name: "Blog", path: "/blog" },
    { name: post.title, path: `/blog/${post.slug}` },
  ]);
  const faqSchema = generateFAQSchema(post.faq);

  return (
    <div className="bg-background flex min-h-screen flex-col items-center px-6 py-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <article className="w-full max-w-[720px]">
        <Link href="/blog" className="text-muted-foreground text-sm hover:underline">
          ← Blog
        </Link>
        <h1 className="text-foreground mt-4 text-3xl leading-tight font-semibold tracking-tight text-balance sm:text-4xl">
          {post.title}
        </h1>
        <p className="text-muted-foreground mt-3 text-lg">{post.description}</p>

        <div
          className={`mt-10 ${PROSE_CLASSNAME}`}
          dangerouslySetInnerHTML={{ __html: post.html }}
        />

        {post.faq.length > 0 ? (
          <section className="mt-4 flex flex-col gap-3">
            <h2 className="text-foreground text-xl font-semibold">Preguntas frecuentes</h2>
            {post.faq.map((item) => (
              <Card key={item.question}>
                <CardTitle className="text-base">{item.question}</CardTitle>
                <CardDescription>{item.answer}</CardDescription>
              </Card>
            ))}
          </section>
        ) : null}

        <Link href={post.toolHref} className="mt-8 block">
          <Card className="border-primary/30 hover:border-primary/60 bg-primary/5 transition-colors">
            <CardTitle>Calcula tu caso exacto</CardTitle>
            <CardDescription>{post.ctaText}</CardDescription>
            <span className="text-primary mt-4 inline-flex items-center gap-1 text-sm font-medium">
              Ir a la {post.toolLabel}
              <span aria-hidden>→</span>
            </span>
          </Card>
        </Link>
      </article>
    </div>
  );
}
