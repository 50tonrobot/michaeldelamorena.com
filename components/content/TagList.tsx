import { Badge } from "@/components/ui/badge";

interface TagListProps {
  tags: string[];
  className?: string;
}

export function TagList({ tags, className }: TagListProps) {
  return (
    <ul
      role="list"
      aria-label="Tags"
      className={`flex flex-wrap gap-2 ${className ?? ""}`}
    >
      {tags.map((tag) => (
        <li key={tag}>
          <Badge
            variant="secondary"
            className="bg-zinc-800 text-zinc-300 hover:bg-zinc-700 text-xs"
          >
            {tag}
          </Badge>
        </li>
      ))}
    </ul>
  );
}
