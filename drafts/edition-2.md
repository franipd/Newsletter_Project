# The Daily Stack — Edition №2 (draft)

**Date:** Friday, July 11, 2026
**Status:** Draft — review, then run `edition-2.sql` in the Supabase SQL editor

---

## AI/ML

### GPT-5.6 exits preview with three-tier pricing across Sol, Terra, Luna
OpenAI released GPT-5.6 in three tiers on July 9, following a government safety review that closed out the restricted preview period. Sol targets top reasoning and coding at $5/$30 per million tokens, Terra matches GPT-5.5 performance at roughly half the cost, and Luna offers a low-cost tier at $1/$6.
— Engadget · https://www.engadget.com/2210308/openai-rolls-out-gpt5-6-july-9/

### Grok 4.5 undercuts Opus 4.7 on price for coding and agentic work
xAI launched Grok 4.5 on July 8 at $2/$6 per million tokens, well below Opus 4.7's $5/$25. Musk positioned it as "Opus-class" but faster and more token-efficient, with early availability in Grok Build, Cursor, and the SpaceXAI console.
— TechCrunch · https://techcrunch.com/2026/07/08/spacexai-releases-grok-4-5-which-elon-describes-as-an-opus-class-model/

## Security

### Linux "Bad Epoll" flaw lets unprivileged users gain root
CVE-2026-46242 is a use-after-free race condition in the epoll subsystem affecting Linux 6.4+ and Android, exploitable to root with reported 99% reliability. Kernel maintainers patched it in April; distributions still need to backport the fix. No active exploitation has been observed yet, but the near-certain reliability makes prompt patching a priority.
— Security Affairs · https://securityaffairs.com/194795/hacking/bad-epoll-flaw-gives-attackers-root-access-on-linux-and-android.html

### TanStack npm packages hit by GitHub Actions cache-poisoning worm
On May 11, attackers exploited a misconfigured pull_request_target workflow to poison the pnpm cache, publishing 84 malicious versions across 42 @tanstack packages complete with valid SLSA provenance. The worm harvested cloud credentials and self-propagated to over 200 additional npm packages before external researchers caught it within 20 minutes. The incident underscores that provenance attestations alone don't guarantee a package is safe.
— Snyk · https://snyk.io/blog/tanstack-npm-packages-compromised/

## DevTools

### TypeScript 7.0 ships native Go compiler, 8-12x faster builds
Microsoft released TypeScript 7.0 on July 8 as a complete native Go rewrite of the compiler, cutting VS Code's build time from 125.7s to 10.6s and delivering up to 16.7x speedups with parallel compilation enabled. Memory usage dropped 6-26% depending on project size, and the release adds a rebuilt watch mode plus new `--checkers`/`--builders` parallelization controls with stricter default settings.
— TypeScript · https://devblogs.microsoft.com/typescript/announcing-typescript-7-0/

### VS Code 1.128 adds multi-chat agent sessions, Copilot Vision GA
VS Code 1.128, released July 8, introduces multi-chat agent sessions in Claude workspaces so developers can run and compare parallel conversations. Copilot Vision image/PDF support is now generally available, alongside OS-level keyboard shortcuts and new tab-placement controls.
— VS Code · https://code.visualstudio.com/updates/v1_128

## Infrastructure/Cloud

### AWS raises GPU Capacity Block prices 20 percent, second hike this year
AWS increased pricing for GPU-backed EC2 Capacity Blocks by roughly 20 percent effective July 1, following a 15 percent increase in January. The move reflects continued GPU supply constraints amid AWS's $200 billion 2026 AI infrastructure buildout; Capacity Block pricing is reviewed quarterly based on supply and demand.
— AI Weekly · https://aiweekly.co/alerts/aws-raises-ec2-gpu-capacity-block-prices-20-from-july-1

### AWS Graviton5-based C9g instances now generally available
AWS's new C9g and C9gd instances, powered by Graviton5 processors, are generally available across all commercial regions, offering up to 25 percent better compute performance than Graviton4 and 5x larger cache. C9gd variants add optional local NVMe storage for I/O-intensive workloads.
— AWS Weekly Roundup · https://aws.amazon.com/blogs/aws/aws-weekly-roundup-claude-sonnet-5-on-aws-amazon-workspaces-for-ai-agents-aws-service-availability-updates-and-more-july-6-2026/

## Industry & Business

### Microsoft cuts 4,800 jobs, guts Xbox as margins lag rest of business
Microsoft eliminated 2.1 percent of its workforce on July 6, with Xbox alone losing 3,200 positions—20 percent of the division—by the end of fiscal 2027. CEO Asha Sharma cited Xbox margins running 3-10x lower than comparable businesses; the company is also spinning off or selling four studios, including Ninja Theory and Double Fine, and flattening management to five layers.
— TechCrunch · https://techcrunch.com/2026/07/06/microsoft-lays-off-nearly-5000-employees-across-xbox-commercial-sales/

### Apple sues OpenAI over alleged theft of hardware trade secrets
Apple filed suit on July 10 against OpenAI and two former Apple employees, Chang Liu and Tang Tan, alleging systematic theft of confidential hardware designs, engineering specs, and unreleased product data. The suit follows OpenAI's $6.4B acquisition of Jony Ive's IO Products last year as it moves into hardware.
— CNBC · https://www.cnbc.com/2026/07/10/apple-openai-lawsuit-trade-secrets.html

---

## Editor's notes

- TypeScript 7 was surfaced by both the AI/ML and DevTools curators; kept once, in DevTools.
- AI/ML: kept GPT-5.6 (pricing/tier decision practitioners must make now) and Grok 4.5; dropped Ollama funding and Meta's Muse Spark API as lower urgency.
- Security: kept Bad Epoll (broad root-escalation risk) and the TanStack supply-chain worm; SharePoint KEV entry was the closest runner-up.
- DevTools: dropped Node.js 26.5.0 and Eclipse Theia 1.73 — smaller share of daily workflows than TypeScript 7 and VS Code 1.128.
- Infrastructure: the two AWS stories beat Microsoft 365 pricing (narrower dev audience) and Nebius Aether 3.6.
