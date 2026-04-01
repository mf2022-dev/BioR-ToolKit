# Deployment Safety Guide

## The Golden Rule

| Directory | Deploys to | Cloudflare Project | Live Domain |
|---|---|---|---|
| `/home/user/webapp` | **tabletap** only | `tabletap-axb` | tabletap-axb.pages.dev |
| `/home/user/bior-toolkit` | **bior** only | `bior-709` | bior.tech |

**NEVER cross-deploy.** Deploying the wrong project overwrites the entire site.

---

## What Happened (the incident)

Running `wrangler pages deploy dist --project-name bior` from `/home/user/webapp` uploaded the TableTap dist folder to the bior Cloudflare Pages project, which **completely replaced bior.tech** with the TableTap exercise cards. The bior.tech sign-in page, hub, knowledge base, and all platform features were wiped.

---

## 3 Layers of Protection

### Layer 1 -- `wrangler.jsonc` Lock

Each project's `wrangler.jsonc` has a hardcoded `"name"` field with a warning banner:

```jsonc
// webapp/wrangler.jsonc
"name": "tabletap"   // DEPLOYMENT LOCK -- DO NOT CHANGE

// bior-toolkit/wrangler.jsonc
"name": "bior"       // DEPLOYMENT LOCK -- DO NOT CHANGE
```

If you run `wrangler pages deploy dist` **without** `--project-name`, wrangler reads the name from this file, so it always targets the correct project.

### Layer 2 -- `package.json` Safe Scripts

Each project has locked deploy scripts and a **blocker** for the other project:

**webapp/package.json:**
```json
"deploy":              "bash deploy-guard.sh tabletap && npm run build && wrangler pages deploy dist --project-name tabletap",
"deploy:tabletap":     "bash deploy-guard.sh tabletap && npm run build && wrangler pages deploy dist --project-name tabletap",
"deploy:BIOR_BLOCKED": "echo '!! BLOCKED !!' && exit 1"
```

**bior-toolkit/package.json:**
```json
"deploy":                 "bash deploy-guard.sh bior && npm run build && wrangler pages deploy dist --project-name bior",
"deploy:bior":            "bash deploy-guard.sh bior && npm run build && wrangler pages deploy dist --project-name bior",
"deploy:TABLETAP_BLOCKED": "echo '!! BLOCKED !!' && exit 1"
```

### Layer 3 -- `deploy-guard.sh` Runtime Check

Both projects contain `deploy-guard.sh` which runs **before** any deploy and:

1. Checks the current working directory
2. Validates the target project name matches the directory
3. **Exits with code 1** (blocking the deploy) if there's a mismatch

```
webapp/         + tabletap  = SAFE
webapp/         + bior      = BLOCKED
bior-toolkit/   + bior      = SAFE
bior-toolkit/   + tabletap  = BLOCKED
```

---

## Safe Deploy Commands

### Deploy TableTap
```bash
cd /home/user/webapp
npm run deploy          # or: npm run deploy:tabletap
```

### Deploy BioR
```bash
cd /home/user/bior-toolkit
npm run deploy          # or: npm run deploy:bior
```

### Manual wrangler deploy (with guard)
```bash
# TableTap
cd /home/user/webapp
bash deploy-guard.sh tabletap && npm run build && npx wrangler pages deploy dist --project-name tabletap

# BioR
cd /home/user/bior-toolkit
bash deploy-guard.sh bior && npm run build && npx wrangler pages deploy dist --project-name bior
```

---

## Recovery Procedure (if it happens again)

If a cross-deploy accident occurs:

1. **Identify which project was overwritten** (check the live site)
2. **Go to the correct source directory**
3. **Rebuild and redeploy from the correct project:**

```bash
# Restore bior.tech
cd /home/user/bior-toolkit
npm run build
npx wrangler pages deploy dist --project-name bior

# Restore TableTap
cd /home/user/webapp
npm run build
npx wrangler pages deploy dist --project-name tabletap
```

4. **Verify** both sites are showing the correct content.

---

## Checklist Before Deploying

- [ ] Am I in the correct directory? (`pwd`)
- [ ] Does `wrangler.jsonc` "name" match my target?
- [ ] Am I using `npm run deploy` (which includes the guard)?
- [ ] Did the guard script print "SAFE TO DEPLOY"?
