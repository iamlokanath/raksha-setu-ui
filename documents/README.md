# Raksha Setu UI — Specification Index

Source of truth: Software Specification & SDD Engineering SOP, Version 1.0, the API decisions in the server document set, and the UI rules in this folder.

The UI is a client of `/api/v1`. It does not calculate official shortage or priority in the browser. It renders what the API returns and refreshes after event-driven processing.

## Standards

| Document | Covers |
| --- | --- |
| [00-sdd-baseline.md](00-sdd-baseline.md) | Scope, traceability, open decisions |
| [01-frontend-architecture.md](01-frontend-architecture.md) | Folders, components, environment |
| [02-design-system-components-i18n.md](02-design-system-components-i18n.md) | Theme, reusable UI, English / Hindi / Odia |
| [03-redux-and-api-responses.md](03-redux-and-api-responses.md) | Redux, HTTP status handling, error and empty states |
| [04-testing-and-acceptance.md](04-testing-and-acceptance.md) | Frontend tests and acceptance rows |

## Feature documents

| Document | Who it is for | Spec |
| --- | --- | --- |
| [modules/auth-and-access.md](modules/auth-and-access.md) | Every user | §§4, 22 |
| [modules/shelter-master.md](modules/shelter-master.md) | Administrator, officers | §5, AC-001 |
| [modules/shelter-reporting.md](modules/shelter-reporting.md) | Warden | §§6–7, AC-002 |
| [modules/offline-sync.md](modules/offline-sync.md) | Warden | §§8–9, AC-003 |
| [modules/status-stock-capacity.md](modules/status-stock-capacity.md) | Warden, officers | §§10–13 |
| [modules/alerts.md](modules/alerts.md) | Officers, warden (read) | §14, AC-008 |
| [modules/redistribution-and-approval.md](modules/redistribution-and-approval.md) | District Officer, receiving warden | §§15–16, AC-006, AC-007 |
| [modules/dashboard.md](modules/dashboard.md) | Block and District Officers | §§17–19, AC-005, AC-009 |
| [modules/audit-and-history.md](modules/audit-and-history.md) | District Officer | §§20–21, AC-010 |

Server contracts referenced below live in `raksha-setu-server/documents`.
