# Git Workflow
# AI Free Tools Ecosystem

Version: 1.0.0

---

## 1. Branch Strategy

```
main                  → production (protected, no direct push)
  └── develop         → integration branch
        └── feature/  → feature branches
        └── fix/      → bug fix branches
        └── chore/    → maintenance branches
```

---

## 2. Branch Naming

```
feature/tool-engine-base
feature/nda-generator
feature/seo-programmatic-engine
feature/export-pdf
fix/generation-timeout
chore/update-dependencies
docs/api-documentation
```

---

## 3. Commit Convention (Conventional Commits)

```
feat: add NDA generator tool config
fix: resolve PDF export timeout on large documents
chore: update BullMQ to v5
docs: add API documentation
test: add NDA generation integration tests
refactor: extract prompt builder to shared service
perf: add Redis caching for tool metadata
ci: add Lighthouse CI to PR pipeline
```

---

## 4. PR Rules

- Every PR must: lint pass, typecheck pass, tests pass
- Every PR must have description (what + why)
- No direct push to `main` or `develop`
- Squash merge to keep history clean

---

## 5. Per-Module Push Checklist

After each module is complete:
- [ ] `npm run lint` — passes
- [ ] `npm run typecheck` — passes
- [ ] `npm run test` — passes (80%+ coverage)
- [ ] `npm run build` — passes
- [ ] Documentation updated
- [ ] Commit + push to feature branch
- [ ] PR created → merge to develop

Do NOT wait for all 65 tools before pushing. Push per module.

---

## 6. Release Strategy

```
develop → staging (auto-deploy on merge)
staging → main (manual trigger after QA)
main → production (auto-deploy via CI/CD)
```

Tags: `v1.0.0`, `v1.1.0` (semantic versioning)
