// API Client for backend communication
const API_BASE_URL = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_URL) 
  ? import.meta.env.VITE_API_URL 
  : 'http://localhost:4000';

// Helper to get auth token
function getAuthToken(): string | null {
  return localStorage.getItem('auth_token');
}

// Helper to make authenticated requests
async function fetchWithAuth(endpoint: string, options: RequestInit = {}) {
  const token = getAuthToken();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    // Token expired or invalid
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
    window.location.href = '/login';
    throw new Error('Authentication required');
  }

  return response;
}

// Auth API
export const authAPI = {
  async register(data: {
    email: string;
    password: string;
    name?: string;
    gender?: string;
    dob?: string;
    height_cm?: number;
    weight_kg?: number;
  }) {
    const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Registration failed');
    }
    
    return response.json();
  },

  async login(email: string, password: string) {
    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Login failed');
    }
    
    return response.json();
  },

  logout() {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
  },
};

// Profile API
export const profileAPI = {
  async get() {
    const response = await fetchWithAuth('/api/profile');
    if (!response.ok) throw new Error('Failed to fetch profile');
    return response.json();
  },

  async update(data: {
    name?: string;
    gender?: string;
    dob?: string;
    height_cm?: number;
    weight_kg?: number;
  }) {
    const response = await fetchWithAuth('/api/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    
    if (!response.ok) throw new Error('Failed to update profile');
    return response.json();
  },
};

// Water API
export const waterAPI = {
  async log(data: {
    date: string;
    glasses: number;
    target_ml?: number;
    notes?: string;
  }) {
    const response = await fetchWithAuth('/api/water/log', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    
    if (!response.ok) throw new Error('Failed to log water intake');
    return response.json();
  },

  async getToday() {
    const response = await fetchWithAuth('/api/water/today');
    if (!response.ok) throw new Error('Failed to fetch today\'s water log');
    return response.json();
  },

  async getRange(from?: string, to?: string) {
    const params = new URLSearchParams();
    if (from) params.append('from', from);
    if (to) params.append('to', to);
    
    const response = await fetchWithAuth(`/api/water?${params.toString()}`);
    if (!response.ok) throw new Error('Failed to fetch water logs');
    return response.json();
  },
};

// Period API
export const periodAPI = {
  async get() {
    const response = await fetchWithAuth('/api/period');
    if (!response.ok) throw new Error('Failed to fetch period data');
    return response.json();
  },

  async upsert(data: {
    last_period_date: string;
    cycle_length: number;
    notes?: string;
  }) {
    const response = await fetchWithAuth('/api/period', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    
    if (!response.ok) throw new Error('Failed to update period data');
    return response.json();
  },
};

// Exams API
export const examsAPI = {
  async list() {
    const response = await fetchWithAuth('/api/exams');
    if (!response.ok) throw new Error('Failed to fetch exams');
    return response.json();
  },

  async create(data: {
    subject: string;
    exam_date: string;
    notes?: string;
  }) {
    const response = await fetchWithAuth('/api/exams', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    
    if (!response.ok) throw new Error('Failed to create exam');
    return response.json();
  },

  async delete(id: number) {
    const response = await fetchWithAuth(`/api/exams/${id}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) throw new Error('Failed to delete exam');
    return response.json();
  },
};

// Push API
export const pushAPI = {
  async subscribe(subscription: PushSubscription) {
    const response = await fetchWithAuth('/api/push/subscribe', {
      method: 'POST',
      body: JSON.stringify({
        endpoint: subscription.endpoint,
        p256dh: subscription.toJSON().keys?.p256dh,
        auth_key: subscription.toJSON().keys?.auth,
      }),
    });
    
    if (!response.ok) throw new Error('Failed to save push subscription');
    return response.json();
  },
};
