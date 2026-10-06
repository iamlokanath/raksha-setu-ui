# 00 — UI SDD Baseline

## Purpose

The shelter interface must stay short and usable on a phone, including with no network. The officer interface must show which shelters need help, which are approaching a problem, where surplus is, and which actions are unresolved.

The UI implements specification behaviour. It does not add a business rule, a colour palette, or an icon set that the approved design has not supplied.

## Traceability

Each feature document names the requirement section, the API it calls, the Redux slice, the localized message keys, and the acceptance criteria it must demonstrate.

## What the UI owns

- Capture and confirmation of operational facts
- Local queue for offline reports
- Presentation of status, stock, alerts, recommendations, and decisions
- Mapping API error codes to localized messages
- Permission-based navigation
- Loading, empty, and error states

## What the UI does not own

- Shortage formulas and stock thresholds (OD-001)
- Capacity warning thresholds (OD-002)
- Official priority weights (OD-003)
- SMS or call-provider behaviour (OD-004)
- Approving its own relief recommendation
- Cross-tenant data

## Human-in-the-loop in the interface

Recommendations render as reviewable candidates with the explanation parameters from the API. Buttons are approve, modify, and reject. There is no control labelled or wired as automatic dispatch. A receipt confirmation is available only after the API shows an approved or modified action, and only to the receiving shelter’s warden.

## Open until an approved design exists

Theme tokens (colour, type, spacing, breakpoints) are centralized, but their values stay unset in code until the project design is supplied. Do not generate a substitute palette, icon set, or illustration pack.

## Languages

English (`en`), Hindi (`hi`), and Odia (`or`) ship together. Every user-visible string has a key in all three files before the screen is done. Missing copy fails the build check described in the design document.
