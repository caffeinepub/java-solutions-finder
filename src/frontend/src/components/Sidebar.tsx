import { CATEGORIES } from "../data/solutions";
import type { JavaSolution } from "../data/solutions";

type Difficulty = "all" | "beginner" | "intermediate" | "advanced";

interface SidebarProps {
  solutions: JavaSolution[];
  selectedCategory: string;
  selectedDifficulty: Difficulty;
  onCategoryChange: (c: string) => void;
  onDifficultyChange: (d: Difficulty) => void;
}

const DIFFICULTIES: { value: Difficulty; label: string }[] = [
  { value: "all", label: "All Levels" },
  { value: "beginner", label: "Beginner" },
  { value: "intermediate", label: "Intermediate" },
  { value: "advanced", label: "Advanced" },
];

export default function Sidebar({
  solutions,
  selectedCategory,
  selectedDifficulty,
  onCategoryChange,
  onDifficultyChange,
}: SidebarProps) {
  const categoryCounts = CATEGORIES.reduce<Record<string, number>>(
    (acc, cat) => {
      acc[cat] = solutions.filter((s) => s.category === cat).length;
      return acc;
    },
    {},
  );

  const totalCount = solutions.length;

  return (
    <aside className="w-60 shrink-0 space-y-4">
      {/* Categories */}
      <div className="rounded-xl border border-border bg-card p-4">
        <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground mb-3">
          Categories
        </p>
        <ul className="space-y-0.5">
          <li>
            <button
              type="button"
              data-ocid="sidebar.categories.all.button"
              onClick={() => onCategoryChange("all")}
              className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs transition-colors ${
                selectedCategory === "all"
                  ? "bg-primary/10 text-primary font-semibold"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
              }`}
            >
              <span>All Categories</span>
              <span className="text-[10px] opacity-70">{totalCount}</span>
            </button>
          </li>
          {CATEGORIES.map((cat) => (
            <li key={cat}>
              <button
                type="button"
                data-ocid={`sidebar.${cat.toLowerCase().replace(/\s+/g, "_").replace(/\//g, "")}.button`}
                onClick={() => onCategoryChange(cat)}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs transition-colors ${
                  selectedCategory === cat
                    ? "bg-primary/10 text-primary font-semibold"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                }`}
              >
                <span>{cat}</span>
                <span className="text-[10px] opacity-70">
                  {categoryCounts[cat] ?? 0}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Difficulty */}
      <div className="rounded-xl border border-border bg-card p-4">
        <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground mb-3">
          Difficulty
        </p>
        <div
          className="space-y-1.5"
          role="radiogroup"
          aria-label="Filter by difficulty"
        >
          {DIFFICULTIES.map(({ value, label }) => (
            <label
              key={value}
              className="flex items-center gap-2.5 cursor-pointer group"
            >
              <input
                data-ocid={`sidebar.difficulty.${value}.radio`}
                type="radio"
                name="difficulty"
                value={value}
                checked={selectedDifficulty === value}
                onChange={() => onDifficultyChange(value)}
                className="sr-only"
              />
              <span
                className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center shrink-0 transition-colors ${
                  selectedDifficulty === value
                    ? "border-primary bg-primary"
                    : "border-border group-hover:border-primary/50"
                }`}
              >
                {selectedDifficulty === value && (
                  <span className="w-1.5 h-1.5 rounded-full bg-primary-foreground" />
                )}
              </span>
              <span
                className={`text-xs transition-colors ${
                  selectedDifficulty === value
                    ? "text-foreground font-medium"
                    : "text-muted-foreground group-hover:text-foreground"
                }`}
              >
                {label}
              </span>
            </label>
          ))}
        </div>
      </div>
    </aside>
  );
}
