#!/usr/bin/env python3
"""Simple helper to verify series coverage against the planning file."""

import json
import os
import sys
from typing import List

ROOT_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
PLAN_PATH = os.path.join(ROOT_DIR, "planning", "series-expansion.json")
SERIES_ROOT = os.path.join(ROOT_DIR, "models", "series")
SERIES_SKIP = {"series.md"}


def _load_plan() -> dict:
    with open(PLAN_PATH, "r", encoding="utf-8") as handle:
        return json.load(handle)


def _existing_series_keys() -> List[str]:
    results: List[str] = []
    for name in sorted(os.listdir(SERIES_ROOT)):
        if name in SERIES_SKIP:
            continue
        path = os.path.join(SERIES_ROOT, name)
        if os.path.isdir(path):
            results.append(name)
    return results


def main() -> int:
    plan = _load_plan()
    planned_keys = [entry["key"] for entry in plan.get("newSeries", [])]
    missing = []
    for key in planned_keys:
        series_dir = os.path.join(SERIES_ROOT, key)
        if not os.path.isdir(series_dir):
            missing.append(key)
            continue
        if not os.path.isfile(os.path.join(series_dir, "model.json")):
            missing.append(key)
    existing_total = plan.get("existingSeriesCount", 0)
    expected_total = existing_total + len(planned_keys)
    actual_total = len(_existing_series_keys())

    print(f"Expected total series: {expected_total}")
    print(f"Actual total series:   {actual_total}")

    status = 0
    if missing:
        status = 1
        print("Missing planned series directories:")
        for key in missing:
            print(f" - {key}")
    if actual_total != expected_total:
        status = 1
        print("Series count mismatch between plan and filesystem.")
    if status == 0:
        print("Series plan check passed.")
    return status


if __name__ == "__main__":
    sys.exit(main())
