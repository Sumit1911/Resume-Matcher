# 🎯 Resume Matcher

A full-stack web application that uses AI to analyze how well your resume matches a job description and provides actionable improvement suggestions.

## ✨ Features

- **📄 Multiple Resume Input Options**: Upload PDF, DOCX, DOC, TXT files or paste text directly
- **🤖 AI-Powered Analysis**: Uses Google Gemini API for intelligent resume matching
- **📊 Match Scoring**: Get a percentage match score (0-100%) with visual indicators
- **🔍 Missing Keywords Detection**: Identifies important keywords from job descriptions that are missing in your resume
- **💡 Improvement Suggestions**: Receives specific, actionable suggestions to enhance your resume
- **📱 Responsive Design**: Works perfectly on desktop, tablet, and mobile devices
- **⚡ Real-time Processing**: Fast analysis with loading indicators and progress tracking
- **📋 Export Results**: Copy results to clipboard or download as JSON

## 🛠️ Tech Stack

### Frontend
- **React 18** with Vite for fast development
- **Modern CSS** with responsive design
- **Axios** for API communication
- **File Upload** with drag-and-drop support

### Backend
- **Node.js** with Express.js
- **Google Gemini AI** for resume analysis
- **Multer** for file upload handling
- **PDF-Parse** for PDF text extraction
- **Mammoth** for Word document processing
- **CORS** enabled for cross-origin requests

## 🚀 Quick Start

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Google Gemini API key

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/resume-matcher.git
cd resume-matcher
```

### 2. Backend Setup

```bash
cd backend
npm install

# Create environment file
cp .env.example .env
```

Edit the `.env` file and add your Gemini API key:

```env
GEMINI_API_KEY=your_gemini_api_key_here
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

### 3. Frontend Setup

```bash
cd ../frontend
npm install

# Create environment file (optional)
echo "VITE_API_URL=http://localhost:5000" > .env.local
```

### 4. Get Your Gemini API Key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Copy the key and paste it in your backend `.env` file

### 5. Start the Application

**Terminal 1 - Start Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Start Frontend:**
```bash
cd frontend
npm run dev
```

The application will be available at:
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000


## 🔧 API Endpoints

### Health Check
```
GET /health
```

### Analyze Resume
```
POST /api/resume/analyze
Content-Type: multipart/form-data

Body:
- resume: File (optional) - Resume file (PDF, DOCX, DOC, TXT)
- resumeText: String (optional) - Resume text content
- jobDescription: String (required) - Job description text

```

## 💻 Usage

1. **Upload Resume**: Either upload a file (PDF, DOCX, DOC, TXT) or paste your resume text
2. **Enter Job Description**: Paste the complete job description including requirements and skills
3. **Analyze**: Click "Analyze Match" to get AI-powered insights
4. **Review Results**: 
   - See your match score percentage
   - Review missing keywords that should be added
   - Read specific improvement suggestions
   - Export results for future reference

## 🎨 Features in Detail

### Resume Input Options
- **File Upload**: Support for PDF, DOCX, DOC, and TXT files (up to 5MB)
- **Text Input**: Direct paste option with character counting
- **File Validation**: Automatic file type and size validation
- **Text Extraction**: Robust text extraction from various document formats

### AI Analysis
- **Smart Matching**: Advanced algorithm that considers skills, experience, and keywords
- **Contextual Understanding**: AI understands job requirements beyond simple keyword matching
- **Scoring Algorithm**: Comprehensive scoring based on multiple factors
- **Detailed Feedback**: Specific, actionable suggestions for improvement

### User Experience
- **Responsive Design**: Works seamlessly on all device sizes
- **Loading Indicators**: Clear progress feedback during analysis
- **Error Handling**: Helpful error messages and recovery suggestions
- **Export Options**: Save results for later reference

## 🔒 Security & Privacy

- Uploaded files are temporarily stored and automatically deleted after processing
- No resume content is permanently stored on servers
- API keys are securely managed through environment variables
- CORS protection for secure cross-origin requests

## 🚀 Deployment

### Frontend Deployment (Vercel)

```bash
cd frontend
npm run build
```

Deploy the `dist` folder to your preferred hosting platform.

### Backend Deployment (Heroku/Railway/DigitalOcean)

1. Set environment variables in your deployment platform
2. Ensure `NODE_ENV=production`
3. The app will start with `npm start`

### Environment Variables for Production

```env
GEMINI_API_KEY=your_actual_api_key
PORT=5000
NODE_ENV=production
FRONTEND_URL=https://your-frontend-domain.com
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues:

1. Check that your Gemini API key is valid and has sufficient quota
2. Ensure all dependencies are properly installed
3. Verify that both frontend and backend servers are running
4. Check the console for any error messages

For additional help, please open an issue in the GitHub repository.

## 🙏 Acknowledgments

- Google Gemini API for AI-powered analysis
- React community for excellent documentation
- Open source libraries that made this project possible

---

**Made with ❤️ by Sumit

*Transform your job applications with AI-powered resume optimization!*