# 01 — Frontend Architecture

## Stack

Next.js, TypeScript, Tailwind CSS, Redux. Component-based. No second state-management library.

## Folder layout

```
src/
├── app/
├── components/
│   ├── ui/
│   ├── forms/
│   ├── tables/
│   ├── feedback/
│   └── layout/
├── features/
│   ├── auth/
│   ├── shelter/
│   ├── reports/
│   ├── resources/
│   ├── alerts/
│   ├── actions/
│   ├── dashboard/
│   └── sync/
├── store/
│   ├── store.ts
│   ├── auth/
│   ├── shelter/
│   ├── reports/
│   ├── resources/
│   ├── alerts/
│   ├── actions/
│   ├── users/
│   └── ui/
├── services/
├── hooks/
├── lib/
├── config/
│   ├── theme.ts
│   ├── colors.ts
│   ├── typography.ts
│   ├── spacing.ts
│   └── breakpoints.ts
├── constants/
├── locales/
│   ├── en/
│   ├── hi/
│   └── or/
├── types/
├── utils/
└── validations/
```

`features/` holds screens composed from shared components. A feature may contain a container, but not a private copy of Button, Table, or Modal.

`services/` is the only place that calls HTTP. Components do not use `fetch` directly.

## File size

No source file exceeds 500 lines. Split by responsibility: schema, slice, service, and view stay apart.

## Environment

`/.env.example` documents:

- `NEXT_PUBLIC_API_BASE_URL`
- `NEXT_PUBLIC_DEFAULT_LOCALE`

No secrets, tokens, or passwords in source or in `NEXT_PUBLIC_*`. Access tokens live in memory. Refresh handling is described in the auth feature. Do not put long-lived refresh tokens in localStorage. Offline report bodies are operational data queued in a local database (IndexedDB) under the sync feature, not in a committed fixture.

## Layers inside the UI

```
Route / screen
  → feature container
  → Redux thunk or listener
  → service (HTTP or local queue)
  → API
```

Business decisions (whether a report is newer, whether relief is approved) are server results. The client may validate shape before send so the warden gets immediate field errors, using the same constraints as the server schema. If client and server disagree, the server response wins and the UI shows the error code.

## Responsive requirement

Reporting flows are designed for mobile first, then tablet, laptop, and desktop. Dashboard filters must remain usable at the mobile breakpoint defined in `config/breakpoints.ts`. Exact pixel values come from the approved design tokens.

## Routing sketch

| Path | Role gate |
| --- | --- |
| `/login` | public |
| `/report` | `report.submit` |
| `/sync` | `report.submit` |
| `/shelters` | `shelter.read` |
| `/shelters/new` | `shelter.register` |
| `/dashboard` | `dashboard.read` |
| `/alerts` | `alert.read` |
| `/actions` | `action.read` |
| `/audit` | `audit.read` |

A missing permission shows the localized forbidden state, not a blank screen and not another tenant’s data.
