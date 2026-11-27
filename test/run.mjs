// Tests for AgileCells__IaC: the policy, the organisation plan and the keys. node test/run.mjs
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { validate, checkActions, load, keysChange } from '../build/abp.mjs';
import { plan, seedFiles } from '../build/org-plan.mjs';

const p = load();
assert.deepEqual(validate(p), [], 'policy validates');
assert.ok(validate({ ...p, agents: { 'x@Y.z': { may_change: ['**'], branches: ['main'] } } }).some((e) => e.includes('main')), 'main refused');
for (const bad of ['repo.delete', 'repo.transfer', 'repo.archive', 'team.grant_admin', 'repo.change_visibility'])
  assert.equal(checkActions(p, { pipeline: 'org-apply', actions: [{ action: bad, target: 'X' }] }).length, 1, `${bad} refused`);

const org = JSON.parse(readFileSync('org/repos.json', 'utf8'));
assert.equal(org.org, 'AgileCells');
const names = org.repos.map((r) => r.name);
for (const n of ['AgileCells__IaC', 'AgileCells__Agent__Infrastructure', 'AgileCells__Agent__ABP', 'AgileCells__Agent__Maestro', 'AgileCells__Agent__Security', 'AgileCells__Site__Website'])
  assert.ok(names.includes(n), `the core lists ${n}`);
assert.equal(new Set(names).size, names.length, 'no repository listed twice');

// A fresh organisation: everything is created, in an order the policy allows.
const fresh = plan(org, {});
assert.deepEqual(checkActions(p, fresh), [], 'a fresh plan is allowed');
const of = (n) => fresh.actions.filter((a) => a.target === n).map((a) => a.action);
for (const n of names.filter((x) => x !== 'AgileCells__IaC')) {
  assert.ok(of(n).includes('repo.create') && of(n).includes('repo.seed') && of(n).includes('team.grant_push') && of(n).includes('repo.protect_branches'), `${n} is created, seeded, shared with the team and protected`);
}
for (const n of names.filter((x) => x.startsWith('AgileCells__Agent__'))) assert.ok(!of(n).includes('pages.enable'), `${n} is a home without Pages`);
const site = of('AgileCells__Site__Website');
assert.ok(site.indexOf('pages.enable') < site.indexOf('repo.seed') && site.indexOf('pages.set_cname') < site.indexOf('repo.seed'), 'Pages and the domain before the seed');
assert.equal(readFileSync('seed/AgileCells__Site__Website/site/CNAME', 'utf8').trim(), 'agilecells.org');
for (const must of ['.github/workflows/pages.yml', '.github/ci/signers.mjs', 'site/CNAME', 'site/index.html']) assert.ok(seedFiles('seed/AgileCells__Site__Website').includes(must), `the website seeds ${must}`);
for (const must of ['.github/ci/signers.mjs', '.github/workflows/signers.yml', 'CLAUDE.md', 'START.md']) assert.ok(seedFiles('seed/home-template').includes(must), `a home seeds ${must}`);

// The IaC repository Dinis made by hand is renamed from its first name, never created again.
const live = { 'AgileCells-AgileCells__IaC': { ...org.defaults, description: org.repos[0].description, default_branch: 'dev', has_dev: true, teams: { 'agilecells-agentic-team': 'push' }, protected: true } };
const rn = plan({ ...org, repos: [org.repos[0]] }, live);
assert.deepEqual(rn.actions, [{ action: 'repo.rename', target: 'AgileCells-AgileCells__IaC', to: 'AgileCells__IaC' }], 'renamed, never recreated');
assert.deepEqual(checkActions(p, rn), [], 'the rename is allowed');

// Seeds point at this organisation's keys, not SovereignWebsite's.
for (const f of ['seed/home-template/.github/ci/signers.mjs', 'seed/AgileCells__Site__Website/.github/ci/signers.mjs']) {
  const t = readFileSync(f, 'utf8');
  assert.ok(t.includes('raw.githubusercontent.com/AgileCells/AgileCells__IaC/dev/team/keys.json'), `${f} reads AgileCells__IaC's keys`);
  assert.ok(!t.includes('SovereignWebsite__IaC'), `${f} does not read SovereignWebsite's keys`);
}

// Keys: one live key per agent, and every agent in the policy has one.
const keys = JSON.parse(readFileSync('team/keys.json', 'utf8')).keys;
const active = keys.filter((k) => k.status === 'active');
assert.equal(new Set(active.map((k) => k.agent)).size, active.length, 'one live key per agent');
for (const a of Object.keys(p.agents)) assert.ok(active.some((k) => k.agent === a), `${a} has a live key`);
assert.equal(typeof keysChange, 'function');
assert.ok(existsSync('docs/core-setup.md'), 'the core setup is documented');
console.log('OK (AgileCells__IaC)');
