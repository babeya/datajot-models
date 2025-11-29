import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

import {
  LANGUAGES,
  GRAPH_TYPES,
  MEASUREMENT_SYSTEMS,
  ValidationReporter,
  readJsonFile,
  requireString,
  requireNumber,
  requireObject,
  requireNonEmptyArray,
  requireEnum,
  validateSeoKeywords
} from './utils/validationHelpers.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const BUILD_DIR = join(__dirname, '..', 'build')

const reporter = new ValidationReporter('Output validation')

const validateCategoryOutput = (context, category) => {
  if (!requireObject(reporter, context, category, 'category must be an object')) {
    return
  }
  requireString(reporter, `${context}.key`, category.key, 'category.key must be a non-empty string')
  requireString(reporter, `${context}.title`, category.title, 'category.title must be a non-empty string')
  reporter.ensure(category.type === 'category', `${context}: category.type must equal "category"`)
}

const validateSubUnitOutput = (context, subUnit) => {
  if (!requireObject(reporter, context, subUnit, 'subUnit must be an object')) {
    return
  }
  requireString(reporter, `${context}.key`, subUnit.key, 'subUnit.key must be a non-empty string')
  requireNumber(reporter, `${context}.factor`, subUnit.factor, 'subUnit.factor must be a valid number')
  requireString(reporter, `${context}.title`, subUnit.title, 'subUnit.title must be a non-empty string')
  if (subUnit.abbreviation !== undefined) {
    requireString(reporter, `${context}.abbreviation`, subUnit.abbreviation, 'subUnit.abbreviation must be a non-empty string when provided')
  }
}

const validateUnitOutput = (context, unit) => {
  if (!requireObject(reporter, context, unit, 'Unit output must be an object')) {
    return
  }
  requireString(reporter, `${context}.key`, unit.key, 'Unit key must be a string')
  reporter.ensure(unit.type === 'unit', `${context}: Unit type must equal "unit"`)
  validateCategoryOutput(`${context}.category`, unit.category)
  if (unit.system) {
    requireEnum(reporter, `${context}.system`, unit.system, MEASUREMENT_SYSTEMS, 'system must be one of')
  }
  requireString(reporter, `${context}.baseUnit`, unit.baseUnit, 'baseUnit must be provided')
  if (requireNonEmptyArray(reporter, `${context}.subUnits`, unit.subUnits, 'subUnits must be a non-empty array')) {
    unit.subUnits.forEach((subUnit, idx) => validateSubUnitOutput(`${context}.subUnits[${idx}]`, subUnit))
  }
  requireString(reporter, `${context}.title`, unit.title, 'Unit title must be provided')
  requireString(reporter, `${context}.description`, unit.description, 'Unit description must be provided')
  validateSeoKeywords(reporter, `${context}.seo`, unit.seo)
}

const validateSeriesOutput = (context, series) => {
  if (!requireObject(reporter, context, series, 'Series output must be an object')) {
    return
  }
  requireString(reporter, `${context}.key`, series.key, 'Series key must be provided')
  reporter.ensure(series.type === 'series', `${context}: Series type must equal "series"`)
  validateCategoryOutput(`${context}.category`, series.category)
  requireString(reporter, `${context}.icon`, series.icon, 'Series icon must be provided')
  requireString(reporter, `${context}.color`, series.color, 'Series color must be provided')
  requireEnum(reporter, `${context}.graphType`, series.graphType, GRAPH_TYPES, 'graphType must be one of')
  if (series.unit) {
    validateUnitOutput(`${context}.unit`, series.unit)
  }
  requireString(reporter, `${context}.name`, series.name, 'Series name must be provided')
  requireString(reporter, `${context}.description`, series.description, 'Series description must be provided')
  validateSeoKeywords(reporter, `${context}.seo`, series.seo)
}

const validateUnitsBundle = (lang) => {
  const unitsPath = join(BUILD_DIR, `units-${lang}.json`)
  const units = readJsonFile(unitsPath)
  if (requireNonEmptyArray(reporter, unitsPath, units, 'Units bundle must be a non-empty array')) {
    units.forEach((unit, idx) => validateUnitOutput(`${unitsPath}[${idx}]`, unit))
  }
  return units
}

const validateSeriesBundle = (lang) => {
  const seriesPath = join(BUILD_DIR, `series-${lang}.json`)
  const series = readJsonFile(seriesPath)
  if (requireNonEmptyArray(reporter, seriesPath, series, 'Series bundle must be a non-empty array')) {
    series.forEach((item, idx) => validateSeriesOutput(`${seriesPath}[${idx}]`, item))
  }
  return series
}

const deepEqual = (a, b) => JSON.stringify(a) === JSON.stringify(b)

const validateLanguageBundle = (lang, units, series) => {
  const bundlePath = join(BUILD_DIR, `bundle-${lang}.json`)
  const bundle = readJsonFile(bundlePath)
  if (!requireObject(reporter, bundlePath, bundle, 'Language bundle must be an object')) {
    return
  }
  reporter.ensure(deepEqual(bundle.units, units), `${bundlePath}: units array does not match units-${lang}.json`)
  reporter.ensure(deepEqual(bundle.series, series), `${bundlePath}: series array does not match series-${lang}.json`)
}

const validateIndex = () => {
  const indexPath = join(BUILD_DIR, 'index.json')
  const index = readJsonFile(indexPath)
  if (!requireObject(reporter, indexPath, index, 'Index file must be an object')) {
    return
  }
  ;['units', 'series'].forEach((key) => {
    const value = index[key]
    if (requireNonEmptyArray(reporter, `${indexPath}.${key}`, value, `${key} list must be a non-empty array`)) {
      value.forEach((entry, idx) => {
        if (!requireObject(reporter, `${indexPath}.${key}[${idx}]`, entry, 'Entry must be an object')) {
          return
        }
        requireString(reporter, `${indexPath}.${key}[${idx}].key`, entry.key, 'Entry must contain a key string')
      })
    }
  })
}

const main = () => {
  LANGUAGES.forEach((lang) => {
    const units = validateUnitsBundle(lang)
    const series = validateSeriesBundle(lang)
    validateLanguageBundle(lang, units, series)
  })
  validateIndex()

  if (reporter.errors.length) {
    console.error('❌ Output validation failed:')
    reporter.errors.forEach((err) => console.error(` - ${err}`))
    process.exit(1)
  } else {
    console.log('✅ Build output matches the schema definitions from Models.md')
  }
}

main()
