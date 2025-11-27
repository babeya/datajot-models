import { readdirSync, readFileSync, writeFileSync, mkdirSync, existsSync, statSync } from 'fs'
import { join } from 'path'

const baseDir = './models'
const outputDir = './build'
mkdirSync(outputDir, { recursive: true })

const languages = ['fr', 'en']
const modelTypes = ['series', 'units']

/**
 * Lit tous les modèles d'un type donné
 */
function readModels(type) {
  const typeDir = join(baseDir, type)
  if (!existsSync(typeDir)) return []
  return readdirSync(typeDir).filter(f => {
    if (f.startsWith('.')) return false
    const fullPath = join(typeDir, f)
    return statSync(fullPath).isDirectory()
  })
}

/**
 * Génère un bundle pour un type et une langue donnés
 */
function generateBundle(type, lang, unitsMap = null, categoriesMap = null) {
  const models = readModels(type)
  const bundle = []

  for (const modelId of models) {
    const modelPath = join(baseDir, type, modelId, 'model.json')
    const langPath = join(baseDir, type, modelId, `${lang}.json`)

    const model = JSON.parse(readFileSync(modelPath, 'utf-8'))
    const i18n = JSON.parse(readFileSync(langPath, 'utf-8'))

    const item = { ...model, ...i18n }

    // Si c'est une série avec une unité et qu'on a une map des unités, on injecte l'objet complet
    if (type === 'series' && item.unit && unitsMap && unitsMap[item.unit]) {
      item.unitObject = unitsMap[item.unit]
    }

    // Si l'item a une catégorie et qu'on a une map des catégories, on injecte l'objet complet
    if (item.category && categoriesMap && categoriesMap[item.category]) {
      item.categoryObject = categoriesMap[item.category]
    }

    bundle.push(item)
  }

  return bundle
}

// Génération des bundles par langue
for (const lang of languages) {
  const fullBundle = {}

  // Charger d'abord les catégories pour créer une map
  const categoriesModels = readModels('categories')
  const categoriesMap = {}
  for (const categoryId of categoriesModels) {
    const modelPath = join(baseDir, 'categories', categoryId, 'model.json')
    const langPath = join(baseDir, 'categories', categoryId, `${lang}.json`)
    const model = JSON.parse(readFileSync(modelPath, 'utf-8'))
    const i18n = JSON.parse(readFileSync(langPath, 'utf-8'))
    categoriesMap[categoryId] = { ...model, ...i18n }
  }

  // Charger les unités pour créer une map
  const unitsBundle = generateBundle('units', lang, null, categoriesMap)
  const unitsMap = {}
  for (const unit of unitsBundle) {
    unitsMap[unit.id] = unit
  }

  for (const type of modelTypes) {
    const bundle = type === 'series' 
      ? generateBundle(type, lang, unitsMap, categoriesMap)
      : generateBundle(type, lang, null, categoriesMap)
    
    fullBundle[type] = bundle
    
    // Génère aussi un bundle séparé par type
    writeFileSync(join(outputDir, `${type}-${lang}.json`), JSON.stringify(bundle, null, 2))
    console.log(`✅ Bundle ${type}-${lang} généré (${bundle.length} éléments)`)
  }

  // Bundle combiné par langue
  writeFileSync(join(outputDir, `bundle-${lang}.json`), JSON.stringify(fullBundle, null, 2))
  console.log(`✅ Bundle ${lang} généré`)
}

// Génération d'un index global
const index = {
  series: readModels('series').map(id => ({ id })),
  units: readModels('units').map(id => ({ id }))
}
writeFileSync(join(outputDir, 'index.json'), JSON.stringify(index, null, 2))
console.log('✅ Index généré')
