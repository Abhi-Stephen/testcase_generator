function formatTestData(testData) {
  if (typeof testData === 'string') {
    return testData;
  }

  return JSON.stringify(testData, null, 2);
}

function GeneratedTestCases({ testCases, onSaveAll, saving }) {
  return (
    <div>
      <div className="section-heading section-heading-row">
        <div>
          <h2>Generated Test Cases</h2>
          <p>Review the generated output before saving it to local storage.</p>
        </div>
        <button className="secondary-button" type="button" onClick={onSaveAll} disabled={!testCases.length || saving}>
          {saving ? 'Saving...' : 'Save All'}
        </button>
      </div>

      {!testCases.length ? (
        <div className="empty-state">
          <p>No generated test cases yet.</p>
          <span>Generate a requirement to preview structured test cases here.</span>
        </div>
      ) : (
        <div className="testcase-list">
          {testCases.map((testCase, index) => (
            <article className="testcase-card" key={testCase.id || `${testCase.title}-${index}`}>
              <div className="testcase-card-header">
                <h3>{testCase.title}</h3>
                <div className="badge-row">
                  <span className="badge">{testCase.priority}</span>
                  <span className="badge badge-soft">{testCase.type}</span>
                </div>
              </div>

              <p className="testcase-description">{testCase.description}</p>

              <div className="detail-block">
                <h4>Steps</h4>
                <ol>
                  {testCase.steps.map((step, stepIndex) => (
                    <li key={`${testCase.id || index}-step-${stepIndex}`}>{step}</li>
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
      )}
    </div>
  );
}

export default GeneratedTestCases;