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

const numericFamilies = {
  comfort_bands: 'temperature',
  humidity_bands: 'humidity',
  ventilation_bands: 'carbonDioxide carbonDioxidePeakLevel',
  concentration_bands: 'carbonMonoxide carbonMonoxidePeakLevel airParticulateDensity ozoneDensity nitrogenDioxideDensity sulphurDioxideDensity pm2_5Density pm10Density volatileOrganicCompoundDensity',
  illuminance_bands: 'lightLevel',
  position_bands: 'currentPosition targetPosition',
  brightness_bands: 'brightness',
  saturation_bands: 'saturation',
  hue_bands: 'hue',
  color_temperature_bands: 'colorTemperature',
  tilt_bands: 'currentHorizontalTilt targetHorizontalTilt currentVerticalTilt targetVerticalTilt currentTilt targetTilt',
  duration_bands: 'lockManagementAutoSecureTimeout setDuration remainingDuration',
  temperature_setpoint_bands: 'targetTemperature heatingThreshold coolingThreshold',
  humidity_setpoint_bands: 'targetRelativeHumidity humidifierThreshold dehumidifierThreshold',
  speed_bands: 'rotationSpeed',
  remaining_life_bands: 'filterLifeLevel batteryLevel',
  level_bands: 'waterLevel',
  volume_bands: 'volume',
  zoom_bands: 'opticalZoom digitalZoom',
  discrete_values: 'imageRotation'
}
const numericPolicies = new Map(Object.entries(numericFamilies)
  .flatMap(([policy, ids]) => ids.split(' ').map(id => [id, policy])))
assert.equal(numericPolicies.size, 43)
assert.deepEqual([...numericPolicies.keys()].sort(), matrix.characteristics.filter(e => !e.states).map(e => e.identifier).sort())

function numericSamples(e, thresholds) {
  if (e.domain.values) return e.domain.values
  const min = e.domain.minimum ?? -Number.MAX_SAFE_INTEGER
  const max = e.domain.maximum ?? Number.MAX_SAFE_INTEGER
  const boundaries = thresholds.flatMap(t => {
    const epsilon = Math.max(1, Math.abs(t.value)) * 1e-7
    return [t.value - epsilon, t.value, t.value + epsilon]
  })
  return [min, max, ...boundaries].filter(value => value >= min && value <= max)
}

function validateNumericCoverage(e, svc) {
  const selected = new Set()
  for (const value of numericSamples(e, svc.thresholds)) {
    const match = svc.thresholds.find(t => compare[t.operatorType](value, t.value))
    assert(match, `${e.identifier}: uncovered value ${value}`)
    selected.add(match.order)
    if (e.domain.values) {
      assert.equal(match.value, value, `${e.identifier}: discrete orientation shifted`)
      assert.equal(svc.thresholds.find(t => t.value === value)?.order, match.order)
    }
  }
  assert.equal(selected.size, svc.thresholds.length, `${e.identifier}: unreachable visual band`)
}

function validateNumericStats(e, svc) {
  const noStats = ['hue_bands', 'tilt_bands', 'discrete_values'].includes(e.thresholdPolicy)
  const fields = noStats ? [] : e.aggregationMethod === 'average'
    ? ['showAverage', 'showMin', 'showMax']
    : e.identifier.endsWith('PeakLevel') ? ['showMax'] : ['showMin', 'showMax']
  for (const field of statFields) {
    assert.equal(svc[field], fields.includes(field), `${e.identifier}: ${field}`)
  }
}

function validateIndoorTemperature(svc) {
  assert.equal(svc.key, 'inside_temp_deg_c')
  const expectedThresholds = [
    [16, '<', '#1D4ED8'],
    [19, '<', '#3B82F6'],
    [21, '<', '#22C55E'],
    [24, '<', '#EAB308'],
    [24, '>=', '#EF4444']
  ].map(([value, operatorType, colorHex], i) => ({ order: i + 1, value, operatorType, colorHex }))
  assert.deepEqual(svc.thresholds.map(({ label, ...threshold }) => threshold), expectedThresholds)
}

function validateNumericVisualization(e, svc) {
  assert.equal(e.thresholdPolicy, numericPolicies.get(e.identifier), `${e.identifier}: wrong visual family`)
  assert(Array.isArray(svc.thresholds) && svc.thresholds.length >= 2, `${e.identifier}: missing visual bands`)
  assert(new Set(svc.thresholds.map(t => t.colorHex)).size >= 2, `${e.identifier}: missing color palette`)
  assert.equal(svc.thresholdAxisLabelDisplayMode, e.domain.values ? 'label' : 'valueAndLabel')
  assert.equal(svc.autoScaleYAxis, true)
  svc.thresholds.forEach((t, i) => {
    assert.equal(t.order, i + 1)
    assert(Number.isFinite(t.value) && compare[t.operatorType])
    if (i) assert(t.value >= svc.thresholds[i - 1].value)
  })
  validateNumericCoverage(e, svc)
  validateNumericStats(e, svc)
  if (e.identifier === 'temperature') validateIndoorTemperature(svc)
}

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
    assert.equal(e.thresholdPolicy, 'categorical_codes')
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
    validateNumericVisualization(e, svc)
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

function validateLocalizedVisualization(e, svc, lang) {
  const model = source.svc.get(e.configuration.key)
  const localized = read(`models/svc/${e.configuration.key}/${lang}.json`)
  const expected = {
    ...model,
    ...localized,
    thresholds: model.thresholds.map(t => ({ ...t, ...localized.thresholds[String(t.order)] }))
  }
  assert.deepEqual(svc, expected, `${lang}/${e.identifier}: localized source differs from output`)
}

function validateConditionalPresets(seriesByKey, lang) {
  for (const [key, svcKey, colors] of [
    ['window_open', 'window_open_binary', ['#14B8A6', '#F59E0B']],
    ['light_on', 'light_on_binary', ['#64748B', '#FBBF24']]
  ]) {
    const series = seriesByKey.get(key)
    assert.equal(series.svc.key, svcKey)
    assert.equal(series.graphType, 'bar')
    assert.equal(series.aggregationMethod, 'last')
    assert.equal(series.svc.includesEmptyAggregates, false)
    for (const field of statFields) assert.equal(series.svc[field], false)
    assert.deepEqual(series.svc.thresholds.map(t => [t.value, t.operatorType, t.colorHex]),
      colors.map((color, value) => [value, '<=', color]))
    validateLocalizedVisualization({ identifier: key, configuration: { key: svcKey } }, series.svc, lang)
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
  validateConditionalPresets(seriesByKey, lang)
  for (const e of matrix.characteristics) {
    const series = seriesByKey.get(e.series.key)
    assert.equal(series.svc.includesEmptyAggregates, false)
    assert.equal(series.graphType, source.series.get(e.series.key).graphType)
    validateLocalizedVisualization(e, series.svc, lang)
    if (e.states) validateStateRendering(e, series, lang)
    else validateNumericVisualization(e, series.svc)
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
for (const [first, second] of [
  ['carbonDioxide', 'carbonMonoxide'], ['carbonDioxide', 'carbonDioxidePeakLevel'],
  ['carbonMonoxide', 'carbonMonoxidePeakLevel'], ['pm2_5Density', 'pm10Density'],
  ['currentPosition', 'volume'], ['batteryLevel', 'volume'],
  ['filterLifeLevel', 'waterLevel'], ['hue', 'imageRotation']
]) {
  assert.notEqual(byId.get(first).configuration.key, byId.get(second).configuration.key,
    `${first}/${second}: incompatible visualizations must remain separate`)
}

function colorAt(id, value) {
  const svc = source.svc.get(byId.get(id).configuration.key)
  return svc.thresholds.find(t => compare[t.operatorType](value, t.value))?.colorHex
}
assert.equal(colorAt('hue', 0), colorAt('hue', 360), 'Hue must wrap to the same color')
assert.equal(colorAt('hue', 120), '#22C55E', '120° hue is green')
assert.equal(colorAt('hue', 240), '#3B82F6', '240° hue is blue')
assert.equal(colorAt('colorTemperature', 100), '#3B82F6', 'Low mired values describe cooler light')
assert.equal(colorAt('colorTemperature', 500), '#F97316', 'High mired values describe warmer light')
for (const [id, lowReserveColor] of [['batteryLevel', '#EF4444'], ['filterLifeLevel', '#F97316']]) {
  assert.equal(colorAt(id, 5), lowReserveColor)
  assert.equal(colorAt(id, 90), '#22C55E')
}
assert.equal(colorAt('currentPosition', 0), '#64748B')
assert.equal(colorAt('currentPosition', 100), '#22C55E')
assert.equal(source.series.get(byId.get('hue').series.key).graphType, 'points')
assert.equal(source.series.get(byId.get('imageRotation').series.key).graphType, 'points')

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
for (const id of ['smokeDetected', 'leakDetected', 'carbonMonoxideDetected', 'carbonDioxideDetected',
  'obstructionDetected', 'statusFault', 'statusJammed', 'statusTampered']) {
  assert.equal(byId.get(id).states.find(s => s.code === 1).colorHex, '#EF4444', `${id}: alert color`)
}
assert.equal(byId.get('currentHeatingCooling').states.find(s => s.code === 1).colorHex, '#F97316')
assert.equal(byId.get('currentHeatingCooling').states.find(s => s.code === 2).colorHex, '#3B82F6')
assert.equal(byId.get('currentLockMechanismState').states.find(s => s.code === 2).colorHex, '#EF4444')
assert.equal(byId.get('currentSlatState').states.find(s => s.code === 1).colorHex, '#EF4444')
for (const e of matrix.characteristics.filter(e => e.states)) {
  for (const state of e.states.filter(s => s.labels.en.toLowerCase().includes('unknown'))) {
    assert.equal(state.colorHex, '#64748B', `${e.identifier}: explicit unknown must stay gray`)
  }
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
console.log('✅ HomeKit: 103 identifiers; 43 numeric profiles, 60 states, boundary coverage, all locales, references and raw units verified')
