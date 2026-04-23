const { generateStructuredTestCases } = require('../services/aiService');
const {
  readAllTestCases,
  saveManyTestCases,
  deleteTestCaseById
} = require('../services/testcaseRepository');
const { checkDatabaseConnection, isPostgresEnabled } = require('../config/db');

function normalizeIncomingTestCases(body) {
  if (Array.isArray(body)) {
    return body;
  }

  if (body && Array.isArray(body.testCases)) {
    return body.testCases;
  }

  if (body && body.testCase) {
    return [body.testCase];
  }

  if (body && (body.title || body.description || body.steps)) {
    return [body];
  }

  return [];
}

async function generateTestCases(req, res, next) {
  try {
    const { requirement } = req.body;

    if (!requirement || !requirement.trim()) {
      return res.status(400).json({ message: 'Requirement is required.' });
    }

    const testCases = await generateStructuredTestCases(requirement);
    return res.json(testCases);
  } catch (error) {
    return next(error);
  }
}

async function getSavedTestCases(req, res, next) {
  try {
    const testCases = await readAllTestCases();
    return res.json(testCases);
  } catch (error) {
    return next(error);
  }
}

async function saveTestCases(req, res, next) {
  try {
    const incomingTestCases = normalizeIncomingTestCases(req.body);

    if (!incomingTestCases.length) {
      return res.status(400).json({ message: 'At least one test case is required.' });
    }

    const savedTestCases = await saveManyTestCases(incomingTestCases);
    return res.status(201).json(savedTestCases);
  } catch (error) {
    return next(error);
  }
}

async function deleteTestCase(req, res, next) {
  try {
    const { id } = req.params;
    const deletedTestCase = await deleteTestCaseById(id);

    if (!deletedTestCase) {
      return res.status(404).json({ message: 'Test case not found.' });
    }

    return res.json({ message: 'Test case deleted successfully.', deletedTestCase });
  } catch (error) {
    return next(error);
  }
}

async function getSystemStatus(req, res, next) {
  try {
    const storageMode = process.env.STORAGE_MODE || 'json';
    const aiMode = process.env.OPENAI_API_KEY ? 'openai' : 'mock';
    const database = await checkDatabaseConnection();

    return res.json({
      storageMode,
      aiMode,
      postgresEnabled: isPostgresEnabled(),
      database
    });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  generateTestCases,
  getSavedTestCases,
  saveTestCases,
  deleteTestCase,
  getSystemStatus
};