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
function generateBundle(type, lang) {
  const models = readModels(type)
  const bundle = []

  for (const modelId of models) {
    const modelPath = join(baseDir, type, modelId, 'model.json')
    const langPath = join(baseDir, type, modelId, `${lang}.json`)

    const model = JSON.parse(readFileSync(modelPath, 'utf-8'))
    const i18n = JSON.parse(readFileSync(langPath, 'utf-8'))

    bundle.push({ ...model, ...i18n })
  }

  return bundle
}

// Génération des bundles par langue
for (const lang of languages) {
  const fullBundle = {}

  for (const type of modelTypes) {
    const bundle = generateBundle(type, lang)
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
