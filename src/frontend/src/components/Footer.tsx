import { SiDiscord, SiGithub, SiX } from "react-icons/si";

export default function Footer() {
  const year = new Date().getFullYear();
  const hostname =
    typeof window !== "undefined" ? window.location.hostname : "";

  return (
    <footer className="border-t border-border mt-16">
      <div className="mx-auto max-w-[1200px] px-6 py-10 flex flex-col sm:flex-row items-start justify-between gap-8">
        {/* Links */}
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground mb-3">
            Links
          </p>
          <ul className="space-y-1.5">
            {["About", "Docs", "Contact"].map((l) => (
              <li key={l}>
                <a
                  href="/"
                  data-ocid={`footer.${l.toLowerCase()}.link`}
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  {l}
                </a>
              </li>
            ))}
            <li>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                data-ocid="footer.github.link"
                className="text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                GitHub
              </a>
            </li>
          </ul>
        </div>

        {/* Socials */}
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground mb-3">
            Socials
          </p>
          <div className="flex items-center gap-3">
            {[
              { Icon: SiGithub, label: "GitHub", href: "https://github.com" },
              { Icon: SiX, label: "X", href: "https://x.com" },
              {
                Icon: SiDiscord,
                label: "Discord",
                href: "https://discord.com",
              },
            ].map(({ Icon, label, href }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                data-ocid={`footer.${label.toLowerCase()}.link`}
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <Icon className="w-4 h-4" />
              </a>
            ))}
          </div>
        </div>

        {/* Copyright */}
        <div className="text-right">
          <p className="text-[10px] text-muted-foreground">
            Powered by{" "}
            <span className="font-mono text-primary/80">Fira Code</span> +{" "}
            <span className="font-mono text-primary/80">General Sans</span>
          </p>
          <p className="text-[10px] text-muted-foreground mt-1">
            © {year}.{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(hostname)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary transition-colors"
            >
              Built with ♥ using caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
