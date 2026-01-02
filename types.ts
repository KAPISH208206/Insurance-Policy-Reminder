
export interface Broker {
  id: string;
  name: string;
  email: string;
  whatsappNumber: string;
}

export interface Client {
  _id: string;
  name: string;
  mobileNumber: string;
  brokerId: string;
  createdAt?: string;
}

export interface Policy {
  _id: string;
  clientId: string | Client;
  policyNumber: string;
  policyType: string;
  insuranceCompany: string;
  startDate: string;
  expiryDate: string;
  premiumAmount: number;
  createdAt?: string;
}

// Added User interface for current session management
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: string;
}

// Added Claim interface for the insurance claim center
export interface Claim {
  id: string;
  policyId: string;
  policyNumber: string;
  description: string;
  amount: number;
  dateSubmitted: string;
  status: string;
}

export interface DashboardStats {
  totalClients: number;
  totalPolicies: number;
  expiringToday: number;
  expiring7Days: number;
  expiring30Days: number;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}
