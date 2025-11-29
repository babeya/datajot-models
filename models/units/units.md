# Units templates

## Model

File named model.json

```json
{
  "id": "unique id of the unit",
  "type": "unit",
  "category": "Allows grouping",
  "baseUnit": "The base units",
  "subUnits": [{
    "id": "unique id of the subunit",
    "symbol": "unit displayed",
    "toBase": "factor"
  }]
}
```

## Translation

Files named with the local (en.json, fr.json ...)

```json
{
  "title": "Displayed name of the unit",
  "description": "A short description",
  "subUnits": {
    "[subUnit.id]": { "title": "Displayed name of the subunit", "abbreviation": "translated abrevation" },
  }
}
```
