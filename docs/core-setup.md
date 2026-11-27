# The core setup of an AgentiCCells-family GitHub organisation

Written by cl-3.infrastructure@AgileCells.dinis, 27 November 2026, for AgileCells, the first organisation set up this way. Dinis Cruz, 27 Nov 2026 ~14:40 UTC, in c.maestro's session (relayed): "yes to the five core repos, go ahead (and document this as part of the core setup of a AgentCells GH organisation)".

## The five core repositories
| Repository | What it is |
|---|---|
| `<Org>__IaC` | the organisation as code: `org/repos.json`, the pipeline, the Agent Behaviour Policy, the signer check, `team/keys.json` as the trust root. From then on it creates everything else in its own organisation. |
| `<Org>__Agent__Infrastructure` | home of the agents that keep `<Org>__IaC` |
| `<Org>__Agent__ABP` | home of the agents that write the Agent Behaviour Policies |
| `<Org>__Agent__Maestro` | home of the maestro agents, which route Dinis's words |
| `<Org>__Agent__Security` | home of the agents that review changes to `<Org>__IaC` and the ABP (separation of duties) |

Agent homes have no website. Each owner and account has its own area, `site/factory/<owner>/<account>/`, and each agent publishes its own key at `site/keys/<name>.json` as its first signed commit. A public site (for AgileCells, `<Org>__Site__Website` on agilecells.org) comes after the core.

## Steps, in order
1. **Dinis:** create the GitHub organisation, and a team for the agents (AgileCells: `agilecells-agentic-team`).
2. **Dinis:** install the factory GitHub App (agenticcells-site-factory, App ID 5777442) on the organisation, all repositories, and the Claude GitHub App.
3. **Dinis:** create one empty public repository, `<Org>__IaC`, default branch `dev`, and give the team write on it. (If it gets another name first, list that name in its entry's `aka` in `org/repos.json`: Org apply renames it.)
4. **Dinis:** in `<Org>__IaC`, Settings, Environments: an environment `apply`, deployment branches `dev` only, with the variable `FACTORY_APP_ID` (5777442) and the secret `FACTORY_APP_PRIVATE_KEY` (the App's private key, pasted only into GitHub).
5. **The infrastructure agent:** a branch on `<Org>__IaC` with the adapted copy of SovereignWebsite__IaC: `org/repos.json` naming the five core repositories (and the website), `policy/abp.json` with its own agent entry, `team/keys.json` with its own key, the seeds (`seed/home-template`, the website's seed) pointing at `<Org>__IaC`'s keys, the checks and Org apply workflows, tests, and this document.
6. **Dinis:** review and merge the branch to `dev`. The push changes `org/` and `policy/`, so Org apply runs: it renames `<Org>__IaC` if needed, creates and seeds the four homes and the website, gives the team push, protects the branches, and sets Pages and the custom domain on the website.
7. **Dinis:** DNS by hand until the organisation has an AWS role: for an apex, A records 185.199.108.153 to .111.153, AAAA 2606:50c0:8000::153 to 8003::153, and `www` as a CNAME to `<org>.github.io` (lower case).
8. **Each agent:** publishes its key in its home by its first commit, then works there.

## What is not yet in AgileCells__IaC (27 Nov 2026)
- The request pipeline (`requests/`): copied but still carries SovereignWebsite's domains and groups; repositories are added in `org/repos.json` until it is adapted.
- DNS apply: no AWS role; records are set by hand.
- The decision records, key-apply, transfer and organisation-status workflows of SovereignWebsite__IaC: left out.
- The home template still links to SovereignWebsite's shared agent sites (factory, maestro, decisions, router) for guidance.
