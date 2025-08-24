export interface Counterparty {
  id: string;
  name: string;
  type?: 'person' | 'company' | 'government' | 'other';
  logo?: string;
  email?: string;
  phone?: string;
  address?: string;
  notes?: string;
}