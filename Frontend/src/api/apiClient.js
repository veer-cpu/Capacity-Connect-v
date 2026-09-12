const API_BASE_URL = "http://localhost:5000/api";

const tokensByRole = {};

export async function getAuthToken(role = 'LEARNER') {
  const storedToken = localStorage.getItem("token");
  const storedUser = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null;

  if (storedToken && (!storedUser || storedUser.role?.toUpperCase() === role.toUpperCase())) {
    return storedToken;
  }

  if (tokensByRole[role]) {
    return tokensByRole[role];
  }

  const credentials =
    role === 'TRAINER'
      ? { email: 'trainer@test.com', password: 'password123' }
      : { email: 'learner@test.com', password: 'password123' };

  try {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    const data = await res.json();

    if (data.success && data.data?.token) {
      tokensByRole[role] = data.data.token;
      return tokensByRole[role];
    }
  } catch (err) {
    console.error(`Failed to authenticate as ${role}:`, err);
  }

  return null;
}

export async function apiFetch(endpoint, options = {}, role = 'LEARNER') {
  const token = await getAuthToken(role);

  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || `API error: ${response.status}`);
  }

  return data;
}

export default {
  apiFetch,
  getAuthToken,
};
