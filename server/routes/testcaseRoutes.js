const express = require('express');
const {
  generateTestCases,
  getSavedTestCases,
  saveTestCases,
  deleteTestCase,
  getSystemStatus
} = require('../controllers/testcaseController');

const router = express.Router();

router.post('/generate-testcases', generateTestCases);
router.get('/testcases', getSavedTestCases);
router.post('/testcases', saveTestCases);
router.delete('/testcases/:id', deleteTestCase);
router.get('/system-status', getSystemStatus);

module.exports = router;