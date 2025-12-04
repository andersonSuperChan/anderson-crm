import type { Opportunity, OpportunityCreate, OpportunityUpdate, OpportunityStats, OpportunityStage } from './types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

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
  const response = await fetch(url);
  return handleResponse<Opportunity[]>(response);
}

export async function getOpportunity(id: number): Promise<Opportunity> {
  const response = await fetch(`${API_URL}/api/opportunities/${id}`);
  return handleResponse<Opportunity>(response);
}

export async function createOpportunity(data: OpportunityCreate): Promise<Opportunity> {
  const response = await fetch(`${API_URL}/api/opportunities`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return handleResponse<Opportunity>(response);
}

export async function updateOpportunity(id: number, data: OpportunityUpdate): Promise<Opportunity> {
  const response = await fetch(`${API_URL}/api/opportunities/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return handleResponse<Opportunity>(response);
}

export async function deleteOpportunity(id: number): Promise<void> {
  const response = await fetch(`${API_URL}/api/opportunities/${id}`, {
    method: 'DELETE',
  });
  return handleResponse<void>(response);
}

export async function getOpportunityStats(): Promise<OpportunityStats> {
  const response = await fetch(`${API_URL}/api/opportunities/stats`);
  return handleResponse<OpportunityStats>(response);
}
