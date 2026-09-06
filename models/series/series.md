# Series templates

## Model

File named model.json

```json
{
  "id": "unique id of the series",
  "type": "series",
  "category": "Allows grouping",
  "unit": "id of the unit if there is one",
  "svc": "id of the SVC if there is one",
  "graphType": "bar | area | line | point",
  "color": "Hex of the color of the series",
  "icon": "Name of the sfSymbol",
  "decimal": "Number of decimal displayed"
}
```

## Translation

Files named with the supported locale (`en.json`, `fr.json`, `de.json`, or `es.json`)

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
