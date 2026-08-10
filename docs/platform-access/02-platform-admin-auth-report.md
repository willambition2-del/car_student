# 02 - Platform Admin Auth Report
## Execution
- Middleware (`middleware.ts`) configured to protect all `/(dashboard)/*` routes.
- Redirects unauthenticated users to `/login`.
- Login intercepts the `mustChangePassword` flag and routes to `/force-change-password` if true.
- Platform owners can only access this app; school admins are blocked.
