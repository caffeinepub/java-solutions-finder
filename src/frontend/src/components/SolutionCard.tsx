import { motion } from "motion/react";
import type { JavaSolution } from "../data/solutions";

interface SolutionCardProps {
  solution: JavaSolution;
  index: number;
  onReadMore: (s: JavaSolution) => void;
}

const DIFFICULTY_STYLES: Record<string, string> = {
  beginner: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
  intermediate: "text-amber-400 bg-amber-400/10 border-amber-400/20",
  advanced: "text-orange-400 bg-orange-400/10 border-orange-400/20",
};

export default function SolutionCard({
  solution,
  index,
  onReadMore,
}: SolutionCardProps) {
  const previewLines = solution.codeSnippet
    .split("\n")
    .filter((l) => l.trim())
    .slice(0, 5)
    .join("\n");

  return (
    <motion.article
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.04, ease: "easeOut" }}
      data-ocid={`solutions.item.${index + 1}`}
      className="card-hover rounded-xl border border-border bg-card flex flex-col overflow-hidden"
    >
      {/* Header */}
      <div className="px-4 pt-4 pb-3">
        <div className="flex items-start justify-between gap-3 mb-2">
          <h3 className="text-sm font-semibold text-foreground leading-snug line-clamp-2">
            {solution.title}
          </h3>
          <span
            className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border shrink-0 capitalize ${
              DIFFICULTY_STYLES[solution.difficulty]
            }`}
          >
            {solution.difficulty}
          </span>
        </div>
        <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
          {solution.problem}
        </p>
      </div>

      {/* Code preview */}
      <div className="mx-4 mb-3 rounded-lg overflow-hidden border border-border/60">
        <pre
          className="bg-code text-[11px] font-mono text-emerald-300/80 p-3 overflow-hidden leading-relaxed"
          style={{ maxHeight: "90px" }}
        >
          <code>{previewLines}</code>
        </pre>
      </div>

      {/* Tags */}
      <div className="px-4 mb-4 flex flex-wrap gap-1.5">
        {solution.tags.slice(0, 3).map((tag) => (
          <span
            key={tag}
            className="text-[10px] px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground border border-border/50"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Footer */}
      <div className="mt-auto px-4 pb-4 flex items-center justify-between">
        <span className="text-[10px] text-muted-foreground">
          {solution.category}
        </span>
        <button
          type="button"
          data-ocid={`solutions.read_more.button.${index + 1}`}
          onClick={() => onReadMore(solution)}
          className="text-xs font-semibold text-primary hover:text-accent border border-primary/30 hover:border-primary/60 px-3 py-1 rounded-pill transition-colors"
        >
          Read More
        </button>
      </div>
    </motion.article>
  );
}
