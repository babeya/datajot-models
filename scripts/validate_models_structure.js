import { readdirSync, statSync } from 'fs'
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
  requireBoolean,
  requireNonEmptyArray,
  requireObject,
  requireEnum,
  validateSeoKeywords
} from './utils/validationHelpers.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const ROOT_MODELS_DIR = join(__dirname, '..', 'models')

const reporter = new ValidationReporter('Model schema validation')

const THRESHOLD_OPERATORS = ['<', '<=', '>', '>=']
const THRESHOLD_AXIS_LABEL_DISPLAY_MODES = ['value', 'label', 'valueAndLabel']
const AGGREGATION_METHODS = ['average', 'sum', 'last', 'min', 'max']

const STAT_BOOLEAN_FIELDS = [
  'showAverage',
  'showMedian',
  'showSum',
  'showCount',
  'showMax',
  'showMin',
  'showAverageOnChart',
  'showMedianOnChart',
  'showMaxOnChart',
  'showMinOnChart',
  'autoScaleYAxis'
]

const listModelDirectories = (type) => {
  const typeDir = join(ROOT_MODELS_DIR, type)
  return readdirSync(typeDir)
    .filter((entry) => !entry.startsWith('.') && statSync(join(typeDir, entry)).isDirectory())
    .map((entry) => ({ id: entry, path: join(typeDir, entry) }))
}

const validateCategory = (dir) => {
  const modelPath = join(dir.path, 'model.json')
  const model = readJsonFile(modelPath)
  requireString(reporter, `${modelPath}.key`, model.key, 'Category model requires string key')
  reporter.ensure(model.type === 'category', `${modelPath}: Category model.type must equal "category"`)

  LANGUAGES.forEach((lang) => {
    const langPath = join(dir.path, `${lang}.json`)
    const translation = readJsonFile(langPath)
    requireString(reporter, `${langPath}.title`, translation.title, 'Category translation requires title string')
  })
}

const validateUnit = (dir) => {
  const modelPath = join(dir.path, 'model.json')
  const model = readJsonFile(modelPath)

  requireString(reporter, `${modelPath}.key`, model.key, 'Unit model requires string key')
  reporter.ensure(model.type === 'unit', `${modelPath}: Unit model.type must equal "unit"`)
  requireString(reporter, `${modelPath}.category`, model.category, 'Unit model requires category string')
  if (model.system) {
    requireEnum(reporter, `${modelPath}.system`, model.system, MEASUREMENT_SYSTEMS, 'system must be one of')
  }
  requireString(reporter, `${modelPath}.baseUnit`, model.baseUnit, 'Unit model requires baseUnit string')
  if (requireNonEmptyArray(reporter, `${modelPath}.subUnits`, model.subUnits, 'Unit model requires subUnits array')) {
    model.subUnits.forEach((subUnit, idx) => {
      const context = `${modelPath}.subUnits[${idx}]`
      requireString(reporter, `${context}.key`, subUnit?.key, 'subUnit requires key string')
      requireNumber(reporter, `${context}.factor`, subUnit?.factor, 'subUnit.factor must be a valid number')
    })
    if (model.key === 'count') {
      reporter.ensure(model.baseUnit === 'count', `${modelPath}: count unit baseUnit must be "count"`)
      reporter.ensure(model.subUnits.length === 1, `${modelPath}: count unit must define exactly one subUnit`)
      reporter.ensure(model.subUnits[0]?.key === 'count', `${modelPath}: count unit subUnit key must be "count"`)
      reporter.ensure(model.subUnits[0]?.factor === 1, `${modelPath}: count unit subUnit factor must be 1`)
    }
  }

  LANGUAGES.forEach((lang) => {
    const langPath = join(dir.path, `${lang}.json`)
    const translation = readJsonFile(langPath)
    requireString(reporter, `${langPath}.title`, translation.title, 'Unit translation requires title string')
    requireString(reporter, `${langPath}.description`, translation.description, 'Unit translation requires description string')
    if (requireObject(reporter, `${langPath}.subUnits`, translation.subUnits, 'Unit translation requires subUnits object')) {
      const translationKeys = Object.keys(translation.subUnits)
      model.subUnits?.forEach((subUnit) => {
      const tx = translation.subUnits[subUnit.key]
      if (!tx) {
        reporter.fail(`${langPath}: missing subUnits entry for key "${subUnit.key}"`)
        return
      }
        const allowsEmptyLabel = model.key === 'count' && subUnit.key === 'count'
        if (allowsEmptyLabel) {
          reporter.ensure(typeof tx.title === 'string', `${langPath}.subUnits.${subUnit.key}.title: subUnit translation requires title string`)
          reporter.ensure(typeof tx.abbreviation === 'string', `${langPath}.subUnits.${subUnit.key}.abbreviation: subUnit translation requires abbreviation string`)
        } else {
          requireString(reporter, `${langPath}.subUnits.${subUnit.key}.title`, tx.title, 'subUnit translation requires title string')
          requireString(reporter, `${langPath}.subUnits.${subUnit.key}.abbreviation`, tx.abbreviation, 'subUnit translation requires abbreviation string')
        }
      })
      translationKeys.forEach((key) => {
        if (!model.subUnits?.some((subUnit) => subUnit.key === key)) {
          reporter.fail(`${langPath}: translation subUnits key "${key}" not defined in model subUnits`)
        }
      })
    }
    validateSeoKeywords(reporter, `${langPath}.seo`, translation.seo)
  })
}

const validateSvcStats = (context, svc) => {
  STAT_BOOLEAN_FIELDS.forEach((field) => {
    requireBoolean(reporter, `${context}.${field}`, svc[field], `${field} must be a boolean`)
  })

  ;['showAverageOnChart', 'showMedianOnChart', 'showMaxOnChart', 'showMinOnChart'].forEach((field) => {
    reporter.ensure(svc[field] === false, `${context}.${field}: chart stats must always be disabled in SVC model configs`)
  })
}

const validateSeries = (dir) => {
  const modelPath = join(dir.path, 'model.json')
  const model = readJsonFile(modelPath)

  requireString(reporter, `${modelPath}.key`, model.key, 'Series model requires string key')
  reporter.ensure(model.type === 'series', `${modelPath}: Series model.type must equal "series"`)
  requireString(reporter, `${modelPath}.category`, model.category, 'Series model requires category string')
  requireString(reporter, `${modelPath}.icon`, model.icon, 'Series model requires icon string')
  requireString(reporter, `${modelPath}.color`, model.color, 'Series model requires color string')
  requireEnum(reporter, `${modelPath}.graphType`, model.graphType, GRAPH_TYPES, 'Series graphType must be one of')
  if (model.unit !== undefined) {
    requireString(reporter, `${modelPath}.unit`, model.unit, 'Series model unit reference must be a string when provided')
  }
  if (model.svc !== undefined) {
    requireString(reporter, `${modelPath}.svc`, model.svc, 'Series model SVC reference must be a string when provided')
  }
  if (model.decimalPrecision !== undefined) {
    requireNumber(reporter, `${modelPath}.decimalPrecision`, model.decimalPrecision, 'Series decimalPrecision must be a valid number when provided')
  }
  if (model.aggregationType !== undefined) {
    reporter.fail(`${modelPath}: use aggregationMethod instead of aggregationType`)
  }
  if (model.aggregationMethod !== undefined) {
    requireEnum(reporter, `${modelPath}.aggregationMethod`, model.aggregationMethod, AGGREGATION_METHODS, 'Series aggregationMethod must be one of')
  }
  if (model.unit === 'count') {
    reporter.ensure(model.decimalPrecision === 0, `${modelPath}: count series must set decimalPrecision to 0`)
  }
  if (model.visualisationConfig !== undefined) {
    reporter.fail(`${modelPath}: use svc instead of visualisationConfig`)
  }
  if (model.visualizationConfig !== undefined) {
    reporter.fail(`${modelPath}: use svc instead of visualizationConfig`)
  }
  if (model.stats !== undefined) {
    reporter.fail(`${modelPath}: stats must be configured on the referenced svc, not on the series model`)
  }

  LANGUAGES.forEach((lang) => {
    const langPath = join(dir.path, `${lang}.json`)
    const translation = readJsonFile(langPath)
    requireString(reporter, `${langPath}.name`, translation.name, 'Series translation requires name string')
    requireString(reporter, `${langPath}.description`, translation.description, 'Series translation requires description string')
    validateSeoKeywords(reporter, `${langPath}.seo`, translation.seo)
  })
}

const validateVisualizationConfig = (dir) => {
  const modelPath = join(dir.path, 'model.json')
  const model = readJsonFile(modelPath)

  requireString(reporter, `${modelPath}.key`, model.key, 'VisualizationConfig model requires string key')
  reporter.ensure(model.type === 'visualizationConfig', `${modelPath}: VisualizationConfig model.type must equal "visualizationConfig"`)
  
  // Vérifier que le champ label n'existe pas (doit être dans les traductions)
  if (model.label !== undefined) {
    reporter.fail(`${modelPath}: VisualizationConfig model should not have label field (use translations instead)`)
  }

  // Vérifier l'unité si elle existe
  if (model.unit !== undefined) {
    requireString(reporter, `${modelPath}.unit`, model.unit, 'VisualizationConfig model unit reference must be a string when provided')
  }

  // Valider les thresholds si ils existent
  if (model.thresholds && requireNonEmptyArray(reporter, `${modelPath}.thresholds`, model.thresholds, 'VisualizationConfig model thresholds must be array when provided')) {
    model.thresholds.forEach((threshold, idx) => {
      const context = `${modelPath}.thresholds[${idx}]`
      requireNumber(reporter, `${context}.order`, threshold?.order, 'threshold requires order number')
      requireEnum(reporter, `${context}.operatorType`, threshold?.operatorType, THRESHOLD_OPERATORS, 'threshold operatorType must be one of')
      requireNumber(reporter, `${context}.value`, threshold?.value, 'threshold requires value number')
      requireString(reporter, `${context}.colorHex`, threshold?.colorHex, 'threshold requires colorHex string')
      if (threshold?.label !== undefined) {
        reporter.fail(`${context}: threshold label must be defined in translations`)
      }
    })
  }

  requireEnum(
    reporter,
    `${modelPath}.thresholdAxisLabelDisplayMode`,
    model.thresholdAxisLabelDisplayMode,
    THRESHOLD_AXIS_LABEL_DISPLAY_MODES,
    'thresholdAxisLabelDisplayMode must be one of'
  )

  if (model.yAxisBounds !== undefined) {
    reporter.fail(`${modelPath}: use autoScaleYAxis instead of yAxisBounds`)
  }

  validateSvcStats(modelPath, model)

  // Valider les traductions
  LANGUAGES.forEach((lang) => {
    const langPath = join(dir.path, `${lang}.json`)
    const translation = readJsonFile(langPath)
    requireString(reporter, `${langPath}.label`, translation.label, 'VisualizationConfig translation requires label string')
    requireString(reporter, `${langPath}.description`, translation.description, 'VisualizationConfig translation requires description string')
    if (requireObject(reporter, `${langPath}.thresholds`, translation.thresholds, 'VisualizationConfig translation requires thresholds object')) {
      const translationKeys = Object.keys(translation.thresholds)
      model.thresholds?.forEach((threshold) => {
        const thresholdTranslation = translation.thresholds[String(threshold.order)]
        if (!thresholdTranslation) {
          reporter.fail(`${langPath}: missing thresholds entry for order "${threshold.order}"`)
          return
        }
        requireString(
          reporter,
          `${langPath}.thresholds.${threshold.order}.label`,
          thresholdTranslation.label,
          'threshold translation requires label string'
        )
      })
      translationKeys.forEach((key) => {
        if (!model.thresholds?.some((threshold) => String(threshold.order) === key)) {
          reporter.fail(`${langPath}: translation thresholds key "${key}" not defined in model thresholds`)
        }
      })
    }
    validateSeoKeywords(reporter, `${langPath}.seo`, translation.seo)
  })
}

const validators = {
  categories: validateCategory,
  units: validateUnit,
  series: validateSeries,
  svc: validateVisualizationConfig
}

const main = () => {
  Object.entries(validators).forEach(([type, validator]) => {
    const directories = listModelDirectories(type)
    directories.forEach((dir) => validator(dir))
  })

  if (reporter.errors.length) {
    console.error('❌ Model validation failed:')
    reporter.errors.forEach((err) => console.error(` - ${err}`))
    process.exit(1)
  } else {
    console.log('✅ All models conform to Models.md schema definition')
  }
}

main()
