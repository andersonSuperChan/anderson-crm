export type OpportunityStage = 
  | 'lead' 
  | 'qualified' 
  | 'proposal' 
  | 'negotiation' 
  | 'closed_won' 
  | 'closed_lost';

export interface Opportunity {
  id: number;
  name: string;
  company: string;
  value: number;
  stage: OpportunityStage;
  contact_person: string | null;
  email: string | null;
  phone: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface OpportunityCreate {
  name: string;
  company: string;
  value: number;
  stage: OpportunityStage;
  contact_person?: string;
  email?: string;
  phone?: string;
  notes?: string;
}

export interface OpportunityUpdate {
  name?: string;
  company?: string;
  value?: number;
  stage?: OpportunityStage;
  contact_person?: string;
  email?: string;
  phone?: string;
  notes?: string;
}

export interface OpportunityStats {
  total_count: number;
  total_value: number;
  by_stage: Record<OpportunityStage, number>;
  by_stage_value: Record<OpportunityStage, number>;
}

export const STAGE_LABELS: Record<OpportunityStage, string> = {
  lead: 'Lead',
  qualified: 'Qualified',
  proposal: 'Proposal',
  negotiation: 'Negotiation',
  closed_won: 'Closed Won',
  closed_lost: 'Closed Lost',
};

export const STAGE_COLORS: Record<OpportunityStage, string> = {
  lead: 'bg-gray-100 text-gray-800',
  qualified: 'bg-blue-100 text-blue-800',
  proposal: 'bg-yellow-100 text-yellow-800',
  negotiation: 'bg-purple-100 text-purple-800',
  closed_won: 'bg-green-100 text-green-800',
  closed_lost: 'bg-red-100 text-red-800',
};
