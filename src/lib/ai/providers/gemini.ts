import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

export async function callGemini(
  systemPrompt: string,
  userPrompt: string,
  options: {
    temperature?: number
    maxTokens?: number
  } = {}
): Promise<{ output: string; tokens: number; latency: number; provider: string }> {
  const start = Date.now()

  const model = genAI.getGenerativeModel({
    model: 'gemini-1.5-flash',
    systemInstruction: systemPrompt,
    safetySettings: [
      {
        category: HarmCategory.HARM_CATEGORY_HARASSMENT,
        threshold: HarmBlockThreshold.BLOCK_NONE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
        threshold: HarmBlockThreshold.BLOCK_NONE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
        threshold: HarmBlockThreshold.BLOCK_NONE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
        threshold: HarmBlockThreshold.BLOCK_NONE,
      },
    ],
    generationConfig: {
      temperature: options.temperature ?? 0.4,
      maxOutputTokens: options.maxTokens ?? 4000,
    },
  })

  try {
    const result = await model.generateContent(userPrompt)
    return {
      output: result.response.text(),
      tokens: result.response.usageMetadata?.totalTokenCount ?? 0,
      latency: Date.now() - start,
      provider: 'gemini',
    }
  } catch (error: any) {
    throw new Error(`Gemini failed: ${error.message}`)
  }
}
