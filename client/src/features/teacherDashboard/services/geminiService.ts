const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY as string;
if (!GEMINI_API_KEY) throw new Error('Missing VITE_GEMINI_API_KEY in .env');
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${GEMINI_API_KEY}`;


export interface GeminiQuestion {
  text: string;
  type: 'MCQ' | 'Subjective';
  options?: string[];
  answer?: string;
}

export const generateQuestionsFromAI = async (syllabusText: string, count: number = 5): Promise<GeminiQuestion[]> => {
  const prompt = `
    Generate ${count} high-quality educational questions based on this syllabus: "${syllabusText.replace(/"/g, "'")}".
    
    Return the response ONLY as a valid JSON array of objects. 
    Each object must strictly follow this structure:
    {
      "text": "The question text",
      "type": "MCQ" or "Subjective",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "answer": "The exact text of the correct option"
    }
    
    IMPORTANT: 
    1. Ensure the JSON is perfectly valid.
    2. Double escape any quotes within strings (e.g., use \\" instead of ").
    3. Do not include any conversational text or markdown blocks (like \`\`\`json). Just the raw array.
    4. For Subjective questions, omit "options" and "answer" fields.
  `;

  try {
    const response = await fetch(GEMINI_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt,
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.4, // Lower temperature for more consistent JSON
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 4096,
        },
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || 'Failed to generate questions');
    }

    let textResponse = data.candidates[0].content.parts[0].text;

    // Clean up response: remove markdown code blocks if present
    textResponse = textResponse.replace(/```json\n?|```/g, '').trim();

    // Find the first '[' and last ']' to isolate the array
    const startIdx = textResponse.indexOf('[');
    const endIdx = textResponse.lastIndexOf(']');

    if (startIdx === -1 || endIdx === -1) {
      throw new Error('AI failed to produce a valid question list. Please try again.');
    }

    const cleanJson = textResponse.substring(startIdx, endIdx + 1);

    try {
      return JSON.parse(cleanJson);
    } catch (parseError) {
      console.error('JSON Parse Error. Raw content:', cleanJson);
      throw new Error('AI response was malformed. Please try again with different syllabus content.');
    }
  } catch (error) {
    console.error('Gemini API Error:', error);
    throw error;
  }
};

/**
 * Convert a File object to a base64 string (data URL stripped of prefix).
 */
const fileToBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      // Strip "data:<mime>;base64," prefix
      resolve(result.split(',')[1]);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

/**
 * Generate questions by reading a syllabus image via Gemini Vision.
 */
export const generateQuestionsFromImage = async (
  imageFile: File,
  count: number = 5
): Promise<GeminiQuestion[]> => {
  const base64Data = await fileToBase64(imageFile);

  const prompt = `This image contains a syllabus or study material. Extract the content and generate ${count} high-quality educational questions from it.

    Return the response ONLY as a valid JSON array of objects.
    Each object must strictly follow this structure:
    {
      "text": "The question text",
      "type": "MCQ" or "Subjective",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "answer": "The exact text of the correct option"
    }

    IMPORTANT:
    1. Ensure the JSON is perfectly valid.
    2. Do not include any conversational text or markdown blocks. Just the raw JSON array.
    3. For Subjective questions, omit "options" and "answer" fields.`;

  try {
    const response = await fetch(GEMINI_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                inline_data: {
                  mime_type: imageFile.type,
                  data: base64Data,
                },
              },
              { text: prompt },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.4,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 4096,
        },
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || 'Failed to generate questions from image');
    }

    let textResponse = data.candidates[0].content.parts[0].text;
    textResponse = textResponse.replace(/```json\n?|```/g, '').trim();

    const startIdx = textResponse.indexOf('[');
    const endIdx = textResponse.lastIndexOf(']');

    if (startIdx === -1 || endIdx === -1) {
      throw new Error('AI failed to produce a valid question list. Please try again.');
    }

    const cleanJson = textResponse.substring(startIdx, endIdx + 1);

    try {
      return JSON.parse(cleanJson);
    } catch (parseError) {
      console.error('JSON Parse Error. Raw content:', cleanJson);
      throw new Error('AI response was malformed. Please try again with a clearer image.');
    }
  } catch (error) {
    console.error('Gemini Vision API Error:', error);
    throw error;
  }
};
