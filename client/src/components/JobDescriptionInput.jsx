import React from 'react';

const JobDescriptionInput = ({ value, onChange }) => {
  const handleChange = (event) => {
    onChange(event.target.value);
  };

  const handleClear = () => {
    onChange('');
  };

  return (
    <div className="job-description-input">
      <div className="input-header">
        <h3>💼 Job Description</h3>
        {value && (
          <button 
            type="button"
            onClick={handleClear}
            className="clear-btn"
            title="Clear job description"
          >
            🗑️ Clear
          </button>
        )}
      </div>
      
      <textarea
        value={value}
        onChange={handleChange}
        placeholder="Paste the job description here...
            Example:
            We are looking for a Senior Software Engineer with experience in:
            - React.js and Node.js
            - Database management (MySQL, MongoDB)
            - Cloud platforms (AWS, Azure)
            - Agile development methodologies
            - 5+ years of experience in full-stack development
            ..."
        className="job-description-textarea"
        rows="10"
      />
      
      {value && (
        <div className="input-info">
          <span className="char-count">
            {value.length} characters
          </span>
          <span className="word-count">
            {value.split(/\s+/).filter(word => word.length > 0).length} words
          </span>
        </div>
      )}
      
      <div className="input-tips">
        <p><strong>💡 Tip:</strong> Include the complete job description with requirements, skills, and qualifications for better matching accuracy.</p>
      </div>
    </div>
  );
};

export default JobDescriptionInput;