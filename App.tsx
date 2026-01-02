
import React, { useState, useEffect, useCallback } from 'react';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import ClientManagement from './components/ClientManagement';
import PolicyManagement from './components/PolicyManagement';
import Login from './components/Login';
import GeminiAssistant from './components/GeminiAssistant';
import { api } from './services/api';
import { Client, Policy } from './types';

const App: React.FC = () => {
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [user, setUser] = useState<any>(JSON.parse(localStorage.getItem('admin') || 'null'));
  const [activeTab, setActiveTab] = useState('dashboard');
  const [clients, setClients] = useState<Client[]>([]);
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchData = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const [clientsData, policiesData] = await Promise.all([
        api.clients.getAll(),
        api.policies.getUpcoming()
      ]);
      setClients(clientsData);
      setPolicies(policiesData);
    } catch (err) {
      console.error('Failed to fetch data', err);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (token) fetchData();
  }, [token, fetchData]);

  const handleLoginSuccess = (newToken: string, admin: any) => {
    localStorage.setItem('token', newToken);
    localStorage.setItem('admin', JSON.stringify(admin));
    setToken(newToken);
    setUser(admin);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('admin');
    setToken(null);
    setUser(null);
  };

  if (!token) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  const renderContent = () => {
    if (loading && clients.length === 0) return <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>;
    
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard policies={policies} clients={clients} />;
      case 'clients':
        return <ClientManagement clients={clients} onRefresh={fetchData} />;
      case 'policies':
        return <PolicyManagement policies={policies} clients={clients} onRefresh={fetchData} />;
      default:
        return <Dashboard policies={policies} clients={clients} />;
    }
  };

  return (
    <Layout user={user} activeTab={activeTab} setActiveTab={setActiveTab} onLogout={handleLogout}>
      <div className="max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-2 duration-500">
        {renderContent()}
      </div>
      <GeminiAssistant />
    </Layout>
  );
};

export default App;
