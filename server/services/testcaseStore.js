const fs = require('fs/promises');
const path = require('path');

const DATA_FILE_PATH = path.resolve(__dirname, '..', 'data', 'testcases.json');

function createId() {
  return `saved-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

async function ensureDataFile() {
  try {
    await fs.access(DATA_FILE_PATH);
  } catch (error) {
    await fs.mkdir(path.dirname(DATA_FILE_PATH), { recursive: true });
    await fs.writeFile(DATA_FILE_PATH, '[]', 'utf8');
  }
}

async function readAllTestCases() {
  await ensureDataFile();

  try {
    const fileContent = await fs.readFile(DATA_FILE_PATH, 'utf8');

    if (!fileContent.trim()) {
      return [];
    }

    const parsedContent = JSON.parse(fileContent);
    return Array.isArray(parsedContent) ? parsedContent : [];
  } catch (error) {
    return [];
  }
}

async function writeAllTestCases(testCases) {
  await ensureDataFile();
  await fs.writeFile(DATA_FILE_PATH, JSON.stringify(testCases, null, 2), 'utf8');
}

function normalizeTestCase(testCase) {
  return {
    id: testCase.id || createId(),
    title: testCase.title || 'Untitled test case',
    description: testCase.description || '',
    steps: Array.isArray(testCase.steps) ? testCase.steps : [],
    expectedResult: testCase.expectedResult || '',
    priority: testCase.priority || 'Medium',
    type: testCase.type || 'Functional',
    testData: testCase.testData || {},
    sourceRequirement: testCase.sourceRequirement || '',
    createdAt: testCase.createdAt || new Date().toISOString()
  };
}

async function saveManyTestCases(testCases) {
  const existingTestCases = await readAllTestCases();
  const normalizedIncomingTestCases = testCases.map(normalizeTestCase);
  const existingIds = new Set(existingTestCases.map((testCase) => testCase.id));
  const mergedTestCases = [
    ...existingTestCases,
    ...normalizedIncomingTestCases.filter((testCase) => !existingIds.has(testCase.id))
  ];

  await writeAllTestCases(mergedTestCases);
  return normalizedIncomingTestCases;
}

async function deleteTestCaseById(testCaseId) {
  const existingTestCases = await readAllTestCases();
  const testCaseToDelete = existingTestCases.find((testCase) => testCase.id === testCaseId);

  if (!testCaseToDelete) {
    return null;
  }

  const remainingTestCases = existingTestCases.filter((testCase) => testCase.id !== testCaseId);
  await writeAllTestCases(remainingTestCases);
  return testCaseToDelete;
}

module.exports = {
  readAllTestCases,
  saveManyTestCases,
  deleteTestCaseById
};