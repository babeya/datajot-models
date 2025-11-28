# BUNDLES

The bundling script output 3 types of bundles

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

### FullBundle

Series and Units are bundled together to fetch everything in a single query.
Output files are named `bundle-{lang}`.json and contains an Array of `SeriesOutput` under the field `series` and an Array of `UnitOutput` under the name of `unit`.

```typescript

type Bundle = {
  series: SeriesOutput[];
  units: UnitOutput[];
}

```