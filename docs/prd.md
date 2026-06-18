# PRD: The Daily Stack — A Finite Daily Tech News Edition

---

### 1. Problem Statement

Tech professionals need to stay current, but the current landscape forces a choice between doomscrolling infinite feeds or falling behind entirely. The same stories are fragmented across Hacker News, X, Reddit, LinkedIn, newsletters, and vendor blogs — buried in hype, duplicated endlessly, with no signal that you're done for the day. There is no calm, finite, curated daily read built for practitioners the way a morning newspaper once worked. The "you're done" moment is the missing product.

---

### 2. Goals

1. Achieve a next-day return rate of 30%+ within 30 days of launch
2. Drive edition completion (reading/scanning the full daily edition) above 60% for returning users within 60 days
3. Reach a DAU/WAU ratio of 0.4+ within 90 days — indicating genuine daily habit formation
4. Achieve digest signups of 500+ within the first 4 weeks as a commitment signal
5. Achieve click-through rate on article cards of 20%+ within 30 days, signalling curation quality

---

### 3. Non-Goals

- **Not a news aggregator or feed** — no infinite scroll, no algorithmic ranking, no "more stories"
- **Not a publisher** — The Daily Stack summarises and links out; it does not republish full articles or host original reporting
- **Not for a general audience** — editorial voice and section selection targets practitioners, not business readers, hobbyists, or general tech consumers
- **Not personalized (v1)** — no user-level filtering, topic preferences, or reading history tracking in v1
- **Not a social product** — no comments, shares, reactions, or follower graphs in this version
- **Not real-time** — this is a once-daily edition; breaking news is not a goal
- **No games or puzzles** — removed from scope; the finite edition format alone carries the ritual

---

### 4. Users & Use Cases

**Scenario 1 — The morning ritual**
A senior software engineer opens The Daily Stack at 8am with coffee. She scans the front page — 10 curated stories across five sections — reads two summaries fully, clicks through to one source. By 8:15am she closes the tab. She knows what moved in her field today and didn't spend an hour on Twitter to find out.

**Scenario 2 — The decision-support scan**
An engineering manager needs context before a 10am architecture review. He opens the Infrastructure/Cloud section, skims three cards, and gets enough signal to speak credibly to the tradeoffs being discussed. He didn't need to subscribe to a fifth newsletter or trust a vendor blog.

**Scenario 3 — The habit-building student**
A CS student preparing for her first job checks The Daily Stack each morning as a deliberate practice — the same way she checks the weather. The finite format makes it feel achievable, not overwhelming. After two weeks, she's formed a daily habit without burning out on feeds.

---

### 5. User Stories

**Must-have**

- As a tech professional, I want to see a dated daily edition with exactly 10 stories so that I know when I'm done reading for the day
- As a reader, I want stories organised into sections (AI/ML, Security, DevTools, Infrastructure/Cloud, Industry & Business) so that I can scan the areas most relevant to me
- As a reader, I want each article card to show a headline, short summary, source name, and link so that I can decide whether to click through without leaving the page
- As a reader, I want section navigation that anchor-scrolls me to the right part of the page so that I can jump directly to my priority sections

**Should-have**

- As a reader, I want to sign up for a daily digest email so that the edition comes to me even on days I forget to visit
- As a returning user, I want to see the date and edition number prominently so that the product feels like a real publication
- As a reader, I want clicking an outbound link to open the source in a new tab without losing my place in the edition

**Nice-to-have**

- As a reader, I want to save an article card to read later so that I don't lose links mid-morning
- As a reader, I want to share the day's edition link so that I can recommend it to a colleague

---

### 6. Acceptance Criteria

**Daily edition — front page**
- Given a user visits the site on any day, when the page loads, then they see a dated front page (e.g. "Monday, June 16 — Edition #1") with exactly 10 curated stories and no infinite scroll or "load more" option
- Given no new edition has been published yet today, when the page loads, then the most recent published edition is shown with its original date clearly visible

**Section structure**
- Given a user is on the front page, when they view the layout, then stories are visibly grouped into five labelled sections: AI/ML, Security, DevTools, Infrastructure/Cloud, Industry & Business
- Given a user clicks a section label in the navigation, when the page responds, then the page anchor-scrolls to that section

**Article cards**
- Given a story is displayed, when a user views the card, then it shows: headline, 2-4 sentence summary, source name, and a link that opens the original article in a new tab
- Given a user clicks the outbound link, when they return to The Daily Stack, then their scroll position in the edition is preserved

**Digest signup**
- Given a user wants to receive the daily edition by email, when they enter their email and submit the signup form, then they receive a confirmation and are added to the digest list
- Given a new edition is published, when the digest send is triggered, then subscribers receive the edition within 1 hour of publish

---

### 7. Risks & Assumptions

| **Risks** | **Assumptions** |
|---|---|
| Fully automated curation may produce lower-quality summaries or miss important stories without a human editorial check | [ASSUMPTION] LLM-generated summaries are good enough for v1 without human review; quality will be evaluated post-launch |
| Outbound links mean The Daily Stack controls none of the reading experience — broken or paywalled sources hurt trust | [ASSUMPTION] The majority of linked sources are accessible without a paywall for most readers |
| Manual publish means editions can be missed or delayed if the publisher is unavailable | [ASSUMPTION] One person can reliably publish each edition; no redundancy needed in v1 |
| Competitor newsletters (TLDR, The Pragmatic Engineer, Morning Brew Tech) have large existing audiences — differentiation must be felt, not just described | [ASSUMPTION] The finite "you're done" framing is meaningfully different from competitors and users will feel it immediately |
| The five sections may not match what practitioners actually care about — hard to validate without real usage data | [ASSUMPTION] The five proposed sections cover primary practitioner interests without needing personalisation in v1 |
| A newspaper-style visual design (serif headlines, rule lines, muted accent color) may not resonate with a practitioner audience used to product-style UIs — hard to validate without user feedback | [ASSUMPTION] Leaning visually into the "morning newspaper" metaphor (implemented in v1) reinforces the finite-edition concept rather than feeling old-fashioned or off-brand for a tech audience |

---

### 8. Open Questions

1. **What is the automated curation pipeline?** Which sources does it pull from, what LLM is used for summarisation, and where does it output the draft edition? — Owner: [NEEDS INPUT]
2. **What is the digest email tool?** Recommendation: start with Resend or Buttondown — both have free tiers, easy APIs, and take under an hour to set up. — Owner: [NEEDS INPUT]
3. **What triggers a publish?** Is there a CMS, an admin page, or does the publisher edit a config file and redeploy? — Owner: [NEEDS INPUT]
4. **How are sources selected and weighted?** Does the automation pull from a fixed source list, or does it discover sources dynamically? Who maintains that list? — Owner: [NEEDS INPUT]

---

### 9. Success Metrics

**North-star (v1)**
- **Next-day return rate** — % of Day 1 visitors who return on Day 2. Target: 30%+ within 30 days of launch.

**Leading indicators (early signals)**
- Time-on-page — a 10-15 minute session suggests genuine reading, not a bounce
- Digest signups per day — early signal of "I want to commit to this"
- Click-through rate on article cards — signals curation quality; target 20%+

**Lagging indicators (ritual formation)**
- Edition completion rate — % of the edition a typical user reads/scans; target 60%+ for returning users at 60 days
- DAU/WAU ratio — target 0.4+ at 90 days
- 7-day streak rate — % of users who return 7 days in a row within their first 30 days
