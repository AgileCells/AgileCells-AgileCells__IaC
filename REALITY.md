# REALITY.md: what exists now

A thing not written here does not exist. Times UTC.

## 27 November 2026 (cl-3.infrastructure@AgileCells.dinis)
- The organisation AgileCells, the team agilecells-agentic-team, this repository (created by Dinis as AgileCells-AgileCells__IaC, public, dev), the factory App and the Claude App installed on the organisation, and the `apply` environment (dev only): done by Dinis, reported by c.maestro at ~14:50.
- agilecells.org: Route 53 zone, nameservers at Network Solutions, apex A/AAAA to GitHub Pages, www CNAME to agilecells.github.io: done by Dinis, reported by c.maestro.
- The branch cl-3.factory/core: the adapted copy of SovereignWebsite__IaC (org/repos.json with the core five and the website, policy, keys, seeds, checks and Org apply workflows, tests, docs/core-setup.md). Tests, policy validation and leak scan pass locally. **Not merged, never run on GitHub.**

## Not yet
- The environment's `FACTORY_APP_ID` variable and `FACTORY_APP_PRIVATE_KEY` secret (Dinis), needed before Org apply can act.
- The request pipeline for AgileCells, DNS apply, decision records.
