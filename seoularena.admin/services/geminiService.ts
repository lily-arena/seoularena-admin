import { GoogleGenAI } from "@google/genai";

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const fileToGenerativePart = (base64Data: string, mimeType: string) => {
  return {
    inlineData: {
      data: base64Data,
      mimeType
    },
  };
}

export const generateDescriptionForImage = async (base64Image: string, mimeType: string): Promise<string> => {
  try {
    const imagePart = fileToGenerativePart(base64Image, mimeType);
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: { parts: [imagePart, { text: "이 공사 현장 이미지에 대해 주간 진행 보고서용으로 설명해주세요. 주요 구조물과 눈에 띄는 활동에 초점을 맞춰주세요. 이 설명은 alt 텍스트로 사용됩니다." }] },
    });
    return response.text;
  } catch (error) {
    console.error("Error generating description:", error);
    return "설명을 생성하는 데 실패했습니다. 다시 시도해주세요.";
  }
};
