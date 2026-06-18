import { Edition } from "@/lib/types";

export const seedEdition: Edition = {
  id: "edition-1",
  date: "2026-06-18",
  editionNumber: 1,
  stories: [
    {
      id: "1",
      section: "AI/ML",
      headline: "Anthropic ships Claude Opus 4.8 with longer context windows",
      summary:
        "The new model extends usable context length and improves tool-use reliability in agentic workflows. Early benchmarks show meaningful gains on long-document reasoning tasks. Available now via the API and Claude Code.",
      sourceName: "Anthropic Blog",
      sourceUrl: "https://www.anthropic.com",
    },
    {
      id: "2",
      section: "AI/ML",
      headline: "Open-weight models close the gap on coding benchmarks",
      summary:
        "A new wave of open-weight releases are scoring within a few points of closed frontier models on SWE-bench. Researchers attribute the jump to better synthetic training data rather than scale alone.",
      sourceName: "Hugging Face Blog",
      sourceUrl: "https://huggingface.co/blog",
    },
    {
      id: "3",
      section: "Security",
      headline: "Critical RCE found in widely used CI/CD plugin",
      summary:
        "Security researchers disclosed a remote code execution flaw affecting a popular continuous-integration plugin used by thousands of pipelines. A patch is available; teams are urged to update immediately.",
      sourceName: "The Hacker News",
      sourceUrl: "https://thehackernews.com",
    },
    {
      id: "4",
      section: "Security",
      headline: "CISA adds new flaw to known-exploited vulnerabilities list",
      summary:
        "Federal agencies have a short compliance window to patch a vulnerability already being exploited in the wild. Security teams outside government are advised to treat the deadline as a de facto industry standard.",
      sourceName: "CISA",
      sourceUrl: "https://www.cisa.gov",
    },
    {
      id: "5",
      section: "DevTools",
      headline: "Vite ships a major release focused on cold-start performance",
      summary:
        "The build tool's latest version claims significant improvements to dev-server startup time on large monorepos. The changelog also includes a simplified plugin API.",
      sourceName: "Changelog.com",
      sourceUrl: "https://changelog.com",
    },
    {
      id: "6",
      section: "DevTools",
      headline: "GitHub expands Actions cache limits for free-tier repos",
      summary:
        "The change is aimed at reducing CI flakiness for open-source maintainers who previously hit cache eviction mid-build. Rollout is gradual across regions this month.",
      sourceName: "GitHub Blog",
      sourceUrl: "https://github.blog",
    },
    {
      id: "7",
      section: "Infrastructure/Cloud",
      headline: "AWS announces cheaper egress pricing for multi-region transfers",
      summary:
        "The pricing change specifically targets cross-region data transfer, a cost center many teams have flagged as opaque. Analysts say it's a response to competitive pressure from smaller cloud providers.",
      sourceName: "AWS What's New",
      sourceUrl: "https://aws.amazon.com/new",
    },
    {
      id: "8",
      section: "Infrastructure/Cloud",
      headline: "HashiCorp previews simplified Terraform state management",
      summary:
        "The proposed workflow aims to reduce the operational overhead of managing remote state files across teams. It's currently in preview and feedback is open from the community.",
      sourceName: "HashiCorp Blog",
      sourceUrl: "https://www.hashicorp.com/blog",
    },
    {
      id: "9",
      section: "Industry & Business",
      headline: "Layoffs slow across big tech as hiring stabilizes",
      summary:
        "Quarterly filings suggest the worst of the post-pandemic correction has passed for most major tech employers. Engineering roles, in particular, show renewed posting volume relative to last year.",
      sourceName: "The Register",
      sourceUrl: "https://www.theregister.com",
    },
    {
      id: "10",
      section: "Industry & Business",
      headline: "Enterprise software vendors lean further into usage-based pricing",
      summary:
        "More B2B SaaS companies are moving away from flat per-seat pricing toward consumption-based models, following the lead of infrastructure vendors. Analysts are split on whether this benefits buyers long-term.",
      sourceName: "TechCrunch",
      sourceUrl: "https://techcrunch.com",
    },
  ],
};
