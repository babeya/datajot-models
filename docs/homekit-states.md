# États HomeKit — codes et références

Vérification du 4 novembre 2026 sur les en-têtes publics Apple
`HMCharacteristicDefines.h` et `HMCharacteristicTypes.h` du SDK `iPhoneOS27.1.sdk`
installé avec Xcode. Les valeurs explicites et incréments d’enum sont contrôlés,
pas déduits d’une simple plage numérique. Les libellés sont des traductions
éditoriales du catalogue. Le [contrat](homekit.md) explique la comparaison `<=`
et l’égalité exacte ; le [JSON](homekit-mapping.json) donne aussi `en`, `de`, `es`.

Références publiques complémentaires :
[types Apple](https://developer.apple.com/documentation/homekit/characteristic-types),
[définitions Apple HomeKitADK](https://github.com/apple/HomeKitADK/blob/master/HAP/HAPCharacteristicTypes.h).
L’ADK historique sert au recoupement ; les enums du SDK public font foi pour les
caractéristiques plus récentes. Chaque tableau pointe vers son enum ou sa constante.
Les booléens sans enum utilisent `false = 0`, `true = 1` avec la sémantique de la
caractéristique. `outputState` concerne ici l’interrupteur programmable binaire.

Pour un contact, « fermée » signifie contact détecté et « ouverte » contact absent ;
le choix porte/fenêtre exige le contexte du service. Les inconnus du protocole ne
sont jamais substitués aux absences de lecture. Le type d’alarme `1` signifie
**type inconnu**, pas une catégorie d’alarme inventée. `chargingState = 2` signifie
**non rechargeable**, pas batterie pleine. `routerStatus = 0` signifie configuration
HomeKit déployée ; ce n’est pas un indicateur générique de présence en ligne.

## `airQuality`

[HMCharacteristicValueAirQuality](https://developer.apple.com/documentation/homekit/hmcharacteristicvalueairquality) ; série `homekit_air_quality`, configuration `homekit_air_quality`.

| Code brut | Symbole public / booléen | Libellé français | Couleur |
| --- | --- | --- | --- |
| 0 | `HMCharacteristicValueAirQualityUnknown` | Inconnue | `#64748B` |
| 1 | `HMCharacteristicValueAirQualityExcellent` | Excellente | `#22C55E` |
| 2 | `HMCharacteristicValueAirQualityGood` | Bonne | `#84CC16` |
| 3 | `HMCharacteristicValueAirQualityFair` | Moyenne | `#EAB308` |
| 4 | `HMCharacteristicValueAirQualityInferior` | Médiocre | `#F97316` |
| 5 | `HMCharacteristicValueAirQualityPoor` | Mauvaise | `#EF4444` |

## `contactState`

[HMCharacteristicValueContactState](https://developer.apple.com/documentation/homekit/hmcharacteristicvaluecontactstate) ; série `door_open`, configuration `door_open_binary`.

| Code brut | Symbole public / booléen | Libellé français | Couleur |
| --- | --- | --- | --- |
| 0 | `HMCharacteristicValueContactStateDetected` | Fermée | `#64748B` |
| 1 | `HMCharacteristicValueContactStateNone` | Ouverte | `#0EA5E9` |

## `motionDetected`

[HMCharacteristicTypeMotionDetected](https://developer.apple.com/documentation/homekit/hmcharacteristictypemotiondetected) ; série `motion_detected`, configuration `motion_detected_binary`.

| Code brut | Symbole public / booléen | Libellé français | Couleur |
| --- | --- | --- | --- |
| 0 | `false` | Aucun mouvement | `#64748B` |
| 1 | `true` | Mouvement détecté | `#0EA5E9` |

## `occupancyDetected`

[HMCharacteristicValueOccupancyStatus](https://developer.apple.com/documentation/homekit/hmcharacteristicvalueoccupancystatus) ; série `occupancy_detected`, configuration `occupancy_detected`.

| Code brut | Symbole public / booléen | Libellé français | Couleur |
| --- | --- | --- | --- |
| 0 | `HMCharacteristicValueOccupancyStatusNotOccupied` | Absence | `#64748B` |
| 1 | `HMCharacteristicValueOccupancyStatusOccupied` | Présence | `#0EA5E9` |

## `powerState`

[HMCharacteristicTypePowerState](https://developer.apple.com/documentation/homekit/hmcharacteristictypepowerstate) ; série `device_power_state`, configuration `device_power_state`.

| Code brut | Symbole public / booléen | Libellé français | Couleur |
| --- | --- | --- | --- |
| 0 | `false` | Arrêt | `#64748B` |
| 1 | `true` | Marche | `#0EA5E9` |

## `outletInUse`

[HMCharacteristicTypeOutletInUse](https://developer.apple.com/documentation/homekit/hmcharacteristictypeoutletinuse) ; série `outlet_in_use`, configuration `outlet_in_use`.

| Code brut | Symbole public / booléen | Libellé français | Couleur |
| --- | --- | --- | --- |
| 0 | `false` | Aucun appareil branché | `#64748B` |
| 1 | `true` | Appareil branché | `#0EA5E9` |

## `airParticulateSize`

[HMCharacteristicValueAirParticulateSize](https://developer.apple.com/documentation/homekit/hmcharacteristicvalueairparticulatesize) ; série `air_particulate_size`, configuration `air_particulate_size`.

| Code brut | Symbole public / booléen | Libellé français | Couleur |
| --- | --- | --- | --- |
| 0 | `HMCharacteristicValueAirParticulateSize2_5` | 2,5 µm | `#64748B` |
| 1 | `HMCharacteristicValueAirParticulateSize10` | 10 µm | `#0EA5E9` |

## `smokeDetected`

[HMCharacteristicValueSmokeDetectionStatus](https://developer.apple.com/documentation/homekit/hmcharacteristicvaluesmokedetectionstatus) ; série `smoke_detected`, configuration `smoke_detected`.

| Code brut | Symbole public / booléen | Libellé français | Couleur |
| --- | --- | --- | --- |
| 0 | `HMCharacteristicValueSmokeDetectionStatusNone` | Aucune fumée détectée | `#64748B` |
| 1 | `HMCharacteristicValueSmokeDetectionStatusDetected` | Fumée détectée | `#EF4444` |

## `leakDetected`

[HMCharacteristicValueLeakStatus](https://developer.apple.com/documentation/homekit/hmcharacteristicvalueleakstatus) ; série `leak_detected`, configuration `leak_detected`.

| Code brut | Symbole public / booléen | Libellé français | Couleur |
| --- | --- | --- | --- |
| 0 | `HMCharacteristicValueLeakStatusNone` | Aucune fuite détectée | `#64748B` |
| 1 | `HMCharacteristicValueLeakStatusDetected` | Fuite détectée | `#EF4444` |

## `carbonMonoxideDetected`

[HMCharacteristicValueCarbonMonoxideDetectionStatus](https://developer.apple.com/documentation/homekit/hmcharacteristicvaluecarbonmonoxidedetectionstatus) ; série `co_detected`, configuration `co_detected`.

| Code brut | Symbole public / booléen | Libellé français | Couleur |
| --- | --- | --- | --- |
| 0 | `HMCharacteristicValueCarbonMonoxideDetectionStatusNotDetected` | CO non détecté | `#64748B` |
| 1 | `HMCharacteristicValueCarbonMonoxideDetectionStatusDetected` | CO détecté | `#EF4444` |

## `carbonDioxideDetected`

[HMCharacteristicValueCarbonDioxideDetectionStatus](https://developer.apple.com/documentation/homekit/hmcharacteristicvaluecarbondioxidedetectionstatus) ; série `co2_detected`, configuration `co2_detected`.

| Code brut | Symbole public / booléen | Libellé français | Couleur |
| --- | --- | --- | --- |
| 0 | `HMCharacteristicValueCarbonDioxideDetectionStatusNotDetected` | CO₂ non détecté | `#64748B` |
| 1 | `HMCharacteristicValueCarbonDioxideDetectionStatusDetected` | CO₂ détecté | `#EF4444` |

## `obstructionDetected`

[HMCharacteristicTypeObstructionDetected](https://developer.apple.com/documentation/homekit/hmcharacteristictypeobstructiondetected) ; série `obstruction_detected`, configuration `obstruction_detected`.

| Code brut | Symbole public / booléen | Libellé français | Couleur |
| --- | --- | --- | --- |
| 0 | `false` | Aucun obstacle | `#64748B` |
| 1 | `true` | Obstacle détecté | `#EF4444` |

## `outputState`

[HMCharacteristicTypeOutputState](https://developer.apple.com/documentation/homekit/hmcharacteristictypeoutputstate) ; série `switch_output_state`, configuration `switch_output_state`.

| Code brut | Symbole public / booléen | Libellé français | Couleur |
| --- | --- | --- | --- |
| 0 | `false` | Arrêt | `#64748B` |
| 1 | `true` | Marche | `#0EA5E9` |

## `active`

[HMCharacteristicValueActivationState](https://developer.apple.com/documentation/homekit/hmcharacteristicvalueactivationstate) ; série `device_active`, configuration `device_active`.

| Code brut | Symbole public / booléen | Libellé français | Couleur |
| --- | --- | --- | --- |
| 0 | `HMCharacteristicValueActivationStateInactive` | Inactive | `#64748B` |
| 1 | `HMCharacteristicValueActivationStateActive` | Active | `#0EA5E9` |

## `inUse`

[HMCharacteristicValueUsageState](https://developer.apple.com/documentation/homekit/hmcharacteristicvalueusagestate) ; série `service_in_use`, configuration `service_in_use`.

| Code brut | Symbole public / booléen | Libellé français | Couleur |
| --- | --- | --- | --- |
| 0 | `HMCharacteristicValueUsageStateNotInUse` | À l’arrêt | `#64748B` |
| 1 | `HMCharacteristicValueUsageStateInUse` | En cours | `#0EA5E9` |

## `currentDoorState`

[HMCharacteristicValueDoorState](https://developer.apple.com/documentation/homekit/hmcharacteristicvaluedoorstate) ; série `door_current_state`, configuration `door_current_state`.

| Code brut | Symbole public / booléen | Libellé français | Couleur |
| --- | --- | --- | --- |
| 0 | `HMCharacteristicValueDoorStateOpen` | Ouverte | `#64748B` |
| 1 | `HMCharacteristicValueDoorStateClosed` | Fermée | `#0EA5E9` |
| 2 | `HMCharacteristicValueDoorStateOpening` | En ouverture | `#A78BFA` |
| 3 | `HMCharacteristicValueDoorStateClosing` | En fermeture | `#14B8A6` |
| 4 | `HMCharacteristicValueDoorStateStopped` | Arrêtée | `#F59E0B` |

## `targetDoorState`

[HMCharacteristicValueTargetDoorState](https://developer.apple.com/documentation/homekit/hmcharacteristicvaluetargetdoorstate) ; série `door_target_state`, configuration `door_target_state`.

| Code brut | Symbole public / booléen | Libellé français | Couleur |
| --- | --- | --- | --- |
| 0 | `HMCharacteristicValueTargetDoorStateOpen` | Ouverte | `#64748B` |
| 1 | `HMCharacteristicValueTargetDoorStateClosed` | Fermée | `#0EA5E9` |

## `slatType`

[HMCharacteristicValueSlatType](https://developer.apple.com/documentation/homekit/hmcharacteristicvalueslattype) ; série `slat_type`, configuration `slat_type`.

| Code brut | Symbole public / booléen | Libellé français | Couleur |
| --- | --- | --- | --- |
| 0 | `HMCharacteristicValueSlatTypeHorizontal` | Horizontales | `#64748B` |
| 1 | `HMCharacteristicValueSlatTypeVertical` | Verticales | `#0EA5E9` |

## `positionState`

[HMCharacteristicValuePositionState](https://developer.apple.com/documentation/homekit/hmcharacteristicvaluepositionstate) ; série `opening_movement`, configuration `opening_movement`.

| Code brut | Symbole public / booléen | Libellé français | Couleur |
| --- | --- | --- | --- |
| 0 | `HMCharacteristicValuePositionStateClosing` | En fermeture | `#64748B` |
| 1 | `HMCharacteristicValuePositionStateOpening` | En ouverture | `#0EA5E9` |
| 2 | `HMCharacteristicValuePositionStateStopped` | À l’arrêt | `#A78BFA` |

## `currentSlatState`

[HMCharacteristicValueCurrentSlatState](https://developer.apple.com/documentation/homekit/hmcharacteristicvaluecurrentslatstate) ; série `slat_current_state`, configuration `slat_current_state`.

| Code brut | Symbole public / booléen | Libellé français | Couleur |
| --- | --- | --- | --- |
| 0 | `HMCharacteristicValueCurrentSlatStateStationary` | Immobiles | `#64748B` |
| 1 | `HMCharacteristicValueCurrentSlatStateJammed` | Bloquées | `#0EA5E9` |
| 2 | `HMCharacteristicValueCurrentSlatStateOscillating` | En oscillation | `#A78BFA` |

## `currentLockMechanismState`

[HMCharacteristicValueLockMechanismState](https://developer.apple.com/documentation/homekit/hmcharacteristicvaluelockmechanismstate) ; série `lock_current_state`, configuration `lock_current_state`.

| Code brut | Symbole public / booléen | Libellé français | Couleur |
| --- | --- | --- | --- |
| 0 | `HMCharacteristicValueLockMechanismStateUnsecured` | Déverrouillée | `#64748B` |
| 1 | `HMCharacteristicValueLockMechanismStateSecured` | Verrouillée | `#0EA5E9` |
| 2 | `HMCharacteristicValueLockMechanismStateJammed` | Bloquée | `#F59E0B` |
| 3 | `HMCharacteristicValueLockMechanismStateUnknown` | Inconnue | `#64748B` |

## `targetSecuritySystemState`

[HMCharacteristicValueTargetSecuritySystemState](https://developer.apple.com/documentation/homekit/hmcharacteristicvaluetargetsecuritysystemstate) ; série `security_target_state`, configuration `security_target_state`.

| Code brut | Symbole public / booléen | Libellé français | Couleur |
| --- | --- | --- | --- |
| 0 | `HMCharacteristicValueTargetSecuritySystemStateStayArm` | Armée à domicile | `#64748B` |
| 1 | `HMCharacteristicValueTargetSecuritySystemStateAwayArm` | Armée en absence | `#0EA5E9` |
| 2 | `HMCharacteristicValueTargetSecuritySystemStateNightArm` | Armée la nuit | `#A78BFA` |
| 3 | `HMCharacteristicValueTargetSecuritySystemStateDisarm` | Désarmée | `#14B8A6` |

## `targetLockMechanismState`

[HMCharacteristicValueTargetLockMechanismState](https://developer.apple.com/documentation/homekit/hmcharacteristicvaluetargetlockmechanismstate) ; série `lock_target_state`, configuration `lock_target_state`.

| Code brut | Symbole public / booléen | Libellé français | Couleur |
| --- | --- | --- | --- |
| 0 | `HMCharacteristicValueTargetLockMechanismStateUnsecured` | Déverrouillée | `#64748B` |
| 1 | `HMCharacteristicValueTargetLockMechanismStateSecured` | Verrouillée | `#0EA5E9` |

## `securitySystemAlarmType`

[HMCharacteristicValueSecuritySystemAlarmType](https://developer.apple.com/documentation/homekit/hmcharacteristicvaluesecuritysystemalarmtype) ; série `security_alarm_type`, configuration `security_alarm_type`.

| Code brut | Symbole public / booléen | Libellé français | Couleur |
| --- | --- | --- | --- |
| 0 | `HMCharacteristicValueSecuritySystemAlarmTypeNoAlarm` | Aucune alarme | `#64748B` |
| 1 | `HMCharacteristicValueSecuritySystemAlarmTypeUnknown` | Type d’alarme inconnu | `#64748B` |

## `lockPhysicalControls`

[HMCharacteristicValueLockPhysicalControlsState](https://developer.apple.com/documentation/homekit/hmcharacteristicvaluelockphysicalcontrolsstate) ; série `physical_controls_lock`, configuration `physical_controls_lock`.

| Code brut | Symbole public / booléen | Libellé français | Couleur |
| --- | --- | --- | --- |
| 0 | `HMCharacteristicValueLockPhysicalControlsStateNotLocked` | Déverrouillées | `#64748B` |
| 1 | `HMCharacteristicValueLockPhysicalControlsStateLocked` | Verrouillées | `#0EA5E9` |

## `currentSecuritySystemState`

[HMCharacteristicValueCurrentSecuritySystemState](https://developer.apple.com/documentation/homekit/hmcharacteristicvaluecurrentsecuritysystemstate) ; série `security_current_state`, configuration `security_current_state`.

| Code brut | Symbole public / booléen | Libellé français | Couleur |
| --- | --- | --- | --- |
| 0 | `HMCharacteristicValueCurrentSecuritySystemStateStayArm` | Armée à domicile | `#64748B` |
| 1 | `HMCharacteristicValueCurrentSecuritySystemStateAwayArm` | Armée en absence | `#0EA5E9` |
| 2 | `HMCharacteristicValueCurrentSecuritySystemStateNightArm` | Armée la nuit | `#A78BFA` |
| 3 | `HMCharacteristicValueCurrentSecuritySystemStateDisarmed` | Désarmée | `#14B8A6` |
| 4 | `HMCharacteristicValueCurrentSecuritySystemStateTriggered` | Déclenchée | `#EF4444` |

## `lockMechanismLastKnownAction`

[HMCharacteristicValueLockMechanismLastKnownAction](https://developer.apple.com/documentation/homekit/hmcharacteristicvaluelockmechanismlastknownaction) ; série `lock_last_action`, configuration `lock_last_action`.

| Code brut | Symbole public / booléen | Libellé français | Couleur |
| --- | --- | --- | --- |
| 0 | `HMCharacteristicValueLockMechanismLastKnownActionSecuredUsingPhysicalMovementInterior` | Verrouillée manuellement de l’intérieur | `#64748B` |
| 1 | `HMCharacteristicValueLockMechanismLastKnownActionUnsecuredUsingPhysicalMovementInterior` | Déverrouillée manuellement de l’intérieur | `#0EA5E9` |
| 2 | `HMCharacteristicValueLockMechanismLastKnownActionSecuredUsingPhysicalMovementExterior` | Verrouillée manuellement de l’extérieur | `#A78BFA` |
| 3 | `HMCharacteristicValueLockMechanismLastKnownActionUnsecuredUsingPhysicalMovementExterior` | Déverrouillée manuellement de l’extérieur | `#14B8A6` |
| 4 | `HMCharacteristicValueLockMechanismLastKnownActionSecuredWithKeypad` | Verrouillée par clavier | `#F59E0B` |
| 5 | `HMCharacteristicValueLockMechanismLastKnownActionUnsecuredWithKeypad` | Déverrouillée par clavier | `#EC4899` |
| 6 | `HMCharacteristicValueLockMechanismLastKnownActionSecuredRemotely` | Verrouillée à distance | `#38BDF8` |
| 7 | `HMCharacteristicValueLockMechanismLastKnownActionUnsecuredRemotely` | Déverrouillée à distance | `#A3E635` |
| 8 | `HMCharacteristicValueLockMechanismLastKnownActionSecuredWithAutomaticSecureTimeout` | Verrouillée après délai | `#FB923C` |
| 9 | `HMCharacteristicValueLockMechanismLastKnownActionSecuredUsingPhysicalMovement` | Verrouillée manuellement | `#818CF8` |
| 10 | `HMCharacteristicValueLockMechanismLastKnownActionUnsecuredUsingPhysicalMovement` | Déverrouillée manuellement | `#2DD4BF` |

## `currentHeatingCooling`

[HMCharacteristicValueCurrentHeatingCooling](https://developer.apple.com/documentation/homekit/hmcharacteristicvaluecurrentheatingcooling) ; série `heating_cooling_current_state`, configuration `heating_cooling_current_state`.

| Code brut | Symbole public / booléen | Libellé français | Couleur |
| --- | --- | --- | --- |
| 0 | `HMCharacteristicValueCurrentHeatingCoolingOff` | À l’arrêt | `#64748B` |
| 1 | `HMCharacteristicValueCurrentHeatingCoolingHeat` | Chauffage | `#0EA5E9` |
| 2 | `HMCharacteristicValueCurrentHeatingCoolingCool` | Refroidissement | `#A78BFA` |

## `targetHeaterCoolerState`

[HMCharacteristicValueTargetHeaterCoolerState](https://developer.apple.com/documentation/homekit/hmcharacteristicvaluetargetheatercoolerstate) ; série `heater_cooler_target_mode`, configuration `heater_cooler_target_mode`.

| Code brut | Symbole public / booléen | Libellé français | Couleur |
| --- | --- | --- | --- |
| 0 | `HMCharacteristicValueTargetHeaterCoolerStateAutomatic` | Automatique | `#64748B` |
| 1 | `HMCharacteristicValueTargetHeaterCoolerStateHeat` | Chauffage | `#0EA5E9` |
| 2 | `HMCharacteristicValueTargetHeaterCoolerStateCool` | Refroidissement | `#A78BFA` |

## `targetHumidifierDehumidifierState`

[HMCharacteristicValueTargetHumidifierDehumidifierState](https://developer.apple.com/documentation/homekit/hmcharacteristicvaluetargethumidifierdehumidifierstate) ; série `humidifier_target_mode`, configuration `humidifier_target_mode`.

| Code brut | Symbole public / booléen | Libellé français | Couleur |
| --- | --- | --- | --- |
| 0 | `HMCharacteristicValueTargetHumidifierDehumidifierStateAutomatic` | Automatique | `#64748B` |
| 1 | `HMCharacteristicValueTargetHumidifierDehumidifierStateHumidify` | Humidification | `#0EA5E9` |
| 2 | `HMCharacteristicValueTargetHumidifierDehumidifierStateDehumidify` | Déshumidification | `#A78BFA` |

## `targetHeatingCooling`

[HMCharacteristicValueHeatingCooling](https://developer.apple.com/documentation/homekit/hmcharacteristicvalueheatingcooling) ; série `heating_cooling_target_mode`, configuration `heating_cooling_target_mode`.

| Code brut | Symbole public / booléen | Libellé français | Couleur |
| --- | --- | --- | --- |
| 0 | `HMCharacteristicValueHeatingCoolingOff` | Arrêt | `#64748B` |
| 1 | `HMCharacteristicValueHeatingCoolingHeat` | Chauffage | `#0EA5E9` |
| 2 | `HMCharacteristicValueHeatingCoolingCool` | Refroidissement | `#A78BFA` |
| 3 | `HMCharacteristicValueHeatingCoolingAuto` | Automatique | `#14B8A6` |

## `currentHeaterCoolerState`

[HMCharacteristicValueCurrentHeaterCoolerState](https://developer.apple.com/documentation/homekit/hmcharacteristicvaluecurrentheatercoolerstate) ; série `heater_cooler_current_state`, configuration `heater_cooler_current_state`.

| Code brut | Symbole public / booléen | Libellé français | Couleur |
| --- | --- | --- | --- |
| 0 | `HMCharacteristicValueCurrentHeaterCoolerStateInactive` | Inactif | `#64748B` |
| 1 | `HMCharacteristicValueCurrentHeaterCoolerStateIdle` | En attente | `#0EA5E9` |
| 2 | `HMCharacteristicValueCurrentHeaterCoolerStateHeating` | En chauffage | `#A78BFA` |
| 3 | `HMCharacteristicValueCurrentHeaterCoolerStateCooling` | En refroidissement | `#14B8A6` |

## `currentHumidifierDehumidifierState`

[HMCharacteristicValueCurrentHumidifierDehumidifierState](https://developer.apple.com/documentation/homekit/hmcharacteristicvaluecurrenthumidifierdehumidifierstate) ; série `humidifier_current_state`, configuration `humidifier_current_state`.

| Code brut | Symbole public / booléen | Libellé français | Couleur |
| --- | --- | --- | --- |
| 0 | `HMCharacteristicValueCurrentHumidifierDehumidifierStateInactive` | Inactif | `#64748B` |
| 1 | `HMCharacteristicValueCurrentHumidifierDehumidifierStateIdle` | En attente | `#0EA5E9` |
| 2 | `HMCharacteristicValueCurrentHumidifierDehumidifierStateHumidifying` | En humidification | `#A78BFA` |
| 3 | `HMCharacteristicValueCurrentHumidifierDehumidifierStateDehumidifying` | En déshumidification | `#14B8A6` |

## `currentFanState`

[HMCharacteristicValueCurrentFanState](https://developer.apple.com/documentation/homekit/hmcharacteristicvaluecurrentfanstate) ; série `fan_current_state`, configuration `homekit_activity_state`.

| Code brut | Symbole public / booléen | Libellé français | Couleur |
| --- | --- | --- | --- |
| 0 | `HMCharacteristicValueCurrentFanStateInactive` | Inactif | `#64748B` |
| 1 | `HMCharacteristicValueCurrentFanStateIdle` | En attente | `#0EA5E9` |
| 2 | `HMCharacteristicValueCurrentFanStateActive` | En fonctionnement | `#A78BFA` |

## `currentAirPurifierState`

[HMCharacteristicValueCurrentAirPurifierState](https://developer.apple.com/documentation/homekit/hmcharacteristicvaluecurrentairpurifierstate) ; série `air_purifier_current_state`, configuration `homekit_activity_state`.

| Code brut | Symbole public / booléen | Libellé français | Couleur |
| --- | --- | --- | --- |
| 0 | `HMCharacteristicValueCurrentAirPurifierStateInactive` | Inactif | `#64748B` |
| 1 | `HMCharacteristicValueCurrentAirPurifierStateIdle` | En attente | `#0EA5E9` |
| 2 | `HMCharacteristicValueCurrentAirPurifierStateActive` | En fonctionnement | `#A78BFA` |

## `rotationDirection`

[HMCharacteristicValueRotationDirection](https://developer.apple.com/documentation/homekit/hmcharacteristicvaluerotationdirection) ; série `fan_rotation_direction`, configuration `fan_rotation_direction`.

| Code brut | Symbole public / booléen | Libellé français | Couleur |
| --- | --- | --- | --- |
| 0 | `HMCharacteristicValueRotationDirectionClockwise` | Horaire | `#64748B` |
| 1 | `HMCharacteristicValueRotationDirectionCounterClockwise` | Antihoraire | `#0EA5E9` |

## `targetFanState`

[HMCharacteristicValueTargetFanState](https://developer.apple.com/documentation/homekit/hmcharacteristicvaluetargetfanstate) ; série `fan_target_mode`, configuration `homekit_manual_automatic`.

| Code brut | Symbole public / booléen | Libellé français | Couleur |
| --- | --- | --- | --- |
| 0 | `HMCharacteristicValueTargetFanStateManual` | Manuel | `#64748B` |
| 1 | `HMCharacteristicValueTargetFanStateAutomatic` | Automatique | `#0EA5E9` |

## `targetAirPurifierState`

[HMCharacteristicValueTargetAirPurifierState](https://developer.apple.com/documentation/homekit/hmcharacteristicvaluetargetairpurifierstate) ; série `air_purifier_target_mode`, configuration `homekit_manual_automatic`.

| Code brut | Symbole public / booléen | Libellé français | Couleur |
| --- | --- | --- | --- |
| 0 | `HMCharacteristicValueTargetAirPurifierStateManual` | Manuel | `#64748B` |
| 1 | `HMCharacteristicValueTargetAirPurifierStateAutomatic` | Automatique | `#0EA5E9` |

## `swingMode`

[HMCharacteristicValueSwingMode](https://developer.apple.com/documentation/homekit/hmcharacteristicvalueswingmode) ; série `fan_swing_mode`, configuration `fan_swing_mode`.

| Code brut | Symbole public / booléen | Libellé français | Couleur |
| --- | --- | --- | --- |
| 0 | `HMCharacteristicValueSwingModeDisabled` | Désactivée | `#64748B` |
| 1 | `HMCharacteristicValueSwingModeEnabled` | Activée | `#0EA5E9` |

## `filterChangeIndication`

[HMCharacteristicValueFilterChange](https://developer.apple.com/documentation/homekit/hmcharacteristicvaluefilterchange) ; série `filter_change_needed`, configuration `filter_change_needed`.

| Code brut | Symbole public / booléen | Libellé français | Couleur |
| --- | --- | --- | --- |
| 0 | `HMCharacteristicValueFilterChangeNotNeeded` | Non nécessaire | `#64748B` |
| 1 | `HMCharacteristicValueFilterChangeNeeded` | Nécessaire | `#0EA5E9` |

## `valveType`

[HMCharacteristicValueValveType](https://developer.apple.com/documentation/homekit/hmcharacteristicvaluevalvetype) ; série `valve_type`, configuration `valve_type`.

| Code brut | Symbole public / booléen | Libellé français | Couleur |
| --- | --- | --- | --- |
| 0 | `HMCharacteristicValueValveTypeGenericValve` | Vanne générique | `#64748B` |
| 1 | `HMCharacteristicValueValveTypeIrrigation` | Arrosage | `#0EA5E9` |
| 2 | `HMCharacteristicValueValveTypeShowerHead` | Pommeau de douche | `#A78BFA` |
| 3 | `HMCharacteristicValueValveTypeWaterFaucet` | Robinet | `#14B8A6` |

## `programMode`

[HMCharacteristicValueProgramMode](https://developer.apple.com/documentation/homekit/hmcharacteristicvalueprogrammode) ; série `valve_program_mode`, configuration `valve_program_mode`.

| Code brut | Symbole public / booléen | Libellé français | Couleur |
| --- | --- | --- | --- |
| 0 | `HMCharacteristicValueProgramModeNotScheduled` | Non programmé | `#64748B` |
| 1 | `HMCharacteristicValueProgramModeScheduled` | Programmé | `#0EA5E9` |
| 2 | `HMCharacteristicValueProgramModeScheduleOverriddenToManual` | Programme remplacé manuellement | `#A78BFA` |

## `statusLowBattery`

[HMCharacteristicValueBatteryStatus](https://developer.apple.com/documentation/homekit/hmcharacteristicvaluebatterystatus) ; série `battery_low`, configuration `battery_low`.

| Code brut | Symbole public / booléen | Libellé français | Couleur |
| --- | --- | --- | --- |
| 0 | `HMCharacteristicValueBatteryStatusNormal` | Normale | `#64748B` |
| 1 | `HMCharacteristicValueBatteryStatusLow` | Faible | `#F59E0B` |

## `chargingState`

[HMCharacteristicValueChargingState](https://developer.apple.com/documentation/homekit/hmcharacteristicvaluechargingstate) ; série `battery_charging_state`, configuration `battery_charging_state`.

| Code brut | Symbole public / booléen | Libellé français | Couleur |
| --- | --- | --- | --- |
| 0 | `HMCharacteristicValueChargingStateNone` | Pas en charge | `#64748B` |
| 1 | `HMCharacteristicValueChargingStateInProgress` | En charge | `#0EA5E9` |
| 2 | `HMCharacteristicValueChargingStateNotChargeable` | Non rechargeable | `#A78BFA` |

## `statusActive`

[HMCharacteristicTypeStatusActive](https://developer.apple.com/documentation/homekit/hmcharacteristictypestatusactive) ; série `service_status_active`, configuration `service_status_active`.

| Code brut | Symbole public / booléen | Libellé français | Couleur |
| --- | --- | --- | --- |
| 0 | `false` | Inactif | `#64748B` |
| 1 | `true` | Actif | `#0EA5E9` |

## `statusFault`

[HMCharacteristicValueStatusFault](https://developer.apple.com/documentation/homekit/hmcharacteristicvaluestatusfault) ; série `service_fault`, configuration `service_fault`.

| Code brut | Symbole public / booléen | Libellé français | Couleur |
| --- | --- | --- | --- |
| 0 | `HMCharacteristicValueStatusFaultNoFault` | Aucun défaut | `#64748B` |
| 1 | `HMCharacteristicValueStatusFaultGeneralFault` | Défaut général | `#EF4444` |

## `statusJammed`

[HMCharacteristicValueJammedStatus](https://developer.apple.com/documentation/homekit/hmcharacteristicvaluejammedstatus) ; série `service_jammed`, configuration `service_jammed`.

| Code brut | Symbole public / booléen | Libellé français | Couleur |
| --- | --- | --- | --- |
| 0 | `HMCharacteristicValueJammedStatusNone` | Non bloqué | `#64748B` |
| 1 | `HMCharacteristicValueJammedStatusJammed` | Bloqué | `#EF4444` |

## `statusTampered`

[HMCharacteristicValueTamperedStatus](https://developer.apple.com/documentation/homekit/hmcharacteristicvaluetamperedstatus) ; série `service_tampered`, configuration `service_tampered`.

| Code brut | Symbole public / booléen | Libellé français | Couleur |
| --- | --- | --- | --- |
| 0 | `HMCharacteristicValueTamperedStatusNone` | Aucun sabotage | `#64748B` |
| 1 | `HMCharacteristicValueTamperedStatusTampered` | Sabotage détecté | `#EF4444` |

## `inputEvent`

[HMCharacteristicValueInputEvent](https://developer.apple.com/documentation/homekit/hmcharacteristicvalueinputevent) ; série `switch_input_event`, configuration `switch_input_event`.

| Code brut | Symbole public / booléen | Libellé français | Couleur |
| --- | --- | --- | --- |
| 0 | `HMCharacteristicValueInputEventSinglePress` | Appui simple | `#64748B` |
| 1 | `HMCharacteristicValueInputEventDoublePress` | Double appui | `#0EA5E9` |
| 2 | `HMCharacteristicValueInputEventLongPress` | Appui long | `#A78BFA` |

## `mute`

[HMCharacteristicTypeMute](https://developer.apple.com/documentation/homekit/hmcharacteristictypemute) ; série `audio_mute`, configuration `audio_mute`.

| Code brut | Symbole public / booléen | Libellé français | Couleur |
| --- | --- | --- | --- |
| 0 | `false` | Son actif | `#64748B` |
| 1 | `true` | Son coupé | `#0EA5E9` |

## `nightVision`

[HMCharacteristicTypeNightVision](https://developer.apple.com/documentation/homekit/hmcharacteristictypenightvision) ; série `camera_night_vision`, configuration `camera_night_vision`.

| Code brut | Symbole public / booléen | Libellé français | Couleur |
| --- | --- | --- | --- |
| 0 | `false` | Désactivée | `#64748B` |
| 1 | `true` | Activée | `#0EA5E9` |

## `imageMirroring`

[HMCharacteristicTypeImageMirroring](https://developer.apple.com/documentation/homekit/hmcharacteristictypeimagemirroring) ; série `camera_image_mirroring`, configuration `camera_image_mirroring`.

| Code brut | Symbole public / booléen | Libellé français | Couleur |
| --- | --- | --- | --- |
| 0 | `false` | Non inversée | `#64748B` |
| 1 | `true` | Inversée en miroir | `#0EA5E9` |

## `currentMediaState`

[HMCharacteristicValueCurrentMediaState](https://developer.apple.com/documentation/homekit/hmcharacteristicvaluecurrentmediastate) ; série `media_current_state`, configuration `media_current_state`.

| Code brut | Symbole public / booléen | Libellé français | Couleur |
| --- | --- | --- | --- |
| 0 | `HMCharacteristicValueCurrentMediaStatePlaying` | En lecture | `#64748B` |
| 1 | `HMCharacteristicValueCurrentMediaStatePaused` | En pause | `#0EA5E9` |
| 2 | `HMCharacteristicValueCurrentMediaStateStopped` | Arrêté | `#A78BFA` |
| 3 | `HMCharacteristicValueCurrentMediaStateUnknown` | Inconnu | `#64748B` |
| 4 | `HMCharacteristicValueCurrentMediaStateLoading` | Chargement | `#F59E0B` |
| 5 | `HMCharacteristicValueCurrentMediaStateInterrupted` | Interrompu | `#EC4899` |

## `targetMediaState`

[HMCharacteristicValueTargetMediaState](https://developer.apple.com/documentation/homekit/hmcharacteristicvaluetargetmediastate) ; série `media_target_state`, configuration `media_target_state`.

| Code brut | Symbole public / booléen | Libellé français | Couleur |
| --- | --- | --- | --- |
| 0 | `HMCharacteristicValueTargetMediaStatePlay` | Lecture | `#64748B` |
| 1 | `HMCharacteristicValueTargetMediaStatePause` | Pause | `#0EA5E9` |
| 2 | `HMCharacteristicValueTargetMediaStateStop` | Arrêt | `#A78BFA` |

## `wifiSatelliteStatus`

[HMCharacteristicValueWiFiSatelliteStatus](https://developer.apple.com/documentation/homekit/hmcharacteristicvaluewifisatellitestatus) ; série `wifi_satellite_status`, configuration `wifi_satellite_status`.

| Code brut | Symbole public / booléen | Libellé français | Couleur |
| --- | --- | --- | --- |
| 0 | `HMCharacteristicValueWiFiSatelliteStatusUnknown` | Inconnu | `#64748B` |
| 1 | `HMCharacteristicValueWiFiSatelliteStatusConnected` | Connecté | `#0EA5E9` |
| 2 | `HMCharacteristicValueWiFiSatelliteStatusNotConnected` | Non connecté | `#A78BFA` |

## `currentVisibilityState`

[HMCharacteristicValueCurrentVisibilityState](https://developer.apple.com/documentation/homekit/hmcharacteristicvaluecurrentvisibilitystate) ; série `media_current_visibility`, configuration `media_current_visibility`.

| Code brut | Symbole public / booléen | Libellé français | Couleur |
| --- | --- | --- | --- |
| 0 | `HMCharacteristicValueCurrentVisibilityStateShown` | Visible | `#64748B` |
| 1 | `HMCharacteristicValueCurrentVisibilityStateHidden` | Masqué | `#0EA5E9` |
| 2 | `HMCharacteristicValueCurrentVisibilityStateConnected` | Connecté | `#A78BFA` |
| 3 | `HMCharacteristicValueCurrentVisibilityStateAlwaysShown` | Toujours visible | `#14B8A6` |

## `targetVisibilityState`

[HMCharacteristicValueTargetVisibilityState](https://developer.apple.com/documentation/homekit/hmcharacteristicvaluetargetvisibilitystate) ; série `media_target_visibility`, configuration `media_target_visibility`.

| Code brut | Symbole public / booléen | Libellé français | Couleur |
| --- | --- | --- | --- |
| 0 | `HMCharacteristicValueTargetVisibilityStateShow` | Afficher | `#64748B` |
| 1 | `HMCharacteristicValueTargetVisibilityStateHide` | Masquer | `#0EA5E9` |

## `routerStatus`

[HMCharacteristicValueRouterStatus](https://developer.apple.com/documentation/homekit/hmcharacteristicvaluerouterstatus) ; série `router_status`, configuration `router_status`.

| Code brut | Symbole public / booléen | Libellé français | Couleur |
| --- | --- | --- | --- |
| 0 | `HMCharacteristicValueRouterStatusReady` | Prêt | `#64748B` |
| 1 | `HMCharacteristicValueRouterStatusNotReady` | Non prêt | `#0EA5E9` |

## `closedCaptions`

[HMCharacteristicValueClosedCaptions](https://developer.apple.com/documentation/homekit/hmcharacteristicvalueclosedcaptions) ; série `media_closed_captions`, configuration `media_closed_captions`.

| Code brut | Symbole public / booléen | Libellé français | Couleur |
| --- | --- | --- | --- |
| 0 | `HMCharacteristicValueClosedCaptionsDisabled` | Désactivés | `#64748B` |
| 1 | `HMCharacteristicValueClosedCaptionsEnabled` | Activés | `#0EA5E9` |

## `pictureMode`

[HMCharacteristicValuePictureMode](https://developer.apple.com/documentation/homekit/hmcharacteristicvaluepicturemode) ; série `media_picture_mode`, configuration `media_picture_mode`.

| Code brut | Symbole public / booléen | Libellé français | Couleur |
| --- | --- | --- | --- |
| 0 | `HMCharacteristicValuePictureModeStandard` | Standard | `#64748B` |
| 1 | `HMCharacteristicValuePictureModeMovie` | Cinéma | `#0EA5E9` |
| 2 | `HMCharacteristicValuePictureModeSport` | Sport | `#A78BFA` |
| 3 | `HMCharacteristicValuePictureModeGame` | Jeu | `#14B8A6` |
| 4 | `HMCharacteristicValuePictureModePhoto` | Photo | `#F59E0B` |
| 5 | `HMCharacteristicValuePictureModeVivid` | Vif | `#EC4899` |
| 6 | `HMCharacteristicValuePictureModeDark` | Sombre | `#38BDF8` |
| 7 | `HMCharacteristicValuePictureModeBright` | Clair | `#A3E635` |
| 8 | `HMCharacteristicValuePictureModeComputer` | Ordinateur | `#FB923C` |
| 9 | `HMCharacteristicValuePictureModeNight` | Nuit | `#818CF8` |
| 10 | `HMCharacteristicValuePictureModeCalibrated` | Calibré | `#2DD4BF` |
| 11 | `HMCharacteristicValuePictureModeCustom1` | Personnalisé 1 | `#F472B6` |
| 12 | `HMCharacteristicValuePictureModeCustom2` | Personnalisé 2 | `#FACC15` |
| 13 | `HMCharacteristicValuePictureModeCustom3` | Personnalisé 3 | `#94A3B8` |
