export interface BlogFrontmatter {
  title: string;
  description: string;
  date: string;
  tags: string[];
  featured: boolean;
  draft: boolean;
}

export interface ProjectFrontmatter {
  title: string;
  description: string;
  date: string;
  tags: string[];
  featured: boolean;
  order: number;
  draft?: boolean; // optional — omitting from frontmatter defaults to published
}

export interface BlogPost {
  slug: string;
  frontmatter: BlogFrontmatter;
  readingTime: string;
}

export interface Project {
  slug: string;
  frontmatter: ProjectFrontmatter;
}
