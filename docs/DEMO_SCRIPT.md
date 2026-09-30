# DocuSphere IDP — 3–5 Minute Video Walkthrough Script

**Project Title**: DocuSphere IDP — Enterprise Multi-Domain Intelligent Document Processing & Audit Engine  
**Presenter**: Lead AI & Full-Stack Architect  
**Duration**: ~4 Minutes (3:30 – 4:30)  
**Target Audience**: Hackathon Judges, Enterprise Evaluators, Solutions Architects  

---

## Video Outline & Timecodes

| Timecode | Scene / Screen | Speaker Voiceover & Talking Points | On-Screen Action / Demo Clicks |
| :--- | :--- | :--- | :--- |
| **0:00 – 0:35** | **Executive Intro & Problem Statement** | "Hello! Today, finance, procurement, and healthcare teams waste thousands of hours manually cross-checking invoices, receipts, and clinical records. Traditional OCR only transcribes text—it doesn't understand context, it can't reconcile math, and it misses compliance red flags. Meet **DocuSphere IDP**, an end-to-end intelligent document processing platform powered by **Google Gemini Multimodal AI**, **Node.js/Express**, and **React**." | Display the **DocuSphere Dashboard** showing high-level KPI cards (*Total Ingested*, *Audited Value*, *Audit Anomalies*, *Extraction Accuracy*). |
| **0:35 – 1:15** | **Document Ingestion & Multi-Domain Classification** | "DocuSphere ingests complex PDFs and high-resolution scans across financial, healthcare, and legal domains. You can drag and drop files or choose domain pre-sets. For this demo, let's load our pre-configured commercial invoice dataset with one click." | Click **'Load for Testing'** under Commercial Invoice in the *Instant Demo Datasets* section. Point out the instant ingestion and progress bar. Show the new document appearing in the processed ledger. |
| **1:15 – 2:00** | **Side-by-Side Verification Studio & Entity Extraction** | "Now let's enter the **Side-by-Side Verification Studio**. On the left, we have our interactive document previewer with zoom, rotation, and high-fidelity rendering. On the right, the Gemini vision pipeline has automatically extracted structured entities into strongly typed JSON: vendor details, client info, tax identifiers, dates, and an itemized line-items table with quantities and unit prices." | Click the **Eye icon / Inspect** button. Scroll the PDF previewer on the left. On the right, expand the **Structured Data** tab: hover over Vendor Tax ID, payment terms, and the itemized table. |
| **2:00 – 2:45** | **Automated Audit & Anomaly Detection Engine** | "Here is where DocuSphere goes beyond basic OCR: our **Automated Audit & Anomaly Engine**. Notice this high-severity alert: *Grand Total Reconciliation Discrepancy*. DocuSphere computed the exact arithmetic sum of every single line item ($16,500.00), added state sales tax, deducted the early settlement discount, and flagged a discrepancy in declared totals. Auditors can review the suggested action and mark it resolved once investigated." | Switch to the **'Audit & Anomalies'** tab. Highlight the **High Severity** badge. Explain the mathematical check. Click **'Mark Resolved'** to show the real-time workflow transition. |
| **2:45 – 3:30** | **Conversational Document AI (Interactive Q&A)** | "What if an auditor wants to interrogate the document directly? We switch to the **Document AI Chat** tab. Powered by Gemini, users can ask natural language questions grounded strictly in the document content. Let's ask: *'What is the total amount and payment terms?'* Within milliseconds, Gemini returns the exact figures and cites the specific metadata fields." | Switch to the **'Document AI Chat'** tab. Click the suggested chip *'What is the total amount and payment terms?'*. Watch the assistant reply stream in with cited sources. Type: *'Are there any audit anomalies?'* and show the grounded response. |
| **3:30 – 4:00** | **Healthcare & Legal Domain Versatility** | "DocuSphere isn't just for invoices. In our ledger, we also have clinical hospital claims—extracting ICD-10 diagnosis codes and CPT procedures—and enterprise cloud SLAs, extracting liability caps and renewal terms. Everything can be exported with one click to clean **JSON** or accounting-ready **CSV**." | Navigate back to Dashboard. Show the St. Jude Medical Claim record. Click **'CSV'** export button to show instant download. Click **'JSON'** in studio. |
| **4:00 – 4:30** | **Architecture & Deployment Wrap-up** | "Under the hood: React + Tailwind CSS frontend ready for Vercel/Netlify, Express + Multer backend with JWT security for Render/Railway, Supabase PostgreSQL persistence with local JSON fallback, and Google Gemini Multimodal API. Thank you!" | Switch to the **Analytics page** showing throughput metrics and domain distribution. Conclude presentation. |

---

## Presenter Key Tips & FAQs
1. **If asked about offline/demo reliability**: Highlight that DocuSphere features an intelligent fallback engine so that even if an evaluator runs the app without internet or a live Gemini key, all features, tables, charts, and audits execute with 100% fidelity.
2. **If asked about security**: Emphasize that all API keys, database credentials, and JWT signing keys are strictly confined to backend `.env` variables and never exposed to the browser client.
3. **If asked about extensibility**: Explain how new document schemas (such as tax forms or customs declarations) can be added simply by defining a new Zod/TypeScript schema in the Gemini extraction pipeline.
