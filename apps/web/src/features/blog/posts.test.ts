import { describe, expect, it } from "vitest";

import { getAllBlogPosts, getBlogPostBySlug, getRelatedPosts } from "./posts";

describe("getAllBlogPosts", () => {
  it("loads every markdown file in content/blog with its frontmatter and rendered html", () => {
    const posts = getAllBlogPosts();

    expect(posts.length).toBeGreaterThanOrEqual(8);
    for (const post of posts) {
      expect(post.title.length).toBeGreaterThan(0);
      expect(post.description.length).toBeGreaterThan(0);
      expect(post.slug.length).toBeGreaterThan(0);
      expect(post.toolHref.startsWith("/")).toBe(true);
      expect(post.html).toContain("<p>");
    }
  });

  it("renders the ITP table as an actual HTML table", () => {
    const post = getBlogPostBySlug("itp-por-comunidad-autonoma");
    expect(post?.html).toContain("<table>");
  });
});

describe("getBlogPostBySlug", () => {
  it("returns the matching post", () => {
    const post = getBlogPostBySlug("fire-independencia-financiera");
    expect(post?.title).toContain("FIRE");
  });

  it("returns undefined for an unknown slug", () => {
    expect(getBlogPostBySlug("no-existe")).toBeUndefined();
  });
});

describe("getRelatedPosts", () => {
  it("returns other posts about the same tool, excluding itself", () => {
    const post = getBlogPostBySlug("fire-independencia-financiera")!;
    const related = getRelatedPosts(post);

    expect(related.length).toBeGreaterThan(0);
    for (const r of related) {
      expect(r.toolHref).toBe(post.toolHref);
      expect(r.slug).not.toBe(post.slug);
    }
  });
});
