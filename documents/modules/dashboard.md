# Module — District Dashboard

Specification: §§17–19. Acceptance: AC-005, AC-009. Server: `modules/dashboard-and-priority.md`.

## First view

`/dashboard` loads `GET /api/v1/dashboard/summary` and `GET /api/v1/dashboard/shelters`.

Summary cards, using shared Card:

| Card key | API field |
| --- | --- |
| `dashboard.urgent` | `urgent_shelter_count` |
| `dashboard.attention` | `attention_shelter_count` |
| `dashboard.surplus` | `surplus_shelter_count` |
| `dashboard.unresolved` | `unresolved_action_count` |

When `surplus_shelter_count` is `null`, the surplus card shows `errors.configuration_required` in the card body rather than zero.

## Shelter view

Two presentations of the same payload: map and table, using Tabs. The table columns are population, capacity, vulnerability counts, food, water, medicine, last report time, status, open alert count, and recommended action count.

Selecting a row opens the shelter detail Drawer with recent reports, alerts, and proposed actions. “Recommended next action” links to the action detail. It does not auto-approve.

## Filters (section 19)

Shared Filter fields: status, block, shortage type, occupancy, priority.

Block officers do not get a block selector; the request omits `block_id` and the server forces their block. If a tampered client sends another block, show the `403` state.

Priority values `high`, `medium`, and `low` are sent only when the summary or a prior response indicates scoring is configured (non-null scores exist or a dedicated flag is unnecessary: if the filter returns `422 CONFIGURATION_REQUIRED`, show `priority.not_configured` and reset that filter to `unscored`).

## Priority display (AC-005)

Each shelter row can expand factors:

- shortage urgency
- vulnerable population
- occupancy pressure
- issue age

If `priority_score` is null, show `priority.not_configured`. If it is a number, show the number and the factors together so the score is explainable. The UI does not recompute weights.

## AC-009

A district officer fixture sees one urgent shelter, one attention shelter, one surplus shelter, and one unresolved action without leaving the dashboard.

## Responsive

On the mobile breakpoint the summary cards stack, filters sit in a Drawer, and the table remains horizontally scrollable inside the shared Table. The map tab stays available.

## Tests

- Filter change calls the list endpoint with the documented query names.
- Null surplus does not render `0`.
- Expanding priority shows four factor labels from locale files.
- A warden token is forbidden on `/dashboard`.
- Loading, empty, and error states each render the shared feedback component.
