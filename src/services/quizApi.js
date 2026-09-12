const API_BASE_URL = "http://localhost:5000/api";

const tokensByRole = {};

/**
 * Ensure we have a valid auth token for API calls.
 * Authenticates as test learner or trainer as needed.
 */
export async function getAuthToken(role = 'LEARNER') {
  if (tokensByRole[role]) {
    return tokensByRole[role];
  }

  const credentials =
    role === 'TRAINER'
      ? { email: 'trainer@test.com', password: 'trainer123' }
      : { email: 'learner@test.com', password: 'learner123' };

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

/**
 * Make an authenticated API request to backend.
 */
async function fetchWithAuth(endpoint, options = {}, role = 'LEARNER') {
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

export async function getQuizzes(role = 'TRAINER') {
  const response = await fetchWithAuth('/quizzes', {}, role);
  return response.data || [];
}

export async function getQuiz(quizId, role = 'LEARNER') {
  const response = await fetchWithAuth(`/quizzes/${quizId}`, {}, role);
  return response.data;
}

export async function getQuizQuestions(quizId, role = 'LEARNER') {
  const response = await fetchWithAuth(`/quizzes/${quizId}/questions`, {}, role);
  return response.data || [];
}

export async function getQuizAttempts(quizId, role = 'TRAINER') {
  const response = await fetchWithAuth(`/quizzes/${quizId}/attempts`, {}, role);
  return response.data || [];
}

export async function createQuiz(quizData, role = 'TRAINER') {
  const response = await fetchWithAuth('/quizzes', {
    method: 'POST',
    body: JSON.stringify(quizData),
  }, role);
  return response.data;
}

export async function updateQuiz(quizId, quizData, role = 'TRAINER') {
  const response = await fetchWithAuth(`/quizzes/${quizId}`, {
    method: 'PUT',
    body: JSON.stringify(quizData),
  }, role);
  return response.data;
}

export async function deleteQuiz(quizId, role = 'TRAINER') {
  const response = await fetchWithAuth(`/quizzes/${quizId}`, {
    method: 'DELETE',
  }, role);
  return response.data;
}

export async function addQuestion(quizId, questionData, role = 'TRAINER') {
  const response = await fetchWithAuth(`/quizzes/${quizId}/questions`, {
    method: 'POST',
    body: JSON.stringify(questionData),
  }, role);
  return response.data;
}

export async function updateQuestion(questionId, questionData, role = 'TRAINER') {
  const response = await fetchWithAuth(`/quizzes/questions/${questionId}`, {
    method: 'PUT',
    body: JSON.stringify(questionData),
  }, role);
  return response.data;
}

export async function deleteQuestion(questionId, role = 'TRAINER') {
  const response = await fetchWithAuth(`/quizzes/questions/${questionId}`, {
    method: 'DELETE',
  }, role);
  return response.data;
}

export async function startQuiz(quizId) {
  const response = await fetchWithAuth(`/quizzes/${quizId}/start`, {
    method: "POST",
  });
  return response.data;
}

export async function submitQuiz(attemptId, answers) {
  const response = await fetchWithAuth(`/quizzes/attempts/${attemptId}/submit`, {
    method: "POST",
    body: JSON.stringify({ answers }),
  });
  return response.data;
}

export async function getQuizResult(attemptId, role = 'LEARNER') {
  const response = await fetchWithAuth(`/quizzes/attempts/${attemptId}/result`, {}, role);
  return response.data;
}
