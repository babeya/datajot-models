# Instructions

The goal of this repository is to bundle together all models used in the Datajot application.

When modifying models, follow the structure defined in MODELS.MD.

Output bundles are defined in BUNDLES.MD.

Don't add any fields not defined in MODELS.MD.

Go straight to the point and avoid any small talk.

Do not create files that are not necessary.

Don't forget to update translations when needed.

The supported locales are English (`en`), French (`fr`), German (`de`), and Spanish (`es`). Every category, unit, series, and visualization configuration must include a valid translation file for all four locales. When localized content changes or a model is added, update `en.json`, `fr.json`, `de.json`, and `es.json` together.

Try to avoid huge block of code. Always split function into smaller ones when possible.

If you add a comment, add it in english only.
