# J|13 Dealer Academy

Member platform for Janda Dealer Training. Built on React + Vite + Chakra UI v2 + Supabase + Netlify Functions.

## Architecture

The Academy is a multi-tenant B2B SaaS application. Dealerships sign up, add employee seats, and access training content organized by department.

- **Dealerships** are the primary entity. A dealership has a subscription and multiple seats.
- **Users** belong to a dealership and have a role (owner, manager, employee, admin).
- **Courses** organize lessons by department (Sales, F&I, Service, Parts, Management).
- **KPIs** are tracked per dealership, linked back to training content that addresses each metric.

## Stack

- React 18.3 + Vite 5
- Chakra UI v2 for the design system
- Supabase for auth and database
- Netlify for hosting and serverless functions
- Resend for transactional email
- Vimeo for video hosting
- Anthropic Claude API for AI coaching (future)

## Local Development

\`\`\`bash
yarn install
cp .env.example .env.local
# Fill in Supabase keys in .env.local
yarn dev
\`\`\`

Runs on http://localhost:3001

## Deployment

Pushes to \`main\` auto-deploy to academy.jandatraining.com via Netlify.

## Sibling Apps

- jandatraining.com — public marketing site
- pulse.jandatraining.com — Jazz's admin dashboard (separate repo)
