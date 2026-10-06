# 03 — Redux and API Response Handling

## Redux

Redux holds shared session and operational state. Organize by domain. Use component state for an open dropdown, a single input focus, or other ephemeral UI that no other screen reads.

```
store/
├── store.ts
├── auth/
├── shelter/
├── reports/
├── resources/
├── alerts/
├── actions/
├── users/
└── ui/
```

`ui` stores locale, global toast queue, and connectivity (`online` / `offline`). It does not store shelter business data.

Each domain slice distinguishes:

| Field | Meaning |
| --- | --- |
| `status` | `idle`, `loading`, `succeeded`, `failed` |
| `error` | Normalized client error or `null` |
| `data` | Last successful payload |

Do not store the raw `Response` object. Do not store tokens inside shelter or report slices.

## One HTTP client

`services/http.ts` attaches the bearer token, parses JSON, and always returns a discriminated result:

```ts
type ApiSuccess<T> = { ok: true; status: number; data: T; meta: ResponseMeta };
type ApiFailure = { ok: false; status: number; error: ApiError };
type ApiResult<T> = ApiSuccess<T> | ApiFailure;
```

`ApiError` matches the server envelope: `code`, `details[]` with `field` and `code`, `request_id`.

Thunks branch on `ok`. Components never switch on a raw numeric status except through the shared mapper below.

## Status handling

| HTTP | Client behaviour |
| --- | --- |
| 200 | Replace the relevant slice data. If `meta.idempotent_replay` is true, show `feedback.already_recorded`. |
| 201 | Store the created resource and show `feedback.saved`. |
| 202 | Mark the local queue items as accepted by the server and show `sync.accepted_processing`. Then poll batch status. |
| 204 | Clear the session on logout and go to login. |
| 400 | Map `details` onto form fields via `validation.*` keys. Show `errors.validation` as the form summary. Do not clear the user’s input. |
| 401 | Attempt one refresh. If refresh fails, clear the session and go to login with `errors.auth_invalid`. Do not retry the original call in a loop. |
| 403 | Leave data unchanged. Show `errors.permission_denied`. |
| 404 | Show `errors.not_found`. Remove any optimistic row that the server refused. |
| 409 `DUPLICATE_MISMATCH` | Keep the server’s stored report. Show `errors.duplicate_mismatch`. Do not auto-resubmit a edited body under the same `client_report_id`. |
| 409 `CONFLICT_STALE` | Show `errors.conflict_stale`. Reload the shelter snapshot. |
| 422 `INVALID_STATE` | Show `errors.invalid_state` and reload the alert or action. |
| 422 `HUMAN_APPROVAL_REQUIRED` | Show `errors.human_approval_required`. Do not offer a bypass control. |
| 422 `CONFIGURATION_REQUIRED` | Show `errors.configuration_required`. Render factors or raw quantities that did return. Do not locally invent a score or a colour. |
| 500 | Show `errors.internal` and the `request_id` for support. Offer retry for `GET` only. |
| Network failure | Do not show a server error code. For report submit, follow the offline module. For other writes, show `errors.network` and keep the form. |

Unknown status codes use `errors.unexpected` and include `request_id` when present.

## Message mapping

`lib/errors.ts` maps `error.code` and `details[].code` to locale keys. The screen prints the translated string. It may also show `request_id` in a secondary line for officers. It does not print a server prose message, because the API contract does not supply user-facing sentences.

## Eventual consistency

Report create returns before shortage and capacity handlers finish (`processing_status: "accepted"`). The reporting screen shows `report.checks_pending`, then refetches the shelter snapshot and alerts. Refetch uses `GET`. It does not poll faster than the interval constant in `constants/refresh.ts` (value is a product setting, default 5 seconds, maximum 3 attempts before the user is told to refresh).

Dashboard lists refetch on focus and when an officer completes an alert or action transition.

## Optimistic updates

Do not optimistically mark an alert transition or an approval as done. Wait for `200`. Offline report capture is a local queue, which is not the same as pretending the server has accepted the report. Queue states are `local_only`, `submitting`, `accepted`, `applied`, `stored_historical`, `duplicate`, `rejected`.

## Loading, empty, error

- First load with no data: `Loader`.
- `succeeded` and an empty list: `EmptyState` with the feature’s empty key (for example `alerts.empty`).
- `failed`: `ErrorState` using the mapped error. Previous data may stay visible underneath if a refresh failed, with `errors.refresh_failed`.
- Buttons that triggered the call show the shared Button loading state and ignore double submits.

## Pagination

Tables use the shared Pagination component bound to `meta.page`, `meta.page_size`, and `meta.total`. Changing page issues a new `GET` and sets the slice to `loading` without wiping the previous page until the new page succeeds. If the new page fails, keep the previous page and show the error.

## Locale and tenant

The locale is a UI preference. It is sent as `Accept-Language` for diagnostics only. All display strings still come from the locale files. The client never sends a `tenant_id` to switch district. Tenant comes from the access token on the server.
