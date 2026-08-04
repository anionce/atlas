import fs from "node:fs";
import path from "node:path";

import matter from "gray-matter";
import { marked } from "marked";

export interface BlogFaqItem {
  question: string;
  answer: string;
}

export interface BlogPostFrontmatter {
  title: string;
  description: string;
  slug: string;
  publishedAt: string;
  toolHref: string;
  toolLabel: string;
  ctaText: string;
  faq: BlogFaqItem[];
}

export interface BlogPost extends BlogPostFrontmatter {
  /** HTML ya renderizado a partir del markdown del artículo. */
  html: string;
}

const CONTENT_DIR = path.join(process.cwd(), "content/blog");

function loadPost(filename: string): BlogPost {
  const raw = fs.readFileSync(path.join(CONTENT_DIR, filename), "utf-8");
  const { data, content } = matter(raw);
  const frontmatter = data as BlogPostFrontmatter;

  return {
    ...frontmatter,
    html: marked(content, { async: false, gfm: true }),
  };
}

/** Todos los artículos, ordenados alfabéticamente por título. */
export function getAllBlogPosts(): BlogPost[] {
  const filenames = fs.readdirSync(CONTENT_DIR).filter((name) => name.endsWith(".md"));
  return filenames.map(loadPost).sort((a, b) => a.title.localeCompare(b.title, "es"));
}

export function getBlogPostBySlug(slug: string): BlogPost | undefined {
  return getAllBlogPosts().find((post) => post.slug === slug);
}
