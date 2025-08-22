import React, { useRef } from 'react';

const ResumeUpload = ({ file, setFile, text, setText }) => {
  const fileInputRef = useRef(null);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      // Validate file type
      const allowedTypes = [
        'application/pdf',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/msword',
        'text/plain',
      ];

      if (!allowedTypes.includes(selectedFile.type)) {
        alert('Please select a valid file type (PDF, DOCX, DOC, or TXT)');
        return;
      }

      // Validate file size (5MB limit)
      const maxSize = 5 * 1024 * 1024;
      if (selectedFile.size > maxSize) {
        alert('File size must be less than 5MB');
        return;
      }

      setFile(selectedFile);
      setText(''); // Clear text input when file is selected
    }
  };

  const handleTextChange = (event) => {
    setText(event.target.value);
    if (event.target.value.trim()) {
      setFile(null); // Clear file when text is entered
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="resume-upload">
      <h3>📄 Resume Input</h3>

      <div className="upload-options">
        {/* Option 1: Upload File */}
        <div className="option-section">
          <h4>Option 1: Upload File</h4>
          <div className="file-input-container">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".pdf,.docx,.doc,.txt"
              className="file-input"
              id="resume-file"
            />
            <label htmlFor="resume-file" className="file-input-label">
              📎 Choose File
            </label>
            <span className="file-types">
              Supported: PDF, DOCX, DOC, TXT (max 5MB)
            </span>
          </div>

          {file && (
            <div className="file-info">
              <div className="file-details">
                <span className="file-name">📁 {file.name}</span>
                <span className="file-size">({formatFileSize(file.size)})</span>
              </div>
              <button
                type="button"
                onClick={handleRemoveFile}
                className="remove-file-btn"
                title="Remove file"
              >
                ❌
              </button>
            </div>
          )}
        </div>

        <div className="option-divider">
          <span>OR</span>
        </div>

        {/* Option 2: Paste Resume Text */}
        <div className="option-section">
          <h4>Option 2: Paste Resume Text</h4>
          <textarea
            value={text}
            onChange={handleTextChange}
            placeholder="Paste your resume text here..."
            className="resume-textarea"
            rows="8"
            disabled={!!file}
          />
          {text && (
            <div className="text-info">
              <span className="char-count">{text.length} characters</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResumeUpload;
