# BUNDLES

The bundling script output 3 types of bundles

Bundles are generated for English (`en`), French (`fr`), German (`de`), and Spanish (`es`).

## UnitBundle

Unit are bundled together to be fetched separately if needed.
Output files are named like `units-{lang}.json` and contains an Array of `UnitOutput`

```typescript

type UnitBundle = UnitOutput[];

```

## SeriesBundle

Series are bundled together to be fetched separately if needed.
Output files are named `series-{lang}.json` and contains an Array of `SeriesOutput`

```typescript

type SeriesBundle = SeriesOutput[];

```

## VisualizationConfigBundle

Visualization configs are bundled together to be fetched separately if needed.
Output files are named `svc-{lang}.json` and contain an Array of `SVC`.
Threshold labels are localized during the build, so each threshold in the output includes a `label`.

```typescript

type VisualizationConfigBundle = SVC[];

```

### FullBundle

Series, units, and visualization configs are bundled together to fetch everything in a single query.
Output files are named `bundle-{lang}.json` and contain arrays under `series`, `units`, and `svc`.

```typescript

type Bundle = {
  series: SeriesOutput[];
  units: UnitOutput[];
  svc: SVC[];
}

```
