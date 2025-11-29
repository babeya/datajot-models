import bundleEn from '../../build/bundle-en.json' assert { type: 'json' }
import bundleFr from '../../build/bundle-fr.json' assert { type: 'json' }
import seriesEn from '../../build/series-en.json' assert { type: 'json' }
import seriesFr from '../../build/series-fr.json' assert { type: 'json' }
import unitsEn from '../../build/units-en.json' assert { type: 'json' }
import unitsFr from '../../build/units-fr.json' assert { type: 'json' }
import bundleIndexJson from '../../build/index.json' assert { type: 'json' }

import type {
  Bundle,
  BundleIndex,
  Locale,
  SeriesBundle,
  UnitBundle
} from '../types'

const BUNDLES: Record<Locale, Bundle> = {
  en: bundleEn as Bundle,
  fr: bundleFr as Bundle
}

const UNIT_BUNDLES: Record<Locale, UnitBundle> = {
  en: unitsEn as UnitBundle,
  fr: unitsFr as UnitBundle
}

const SERIES_BUNDLES: Record<Locale, SeriesBundle> = {
  en: seriesEn as SeriesBundle,
  fr: seriesFr as SeriesBundle
}

export const BUNDLE_INDEX: BundleIndex = bundleIndexJson as BundleIndex

export const getBundle = (locale: Locale): Bundle => BUNDLES[locale]

export const getUnits = (locale: Locale): UnitBundle => UNIT_BUNDLES[locale]

export const getSeries = (locale: Locale): SeriesBundle => SERIES_BUNDLES[locale]

export const listUnitKeys = (): string[] => BUNDLE_INDEX.units.map(entry => entry.key)

export const listSeriesKeys = (): string[] => BUNDLE_INDEX.series.map(entry => entry.key)
