-- The Daily Stack — seed data for Supabase
-- Run this AFTER schema.sql, in the Supabase SQL editor.
-- Inserts Edition #1 (matching src/data/seed-edition.ts) so the site
-- has real database content immediately after connecting Supabase.

with new_edition as (
  insert into editions (date, edition_number)
  values ('2026-06-18', 1)
  on conflict (date) do nothing
  returning id
)
insert into stories (edition_id, section, headline, summary, source_name, source_url)
select id, s.section, s.headline, s.summary, s.source_name, s.source_url
from new_edition,
(values
  ('AI/ML', 'Anthropic ships Claude Opus 4.8 with longer context windows',
   'The new model extends usable context length and improves tool-use reliability in agentic workflows. Early benchmarks show meaningful gains on long-document reasoning tasks. Available now via the API and Claude Code.',
   'Anthropic Blog', 'https://www.anthropic.com'),
  ('AI/ML', 'Open-weight models close the gap on coding benchmarks',
   'A new wave of open-weight releases are scoring within a few points of closed frontier models on SWE-bench. Researchers attribute the jump to better synthetic training data rather than scale alone.',
   'Hugging Face Blog', 'https://huggingface.co/blog'),
  ('Security', 'Critical RCE found in widely used CI/CD plugin',
   'Security researchers disclosed a remote code execution flaw affecting a popular continuous-integration plugin used by thousands of pipelines. A patch is available; teams are urged to update immediately.',
   'The Hacker News', 'https://thehackernews.com'),
  ('Security', 'CISA adds new flaw to known-exploited vulnerabilities list',
   'Federal agencies have a short compliance window to patch a vulnerability already being exploited in the wild. Security teams outside government are advised to treat the deadline as a de facto industry standard.',
   'CISA', 'https://www.cisa.gov'),
  ('DevTools', 'Vite ships a major release focused on cold-start performance',
   'The build tool''s latest version claims significant improvements to dev-server startup time on large monorepos. The changelog also includes a simplified plugin API.',
   'Changelog.com', 'https://changelog.com'),
  ('DevTools', 'GitHub expands Actions cache limits for free-tier repos',
   'The change is aimed at reducing CI flakiness for open-source maintainers who previously hit cache eviction mid-build. Rollout is gradual across regions this month.',
   'GitHub Blog', 'https://github.blog'),
  ('Infrastructure/Cloud', 'AWS announces cheaper egress pricing for multi-region transfers',
   'The pricing change specifically targets cross-region data transfer, a cost center many teams have flagged as opaque. Analysts say it''s a response to competitive pressure from smaller cloud providers.',
   'AWS What''s New', 'https://aws.amazon.com/new'),
  ('Infrastructure/Cloud', 'HashiCorp previews simplified Terraform state management',
   'The proposed workflow aims to reduce the operational overhead of managing remote state files across teams. It''s currently in preview and feedback is open from the community.',
   'HashiCorp Blog', 'https://www.hashicorp.com/blog'),
  ('Industry & Business', 'Layoffs slow across big tech as hiring stabilizes',
   'Quarterly filings suggest the worst of the post-pandemic correction has passed for most major tech employers. Engineering roles, in particular, show renewed posting volume relative to last year.',
   'The Register', 'https://www.theregister.com'),
  ('Industry & Business', 'Enterprise software vendors lean further into usage-based pricing',
   'More B2B SaaS companies are moving away from flat per-seat pricing toward consumption-based models, following the lead of infrastructure vendors. Analysts are split on whether this benefits buyers long-term.',
   'TechCrunch', 'https://techcrunch.com')
) as s(section, headline, summary, source_name, source_url);
