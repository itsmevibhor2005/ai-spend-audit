# Automated Tests

I added automated tests for the audit engine using Jest.

Run locally:

```bash
npm test
```

CI runs automatically on every push using GitHub Actions.

---

## Test 1 — Cursor overpayment detection

Input:

- Cursor Pro
- 5 seats
- monthly spend $150

Expected:

- standard price = $100
- savings = $50

Checks:

- optimizedCost
- savings
- overpayment reason

---

## Test 2 — Claude enterprise recommendation

Input:

- Claude Max
- 50 seats
- monthly spend $5000

Expected:

- recommend Enterprise
- optimized cost = $3000
- savings = $2000

Checks:

- recommendation logic for large teams

---

## Test 3 — ChatGPT pricing

Input:

- ChatGPT Plus
- 3 seats

Expected:

- current plan remains if Team pricing is significantly higher

Checks:

- avoids false upgrade

---

## Test 4 — Windsurf downgrade

Input:

- Windsurf Pro
- 2 seats

Expected:

- recommend Free
- optimized cost = $0

Checks:

- downgrade logic

---

## Test 5 — Assistant consolidation

Input:

- ChatGPT
- Claude
- Gemini

Expected:

- keep cheapest
- suggest removing overlap

Checks:

- consolidation recommendation
- savings calculation

---

## Test 6 — Enterprise opportunity

Input:

High total monthly spend across tools

Expected:

- show enterprise opportunity card

Checks:

- overall spend threshold logic

---

## Continuous Integration

CI is configured in:

```txt
.github/workflows/ci.yml
```

On every push:

- install dependencies
- run lint
- run tests
- run production build

This ensures the project stays deployable and prevents regressions.