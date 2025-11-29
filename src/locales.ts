import { LOCALES, type Locale } from './types'

export const AVAILABLE_LOCALES = [...LOCALES]

export const DEFAULT_LOCALE: Locale = 'en'

export const isLocale = (value: string): value is Locale => LOCALES.includes(value as Locale)

export const assertLocale = (value: string | Locale): Locale => {
  if (isLocale(value)) return value
  throw new Error(`Unsupported locale: ${value}`)
}

export type LocaleRecord<T> = Record<Locale, T>
