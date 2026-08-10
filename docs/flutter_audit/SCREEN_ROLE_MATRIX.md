# Screen Role Matrix

This document defines the strict mapping between User Roles and application screens to enforce Role Isolation.

## Shared & Public Routes
| Route | Access |
| --- | --- |
| `/splash` | All (Public) |
| `/onboarding` | All (Public) |
| `/auth/login` | All (Public) |
| `/auth/forgot-password` | All (Public) |
| `/auth/otp` | All (Public) |
| `/auth/reset-password` | All (Public) |
| `/auth/change-password` | All (Authenticated - Restricted State) |
| `/shared/profile` | Supervisor, Driver, Transport Manager |
| `/shared/search` | All Authenticated |
| `/shared/support` | All Authenticated |

## Parent Role (PARENT)
| Route | Screen Name |
| --- | --- |
| `/parent/home` | ParentHomeScreen |
| `/parent/select-student` | SelectStudentScreen |
| `/parent/route-map` | ParentRouteMapScreen |
| `/parent/trip-details` | ParentTripDetailsScreen |
| `/parent/student-details` | StudentDetailsScreen |
| `/parent/trip-history` | StudentTripHistoryScreen |
| `/parent/address-change-request` | AddressChangeRequestScreen |
| `/parent/map-location-picker` | MapLocationPickerScreen |
| `/parent/address-requests-list` | AddressRequestsListScreen |
| `/parent/address-request-details` | AddressRequestDetailsScreen |
| `/parent/absence-request` | AbsenceRequestScreen |
| `/parent/absence-history` | AbsenceHistoryScreen |
| `/parent/notifications` | NotificationsScreen |
| `/parent/profile` | ParentProfileScreen |

## Supervisor Role (SUPERVISOR)
| Route | Screen Name |
| --- | --- |
| `/supervisor/home` | SupervisorHomeScreen |
| `/supervisor/trips` | SupervisorTripsListScreen |
| `/supervisor/trip/active` | SupervisorActiveTripScreen |
| `/supervisor/student-in-trip` | StudentInTripDetailsScreen |
| `/supervisor/school-arrival` | SchoolArrivalScreen |
| `/supervisor/end-trip` | SupervisorEndTripScreen |
| `/supervisor/sync` | SyncLogListScreen |
| `/supervisor/sync-details` | SyncOperationDetailsScreen |

## Driver Role (DRIVER)
| Route | Screen Name |
| --- | --- |
| `/driver/home` | DriverHomeScreen |
| `/driver/trip/active` | DriverActiveTripScreen |
| `/driver/route-details` | DriverRouteDetailsScreen |
| `/driver/reports` | DriverReportsScreen |

## Transport Manager / School Admin (TRANSPORT_MANAGER)
| Route | Screen Name |
| --- | --- |
| `/transport/home` | TransportManagerHomeScreen |
| `/transport/operations` | TransportOperationsCenterScreen |
| `/transport/address-requests` | TransportAddressRequestsScreen |
| `/transport/address-review` | TransportAddressReviewScreen |
| `/transport/alerts` | TransportAlertsScreen |
