# Module — Alerts

Specification: §14. Acceptance: AC-008. Server: `modules/alerts.md`.

## List

`/alerts` calls `GET /api/v1/alerts/`. Filters use the shared Filter component: status, severity, type, block (hidden for wardens), shelter.

Columns: shelter, type, resource, severity, status, created time. Grouped updates do not appear as two cards for the same open alert id. Refetch replaces the row.

Empty: `alerts.empty`. Loading and error follow document 03.

## Detail and transitions

Detail shows the lifecycle as six ordered steps. The current step is marked from `status`. Buttons are shown only for the next legal transition and only when the principal has the matching permission.

| Button key | Call | Permission |
| --- | --- | --- |
| `alert.acknowledge` | `POST .../acknowledge` | `alert.acknowledge` |
| `alert.plan` | `POST .../plan` | `alert.plan` |
| `alert.start` | `POST .../start` | `alert.progress` |
| `alert.resolve` | `POST .../resolve` | `alert.resolve` |
| `alert.close` | `POST .../close` | `alert.close` |

Optional note uses Input and is sent only if non-empty.

| Result | UI |
| --- | --- |
| 200 | Replace the alert. Toast `alert.updated`. |
| 422 `INVALID_STATE` | `errors.invalid_state`, then refetch. |
| 403 | `errors.permission_denied`. The button should already be hidden; this covers a stale principal. |

A warden with `alert.read` can open alerts for their shelter and sees no transition buttons.

Automatic downgrade or clear is displayed after refetch as a status or severity change plus a history line `alert.system_update`. The UI does not offer “delete alert”.

## AC-008

An officer test walks the visible controls from detected through closed and sees each localized status label.

## Tests

- Illegal button is absent on a `detected` alert (no close button).
- `422` does not advance the local step.
- Severity text is present, not colour alone.
- Hindi and Odia status labels exist for every lifecycle state.
