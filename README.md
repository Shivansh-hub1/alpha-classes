# Alpha Classes — Full Website (Frontend + Backend + SEO)

Next.js 14 website for Alpha Classes coaching institute.
Design is preserved from the approved frontend preview; everything now works for real.

## What's included

- **Landing page** — same design, now powered by the database
- **Courses** — DB-driven course listing + SEO course pages (Course structured data)
- **Free test series** — timed online tests, auto-submit, instant results, answer review, scores saved
- **Student accounts** — signup / login / logout (bcrypt + secure JWT cookies)
- **Student dashboard** — enrolled courses, test history, best score
- **Enquiry / lead capture** — contact form + per-course enquiry forms
- **Admin panel** (`/admin`) — view enquiries (with status tracking: new → contacted → joined → closed), students, test results
- **SEO** — per-page titles/descriptions, OpenGraph + Twitter cards, dynamic `sitemap.xml`, `robots.txt`, JSON-LD (EducationalOrganization + Course + FAQ), web manifest, OG image
- **Custom 404 page** — branded, matching design
- **Mobile menu** — hamburger navigation on small screens

## Environment variables (required in production)

Set these in **Vercel → Project → Settings → Environment Variables**:

| Variable | What it is |
|---|---|
| `DATABASE_URL` | Neon connection string (Neon dashboard → Connect) |
| `AUTH_SECRET` | Long random string — signs login sessions (`openssl rand -hex 32`) |
| `ADMIN_PASSWORD` | Password for the `/admin` panel |
| `NEXT_PUBLIC_SITE_URL` | Your final domain, e.g. `https://alphaclasses.com` (used for SEO/sitemap) |
| `NEXT_PUBLIC_DEMO_VIDEO_ID` | (Optional) YouTube video ID for the homepage demo popup |

> Tables and sample data (6 courses, 3 tests with real questions) are created
> automatically on the first request — no manual migration needed.

## Database

Uses **Neon Postgres** (`pg` driver). Works on Vercel out of the box.
Edit course/test content directly in `lib/db.ts` seed data (first run) or in the database afterwards.

## Deploying on Vercel

1. Push this repo to GitHub.
2. In Vercel: **Add New → Project → Import** the repo.
3. Add the environment variables above (create a free Neon project for `DATABASE_URL`).
4. Deploy. Done — every push auto-deploys.

## Structure

```
app/                  pages (App Router) + API routes
  api/                auth, enquiries, enroll, test submit, admin
components/           Header, Footer, forms, TestRunner, AdminPanel…
lib/    db.ts         database schema, seed data, queries
        auth.ts       sessions (JWT cookies), admin auth
middleware.ts         protects /dashboard
```

## Roadmap (needs client input)

- Online payments (Razorpay) for paid batches
- Video classes hosting inside course pages
- Notes/PDF downloads per course
- Teacher panel
