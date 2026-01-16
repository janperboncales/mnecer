import { GoogleGenAI, Type } from "@google/genai";
import { Question, QuestionType, Answer, UserData } from "../types";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const generateQuestionsForSymptom = async (symptomName: string): Promise<Question[]> => {
  // If no API key, return mock data for demo purposes
  if (!apiKey) {
    console.warn("No API Key found. Returning mock questions.");
    return [
      { id: 'q1', text: `Do you have a high temperature related to your ${symptomName}?`, type: QuestionType.YES_NO },
      { id: 'q2', text: 'When did the symptoms first start?', type: QuestionType.DATE },
      { id: 'q3', text: 'How severe is the pain on a scale of 1-10?', type: QuestionType.CHOICE, options: ['1-3', '4-7', '8-10'] },
      { id: 'q4', text: 'Are you taking any medication currently?', type: QuestionType.YES_NO },
      { id: 'q5', text: 'Describe your symptoms in more detail.', type: QuestionType.TEXT },
    ];
  }

  try {
    const model = 'gemini-3-flash-preview';
    const schema = {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          text: { type: Type.STRING },
          type: { type: Type.STRING, enum: ['YES_NO', 'TEXT', 'DATE', 'CHOICE'] },
          options: { type: Type.ARRAY, items: { type: Type.STRING }, nullable: true }
        },
        required: ['id', 'text', 'type']
      }
    };

    const response = await ai.models.generateContent({
      model,
      contents: `Generate a list of 5 to 7 medical screening questions for a patient complaining of "${symptomName}". 
      These questions are for a preliminary online medical certificate assessment.
      Ensure a mix of Yes/No, Date, and Choice questions.
      Return strictly JSON.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: schema,
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as Question[];
    }
    throw new Error("Empty response from AI");

  } catch (error) {
    console.error("Gemini Error:", error);
    // Fallback
    return [
      { id: 'q1', text: `Have you experienced this ${symptomName} before?`, type: QuestionType.YES_NO },
      { id: 'q2', text: 'When did it start?', type: QuestionType.DATE },
      { id: 'q3', text: 'Briefly describe your condition.', type: QuestionType.TEXT },
    ];
  }
};

export const generateCertificateText = async (userData: UserData, symptom: string, answers: Answer[]): Promise<string> => {
  if (!apiKey) {
    return `This is a simulated certificate for ${userData.fullName}. \nCondition: ${symptom}.\nStatus: Review Pending.`;
  }

  try {
    const answerSummary = answers.map(a => `Q: ${a.questionText} A: ${a.answer}`).join('\n');
    
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Write a formal Medical Certificate text (not a full layout, just the body text) for:
      Patient: ${userData.fullName}
      DOB: ${userData.dob}
      Complaint: ${symptom}
      
      Based on these patient answers:
      ${answerSummary}
      
      The certificate should sound professional, state that the patient has been assessed online, and recommend a rest period of 1-2 days if appropriate based on the answers. Keep it concise.`,
    });

    return response.text || "Certificate generation failed.";

  } catch (error) {
    console.error("Gemini Certificate Error", error);
    return "Error generating certificate. Please contact support.";
  }
};
