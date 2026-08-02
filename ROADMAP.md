# J|13 Dealer Academy — Living Roadmap

This is the working build plan. It evolves as the product does. The governing test for every
feature comes from the Developer Context doc, page 19: does it help an employee learn the
process, practice it, help a manager inspect it, or help the dealership measure and sustain it?

Jazz's product principle (p15): build the structured J|13 content and evaluation model first.
AI operates inside that standard, never ahead of it.

## Phase 1 — Content spine + mobile revamp (IN PROGRESS)

The 13-step Roadmap to the Sale becomes the heart of the app, extracted verbatim from the
2026 master manuals into structured content.

- [x] Manuals secured outside public/ and git (`manuals/`, gitignored)
- [x] Curriculum extracted from Salesperson Workbook + Trainer Edition into structured data
- [x] Content model migration authored (`supabase/migrations/0003_j13_content_model.sql`)
- [x] Mobile-first 13-step path UI: journey view, step detail (Learn / Word Tracks / Practice / Check)
- [x] Knowledge checks with pass threshold, per-step commitment, sequential unlock
- [x] Progress store: local-first today, same interface swaps to Supabase once migration runs
- [x] Nav rework: Today, Training, Coach as the daily trio
- [x] AI coach v1: real Anthropic-powered chat grounded in J|13 content, on-task by design

## Phase 2 — Accountability + persistence

Progress becomes real data a manager can inspect.

- [ ] Tyler runs migration 0003 against fiowfatqsqagehngburd (or fixes the MCP connector org)
- [ ] Progress store swaps localStorage for Supabase tables (interface already matches)
- [ ] Manager view: team roster with per-step status, knowledge check scores, commitments
- [ ] Manager sign-off flow: role-play evaluation criteria from the Trainer Edition
- [ ] Streaks and activity computed from real events
- [ ] Coach transcripts persisted; coach memory (what the user struggled with) feeds the prompt

## Phase 3 — The management operating system

The second half of J|13. Managers get their own daily tools, not just visibility.

- [ ] Manager daily process audit (from Trainer Edition checklist)
- [ ] One-on-one guide and logging
- [ ] Assignments: manager assigns steps, practice or reassessment to individuals
- [ ] Certification: knowledge + practical evaluation + manager verification + certificate

## Phase 4 — Multi-dealership + content governance

The hardest engineering in the project. Do not rush it.

- [ ] Master vs dealership-custom content split with versioning and publishing workflow
- [ ] Dealer Admin role: invite/remove users, assign courses, store-level reporting
- [ ] Dealership customization: branding, terminology, approved local resources
- [ ] KPI scorecards using the qualified-denominator logic from the ICOR review

## Phase 5 — AI coach maturity (per Jazz's phased rollout, p15)

- [ ] Phase 1 guided practice: scenario prompts scored against specific J|13 behaviors (partially in v1)
- [ ] Phase 2 open role-play with progressive difficulty and repeat attempts
- [ ] Phase 3 manager visibility: why a score was given, what to coach next
- [ ] Phase 4 dealership-specific scenarios without altering the protected master method

## Open decisions (owned by Jazz + Tyler, not the build)

1. **Brand architecture**: public/legal relationship between Janda Dealer Training, J|13 and
   Dealer Academy. Everything public-facing inherits this.
2. **Pricing + metering**: Tier 3 AI per-salesperson vs Tier 2 per-store tension. Determines
   whether AI usage is metered per seat in the data model.
3. **Billing model**: membership structure, final tier packaging.
4. **AI data handling**: retention rules for practice data and coach transcripts.

## Standing engineering rules

- JavaScript, yarn, Chakra v2, trailing-slash routes, path comment first line of every file.
- Nav hiding is cosmetic; enforcement lives in ProtectedRoute and Supabase RLS.
- SQL ships as migration files; Tyler runs and confirms against the live project himself.
- The coach never invents product facts, rates, approvals, legal rules or dealership policy.
- Manuals never enter public/ or git.
