#!/usr/bin/env python3
"""Privacy-preserving pg_restore TOC inventory; never emits object identifiers/data.
This does NOT validate complete SQL dependencies or successful restoration.
"""
import argparse
import collections
import re
import subprocess
import sys

ALLOWED = frozenset(("auth", "public", "extensions", "storage", "vault",
                     "realtime", "graphql_public", "supabase_functions",
                     "pgsodium", "net", "cron"))
KINDS = tuple(sorted((
    "MATERIALIZED VIEW DATA", "TABLE DATA", "FK CONSTRAINT", "ROW SECURITY",
    "SCHEMA", "EXTENSION", "TABLE", "TYPE", "FUNCTION", "SEQUENCE",
    "TRIGGER", "INDEX", "VIEW", "CONSTRAINT", "POLICY", "RULE", "DEFAULT",
    "DOMAIN", "MATERIALIZED VIEW", "FOREIGN TABLE", "PROCEDURE", "OPERATOR",
    "COMMENT", "ACL", "DEFAULT ACL", "EVENT TRIGGER",
), key=len, reverse=True))
ENTRY = re.compile(r"^\d+;\s+\d+\s+\d+\s+(.*)$")


def inspect(toc):
    types, declared, used = (collections.Counter() for _ in range(3))
    unparsed = 0
    for raw in toc.splitlines():
        line = raw.strip()
        if not line or line.startswith(";"):
            continue
        match = ENTRY.match(line)
        if not match:
            unparsed += 1
            continue
        rest = match.group(1)
        kind = next((k for k in KINDS if rest.startswith(k + " ")), None)
        if not kind:
            types["OTHER_KIND"] += 1
            continue
        types[kind] += 1
        fields = rest[len(kind):].strip().split()
        if kind == "SCHEMA":
            if len(fields) > 1 and fields[0] == "-":
                value = fields[1].strip('"').lower()
                declared[value if value in ALLOWED else "OTHER_SCHEMA"] += 1
            else:
                declared["UNCLASSIFIED"] += 1
        elif fields:
            value = fields[0].strip('"').lower()
            used[value if value in ALLOWED else "OTHER_OR_NONE"] += 1
    return types, declared, used, unparsed


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("archive", nargs="?")
    parser.add_argument("--toc-file", help="Private pg_restore --list output from isolated PostgreSQL client")
    args = parser.parse_args()
    if args.toc_file:
        with open(args.toc_file, encoding="utf-8", errors="replace") as stream:
            toc = stream.read()
    elif args.archive:
        result = subprocess.run(["pg_restore", "--list", args.archive],
                                capture_output=True, text=True)
        if result.returncode:
            print("::error::Cannot read archive TOC (details suppressed)", file=sys.stderr)
            return 1
        toc = result.stdout
    else:
        parser.error("provide an archive or --toc-file")
    types, declared, used, unparsed = inspect(toc)
    print("PHALANX encrypted-backup TOC inventory (metadata only; NOT restore)")
    print("Classified entries:", sum(types.values()))
    print("Unparsed lines:", unparsed)
    for label, values in (("Object types", types),
                          ("Declared schemas", declared),
                          ("Object namespace usage", used)):
        print(label + ":")
        for key, count in sorted(values.items()):
            print("  {}: {}".format(key, count))
    # TOC namespaces are inventory metadata, NOT a SQL dependency graph.
    # Report counts only; names are restricted to the existing safe allowlist.
    selected = sum(used[name] for name in ("auth", "public"))
    external = sum(count for name, count in used.items()
                   if name not in ("auth", "public", "OTHER_OR_NONE"))
    unknown = used["OTHER_OR_NONE"]
    print("Partial restore scope (TOC namespace entries, not dependency edges):")
    print("  AUTH_OR_PUBLIC:", selected)
    print("  OTHER_ALLOWLISTED_SCHEMAS:", external)
    print("  UNCLASSIFIED_OR_NONE:", unknown)
    print("  OTHER_SCHEMA_DECLARATIONS:", declared["OTHER_SCHEMA"])
    print("  UNCLASSIFIED_OBJECT_KINDS:", types["OTHER_KIND"])
    if external or unknown or declared["OTHER_SCHEMA"] or types["OTHER_KIND"]:
        print("::warning::Partial auth+public archive selection cannot establish full dependency closure")
    if unparsed:
        print("::warning::Incomplete TOC classification")
    return 0


if __name__ == "__main__":
    sys.exit(main())
