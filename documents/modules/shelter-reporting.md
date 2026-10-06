# Module — Shelter Reporting

Specification: §§6–7. Acceptance: AC-002. Server: `modules/reports.md`.

## Purpose

A short mobile flow for facts that change during the day: population, vulnerable-group counts, food, water, medicine, and optional incident notes.

## Steps

1. Warden opens `/report` (or the offline queue if they are finishing a saved report).
2. Confirm shelter name (read-only, from the assignment).
3. Enter population.
4. Enter counts for children, older adults, pregnant women, persons with disability, and injured or sick.
5. Enter quantity and unit for food, water, and medicine.
6. Optional incident notes.
7. Submit.

The screen shows one primary action: submit. It does not ask the warden to pick an alert severity or a priority score.

## Validation before send

Same rules as the server schema: non-negative numbers, vulnerability sum not above population, all three resources present, notes length. Failures use `validation.*` keys and do not call the network.

`client_report_id` is generated on first local save and reused for every retry of that report. `reported_at` is set when the warden submits locally, not when the request happens to leave the device.

## Online result

`POST /api/v1/reports/` with `channel: "web"`.

| Result | UI |
| --- | --- |
| 201 | `report.saved`. Show `report.checks_pending` while status handlers run, then refetch shelter status. |
| 200 replay | `feedback.already_recorded`. |
| 400 | Field errors. |
| 409 | `errors.duplicate_mismatch`. |
| 403 / 404 | Permission or not-found states. |
| Network down | Hand off to the offline module without losing the form. |

## What the warden sees after a successful apply

The shared status Badge for `green`, `yellow`, `red`, or `unknown`, plus the three quantities. `unknown` copy explains that a colour is withheld until approved configuration or the first applied report exists. It does not pretend the shelter is stable.

## Officer verification

If the product later adds an officer “mark verified” control, it calls the server only when `report.verify` exists. This baseline does not add a second reporting form for officers. Officers read reports on the shelter detail timeline.

## Tests (AC-002)

Submit population and three resources online and assert the success state shows the timestamp returned by the API. Assert the vulnerability-sum error blocks the request. Assert no English string is hardcoded in the form component.
