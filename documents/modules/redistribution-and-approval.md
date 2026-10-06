# Module — Redistribution and Human Approval

Specification: §§15–16. Acceptance: AC-006, AC-007. Server: `modules/actions.md`.

## List

`/actions` loads `GET /api/v1/actions/`. A proposed row shows destination shelter, source shelter, resource, quantity, unit, and the explanation built from locale key `action.explanation` plus API parameters (`source_shelter_name`, `resource_type`, `quantity`, `unit`).

The sentence must present a candidate for review. The locale string must not read as an order that relief has already moved.

## Officer decision

Visible when decision is `proposed` and the principal has `action.approve`.

| Control | API | Notes |
| --- | --- | --- |
| Approve | `POST .../approve` | Confirm dialog `action.confirm_approve` |
| Modify | `POST .../modify` | Quantity field required |
| Reject | `POST .../reject` | Confirm dialog `action.confirm_reject` |

There is no dispatch button and no client path that posts to an execute URL.

| Result | UI |
| --- | --- |
| 200 | Show the new decision. Toast `action.recorded`. |
| 422 `INVALID_STATE` | Refetch. Another officer may have decided. |
| 422 `HUMAN_APPROVAL_REQUIRED` | `errors.human_approval_required`. |
| 403 | Forbidden state. |

Block officers can read and coordinate from the information on screen. They do not see approve, modify, or reject.

## Receipt

The receiving shelter warden sees `action.confirm_receipt` only when decision is `approved` or `modified` and the destination is their shelter. Submit quantity and unit to `POST .../confirm-receipt`. Success copy `action.receipt_recorded` tells them to submit a shelter report so stock updates from the report. The screen does not increment local stock by itself.

## AC-006

With fixture data, the actions list shows shelter B as the source for shelter A’s shortage.

## AC-007

The test approves only through the decision control and asserts the UI never shows a success state for movement before `200` on approve, modify, or reject. Confirm-receipt is disabled or absent while decision is `proposed`.

## Tests

- Explanation uses the locale template and the API parameters.
- Warden does not see approve.
- Modify with an empty quantity shows `validation.required` and does not call the API.
- Reject confirmation can be cancelled without a request.
