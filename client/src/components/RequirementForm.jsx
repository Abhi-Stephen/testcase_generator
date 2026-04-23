function RequirementForm({ requirement, onRequirementChange, onGenerate, loading }) {
  return (
    <div>
      <div className="section-heading">
        <h2>Requirement Input</h2>
        <p>Enter a user story or requirement to generate structured test cases.</p>
      </div>

      <label className="field-label" htmlFor="requirement">
        Requirement or user story
      </label>
      <textarea
        id="requirement"
        className="textarea"
        rows="6"
        value={requirement}
        onChange={(event) => onRequirementChange(event.target.value)}
        placeholder="Example: User can log in with valid credentials"
      />

      <button className="primary-button" type="button" onClick={onGenerate} disabled={loading}>
        {loading ? 'Generating...' : 'Generate Test Cases'}
      </button>
    </div>
  );
}

export default RequirementForm;