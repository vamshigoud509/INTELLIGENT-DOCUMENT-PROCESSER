import { v4 as uuidv4 } from 'uuid';
import { dbService } from './dbService.js';
import { IngestedDocument, DocumentExtraction, DocumentAnomaly } from '../types/index.js';

export const loadSampleDocument = async (type: 'invoice' | 'medical_claim' | 'contract' | 'student_worksheet', userId?: string) => {
  const docId = uuidv4();
  const now = new Date().toISOString();

  if (type === 'student_worksheet') {
    const document: IngestedDocument = {
      id: docId,
      user_id: userId,
      filename: 'sample_student_practice_set.pdf',
      original_name: 'Binary_Decimal_Practice_Set.pdf',
      mime_type: 'application/pdf',
      file_size: 18779,
      file_url: '/uploads/sample_student_practice_set.pdf',
      domain: 'STUDENT',
      category: 'STUDENT_WORKSHEET',
      status: 'COMPLETED',
      confidence_score: 99.4,
      processing_time_ms: 1250,
      created_at: now,
      updated_at: now
    };

    const extraction: DocumentExtraction = {
      id: uuidv4(),
      document_id: docId,
      parties: {
        sender: {
          name: 'Department of Computer Science & Engineering',
          address: 'Digital Systems & Architecture Academy',
          tax_id: 'EDU-CS-99482',
          phone: '+1 (800) 555-0142',
          email: 'faculty@cs-academy.edu'
        },
        recipient: {
          name: 'Computer Systems Student',
          address: 'Undergraduate Program, Section A'
        }
      },
      metadata_fields: {
        document_number: 'SET-BIN-DEC-2026',
        issue_date: '2026-07-07',
        due_date: '2026-07-21',
        currency: 'PTS',
        purchase_order_number: 'CRS-CS101-FALL',
        payment_status: 'ACADEMIC_EVALUATION',
        language: 'English'
      },
      financials: {
        currency: 'PTS',
        total_amount: 100,
        subtotal: 100,
        tax_amount: 0,
        discount_amount: 0
      },
      line_items: [
        {
          description: 'Problem 1: Decimal 4096 Place Values & Successive Division-by-2 to Binary',
          quantity: 1,
          unit_price: 10,
          tax_rate: 0,
          total_price: 10,
          category: 'Number Systems'
        },
        {
          description: 'Problem 2: 8-Bit Memory Address Space (256 locations) & 200th Location Binary',
          quantity: 1,
          unit_price: 10,
          tax_rate: 0,
          total_price: 10,
          category: 'Memory Addressing'
        },
        {
          description: 'Problem 3: RGB 24-Bit Color Channels (R=200, G=130, B=75) & 16.7M Distinct Colors',
          quantity: 1,
          unit_price: 10,
          tax_rate: 0,
          total_price: 10,
          category: 'Digital Representation'
        },
        {
          description: 'Problem 4: Bitwise Inversion of A=10100100 & Proof A + ~A = 255 (One\'s Complement)',
          quantity: 1,
          unit_price: 10,
          tax_rate: 0,
          total_price: 10,
          category: 'Binary Logic'
        },
        {
          description: 'Problem 5: Mystery 8-Bit Number with Left/Right Sum Constraints (N = 203)',
          quantity: 1,
          unit_price: 10,
          tax_rate: 0,
          total_price: 10,
          category: 'Constraint Satisfaction'
        },
        {
          description: 'Problem 6: Binary Score Arithmetic & Difference (A=443, B=358 -> Diff=85)',
          quantity: 1,
          unit_price: 10,
          tax_rate: 0,
          total_price: 10,
          category: 'Binary Arithmetic'
        },
        {
          description: 'Problem 7: 5 KB File Size Conversion (40,960 bits) & Power of 2 Inversion',
          quantity: 1,
          unit_price: 10,
          tax_rate: 0,
          total_price: 10,
          category: 'Data Storage'
        }
      ],
      domain_specific: {
        student_name: 'Computer Systems Student',
        student_id: 'STU-2026-CS889',
        institution_name: 'Department of Computer Science & Engineering',
        course_or_subject: 'Computer Science: Digital Logic & Number Systems',
        grade_level: 'Undergraduate / Advanced Secondary CS',
        assignment_title: 'Practice Set: Binary & Decimal Number Systems',
        academic_term: 'Fall Term 2026',
        submission_date: '2026-07-07',
        score_or_grade: '100% (Verified Solutions)',
        total_marks: 100,
        instructor_name: 'Prof. Alan Turing / Digital Systems Faculty',
        key_concepts: [
          'Binary to Decimal Conversion',
          'Place Values (Powers of 2: 2^0 to 2^12)',
          'Successive Division by 2 Method',
          '8-Bit Memory Addressing (256 Locations)',
          'RGB 24-Bit Color Depth (16,777,216 Colors)',
          'One\'s Complement Inversion (A + ~A = 2^n - 1)',
          'Bitwise Constraint Solving',
          'Digital Storage Units (KB to Bytes to Bits)'
        ],
        questions_count: 10,
        problem_sets: [
          {
            number: 1,
            question: 'Place value expansion and successive division-by-2 conversion of decimal 4096 into binary.',
            topic: 'Decimal to Binary Conversion',
            answer: 'Place values: 4000, 0, 90, 6. Decimal (4096)_10 converts to binary (1000000000000)_2 = 2^12 via 13 successive division steps.',
            marks: 10
          },
          {
            number: 2,
            question: '8-bit memory addressing: (a) unique addressable locations, (b) highest address, (c) binary address of 200th location.',
            topic: 'Computer Memory Addressing',
            answer: '(a) 2^8 = 256 unique locations (0 to 255). (b) Highest address = 255 = (11111111)_2. (c) 200th location has zero-indexed address 199 = (11000111)_2.',
            marks: 10
          },
          {
            number: 3,
            question: 'RGB color model: R=200, G=130, B=75. (a) Binary conversions, (b) total bits per pixel, (c) distinct color count.',
            topic: 'Digital Media & RGB Color Models',
            answer: '(a) R = (11001000)_2, G = (10000010)_2, B = (01001011)_2. (b) 8 + 8 + 8 = 24 bits/pixel. (c) 256 x 256 x 256 = 16,777,216 distinct colors.',
            marks: 10
          },
          {
            number: 4,
            question: 'Binary A = 10100100. (a) Place values and decimal value, (b) flipped bits B in decimal, (c) evaluate A + B.',
            topic: 'One\'s Complement & Bit Inversion',
            answer: '(a) Positions 2, 5, 7 have 1s: 4 + 32 + 128 = 164. (b) B = 01011011_2 = 91. (c) A + B = 164 + 91 = 255 = 2^8 - 1 (fundamental property of one\'s complement).',
            marks: 10
          },
          {
            number: 5,
            question: 'Mystery 8-bit binary number N: leftmost 4 bits sum=192, rightmost 4 bits sum=11, bit 4=0. Find N.',
            topic: 'Constraint-Based Bit Layout',
            answer: 'Leftmost (pos 7,6,5,4): 128+64=192 -> 1100. Rightmost (pos 3,2,1,0): 8+2+1=11 -> 1011. N = (11001011)_2 = (203)_10.',
            marks: 10
          },
          {
            number: 6,
            question: 'Player scores A = 110111011 and B = 101100110: (a) decimal values, (b) difference A - B, (c) binary of difference.',
            topic: 'Binary Arithmetic & Comparison',
            answer: '(a) A = 443, B = 358. (b) Difference = 85. (c) 85 in binary = (1010101)_2. (d) Place values sum: 1 + 4 + 16 + 64 = 85.',
            marks: 10
          },
          {
            number: 7,
            question: 'File size of 5 KB: (a) total number of bits, (b) 1024 in binary, (c) flipping any 1-bit to 0 resulting values.',
            topic: 'Digital Storage & File Sizing',
            answer: '(a) 5 x 1024 x 8 = 40,960 bits. (b) 1024 = (10000000000)_2. (c) Only 1 bit is set (bit 10); flipping it produces 0.',
            marks: 10
          }
        ],
        study_recommendations: [
          'Practice successive division by 2 to quickly convert arbitrary decimal integers to binary without mistakes.',
          'Remember that an n-bit register uniquely addresses 2^n memory states (e.g., 8-bit provides 256 locations from 0 to 255).',
          'Utilize the property A + ~A = 2^n - 1 for rapid verification of one\'s complement inversions in digital logic.',
          'RGB 24-bit True Color combines 8 bits per channel (Red, Green, Blue) to render up to 16,777,216 distinct color codes.'
        ]
      },
      raw_summary: 'This is an academic Computer Science Student Practice Worksheet on Binary & Decimal Number Systems. It contains 10 comprehensive numerical and architectural exercises covering base-2 to base-10 conversion, place value powers of 2, 8-bit byte memory addressing (256 locations), RGB 24-bit color depth (16.7M colors), and one\'s complement bit inversion. All problem solutions are fully verified with step-by-step mathematical proofs.',
      created_at: now
    };

    const anomalies: DocumentAnomaly[] = [
      {
        id: uuidv4(),
        document_id: docId,
        severity: 'INFO',
        category: 'COMPLIANCE_RISK',
        title: 'Verified Academic Solutions',
        description: 'All 10 binary and decimal conversions, bitwise proofs, and memory calculations have been verified mathematically.',
        suggested_action: 'Approved for student self-study, lab review, and graded assessment.',
        resolved: true,
        created_at: now
      }
    ];

    await dbService.createDocument(document);
    await dbService.saveExtraction(extraction);
    await dbService.saveAnomalies(anomalies);
    return { document, extraction, anomalies };
  }

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
