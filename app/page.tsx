import type { Metadata } from "next";
import { Hero } from "@/components/home/Hero";
import { SpecializationGrid } from "@/components/home/SpecializationGrid";
import { CredibilityMetrics } from "@/components/home/CredibilityMetrics";
import { FeaturedProjects } from "@/components/home/FeaturedProjects";
import { LatestArticles } from "@/components/home/LatestArticles";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: siteConfig.title,
  description: siteConfig.description,
};

export default function HomePage() {
  return (
    <>
      <Hero />
      <SpecializationGrid />
      <CredibilityMetrics />
      <FeaturedProjects />
      <LatestArticles />
    </>
  );
}
