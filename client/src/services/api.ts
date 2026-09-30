import { 
  User, 
  IngestedDocument, 
  DocumentDetailResponse, 
  AnalyticsSummary, 
  ChatMessage,
  DocumentDomain
} from '../types/index.js';

const API_BASE = '/api';

const getHeaders = (isMultipart: boolean = false): HeadersInit => {
  const token = localStorage.getItem('docusphere_token');
  const headers: Record<string, string> = {};
  if (!isMultipart) {
    headers['Content-Type'] = 'application/json';
  }
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

// --- Authentication ---
export const apiLogin = async (email: string, password: string): Promise<{ user: User; token: string }> => {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({ email, password })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Login failed');
  return data;
};

export const apiRegister = async (payload: {
  email: string;
  password: string;
  name: string;
  organization?: string;
}): Promise<{ user: User; token: string }> => {
  const res = await fetch(`${API_BASE}/auth/register`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(payload)
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Registration failed');
  return data;
};

export const apiGetMe = async (): Promise<User> => {
  const res = await fetch(`${API_BASE}/auth/me`, {
    headers: getHeaders()
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to fetch current user');
  return data.user;
};

// --- Document Management ---
export const apiUploadDocument = async (
  file: File, 
  domain?: DocumentDomain
): Promise<IngestedDocument> => {
  const formData = new FormData();
  formData.append('file', file);
  if (domain && domain !== 'GENERAL') {
    formData.append('domain', domain);
  }

  const res = await fetch(`${API_BASE}/documents/upload`, {
    method: 'POST',
    headers: getHeaders(true),
    body: formData
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Upload failed');
  return data.document;
};

export const apiLoadSample = async (
  sampleType: 'invoice' | 'medical_claim' | 'contract'
): Promise<DocumentDetailResponse> => {
  const res = await fetch(`${API_BASE}/documents/load-sample`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({ sampleType })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to load sample');
  return data;
};

export const apiGetDocuments = async (params?: {
  search?: string;
  domain?: string;
  category?: string;
  status?: string;
}): Promise<IngestedDocument[]> => {
  const query = new URLSearchParams();
  if (params?.search) query.append('search', params.search);
  if (params?.domain && params.domain !== 'ALL') query.append('domain', params.domain);
  if (params?.category && params.category !== 'ALL') query.append('category', params.category);
  if (params?.status && params.status !== 'ALL') query.append('status', params.status);

  const res = await fetch(`${API_BASE}/documents?${query.toString()}`, {
    headers: getHeaders()
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to fetch documents');
  return data.documents;
};

export const apiGetDocumentById = async (id: string): Promise<DocumentDetailResponse> => {
  const res = await fetch(`${API_BASE}/documents/${id}`, {
    headers: getHeaders()
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to fetch document details');
  return data;
};

export const apiReprocessDocument = async (id: string): Promise<void> => {
  const res = await fetch(`${API_BASE}/documents/${id}/reprocess`, {
    method: 'POST',
    headers: getHeaders()
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Reprocess failed');
};

export const apiDeleteDocument = async (id: string): Promise<void> => {
  const res = await fetch(`${API_BASE}/documents/${id}`, {
    method: 'DELETE',
    headers: getHeaders()
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Delete failed');
};

export const apiGetExportUrl = (id: string, format: 'json' | 'csv'): string => {
  return `${API_BASE}/documents/${id}/export?format=${format}`;
};

// --- Conversational Q&A ---
export const apiAskChat = async (
  documentId: string, 
  message: string
): Promise<{ userMessage: ChatMessage; assistantMessage: ChatMessage; reply: string; sources: string[] }> => {
  const res = await fetch(`${API_BASE}/documents/${documentId}/chat`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({ message })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Chat query failed');
  return data;
};

// --- Analytics ---
export const apiGetAnalytics = async (): Promise<AnalyticsSummary> => {
  const res = await fetch(`${API_BASE}/analytics/summary`, {
    headers: getHeaders()
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to fetch analytics');
  return data;
};
