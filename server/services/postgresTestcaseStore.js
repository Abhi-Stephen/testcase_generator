const { getPool, isPostgresEnabled } = require('../config/db');

function createId() {
  return `saved-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function normalizeStoredTestCase(testCase) {
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

function rowToTestCase(row) {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    steps: row.steps || [],
    expectedResult: row.expected_result,
    priority: row.priority,
    type: row.type,
    testData: row.test_data || {},
    sourceRequirement: row.source_requirement || '',
    createdAt: row.created_at
  };
}

async function ensureSchema() {
  const pool = getPool();

  if (!pool) {
    return;
  }

  await pool.query(`
    CREATE TABLE IF NOT EXISTS test_cases (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT NOT NULL DEFAULT '',
      steps JSONB NOT NULL DEFAULT '[]'::jsonb,
      expected_result TEXT NOT NULL DEFAULT '',
      priority TEXT NOT NULL DEFAULT 'Medium',
      type TEXT NOT NULL DEFAULT 'Functional',
      test_data JSONB NOT NULL DEFAULT '{}'::jsonb,
      source_requirement TEXT NOT NULL DEFAULT '',
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);
}

async function readAllTestCases() {
  if (!isPostgresEnabled()) {
    return [];
  }

  await ensureSchema();
  const pool = getPool();
  const result = await pool.query('SELECT * FROM test_cases ORDER BY created_at DESC');
  return result.rows.map(rowToTestCase);
}

async function saveManyTestCases(testCases) {
  if (!isPostgresEnabled()) {
    return [];
  }

  await ensureSchema();
  const pool = getPool();
  const normalizedTestCases = testCases.map(normalizeStoredTestCase);
  const savedTestCases = [];

  for (const testCase of normalizedTestCases) {
    const result = await pool.query(
      `
        INSERT INTO test_cases (
          id, title, description, steps, expected_result, priority, type, test_data, source_requirement, created_at
        )
        VALUES ($1, $2, $3, $4::jsonb, $5, $6, $7, $8::jsonb, $9, $10)
        ON CONFLICT (id) DO NOTHING
        RETURNING *
      `,
      [
        testCase.id,
        testCase.title,
        testCase.description,
        JSON.stringify(testCase.steps),
        testCase.expectedResult,
        testCase.priority,
        testCase.type,
        JSON.stringify(testCase.testData),
        testCase.sourceRequirement,
        testCase.createdAt
      ]
    );

    if (result.rows.length > 0) {
      savedTestCases.push(rowToTestCase(result.rows[0]));
    }
  }

  return savedTestCases;
}

async function deleteTestCaseById(testCaseId) {
  if (!isPostgresEnabled()) {
    return null;
  }

  await ensureSchema();
  const pool = getPool();
  const result = await pool.query('DELETE FROM test_cases WHERE id = $1 RETURNING *', [testCaseId]);

  if (!result.rows.length) {
    return null;
  }

  return rowToTestCase(result.rows[0]);
}

module.exports = {
  readAllTestCases,
  saveManyTestCases,
  deleteTestCaseById
};
