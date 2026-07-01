import { readdirSync, readFileSync, writeFileSync, mkdirSync, existsSync, statSync } from 'fs'
import { join } from 'path'

// Constants
const BASE_DIR = './models'
const OUTPUT_DIR = './build'
const LANGUAGES = ['fr', 'en', 'de']
const MODEL_TYPES = ['series', 'units', 'svc']
const TYPE_CATEGORIES = 'categories'
const TYPE_UNITS = 'units'
const TYPE_SERIES = 'series'
const TYPE_VISUALIZATION_CONFIGS = 'svc'
const FILE_MODEL = 'model.json'
const FILE_INDEX = 'index.json'
const ENCODING_UTF8 = 'utf-8'
const FIELD_KEY = 'key'
const FIELD_SUB_UNITS = 'subUnits'
const FIELD_UNIT = 'unit'
const FIELD_CATEGORY = 'category'
const FIELD_SVC = 'svc'
const FIELD_THRESHOLDS = 'thresholds'

mkdirSync(OUTPUT_DIR, { recursive: true })

/**
 * Read all models of a given type
 */
function readModels(type) {
  const typeDir = join(BASE_DIR, type)
  if (!existsSync(typeDir)) return []
  return readdirSync(typeDir).filter(f => {
    if (f.startsWith('.')) return false
    const fullPath = join(typeDir, f)
    return statSync(fullPath).isDirectory()
  })
}

/**
 * Read model and translation files for a given model ID
 */
const readModelFiles = (type, modelId, lang) => {
  const modelPath = join(BASE_DIR, type, modelId, FILE_MODEL)
  const langPath = join(BASE_DIR, type, modelId, `${lang}.json`)
  
  const model = JSON.parse(readFileSync(modelPath, ENCODING_UTF8))
  const i18n = JSON.parse(readFileSync(langPath, ENCODING_UTF8))
  
  return { model, i18n }
}

/**
 * Transform subUnits by combining model data with translations
 */
const transformSubUnits = (model, i18n) => {
  const modelSubUnits = model[FIELD_SUB_UNITS]
  if (!Array.isArray(modelSubUnits) || !modelSubUnits.length) {
    return null
  }

  const i18nSubUnits = i18n[FIELD_SUB_UNITS]
  if (!i18nSubUnits) {
    throw new Error(`Missing subUnits translations for unit ${model[FIELD_KEY]}`)
  }
  
  return modelSubUnits.map(subUnit => {
    const i18nData = i18nSubUnits[subUnit[FIELD_KEY]] || {}
    return {
      key: subUnit[FIELD_KEY],
      factor: subUnit.factor,
      abbreviation: i18nData.abbreviation ?? subUnit.abbreviation ?? subUnit[FIELD_KEY],
      title: i18nData.title ?? ''
    }
  })
}

/**
 * Apply unit transformation to an item
 */
const applyUnitTransformation = (item, model, i18n) => {
  const subUnitsArray = transformSubUnits(model, i18n)
  if (subUnitsArray) {
    item[FIELD_SUB_UNITS] = subUnitsArray
  }
  return item
}

/**
 * Transform thresholds by combining model data with translations.
 */
const transformThresholds = (model, i18n) => {
  const modelThresholds = model[FIELD_THRESHOLDS]
  if (!Array.isArray(modelThresholds) || !modelThresholds.length) {
    return null
  }

  const i18nThresholds = i18n[FIELD_THRESHOLDS]
  if (!i18nThresholds) {
    throw new Error(`Missing thresholds translations for svc ${model[FIELD_KEY]}`)
  }

  return modelThresholds.map((threshold) => {
    const i18nData = i18nThresholds[String(threshold.order)] || {}
    if (typeof i18nData.label !== 'string' || !i18nData.label.trim()) {
      throw new Error(`Missing threshold label translation for svc ${model[FIELD_KEY]} order ${threshold.order}`)
    }

    return {
      ...threshold,
      label: i18nData.label
    }
  })
}

/**
 * Apply visualization config transformation to an item.
 */
const applyVisualizationConfigTransformation = (item, model, i18n) => {
  const thresholdsArray = transformThresholds(model, i18n)
  if (thresholdsArray) {
    item[FIELD_THRESHOLDS] = thresholdsArray
  }
  return item
}

/**
 * Inject full unit object if available
 */
const injectUnit = (item, unitsMap) => {
  if (item[FIELD_UNIT] && unitsMap && unitsMap[item[FIELD_UNIT]]) {
    item[FIELD_UNIT] = unitsMap[item[FIELD_UNIT]]
  }
  return item
}

/**
 * Inject full category object if available
 */
const injectCategory = (item, categoriesMap) => {
  if (item[FIELD_CATEGORY] && categoriesMap && categoriesMap[item[FIELD_CATEGORY]]) {
    item[FIELD_CATEGORY] = categoriesMap[item[FIELD_CATEGORY]]
  }
  return item
}

/**
 * Inject full SVC object if available
 */
const injectSvc = (item, visualizationConfigsMap) => {
  if (item[FIELD_SVC] && visualizationConfigsMap) {
    if (visualizationConfigsMap[item[FIELD_SVC]]) {
      item[FIELD_SVC] = visualizationConfigsMap[item[FIELD_SVC]]
    } else {
      console.warn(`⚠️  Warning: SVC '${item[FIELD_SVC]}' not found for series '${item[FIELD_KEY]}'`)
    }
  }
  return item
}

/**
 * Process a single model item
 */
const processModelItem = (type) => (unitsMap, categoriesMap, visualizationConfigsMap) => (model, i18n) => {
  let item = { ...model, ...i18n }
  
  // Apply type-specific transformations
  if (type === TYPE_UNITS) {
    item = applyUnitTransformation(item, model, i18n)
  }

  if (type === TYPE_VISUALIZATION_CONFIGS) {
    item = applyVisualizationConfigTransformation(item, model, i18n)
  }
  
  if (type === TYPE_SERIES) {
    item = injectUnit(item, unitsMap)
    item = injectSvc(item, visualizationConfigsMap)
  }
  
  item = injectCategory(item, categoriesMap)
  
  return item
}

/**
 * Generate a bundle for a given type and language
 */
function generateBundle(type, lang, unitsMap = null, categoriesMap = null, visualizationConfigsMap = null) {
  // Handle visualization type by mapping to visualizationConfigs directory
  const actualType = type === 'svc' ? TYPE_VISUALIZATION_CONFIGS : type
  const models = readModels(actualType)
  const processItem = processModelItem(actualType)(unitsMap, categoriesMap, visualizationConfigsMap)
  
  return models.map(modelId => {
    const { model, i18n } = readModelFiles(actualType, modelId, lang)
    return processItem(model, i18n)
  })
}

/**
 * Load categories and create a map
 */
const loadCategoriesMap = (lang) => {
  const categoriesModels = readModels(TYPE_CATEGORIES)
  const categoriesMap = {}
  
  for (const categoryId of categoriesModels) {
    const { model, i18n } = readModelFiles(TYPE_CATEGORIES, categoryId, lang)
    categoriesMap[categoryId] = { ...model, ...i18n }
  }
  
  return categoriesMap
}

/**
 * Load units and create a map
 */
const loadUnitsMap = (lang, categoriesMap) => {
  const unitsBundle = generateBundle(TYPE_UNITS, lang, null, categoriesMap)
  const unitsMap = {}
  
  for (const unit of unitsBundle) {
    unitsMap[unit[FIELD_KEY]] = unit
  }
  
  return unitsMap
}

/**
 * Load visualizationConfigs and create a map
 */
const loadVisualizationConfigsMap = (lang) => {
  const visualizationConfigsModels = readModels(TYPE_VISUALIZATION_CONFIGS)
  const visualizationConfigsMap = {}
  
  for (const configId of visualizationConfigsModels) {
    try {
      // Try to read with translations first
      const { model, i18n } = readModelFiles(TYPE_VISUALIZATION_CONFIGS, configId, lang)
      visualizationConfigsMap[configId] = applyVisualizationConfigTransformation({ ...model, ...i18n }, model, i18n)
    } catch (error) {
      // Fallback to model.json only if translation files don't exist
      if (error.code === 'ENOENT') {
        const modelPath = join(BASE_DIR, TYPE_VISUALIZATION_CONFIGS, configId, FILE_MODEL)
        const model = JSON.parse(readFileSync(modelPath, ENCODING_UTF8))
        visualizationConfigsMap[configId] = model
      } else {
        throw error
      }
    }
  }
  
  return visualizationConfigsMap
}

/**
 * Generate visualization bundle for a specific language
 */
const generateVisualizationBundle = (lang, categoriesMap) => {
  const visualizationConfigsModels = readModels(TYPE_VISUALIZATION_CONFIGS)
  
  return visualizationConfigsModels.map(modelId => {
    try {
      // Try to read with translations first
      const { model, i18n } = readModelFiles('svc', modelId, lang)
      let item = applyVisualizationConfigTransformation({ ...model, ...i18n }, model, i18n)
      
      // Inject category if available
      item = injectCategory(item, categoriesMap)
      
      return item
    } catch (error) {
      // Fallback to model.json only if translation files don't exist
      if (error.code === 'ENOENT') {
        const modelPath = join(BASE_DIR, 'svc', modelId, FILE_MODEL)
        let model = JSON.parse(readFileSync(modelPath, ENCODING_UTF8))
        
        // Inject category if available
        model = injectCategory(model, categoriesMap)
        
        return model
      } else {
        throw error
      }
    }
  })
}

/**
 * Write bundle file to disk
 */
const writeBundleFile = (filename, data) => {
  writeFileSync(join(OUTPUT_DIR, filename), JSON.stringify(data, null, 2))
}

/**
 * Generate bundles for a specific language
 */
const generateLanguageBundles = (lang) => {
  const fullBundle = {}
  
  // Load categories first
  const categoriesMap = loadCategoriesMap(lang)
  
  // Load units
  const unitsMap = loadUnitsMap(lang, categoriesMap)
  
  // Load visualizationConfigs
  const visualizationConfigsMap = loadVisualizationConfigsMap(lang)
  
  // Generate bundles for each model type
  for (const type of MODEL_TYPES) {
    let bundle
    
    if (type === 'svc') {
      bundle = generateVisualizationBundle(lang, categoriesMap)
    } else {
      bundle = type === TYPE_SERIES 
        ? generateBundle(type, lang, unitsMap, categoriesMap, visualizationConfigsMap)
        : generateBundle(type, lang, null, categoriesMap)
    }
    
    fullBundle[type] = bundle
    
    // Write individual bundle file
    writeBundleFile(`${type}-${lang}.json`, bundle)
    console.log(`✅ Bundle ${type}-${lang} generated (${bundle.length} items)`)
  }

  // Write combined bundle file
  writeBundleFile(`bundle-${lang}.json`, fullBundle)
  console.log(`✅ Bundle ${lang} generated`)
}

/**
 * Generate global index file
 */
const generateIndex = () => {
  const index = {
    series: readModels(TYPE_SERIES).map(key => ({ key })),
    units: readModels(TYPE_UNITS).map(key => ({ key })),
    svc: readModels(TYPE_VISUALIZATION_CONFIGS).map(key => ({ key }))
  }
  writeBundleFile(FILE_INDEX, index)
  console.log('✅ Index generated')
}

// Main execution
for (const lang of LANGUAGES) {
  generateLanguageBundles(lang)
}

generateIndex()
