# RBAC Permission Matrix (01)

This matrix defines the strict operations allowed per role across different resources in the SaaS School Transport platform.

## Roles
1. **PLATFORM_ADMIN**: Super Admin managing the entire SaaS platform.
2. **SCHOOL_ADMIN**: Administrator for a specific tenant (School).
3. **TRANSPORT_MANAGER**: Manager handling daily transport logistics.
4. **ACCOUNTANT**: Financial auditor for school transport fees.
5. **SUPERVISOR**: Escort assigned to specific trips/buses.
6. **DRIVER**: Driver assigned to a specific bus.
7. **PARENT**: Guardian of one or more students.

## Permission Matrix

| Resource | Operation | PLATFORM_ADMIN | SCHOOL_ADMIN | TRANSPORT_MANAGER | ACCOUNTANT | SUPERVISOR | DRIVER | PARENT |
|----------|-----------|----------------|--------------|-------------------|------------|------------|--------|--------|
| **Schools** | LIST | Allow | Deny | Deny | Deny | Deny | Deny | Deny |
| | READ | Allow | Conditional (Own) | Conditional (Own) | Conditional (Own) | Deny | Deny | Deny |
| | CREATE/UPDATE | Allow | Deny | Deny | Deny | Deny | Deny | Deny |
| **Users** | LIST/READ | Allow | Conditional (Own School)| Conditional (Staff only)| Deny | Deny | Deny | Deny |
| | CREATE/UPDATE | Allow | Conditional (Own School)| Deny | Deny | Deny | Deny | Deny |
| **Students**| LIST/READ | Deny | Conditional (Own School)| Conditional (Own School)| Deny | Conditional (Assigned Trip) | Conditional (Assigned Trip) | Conditional (Own Child) |
| | CREATE/UPDATE | Deny | Conditional (Own School)| Conditional (Own School)| Deny | Deny | Deny | Deny |
| **Buses** | LIST/READ | Deny | Conditional (Own School)| Conditional (Own School)| Deny | Conditional (Assigned Bus) | Conditional (Assigned Bus) | Conditional (Child's Bus) |
| | CREATE/UPDATE | Deny | Conditional (Own School)| Conditional (Own School)| Deny | Deny | Deny | Deny |
| **Trips** | LIST/READ | Deny | Conditional (Own School)| Conditional (Own School)| Deny | Conditional (Assigned Trip) | Conditional (Assigned Trip) | Conditional (Child's Trip)|
| | START/COMPLETE| Deny | Deny | Deny | Deny | Conditional (Assigned Trip) | Conditional (Assigned Trip) | Deny |
| | TRACK (GPS) | Deny | Conditional (Own School)| Conditional (Own School)| Deny | Conditional (Assigned Trip) | Conditional (Assigned Trip) | Conditional (Child's Trip)|
| **Fees** | LIST/READ | Deny | Conditional (Own School)| Deny | Conditional (Own School)| Deny | Deny | Conditional (Own Child) |
| | RECORD PAYMENT| Deny | Conditional (Own School)| Deny | Conditional (Own School)| Deny | Deny | Deny |

### Conditions Explanation
- **Conditional (Own School)**: Allowed only if `entity.schoolId == user.schoolId`.
- **Conditional (Own Child)**: Allowed only if `StudentGuardian.guardianId == user.id`.
- **Conditional (Assigned Trip)**: Allowed only if `Trip.supervisorId == user.id` or `Trip.driverId == user.id`.
- **Conditional (Assigned Bus)**: Allowed only if `Bus.supervisorId == user.id` or `Bus.driverId == user.id`.
- **Conditional (Child's Bus/Trip)**: Allowed only if the parent's child is assigned to the specific Bus/Trip via `TripStudent`.
