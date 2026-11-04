import assert from 'node:assert/strict'
import { readFileSync, readdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

const root = fileURLToPath(new URL('../', import.meta.url))
const read = (path) => JSON.parse(readFileSync(`${root}${path}`, 'utf8'))
const locales = ['en', 'fr', 'de', 'es']
const matrix = read('docs/homekit-mapping.json')
// Independent identifier snapshot from HomeKitCharacteristicKind at the pinned app commit.
const identifiers = `temperature humidity carbonDioxide airQuality lightLevel contactState
motionDetected occupancyDetected powerState outletInUse currentPosition carbonDioxidePeakLevel
carbonMonoxide carbonMonoxidePeakLevel airParticulateDensity ozoneDensity nitrogenDioxideDensity
sulphurDioxideDensity pm2_5Density pm10Density volatileOrganicCompoundDensity airParticulateSize
smokeDetected leakDetected carbonMonoxideDetected carbonDioxideDetected obstructionDetected
brightness saturation hue colorTemperature outputState active inUse targetPosition
currentHorizontalTilt targetHorizontalTilt currentVerticalTilt targetVerticalTilt currentTilt targetTilt
currentDoorState targetDoorState slatType positionState currentSlatState currentLockMechanismState
targetSecuritySystemState targetLockMechanismState securitySystemAlarmType lockPhysicalControls
currentSecuritySystemState lockMechanismLastKnownAction lockManagementAutoSecureTimeout
targetTemperature heatingThreshold coolingThreshold targetRelativeHumidity humidifierThreshold
dehumidifierThreshold currentHeatingCooling targetHeaterCoolerState targetHumidifierDehumidifierState
targetHeatingCooling currentHeaterCoolerState currentHumidifierDehumidifierState rotationSpeed
filterLifeLevel currentFanState currentAirPurifierState rotationDirection targetFanState
targetAirPurifierState swingMode filterChangeIndication waterLevel setDuration remainingDuration
valveType programMode batteryLevel statusLowBattery chargingState statusActive statusFault
statusJammed statusTampered inputEvent volume mute nightVision imageMirroring opticalZoom
digitalZoom imageRotation currentMediaState targetMediaState wifiSatelliteStatus currentVisibilityState
targetVisibilityState routerStatus closedCaptions pictureMode`.split(/\s+/)
const statFields = ['showAverage', 'showMedian', 'showSum', 'showCount', 'showMax', 'showMin',
  'showAverageOnChart', 'showMedianOnChart', 'showMaxOnChart', 'showMinOnChart']
const compare = {
  '<': (value, bound) => value < bound,
  '<=': (value, bound) => value <= bound,
  '>': (value, bound) => value > bound,
  '>=': (value, bound) => value >= bound
}
const source = Object.fromEntries(['series', 'units', 'svc', 'categories'].map(kind => [kind,
  new Map(readdirSync(`${root}models/${kind}`, { withFileTypes: true })
    .filter(entry => entry.isDirectory())
    .map(entry => [entry.name, read(`models/${kind}/${entry.name}/model.json`)]))]))

assert.equal(identifiers.length, 103)
assert.equal(matrix.characteristics.length, 103)
assert.deepEqual(matrix.characteristics.map(e => e.identifier).sort(), [...identifiers].sort())
const byId = new Map(matrix.characteristics.map(e => [e.identifier, e]))
for (const kind of ['series', 'units', 'svc']) {
  assert.equal(new Set(matrix.baselineKeys[kind]).size, matrix.baselineKeys[kind].length)
  for (const key of matrix.baselineKeys[kind]) assert(source[kind].has(key), `Historical key lost: ${kind}/${key}`)
}
assert.deepEqual(Object.fromEntries(Object.entries(matrix.baselineKeys).map(([k, v]) => [k, v.length])),
  { series: 32, units: 27, svc: 25 })

function validateMapping(e) {
  const series = source.series.get(e.series.key)
  const svc = source.svc.get(e.configuration.key)
  assert(series, `${e.identifier}: missing series`)
  assert(svc, `${e.identifier}: missing configuration`)
  assert.equal(series.unit ?? null, e.unit.key, `${e.identifier}: unit differs`)
  assert.equal(svc.unit ?? null, e.unit.key, `${e.identifier}: configuration unit differs`)
  assert.equal(series.svc, e.configuration.key)
  assert.equal(series.aggregationMethod, e.aggregationMethod)
  assert.equal(series.decimalPrecision, e.decimalPrecision)
  assert.equal(svc.includesEmptyAggregates, false, `${e.identifier}: missing readings must stay absent`)
  assert(['P0', 'P1', 'P2'].includes(e.priority))
  assert.equal(e.decision, 'ready')
  assert(e.reference.startsWith('https://developer.apple.com/documentation/homekit/'))
  if (e.unit.key) assert(source.units.has(e.unit.key))
  else assert(e.unit.reason)
  for (const [field, kind] of [['series', 'series'], ['unit', 'units'], ['configuration', 'svc']]) {
    const ref = e[field]
    const expected = ref.key === null ? 'none' : matrix.baselineKeys[kind].includes(ref.key) ? 'existing' : 'added'
    assert.equal(ref.status, expected, `${e.identifier}: incorrect resource status`)
  }
  if (e.states) {
    assert.equal(series.aggregationMethod, 'last')
    assert.equal(series.decimalPrecision, 0)
    assert.equal(series.graphType, 'bar')
    assert.equal(series.unit, undefined)
    assert.equal(svc.thresholdAxisLabelDisplayMode, 'label')
    assert.deepEqual(e.domain.values, e.states.map(s => s.code))
    assert.equal(svc.thresholds.length, e.states.length)
    for (const field of statFields) assert.equal(svc[field], false, `${e.identifier}: ${field}`)
    for (const state of e.states) {
      assert(Number.isInteger(state.code))
      assert.deepEqual(Object.keys(state.labels).sort(), [...locales].sort())
      if (e.publicEnum) assert(state.publicSymbol.startsWith(e.publicEnum))
    }
  } else {
    assert.equal(e.thresholdPolicy, 'neutral')
    assert.deepEqual(svc.thresholds, [])
    assert.equal(svc.thresholdAxisLabelDisplayMode, 'value')
  }
}
matrix.characteristics.forEach(validateMapping)

function validateReferences() {
  for (const series of source.series.values()) {
    assert(source.categories.has(series.category))
    if (series.unit) assert(source.units.has(series.unit))
    if (series.svc) assert(source.svc.has(series.svc))
  }
  for (const svc of source.svc.values()) if (svc.unit) assert(source.units.has(svc.unit))
  for (const unit of source.units.values()) {
    assert(source.categories.has(unit.category))
    assert(unit.subUnits.some(s => s.key === unit.baseUnit && s.factor === 1))
    assert(unit.subUnits.every(s => Number.isFinite(s.factor) && s.factor > 0))
  }
  const referenced = {
    units: new Set([...source.series.values(), ...source.svc.values()].map(s => s.unit)),
    svc: new Set([...source.series.values()].map(s => s.svc))
  }
  // Some legacy resources are standalone presets. New resources must all be used.
  for (const kind of ['units', 'svc']) for (const key of source[kind].keys()) {
    if (!matrix.baselineKeys[kind].includes(key)) assert(referenced[kind].has(key), `New orphan: ${kind}/${key}`)
  }
  const mapped = new Set(matrix.characteristics.map(e => e.series.key))
  for (const key of source.series.keys()) {
    if (!matrix.baselineKeys.series.includes(key)) assert(mapped.has(key), `Unmapped new series: ${key}`)
  }
}
validateReferences()

function validateStateRendering(e, series, lang) {
  const thresholds = [...series.svc.thresholds].sort((a, b) => a.order - b.order)
  for (const state of e.states) {
    // These are the app's two lookup modes: ordered comparison and exact-value labels.
    const comparisonMatch = thresholds.find(t => compare[t.operatorType](state.code, t.value))
    const exactMatch = thresholds.find(t => state.code === t.value)
    for (const match of [comparisonMatch, exactMatch]) {
      assert(match, `${lang}/${e.identifier}: uncovered code ${state.code}`)
      assert.equal(match.label, state.labels[lang], `${lang}/${e.identifier}/${state.code}: wrong label`)
      assert.equal(match.colorHex, state.colorHex, `${lang}/${e.identifier}/${state.code}: wrong color`)
    }
  }
}

function validateBundles(lang) {
  const bundle = read(`build/bundle-${lang}.json`)
  assert.deepEqual(Object.keys(bundle).sort(), ['series', 'svc', 'units'])
  for (const kind of ['series', 'units', 'svc']) {
    const keys = bundle[kind].map(item => item.key)
    assert.equal(new Set(keys).size, keys.length)
    assert.deepEqual(keys.sort(), [...source[kind].keys()].sort(), `${lang}/${kind}: key drift`)
    assert.deepEqual(read(`build/${kind}-${lang}.json`), bundle[kind])
    for (const key of source[kind].keys()) {
      const localized = read(`models/${kind}/${key}/${lang}.json`)
      assert(Object.keys(localized).length > 0)
    }
  }
  const seriesByKey = new Map(bundle.series.map(s => [s.key, s]))
  const svcByKey = new Map(bundle.svc.map(s => [s.key, s]))
  const unitByKey = new Map(bundle.units.map(s => [s.key, s]))
  for (const series of bundle.series) {
    if (series.svc) assert.deepEqual(series.svc, svcByKey.get(series.svc.key))
    if (series.unit) assert.deepEqual(series.unit, unitByKey.get(series.unit.key))
  }
  for (const e of matrix.characteristics) {
    const series = seriesByKey.get(e.series.key)
    assert.equal(series.svc.includesEmptyAggregates, false)
    if (e.states) validateStateRendering(e, series, lang)
    else assert.deepEqual(series.svc.thresholds, [])
  }
}
locales.forEach(validateBundles)

// Independent raw-unit contract. Source numeric values are never rescaled on input.
const expectedUnits = {
  percentage: 'humidity currentPosition brightness saturation targetPosition targetRelativeHumidity humidifierThreshold dehumidifierThreshold rotationSpeed filterLifeLevel waterLevel batteryLevel volume',
  temperature_metric: 'temperature targetTemperature heatingThreshold coolingThreshold',
  parts_per_million: 'carbonDioxide carbonDioxidePeakLevel carbonMonoxide carbonMonoxidePeakLevel',
  mass_concentration: 'airParticulateDensity ozoneDensity nitrogenDioxideDensity sulphurDioxideDensity pm2_5Density pm10Density volatileOrganicCompoundDensity',
  angle_degrees: 'hue currentHorizontalTilt targetHorizontalTilt currentVerticalTilt targetVerticalTilt currentTilt targetTilt imageRotation',
  duration: 'lockManagementAutoSecureTimeout setDuration remainingDuration',
  color_temperature_mired: 'colorTemperature',
  luminosity_metric: 'lightLevel'
}
for (const [unit, ids] of Object.entries(expectedUnits)) for (const id of ids.split(' ')) {
  assert.equal(byId.get(id).unit.key, unit, `${id}: raw HomeKit unit mismatch`)
}
const expectedLast = `carbonDioxidePeakLevel carbonMonoxidePeakLevel hue colorTemperature targetTemperature
heatingThreshold coolingThreshold targetRelativeHumidity humidifierThreshold dehumidifierThreshold
currentPosition targetPosition currentHorizontalTilt targetHorizontalTilt currentVerticalTilt targetVerticalTilt
currentTilt targetTilt setDuration remainingDuration lockManagementAutoSecureTimeout imageRotation opticalZoom digitalZoom`
for (const id of expectedLast.split(/\s+/)) assert.equal(byId.get(id).aggregationMethod, 'last', id)
assert.deepEqual(byId.get('imageRotation').domain.values, [0, 90, 180, 270])
assert.equal(byId.get('colorTemperature').domain.accessoryMetadata, true)
assert.notEqual(byId.get('carbonDioxide').series.key, byId.get('carbonDioxidePeakLevel').series.key)
assert.equal(byId.get('carbonDioxidePeakLevel').previousTemplateKey, 'co2_concentration_ppm')
assert.notEqual(byId.get('brightness').unit.key, byId.get('lightLevel').unit.key)
assert.notEqual(byId.get('motionDetected').series.key, byId.get('occupancyDetected').series.key)

const criticalSymbols = {
  contactState: ['Detected', 'None'],
  currentDoorState: ['Open', 'Closed', 'Opening', 'Closing', 'Stopped'],
  positionState: ['Closing', 'Opening', 'Stopped'],
  currentLockMechanismState: ['Unsecured', 'Secured', 'Jammed', 'Unknown'],
  securitySystemAlarmType: ['NoAlarm', 'Unknown'],
  chargingState: ['None', 'InProgress', 'NotChargeable'],
  statusFault: ['NoFault', 'GeneralFault'],
  targetHeatingCooling: ['Off', 'Heat', 'Cool', 'Auto'],
  targetHeaterCoolerState: ['Automatic', 'Heat', 'Cool'],
  currentMediaState: ['Playing', 'Paused', 'Stopped', 'Unknown', 'Loading', 'Interrupted'],
  routerStatus: ['Ready', 'NotReady'],
  wifiSatelliteStatus: ['Unknown', 'Connected', 'NotConnected']
}
for (const [id, symbols] of Object.entries(criticalSymbols)) {
  const e = byId.get(id)
  assert.deepEqual(e.states.map(s => s.publicSymbol), symbols.map(s => e.publicEnum + s))
}

function convert(unitKey, value, from, to) {
  const unit = source.units.get(unitKey)
  return value * unit.subUnits.find(s => s.key === from).factor / unit.subUnits.find(s => s.key === to).factor
}
assert.equal(convert('percentage', 75, 'percent', 'percent'), 75)
assert.equal(convert('duration', 60, 's', 's'), 60)
assert.equal(convert('duration', 60, 's', 'min'), 1)
assert.equal(convert('angle_degrees', 240, 'degree', 'degree'), 240)
assert.equal(convert('color_temperature_mired', 250, 'mired', 'mired'), 250)
assert.deepEqual(source.units.get('color_temperature_mired').subUnits, [{ key: 'mired', factor: 1 }])
for (const [key, base] of Object.entries({ mass_concentration: 'ug_m3', angle_degrees: 'degree', color_temperature_mired: 'mired' })) {
  assert.equal(source.units.get(key).baseUnit, base)
  assert.equal(source.units.get(key).subUnits.length, 1)
}
console.log('✅ HomeKit: 103 identifiers; all locales, references, historical keys, state lookup modes and raw units verified')
