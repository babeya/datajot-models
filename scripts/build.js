import { readdirSync, readFileSync, writeFileSync, mkdirSync } from 'fs'
import { join } from 'path'

const baseDir = './models'
const outputDir = './build'
mkdirSync(outputDir, { recursive: true })

const languages = ['fr', 'en']
const models = readdirSync(baseDir).filter(f => !f.startsWith('.'))

// Génération des bundles par langue
for (const lang of languages) {
  const bundle = []

  for (const modelId of models) {
    const modelPath = join(baseDir, modelId, 'model.json')
    const langPath = join(baseDir, modelId, `${lang}.json`)

    const model = JSON.parse(readFileSync(modelPath, 'utf-8'))
    const i18n = JSON.parse(readFileSync(langPath, 'utf-8'))

    bundle.push({ ...model, ...i18n })
  }

  writeFileSync(join(outputDir, `bundle-${lang}.json`), JSON.stringify(bundle, null, 2))
  console.log(`✅ Bundle ${lang} généré (${bundle.length} modèles)`)
}

// Génération d'un index global
const index = models.map(id => ({ id }))
writeFileSync(join(outputDir, 'index.json'), JSON.stringify(index, null, 2))
console.log('✅ Index généré')
