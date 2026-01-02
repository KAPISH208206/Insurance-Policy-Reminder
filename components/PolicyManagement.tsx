
import React, { useState, useMemo } from 'react';
import { Policy, Client } from '../types';
import { api } from '../services/api';

interface PolicyManagementProps {
  policies: Policy[];
  clients: Client[];
  onRefresh: () => void;
}

const PolicyManagement: React.FC<PolicyManagementProps> = ({ policies, clients, onRefresh }) => {
  const [showForm, setShowForm] = useState(false);
  const [editingPolicy, setEditingPolicy] = useState<Policy | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [formData, setFormData] = useState({
    clientId: '',
    policyNumber: '',
    policyType: '',
    insuranceCompany: '',
    startDate: '',
    expiryDate: '',
    premiumAmount: ''
  });

  // Derived state for filtered policies
  const filteredPolicies = useMemo(() => {
    if (!searchQuery.trim()) return policies;
    
    const query = searchQuery.toLowerCase();
    return policies.filter(p => 
      p.policyNumber.toLowerCase().includes(query) ||
      p.policyType.toLowerCase().includes(query) ||
      p.insuranceCompany.toLowerCase().includes(query)
    );
  }, [policies, searchQuery]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = { ...formData, premiumAmount: parseFloat(formData.premiumAmount) };
      if (editingPolicy) {
        await api.policies.update(editingPolicy._id, payload);
      } else {
        await api.policies.add(payload);
      }
      setShowForm(false);
      onRefresh();
    } catch (err) {
      alert('Error saving policy');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (policy: Policy) => {
    setEditingPolicy(policy);
    setFormData({
      clientId: typeof policy.clientId === 'string' ? policy.clientId : policy.clientId._id,
      policyNumber: policy.policyNumber,
      policyType: policy.policyType,
      insuranceCompany: policy.insuranceCompany,
      startDate: policy.startDate.split('T')[0],
      expiryDate: policy.expiryDate.split('T')[0],
      premiumAmount: policy.premiumAmount.toString()
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure?')) return;
    try {
      await api.policies.delete(id);
      onRefresh();
    } catch (err) { alert('Error deleting policy'); }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h3 className="text-2xl font-bold text-slate-800">Policies</h3>
        
        <div className="flex flex-1 w-full md:w-auto md:max-w-md items-center space-x-3">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search by policy #, type, or company..."
              className="block w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg leading-5 bg-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
          
          <button 
            onClick={() => { setShowForm(true); setEditingPolicy(null); }}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center whitespace-nowrap shadow-sm transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
            Add Policy
          </button>
        </div>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-lg animate-in fade-in slide-in-from-top-4 duration-200">
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-1">
              <label className="block text-sm font-medium text-slate-700">Client</label>
              <select required className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" value={formData.clientId} onChange={e => setFormData({...formData, clientId: e.target.value})}>
                <option value="">Select Client</option>
                {clients.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Policy Number</label>
              <input required className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" value={formData.policyNumber} onChange={e => setFormData({...formData, policyNumber: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Type</label>
              <input required className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" value={formData.policyType} onChange={e => setFormData({...formData, policyType: e.target.value})} placeholder="e.g. Health, Life" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Company</label>
              <input required className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" value={formData.insuranceCompany} onChange={e => setFormData({...formData, insuranceCompany: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Start Date</label>
              <input type="date" required className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" value={formData.startDate} onChange={e => setFormData({...formData, startDate: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Expiry Date</label>
              <input type="date" required className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" value={formData.expiryDate} onChange={e => setFormData({...formData, expiryDate: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Premium Amount</label>
              <input type="number" step="0.01" required className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" value={formData.premiumAmount} onChange={e => setFormData({...formData, premiumAmount: e.target.value})} />
            </div>
            <div className="md:col-span-3 flex justify-end space-x-3 pt-2">
              <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg">Cancel</button>
              <button type="submit" disabled={loading} className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:bg-slate-400 transition-colors">
                {loading ? 'Saving...' : 'Save Policy'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-slate-500 text-xs font-semibold uppercase">
              <tr>
                <th className="px-6 py-4">Policy #</th>
                <th className="px-6 py-4">Client</th>
                <th className="px-6 py-4">Type</th>
                <th className="px-6 py-4">Company</th>
                <th className="px-6 py-4 text-right">Premium</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredPolicies.map(policy => (
                <tr key={policy._id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-slate-900">{policy.policyNumber}</td>
                  <td className="px-6 py-4 text-slate-600">{(policy.clientId as Client)?.name}</td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded-full text-xs font-medium uppercase tracking-wider">
                      {policy.policyType}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-600">{policy.insuranceCompany}</td>
                  <td className="px-6 py-4 text-right font-bold text-slate-900">${policy.premiumAmount.toLocaleString()}</td>
                  <td className="px-6 py-4 text-right space-x-3">
                    <button onClick={() => handleEdit(policy)} className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors">Edit</button>
                    <button onClick={() => handleDelete(policy._id)} className="text-red-600 hover:text-red-800 text-sm font-medium transition-colors">Delete</button>
                  </td>
                </tr>
              ))}
              {filteredPolicies.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                    <div className="flex flex-col items-center">
                      <svg className="w-12 h-12 text-slate-200 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 9.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <p className="text-lg font-medium">No policies found matching "{searchQuery}"</p>
                      <button onClick={() => setSearchQuery('')} className="mt-2 text-blue-600 hover:underline">Clear all filters</button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PolicyManagement;
