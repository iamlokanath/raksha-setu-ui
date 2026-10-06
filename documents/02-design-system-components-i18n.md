# 02 — Design System, Components, and Localization

## Design source

The approved project design is the source for colours, typography, fonts, icons, images, and visual style. Until that design is attached, token files exist and screens reference tokens only. Pull requests must not introduce raw colour utilities, inline colour values, downloaded icon packs, or generated images.

`config/theme.ts` composes `colors.ts`, `typography.ts`, `spacing.ts`, and `breakpoints.ts`. Components read semantic tokens (`color.surface`, `color.status.urgent`, and so on). They do not name a palette.

Status presentation uses tokens `status.stable`, `status.attention`, and `status.urgent` mapped from API values `green`, `yellow`, and `red`. The words Stable, Attention Required, and Urgent are localized strings, not a reason to invent a hue.

## Reusable components

Shared, single-responsibility components live under `components/` and are the only implementations of these patterns:

Button, Input, Select, Checkbox, Radio, Modal, Drawer, Dropdown, Table, Pagination, Card, Badge, Alert, Toast, Loader, EmptyState, ErrorState, Form, FormField, Search, Filter, Tabs, Breadcrumb, Header, Sidebar, Navbar.

Pages assemble them. Copy-paste of a control between features is a defect.

Component APIs receive already translated strings, or a message key that the component passes through the localization hook. Components do not embed English sentences.

## Content externalization

No heading, title, label, description, button text, placeholder, error, success, navigation label, table header, tooltip, status text, validation message, notification, or dialog text is hardcoded in a component.

```
locales/
├── en/
├── hi/
└── or/
```

Each locale has the same key tree. A key present in only one language fails the locale parity check.

Suggested key roots:

| Root | Use |
| --- | --- |
| `nav.*` | Navigation |
| `auth.*` | Login and session |
| `shelter.*` | Master data |
| `report.*` | Reporting flow |
| `sync.*` | Offline queue |
| `status.*` | Green / yellow / red labels from §10 |
| `resource.*` | Food, water, medicine |
| `alert.*` | Lifecycle labels |
| `action.*` | Recommendation and decision |
| `dashboard.*` | Officer view |
| `errors.*` | Mapped from API `error.code` |
| `validation.*` | Mapped from `details[].code` |
| `feedback.*` | Loading, empty, saved, queued |

Section 10 approved meanings, to be translated in all three locales:

- Stable — operating within acceptable conditions
- Attention required — a supply, occupancy, or other measure is approaching a concern threshold
- Urgent — immediate action required

`unknown` uses a separate key meaning the system is not showing a status because data or approved configuration is missing. It must not be translated as a fourth operational status.

## Adding a language

A new locale is a new folder plus registration in the locale index. Existing components stay unchanged.

## Tailwind

Tailwind is the styling mechanism. Theme tokens are exposed through the Tailwind theme configuration, which reads the same `config/` modules. Feature code uses those theme class names. Arbitrary colour values in class strings are not allowed.

## Accessibility notes that do not depend on a palette

- Form fields have programmatic labels.
- Errors are tied to fields.
- Status is not conveyed by colour alone; the localized status word is visible.
- Touch targets on the reporting flow meet the spacing token for mobile controls once the design sets it.
- Dialogs trap focus using the shared Modal.

## States that every data screen implements

Using shared feedback components:

- Loading — `Loader`
- Empty — `EmptyState`
- Error — `ErrorState` with retry where the call is safe to retry
- Forbidden — `ErrorState` variant for `403`
- Offline queued — sync badge from localized `sync.*` keys
