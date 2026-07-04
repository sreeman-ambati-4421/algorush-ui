# AlgoRush-UI

The dashboard for AlgoRush: view/analyze the `momentum` and `momentum_etf`
portfolios (multi-account), see history/scorecard analytics, and place manual
buy/sell orders. Next.js (App Router), deployed to Vercel, reading Neon
Postgres directly and calling out to [AlgoRush-API](../AlgoRush-API)'s trade
service for anything that touches the broker.

See the root of this checkout's sibling `AlgoRush-API/README.md` for the
Python side (bots, DB schema, trade service) and the full setup order.

## Local dev

```
npm install
cp .env.example .env.local   # fill in real values, or leave unset for demo mode
npm run dev
```

With no `DATABASE_URL` / `TRADE_API_URL` / `GOOGLE_CLIENT_ID` set, the app
runs in **demo mode**: sample data, no login required, trades are faked. This
is what renders if you just want to look at the UI before wiring up real
infrastructure -- see `lib/demoData.ts` and the `DEMO_MODE` checks in
`lib/db.ts`, `lib/tradeApi.ts`, and `middleware.ts`.

## Deploy

Vercel project, root directory pointed at this folder. Environment variables
from `.env.example`: `DATABASE_URL`, `NEXTAUTH_SECRET`, `NEXTAUTH_URL`,
`GOOGLE_CLIENT_ID`/`GOOGLE_CLIENT_SECRET`, `ALLOWED_EMAILS`, `TRADE_API_URL`,
`TRADE_API_SECRET`.
