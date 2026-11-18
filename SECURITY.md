# Security policy

## Supported versions

Only the latest commit on `main` receives fixes. There are no versioned
releases.

## Reporting a vulnerability

Report suspected vulnerabilities privately through this repository's
**Security** tab: **Report a vulnerability**. Do not open a public issue,
pull request, or discussion for a suspected vulnerability.

Include:

- the affected file, route, or dependency
- steps to reproduce, with the commit SHA you tested
- the impact you observed

This is a personal learning project maintained on a best-effort basis. Reports
are acknowledged when they are read, and confirmed issues are fixed in a new
commit on `main`.

## Scope

In scope: the application source, the Dockerfile, the Compose file, and the
GitHub Actions workflow in this repository.

Out of scope: third-party services and sites linked from the pages,
vulnerabilities that exist only in an unmodified upstream dependency (report
those upstream), and deployments that change the provided configuration.

The current dependency audit and container scan results are recorded in the
Security section of `README.md`.
