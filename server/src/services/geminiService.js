// backend/src/services/geminiService.js
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

if (!process.env.GEMINI_API_KEY) {
  console.error('❌ GEMINI_API_KEY is not set in environment variables');
  throw new Error('GEMINI_API_KEY is required');
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export async function analyzeResumeMatch(resumeText, jobDescription) {
  const prompt = `
Given the following **resume** and **job description**, do the following:
1. Analyze how well the resume matches the job description (consider skills, experience, keywords, and requirements).
2. Provide a **percentage match score** (as a number from 0 to 100).
3. Suggest at least 5 **keywords or phrases** from the job description that are missing or weak in the resume and should be added to improve its relevance.
4. List a few concise suggestions on how the resume can be improved for this specific job.

**Format your response strictly as valid JSON:**

{
  "match_score": <score as integer 0-100>,
  "missing_keywords": [ "keyword1", "keyword2", "keyword3", "keyword4", "keyword5" ],
  "suggestions": [ "improvement suggestion 1", "improvement suggestion 2", "improvement suggestion 3", "improvement suggestion 4" ]
}

**Resume:**
${resumeText}

**Job Description:**
${jobDescription}

Important: Respond with ONLY the JSON object, no additional text or formatting.
`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text().trim();
    
    // Clean up the response - remove any markdown formatting
    text = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    
    // Parse JSON response
    let analysis;
    try {
      analysis = JSON.parse(text);
    } catch (parseError) {
      console.error('JSON Parse Error:', parseError);
      console.error('Raw response:', text);
      
      // Fallback parsing - try to extract JSON from response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        analysis = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('Invalid JSON response from Gemini API');
      }
    }

    // Validate the response structure
    if (!analysis.match_score && analysis.match_score !== 0) {
      throw new Error('Invalid response: missing match_score');
    }
    
    if (!Array.isArray(analysis.missing_keywords)) {
      throw new Error('Invalid response: missing_keywords should be an array');
    }
    
    if (!Array.isArray(analysis.suggestions)) {
      throw new Error('Invalid response: suggestions should be an array');
    }

    // Ensure match_score is within valid range
    analysis.match_score = Math.max(0, Math.min(100, parseInt(analysis.match_score)));

    // Ensure we have at least 5 missing keywords
    if (analysis.missing_keywords.length < 5) {
      const additionalKeywords = Array(5 - analysis.missing_keywords.length).fill('Additional relevant keywords');
      analysis.missing_keywords = [...analysis.missing_keywords, ...additionalKeywords];
    }

    // Ensure we have at least 3 suggestions
    if (analysis.suggestions.length < 3) {
      const additionalSuggestions = Array(3 - analysis.suggestions.length).fill('Additional improvement suggestion');
      analysis.suggestions = [...analysis.suggestions, ...additionalSuggestions];
    }

    return analysis;

  } catch (error) {
    console.error('Gemini API Error:', error);
    
    // Return a fallback response if API fails
    return {
      match_score: 0,
      missing_keywords: [
        'API Error - Unable to analyze',
        'Please check your Gemini API key',
        'Retry the analysis',
        'Contact support if issue persists',
        'Fallback response'
      ],
      suggestions: [
        'Unable to analyze due to API error. Please try again.',
        'Ensure your Gemini API key is valid and has sufficient quota.',
        'If the problem persists, please contact support.'
      ]
    };
  }
}