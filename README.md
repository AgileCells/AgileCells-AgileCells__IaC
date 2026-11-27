# AgileCells__IaC

The AgileCells organisation as code. `org/repos.json` lists its repositories; on every push to `dev` that changes `org/` or `policy/` (and every sixth hour, and by hand), the Org apply workflow plans against the live organisation, checks the plan against the Agent Behaviour Policy (`policy/abp.json`) and applies it with the factory GitHub App: it creates, seeds, shares and protects repositories, and sets Pages and custom domains. It never deletes, transfers, archives or makes a repository private.

- Trust root: `team/keys.json`. Every commit is signed by a key listed there (`build/check-signatures.mjs`).
- How the organisation was set up, and how to set up the next one: `docs/core-setup.md`.
- What exists now: `REALITY.md`.

Adapted from SovereignWebsite__IaC on 27 November 2026. Licence: Apache-2.0.
