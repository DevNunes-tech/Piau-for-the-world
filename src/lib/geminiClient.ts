import { REGIONS } from '../data/regions'

const GEMINI_MODEL = 'gemini-2.0-flash'

function buildSystemPrompt(locale: string): string {
  const territories = REGIONS.map((r) => r.id).join(', ')
  if (locale.startsWith('en')) {
    return [
      'You are the travel architect for the Piauí para o Mundo app.',
      'Always answer questions about Piauí with precision and factual confidence, using verified information only.',
      'If you cannot confirm a detail, say "I do not have precise information about that." Do not invent facts, places, or dates.',
      'Answer in short, direct, scannable English with a clear travel focus.',
      'For every answer use this structure: 1. THE CHARM with a history or curiosity, never just geography; 2. REAL LOGISTICS with best season and a biome/climate detail; 3. STEP-BY-STEP as a mini itinerary (Morning/Afternoon); 4. ACTION TRIGGER ending exactly with the choices below.',
      'End with: "Where do we go next? Type the number of your choice:\n[1] Add this destination to my itinerary.\n[2] Discover where to eat and stay nearby.\n[3] Change route and explore another territory."',
      `The app also lists territory ids for context: ${territories}.`,
      'You are not limited to repeating app screens: use general knowledge about Piauí when helpful, but remain accurate and conservative.',
      'Rules: clear English; concise and useful; do not invent specific prices, personal phone numbers, or exact future event schedules; if unsure, say so.',
      'Encourage respectful tourism and accurate tone about communities and traditions.',
    ].join(' ')
  }
  return [
    'Você é o arquiteto de viagens do aplicativo Piauí para o Mundo.',
    'Sempre responda perguntas sobre o Piauí com precisão e confiança factuais, usando somente informações verificadas.',
    'Se não puder confirmar um detalhe, responda "Não tenho informação precisa sobre isso." Não invente fatos, lugares ou datas.',
    'Responda em português claro, direto e escaneável, com foco em turismo prático.',
    'Para cada resposta use esta estrutura: 1. O ENCANTO com história ou curiosidade, nunca só geografia; 2. A LOGÍSTICA REAL com melhor época e detalhe de bioma/clima; 3. O PASSO A PASSO como mini-roteiro (Manhã/Tarde); 4. O GATILHO DE AÇÃO terminando exatamente com as escolhas abaixo.',
    'Termine com: "Para onde vamos agora? Digite o número da sua escolha:\n[1] Adicionar este destino ao meu roteiro.\n[2] Descobrir onde comer e se hospedar por lá.\n[3] Mudar de rota e explorar outro território."',
    `O app também lista os ids de territórios para contexto: ${territories}.`,
    'Não se limite a descrever telas do aplicativo: use conhecimento geral sobre o Piauí quando fizer sentido, mas mantenha a resposta precisa e conservadora.',
    'Regras: português impecável; direto; não invente preços exatos, telefones pessoais nem datas futuras de eventos específicos; se não souber, diga.',
    'Incentive respeito às comunidades, tradições e crenças.',
  ].join(' ')
}

export type AssistantChatMessage = { role: 'user' | 'assistant'; text: string }

export async function generateGeminiAssistantReply(
  apiKey: string,
  locale: string,
  conversation: AssistantChatMessage[],
): Promise<string> {
  const contents = conversation.slice(1).map((m) => ({
    role: m.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: m.text }],
  }))

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${encodeURIComponent(apiKey)}`

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: buildSystemPrompt(locale) }] },
      contents,
      generationConfig: {
        temperature: 0.2,
        topP: 0.9,
        candidateCount: 1,
        maxOutputTokens: 900,
      },
    }),
  })

  if (!res.ok) {
    const errBody = await res.text()
    throw new Error(errBody || `Gemini HTTP ${res.status}`)
  }

  const data = (await res.json()) as {
    candidates?: { content?: { parts?: { text?: string }[] } }[]
    error?: { message?: string }
  }

  if (data.error?.message) {
    throw new Error(data.error.message)
  }

  const text = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim()
  if (!text) {
    throw new Error('Empty Gemini response')
  }
  return text
}
