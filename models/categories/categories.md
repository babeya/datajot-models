# Categories

This directory contains category definitions used across the application.

Categories are referenced by series and units models via their `category` field.

## Structure

Each category folder contains:
- `model.json`: The base category model with the id
- `en.json`: English translations (name)
- `fr.json`: French translations (name)
- `de.json`: German translations (name)

Categories are not bundled separately but are injected into series and units models during the build process.
