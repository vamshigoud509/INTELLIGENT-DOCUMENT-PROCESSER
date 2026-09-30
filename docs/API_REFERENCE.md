# DocuSphere IDP — REST API Specification

Base URL: `http://localhost:5000/api`

All protected endpoints require the HTTP Header:
`Authorization: Bearer <JWT_TOKEN>`

---

## 1. Authentication Endpoints

### `POST /api/auth/register`
Create a new user account.
- **Request Body (JSON)**:
  ```json
  {
    "email": "analyst@enterprise.com",
    "password": "SecurePassword123!",
    "name": "Alex Mercer",
    "organization": "FinHealth Global"
  }
  ```
- **Response (201 Created)**:
  ```json
  {
    "success": true,
    "user": { "id": "uuid", "email": "...", "name": "...", "organization": "..." },
    "token": "eyJhbGciOi..."
  }
  ```

### `POST /api/auth/login`
Authenticate existing user.
- **Request Body (JSON)**:
  ```json
  {
    "email": "demo@docusphere.io",
    "password": "password123"
  }
  ```
- **Response (200 OK)**:
  ```json
  {
    "success": true,
    "user": { "id": "uuid", "email": "...", "name": "...", "organization": "..." },
    "token": "eyJhbGciOi..."
  }
  ```

### `GET /api/auth/me` (Protected)
Fetch current user profile from token.
- **Response (200 OK)**:
  ```json
  {
    "success": true,
    "user": { "id": "uuid", "email": "...", "name": "...", "organization": "..." }
  }
  ```

---

## 2. Document Ingestion & Pipeline Endpoints

### `POST /api/documents/upload` (Protected)
Upload a document (PDF, PNG, JPG) for automatic Gemini IDP ingestion.
- **Form Data (multipart/form-data)**:
  - `file`: File binary (max 20MB)
  - `domain`: Optional ("FINANCIAL", "HEALTHCARE", or auto-detect "AUTO")
- **Response (202 Accepted)**:
  ```json
  {
    "success": true,
    "document": {
      "id": "uuid",
      "filename": "invoice_acme_corp.pdf",
      "status": "PROCESSING",
      "mimeType": "application/pdf"
    }
  }
  ```

### `POST /api/documents/load-sample` (Protected)
Instantly loads a pre-annotated sample document (Invoice, Medical Claim, or Contract) for immediate demo walkthroughs without requiring local file uploads.
- **Request Body**: `{ "sampleType": "invoice" | "medical_claim" | "contract" }`
- **Response (201 Created)**: Complete document record with extractions and anomalies.

### `GET /api/documents` (Protected)
List all uploaded documents for the user with search and filtering.
- **Query Parameters**:
  - `search`: string filter on filename or metadata
  - `domain`: `FINANCIAL` | `HEALTHCARE` | `LEGAL`
  - `category`: `INVOICE` | `RECEIPT` | `MEDICAL_CLAIM` | `CONTRACT`
  - `status`: `PENDING` | `PROCESSING` | `COMPLETED` | `FAILED`
- **Response (200 OK)**:
  ```json
  {
    "success": true,
    "count": 12,
    "documents": [...]
  }
  ```

### `GET /api/documents/:id` (Protected)
Retrieve full document details, structured entity extractions, audit anomalies, and past chat queries.
- **Response (200 OK)**:
  ```json
  {
    "success": true,
    "document": { ... },
    "extraction": {
      "parties": { "sender": "Apex Global Solutions", "recipient": "OmniCorp LLC" },
      "metadata": { "documentNumber": "INV-2025-901", "issueDate": "2025-03-12" },
      "financials": { "subtotal": 12500.00, "taxAmount": 1000.00, "totalAmount": 13500.00, "currency": "USD" },
      "lineItems": [
        { "description": "Cloud Architecture Review", "quantity": 40, "unitPrice": 250, "total": 10000 },
        { "description": "Security Penetration Audit", "quantity": 10, "unitPrice": 250, "total": 2500 }
      ],
      "domainSpecific": { "paymentTerms": "Net 30" },
      "summary": "Standard enterprise consulting invoice for cloud migration services."
    },
    "anomalies": [
      {
        "id": "...",
        "severity": "HIGH",
        "category": "ARITHMETIC_ERROR",
        "title": "Subtotal mismatch detected",
        "description": "Sum of line items ($12,500.00) differs from stated subtotal ($12,300.00).",
        "suggestedAction": "Request revised invoice before approval."
      }
    ],
    "chatHistory": [...]
  }
  ```

### `DELETE /api/documents/:id` (Protected)
Delete a document and its associated data.

### `GET /api/documents/:id/export` (Protected)
Download parsed document data in machine-readable format.
- **Query Parameter**: `format=json` or `format=csv`
- **Response**: File download (`Content-Disposition: attachment; filename=...`)

---

## 3. Conversational AI / Q&A

### `POST /api/documents/:id/chat` (Protected)
Ask any contextual question about the document to Gemini AI.
- **Request Body (JSON)**:
  ```json
  {
    "message": "What is the warranty period stated in section 4.2?"
  }
  ```
- **Response (200 OK)**:
  ```json
  {
    "success": true,
    "reply": "According to Section 4.2 (Warranty and Support), the vendor provides a 90-day comprehensive defect warranty starting from the date of final delivery.",
    "sources": ["Section 4.2", "Paragraph 3"]
  }
  ```

---

## 4. Analytics & Overview

### `GET /api/analytics/summary` (Protected)
High-level operational metrics for dashboard visualization.
- **Response (200 OK)**:
  ```json
  {
    "success": true,
    "totalDocuments": 48,
    "processedCount": 46,
    "totalMonetaryValue": 248950.00,
    "anomalyCount": 7,
    "domainBreakdown": { "FINANCIAL": 28, "HEALTHCARE": 14, "LEGAL": 6 },
    "accuracyRate": 98.4
  }
  ```
