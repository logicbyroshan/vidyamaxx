# Low-Level Design (LLD) — School Operational Domains (`modules.certificates`, `modules.documents`, `modules.inventory`, `modules.events`, `modules.library`, `modules.transport`, `modules.hostel`)

## 1. Covered Work Divisions
- **#12 Documents & Certificates** (`documents_certificates`) — `CertificateTemplate`, `IssuedCertificate`, `StudentComplianceDocument`.
- **#13 Library** (`library`) — `LibraryBookSummary` & `LibraryCirculationRecord` (integration contract with `Library-VidyaFloww`).
- **#14 Transport** (`transport`) — `TransportRouteRecord` & `StudentTransportAssignment` (integration contract with `Transport-VidyaFloww`).
- **#15 Hostel** (`hostel`) — `HostelRoomRecord` & `StudentHostelAssignment` (integration contract with `Hostel-VidyaFloww`).
- **#16 Inventory** (`inventory`) & **#17 Assets & Maintenance** (`assets_maintenance`) — `InventoryStockItem`, `FixedAsset`, `AssetMaintenanceTicket`.
- **#22 Events & Calendar** (`events_calendar`), **#23 Student Activities** (`student_activities`), & **#26 Front Office** (`front_office`) — `SchoolEvent`, `StudentActivityRecord`, `VisitorGatePass`.

## 2. API Endpoints (`/api/v1/operations/`)
- `GET / POST /api/v1/operations/certificates/templates/` & `/api/v1/operations/certificates/issued/`
- `GET / POST /api/v1/operations/documents/`
- `GET / POST /api/v1/operations/library/books/`
- `GET / POST /api/v1/operations/transport/routes/`
- `GET / POST /api/v1/operations/hostel/allocations/`
- `GET / POST /api/v1/operations/inventory/items/`
- `GET / POST /api/v1/operations/assets/`
- `GET / POST /api/v1/operations/events/`
- `GET / POST /api/v1/operations/activities/`
- `GET / POST /api/v1/operations/front-office/visitors/`
