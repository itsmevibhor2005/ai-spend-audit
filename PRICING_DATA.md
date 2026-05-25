# Pricing Sources

Verified: 2026-05-26

All pricing was checked using official vendor pricing pages where available.

---

## Cursor

Plans used:

- Hobby — Free
- Pro — $20/user/month
- Business — $40/user/month
- Enterprise — Contact sales

Official pricing:

https://cursor.com/pricing

Reference:

Cursor pricing page and models documentation.

---

## ChatGPT

Plans used:

- Plus — $20/user/month
- Team / Business — $30/user/month
- Enterprise — Contact sales

Official pricing:

https://openai.com/business/chatgpt-pricing/

API pricing:

https://openai.com/api/pricing/

---

## Claude

Plans used:

- Free — $0
- Pro — $20/month
- Max — $100+/month
- Team — Contact sales
- Enterprise — Contact sales

Official pricing:

https://claude.com/pricing

Max plan reference:

https://support.claude.com/en/articles/11049741-what-is-the-max-plan

API pricing:

https://platform.claude.com/docs/en/about-claude/pricing

---

## GitHub Copilot

Plans used:

- Free
- Individual / Pro — $10/month
- Business — $19/month
- Enterprise — $39/month

Official pricing:

https://github.com/features/copilot/plans

Reference:

https://docs.github.com/en/copilot/get-started/plans

---

## Gemini

Plans used:

- Pro
- Ultra
- Gemini API

Official Gemini plans:

https://gemini.google.com/

Google AI plans:

https://one.google.com/about/google-ai-plans/

Gemini API pricing:

https://ai.google.dev/gemini-api/docs/pricing

---

## Anthropic API

Usage based

Official pricing:

https://platform.claude.com/docs/en/about-claude/pricing

---

## OpenAI API

Usage based

Official pricing:

https://openai.com/api/pricing/

---

## Windsurf

Plans used:

- Free - $0/month
- Pro - $20/user/month

Official pricing:

https://windsurf.com/pricing

---

## v0

Plans used:

- Free - $0/month
- Premium - $30/user/month

Official pricing:

https://v0.dev/pricing

---

# Notes

## Variable pricing

Some tools are usage based:

- Gemini API
- OpenAI API
- Anthropic API

These depend on:

- token usage
- requests
- workload

and do not map cleanly to one monthly number.

## Enterprise pricing

Enterprise pricing is often custom and depends on:

- team size
- support
- security requirements
- contract terms

## Estimated values used in `pricing.ts`

For plans where pricing is:

- usage based
- enterprise/custom
- not publicly fixed

I added estimated monthly values in `pricing.ts`.

These estimated values are only used to:

- compare tools consistently
- generate recommendations
- estimate approximate savings

Examples:

- OpenAI API
- Anthropic API
- Gemini API
- Enterprise tiers

Whenever public fixed pricing existed, I used official listed pricing directly.

Whenever pricing was variable or unavailable, I used conservative estimated values so the audit engine remains consistent and usable.
