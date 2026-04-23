const jsonStore = require('./testcaseStore');
const postgresStore = require('./postgresTestcaseStore');
const { isPostgresEnabled } = require('../config/db');

function usePostgres() {
  return isPostgresEnabled();
}

async function readAllTestCases() {
  if (usePostgres()) {
    return postgresStore.readAllTestCases();
  }

  return jsonStore.readAllTestCases();
}

async function saveManyTestCases(testCases) {
  if (usePostgres()) {
    return postgresStore.saveManyTestCases(testCases);
  }

  return jsonStore.saveManyTestCases(testCases);
}

async function deleteTestCaseById(testCaseId) {
  if (usePostgres()) {
    return postgresStore.deleteTestCaseById(testCaseId);
  }

  return jsonStore.deleteTestCaseById(testCaseId);
}

module.exports = {
  readAllTestCases,
  saveManyTestCases,
  deleteTestCaseById
};
