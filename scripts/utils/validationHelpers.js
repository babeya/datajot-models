import { readFileSync } from 'fs'

export const LANGUAGES = ['en', 'fr', 'de']
export const MEASUREMENT_SYSTEMS = ['metric', 'imperial']
export const GRAPH_TYPES = ['line', 'bar', 'area', 'points']

export class ValidationReporter {
  constructor(label = 'Validation') {
    this.label = label
    this.errors = []
  }

  fail(message) {
    this.errors.push(message)
  }

  ensure(condition, message) {
    if (!condition) {
      this.fail(message)
    }
  }

  merge(otherReporter) {
    this.errors.push(...otherReporter.errors)
  }

  throwIfAny() {
    if (this.errors.length) {
      console.error(`${this.label} failed:`)
      this.errors.forEach(err => console.error(` - ${err}`))
      process.exit(1)
    }
  }
}

export const readJsonFile = (path) => JSON.parse(readFileSync(path, 'utf-8'))

export const requireString = (reporter, context, value, message) => {
  if (typeof value !== 'string' || value.trim() === '') {
    reporter.fail(`${context}: ${message}`)
  }
}

export const requireNumber = (reporter, context, value, message) => {
  if (typeof value !== 'number' || Number.isNaN(value)) {
    reporter.fail(`${context}: ${message}`)
  }
}

export const requireBoolean = (reporter, context, value, message) => {
  if (typeof value !== 'boolean') {
    reporter.fail(`${context}: ${message}`)
  }
}

export const requireArray = (reporter, context, value, message) => {
  if (!Array.isArray(value)) {
    reporter.fail(`${context}: ${message}`)
    return false
  }
  return true
}

export const requireNonEmptyArray = (reporter, context, value, message) => {
  if (!requireArray(reporter, context, value, message)) {
    return false
  }
  if (value.length === 0) {
    reporter.fail(`${context}: array must not be empty`)
    return false
  }
  return true
}

export const requireObject = (reporter, context, value, message) => {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    reporter.fail(`${context}: ${message}`)
    return false
  }
  return true
}

export const requireEnum = (reporter, context, value, allowed, message) => {
  if (!allowed.includes(value)) {
    reporter.fail(`${context}: ${message} (${allowed.join(', ')})`)
  }
}

export const validateSeoKeywords = (reporter, context, seo) => {
  if (!requireObject(reporter, context, seo, 'seo must be an object')) {
    return
  }
  const keywordsContext = `${context}.keywords`
  if (!requireArray(reporter, keywordsContext, seo.keywords, 'seo.keywords must be an array')) {
    return
  }
  seo.keywords.forEach((keyword, idx) => {
    requireString(reporter, `${keywordsContext}[${idx}]`, keyword, 'keyword must be a non-empty string when provided')
  })
}
