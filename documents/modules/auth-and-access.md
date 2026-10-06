# Module — Auth and Access

Specification: §§4, 22. Server: `modules/auth.md`, document 03.

## Screen

`/login` collects username and password with the shared Form. Submit calls `POST /api/v1/auth/login`.

| Result | UI |
| --- | --- |
| 200 | Store tokens via the auth service, then `GET /auth/me`, then route by role (table below). |
| 400 | Field errors. |
| 401 | `errors.auth_invalid`. Same message for unknown user and bad password. |
| Network | `errors.network`. |

Logout calls `POST /api/v1/auth/logout` and always clears local session, even when the network call fails.

## Home by role

| Role | Landing |
| --- | --- |
| Warden | `/report` |
| Volunteer with `report.submit` | `/report` |
| Block Officer | `/dashboard` scoped to their block |
| District Officer | `/dashboard` |
| User with only `shelter.register` | `/shelters/new` |

## Navigation

The Sidebar lists only routes whose permission the `/auth/me` payload includes. Hiding a link is not the only control: the route guard still checks the permission and renders the forbidden state.

| Capability | Nav item |
| --- | --- |
| `report.submit` | Report, Sync queue |
| `shelter.read` | Shelters |
| `shelter.register` | Register shelter |
| `dashboard.read` | Dashboard |
| `alert.read` | Alerts |
| `action.read` | Actions |
| `audit.read` | History |

## Session expiry

On `401`, the HTTP client performs one refresh through `POST /api/v1/auth/refresh`. Failure returns the user to `/login` and keeps the offline queue on the device. Queued reports are not deleted on logout; they remain until submitted or discarded by the warden. Discard is an explicit local action with a confirm dialog.

## Redux

`store/auth` holds `principal`, `status`, and `error`. It does not hold shelter reports.

## Tests

- Login success routes a warden to `/report` and an officer to `/dashboard`.
- `401` shows the localized auth error.
- A warden principal does not render the approve action control even if the actions URL is opened.
- Locale switch on the login screen changes labels without a code change in the form component.
