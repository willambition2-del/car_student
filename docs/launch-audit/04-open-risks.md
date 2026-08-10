# Open Risks

## 1. Secrets Management
- **Severity:** HIGH
- **Impact:** Hardcoded Google Maps API Keys were found in `.env` and `.env.local` files. While these files are `.gitignore`d, if they were used in the production environment without rotation or restriction, they could be abused. 
- **Workaround/Mitigation:** The keys are isolated to environment files, meaning the actual source control is clean.
- **Required Action:** Rotate the exposed Google Maps API keys and inject them via CI/CD variables (e.g., Coolify environment variables or GitHub Secrets).
- **Blocks Launch?** YES (Keys must be restricted or rotated prior to public release).

## 2. Git Repository Uninitialized
- **Severity:** LOW
- **Impact:** The root folder `D:\school-transport-saas` is not currently tracked by git in the context of this server/runner, meaning diffs and version history are not available for review in the audit. 
- **Workaround/Mitigation:** Assuming the CI/CD pipeline clones the repository correctly.
- **Required Action:** Ensure proper source control is configured and used for deployments.
- **Blocks Launch?** NO.

## 3. Database Initialization (Seeding)
- **Severity:** MEDIUM
- **Impact:** The system requires an initial `PLATFORM_OWNER` to operate. If there's no secure bootstrap command, someone might use an insecure default seed.
- **Required Action:** Document the secure process for creating the first Platform Admin in production (e.g., a secure CLI command or one-time registration link).
- **Blocks Launch?** NO (Can be done manually post-deployment).
