# DATAJOT-MODELS

[Datajot](https://www.datajot.app) uses this repository as the single source of truth for every model, unit, and category definition that the app ships with. The JSON content under `models/` is transformed into consumable bundles that are published to GitHub Pages at [models.datajot.app](https://models.datajot.app).

## Repository structure

- `MODELS.MD` outlines the schema each model must follow, while `BUNDLES.MD` describes how bundles are grouped for distribution.
- `models/` contains the authoring source:
  - `categories/` defines reusable measurement categories.
  - `units/` holds unit definitions plus localized metadata per language.
  - `series/` stores every trackable series, including their localization, styling, and optional unit references.
- `build/` is generated output created by the build script. It includes `bundle-<lang>.json`, `series-<lang>.json`, `units-<lang>.json`, and a top-level `index.json` listing the available keys.
- `scripts/` groups the Node.js utilities that build and validate the repository. Shared validation helpers live in `scripts/utils/`.

## Available scripts

All scripts run with plain Node (no dependencies). Use `npm run <script>` from the repo root.

| Command | Description |
| --- | --- |
| `npm run build` | Reads every model under `models/`, merges in translations for `en` and `fr`, injects category and unit metadata, then writes the language-specific bundles plus `index.json` to `build/`. |
| `npm run validate:models` | Ensures each authoring model adheres to the schema defined in `MODELS.MD` (required fields, enums, localization files, SEO metadata, etc.). |
| `npm run validate:output` | Verifies the generated bundles in `build/` still match the schema (correct nesting, localized strings, category/unit injection, and bundle/index consistency). |
| `npm run validate` | Convenience command that runs both validation steps in sequence. |

## Typical workflow

1. Edit or add JSON files under `models/` following the rules documented in `MODELS.MD`.
2. Run `npm run validate:models` to catch schema issues early.
3. Run `npm run build` to regenerate the distributable bundles.
4. Optionally run `npm run validate:output` to confirm the produced bundles are structurally sound before publishing.

Following this loop keeps the published data at models.datajot.app synchronized with the curated model sources in this repository.
