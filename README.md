# AI Spend Audit

AI Spend Audit helps startup teams analyze their monthly spend on AI tools like Cursor, Claude, ChatGPT, Gemini, and Copilot, WIndsurf and V0.

Users receive an instant audit showing overspending, plan recommendations, estimated savings, benchmark comparisons, and a shareable public report.

## Features

- Multi-tool spend input
- Audit engine
- Savings recommendations
- AI-generated summary
- Benchmark mode
- Email capture + confirmation (check the spam folder for email)
- Shareable result URL
- PDF export

## Screenshots (Attached in Public Folder)

Landing page

Audit form

Results page

Benchmark mode

Recommendations 

Email confirmation

## Local Setup

npm install

npm run dev

## Deployment

Hosted on Vercel

## Decisions

1. Next.js over React SPA because routing + server rendering.
2. Firebase over Supabase because faster setup.
3. Hardcoded pricing logic over AI for audit math.
4. Gemini for summary because free quota.
5. Browser print for PDF for reliability.

## Live App

https://ai-spend-audit-indol-iota.vercel.app/
