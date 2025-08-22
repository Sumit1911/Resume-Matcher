import React, { useState } from 'react';
import ResumeUpload from './components/ResumeUpload.jsx';
import JobDescriptionInput from './components/JobDescriptionInput.jsx';
import MatchResult from './components/MatchResult';
import LoadingSpinner from './components/LoadingSpinner';
import { analyzeResume } from './services/api';
import './App.css';

function App() {
  const [resumeFile, setResumeFile] = useState(null);
  const [resumeText, setResumeText] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAnalyze = async () => {
    if (!jobDescription.trim()) {
      setError('Please enter a job description');
      return;
    }

    if (!resumeFile && !resumeText.trim()) {
      setError('Please upload a resume file or paste resume text');
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const analysisResult = await analyzeResume({
        resumeFile,
        resumeText,
        jobDescription
      });

      setResult(analysisResult);
    } catch (err) {
      console.error('Analysis error:', err);
      setError(err.message || 'Failed to analyze resume. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setResumeFile(null);
    setResumeText('');
    setJobDescription('');
    setResult(null);
    setError('');
  };

  return (
    <div className="app">
      <div className="container">
        <header className="header">
          <h1>🎯 Resume Matcher</h1>
          <p>Analyze how well your resume matches a job description and get improvement suggestions</p>
        </header>

        <div className="main-content">
          <div className="input-section">
            <div className="input-group">
              <ResumeUpload 
                file={resumeFile}
                setFile={setResumeFile}
                text={resumeText}
                setText={setResumeText}
              />
            </div>

            <div className="input-group">
              <JobDescriptionInput 
                value={jobDescription}
                onChange={setJobDescription}
              />
            </div>

            {error && (
              <div className="error-message">
                <span className="error-icon">⚠️</span>
                {error}
              </div>
            )}

            <div className="button-group">
              <button 
                className="analyze-btn"
                onClick={handleAnalyze}
                disabled={loading}
              >
                {loading ? 'Analyzing...' : '🔍 Analyze Match'}
              </button>

              <button 
                className="reset-btn"
                onClick={handleReset}
                disabled={loading}
              >
                🔄 Reset
              </button>
            </div>
          </div>

          {loading && <LoadingSpinner />}

          {result && (
            <div className="result-section">
              <MatchResult result={result} />
            </div>
          )}
        </div>

        <footer className="footer">
          <p className="fancy-footer">🚀 Made with ❤️ by Sumit</p>
        </footer>
      </div>
    </div>
  );
}

export default App;