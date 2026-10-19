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



def mask_noncode(sql):
    """Mask comments, quoted literals and dollar-quoted bodies, preserving spaces."""
    out = list(sql)
    i = 0
    n = len(sql)
    while i < n:
        start = i
        if sql.startswith("--", i):
            end = sql.find("\n", i)
            i = n if end < 0 else end
        elif sql.startswith("/*", i):
            depth = 1
            i += 2
            while i < n and depth:
                if sql.startswith("/*", i):
                    depth += 1
                    i += 2
                elif sql.startswith("*/", i):
                    depth -= 1
                    i += 2
                else:
                    i += 1
        elif sql[i] == "'":
            i += 1
            while i < n:
                if sql[i] == "'" and i + 1 < n and sql[i + 1] == "'":
                    i += 2
                elif sql[i] == "'":
                    i += 1
                    break
                else:
                    i += 1
        elif sql[i] == "$":
            m = re.match(r"\$[A-Za-z_0-9]*\$", sql[i:])
            if not m:
                i += 1
                continue
            token = m.group()
            close = sql.find(token, i + len(token))
            i = n if close < 0 else close + len(token)
        else:
            i += 1
            continue
        for j in range(start, i):
            if out[j] != "\n":
                out[j] = " "
    return "".join(out)


def summarize(sql):
    counts = collections.Counter()
    for match in QUALIFIED.finditer(mask_noncode(sql)):
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
    print("Caution: comments, literals and dollar-quoted function bodies are masked; this is not a dependency graph.")
    for name, count in sorted(summarize(sql).items()):
        print(f"{name}: {count}")
    print("No SQL statements or identifiers emitted; no restore performed.")


if __name__ == "__main__":
    main()
