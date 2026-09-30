import { v4 as uuidv4 } from 'uuid';
import { dbService } from './dbService.js';
import { IngestedDocument, DocumentExtraction, DocumentAnomaly } from '../types/index.js';

export const loadSampleDocument = async (type: 'invoice' | 'medical_claim' | 'contract', userId?: string) => {
  const docId = uuidv4();
  const now = new Date().toISOString();

  if (type === 'medical_claim') {
    const document: IngestedDocument = {
      id: docId,
      user_id: userId,
      filename: 'sample_st_jude_medical_claim.pdf',
      original_name: 'St_Jude_Hospital_Inpatient_Claim_Form_UB04.pdf',
      mime_type: 'application/pdf',
      file_size: 245089,
      file_url: '/uploads/sample_st_jude_medical_claim.pdf',
      domain: 'HEALTHCARE',
      category: 'MEDICAL_CLAIM',
      status: 'COMPLETED',
      confidence_score: 98.7,
      processing_time_ms: 1420,
      created_at: now,
      updated_at: now
    };

    const extraction: DocumentExtraction = {
      id: uuidv4(),
      document_id: docId,
      parties: {
        sender: {
          name: 'St. Jude Metropolitan Health Center',
          address: '880 Health Science Blvd, Suite 500, Boston, MA 02115',
          tax_id: 'EIN-04-2993810',
          phone: '+1 (617) 555-8900',
          email: 'inpatient-billing@stjudehealth.org'
        },
        recipient: {
          name: 'BlueCross Health Insurance Corporation',
          address: '400 Federal Street, Boston, MA 02110',
          tax_id: 'PAYER-BC-9921',
          phone: '+1 (800) 555-2583',
          email: 'claims-intake@bluecross.com'
        }
      },
      metadata_fields: {
        document_number: 'CLM-MED-2025-99201',
        issue_date: '2025-02-14',
        due_date: '2025-03-31',
        currency: 'USD',
        purchase_order_number: 'AUTH-PRE-88910',
        payment_status: 'PENDING_ADJUDICATION'
      },
      financials: {
        subtotal: 7850.00,
        tax_amount: 0.00,
        discount_amount: 600.00,
        shipping_amount: 0.00,
        total_amount: 7250.00,
        currency: 'USD'
      },
      line_items: [
        {
          description: 'Emergency Department Evaluation & Care Level 5 (CPT 99285)',
          quantity: 1,
          unit_price: 1850.00,
          tax_rate: 0,
          total_price: 1850.00,
          category: 'Emergency Services'
        },
        {
          description: 'Abdominal & Pelvic CT Scan with IV Contrast (CPT 74177)',
          quantity: 1,
          unit_price: 2450.00,
          tax_rate: 0,
          total_price: 2450.00,
          category: 'Diagnostic Radiology'
        },
        {
          description: 'Comprehensive Blood Metabolic Panel + CBC with Diff (CPT 80053)',
          quantity: 1,
          unit_price: 450.00,
          tax_rate: 0,
          total_price: 450.00,
          category: 'Pathology & Lab'
        },
        {
          description: '24-Hour Observation Bed Care (Private Ward)',
          quantity: 1,
          unit_price: 2100.00,
          tax_rate: 0,
          total_price: 2100.00,
          category: 'Inpatient Observation'
        },
        {
          description: 'Inpatient Pharmacy Medications (Ketorolac & Ceftriaxone IV)',
          quantity: 1,
          unit_price: 1000.00,
          tax_rate: 0,
          total_price: 1000.00,
          category: 'Clinical Pharmacy'
        }
      ],
      domain_specific: {
        patient_name: 'Sophia Martinez',
        patient_id: 'PT-MRN-902188',
        policy_number: 'BC-POL-883921-A',
        provider_name: 'Dr. Michael Chen, MD (NPI 1492019482)',
        admission_date: '2025-02-12',
        discharge_date: '2025-02-13',
        primary_diagnosis: 'Acute Appendicitis without Perforation (ICD-10 K35.80)',
        diagnosis_codes: ['K35.80', 'R10.31', 'R11.0'],
        procedure_codes: ['99285', '74177', '80053', '96372'],
        copay_amount: 250.00
      },
      raw_summary: `This is an audited Inpatient Healthcare Claim (Form UB-04) submitted by St. Jude Metropolitan Health Center on behalf of patient Sophia Martinez. The patient presented to the Emergency Department with severe lower right abdominal pain, received emergency level 5 triage, IV contrast computed tomography, and was admitted for 24-hour observation. Total itemized hospital charges amount to $7,850.00 with a $600.00 network adjustment, resulting in a net payable claim amount of $7,250.00.`,
      created_at: now
    };

    const anomalies: DocumentAnomaly[] = [
      {
        id: uuidv4(),
        document_id: docId,
        severity: 'MEDIUM',
        category: 'COMPLIANCE_RISK',
        title: 'Network Co-Pay Collection Pending',
        description: 'Patient co-pay of $250.00 has not been marked as collected in the admission ledger.',
        suggested_action: 'Ensure patient responsibility balance is billed post-adjudication.',
        resolved: false,
        created_at: now
      },
      {
        id: uuidv4(),
        document_id: docId,
        severity: 'INFO',
        category: 'DATE_MISMATCH',
        title: 'Timely Filing Validation Passed',
        description: 'Claim submitted within 48 hours of discharge, well within the 90-day insurer filing window.',
        suggested_action: 'No action required.',
        resolved: true,
        created_at: now
      }
    ];

    await dbService.createDocument(document);
    await dbService.saveExtraction(extraction);
    await dbService.saveAnomalies(anomalies);
    return { document, extraction, anomalies };
  }

  if (type === 'contract') {
    const document: IngestedDocument = {
      id: docId,
      user_id: userId,
      filename: 'sample_enterprise_cloud_sla.pdf',
      original_name: 'Apex_Vanguard_Master_Services_Agreement_2025.pdf',
      mime_type: 'application/pdf',
      file_size: 492019,
      file_url: '/uploads/sample_enterprise_cloud_sla.pdf',
      domain: 'LEGAL',
      category: 'CONTRACT',
      status: 'COMPLETED',
      confidence_score: 99.2,
      processing_time_ms: 1850,
      created_at: now,
      updated_at: now
    };

    const extraction: DocumentExtraction = {
      id: uuidv4(),
      document_id: docId,
      parties: {
        sender: {
          name: 'Vanguard Cloud Infrastructure Ltd.',
          address: '100 Silicon Way, Cambridge, UK CB2 1PZ',
          tax_id: 'GB-VAT-99201948',
          phone: '+44 20 7946 0912',
          email: 'contracts@vanguardcloud.co.uk'
        },
        recipient: {
          name: 'Apex Global Financial Group LLC',
          address: '30 Rockefeller Plaza, New York, NY 10112',
          tax_id: 'US-EIN-13-8829104',
          phone: '+1 (212) 555-0199',
          email: 'procurement-legal@apexgroup.com'
        }
      },
      metadata_fields: {
        document_number: 'MSA-VNG-2025-09',
        issue_date: '2025-01-01',
        due_date: '2026-01-01',
        currency: 'USD',
        purchase_order_number: 'PO-APX-8820',
        payment_status: 'ACTIVE_EXECUTED'
      },
      financials: {
        subtotal: 150000.00,
        tax_amount: 0.00,
        discount_amount: 15000.00,
        shipping_amount: 0.00,
        total_amount: 135000.00,
        currency: 'USD'
      },
      line_items: [
        {
          description: 'Dedicated Kubernetes Production Cluster (Multi-Region High Availability)',
          quantity: 12,
          unit_price: 7500.00,
          tax_rate: 0,
          total_price: 90000.00,
          category: 'Infrastructure Tier'
        },
        {
          description: 'Enterprise 99.99% Uptime Guarantee with 15-Minute P1 Response SLA',
          quantity: 12,
          unit_price: 3500.00,
          tax_rate: 0,
          total_price: 42000.00,
          category: 'SLA Support'
        },
        {
          description: 'SOC-2 Type II Continuous Compliance Monitoring & Pen-Testing Retainer',
          quantity: 1,
          unit_price: 18000.00,
          tax_rate: 0,
          total_price: 18000.00,
          category: 'Security Compliance'
        }
      ],
      domain_specific: {
        contract_title: 'Master Enterprise Cloud Service Level Agreement & Data Protection Addendum',
        effective_date: '2025-01-01',
        termination_date: '2026-01-01',
        governing_law: 'State of New York, United States',
        liability_cap: 'Equal to total annual fees paid under this agreement ($135,000.00 USD)',
        key_obligations: [
          '99.99% monthly system uptime credit mechanism',
          'GDPR and CCPA compliant data privacy standard contractual clauses',
          'Notice of breach within 24 hours of confirmation'
        ]
      },
      raw_summary: `This Master Services Agreement governs enterprise cloud infrastructure hosting provided by Vanguard Cloud Infrastructure Ltd. to Apex Global Financial Group LLC. Key commercial provisions include $135,000.00 USD annual commitment, 99.99% multi-region uptime commitments backed by service credits, and a mutual limitation of liability capped at aggregate annual fees.`,
      created_at: now
    };

    const anomalies: DocumentAnomaly[] = [
      {
        id: uuidv4(),
        document_id: docId,
        severity: 'MEDIUM',
        category: 'COMPLIANCE_RISK',
        title: 'Auto-Renewal Notice Window Active',
        description: 'Contract automatically renews for 12 months unless 60 days advance written notice is provided prior to Jan 1, 2026.',
        suggested_action: 'Configure automated procurement notification for November 1, 2025.',
        resolved: false,
        created_at: now
      }
    ];

    await dbService.createDocument(document);
    await dbService.saveExtraction(extraction);
    await dbService.saveAnomalies(anomalies);
    return { document, extraction, anomalies };
  }

  // Default: Financial Invoice with intentional calculation mismatch for anomaly demo
  const document: IngestedDocument = {
    id: docId,
    user_id: userId,
    filename: 'sample_apex_consulting_invoice.pdf',
    original_name: 'Apex_Nexus_Consulting_Invoice_INV2025_004.pdf',
    mime_type: 'application/pdf',
    file_size: 182940,
    file_url: '/uploads/sample_apex_consulting_invoice.pdf',
    domain: 'FINANCIAL',
    category: 'INVOICE',
    status: 'COMPLETED',
    confidence_score: 99.4,
    processing_time_ms: 1120,
    created_at: now,
    updated_at: now
  };

  const extraction: DocumentExtraction = {
    id: uuidv4(),
    document_id: docId,
    parties: {
      sender: {
        name: 'Apex Nexus Consulting LLC',
        address: '100 Enterprise Way, Suite 800, Austin, TX 78701',
        tax_id: 'US-TX-8829104-V',
        phone: '+1 (512) 555-0182',
        email: 'billing@apexnexus.io'
      },
      recipient: {
        name: 'OmniCorp Technologies International',
        address: '500 Madison Avenue, 22nd Floor, New York, NY 10022',
        tax_id: 'US-NY-4482910-K',
        phone: '+1 (212) 555-4000',
        email: 'accounts.payable@omnicorp.com'
      }
    },
    metadata_fields: {
      document_number: 'INV-2025-004',
      issue_date: '2025-02-01',
      due_date: '2025-03-03',
      currency: 'USD',
      purchase_order_number: 'PO-OMNI-9941',
      payment_status: 'UNPAID'
    },
    financials: {
      subtotal: 16500.00,
      tax_amount: 1320.00, // 8%
      discount_amount: 500.00,
      shipping_amount: 0.00,
      total_amount: 17320.00,
      currency: 'USD'
    },
    line_items: [
      {
        description: 'Principal Solutions Architect Consultation (60 Hours @ $175/hr)',
        quantity: 60,
        unit_price: 175.00,
        tax_rate: 8.0,
        total_price: 10500.00,
        category: 'Professional Services'
      },
      {
        description: 'Kubernetes Multi-Cluster Hardening & Zero-Trust Audit',
        quantity: 20,
        unit_price: 200.00,
        tax_rate: 8.0,
        total_price: 4000.00,
        category: 'Cybersecurity'
      },
      {
        description: 'Automated CI/CD Deployment Pipeline Configuration',
        quantity: 1,
        unit_price: 2000.00,
        tax_rate: 8.0,
        total_price: 2000.00,
        category: 'DevOps Engineering'
      }
    ],
    domain_specific: {
      payment_terms: 'Net 30 Days (2% discount if paid within 10 days)',
      bank_account: 'JPMorgan Chase Business Account ending in ...8891',
      iban_swift: 'CHASUS33AXX'
    },
    raw_summary: `This is a standard B2B commercial consulting invoice issued by Apex Nexus Consulting LLC to OmniCorp Technologies International. It charges for 60 hours of principal architecture, Kubernetes security hardening, and CI/CD automation. Stated subtotal is $16,500.00 with 8% sales tax of $1,320.00 and early-bird discount of $500.00, yielding a total payable balance of $17,320.00 USD.`,
    created_at: now
  };

  const anomalies: DocumentAnomaly[] = [
    {
      id: uuidv4(),
      document_id: docId,
      severity: 'HIGH',
      category: 'ARITHMETIC_ERROR',
      title: 'Grand Total Reconciliation Discrepancy',
      description: 'Calculated balance: Subtotal ($16,500.00) + Tax ($1,320.00) - Discount ($500.00) = $17,320.00. However, sum of line items ($16,500.00) matches subtotal accurately.',
      suggested_action: 'Ensure discount deduction was applied in customer AP ledger before issuing wire.',
      resolved: false,
      created_at: now
    },
    {
      id: uuidv4(),
      document_id: docId,
      severity: 'INFO',
      category: 'COMPLIANCE_RISK',
      title: 'Prompt Payment Discount Available',
      description: 'Invoice qualifies for a 2% early payment discount if settled within 10 days.',
      suggested_action: 'Forward to treasury for expedited 10-day payment to capture $330 savings.',
      resolved: false,
      created_at: now
    }
  ];

  await dbService.createDocument(document);
  await dbService.saveExtraction(extraction);
  await dbService.saveAnomalies(anomalies);
  return { document, extraction, anomalies };
};
