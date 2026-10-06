# 04 — Testing and Definition of Done

## Required frontend coverage

- Buttons, forms, inputs, tables, validation, and dialogs used by the feature
- Redux transitions for success, field error, `401`, `403`, `409`, `422`, and network loss
- Service calls against a stubbed `/api/v1`
- Loading, empty, and error components
- Language switch among `en`, `hi`, and `or` for the screen’s keys
- Navigation and controls hidden by permission
- Reporting flow at the mobile breakpoint and dashboard at a desktop breakpoint

## Acceptance rows exercised in the UI

| ID | UI proof |
| --- | --- |
| AC-001 | Register shelter form persists and detail shows master fields |
| AC-002 | Report form shows stored timestamp after `201` |
| AC-003 | Offline save, then batch sync, then applied state |
| AC-004 | Urgent or attention badge appears only from API alert/status, under fixture config |
| AC-005 | Four priority factors render; null score when unconfigured |
| AC-006 | Proposed action names the surplus shelter |
| AC-007 | Approve, modify, and reject are the only decision controls |
| AC-008 | Alert steps move forward with the API and stop on `422` |
| AC-009 | Dashboard summary identifies urgent, attention, surplus, unresolved |
| AC-010 | Audit list shows report, alert, and decision events |

## Definition of done (UI)

- The feature exists in this folder and in the SOP.
- Shared components are reused.
- No source file exceeds 500 lines.
- No user-facing string is hardcoded; `en`, `hi`, and `or` all contain the keys.
- Theme tokens are referenced and no unapproved palette or icon pack is added.
- API access goes through the shared client and the status table in document 03.
- Error, loading, and empty states are present.
- Permission gates match the server permission names.
- Tests for the acceptance row pass.
- Responsive behaviour for that feature is checked.
- The screen does not approve relief by itself and does not invent thresholds or weights.

## Pilot mapping

| Window | UI output |
| --- | --- |
| Weeks 3–5 | Reporting and offline queue |
| Weeks 6–7 | Dashboard, alerts, actions |
| Week 8 | Flows usable in training sessions in all three languages |
| Week 9 | Mock drill can run on the mobile reporting path |

## Traceability

Requirement section → this feature document → `features/` and `store/` module → tests → acceptance id → pilot note.

A feature is not complete while its acceptance row is untested or while it contradicts the server document for the same module.
