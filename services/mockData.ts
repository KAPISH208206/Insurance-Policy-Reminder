
import { Policy, Claim, User } from '../types';

export const currentUser: User = {
  id: 'u1',
  name: 'Alex Thompson',
  email: 'alex.thompson@example.com',
  avatar: 'https://picsum.photos/seed/alex/200',
  role: 'Customer'
};

// Fixed mock policies to align with the Policy interface property names and _id format
export const mockPolicies: Policy[] = [
  {
    _id: 'p1',
    clientId: 'c1',
    policyNumber: 'POL-88219-X',
    policyType: 'Auto',
    insuranceCompany: 'SafeGuard Mutual',
    premiumAmount: 125.50,
    startDate: '2023-01-15',
    expiryDate: '2024-01-15'
  },
  {
    _id: 'p2',
    clientId: 'c1',
    policyNumber: 'HOM-33102-Y',
    policyType: 'Home',
    insuranceCompany: 'Urban Shield',
    premiumAmount: 210.00,
    startDate: '2023-06-01',
    expiryDate: '2024-06-01'
  },
  {
    _id: 'p3',
    clientId: 'c2',
    policyNumber: 'HLT-44901-Z',
    policyType: 'Health',
    insuranceCompany: 'Blue Horizon',
    premiumAmount: 450.75,
    startDate: '2022-12-10',
    expiryDate: '2023-12-10'
  }
];

export const mockClaims: Claim[] = [
  {
    id: 'c1',
    policyId: 'p1',
    policyNumber: 'POL-88219-X',
    description: 'Minor fender bender in parking lot.',
    amount: 1200.00,
    dateSubmitted: '2023-08-20',
    status: 'Approved'
  },
  {
    id: 'c2',
    policyId: 'p2',
    policyNumber: 'HOM-33102-Y',
    description: 'Water damage in basement due to pipe burst.',
    amount: 4500.00,
    dateSubmitted: '2023-10-05',
    status: 'Under Review'
  }
];
