import { FileSearch } from "lucide-react";
import { motion } from "motion/react";
import { useMemo, useState } from "react";
import Footer from "./components/Footer";
import Header from "./components/Header";
import Hero from "./components/Hero";
import Sidebar from "./components/Sidebar";
import SolutionCard from "./components/SolutionCard";
import SolutionModal from "./components/SolutionModal";
import { solutions } from "./data/solutions";
import type { JavaSolution } from "./data/solutions";

type Difficulty = "all" | "beginner" | "intermediate" | "advanced";

export default function App() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedDifficulty, setSelectedDifficulty] =
    useState<Difficulty>("all");
  const [activeSolution, setActiveSolution] = useState<JavaSolution | null>(
    null,
  );

  const filtered = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return solutions.filter((s) => {
      const matchesSearch =
        !q ||
        s.title.toLowerCase().includes(q) ||
        s.problem.toLowerCase().includes(q) ||
        s.explanation.toLowerCase().includes(q) ||
        s.tags.some((t) => t.toLowerCase().includes(q)) ||
        s.category.toLowerCase().includes(q);
      const matchesCategory =
        selectedCategory === "all" || s.category === selectedCategory;
      const matchesDifficulty =
        selectedDifficulty === "all" || s.difficulty === selectedDifficulty;
      return matchesSearch && matchesCategory && matchesDifficulty;
    });
  }, [searchQuery, selectedCategory, selectedDifficulty]);

  const handleBrowseAll = () => {
    setSearchQuery("");
    setSelectedCategory("all");
    setSelectedDifficulty("all");
    window.scrollTo({ top: 300, behavior: "smooth" });
  };

  const hasActiveFilters =
    searchQuery !== "" ||
    selectedCategory !== "all" ||
    selectedDifficulty !== "all";

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header onBrowseAll={handleBrowseAll} />

      <main>
        <Hero
          searchQuery={searchQuery}
          onSearch={setSearchQuery}
          onBrowseAll={handleBrowseAll}
          totalCount={solutions.length}
        />

        {/* Main content */}
        <div className="mx-auto max-w-[1200px] px-6 pb-8">
          {/* Result count */}
          <div className="flex items-center justify-between mb-6">
            <p className="text-xs text-muted-foreground">
              Showing{" "}
              <span className="text-foreground font-medium">
                {filtered.length}
              </span>{" "}
              of{" "}
              <span className="text-foreground font-medium">
                {solutions.length}
              </span>{" "}
              solutions
            </p>
            {hasActiveFilters && (
              <button
                type="button"
                data-ocid="filters.clear.button"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("all");
                  setSelectedDifficulty("all");
                }}
                className="text-xs text-primary hover:text-accent transition-colors"
              >
                Clear filters
              </button>
            )}
          </div>

          <div className="flex gap-6 items-start">
            {/* Sidebar */}
            <Sidebar
              solutions={solutions}
              selectedCategory={selectedCategory}
              selectedDifficulty={selectedDifficulty}
              onCategoryChange={setSelectedCategory}
              onDifficultyChange={setSelectedDifficulty}
            />

            {/* Grid */}
            <div className="flex-1 min-w-0">
              {filtered.length === 0 ? (
                <motion.div
                  data-ocid="solutions.empty_state"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center justify-center py-20 text-center"
                >
                  <div className="w-14 h-14 rounded-xl bg-card border border-border flex items-center justify-center mb-4">
                    <FileSearch className="w-7 h-7 text-muted-foreground" />
                  </div>
                  <p className="text-sm font-medium text-foreground mb-1">
                    No solutions found
                  </p>
                  <p className="text-xs text-muted-foreground max-w-xs">
                    Try adjusting your search term or removing filters.
                  </p>
                </motion.div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                  {filtered.map((solution, idx) => (
                    <SolutionCard
                      key={solution.id}
                      solution={solution}
                      index={idx}
                      onReadMore={setActiveSolution}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />

      <SolutionModal
        solution={activeSolution}
        onClose={() => setActiveSolution(null)}
      />
    </div>
  );
}
