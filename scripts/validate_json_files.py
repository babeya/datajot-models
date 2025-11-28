#!/usr/bin/env python3
"""Parse every JSON file in the repo to catch syntax errors early."""

import json
import os
import sys
from typing import List, Tuple

ROOT_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
IGNORE_DIRS = {".git", "node_modules", "__pycache__"}


def _find_json_files() -> List[str]:
    json_files: List[str] = []
    for dirpath, dirnames, filenames in os.walk(ROOT_DIR):
        dirnames[:] = [name for name in dirnames if name not in IGNORE_DIRS]
        for filename in filenames:
            if filename.endswith(".json"):
                json_files.append(os.path.join(dirpath, filename))
    return json_files


def _validate_files(paths: List[str]) -> List[Tuple[str, str]]:
    errors: List[Tuple[str, str]] = []
    for path in paths:
        try:
            with open(path, "r", encoding="utf-8") as handle:
                json.load(handle)
        except Exception as exc:  # pylint: disable=broad-except
            errors.append((path, str(exc)))
    return errors


def main() -> int:
    targets = _find_json_files()
    errors = _validate_files(targets)
    if errors:
        print(f"JSON validation failed for {len(errors)} file(s):")
        for path, message in errors:
            print(f" - {path}: {message}")
        return 1
    print(f"Validated {len(targets)} JSON file(s) successfully.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
