import type { MetadataRoute } from "next";
import { getAllBlogPosts, getAllProjects } from "@/lib/content";
import { siteConfig } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: siteConfig.url, lastModified: new Date(), priority: 1.0 },
    { url: `${siteConfig.url}/about`, lastModified: new Date(), priority: 0.8 },
    { url: `${siteConfig.url}/projects`, lastModified: new Date(), priority: 0.9 },
    { url: `${siteConfig.url}/blog`, lastModified: new Date(), priority: 0.9 },
    { url: `${siteConfig.url}/resume`, lastModified: new Date(), priority: 0.7 },
    { url: `${siteConfig.url}/contact`, lastModified: new Date(), priority: 0.6 },
  ];

  const blogRoutes: MetadataRoute.Sitemap = getAllBlogPosts().map((post) => ({
    url: `${siteConfig.url}/blog/${post.slug}`,
    lastModified: new Date(post.frontmatter.date),
    priority: 0.7,
  }));

  const projectRoutes: MetadataRoute.Sitemap = getAllProjects().map((project) => ({
    url: `${siteConfig.url}/projects/${project.slug}`,
    lastModified: new Date(project.frontmatter.date),
    priority: 0.8,
  }));

  return [...staticRoutes, ...blogRoutes, ...projectRoutes];
}
