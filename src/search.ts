import { getSeries, getUnits } from './data'
import type { Locale, SeriesOutputModel, UnitOutputModel } from './types'

const normalizeTerm = (term: string): string => term.trim().toLowerCase()

const unitMaps: Partial<Record<Locale, Map<string, UnitOutputModel>>> = {}
const seriesMaps: Partial<Record<Locale, Map<string, SeriesOutputModel>>> = {}

const buildUnitMap = (locale: Locale): Map<string, UnitOutputModel> => {
  if (!unitMaps[locale]) {
    unitMaps[locale] = new Map(getUnits(locale).map(unit => [unit.key, unit]))
  }
  return unitMaps[locale]!
}

const buildSeriesMap = (locale: Locale): Map<string, SeriesOutputModel> => {
  if (!seriesMaps[locale]) {
    seriesMaps[locale] = new Map(getSeries(locale).map(series => [series.key, series]))
  }
  return seriesMaps[locale]!
}

const unitSearchBlob = (unit: UnitOutputModel): string => {
  const bits = [unit.title, unit.description, ...unit.seo.keywords]
  unit.subUnits.forEach(subUnit => {
    bits.push(subUnit.title)
    if (subUnit.abbreviation) bits.push(subUnit.abbreviation)
    bits.push(subUnit.key)
  })
  bits.push(unit.category.title, unit.category.key)
  return bits.join(' ').toLowerCase()
}

const seriesSearchBlob = (series: SeriesOutputModel): string => {
  const bits = [series.name, series.description, ...series.seo.keywords]
  bits.push(series.category.title, series.category.key)
  if (series.unit) bits.push(series.unit.title, series.unit.key)
  return bits.join(' ').toLowerCase()
}

export const findUnit = (locale: Locale, key: string): UnitOutputModel | undefined =>
  buildUnitMap(locale).get(key)

export const findSeries = (locale: Locale, key: string): SeriesOutputModel | undefined =>
  buildSeriesMap(locale).get(key)

export const searchUnits = (locale: Locale, term: string): UnitOutputModel[] => {
  const normalized = normalizeTerm(term)
  if (!normalized) return getUnits(locale)
  return getUnits(locale).filter(unit => unitSearchBlob(unit).includes(normalized))
}

export const searchSeries = (locale: Locale, term: string): SeriesOutputModel[] => {
  const normalized = normalizeTerm(term)
  if (!normalized) return getSeries(locale)
  return getSeries(locale).filter(series => seriesSearchBlob(series).includes(normalized))
}
