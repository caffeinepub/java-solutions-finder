import { X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import type { JavaSolution } from "../data/solutions";

interface SolutionModalProps {
  solution: JavaSolution | null;
  onClose: () => void;
}

const DIFFICULTY_STYLES: Record<string, string> = {
  beginner: "text-emerald-400 bg-emerald-400/10 border-emerald-400/25",
  intermediate: "text-amber-400 bg-amber-400/10 border-amber-400/25",
  advanced: "text-orange-400 bg-orange-400/10 border-orange-400/25",
};

export default function SolutionModal({
  solution,
  onClose,
}: SolutionModalProps) {
  return (
    <AnimatePresence>
      {solution && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-background/70 backdrop-blur-sm"
            aria-hidden="true"
          />

          {/* Panel — uses motion.dialog for semantic correctness */}
          <motion.dialog
            key="modal"
            open
            data-ocid="solutions.modal"
            aria-label={solution.title}
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-2xl bg-card border-l border-border flex flex-col p-0 m-0 max-h-none h-full"
            style={{ maxHeight: "100dvh" }}
          >
            {/* Modal header */}
            <div className="flex items-start justify-between p-6 border-b border-border shrink-0">
              <div className="flex-1 pr-4">
                <div className="flex items-center gap-2 mb-2">
                  <span
                    className={`text-[10px] font-semibold px-2.5 py-1 rounded-full border capitalize ${
                      DIFFICULTY_STYLES[solution.difficulty]
                    }`}
                  >
                    {solution.difficulty}
                  </span>
                  <span className="text-[10px] text-muted-foreground border border-border px-2.5 py-1 rounded-full">
                    {solution.category}
                  </span>
                </div>
                <h2 className="text-lg font-bold text-foreground leading-snug">
                  {solution.title}
                </h2>
              </div>
              <button
                type="button"
                data-ocid="solutions.modal.close_button"
                onClick={onClose}
                aria-label="Close"
                className="text-muted-foreground hover:text-foreground transition-colors mt-0.5"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin">
              {/* Problem */}
              <section>
                <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground mb-2">
                  Problem
                </p>
                <p className="text-sm text-foreground leading-relaxed">
                  {solution.problem}
                </p>
              </section>

              {/* Explanation */}
              <section>
                <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground mb-2">
                  Explanation
                </p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {solution.explanation}
                </p>
              </section>

              {/* Code */}
              <section>
                <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground mb-2">
                  Code Snippet
                </p>
                <div className="rounded-xl overflow-hidden border border-border/60">
                  <div className="flex items-center gap-1.5 px-4 py-2.5 bg-secondary/30 border-b border-border/60">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500/60" />
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/60" />
                    <span className="ml-3 text-[10px] text-muted-foreground font-mono">
                      {solution.title.replace(/[^a-zA-Z]/g, "").slice(0, 20)}
                      .java
                    </span>
                  </div>
                  <pre className="bg-code p-5 overflow-x-auto scrollbar-thin text-[12px] font-mono text-emerald-300/80 leading-relaxed">
                    <code>{solution.codeSnippet}</code>
                  </pre>
                </div>
              </section>

              {/* Tags */}
              <section>
                <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground mb-2">
                  Tags
                </p>
                <div className="flex flex-wrap gap-2">
                  {solution.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs px-3 py-1 rounded-full bg-secondary text-secondary-foreground border border-border/50"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </section>
            </div>
          </motion.dialog>
        </>
      )}
    </AnimatePresence>
  );
}
