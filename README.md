# LDAP filter analyzer
This project is a simple tool for easily visualizing large LDAP filters.
Hovering parts of the analyzed result highlights where they were extracted from.

[See it live here.](https://piellardj.github.io/ldap-filter-analyzer)

## Description

The input string is analyzed by a scannerless parser: it performs lexing and parsing at once.
It uses a factory pattern for building nodes in memory as it scans the input.

