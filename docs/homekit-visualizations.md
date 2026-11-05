# Visualisations HomeKit

Personnalisation du 5 novembre 2026, [issue #9](https://github.com/babeya/datajot-models/issues/9).
Les **43 mesures numériques** disposent de bandes colorées et les **60 états**
de couleurs par code. Le catalogue contient 128 séries, 30 unités et
107 configurations. Les 18 nouvelles configurations séparent des mesures qui
partageaient une unité mais pas une interprétation : volume, réserve de filtre,
ouverture, éclairage, polluants, valeurs courantes et pics.

## Choix de lecture

- Les bandes sont évaluées dans l’ordre : la première comparaison vraie gagne.
  Les seuils sont exprimés dans l’unité brute de la série, sans conversion implicite.
- Une mesure absente reste absente (`includesEmptyAggregates: false`).
- Les mesures observées affichent moyenne, minimum et maximum. Les pics gardent
  seulement le maximum. Les réglages, niveaux et durées affichent minimum et
  maximum ; la teinte, les inclinaisons et la rotation n’affichent pas de statistiques.
- Les observations et niveaux utilisent des aires, les réglages et positions
  des lignes, les pics et orientations discrètes des points, les états des barres.
  L’agrégation reste celle du contrat HomeKit ; les graphiques de teinte ne relient
  pas artificiellement 360° et 0°.
- Les familles compatibles partagent leurs bandes : positions courante/cible,
  inclinaisons, consignes thermiques, consignes d’humidité et rapports de zoom.
  Les valeurs courantes et pics de gaz ont des statistiques séparées.
- Les palettes de concentration CO et massique vont du bleu au violet avec des
  libellés numériques. Elles indiquent une grandeur, sans déclarer une zone sûre.
  La taille de particule reste un état discret 2,5/10 µm, distinct des concentrations.

## Repères et sources

- **Température intérieure** : restauration du préréglage historique à 16, 19, 21
  et 24 °C, avec « très froid / froid / confortable / chaud / très chaud ». Ce sont
  des choix de confort du catalogue. Les consignes utilisent les mêmes repères
  mais des libellés de réglage, sans moyenne des consignes.
- **Humidité** : zone intérieure de référence de 30 à 50 %, puis repère à 60 %,
  cohérents avec les conseils de l’[EPA](https://www.epa.gov/mold/brief-guide-mold-moisture-and-your-home).
  La zone centrale inclut 50 %. Les mêmes bandes peuvent situer une consigne,
  sans confondre réglage et mesure de la pièce.
- **CO₂** : repères à 800, 1000, 1500 et 2000 ppm. Le
  [NIOSH](https://www.cdc.gov/niosh/ventilation/faq/) évoque 800 ppm comme cible
  possible de référence ; le [HSE](https://www.hse.gov.uk/ventilation/using-co2-monitors.htm)
  utilise notamment 1000 ppm comme repère de renouvellement d’air et des valeurs
  durablement au-dessus de 1500 ppm comme indication de ventilation insuffisante
  en local occupé. Le palier 2000 ppm et les libellés de concentration sont des
  choix éditoriaux. Une lecture ou un pic isolé n’est pas un diagnostic sanitaire.
- **Éclairement** : repères visuels à 10, 50, 200, 500 et 1000 lux. Les ordres de
  grandeur de 50 à 1000 lux sont cohérents avec les plages d’activité décrites par
  le [CCHST](https://www.ccohs.ca/oshanswers/ergonomics/lighting/lighting_survey.html).
  Le palier 10 lux et les libellés sont éditoriaux ; l’activité et la position du
  capteur déterminent l’éclairement utile.
- **CO, particules, ozone, NO₂, SO₂ et COV** : plages numériques éditoriales,
  adaptées aux ordres de grandeur de chaque mesure. Elles ne reproduisent pas
  un AQI ou des limites sanitaires avec une durée d’exposition implicite.
  Les alarmes de détection HomeKit restent des séries distinctes.
- **Température de couleur** : bandes brutes à 200, 286 et 400 mired, proches de
  5000, 3500 et 2500 K via `K = 1 000 000 / mired`. Le dégradé est inversé par
  rapport aux kelvins : plus de mired signifie une lumière plus chaude. Aucune
  sous-unité kelvin multiplicative ni plage d’accessoire universelle n’est ajoutée.
- **Autres réglages et réserves** : divisions éditoriales lisibles de leur domaine,
  avec les extrémités réelles quand elles existent : 0/100 % d’ouverture, 0 %
  de réserve, référence 1× du zoom, angles 0/90/180/270 et bande centrale de
  ±5° pour les inclinaisons. Le volume reste un pourcentage relatif, sans dB ;
  une vitesse relative n’est pas un régime en tours/minute. Les bandes de filtre
  et de batterie ne remplacent pas les indications propres à l’accessoire.

## Configurations numériques

Chaque ligne couvre les identifiants indiqués ; les seuils utilisent la première
comparaison vraie. Les libellés présentés sont français, avec traductions
complètes `en`, `fr`, `de`, `es` dans les sources. Les couleurs sont données dans
le même ordre que les bandes. Les domaines valides restent ceux de la matrice
et des métadonnées de l’accessoire, sans ajout de bornes d’axe au schéma.

| Identifiants | Configuration | Bandes et libellés | Palette | Graphique / statistiques |
| --- | --- | --- | --- | --- |
| `temperature` | `inside_temp_deg_c` | `< 16` Très froid; `< 19` Froid; `< 21` Confortable; `< 24` Chaud; `>= 24` Très chaud | `#1D4ED8` `#3B82F6` `#22C55E` `#EAB308` `#EF4444` | `area` / moyenne, min, max |
| `humidity` | `humidity_percentage` | `< 30` Sec; `<= 50` Zone 30–50 %; `< 60` Humide; `>= 60` Très humide | `#F59E0B` `#22C55E` `#14B8A6` `#3B82F6` | `area` / moyenne, min, max |
| `carbonDioxide` | `co2_concentration_ppm` | `< 800` Faible; `< 1000` Modérée; `< 1500` Soutenue; `< 2000` Élevée; `>= 2000` Très élevée | `#22C55E` `#84CC16` `#F59E0B` `#F97316` `#EF4444` | `area` / moyenne, min, max |
| `lightLevel` | `light_level_lux` | `< 10` Obscur; `< 50` Très tamisé; `< 200` Tamisé; `< 500` Éclairé; `< 1000` Lumineux; `>= 1000` Très lumineux | `#312E81` `#4F46E5` `#3B82F6` `#06B6D4` `#EAB308` `#FBBF24` | `area` / moyenne, min, max |
| `currentPosition`, `targetPosition` | `homekit_percentage` | `<= 0` Fermé; `< 25` Peu ouvert; `< 75` Partiellement ouvert; `< 100` Presque ouvert; `>= 100` Entièrement ouvert | `#64748B` `#3B82F6` `#06B6D4` `#14B8A6` `#22C55E` | `line` / min, max |
| `carbonDioxidePeakLevel` | `co2_peak_concentration_ppm` | `< 800` Pic faible; `< 1000` Pic modéré; `< 1500` Pic soutenu; `< 2000` Pic élevé; `>= 2000` Pic très élevé | `#22C55E` `#84CC16` `#F59E0B` `#F97316` `#EF4444` | `points` / max |
| `carbonMonoxide` | `gas_concentration_ppm` | `< 0.5` < 0.5 ppm; `< 2` 0.5–< 2 ppm; `< 10` 2–< 10 ppm; `< 25` 10–< 25 ppm; `>= 25` ≥ 25 ppm | `#93C5FD` `#3B82F6` `#6366F1` `#8B5CF6` `#C026D3` | `area` / moyenne, min, max |
| `carbonMonoxidePeakLevel` | `co_peak_concentration_ppm` | `< 0.5` < 0.5 ppm; `< 2` 0.5–< 2 ppm; `< 10` 2–< 10 ppm; `< 25` 10–< 25 ppm; `>= 25` ≥ 25 ppm | `#93C5FD` `#3B82F6` `#6366F1` `#8B5CF6` `#C026D3` | `points` / max |
| `airParticulateDensity` | `mass_concentration_ug_m3` | `< 25` < 25 µg/m³; `< 50` 25–< 50 µg/m³; `< 100` 50–< 100 µg/m³; `< 250` 100–< 250 µg/m³; `>= 250` ≥ 250 µg/m³ | `#93C5FD` `#3B82F6` `#6366F1` `#8B5CF6` `#C026D3` | `area` / moyenne, min, max |
| `ozoneDensity` | `ozone_concentration_ug_m3` | `< 25` < 25 µg/m³; `< 50` 25–< 50 µg/m³; `< 100` 50–< 100 µg/m³; `< 200` 100–< 200 µg/m³; `>= 200` ≥ 200 µg/m³ | `#93C5FD` `#3B82F6` `#6366F1` `#8B5CF6` `#C026D3` | `area` / moyenne, min, max |
| `nitrogenDioxideDensity` | `no2_concentration_ug_m3` | `< 25` < 25 µg/m³; `< 50` 25–< 50 µg/m³; `< 100` 50–< 100 µg/m³; `< 200` 100–< 200 µg/m³; `>= 200` ≥ 200 µg/m³ | `#93C5FD` `#3B82F6` `#6366F1` `#8B5CF6` `#C026D3` | `area` / moyenne, min, max |
| `sulphurDioxideDensity` | `so2_concentration_ug_m3` | `< 10` < 10 µg/m³; `< 50` 10–< 50 µg/m³; `< 100` 50–< 100 µg/m³; `< 300` 100–< 300 µg/m³; `>= 300` ≥ 300 µg/m³ | `#93C5FD` `#3B82F6` `#6366F1` `#8B5CF6` `#C026D3` | `area` / moyenne, min, max |
| `pm2_5Density` | `pm2_5_concentration_ug_m3` | `< 10` < 10 µg/m³; `< 25` 10–< 25 µg/m³; `< 50` 25–< 50 µg/m³; `< 100` 50–< 100 µg/m³; `>= 100` ≥ 100 µg/m³ | `#93C5FD` `#3B82F6` `#6366F1` `#8B5CF6` `#C026D3` | `area` / moyenne, min, max |
| `pm10Density` | `pm10_concentration_ug_m3` | `< 20` < 20 µg/m³; `< 50` 20–< 50 µg/m³; `< 100` 50–< 100 µg/m³; `< 200` 100–< 200 µg/m³; `>= 200` ≥ 200 µg/m³ | `#93C5FD` `#3B82F6` `#6366F1` `#8B5CF6` `#C026D3` | `area` / moyenne, min, max |
| `volatileOrganicCompoundDensity` | `voc_concentration_ug_m3` | `< 100` < 100 µg/m³; `< 300` 100–< 300 µg/m³; `< 1000` 300–< 1000 µg/m³; `< 3000` 1000–< 3000 µg/m³; `>= 3000` ≥ 3000 µg/m³ | `#93C5FD` `#3B82F6` `#6366F1` `#8B5CF6` `#C026D3` | `area` / moyenne, min, max |
| `brightness` | `light_brightness_percentage` | `<= 0` Minimum; `< 25` Tamisé; `< 50` Doux; `< 75` Clair; `>= 75` Très lumineux | `#64748B` `#4F46E5` `#8B5CF6` `#F59E0B` `#FBBF24` | `area` / min, max |
| `saturation` | `light_saturation_percentage` | `<= 0` Sans saturation; `< 25` Pastel; `< 60` Coloré; `< 90` Vif; `>= 90` Intense | `#64748B` `#A5B4FC` `#8B5CF6` `#EC4899` `#C026D3` | `area` / min, max |
| `hue` | `homekit_angle_degrees` | `< 30` Rouge; `< 90` Jaune; `< 150` Vert; `< 210` Cyan; `< 270` Bleu; `< 330` Magenta; `>= 330` Rouge | `#EF4444` `#EAB308` `#22C55E` `#06B6D4` `#3B82F6` `#D946EF` `#EF4444` | `points` / aucune |
| `colorTemperature` | `homekit_color_temperature_mired` | `< 200` Blanc froid; `< 286` Blanc neutre; `< 400` Blanc chaud; `>= 400` Blanc très chaud | `#3B82F6` `#94A3B8` `#FBBF24` `#F97316` | `line` / min, max |
| `currentHorizontalTilt`, `targetHorizontalTilt`, `currentVerticalTilt`, `targetVerticalTilt`, `currentTilt`, `targetTilt` | `homekit_tilt_degrees` | `< -45` Négative marquée; `< -5` Négative; `<= 5` Centrée; `<= 45` Positive; `> 45` Positive marquée | `#3B82F6` `#06B6D4` `#14B8A6` `#8B5CF6` `#EC4899` | `line` / aucune |
| `lockManagementAutoSecureTimeout` | `lock_auto_secure_timeout_seconds` | `<= 0` 0 s; `<= 30` ≤ 30 s; `<= 60` 30–60 s; `<= 300` 1–5 min; `> 300` > 5 min | `#64748B` `#3B82F6` `#14B8A6` `#F59E0B` `#8B5CF6` | `line` / min, max |
| `targetTemperature`, `heatingThreshold`, `coolingThreshold` | `homekit_temperature_setpoint` | `< 16` Consigne basse; `< 19` Consigne modérée; `< 21` Consigne tempérée; `< 24` Consigne élevée; `>= 24` Consigne très élevée | `#1D4ED8` `#3B82F6` `#22C55E` `#EAB308` `#EF4444` | `line` / min, max |
| `targetRelativeHumidity`, `humidifierThreshold`, `dehumidifierThreshold` | `humidity_setpoint_percentage` | `< 30` Sec; `<= 50` Zone 30–50 %; `< 60` Humide; `>= 60` Très humide | `#F59E0B` `#22C55E` `#14B8A6` `#3B82F6` | `line` / min, max |
| `rotationSpeed` | `fan_speed_percentage` | `<= 0` Vitesse nulle; `<= 25` Lente; `<= 50` Moyenne; `<= 75` Rapide; `> 75` Très rapide | `#64748B` `#14B8A6` `#06B6D4` `#3B82F6` `#8B5CF6` | `area` / min, max |
| `filterLifeLevel` | `filter_life_percentage` | `<= 0` Épuisé; `< 10` Presque épuisé; `< 25` Réserve faible; `< 75` Réserve disponible; `>= 75` Réserve élevée | `#EF4444` `#F97316` `#F59E0B` `#14B8A6` `#22C55E` | `area` / min, max |
| `waterLevel` | `water_level_percentage` | `<= 0` Vide; `< 20` Niveau bas; `< 50` Moins de la moitié; `< 80` Niveau moyen; `>= 80` Niveau haut | `#64748B` `#F59E0B` `#3B82F6` `#06B6D4` `#14B8A6` | `area` / min, max |
| `setDuration` | `homekit_duration_seconds` | `<= 0` 0 s; `<= 60` ≤ 1 min; `<= 300` 1–5 min; `<= 900` 5–15 min; `> 900` > 15 min | `#64748B` `#06B6D4` `#3B82F6` `#14B8A6` `#8B5CF6` | `line` / min, max |
| `remainingDuration` | `valve_remaining_duration_seconds` | `<= 0` 0 s; `<= 60` ≤ 1 min; `<= 300` 1–5 min; `<= 900` 5–15 min; `> 900` > 15 min | `#64748B` `#06B6D4` `#3B82F6` `#14B8A6` `#8B5CF6` | `line` / min, max |
| `batteryLevel` | `battery_level_percentage` | `< 10` Très faible; `< 20` Faible; `< 50` Charge intermédiaire; `< 80` Chargée; `>= 80` Bien chargée | `#EF4444` `#F97316` `#F59E0B` `#84CC16` `#22C55E` | `area` / min, max |
| `volume` | `audio_volume_percentage` | `<= 0` Volume nul; `<= 25` Bas; `<= 50` Moyen; `<= 75` Fort; `> 75` Très fort | `#64748B` `#3B82F6` `#14B8A6` `#8B5CF6` `#EC4899` | `area` / min, max |
| `opticalZoom`, `digitalZoom` | `homekit_zoom_ratio` | `< 1` Sous 1×; `<= 1` 1×; `< 2` 1–< 2×; `< 4` 2–< 4×; `>= 4` ≥ 4× | `#64748B` `#14B8A6` `#3B82F6` `#8B5CF6` `#EC4899` | `line` / min, max |
| `imageRotation` | `camera_image_rotation_degrees` | `<= 0` 0°; `<= 90` 90°; `<= 180` 180°; `<= 270` 270° | `#3B82F6` `#14B8A6` `#8B5CF6` `#EC4899` | `points` / aucune |

## Couleurs des états

Les [60 états documentés](homekit-states.md) conservent leurs codes et libellés.
Les couleurs expriment leur sens : chauffage orange, refroidissement bleu,
lecture média verte, pause ambre, arrêt gris, verrouillage vert et déverrouillage
ambre. Les détections de fumée, fuite, gaz, obstacle, blocage et défaut restent
rouges ; les codes explicitement inconnus restent gris. Une absence de lecture
n’est jamais transformée en code « inconnu » ou en état désactivé.
Les variantes conditionnelles `window_open` et `light_on` gardent aussi leur
palette propre : fenêtre fermée turquoise/ouverte ambre, lumière éteinte grise/
allumée dorée. Leur sélection dépend toujours du service identifié.

## Validation et intégration

`npm run build && npm run validate` vérifie les quatre langues, la conservation
des clés, les références et unités brutes, les profils numériques, les valeurs
avant/sur/après les bornes et l’accessibilité de chaque bande. Les orientations
discrètes et états sont vérifiés par comparaison et par correspondance exacte.
Les bundles autonomes et les configurations intégrées aux séries correspondent
aux modèles et à leurs traductions.

Huit essais dans une copie isolée rejettent une configuration redevenue neutre,
une plage non couverte, une bande inaccessible, la moyenne d’un pic, une
orientation décalée, une traduction manquante, l’inversion des couleurs mired
et une détection de fumée verte.

Ces changements concernent le catalogue. La publication se fait via la CI après
intégration ; la synchronisation des bundles embarqués et des configurations déjà
enregistrées dans l’application suit le [contrat d’intégration](homekit.md).
