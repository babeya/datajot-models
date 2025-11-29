import { findUnit } from './search'
import type { Locale, SubUnitOutput } from './types'

export type ConvertUnitValueParams = {
  locale: Locale
  unitKey: string
  fromSubUnit: string
  toSubUnit: string
  value: number
}

const requireSubUnit = (unitKey: string, collection: SubUnitOutput[], subUnitKey: string): SubUnitOutput => {
  const match = collection.find(subUnit => subUnit.key === subUnitKey)
  if (!match) {
    throw new Error(`Sub-unit "${subUnitKey}" not found for unit "${unitKey}"`)
  }
  return match
}

export const convertUnitValue = ({ locale, unitKey, fromSubUnit, toSubUnit, value }: ConvertUnitValueParams): number => {
  const unit = findUnit(locale, unitKey)
  if (!unit) {
    throw new Error(`Unit "${unitKey}" is not available for locale "${locale}"`)
  }

  const source = requireSubUnit(unitKey, unit.subUnits, fromSubUnit)
  const target = requireSubUnit(unitKey, unit.subUnits, toSubUnit)

  const valueInBase = value * source.factor
  return valueInBase / target.factor
}
