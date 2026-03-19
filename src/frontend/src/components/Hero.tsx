import { Search } from "lucide-react";
import { motion } from "motion/react";

interface HeroProps {
  searchQuery: string;
  onSearch: (q: string) => void;
  onBrowseAll: () => void;
  totalCount: number;
}

export default function Hero({
  searchQuery,
  onSearch,
  onBrowseAll,
  totalCount,
}: HeroProps) {
  return (
    <section className="px-6 pt-10 pb-8">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        className="mx-auto max-w-[1200px]"
      >
        <div
          className="rounded-xl border border-border bg-card px-8 py-10"
          style={{ boxShadow: "0 4px 40px oklch(0 0 0 / 0.5)" }}
        >
          {/* Search */}
          <div className="relative max-w-2xl mx-auto mb-8">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              data-ocid="hero.search_input"
              type="text"
              value={searchQuery}
              onChange={(e) => onSearch(e.target.value)}
              placeholder="Search Java topics, errors, concepts…"
              className="w-full pl-11 pr-5 py-3 rounded-pill bg-background border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/40 focus:border-primary/50 transition-all"
            />
          </div>

          {/* Headline */}
          <div className="text-center">
            <h1 className="text-3xl font-bold text-foreground mb-3 leading-tight">
              Find Java Solutions Fast
            </h1>
            <p className="text-sm text-muted-foreground max-w-lg mx-auto leading-relaxed mb-6">
              Browse {totalCount} curated solutions for common Java problems —
              from Collections and Streams to Design Patterns and Concurrency.
            </p>
            <button
              type="button"
              data-ocid="hero.browse_all.primary_button"
              onClick={onBrowseAll}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-pill bg-primary text-primary-foreground text-sm font-semibold hover:bg-accent transition-colors"
            >
              Browse All Solutions
            </button>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
