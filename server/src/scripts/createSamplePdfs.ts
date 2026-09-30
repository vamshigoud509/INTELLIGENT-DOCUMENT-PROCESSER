import fs from 'fs';
import path from 'path';

const uploadsDir = path.resolve(process.cwd(), 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Generate simple valid PDF bytes with human-readable text
const createSimplePdf = (title: string, lines: string[]): Buffer => {
  const content = [
    '%PDF-1.4',
    '1 0 obj << /Type /Catalog /Pages 2 0 R >> endobj',
    '2 0 obj << /Type /Pages /Kids [3 0 R] /Count 1 >> endobj',
    '3 0 obj << /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >> endobj',
    '5 0 obj << /Type /Font /Subtype /Type1 /BaseFont /Helvetica >> endobj'
  ];

  let streamText = `BT /F1 18 Tf 50 740 Td (${title}) Tj ET\n`;
  let y = 700;
  for (const line of lines) {
    const escaped = line.replace(/\\/g, '\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)');
    streamText += `BT /F1 11 Tf 50 ${y} Td (${escaped}) Tj ET\n`;
    y -= 22;
  }

  const streamLength = Buffer.byteLength(streamText, 'utf-8');
  content.push(`4 0 obj << /Length ${streamLength} >> stream\n${streamText}endstream\nendobj`);
  content.push('xref');
  content.push('0 6');
  content.push('0000000000 65535 f ');
  content.push('0000000010 00000 n ');
  content.push('0000000060 00000 n ');
  content.push('0000000117 00000 n ');
  content.push('0000000300 00000 n ');
  content.push('0000000234 00000 n ');
  content.push('trailer << /Size 6 /Root 1 0 R >>');
  content.push('startxref');
  content.push('400');
  content.push('%%EOF');

  return Buffer.from(content.join('\n'));
};

const invoiceLines = [
  'Vendor: Apex Nexus Consulting LLC | Tax ID: US-TX-8829104-V',
  'Client: OmniCorp Technologies International | PO: PO-OMNI-9941',
  'Invoice Number: INV-2025-004 | Date: Feb 01, 2025 | Due Date: Mar 03, 2025',
  '---------------------------------------------------------------------------------',
  '1. Principal Solutions Architect Consultation (60 hrs @ $175/hr): $10,500.00',
  '2. Kubernetes Multi-Cluster Hardening & Zero-Trust Audit (20 hrs @ $200): $4,000.00',
  '3. Automated CI/CD Deployment Pipeline Configuration: $2,000.00',
  '---------------------------------------------------------------------------------',
  'Subtotal: $16,500.00',
  'Sales Tax (8%): $1,320.00',
  'Early Settlement Discount: -$500.00',
  'TOTAL DUE: $17,320.00 USD',
  'Payment Terms: Net 30 | Wire: JPMorgan Chase Bank Acct ...8891'
];

const medicalLines = [
  'Provider: St. Jude Metropolitan Health Center | EIN: 04-2993810',
  'Patient: Sophia Martinez (DOB: 1988-04-12) | MRN: PT-MRN-902188',
  'Insurer: BlueCross Health Insurance Corporation | Policy: BC-POL-883921-A',
  'Claim ID: CLM-MED-2025-99201 | Admission: Feb 12, 2025 | Discharge: Feb 13, 2025',
  'Diagnosis: Acute Appendicitis without Perforation (ICD-10 K35.80, R10.31)',
  '---------------------------------------------------------------------------------',
  '1. Emergency Dept Evaluation & Care Level 5 (CPT 99285): $1,850.00',
  '2. Abdominal & Pelvic CT Scan with IV Contrast (CPT 74177): $2,450.00',
  '3. Comprehensive Blood Metabolic Panel + CBC (CPT 80053): $450.00',
  '4. 24-Hour Observation Bed Care (Private Ward): $2,100.00',
  '5. Inpatient Pharmacy Medications (Ketorolac / Ceftriaxone): $1,000.00',
  '---------------------------------------------------------------------------------',
  'Gross Charges: $7,850.00 | Network PPO Discount: -$600.00',
  'Net Amount Claimed: $7,250.00 USD | Patient Co-Pay: $250.00',
  'Physician: Dr. Michael Chen, MD (NPI 1492019482)'
];

const contractLines = [
  'MASTER SERVICES AGREEMENT & CYBERSECURITY SLA',
  'Provider: Vanguard Cloud Infrastructure Ltd. | VAT: GB-VAT-99201948',
  'Client: Apex Global Financial Group LLC | EIN: US-EIN-13-8829104',
  'Contract ID: MSA-VNG-2025-09 | Effective Date: Jan 01, 2025 | Expiry: Jan 01, 2026',
  '---------------------------------------------------------------------------------',
  'Scope of Services:',
  '1. Dedicated Kubernetes Production Cluster (Multi-Region HA): $90,000.00/yr',
  '2. Enterprise 99.99% Uptime Guarantee with 15-Minute P1 Response SLA: $42,000.00/yr',
  '3. SOC-2 Type II Continuous Compliance Monitoring & Pen-Testing: $18,000.00/yr',
  '---------------------------------------------------------------------------------',
  'Contract Value: $150,000.00 | Enterprise Volume Discount: -$15,000.00',
  'Net Annual Total: $135,000.00 USD',
  'Governing Law: State of New York | Mutual Liability Cap: 1x Annual Fees'
];

fs.writeFileSync(path.join(uploadsDir, 'sample_apex_consulting_invoice.pdf'), createSimplePdf('Apex Nexus Consulting LLC - Commercial Invoice', invoiceLines));
fs.writeFileSync(path.join(uploadsDir, 'sample_st_jude_medical_claim.pdf'), createSimplePdf('St. Jude Health System - UB-04 Inpatient Claim', medicalLines));
fs.writeFileSync(path.join(uploadsDir, 'sample_enterprise_cloud_sla.pdf'), createSimplePdf('Vanguard Cloud Infrastructure - Master SLA Agreement', contractLines));

console.log('✅ Generated sample PDF documents in uploads directory.');
