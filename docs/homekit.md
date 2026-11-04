# Catalogue HomeKit — contrat d’intégration

Livraison du 4 novembre 2026, issue [datajot-models#7](https://github.com/babeya/datajot-models/issues/7),
en lien avec [datajot#95](https://github.com/babeya/datajot/issues/95).
Référence applicative : [`832dde91`](https://github.com/babeya/datajot/tree/832dde91383bfab0379c580313b26f5d6f1b92f6).
Réaudit du catalogue : `e98ec69`, 32 séries, 27 unités, 25 configurations.

Le catalogue contient désormais **128 séries, 30 unités et 89 configurations** :
96 séries, 3 unités et 64 configurations ajoutées. Les 103 caractéristiques ont
une correspondance prête ; aucune définition n’est bloquée. Chaque famille réutilise
les unités et configurations compatibles : les sept polluants massiques partagent
une configuration neutre ; les pourcentages, durées et inclinaisons partagent leurs
configurations ; ventilateur et purificateur partagent leurs domaines d’activité
et de mode manuel/automatique. Les séries gardent des noms distincts pour identifier
le polluant, le rôle courant/cible/pic et l’orientation. Leur nombre ne pilote pas
la couverture : c’est la liste des identifiants applicatifs qui est contrôlée.

Ces ressources sont livrées dans les sources et les bundles locaux reconstruits.
**Le raccordement applicatif reste à réaliser** : cette livraison ne rend pas les
95 types auparavant sans modèle automatiquement configurés dans l’application.
Aucun fichier du dépôt applicatif ni aucune série personnelle n’a été modifié.

## Fichiers de référence

- [`homekit-mapping.json`](homekit-mapping.json) : matrice exploitable des 103 identifiants,
  références de ressources avec statut `existing`/`added`/`none`, agrégation,
  précision, priorité, domaine, condition de service, état d’intégration et codes
  localisés `en`, `fr`, `de`, `es`. `modified` distingue les ressources historiques
  ajustées. `baselineKeys` conserve l’inventaire historique vérifié.
- [Table des codes](homekit-states.md) : codes, symboles publics Apple, libellés français
  et couleurs. Les quatre traductions figurent aussi dans chaque configuration source.
- `models/{units,series,svc}/` : source de vérité des définitions et traductions.
  La matrice documente le raccordement, sans introduire de champ de bundle.
- `scripts/validate_homekit.js` : contrôles reproductibles du contrat et du rendu des codes.

## Décisions de données et de visualisation

| Nature | Agrégation | Précision | Motif |
| --- | --- | --- | --- |
| Température/humidité observées, éclairement, concentrations | `average` | 1 | Moyenne des lectures disponibles par intervalle, sans pondération temporelle ni qualification sanitaire. |
| Pics CO/CO₂ | `last` | 1 | Le pic est déjà calculé par l’accessoire ; conserver le dernier pic rapporté. |
| Réglages, consignes, positions, durées, batterie, niveau d’eau, filtre | `last` | 0 ou 1 selon matrice | Dernière valeur observée ; une durée n’est pas additionnée, une consigne n’est pas moyennée. |
| Teinte et rotation d’image | `last`, graphique `points` | 0 | Éviter les moyennes circulaires et l’interpolation entre positions disjointes. |
| Zoom | `last` | 2 | Rapport sans dimension, sans moyenne de réglages. |
| États/événements | `last`, graphique `bar` | 0 | Aucun comptage implicite, somme, moyenne, médiane, extrema ou ligne statistique. |

Les configurations HomeKit portent `includesEmptyAggregates: false`, déjà pris en
charge par `SVCTemplate`. Une absence reste une absence ; un code inconnu explicite
reste une lecture. `last` sélectionne une lecture dans l’intervalle disponible et
ne décrit pas la durée d’un état ni sa prolongation dans un intervalle vide.
Une barre de mouvement ne représente pas un passage ou une personne.

Les états utilisent des seuils `<= code`, dans l’ordre des codes. À chaque code
valide correspond le même libellé et la même couleur pour la recherche par comparaison
et la recherche par égalité exacte de l’application (`ThresholdMatching.swift`,
`SeriesValueFormatter.swift`). Les anciens seuils `< 1`/`>= 1` du contact, du mouvement,
de la lumière, de la fenêtre et la qualité d’air sont ajustés sans inverser leurs
codes. Aucun opérateur JSON `==` n’est ajouté. Les couleurs catégorielles ne forment
pas une échelle générale de gravité ; les détections de fumée, fuite, gaz et obstacle
ainsi que les défauts utilisent du rouge, les états inconnus du gris.

Toutes les visualisations continues concernées sont **neutres**, avec `thresholds: []`.
Les anciennes configurations `co2_concentration_ppm`, `inside_temp_deg_c`,
`humidity_percentage`, `light_level_lux` et `battery_level_percentage` conservent
leurs clés et unités mais perdent leurs bandes interprétatives non justifiées par
une source dans le dépôt. Cela concerne aussi leur réutilisation hors HomeKit dans
les nouveaux modèles créés à partir du catalogue. Le signal `statusLowBattery`
reste distinct : il rapporte l’indication propre à l’accessoire, sans seuil déduit
du pourcentage. Aucun seuil CO₂ n’est réutilisé pour CO, ozone, NO₂, SO₂, COV ou PM.
La qualité d’air HomeKit 0–5 conserve ses catégories Apple, sans devenir un AQI.
Les autres préréglages historiques hors de ce périmètre sont conservés.

Les validateurs et le build acceptent désormais un tableau de seuils vide et valident
le booléen facultatif `includesEmptyAggregates`. Aucun schéma Swift ne doit changer
pour ces deux capacités. Le build préserve `[]` au lieu de le remplacer par l’objet
de traduction `{}`.

## Unités et domaines

| Clé d’unité | Base | Abréviation | Décision |
| --- | --- | --- | --- |
| `mass_concentration` (ajoutée) | `ug_m3` | µg/m³ | Une seule sous-unité ; pas de conversion ppm sans données physiques. |
| `angle_degrees` (ajoutée) | `degree` | ° | Une seule sous-unité ; domaine propre à chaque caractéristique. |
| `color_temperature_mired` (ajoutée) | `mired` | mired | Aucune sous-unité kelvin ; `K = 1 000 000 / mired` est réciproque. |
| `percentage` (existante) | `percent` | % | Valeur brute 0–100, sans division par 100. |
| `duration` (existante) | `s` | s | Stockage en secondes, sous-unités multiplicatives existantes conservées. |
| `parts_per_million` / `luminosity_metric` / `temperature_metric` | `ppm` / `lux` / `c` | ppm / lx / °C | Ressources existantes réutilisées. |

Exemples vérifiés : intensité `75` = `75 %` ; durée `60` = `60 s` ; teinte
`240` = `240°` ; température de couleur `250` = `250 mired`. La conversion
réciproque donnerait 4000 K, mais n’est ni déclarée ni effectuée par le catalogue.
L’afficheur peut adapter `60 s` en `1 min` avec l’unité `duration` ; cela ne change
pas le stockage. Les nouvelles unités à sous-unité unique conservent leur affichage.

Les domaines de la matrice suivent le contrat applicatif cité. Les métadonnées
(minimum, maximum, pas, valeurs autorisées) de l’accessoire peuvent les restreindre.
La température de couleur conserve le domaine technique UInt32 positif, mais ce
maximum ne définit jamais l’axe. Pas de plage universelle 50–400 ou 140–500 mired.
L’ancienne ADK Apple documente une génération particulière, pas toutes les générations.
Le zoom reste un rapport fini non négatif ; la rotation d’image accepte uniquement
0/90/180/270. Températures et consignes restent contraintes par leurs métadonnées.

**Limite du catalogue** : il ne porte pas les domaines d’acquisition ni les bornes
numériques d’axe ; `yAxisBounds` est explicitement exclu de son schéma actuel.
Les valeurs continues utilisent donc l’axe automatique. Un axe fixe 0–100, −90–90,
0–360 ou adapté aux métadonnées nécessiterait un contrat de bornes supplémentaire.
Les états conservent la présentation en barres déjà prise en charge. Les périodes
manquantes, le rejet de valeurs hors domaine et la non-prolongation des états
restent aussi des responsabilités du pipeline applicatif.

## Raccordement à effectuer dans l’application

1. Remplacer les correspondances `preferredTemplateKey`/snapshots par les clés finales
   de la matrice ; garder les identifiants de caractéristiques. Les sept clés
   historiquement raccordées restent disponibles. `carbonDioxidePeakLevel` choisira
   explicitement `co2_peak_concentration_ppm` au lieu de `co2_concentration_ppm` afin
   de distinguer pic et mesure et de passer à `last` pour les nouvelles séries.
2. Synchroniser **les quatre** `SharedTemplates/bundle-{en,fr,de,es}.json` avec le
   catalogue publié avant d’activer les nouvelles clés. Tester chargement distant,
   cache, secours hors ligne et absence de clé, qui reste une erreur de création.
   Le dépôt des modèles ne publie rien tant que la branche n’est pas intégrée.
3. Conserver `device_power_state` par défaut. Choisir `light_on` uniquement si le
   service confirme une lumière ; `contactState` conserve `door_open` et n’utilise
   `window_open` que si le contexte confirme une fenêtre. Sans contexte explicite,
   garder ces décisions génériques/historiques. Aucune nouvelle taxonomie de visibilité.
4. Tester les nouvelles créations : unités structurées, agrégation, précision,
   code→libellé (y compris inconnus), valeurs limites, angles discrets, metadata mired,
   et intervalles sans lecture. Tester aussi la réutilisation de configurations
   déjà enregistrées : la factory préfère une configuration persistée de même clé,
   qui peut conserver ses anciens seuils. Toute mise à jour de ces objets exige
   une décision applicative explicite ; ce catalogue ne les migre pas.
5. Mettre à jour la connaissance produit canonique lors du raccordement effectif :
   modèles livrés ici, sélection automatique et bundles embarqués encore à intégrer.
   Aucune nouvelle capacité de lecture, commande d’appareil, flux audio/vidéo,
   disponibilité ou dernière présence en ligne n’est ajoutée par cette livraison.

Décisions restantes : implémenter et tester ce raccordement dans `babeya/datajot#95` ;
choisir éventuellement des seuils interprétatifs sourcés par polluant et contexte ;
définir un éventuel futur contrat de bornes d’axe. Aucun de ces choix ne bloque les
modèles neutres livrés. Aucune migration implicite des séries ou mesures existantes.

## Validation réalisée

Avec nvm et Node **20.19.5**, version majeure attendue par la CI :

```sh
npm run validate:models
npm run build
npm run validate:output
npm run validate:homekit
```

Les quatre commandes passent. Le contrôle HomeKit vérifie les 103 identifiants
sans doublon, la conservation des 32/27/25 clés historiques, les jeux de clés identiques
en quatre langues, les références et intégrations imbriquées, l’absence de nouvelle
ressource orpheline, les deux modes de recherche des libellés pour chaque code
(minimum, maximum et inconnus inclus), les statistiques désactivées, la séparation
des unités et les exemples numériques bruts. Les anciens préréglages autonomes
sans série, comme `motion_detection_count`, restent disponibles et ne sont pas
utilisés pour transformer du mouvement en comptage.

Six essais de données invalides, exécutés dans une copie temporaire isolée, sont
rejetés : seuils sous forme d’objet, booléen sous forme de chaîne, identifiant absent,
libellé français décalé, moyenne de mouvement et sous-unité kelvin multiplicative
pour mired. Le validateur signale aussi proprement un tableau de seuils invalide.

Un essai isolé avec `JSONDecoder` Swift a décodé les quatre bundles : 128 séries,
30 unités, 89 configurations par langue. Il réutilise les déclarations des structs
`SeriesTemplate`, `UnitTemplate`, `SubUnitTemplate`, `CategoryTemplate`, `SVCTemplate`,
`ThresholdConfigTemplate`, `YAxisBoundConfigTemplate` du commit applicatif cité,
avec les valeurs brutes des enums nécessaires, en excluant seulement leurs adaptateurs
SwiftData/UI. Il confirme le contrat JSON ; il ne remplace pas les tests fonctionnels
de création et d’affichage dans l’application.

`build/` est ignoré par Git selon le workflow existant : les 17 fichiers JSON ont
été régénérés localement et seront reconstruits par la CI. Les sources, traductions,
documentation et validateurs portent le changement versionné.

## Matrice finale

Répartition : **26 P0, 54 P1, 23 P2**.

`E` = ressource existante, `E*` = existante ajustée, `+` = ajoutée ; `—` = sans unité.
Précision = nombre de décimales. Tous les codes et leurs références sont détaillés
dans la [table des états](homekit-states.md) et dans la matrice JSON.

| Identifiant | Série | Unité | Configuration | Agrégation | Précision | Priorité | Domaine brut | Condition / décision |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `temperature` | `temperature_indoor_metric` E* | `temperature_metric` E | `inside_temp_deg_c` E* | `average` | 1 | P0 | métadonnées | Aucune condition supplémentaire. |
| `humidity` | `humidity` E* | `percentage` E | `humidity_percentage` E* | `average` | 1 | P0 | 0…100 | Aucune condition supplémentaire. |
| `carbonDioxide` | `co2_concentration_ppm` E | `parts_per_million` E | `co2_concentration_ppm` E* | `average` | 1 | P0 | 0… (fini) | Aucune condition supplémentaire. |
| `airQuality` | `homekit_air_quality` E | — | `homekit_air_quality` E* | `last` | 0 | P0 | 0…5 entiers | Aucune condition supplémentaire. |
| `lightLevel` | `light_level` E* | `luminosity_metric` E | `light_level_lux` E* | `average` | 1 | P0 | 0… (fini) | Aucune condition supplémentaire. |
| `contactState` | `door_open` E | — | `door_open_binary` E* | `last` | 0 | P0 | 0…1 entiers | Correspondance historique de contact : 0 = contact détecté, 1 = contact absent. window_open uniquement si le service confirme une fenêtre ; aucun choix automatique sans contexte. |
| `motionDetected` | `motion_detected` E | — | `motion_detected_binary` E* | `last` | 0 | P0 | 0…1 entiers | Aucune condition supplémentaire. |
| `occupancyDetected` | `occupancy_detected` + | — | `occupancy_detected` + | `last` | 0 | P0 | 0…1 entiers | Aucune condition supplémentaire. |
| `powerState` | `device_power_state` + | — | `device_power_state` + | `last` | 0 | P0 | 0…1 entiers | Modèle générique par défaut. light_on/light_on_binary seulement si le service est explicitement une lumière ; jamais une puissance en watts. |
| `outletInUse` | `outlet_in_use` + | — | `outlet_in_use` + | `last` | 0 | P0 | 0…1 entiers | Un appareil peut être branché même éteint ; cet état ne mesure ni la consommation ni la puissance. |
| `currentPosition` | `opening_position` + | `percentage` E | `homekit_percentage` + | `last` | 0 | P0 | 0…100 | 0 = fermeture complète ; 100 = ouverture complète. Position observée, distincte du contact et de la consigne. |
| `carbonDioxidePeakLevel` | `co2_peak_concentration_ppm` + | `parts_per_million` E | `gas_concentration_ppm` + | `last` | 1 | P1 | 0… (fini) | Raccordement explicite au nouveau modèle de pic. La clé co2_concentration_ppm reste disponible ; les séries existantes ne sont pas migrées. |
| `carbonMonoxide` | `co_concentration_ppm` + | `parts_per_million` E | `gas_concentration_ppm` + | `average` | 1 | P0 | 0… (fini) | Aucune condition supplémentaire. |
| `carbonMonoxidePeakLevel` | `co_peak_concentration_ppm` + | `parts_per_million` E | `gas_concentration_ppm` + | `last` | 1 | P0 | 0… (fini) | Aucune condition supplémentaire. |
| `airParticulateDensity` | `air_particulate_concentration` + | `mass_concentration` + | `mass_concentration_ug_m3` + | `average` | 1 | P1 | 0… (fini) | Concentration générique ; conserver séparément la caractéristique airParticulateSize, sans déduire PM2,5 ou PM10 en son absence. |
| `ozoneDensity` | `ozone_concentration` + | `mass_concentration` + | `mass_concentration_ug_m3` + | `average` | 1 | P1 | 0… (fini) | Aucune condition supplémentaire. |
| `nitrogenDioxideDensity` | `no2_concentration` + | `mass_concentration` + | `mass_concentration_ug_m3` + | `average` | 1 | P1 | 0… (fini) | Aucune condition supplémentaire. |
| `sulphurDioxideDensity` | `so2_concentration` + | `mass_concentration` + | `mass_concentration_ug_m3` + | `average` | 1 | P1 | 0… (fini) | Aucune condition supplémentaire. |
| `pm2_5Density` | `pm2_5_concentration` + | `mass_concentration` + | `mass_concentration_ug_m3` + | `average` | 1 | P0 | 0… (fini) | Aucune condition supplémentaire. |
| `pm10Density` | `pm10_concentration` + | `mass_concentration` + | `mass_concentration_ug_m3` + | `average` | 1 | P0 | 0… (fini) | Aucune condition supplémentaire. |
| `volatileOrganicCompoundDensity` | `voc_concentration` + | `mass_concentration` + | `mass_concentration_ug_m3` + | `average` | 1 | P1 | 0… (fini) | Aucune condition supplémentaire. |
| `airParticulateSize` | `air_particulate_size` + | — | `air_particulate_size` + | `last` | 0 | P1 | 0…1 entiers | Aucune condition supplémentaire. |
| `smokeDetected` | `smoke_detected` + | — | `smoke_detected` + | `last` | 0 | P0 | 0…1 entiers | Aucune condition supplémentaire. |
| `leakDetected` | `leak_detected` + | — | `leak_detected` + | `last` | 0 | P0 | 0…1 entiers | Aucune condition supplémentaire. |
| `carbonMonoxideDetected` | `co_detected` + | — | `co_detected` + | `last` | 0 | P0 | 0…1 entiers | Aucune condition supplémentaire. |
| `carbonDioxideDetected` | `co2_detected` + | — | `co2_detected` + | `last` | 0 | P0 | 0…1 entiers | Aucune condition supplémentaire. |
| `obstructionDetected` | `obstruction_detected` + | — | `obstruction_detected` + | `last` | 0 | P0 | 0…1 entiers | Aucune condition supplémentaire. |
| `brightness` | `light_brightness` + | `percentage` E | `homekit_percentage` + | `last` | 0 | P0 | 0…100 | Aucune condition supplémentaire. |
| `saturation` | `light_saturation` + | `percentage` E | `homekit_percentage` + | `last` | 0 | P1 | 0…100 | Aucune condition supplémentaire. |
| `hue` | `light_hue` + | `angle_degrees` + | `homekit_angle_degrees` + | `last` | 0 | P1 | 0…360 | Angle circulaire : last, sans moyenne arithmétique ni interpolation entre 360° et 0°. |
| `colorTemperature` | `light_color_temperature` + | `color_temperature_mired` + | `homekit_color_temperature_mired` + | `last` | 0 | P1 | 1…4294967295 ; métadonnées | Bornes effectives fournies par les métadonnées de l’accessoire. Aucune borne UInt32 utilisée comme axe, aucune conversion multiplicative en kelvin. |
| `outputState` | `switch_output_state` + | — | `switch_output_state` + | `last` | 0 | P2 | 0…1 entiers | État de présentation d’un interrupteur programmable binaire, pas une mesure électrique. |
| `active` | `device_active` + | — | `device_active` + | `last` | 0 | P0 | 0…1 entiers | Aucune condition supplémentaire. |
| `inUse` | `service_in_use` + | — | `service_in_use` + | `last` | 0 | P0 | 0…1 entiers | Aucune condition supplémentaire. |
| `targetPosition` | `opening_target_position` + | `percentage` E | `homekit_percentage` + | `last` | 0 | P1 | 0…100 | Aucune condition supplémentaire. |
| `currentHorizontalTilt` | `horizontal_tilt` + | `angle_degrees` + | `homekit_tilt_degrees` + | `last` | 0 | P1 | -90…90 | Orientation liée au service ; currentTilt/targetTilt décrivent les lamelles, sans inventer un axe horizontal ou vertical. |
| `targetHorizontalTilt` | `target_horizontal_tilt` + | `angle_degrees` + | `homekit_tilt_degrees` + | `last` | 0 | P1 | -90…90 | Orientation liée au service ; currentTilt/targetTilt décrivent les lamelles, sans inventer un axe horizontal ou vertical. |
| `currentVerticalTilt` | `vertical_tilt` + | `angle_degrees` + | `homekit_tilt_degrees` + | `last` | 0 | P1 | -90…90 | Orientation liée au service ; currentTilt/targetTilt décrivent les lamelles, sans inventer un axe horizontal ou vertical. |
| `targetVerticalTilt` | `target_vertical_tilt` + | `angle_degrees` + | `homekit_tilt_degrees` + | `last` | 0 | P1 | -90…90 | Orientation liée au service ; currentTilt/targetTilt décrivent les lamelles, sans inventer un axe horizontal ou vertical. |
| `currentTilt` | `slat_tilt` + | `angle_degrees` + | `homekit_tilt_degrees` + | `last` | 0 | P1 | -90…90 | Orientation liée au service ; currentTilt/targetTilt décrivent les lamelles, sans inventer un axe horizontal ou vertical. |
| `targetTilt` | `target_slat_tilt` + | `angle_degrees` + | `homekit_tilt_degrees` + | `last` | 0 | P1 | -90…90 | Orientation liée au service ; currentTilt/targetTilt décrivent les lamelles, sans inventer un axe horizontal ou vertical. |
| `currentDoorState` | `door_current_state` + | — | `door_current_state` + | `last` | 0 | P1 | 0…4 entiers | Aucune condition supplémentaire. |
| `targetDoorState` | `door_target_state` + | — | `door_target_state` + | `last` | 0 | P1 | 0…1 entiers | Aucune condition supplémentaire. |
| `slatType` | `slat_type` + | — | `slat_type` + | `last` | 0 | P1 | 0…1 entiers | Aucune condition supplémentaire. |
| `positionState` | `opening_movement` + | — | `opening_movement` + | `last` | 0 | P1 | 0…2 entiers | Aucune condition supplémentaire. |
| `currentSlatState` | `slat_current_state` + | — | `slat_current_state` + | `last` | 0 | P1 | 0…2 entiers | Aucune condition supplémentaire. |
| `currentLockMechanismState` | `lock_current_state` + | — | `lock_current_state` + | `last` | 0 | P1 | 0…3 entiers | Aucune condition supplémentaire. |
| `targetSecuritySystemState` | `security_target_state` + | — | `security_target_state` + | `last` | 0 | P1 | 0…3 entiers | Aucune condition supplémentaire. |
| `targetLockMechanismState` | `lock_target_state` + | — | `lock_target_state` + | `last` | 0 | P1 | 0…1 entiers | Aucune condition supplémentaire. |
| `securitySystemAlarmType` | `security_alarm_type` + | — | `security_alarm_type` + | `last` | 0 | P1 | 0…1 entiers | Aucune condition supplémentaire. |
| `lockPhysicalControls` | `physical_controls_lock` + | — | `physical_controls_lock` + | `last` | 0 | P1 | 0…1 entiers | Aucune condition supplémentaire. |
| `currentSecuritySystemState` | `security_current_state` + | — | `security_current_state` + | `last` | 0 | P1 | 0…4 entiers | Aucune condition supplémentaire. |
| `lockMechanismLastKnownAction` | `lock_last_action` + | — | `lock_last_action` + | `last` | 0 | P1 | 0…10 entiers | Aucune condition supplémentaire. |
| `lockManagementAutoSecureTimeout` | `lock_auto_secure_timeout` + | `duration` E | `homekit_duration_seconds` + | `last` | 0 | P1 | 0…4294967295 | Secondes brutes. Le domaine UInt32 ne définit pas les bornes du graphique. |
| `targetTemperature` | `target_temperature` + | `temperature_metric` E | `homekit_temperature_setpoint` + | `last` | 1 | P1 | métadonnées | Aucune condition supplémentaire. |
| `heatingThreshold` | `heating_temperature_threshold` + | `temperature_metric` E | `homekit_temperature_setpoint` + | `last` | 1 | P1 | métadonnées | Aucune condition supplémentaire. |
| `coolingThreshold` | `cooling_temperature_threshold` + | `temperature_metric` E | `homekit_temperature_setpoint` + | `last` | 1 | P1 | métadonnées | Aucune condition supplémentaire. |
| `targetRelativeHumidity` | `target_relative_humidity` + | `percentage` E | `homekit_percentage` + | `last` | 1 | P1 | 0…100 | Aucune condition supplémentaire. |
| `humidifierThreshold` | `humidifier_humidity_threshold` + | `percentage` E | `homekit_percentage` + | `last` | 1 | P1 | 0…100 | Aucune condition supplémentaire. |
| `dehumidifierThreshold` | `dehumidifier_humidity_threshold` + | `percentage` E | `homekit_percentage` + | `last` | 1 | P1 | 0…100 | Aucune condition supplémentaire. |
| `currentHeatingCooling` | `heating_cooling_current_state` + | — | `heating_cooling_current_state` + | `last` | 0 | P1 | 0…2 entiers | Aucune condition supplémentaire. |
| `targetHeaterCoolerState` | `heater_cooler_target_mode` + | — | `heater_cooler_target_mode` + | `last` | 0 | P1 | 0…2 entiers | Aucune condition supplémentaire. |
| `targetHumidifierDehumidifierState` | `humidifier_target_mode` + | — | `humidifier_target_mode` + | `last` | 0 | P1 | 0…2 entiers | Aucune condition supplémentaire. |
| `targetHeatingCooling` | `heating_cooling_target_mode` + | — | `heating_cooling_target_mode` + | `last` | 0 | P1 | 0…3 entiers | Aucune condition supplémentaire. |
| `currentHeaterCoolerState` | `heater_cooler_current_state` + | — | `heater_cooler_current_state` + | `last` | 0 | P1 | 0…3 entiers | Aucune condition supplémentaire. |
| `currentHumidifierDehumidifierState` | `humidifier_current_state` + | — | `humidifier_current_state` + | `last` | 0 | P1 | 0…3 entiers | Aucune condition supplémentaire. |
| `rotationSpeed` | `fan_rotation_speed` + | `percentage` E | `homekit_percentage` + | `last` | 1 | P1 | 0…100 | Aucune condition supplémentaire. |
| `filterLifeLevel` | `filter_life_level` + | `percentage` E | `homekit_percentage` + | `last` | 0 | P2 | 0…100 | Aucune condition supplémentaire. |
| `currentFanState` | `fan_current_state` + | — | `homekit_activity_state` + | `last` | 0 | P1 | 0…2 entiers | Aucune condition supplémentaire. |
| `currentAirPurifierState` | `air_purifier_current_state` + | — | `homekit_activity_state` + | `last` | 0 | P1 | 0…2 entiers | Aucune condition supplémentaire. |
| `rotationDirection` | `fan_rotation_direction` + | — | `fan_rotation_direction` + | `last` | 0 | P1 | 0…1 entiers | Aucune condition supplémentaire. |
| `targetFanState` | `fan_target_mode` + | — | `homekit_manual_automatic` + | `last` | 0 | P1 | 0…1 entiers | Aucune condition supplémentaire. |
| `targetAirPurifierState` | `air_purifier_target_mode` + | — | `homekit_manual_automatic` + | `last` | 0 | P1 | 0…1 entiers | Aucune condition supplémentaire. |
| `swingMode` | `fan_swing_mode` + | — | `fan_swing_mode` + | `last` | 0 | P1 | 0…1 entiers | Aucune condition supplémentaire. |
| `filterChangeIndication` | `filter_change_needed` + | — | `filter_change_needed` + | `last` | 0 | P2 | 0…1 entiers | Aucune condition supplémentaire. |
| `waterLevel` | `water_level` + | `percentage` E | `homekit_percentage` + | `last` | 1 | P1 | 0…100 | Aucune condition supplémentaire. |
| `setDuration` | `valve_set_duration` + | `duration` E | `homekit_duration_seconds` + | `last` | 0 | P1 | 0…3600 | Aucune condition supplémentaire. |
| `remainingDuration` | `valve_remaining_duration` + | `duration` E | `homekit_duration_seconds` + | `last` | 0 | P1 | 0…3600 | Aucune condition supplémentaire. |
| `valveType` | `valve_type` + | — | `valve_type` + | `last` | 0 | P1 | 0…3 entiers | Aucune condition supplémentaire. |
| `programMode` | `valve_program_mode` + | — | `valve_program_mode` + | `last` | 0 | P1 | 0…2 entiers | Aucune condition supplémentaire. |
| `batteryLevel` | `battery_level` + | `percentage` E | `battery_level_percentage` E* | `last` | 0 | P0 | 0…100 | Aucune condition supplémentaire. |
| `statusLowBattery` | `battery_low` + | — | `battery_low` + | `last` | 0 | P0 | 0…1 entiers | Aucune condition supplémentaire. |
| `chargingState` | `battery_charging_state` + | — | `battery_charging_state` + | `last` | 0 | P0 | 0…2 entiers | Aucune condition supplémentaire. |
| `statusActive` | `service_status_active` + | — | `service_status_active` + | `last` | 0 | P2 | 0…1 entiers | État de fonctionnement du service ; distinct du réglage active et de la disponibilité réseau de l’app. |
| `statusFault` | `service_fault` + | — | `service_fault` + | `last` | 0 | P2 | 0…1 entiers | Aucune condition supplémentaire. |
| `statusJammed` | `service_jammed` + | — | `service_jammed` + | `last` | 0 | P2 | 0…1 entiers | Aucune condition supplémentaire. |
| `statusTampered` | `service_tampered` + | — | `service_tampered` + | `last` | 0 | P2 | 0…1 entiers | Aucune condition supplémentaire. |
| `inputEvent` | `switch_input_event` + | — | `switch_input_event` + | `last` | 0 | P2 | 0…2 entiers | Dernier type d’appui observé ; aucun comptage, aucune durée de maintien implicite. |
| `volume` | `audio_volume` + | `percentage` E | `homekit_percentage` + | `last` | 0 | P2 | 0…100 | Aucune condition supplémentaire. |
| `mute` | `audio_mute` + | — | `audio_mute` + | `last` | 0 | P2 | 0…1 entiers | Aucune condition supplémentaire. |
| `nightVision` | `camera_night_vision` + | — | `camera_night_vision` + | `last` | 0 | P2 | 0…1 entiers | Aucune condition supplémentaire. |
| `imageMirroring` | `camera_image_mirroring` + | — | `camera_image_mirroring` + | `last` | 0 | P2 | 0…1 entiers | Miroir autour de l’axe vertical. |
| `opticalZoom` | `camera_optical_zoom` + | — | `homekit_zoom_ratio` + | `last` | 2 | P2 | 0… (fini) | Rapport sans dimension ; limites de l’accessoire, aucune unité physique ni conversion en pourcentage. |
| `digitalZoom` | `camera_digital_zoom` + | — | `homekit_zoom_ratio` + | `last` | 2 | P2 | 0… (fini) | Rapport sans dimension ; limites de l’accessoire, aucune unité physique ni conversion en pourcentage. |
| `imageRotation` | `camera_image_rotation` + | `angle_degrees` + | `homekit_angle_degrees` + | `last` | 0 | P2 | 0/90/180/270 | Aucune condition supplémentaire. |
| `currentMediaState` | `media_current_state` + | — | `media_current_state` + | `last` | 0 | P2 | 0…5 entiers | Aucune condition supplémentaire. |
| `targetMediaState` | `media_target_state` + | — | `media_target_state` + | `last` | 0 | P2 | 0…2 entiers | Aucune condition supplémentaire. |
| `wifiSatelliteStatus` | `wifi_satellite_status` + | — | `wifi_satellite_status` + | `last` | 0 | P2 | 0…2 entiers | Aucune condition supplémentaire. |
| `currentVisibilityState` | `media_current_visibility` + | — | `media_current_visibility` + | `last` | 0 | P2 | 0…3 entiers | Aucune condition supplémentaire. |
| `targetVisibilityState` | `media_target_visibility` + | — | `media_target_visibility` + | `last` | 0 | P2 | 0…1 entiers | Aucune condition supplémentaire. |
| `routerStatus` | `router_status` + | — | `router_status` + | `last` | 0 | P2 | 0…1 entiers | 0 = configuration HomeKit déployée, 1 = non déployée ; distinct de la disponibilité de l’appareil dans l’app. |
| `closedCaptions` | `media_closed_captions` + | — | `media_closed_captions` + | `last` | 0 | P2 | 0…1 entiers | Aucune condition supplémentaire. |
| `pictureMode` | `media_picture_mode` + | — | `media_picture_mode` + | `last` | 0 | P2 | 0…13 entiers | Aucune condition supplémentaire. |
