# RBAC and Provisioning Matrix

| Role | Scope | Provisioning Rights | Data Access |
|---|---|---|---|
| PLATFORM_OWNER/ADMIN | Global | Can create Schools & School Admins | Subscriptions, Billing, System Settings. No direct access to operational school data without support scope. |
| SCHOOL_ADMIN | Tenant-Bound | Can create Drivers, Supervisors, Parents, Transport Managers | Full operational access within their specific `schoolId`. |
| TRANSPORT_MANAGER | Tenant-Bound | None (or restricted) | Routes, Buses, Trips. |
| ACCOUNTANT | Tenant-Bound | None | Transport Fees, Payments, Invoices. |
| DRIVER | Mobile / Trip-Bound | None | Assigned Trips and Route maps. |
| SUPERVISOR | Mobile / Trip-Bound | None | Assigned Trips and Students on board. |
| PARENT | Mobile / Student-Bound| None | Linked Children only. |
