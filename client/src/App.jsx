import { useState } from 'react';
import RequirementForm from './components/RequirementForm.jsx';
import GeneratedTestCases from './components/GeneratedTestCases.jsx';
import SavedTestCases from './components/SavedTestCases.jsx';
import { generateTestCases, getSystemStatus, saveTestCases } from './services/api';

const defaultRequirement = 'User can log in with valid credentials';

function App() {
  const [requirement, setRequirement] = useState(defaultRequirement);
  const [generatedTestCases, setGeneratedTestCases] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [savedRefreshToken, setSavedRefreshToken] = useState(0);
  const [systemStatus, setSystemStatus] = useState(null);
  const [systemStatusError, setSystemStatusError] = useState('');
  const [checkingSystemStatus, setCheckingSystemStatus] = useState(false);

  async function handleGenerateTestCases() {
    if (!requirement.trim()) {
      setErrorMessage('Please enter a requirement or user story first.');
      setStatusMessage('');
      return;
    }

    try {
      setLoading(true);
      setErrorMessage('');
      setStatusMessage('');

      const testCases = await generateTestCases(requirement);
      setGeneratedTestCases(testCases);
      setStatusMessage(`Generated ${testCases.length} test cases.`);
    } catch (error) {
      setErrorMessage(error.message || 'Unable to generate test cases.');
      setGeneratedTestCases([]);
    } finally {
      setLoading(false);
    }
  }

  async function handleSaveAll() {
    if (!generatedTestCases.length) {
      return;
    }

    try {
      setSaving(true);
      setErrorMessage('');
      setStatusMessage('');

      await saveTestCases(generatedTestCases);
      setStatusMessage('Generated test cases were saved successfully.');
      setSavedRefreshToken((currentValue) => currentValue + 1);
    } catch (error) {
      setErrorMessage(error.message || 'Unable to save test cases.');
    } finally {
      setSaving(false);
    }
  }

  async function handleCheckSystemStatus() {
    try {
      setCheckingSystemStatus(true);
      setSystemStatusError('');
      const status = await getSystemStatus();
      setSystemStatus(status);
    } catch (error) {
      setSystemStatus(null);
      setSystemStatusError(error.message || 'Unable to fetch system status.');
    } finally {
      setCheckingSystemStatus(false);
    }
  }

  return (
    <div className="app-shell">
      <header className="hero">
        <div>
          <p className="eyebrow">Phase 2 MVP</p>
          <h1>AI Test Case Generator</h1>
          <p className="hero-copy">
            Turn a requirement or user story into structured test cases and manage them with
            JSON or PostgreSQL storage.
          </p>
        </div>
        <div className="hero-panel">
          <span>AI + Storage Health</span>
          <strong>Check active mode in one click</strong>
          <button
            className="hero-status-button"
            type="button"
            onClick={handleCheckSystemStatus}
            disabled={checkingSystemStatus}
          >
            {checkingSystemStatus ? 'Checking...' : 'Refresh Status'}
          </button>
          {systemStatus ? (
            <div className="hero-status-grid">
              <p>
                <strong>AI:</strong> {systemStatus.aiMode}
              </p>
              <p>
                <strong>Storage:</strong> {systemStatus.storageMode}
              </p>
              <p>
                <strong>DB:</strong> {systemStatus.database.connected ? 'connected' : 'not connected'}
              </p>
              <p className="hero-status-message">{systemStatus.database.message}</p>
            </div>
          ) : null}
          {systemStatusError ? <p className="hero-status-error">{systemStatusError}</p> : null}
        </div>
      </header>

      <main className="content-grid">
        <section className="card">
          <RequirementForm
            requirement={requirement}
            onRequirementChange={setRequirement}
            onGenerate={handleGenerateTestCases}
            loading={loading}
          />
          {statusMessage ? <p className="status success">{statusMessage}</p> : null}
          {errorMessage ? <p className="status error">{errorMessage}</p> : null}
        </section>

        <section className="card">
          <GeneratedTestCases
            testCases={generatedTestCases}
            onSaveAll={handleSaveAll}
            saving={saving}
          />
        </section>

        <section className="card card-wide">
          <SavedTestCases refreshToken={savedRefreshToken} />
        </section>
      </main>
    </div>
  );
}

export default App;