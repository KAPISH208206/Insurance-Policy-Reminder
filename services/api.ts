const API_URL = import.meta.env.PROD ? '/api' : 'http://localhost:5000';

const getHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
  };
};

const handleResponse = async (response: Response) => {
  if (response.status === 401) {
    localStorage.removeItem('token');
    window.location.reload();
    throw new Error('Unauthorized');
  }
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'API Error');
  return data;
};

export const api = {
  auth: {
    login: async (credentials: any) => {
      const response = await fetch(`${API_URL}/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials)
      });
      return handleResponse(response);
    },
    register: async (data: any) => {
      const response = await fetch(`${API_URL}/admin/register`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(data)
      });
      return handleResponse(response);
    },
  },
  clients: {
    getAll: async () => {
      const response = await fetch(`${API_URL}/clients`, { headers: getHeaders() });
      return handleResponse(response);
    },
    add: async (data: any) => {
      const response = await fetch(`${API_URL}/clients`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(data)
      });
      return handleResponse(response);
    },
    update: async (id: string, data: any) => {
      const response = await fetch(`${API_URL}/clients/${id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(data)
      });
      return handleResponse(response);
    },
    delete: async (id: string) => {
      const response = await fetch(`${API_URL}/clients/${id}`, {
        method: 'DELETE',
        headers: getHeaders()
      });
      return handleResponse(response);
    },
  },
  policies: {
    getUpcoming: async () => {
      const response = await fetch(`${API_URL}/policies/upcoming`, { headers: getHeaders() });
      return handleResponse(response);
    },
    add: async (data: any) => {
      const response = await fetch(`${API_URL}/policies`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(data)
      });
      return handleResponse(response);
    },
    update: async (id: string, data: any) => {
      const response = await fetch(`${API_URL}/policies/${id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(data)
      });
      return handleResponse(response);
    },
    delete: async (id: string) => {
      const response = await fetch(`${API_URL}/policies/${id}`, {
        method: 'DELETE',
        headers: getHeaders()
      });
      return handleResponse(response);
    },
  }
};