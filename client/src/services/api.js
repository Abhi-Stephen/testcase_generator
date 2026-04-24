const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

async function handleResponse(response) {
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Request failed.');
  }

  return data;
}

export async function generateTestCases(requirement) {
  const response = await fetch(`${API_BASE_URL}/api/generate-testcases`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ requirement })
  });

  return handleResponse(response);
}

export async function getSavedTestCases() {
  const response = await fetch(`${API_BASE_URL}/api/testcases`);
  return handleResponse(response);
}

export async function saveTestCases(testCases) {
  const response = await fetch(`${API_BASE_URL}/api/testcases`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ testCases })
  });

  return handleResponse(response);
}

export async function deleteTestCase(testCaseId) {
  const response = await fetch(`${API_BASE_URL}/api/testcases/${testCaseId}`, {
    method: 'DELETE'
  });

  return handleResponse(response);
}

export async function getSystemStatus() {
  const response = await fetch(`${API_BASE_URL}/api/system-status`);
  return handleResponse(response);
}