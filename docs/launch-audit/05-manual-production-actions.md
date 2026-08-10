# Manual Production Actions

The following manual actions must be executed before or immediately after deploying the system to production.

## BLOCKING MANUAL ACTIONS (Must be done BEFORE Go-Live)
1. **Google Maps API Keys Restrictions:**
   - Go to Google Cloud Console.
   - Restrict the Web Key to the production domains (`*.example.com`).
   - Restrict the Android Key to the production Flutter app package name and SHA-1 certificate.
2. **Environment Secrets Rotation:**
   - Replace the `GOOGLE_MAPS_API_KEY` in the production environment with the newly restricted keys.
   - Generate strong, random `JWT_ACCESS_SECRET` and `JWT_REFRESH_SECRET` (Minimum 32 chars).
3. **Flutter Play Store Signing:**
   - Sign the Android release AppBundle/APK with the production keystore.
4. **Database Configuration:**
   - Configure PostgreSQL with a strong, secure password.
   - Ensure the database is NOT exposed publicly (bind to private IP/VPC).
5. **HTTPS/SSL Verification:**
   - Ensure Coolify or the reverse proxy (Nginx/Traefik) has provisioned valid SSL certificates for all subdomains.

## POST-LAUNCH OPTIONAL ACTIONS
1. **Automated Backups:**
   - Verify that PostgreSQL daily backups are running and offloaded to S3 or an external volume.
2. **First Platform Admin Creation:**
   - Execute the database seed or CLI command to create the initial `PLATFORM_OWNER` account securely, then change the password immediately.
3. **Monitor Error Logs:**
   - Keep an eye on backend logs during the first 24 hours to catch any edge-case exceptions.
