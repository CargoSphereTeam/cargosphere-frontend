# CargoSphere Cargo and Document Frontend Handoff

## Implemented against current backend contract

### Document verification
- Uses the centralized `httpClient` and API Gateway path `/api/documents`.
- Loads documents with `GET /api/documents/shipment/{shipmentId}`.
- Updates verification with `PUT /api/documents/{id}/verification`.
- Sends only the actual request fields:
  - `verificationStatus`
  - `remarks`
- Supports only backend enum values:
  - `PENDING`
  - `VERIFIED`
  - `REJECTED`
- Does not send `verifiedBy`; the backend derives it from the JWT `userId` claim.
- Displays required/optional, status, verified user, verified time and remarks.

### Cargo display
- Loads original cargo with `GET /api/shipments/{shipmentId}/cargo-details`.
- Displays original cargo values read-only.

## Exported components

```js
import {
  DocumentVerificationStep,
  ClientDocumentChecklist,
  DocumentReadinessPanel,
} from './features/documents/index.js';

import {
  CargoVerificationStep,
} from './features/cargo-verification/index.js';
```

### Props

```jsx
<DocumentVerificationStep
  shipmentId={shipmentId}
  onCompleted={(updatedDocument) => refreshProcessingSummary(updatedDocument)}
/>

<CargoVerificationStep shipmentId={shipmentId} />

<ClientDocumentChecklist
  documents={documents}
  loading={loading}
  error={error}
/>
```

## Backend gaps blocking the remaining TL requirements

1. No cargo-verification controller or DTO exists.
2. No cargo save-draft or confirm endpoint exists.
3. No separate admin-confirmed cargo persistence model exists.
4. No document-readiness endpoint or DTO exists.
5. No blocking-document response exists.
6. `GET /api/documents/shipment/{shipmentId}` is ADMIN-only, so a ROLE_CLIENT
   cannot directly load its checklist. The read-only client component therefore
   receives `documents` from its parent until a client-authorized endpoint exists.
7. Backend document statuses are only `PENDING`, `VERIFIED`, and `REJECTED`.
   `SUBMITTED` and `NOT_APPLICABLE` are not accepted.

## Shared infrastructure dependency

The central `httpClient` currently has the correct Gateway base URL but does not
show a JWT interceptor in this branch. Ajay must ensure authenticated requests add:

```text
Authorization: Bearer <token>
```

## Test setup gap

The current `package.json` has no `test` script and no Vitest/React Testing
Library dependencies. Package files are owned by the integration owner, so test
setup must be added centrally before component tests can run.
