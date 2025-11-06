// ✅ sheetApiClient.ts – Final version (no backend needed)
// const SCRIPT_URL =
//   'https://script.google.com/macros/s/AKfycbxr4TIUZUVXn-SY8QJZivrrTmDoqrqR_ghOOTVgCnK9gqE8X_aCFEFowQIWR1DNgL-z/exec';

// // Go through a public proxy to add CORS headers automatically
// const API_BASE_URL = 'https://corsproxy.io/?' + encodeURIComponent(SCRIPT_URL);

const API_BASE_URL = "https://script.google.com/macros/s/AKfycbxd1FXLKFTmmGmHFJt0IoVxAi8IOe4PuS3vUppTm0rbLr4KpKULvsgN-gKb1pLF060N/exec";

// Shared request helper
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
    // Use text/plain to avoid preflight OPTIONS (Apps Script limitation)
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

/* -------------------- AUTH API -------------------- */
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
    // You’ll need a Google Apps Script handler for `addStudent`
    const response = await request('addStudent', 'POST', data);
    localStorage.setItem('user', JSON.stringify(response));
    return response;
  },

  logout() {
    localStorage.removeItem('user');
  },
};


/* -------------------- PROFILE API -------------------- */
export const profileAPI = {
  async get() {
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    if (!user) throw new Error('Not logged in');
    return user;
  },
  async update() {
    throw new Error('Profile update not implemented in Sheets backend.');
  },
};

/* -------------------- WATER API -------------------- */
export const waterAPI = {
  async log(data: { date: string; glasses: number; target_ml?: number; notes?: string; registrationNo?: string }) {
    return request('addWater', 'POST', data);
  },
  async getToday(date?: string) {
    const today = date || new Date().toLocaleDateString('en-GB').replace(/\//g, '-'); // dd-mm-yyyy
    return request('getTodayWater', 'GET', { date: today });
  },
};

/* -------------------- EXAMS API -------------------- */
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

/* -------------------- PUSH API -------------------- */
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
