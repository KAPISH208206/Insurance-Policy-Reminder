
import React, { useState } from 'react';
import { Claim, Policy } from '../types';

interface ClaimCenterProps {
  claims: Claim[];
  policies: Policy[];
  onAddClaim: (claim: Omit<Claim, 'id'>) => void;
}

const ClaimCenter: React.FC<ClaimCenterProps> = ({ claims, policies, onAddClaim }) => {
  const [showForm, setShowForm] = useState(false);
  // Using _id for policy identification matching our Policy interface
  const [formData, setFormData] = useState({
    policyId: policies[0]?._id || '',
    description: '',
    amount: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Using _id for matching
    const policy = policies.find(p => p._id === formData.policyId);
    if (!policy) return;

    onAddClaim({
      policyId: formData.policyId,
      policyNumber: policy.policyNumber,
      description: formData.description,
      amount: parseFloat(formData.amount),
      dateSubmitted: new Date().toISOString().split('T')[0],
      status: 'Under Review'
    });
    setShowForm(false);
    setFormData({ policyId: policies[0]?._id || '', description: '', amount: '' });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-bold text-slate-800">Claims History</h3>
        <button 
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 shadow-md transition-all flex items-center"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          File New Claim
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-8 rounded-xl border border-blue-100 shadow-xl animate-in fade-in slide-in-from-top-4 duration-300">
          <h4 className="text-lg font-semibold mb-6">New Claim Details</h4>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Select Policy</label>
              <select 
                value={formData.policyId}
                onChange={(e) => setFormData({...formData, policyId: e.target.value})}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                {policies.map(p => (
                  // Using _id and policyType as per Policy interface
                  <option key={p._id} value={p._id}>{p.policyNumber} ({p.policyType})</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Estimated Amount ($)</label>
              <input 
                type="number"
                required
                value={formData.amount}
                onChange={(e) => setFormData({...formData, amount: e.target.value})}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="0.00"
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium text-slate-700">Description of Incident</label>
              <textarea 
                required
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                rows={3}
                placeholder="Briefly describe what happened..."
              />
            </div>
            <div className="md:col-span-2 flex justify-end space-x-4 pt-4 border-t">
              <button type="button" onClick={() => setShowForm(false)} className="px-6 py-2 text-slate-600 font-medium hover:bg-slate-100 rounded-lg transition-colors">
                Cancel
              </button>
              <button type="submit" className="px-8 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors">
                Submit Claim
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {claims.map((claim) => (
          <div key={claim.id} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden group hover:border-blue-300 transition-all">
            <div className={`absolute top-0 right-0 px-3 py-1 text-[10px] font-bold uppercase rounded-bl-lg ${
              claim.status === 'Approved' ? 'bg-green-100 text-green-700' : 
              claim.status === 'Under Review' ? 'bg-blue-100 text-blue-700' : 'bg-red-100 text-red-700'
            }`}>
              {claim.status}
            </div>
            <div className="mb-4">
              <h4 className="text-sm font-bold text-slate-500 mb-1">CLAIM #{claim.id.toUpperCase()}</h4>
              <p className="text-lg font-semibold text-slate-900">{claim.policyNumber}</p>
            </div>
            <p className="text-sm text-slate-600 mb-6 line-clamp-2 h-10">{claim.description}</p>
            <div className="flex justify-between items-end border-t pt-4">
              <div>
                <p className="text-xs text-slate-400">Date Submitted</p>
                <p className="text-sm font-medium text-slate-700">{claim.dateSubmitted}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-slate-400">Claim Amount</p>
                <p className="text-xl font-bold text-slate-900">${claim.amount.toLocaleString()}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ClaimCenter;
