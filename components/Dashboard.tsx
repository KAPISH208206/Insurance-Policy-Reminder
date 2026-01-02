import React, { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Policy, Client } from '../types';

interface DashboardProps {
  policies: Policy[];
  clients: Client[];
}

const Dashboard: React.FC<DashboardProps> = ({ policies, clients }) => {
  const stats = useMemo(() => {
    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];
    
    const sevenDaysLater = new Date();
    sevenDaysLater.setDate(now.getDate() + 7);
    
    const thirtyDaysLater = new Date();
    thirtyDaysLater.setDate(now.getDate() + 30);

    const expiringToday = policies.filter(p => p.expiryDate.split('T')[0] === todayStr).length;
    
    const expiring7Days = policies.filter(p => {
      const exp = new Date(p.expiryDate);
      return exp > now && exp <= sevenDaysLater;
    }).length;

    const expiring30Days = policies.filter(p => {
      const exp = new Date(p.expiryDate);
      return exp > now && exp <= thirtyDaysLater;
    }).length;

    return [
      { label: 'Total Clients', value: clients.length, icon: '👥', color: 'bg-blue-100 text-blue-700' },
      { label: 'Total Policies', value: policies.length, icon: '🛡️', color: 'bg-indigo-100 text-indigo-700' },
      { label: 'Expiring Today', value: expiringToday, icon: '⚠️', color: 'bg-red-100 text-red-700' },
      { label: 'Expiring (7 Days)', value: expiring7Days, icon: '⏳', color: 'bg-amber-100 text-amber-700' },
      { label: 'Expiring (30 Days)', value: expiring30Days, icon: '📅', color: 'bg-green-100 text-green-700' },
    ];
  }, [policies, clients]);

  const chartData = [
    { name: 'Mon', count: 4 },
    { name: 'Tue', count: 7 },
    { name: 'Wed', count: 5 },
    { name: 'Thu', count: 12 },
    { name: 'Fri', count: 9 },
    { name: 'Sat', count: 3 },
    { name: 'Sun', count: 2 },
  ];

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center">
            <div className={`w-10 h-10 flex items-center justify-center rounded-lg text-xl ${stat.color}`}>
              {stat.icon}
            </div>
            <div className="ml-4">
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">{stat.label}</p>
              <h3 className="text-xl font-bold text-slate-900">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-800 mb-6">Policy Expiry Trend</h3>
          <div style={{ width: "100%", height: "300px" }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                <Line type="monotone" dataKey="count" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-800 mb-6">Upcoming Expiries</h3>
          <div className="space-y-4">
            {policies.slice(0, 5).map((policy) => (
              <div key={policy._id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <div className="overflow-hidden">
                  <p className="text-sm font-semibold text-slate-900 truncate">
                    {(policy.clientId as Client)?.name || 'Unknown'}
                  </p>
                  <p className="text-xs text-slate-500">{new Date(policy.expiryDate).toLocaleDateString()}</p>
                </div>
                <span className="text-xs font-bold text-blue-600">
                  {policy.policyType}
                </span>
              </div>
            ))}
            {policies.length === 0 && <p className="text-sm text-slate-500 text-center py-4">No upcoming expiries.</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;