#!/usr/bin/env python3
"""Conservative privacy-preserving SQL namespace *reference* preflight.

Reads schema-only SQL locally; prints only fixed category labels and counts.
Not a full SQL parser or proof of restore dependency closure.
"""
import argparse
import collections
from pathlib import Path
import re

ALLOW = frozenset(("auth", "public", "extensions", "storage", "vault",
                   "realtime", "graphql_public", "supabase_functions",
                   "pgsodium", "net", "cron"))
# Identifiers following common schema qualification: quoted or plain tokens.
QUALIFIED = re.compile(
    r'(?<![A-Za-z_0-9])(?:"([A-Za-z_][A-Za-z_0-9]*)"|([A-Za-z_][A-Za-z_0-9]*))'
    r'\s*\.\s*(?:"[A-Za-z_][A-Za-z_0-9]*"|[A-Za-z_][A-Za-z_0-9]*)'
)


def summarize(sql):
    counts = collections.Counter()
    for match in QUALIFIED.finditer(sql):
        schema = (match.group(1) or match.group(2)).lower()
        category = schema.upper() if schema in ALLOW else "OTHER_OR_UNKNOWN"
        counts[category] += 1
    return counts


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--schema-sql", required=True)
    args = parser.parse_args()
    sql = Path(args.schema_sql).read_text(encoding="utf-8", errors="replace")
    print("PHALANX schema-only SQL lexical reference inventory (NOT dependency graph)")
    print("Caution: counts include references in comments, literals and function bodies.")
    for name, count in sorted(summarize(sql).items()):
        print(f"{name}: {count}")
    print("No SQL statements or identifiers emitted; no restore performed.")


if __name__ == "__main__":
    main()
