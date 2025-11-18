/**
 * AI Configuration for Gemini API
 * This file contains reusable functions for AI operations
 */

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent';

/**
 * Call Gemini API with retry logic
 * @param {string} prompt - The prompt to send to Gemini
 * @param {number} maxRetries - Maximum number of retry attempts (default: 3)
 * @returns {Promise<{success: boolean, data: any, error: string|null}>}
 */
export const callGeminiAPI = async (prompt, maxRetries = 3) => {
  if (!GEMINI_API_KEY) {
    return {
      success: false,
      data: null,
      error: 'Gemini API key is not configured. Please set VITE_GEMINI_API_KEY in your environment variables.'
    };
  }

  const url = `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`;
  
  const payload = {
    contents: [{ parts: [{ text: prompt }] }],
    generationConfig: { responseMimeType: 'application/json' }
  };

  let attempt = 0;
  let waitTime = 1;

  while (attempt < maxRetries) {
    attempt++;

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const httpCode = response.status;
      const result = await response.json();

      if (httpCode >= 200 && httpCode < 300) {
        if (result.candidates?.[0]?.content?.parts?.[0]?.text) {
          const rawResponse = result.candidates[0].content.parts[0].text;
          
          // Clean JSON response (remove markdown code blocks if present)
          let cleanedJson = rawResponse.replace(/^```json\s*/i, '').replace(/\s*```$/, '').trim();
          
          // Try to parse as JSON
          try {
            const parsed = JSON.parse(cleanedJson);
            return { success: true, data: parsed, error: null };
          } catch (parseError) {
            // If parsing fails, return the raw response
            return { success: true, data: rawResponse, error: null };
          }
        } else if (result.error) {
          return {
            success: false,
            data: result,
            error: `API Error: ${result.error.message || 'Unknown API Error'}`
          };
        } else {
          return {
            success: false,
            data: result,
            error: 'Could not parse the API response structure.'
          };
        }
      } else if (httpCode === 503 || httpCode === 429) {
        // Rate limit or service unavailable - retry
        if (attempt < maxRetries) {
          console.warn(`API Error ${httpCode} (Attempt ${attempt}). Retrying in ${waitTime} seconds...`);
          await new Promise(resolve => setTimeout(resolve, waitTime * 1000));
          waitTime *= 2; // Exponential backoff
          continue;
        }
      } else {
        const errorMessage = result.error?.message || `HTTP Error ${httpCode}`;
        return {
          success: false,
          data: result,
          error: `API Error (${errorMessage})`
        };
      }
    } catch (error) {
      if (attempt < maxRetries) {
        console.error(`Request Error (Attempt ${attempt}):`, error);
        await new Promise(resolve => setTimeout(resolve, waitTime * 1000));
        waitTime *= 2;
        continue;
      }
      return {
        success: false,
        data: null,
        error: `Network Error: ${error.message}`
      };
    }
  }

  return {
    success: false,
    data: null,
    error: `The AI service is temporarily unavailable after ${maxRetries} attempts. Please try again later.`
  };
};

/**
 * Parse job posting text to extract structured data
 * @param {string} jobText - The full job posting text
 * @returns {Promise<{success: boolean, data: any, error: string|null}>}
 */
export const parseJobPosting = async (jobText) => {
  const prompt = `
Act as an expert recruitment data parser. I will paste a large block of unstructured text from a job posting. 

Your job is to analyze the text and extract the following fields:

1.  \`job_title\`: The job title (e.g., 'Senior Software Engineer').
2.  \`company\`: The company name. If not found, return 'Not specified'.
3.  \`description\`: A concise summary of the role (2-3 sentences).
4.  \`requirements\`: A JSON array of short bullet-style strings describing responsibilities/qualifications. Each entry should be one requirement (no numbering, no long paragraphs). If not found, return an empty array.
5.  \`salary\`: The salary range (e.g., '$120,000 - $140,000' or 'INR 10 LPA - 15 LPA'). If not found, return 'Not specified'.
6.  \`location\`: The job location (e.g., 'Kochi, Kerala' or 'Remote'). If not found, return 'Not specified'.
7.  \`job_type\`: The employment type (e.g., 'Full-time', 'Contract', 'Internship'). If not found, return 'Full-time'.

Format the entire output as a single, valid JSON object.

Example Output:
{"job_title": "Senior Software Engineer", "company": "Tech Corp", "description": "Lead UI development for fintech products.", "requirements": ["5+ years with React/TypeScript", "Experience with micro frontends", "Strong stakeholder communication"], "salary": "Not specified", "location": "Remote", "job_type": "Full-time"}

Here is the text to parse:

${jobText}
  `;

  return await callGeminiAPI(prompt);
};

/**
 * Extract skills from job description
 * @param {string} jobDescription - The job description text
 * @returns {Promise<{success: boolean, data: any, error: string|null}>}
 */
export const extractSkills = async (jobDescription) => {
  const prompt = `
Act as an expert recruitment analyst. Analyze the following job description.
**Your most important task is to infer skills from responsibilities**, not just list keywords.

For example, if a responsibility is 'Develop new user-facing features', the skills are 'Feature Development' and 'Frontend Development'.
If a responsibility is 'Communicate with stakeholders', the skill is 'Stakeholder Communication'.

Extract the following:

1.  \`technical_skills\`: A list of technical/hard skills (e.g., 'React.js', 'Python', 'Data Analysis', 'Safety Inspections').
2.  \`education\`: The required educational qualifications. If not specified, return 'Not specified'.
3.  \`tools\`: A list of specific software or tools. If not specified, return 'Not specified'.

For each skill in \`technical_skills\`, provide an object with two keys:
1.  \`skill\`: The name of the skill.
2.  \`explanation\`: A brief (max 150 characters) explanation of how this skill is used in the job, based *only* on the description.

Format the entire output as a single valid JSON object.

Example Output:
{
  "technical_skills": [
    {"skill": "React.js", "explanation": "Build and maintain user interface components."},
    {"skill": "Feature Development", "explanation": "Develop new user-facing features."}
  ],
  "education": "Bachelor's Degree in Computer Science",
  "tools": "Git, JIRA"
}

Job Description:

${jobDescription}
  `;

  return await callGeminiAPI(prompt);
};


