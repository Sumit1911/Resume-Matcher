import React from 'react';

const LoadingSpinner = () => {
  return (
    <div className="loading-container">
      <div className="spinner"></div>
      {/* <div className="loading-spinner"> */}
        <div className="loading-text">
          <h3>🔍 Analyzing Your Resume...</h3>
          <p>This may take a few moments while we compare your resume with the job description</p>
          <div className="loading-steps">
            <div className="loading-step">📄 Processing resume content</div>
            <div className="loading-step">💼 Analyzing job requirements</div>
            <div className="loading-step">🤖 Generating match insights</div>
            <div className="loading-step">📊 Calculating match score</div>
          </div>
        </div>
      {/* </div> */}
    </div>
  );
};

export default LoadingSpinner;