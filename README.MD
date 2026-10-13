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

## Supported locales

Every model is localized in English (`en`), French (`fr`), German (`de`), and Spanish (`es`). A model directory must contain one translation JSON file for each of these four locales.

## Available scripts

All scripts run with plain Node (no dependencies). Use `npm run <script>` from the repo root.

| Command | Description |
| --- | --- |
| `npm run build` | Reads every model under `models/`, merges in translations for `en`, `fr`, `de`, and `es`, injects category and unit metadata, then writes the language-specific bundles plus `index.json` to `build/`. |
| `npm run validate:models` | Ensures each authoring model adheres to the schema defined in `MODELS.MD` (required fields, enums, localization files, SEO metadata, etc.). |
| `npm run validate:output` | Verifies the generated bundles in `build/` still match the schema (correct nesting, localized strings, category/unit injection, and bundle/index consistency). |
| `npm run validate` | Convenience command that runs both validation steps in sequence. |

## Typical workflow

1. Edit or add JSON files under `models/` following the rules documented in `MODELS.MD`.
2. Run `npm run validate:models` to catch schema issues early.
3. Run `npm run build` to regenerate the distributable bundles.
4. Optionally run `npm run validate:output` to confirm the produced bundles are structurally sound before publishing.

Following this loop keeps the published data at models.datajot.app synchronized with the curated model sources in this repository.

## Weather values from Apple Shortcuts

DataJot's add-measure action receives a number without its source unit. Convert
each weather measurement to the destination series unit in Shortcuts before
passing its numeric value to DataJot. Changing the units displayed by Apple
Weather does not change the units expected by an existing DataJot series.

The current weather templates expect these units when creating a new series:

| Template | Input unit |
| --- | --- |
| `atmospheric_pressure` | hPa |
| `temperature_outdoor_metric`, `feels_like_temperature_metric`, `dew_point_metric` | °C |
| `temperature_outdoor_imperial` | °F |
| `wind_speed`, `wind_gust` | m/s |
| `rainfall`, `visibility` | m |
| `humidity`, `cloud_cover` | % (for example, `65` for 65%) |
| `uv_index` | Index value, without a physical unit |

Atmospheric pressure uses the dedicated `pressure_hpa` unit, which keeps its
display in hPa. The `atmospheric_pressure_hpa` visualization thresholds are
also expressed in hPa. The general-purpose `pressure` unit includes other
pressure units for conversion, including `inHg` and `mbar`; those units are not
part of the weather template's automatic display selection.

With hPa as the destination, `101.325 kPa` becomes `1013.25 hPa`, `101325 Pa`
becomes `1013.25 hPa`, and `1013.25 mbar` remains `1013.25 hPa`. Foundation uses
`1 inHg = 33.8639 hPa`. See Apple's [UnitPressure conversion table](https://developer.apple.com/documentation/foundation/unitpressure)
and [Weather unit settings](https://support.apple.com/guide/iphone/check-the-weather-iph1ac0b35f/26/ios/26).

Publishing an updated template does not migrate units already saved in DataJot.
For an existing atmospheric-pressure series whose measurements are already in
hPa, associate the new **Atmospheric Pressure (hPa)** unit and select its `hPa`
sub-unit. Measurements recorded in another unit must be converted separately;
changing an abbreviation alone does not convert stored numbers.
