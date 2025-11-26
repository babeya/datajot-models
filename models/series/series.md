# Series templates

## Model

File named model.json

```json
{
  "id": "unique id of the series",
  "type": "series",
  "category": "Allows grouping",
  "unit": "id of the unit if there is one",
  "graphType": "bar | area | line | point",
  "color": "Hex of the color of the series",
  "icon": "Name of the sfSymbol",
  "decimal": "Number of decimal displayed", 
  "stats": {
    "showAverage": true,
    "showMedian": true,
    "showSum": true,
    "showCount": true,
    "showMax": true,
    "showMin": true,
    "showAverageOnChart": false,
    "showMedianOnChart": false,
    "showMaxOnChart": false,
    "showMinOnChart": false,
    "autoScaleYAxis": true,
    "averageColorHex": "#3B82F6",
    "medianColorHex": "#8B5CF6",
    "maxColorHex": "#10B981",
    "minColorHex": "#EF4444",
    "sumColorHex": "#F59E0B",
    "countColorHex": "#6B7280"
  }
}
```

### Stats properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| showAverage | Boolean | true | Whether or not average stat is displayed |
| showMedian | Boolean | true | Whether or not median stat is displayed |
| showSum | Boolean | true | Whether or not sum stat is displayed |
| showCount | Boolean | true | Whether or not count stat is displayed |
| showMax | Boolean | true | Whether or not max stat is displayed |
| showMin | Boolean | true | Whether or not min stat is displayed |
| showAverageOnChart | Boolean | false | Whether or not average mark is displayed on the chart |
| showMedianOnChart | Boolean | false | Whether or not median mark is displayed on the chart |
| showMaxOnChart | Boolean | false | Whether or not max mark is displayed on the chart |
| showMinOnChart | Boolean | false | Whether or not min mark is displayed on the chart |
| autoScaleYAxis | Boolean | true | Whether or not Y axis auto-scales based on data |
| averageColorHex | String | null | Hex color value for average marks |
| medianColorHex | String | null | Hex color value for median marks |
| maxColorHex | String | null | Hex color value for max marks |
| minColorHex | String | null | Hex color value for min marks |
| sumColorHex | String | null | Hex color value for sum display |
| countColorHex | String | null | Hex color value for count display |

## Translation

Files named with the local (en.json, fr.json ...)

```json
{
  "title": "Displayed name of the series",
  "description": "A short description",
  "seo": {
    "keywords": ["keyword1", "keyword2"],
    "image": "URL to the image"
  }
}
```
