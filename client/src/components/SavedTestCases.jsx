import { useEffect, useState } from 'react';
import { deleteTestCase, getSavedTestCases } from '../services/api';

function formatTestData(testData) {
  if (typeof testData === 'string') {
    return testData;
  }

  return JSON.stringify(testData, null, 2);
}

function SavedTestCases({ refreshToken }) {
  const [savedTestCases, setSavedTestCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;

    async function loadSavedTestCases() {
      try {
        setLoading(true);
        setError('');

        const data = await getSavedTestCases();

        if (isMounted) {
          setSavedTestCases(data);
        }
      } catch (loadError) {
        if (isMounted) {
          setError(loadError.message || 'Unable to load saved test cases.');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadSavedTestCases();

    return () => {
      isMounted = false;
    };
  }, [refreshToken]);

  async function handleDelete(testCaseId) {
    const shouldDelete = window.confirm('Delete this saved test case?');

    if (!shouldDelete) {
      return;
    }

    try {
      setError('');
      await deleteTestCase(testCaseId);
      setSavedTestCases((currentTestCases) => currentTestCases.filter((testCase) => testCase.id !== testCaseId));
    } catch (deleteError) {
      setError(deleteError.message || 'Unable to delete the test case.');
    }
  }

  return (
    <div>
      <div className="section-heading">
        <h2>Saved Test Cases</h2>
        <p>These test cases are stored in <strong>server/data/testcases.json</strong>.</p>
      </div>

      {loading ? <div className="empty-state"><p>Loading saved test cases...</p></div> : null}
      {error ? <p className="status error">{error}</p> : null}

      {!loading && !savedTestCases.length ? (
        <div className="empty-state">
          <p>No saved test cases yet.</p>
          <span>Generate and save test cases to see them here.</span>
        </div>
      ) : null}

      <div className="testcase-list">
        {savedTestCases.map((testCase) => (
          <article className="testcase-card" key={testCase.id}>
            <div className="testcase-card-header">
              <h3>{testCase.title}</h3>
              <button className="danger-button" type="button" onClick={() => handleDelete(testCase.id)}>
                Delete
              </button>
            </div>

            <p className="testcase-description">{testCase.description}</p>

            <div className="detail-block">
              <h4>Steps</h4>
              <ol>
                {testCase.steps.map((step, index) => (
                  <li key={`${testCase.id}-saved-step-${index}`}>{step}</li>
                ))}
              </ol>
            </div>

            <div className="detail-block">
              <h4>Expected Result</h4>
              <p>{testCase.expectedResult}</p>
            </div>

            <div className="meta-grid">
              <div>
                <span>Priority</span>
                <strong>{testCase.priority}</strong>
              </div>
              <div>
                <span>Type</span>
                <strong>{testCase.type}</strong>
              </div>
            </div>

            <div className="detail-block">
              <h4>Test Data</h4>
              <pre>{formatTestData(testCase.testData)}</pre>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

export default SavedTestCases;