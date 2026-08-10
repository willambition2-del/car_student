# 08 - Parent, Driver, and Supervisor Account Report
## Execution
- Mobile App login logic dictates:
  - `DRIVER` -> `/driver/home`
  - `SUPERVISOR` -> `/supervisor/home`
  - `PARENT` -> `/parent/home`
- Unsupported roles attempting to log into the mobile app are met with an error message and cache is cleared.
