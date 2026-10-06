# Module — Offline Sync

Specification: §§8–9, 23. Acceptance: AC-003. Server: `modules/sync-and-offline.md`.

## Local capture

When the browser is offline, or when `POST /reports/` fails with a network error, the report is written to IndexedDB and the slice status for that item becomes `local_only`. The warden sees `sync.saved_on_device` and the capture timestamp. The form does not clear until the local write succeeds.

Each queued item stores `client_report_id`, `reported_at`, the payload, and state.

## Queue screen

`/sync` lists queued reports with time, population, and state. Actions: retry now (if online), discard (confirm dialog). Discard never calls the server if the item was not accepted.

## Synchronization

When connectivity returns, the app sends `POST /api/v1/sync/reports` with up to 50 `local_only` items.

| Result | UI |
| --- | --- |
| 202 | Items move to `accepted`. Poll `GET /api/v1/sync/batches/{batch_id}`. |
| 400 | No item is dropped. The batch error details highlight the invalid rows and they stay editable. |
| 401 | Refresh once, then keep the queue and go to login if needed. |
| Network | Remain `local_only`. |

Poll item states:

| Server item state | Local state | Message key |
| --- | --- | --- |
| `applied` | `applied` | `sync.applied` |
| `stored_historical` | `stored_historical` | `sync.kept_as_history` |
| `duplicate` | `duplicate` | `feedback.already_recorded` |
| `rejected` | `rejected` | `errors.duplicate_mismatch` |

`stored_historical` copy must say the newer information on the shelter was left in place. It must not say the submit failed in the sense of data loss.

## Duplicates

Retries reuse `client_report_id`. The UI must not mint a new id when the user taps retry.

## Alternative channels

SMS and phone fallback are not screens in this app. If those channels are enabled later, their results appear in the same shelter timeline because the server writes the same report record. The UI labels `channel` with `report.channel.web`, `report.channel.sms`, and `report.channel.telephony`.

## Tests (AC-003)

With the network stub offline, submit stores a local item and shows the on-device message. When the stub accepts a batch, the item reaches `applied` after polling. A second sync of the same id shows the already-recorded message and one local item. An older item that returns `stored_historical` does not replace the newer quantities on screen after refetch.
