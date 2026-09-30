export type DocumentDomain = 'FINANCIAL' | 'HEALTHCARE' | 'LEGAL' | 'GENERAL';

export type DocumentCategory = 
  | 'INVOICE' 
  | 'RECEIPT' 
  | 'ID_CARD'
  | 'RESUME'
  | 'CONTRACT' 
  | 'PURCHASE_ORDER' 
  | 'UTILITY_BILL'
  | 'TAX_FORM'
  | 'MEDICAL_CLAIM' 
  | 'DISCHARGE_SUMMARY' 
  | 'PRESCRIPTION' 
  | 'LAB_REPORT'
  | 'SLA' 
  | 'OTHER';

export type ProcessingStatus = 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';

export type AnomalySeverity = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'INFO';

export type AnomalyCategory = 
  | 'ARITHMETIC_ERROR' 
  | 'MISSING_REQUIRED_FIELD' 
  | 'DATE_MISMATCH' 
  | 'COMPLIANCE_RISK' 
  | 'UNUSUAL_CHARGE'
  | 'DUPLICATE_SUSPICION'
  | 'EXPIRED_DOCUMENT';

export interface User {
  id: string;
  email: string;
  name: string;
  organization?: string;
  role?: string;
  created_at: string;
}

export interface IngestedDocument {
  id: string;
  user_id?: string;
  filename: string;
  original_name: string;
  mime_type: string;
  file_size: number;
  file_url: string;
  domain: DocumentDomain;
  category: DocumentCategory;
  status: ProcessingStatus;
  confidence_score: number;
  processing_time_ms: number;
  error_message?: string | null;
  created_at: string;
  updated_at: string;
}

export interface LineItem {
  id?: string;
  description: string;
  quantity?: number;
  unit_price?: number;
  tax_rate?: number;
  total_price: number;
  category?: string;
  notes?: string;
}

export interface ExtractedParties {
  sender?: {
    name?: string;
    address?: string;
    tax_id?: string;
    phone?: string;
    email?: string;
  };
  recipient?: {
    name?: string;
    address?: string;
    tax_id?: string;
    phone?: string;
    email?: string;
  };
}

export interface ExtractedMetadata {
  document_number?: string;
  issue_date?: string;
  due_date?: string;
  currency?: string;
  purchase_order_number?: string;
  payment_status?: string;
  language?: string;
}

export interface ExtractedFinancials {
  subtotal?: number;
  tax_amount?: number;
  discount_amount?: number;
  shipping_amount?: number;
  total_amount?: number;
  currency?: string;
  net_amount?: number;
}

export interface DomainSpecificData {
  // Financial & Banking
  payment_terms?: string;
  bank_name?: string;
  bank_account?: string;
  routing_number?: string;
  iban_swift?: string;
  
  // Healthcare
  patient_name?: string;
  patient_id?: string;
  policy_number?: string;
  provider_name?: string;
  admission_date?: string;
  discharge_date?: string;
  primary_diagnosis?: string;
  diagnosis_codes?: string[];
  procedure_codes?: string[];
  copay_amount?: number;
  
  // Legal
  contract_title?: string;
  effective_date?: string;
  termination_date?: string;
  governing_law?: string;
  liability_cap?: string;
  key_obligations?: string[];

  // Candidate / Resume
  candidate_name?: string;
  candidate_title?: string;
  candidate_skills?: string[];
  candidate_experience_years?: number;
  candidate_education?: string[];
  candidate_certifications?: string[];

  // Identity / ID Card
  id_type?: string;
  id_number?: string;
  holder_name?: string;
  date_of_birth?: string;
  expiry_date?: string;
  issuing_country_or_authority?: string;
}

export interface DocumentExtraction {
  id: string;
  document_id: string;
  parties: ExtractedParties;
  metadata_fields: ExtractedMetadata;
  financials: ExtractedFinancials;
  line_items: LineItem[];
  domain_specific: DomainSpecificData;
  raw_summary: string;
  created_at: string;
}

export interface DocumentAnomaly {
  id: string;
  document_id: string;
  severity: AnomalySeverity;
  category: AnomalyCategory;
  title: string;
  description: string;
  suggested_action?: string;
  resolved: boolean;
  created_at: string;
}

export interface ChatMessage {
  id: string;
  document_id: string;
  user_id?: string;
  role: 'user' | 'assistant';
  message: string;
  sources?: string[];
  created_at: string;
}

export interface DocumentDetailResponse {
  document: IngestedDocument;
  extraction: DocumentExtraction | null;
  anomalies: DocumentAnomaly[];
  chatHistory: ChatMessage[];
}

export interface AnalyticsSummary {
  totalDocuments: number;
  processedCount: number;
  totalMonetaryValue: number;
  anomalyCount: number;
  domainBreakdown: Record<string, number>;
  accuracyRate: number;
}
