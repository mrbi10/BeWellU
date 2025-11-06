// sheetApiClient.ts
const API_BASE_URL ="https://script.google.com/macros/s/AKfycbx-M4GYv3AhBdhQVBJI14pog82rBFUNn-en828WKMfTw_WaXEXQrzJFzUMo9rh5vvkU/exec";

async function request(action: string, method = 'GET', body?: any) {
  let url = API_BASE_URL;
  const opts = { method, headers: { 'Content-Type': 'application/json' } } as RequestInit;

  if (method === 'GET') {
    // append action and other params to query string if body provided as an object
    const params = new URLSearchParams();
    params.append('action', action);
    if (body && typeof body === 'object') {
      for (const [k, v] of Object.entries(body)) {
        params.append(k, String(v));
      }
    }
    url = `${API_BASE_URL}?${params.toString()}`;
  } else {
    opts.body = JSON.stringify({ action, ...body });
  }

  const res = await fetch(url, opts);
  if (!res.ok) {
    // Apps Script often returns 200 with { error: ... } so handle both
    throw new Error(`Network error ${res.status}`);
  }
  const data = await res.json();
  if (data && data.error) throw new Error(data.error);
  return data;
}

/* Exports similar shape to your previous API object */
export const authAPI = {
  // No real auth — if you later want a simple password, send it as param and check inside Apps Script.
  async login(email: string, password: string) {
    // if you want to fake auth, implement in Apps Script. For now, just return a success if user exists.
    const students = await request('getStudents');
    const user = students.find((s: any) => s.Email === email);
    if (!user) throw new Error('User not found');
    // store a client-side flag
    localStorage.setItem('user', JSON.stringify(user));
    return user;
  },
  logout() {
    localStorage.removeItem('user');
  }
};

export const periodAPI = {
  async get() {
    const response = await request('/api/period');
    if (!response.ok) throw new Error('Failed to fetch period data');
    return response.json();
  },

  async upsert(data: {
    last_period_date: string;
    cycle_length: number;
    notes?: string;
  }) {
   
    
   
  },
};

export const profileAPI = {
  async get() {
    // profile could be fetched from Students sheet with registration no from localStorage
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    if (!user) throw new Error('Not logged in');
    return user;
  },
  async update(data: any) {
    // implement update in Apps Script if needed; for now return error
    throw new Error('Update not implemented in Sheets backend. Add an Apps Script handler.');
  },
};

export const waterAPI = {
  async log(data: { date: string; glasses: number; target_ml?: number; notes?: string; registrationNo?: string }) {
    return request('addWater', 'POST', data);
  },
  async getToday(date?: string) {
    return request('getTodayWater', 'GET', { date: date || new Date().toLocaleDateString('en-GB').replace(/\//g, '-') }); // dd-mm-yyyy
  },
  async getRange(from?: string, to?: string) {
    // Range queries need to be implemented in Apps Script; fallback: fetch all and filter client-side
    const all = await request('getAllWater'); // implement this action in Apps Script if needed
    // client filter
    return all.filter((r: any) => {
      const d = r.Date; // expect DD-MM-YYYY
      // convert and compare - implement utility in your app
      return true;
    });
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
    return request('deleteExam', 'POST', { id, action: 'deleteExam' });
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
  }
};
