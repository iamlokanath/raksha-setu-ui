# Module — Audit and History

Specification: §§20–21, AC-010. Server audit is append-only and fed by domain events.

## Who

`audit.read` (District Officer) opens `/audit`. Other roles do not see the nav item. Wardens and block officers still see the operational timeline on a shelter they can read: reports, alert status, and action decisions returned by those modules. That timeline is not the full audit log.

## Shelter timeline

On shelter detail, list reports from `GET /api/v1/shelters/{shelter_id}/reports` with timestamp, channel, population, and whether the report was applied. Historical (not applied) reports are visible and labelled `sync.kept_as_history`.

Alert and action history on that shelter comes from the alert and action list endpoints filtered by `shelter_id`.

## Audit screen

The screen reads the audit list defined in the server audit module:

`GET /api/v1/audit/`

Permission: `audit.read`. Query: `from`, `to`, `event_type`, `aggregate_id`, pagination.

Response items: `occurred_at`, `event_type`, `actor_id`, `aggregate_type`, `aggregate_id`, `request_id`. Payload display is limited to operational ids and enumerated fields. The screen does not pretty-print secrets. If a payload contains `password` or `token`, the UI omits those keys even if a faulty API included them, and the test fails the API.

Event type labels are locale keys `audit.event.<event_type>` with dots replaced by underscores in the key (`report.submitted` → `audit.event.report_submitted`). Unknown types show the raw event type in monospace plus `audit.event.unknown`, so a new event does not crash the page.

## AC-010

After a report submit, an alert acknowledgement, and an action decision, the audit screen shows three rows with those event types and timestamps. The test uses the officer who can read audit.

## Errors

Standard mapping from document 03. Empty range: `audit.empty`.

## Privacy in the UI

Forms never ask for resident names. Vulnerability inputs are counts. User management, if added for `user.manage`, is a separate screen that posts to `/api/v1/users/` and is limited to operator identity fields in the user module. It is not part of the warden reporting flow.

## Tests

- Timeline shows an older unapplied report without copying its stock into the current stock summary.
- Audit forbidden for a block officer.
- Known event types resolve to Hindi and Odia keys.
