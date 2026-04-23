async function handleResponse(response) {
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Request failed.');
  }

  return data;
}

export async function generateTestCases(requirement) {
  const response = await fetch('/api/generate-testcases', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ requirement })
  });

  return handleResponse(response);
}

export async function getSavedTestCases() {
  const response = await fetch('/api/testcases');
  return handleResponse(response);
}

export async function saveTestCases(testCases) {
  const response = await fetch('/api/testcases', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ testCases })
  });

  return handleResponse(response);
}

export async function deleteTestCase(testCaseId) {
  const response = await fetch(`/api/testcases/${testCaseId}`, {
    method: 'DELETE'
  });

  return handleResponse(response);
}

export async function getSystemStatus() {
  const response = await fetch('/api/system-status');
  return handleResponse(response);
}