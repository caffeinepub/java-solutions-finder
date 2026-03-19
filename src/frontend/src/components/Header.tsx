import { Search, Settings } from "lucide-react";

interface HeaderProps {
  onBrowseAll: () => void;
}

export default function Header({ onBrowseAll }: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-[oklch(0.13_0.008_195/0.95)] backdrop-blur-md">
      <div className="mx-auto max-w-[1200px] px-6 flex items-center justify-between h-14">
        {/* Logo */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="w-7 h-7 rounded-md bg-primary/10 border border-primary/40 flex items-center justify-center">
            <Settings className="w-4 h-4 text-primary" strokeWidth={1.5} />
          </div>
          <span className="font-semibold text-sm text-foreground tracking-tight">
            Java Solutions Finder
          </span>
        </div>

        {/* Nav */}
        <nav
          className="hidden md:flex items-center gap-6"
          aria-label="Main navigation"
        >
          {["Home", "Problems", "Categories", "Guides"].map((link) => (
            <a
              key={link}
              href="/"
              data-ocid={`nav.${link.toLowerCase()}.link`}
              className={`text-xs font-medium transition-colors ${
                link === "Home"
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {link}
            </a>
          ))}
        </nav>

        {/* Right actions */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            aria-label="Search"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <Search className="w-4 h-4" />
          </button>
          <button
            type="button"
            data-ocid="nav.browse_all.button"
            onClick={onBrowseAll}
            className="text-xs font-semibold px-4 py-1.5 rounded-pill bg-primary text-primary-foreground hover:bg-accent transition-colors"
          >
            Browse All
          </button>
        </div>
      </div>
    </header>
  );
}
