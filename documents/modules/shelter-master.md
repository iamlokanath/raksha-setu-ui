# Module — Shelter Master

Specification: §5. Acceptance: AC-001. Server: `modules/shelters.md`.

## Who

A user with `shelter.register` can create. A user with `shelter.read` can view within scope. A user with `shelter.update` can edit master fields.

## Register screen

Fields, in order, matching the API: name, block, location label, optional coordinates, capacity, responsible warden, reporting contact, operational status.

Client validation mirrors the server: required master fields, capacity at least 1, coordinates both or neither. Submit `POST /api/v1/shelters/`.

| Result | UI |
| --- | --- |
| 201 | `shelter.registered` and navigate to the shelter detail. |
| 400 | Field errors, values kept. |
| 403 | `errors.permission_denied`. |
| 404 | `errors.not_found` when block or warden is not in scope. |

## List and detail

`GET /api/v1/shelters/` drives the Table. Columns: name, block, capacity, operational status, current operational colour (or unknown), last report time. Detail shows the master record and links to reports for that shelter when the user has `report.read`.

Inactive shelters stay visible to officers with a badge `shelter.inactive`. They can be filtered. The UI does not offer delete.

## AC-001

The acceptance test registers a shelter through the form and shows the stored name, location, capacity, warden, reporting contact, and operational status on the detail screen.

## Empty and errors

No shelters: `shelter.empty`. Failed load: `ErrorState` with retry.

## Tests

- Required-field validation before submit.
- Successful create renders the detail.
- Warden session does not show the register route.
- Strings come from `en`, `hi`, and `or`.
