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
  requireNonEmptyArray,
  requireObject,
  requireEnum,
  validateSeoKeywords
} from './utils/validationHelpers.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const ROOT_MODELS_DIR = join(__dirname, '..', 'models')

const reporter = new ValidationReporter('Model schema validation')

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
        requireString(reporter, `${langPath}.subUnits.${subUnit.key}.title`, tx.title, 'subUnit translation requires title string')
        requireString(reporter, `${langPath}.subUnits.${subUnit.key}.abbreviation`, tx.abbreviation, 'subUnit translation requires abbreviation string')
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

const validateSeries = (dir) => {
  const modelPath = join(dir.path, 'model.json')
  const model = readJsonFile(modelPath)

  requireString(reporter, `${modelPath}.key`, model.key, 'Series model requires string key')
  reporter.ensure(model.type === 'series', `${modelPath}: Series model.type must equal "series"`)
  requireString(reporter, `${modelPath}.category`, model.category, 'Series model requires category string')
  requireString(reporter, `${modelPath}.icon`, model.icon, 'Series model requires icon string')
  requireString(reporter, `${modelPath}.color`, model.color, 'Series model requires color string')
  requireEnum(reporter, `${modelPath}.graphType`, model.graphType, GRAPH_TYPES, 'Series graphType must be one of')
  if (model.unit) {
    requireString(reporter, `${modelPath}.unit`, model.unit, 'Series model unit reference must be a string when provided')
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
  if (model.unit) {
    requireString(reporter, `${modelPath}.unit`, model.unit, 'VisualizationConfig model unit reference must be a string when provided')
  }

  // Valider les thresholds si ils existent
  if (model.thresholds && requireNonEmptyArray(reporter, `${modelPath}.thresholds`, model.thresholds, 'VisualizationConfig model thresholds must be array when provided')) {
    model.thresholds.forEach((threshold, idx) => {
      const context = `${modelPath}.thresholds[${idx}]`
      requireNumber(reporter, `${context}.order`, threshold?.order, 'threshold requires order number')
      requireString(reporter, `${context}.operatorType`, threshold?.operatorType, 'threshold requires operatorType string')
      requireNumber(reporter, `${context}.value`, threshold?.value, 'threshold requires value number')
      requireString(reporter, `${context}.colorHex`, threshold?.colorHex, 'threshold requires colorHex string')
    })
  }

  // Valider les yAxisBounds si ils existent
  if (model.yAxisBounds && requireNonEmptyArray(reporter, `${modelPath}.yAxisBounds`, model.yAxisBounds, 'VisualizationConfig model yAxisBounds must be array when provided')) {
    model.yAxisBounds.forEach((bound, idx) => {
      const context = `${modelPath}.yAxisBounds[${idx}]`
      requireNumber(reporter, `${context}.lowerBound`, bound?.lowerBound, 'yAxisBound requires lowerBound number')
      requireNumber(reporter, `${context}.upperBound`, bound?.upperBound, 'yAxisBound requires upperBound number')
    })
  }

  // Valider les traductions
  LANGUAGES.forEach((lang) => {
    const langPath = join(dir.path, `${lang}.json`)
    const translation = readJsonFile(langPath)
    requireString(reporter, `${langPath}.name`, translation.name, 'VisualizationConfig translation requires name string')
    requireString(reporter, `${langPath}.description`, translation.description, 'VisualizationConfig translation requires description string')
    validateSeoKeywords(reporter, `${langPath}.seo`, translation.seo)
  })
}

const validators = {
  categories: validateCategory,
  units: validateUnit,
  series: validateSeries,
  visualizationConfigs: validateVisualizationConfig
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
