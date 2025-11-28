import { readdirSync, readFileSync, writeFileSync, mkdirSync, existsSync, statSync } from 'fs'
import { join } from 'path'

// Constants
const BASE_DIR = './models'
const OUTPUT_DIR = './build'
const LANGUAGES = ['fr', 'en']
const MODEL_TYPES = ['series', 'units']
const TYPE_CATEGORIES = 'categories'
const TYPE_UNITS = 'units'
const TYPE_SERIES = 'series'
const FILE_MODEL = 'model.json'
const FILE_INDEX = 'index.json'
const ENCODING_UTF8 = 'utf-8'
const FIELD_KEY = 'key'
const FIELD_SUB_UNITS = 'subUnits'
const FIELD_SUB_UNIT_TITLES = 'subUnitTitles'
const FIELD_UNIT = 'unit'
const FIELD_CATEGORY = 'category'

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
  if (!model[FIELD_SUB_UNITS] || !i18n[FIELD_SUB_UNIT_TITLES]) {
    return null
  }
  
  return model[FIELD_SUB_UNITS].map(subUnit => {
    const i18nData = i18n[FIELD_SUB_UNIT_TITLES][subUnit[FIELD_KEY]] || {}
    return {
      key: subUnit[FIELD_KEY],
      abbreviation: subUnit.abbreviation,
      symbol: subUnit.symbol,
      factor: subUnit.factor,
      title: i18nData.title
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
    delete item[FIELD_SUB_UNIT_TITLES]
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
 * Process a single model item
 */
const processModelItem = (type) => (unitsMap, categoriesMap) => (model, i18n) => {
  let item = { ...model, ...i18n }
  
  // Apply type-specific transformations
  if (type === TYPE_UNITS) {
    item = applyUnitTransformation(item, model, i18n)
  }
  
  if (type === TYPE_SERIES) {
    item = injectUnit(item, unitsMap)
  }
  
  item = injectCategory(item, categoriesMap)
  
  return item
}

/**
 * Generate a bundle for a given type and language
 */
function generateBundle(type, lang, unitsMap = null, categoriesMap = null) {
  const models = readModels(type)
  const processItem = processModelItem(type)(unitsMap, categoriesMap)
  
  return models.map(modelId => {
    const { model, i18n } = readModelFiles(type, modelId, lang)
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
  
  // Generate bundles for each model type
  for (const type of MODEL_TYPES) {
    const bundle = type === TYPE_SERIES 
      ? generateBundle(type, lang, unitsMap, categoriesMap)
      : generateBundle(type, lang, null, categoriesMap)
    
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
    units: readModels(TYPE_UNITS).map(key => ({ key }))
  }
  writeBundleFile(FILE_INDEX, index)
  console.log('✅ Index generated')
}

// Main execution
for (const lang of LANGUAGES) {
  generateLanguageBundles(lang)
}

generateIndex()
