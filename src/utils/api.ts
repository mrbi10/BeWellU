const API_BASE_URL =
  'https://script.google.com/macros/s/AKfycbzd6rOuJJYFwZLF6duedev1nW4Dp1TK4nnDLkMoRlrj0OEhvsTSFhVWn0NVMcDz39R2/exec';

async function request(action: string, method: 'GET' | 'POST' = 'GET', body?: any) {
  let url = API_BASE_URL;
  let options: RequestInit = { method };

  if (method === 'GET') {
    const params = new URLSearchParams();
    params.append('action', action);
    if (body && typeof body === 'object') {
      for (const [k, v] of Object.entries(body)) params.append(k, String(v));
    }
    url = `${API_BASE_URL}?${params.toString()}`;
  } else {
    options.headers = { 'Content-Type': 'text/plain' };
    options.body = JSON.stringify({ action, ...body });
  }

  const res = await fetch(url, options);
  if (!res.ok) throw new Error(`Network error ${res.status}`);

  let data: any;
  try {
    data = await res.json();
  } catch {
    throw new Error('Invalid JSON from backend');
  }

  if (data.error) throw new Error(data.error);
  return data;
}

export const authAPI = {
  async login(email: string, password: string) {
    const students = await request('getStudents');
    const user = students.find(
      (s: any) => s.Email === email && s.Password === password
    );
    if (!user) throw new Error('Invalid email or password');
    localStorage.setItem('user', JSON.stringify(user));
    return user;
  },

  async register(data: any) {
    const response = await request('addStudent', 'POST', data);
    localStorage.setItem('user', JSON.stringify(response.user));
    return response;
  },

  logout() {
    localStorage.removeItem('user');
  },
};

export const profileAPI = {
  async get() {
    const userStr = localStorage.getItem('user');
    if (!userStr) throw new Error('Not logged in');

    const user = JSON.parse(userStr);
    const response = await request('getProfile', 'GET', { name: user.name });

    if (!response || !response.profile) {
      return {
        Name: user.name,
        Gender: user.name.toLowerCase() === 'nilaaa' ? 'female' : 'male',
        PartnerName: user.name.toLowerCase() === 'mrbi' ? 'Nilaaa' : 'Mrbi',
        Height_cm: 0,
        Weight_kg: 0,
        DOB: '',
      };
    }

    return response.profile;
  },

  async update(data: {
    name: string;
    partnerName: string;
    gender: string;
    dob: string;
    height_cm: number;
    weight_kg: number;
  }) {
    const userStr = localStorage.getItem('user');
    if (!userStr) throw new Error('Not logged in');

    const user = JSON.parse(userStr);
    const response = await request('addProfile', 'POST', {
      ...data,
      name: user.name, 
    });

    return response;
  },
};


export const waterAPI = {
  async log(data: { date: string; glasses: number; target_ml?: number; notes?: string; registrationNo?: string }) {
    return request('addWater', 'POST', data);
  },
  async getToday(date?: string) {
    const today = date || new Date().toLocaleDateString('en-GB').replace(/\//g, '-');
    return request('getTodayWater', 'GET', { date: today });
  },
};

export const examsAPI = {
  async list() {
    return request('listExams', 'GET');
  },
  async create(data: { subject: string; exam_date: string; notes?: string }) {
    return request('createExam', 'POST', data);
  },
  async delete(id: number) {
    return request('deleteExam', 'POST', { id });
  },
};

export const periodAPI = {
  async get() {
    return request('getPeriodData', 'GET');
  },
  async upsert(data: { last_period_date: string; cycle_length: number }) {
    return request('updatePeriodData', 'POST', data);
  },
};

export const pushAPI = {
  async subscribe(subscription: PushSubscription) {
    const keys = subscription.toJSON().keys || {};
    return request('savePush', 'POST', {
      endpoint: subscription.endpoint,
      p256dh: keys.p256dh,
      auth_key: keys.auth,
    });
  },
};
