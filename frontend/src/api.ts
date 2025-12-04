import type { Opportunity, OpportunityCreate, OpportunityUpdate, OpportunityStats, OpportunityStage } from './types';

// Parse API URL and extract credentials if present
function parseApiUrl(urlString: string): { baseUrl: string; authHeader?: string } {
  try {
    const url = new URL(urlString);
    if (url.username && url.password) {
      const credentials = btoa(`${url.username}:${url.password}`);
      url.username = '';
      url.password = '';
      return { baseUrl: url.toString().replace(/\/$/, ''), authHeader: `Basic ${credentials}` };
    }
    return { baseUrl: urlString };
  } catch {
    return { baseUrl: urlString };
  }
}

const { baseUrl: API_URL, authHeader: AUTH_HEADER } = parseApiUrl(import.meta.env.VITE_API_URL || 'http://localhost:8000');

function getHeaders(contentType?: string): HeadersInit {
  const headers: HeadersInit = {};
  if (AUTH_HEADER) {
    headers['Authorization'] = AUTH_HEADER;
  }
  if (contentType) {
    headers['Content-Type'] = contentType;
  }
  return headers;
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: 'An error occurred' }));
    throw new Error(error.detail || 'An error occurred');
  }
  if (response.status === 204) {
    return undefined as T;
  }
  return response.json();
}

export async function getOpportunities(stage?: OpportunityStage, search?: string): Promise<Opportunity[]> {
  const params = new URLSearchParams();
  if (stage) params.append('stage', stage);
  if (search) params.append('search', search);
  
  const url = `${API_URL}/api/opportunities${params.toString() ? `?${params}` : ''}`;
  const response = await fetch(url, { headers: getHeaders() });
  return handleResponse<Opportunity[]>(response);
}

export async function getOpportunity(id: number): Promise<Opportunity> {
  const response = await fetch(`${API_URL}/api/opportunities/${id}`, { headers: getHeaders() });
  return handleResponse<Opportunity>(response);
}

export async function createOpportunity(data: OpportunityCreate): Promise<Opportunity> {
  const response = await fetch(`${API_URL}/api/opportunities`, {
    method: 'POST',
    headers: getHeaders('application/json'),
    body: JSON.stringify(data),
  });
  return handleResponse<Opportunity>(response);
}

export async function updateOpportunity(id: number, data: OpportunityUpdate): Promise<Opportunity> {
  const response = await fetch(`${API_URL}/api/opportunities/${id}`, {
    method: 'PUT',
    headers: getHeaders('application/json'),
    body: JSON.stringify(data),
  });
  return handleResponse<Opportunity>(response);
}

export async function deleteOpportunity(id: number): Promise<void> {
  const response = await fetch(`${API_URL}/api/opportunities/${id}`, {
    method: 'DELETE',
    headers: getHeaders(),
  });
  return handleResponse<void>(response);
}

export async function getOpportunityStats(): Promise<OpportunityStats> {
  const response = await fetch(`${API_URL}/api/opportunities/stats`, { headers: getHeaders() });
  return handleResponse<OpportunityStats>(response);
}
