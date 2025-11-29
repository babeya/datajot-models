export const LOCALES = ['en', 'fr'] as const

export type Locale = (typeof LOCALES)[number]

export type MeasurementSystem = 'metric' | 'imperial'
export type GraphType = 'line' | 'bar' | 'area' | 'points'

export type SeoMetadata = {
  keywords: string[]
  image?: string
}

export type CategoryOutput = {
  key: string
  type: 'category'
  title: string
}

export type SubUnitOutput = {
  key: string
  abbreviation?: string
  factor: number
  title: string
}

export type UnitOutputModel = {
  key: string
  type: 'unit'
  category: CategoryOutput
  system?: MeasurementSystem
  baseUnit: string
  subUnits: SubUnitOutput[]
  title: string
  description: string
  seo: SeoMetadata
}

export type SeriesStatsConfig = {
  showAverage?: boolean
  showMedian?: boolean
  showSum?: boolean
  showCount?: boolean
  showMax?: boolean
  showMin?: boolean
  showAverageOnChart?: boolean
  showMedianOnChart?: boolean
  showMaxOnChart?: boolean
  showMinOnChart?: boolean
  autoScaleYAxis?: boolean
  averageColorHex?: string
  medianColorHex?: string
  maxColorHex?: string
  minColorHex?: string
  sumColorHex?: string
  countColorHex?: string
}

export type SeriesOutputModel = {
  key: string
  type: 'series'
  category: CategoryOutput
  icon: string
  color: string
  graphType: GraphType
  unit?: UnitOutputModel
  name: string
  description: string
  seo: SeoMetadata
  decimal?: number
  stats?: SeriesStatsConfig
}

export type SeriesBundle = SeriesOutputModel[]
export type UnitBundle = UnitOutputModel[]

export type Bundle = {
  series: SeriesBundle
  units: UnitBundle
}

export type BundleIndexEntry = {
  key: string
}

export type BundleIndex = {
  series: BundleIndexEntry[]
  units: BundleIndexEntry[]
}
