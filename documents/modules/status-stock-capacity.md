# Module — Status, Stock, and Capacity

Specification: §§10–13. Server: `modules/resources.md` and the status rules in `modules/dashboard-and-priority.md`.

## Status display

| API `current_status` | Locale | Meaning shown |
| --- | --- | --- |
| `green` | `status.stable` | Operating within acceptable conditions |
| `yellow` | `status.attention` | Approaching a concern threshold |
| `red` | `status.urgent` | Immediate action required |
| `unknown` | `status.unknown` | Colour withheld |

The Badge includes the text, not colour alone. Components receive the status enum. They do not decide it from quantities.

## Stock display

For each of food, water, and medicine show quantity and unit, or `resource.unreported` when the API sends `null`. Never render null as zero.

A shortage warning appears only when the shelter payload includes an open shortage alert. The UI does not compare quantity to a local constant.

## Capacity display

Show population and capacity. An occupancy warning appears only when an open capacity alert exists or the dashboard item’s `occupancy` filter value is returned by the API. The client does not divide and paint yellow or red on its own.

If `priority_score` is null, show factors that the API sent (vulnerability total, occupancy ratio, issue age, shortage urgency) under `priority.factors` and show `priority.not_configured` instead of a number.

## Where it appears

- Warden confirmation after report
- Shelter detail
- Dashboard shelter list and map panel

The map panel plots a shelter only when latitude and longitude exist. Shelters without coordinates still appear in the list. The map does not call a third-party geocoder.

## Configuration gaps

`422 CONFIGURATION_REQUIRED` on a surplus or priority filter uses `errors.configuration_required` and leaves the rest of the dashboard usable. Hide the surplus filter’s result list rather than showing an empty state that implies there is no surplus.

## Tests

- Unreported medicine renders the unreported label.
- `unknown` does not use the stable label.
- Fixture alert renders the urgent label from locale files.
- No component contains a numeric threshold.
