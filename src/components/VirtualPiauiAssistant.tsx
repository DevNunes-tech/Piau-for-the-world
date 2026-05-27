import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { TFunction } from 'i18next'
import { FEATURED_CITIES } from '../data/cities'
import { REGIONS } from '../data/regions'
import { generateGeminiAssistantReply } from '../lib/geminiClient'
import { recordAssistantTurn, recordDeltaMention } from '../lib/gamification'
import '../styles/VirtualPiauiAssistant.css'

type Message = { role: 'user' | 'assistant'; text: string }

function formatReply(sections: { enchant: string; logistics: string; itinerary: string }, t: TFunction): string {
  return [
    `**${t('assistant.headingEnchantment')}:** ${sections.enchant}`,
    `**${t('assistant.headingLogistics')}:** ${sections.logistics}`,
    `**${t('assistant.headingItinerary')}:** ${sections.itinerary}`,
    t('assistant.actionPrompt'),
  ].join('\n\n')
}

function buildReply(raw: string, t: TFunction): string {
  const q = raw.trim()
  const normalized = q
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()

  if (!normalized) {
    return formatReply(
      {
        enchant: t('assistant.reply.empty'),
        logistics: t('assistant.reply.genericLogistics'),
        itinerary: t('assistant.reply.genericItinerary'),
      },
      t,
    )
  }

  const cityMatch = FEATURED_CITIES.find((city) => {
    const cityName = city.name.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
    const cityNickname = city.nickname.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
    return (
      normalized.includes(cityName) ||
      normalized.includes(city.id.toLowerCase()) ||
      normalized.includes(cityNickname)
    )
  })

  if (cityMatch) {
    return formatReply(
      {
        enchant: cityMatch.summary,
        logistics: t('assistant.reply.cityLogistics', { city: cityMatch.name }),
        itinerary: t('assistant.reply.cityItinerary'),
      },
      t,
    )
  }

  if (/\b(bioma|biomas|caatinga|cerrado|cocais|atlantica)\b/.test(normalized)) {
    return formatReply(
      {
        enchant: t('assistant.reply.biomes'),
        logistics: t('assistant.reply.biomesLogistics'),
        itinerary: t('assistant.reply.biomesItinerary'),
      },
      t,
    )
  }
  if (/\b(delta|parnaiba|litoral|praia)\b/.test(normalized)) {
    return formatReply(
      {
        enchant: t('assistant.reply.delta'),
        logistics: t('assistant.reply.deltaLogistics'),
        itinerary: t('assistant.reply.deltaItinerary'),
      },
      t,
    )
  }
  if (/\b(roteiro|itinerario|2 dias|dois dias|programa)\b/.test(normalized)) {
    return formatReply(
      {
        enchant: t('assistant.reply.itinerary'),
        logistics: t('assistant.reply.genericLogistics'),
        itinerary: t('assistant.reply.itineraryItinerary'),
      },
      t,
    )
  }
  if (/\b(professor|professora|escola|pedagogo|pedagoga|educacao ambiental|aluno)\b/.test(normalized)) {
    return formatReply(
      {
        enchant: t('assistant.reply.education'),
        logistics: t('assistant.reply.genericLogistics'),
        itinerary: t('assistant.reply.educationItinerary'),
      },
      t,
    )
  }
  if (/\b(municipio|224|cidade)\b/.test(normalized)) {
    return formatReply(
      {
        enchant: t('assistant.reply.municipalities'),
        logistics: t('assistant.reply.genericLogistics'),
        itinerary: t('assistant.reply.municipalitiesItinerary'),
      },
      t,
    )
  }
  if (/\b(capivara|arqueologia|pre historia|prehistoria|historia)\b/.test(normalized)) {
    return formatReply(
      {
        enchant: t('assistant.reply.capivara'),
        logistics: t('assistant.reply.capivaraLogistics'),
        itinerary: t('assistant.reply.capivaraItinerary'),
      },
      t,
    )
  }
  if (/\b(economia criativa|artesanato|gastronomia|culinaria|comida|restaurante|comer)\b/.test(normalized)) {
    return formatReply(
      {
        enchant: t('assistant.reply.food'),
        logistics: t('assistant.reply.foodLogistics'),
        itinerary: t('assistant.reply.foodItinerary'),
      },
      t,
    )
  }
  if (/\b(hospedagem|hotel|pousada|dormir|onde dormir)\b/.test(normalized)) {
    return formatReply(
      {
        enchant: t('assistant.reply.lodging'),
        logistics: t('assistant.reply.lodgingLogistics'),
        itinerary: t('assistant.reply.lodgingItinerary'),
      },
      t,
    )
  }
  if (/\b(epoca|época|quando ir|melhor epoca|melhor época|clima|tempo)\b/.test(normalized)) {
    return formatReply(
      {
        enchant: t('assistant.reply.season'),
        logistics: t('assistant.reply.seasonLogistics'),
        itinerary: t('assistant.reply.seasonItinerary'),
      },
      t,
    )
  }

  const tokens = normalized.split(/\s+/).filter((w) => w.length > 2)
  for (const region of REGIONS) {
    const regionName = t(region.nameKey)
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
    const regionId = region.id.toLowerCase()
    if (tokens.some((w) => regionId.includes(w) || w.includes(regionId) || regionName.includes(w) || w.includes(regionName))) {
      return formatReply(
        {
          enchant: t('assistant.reply.regionHint', { region: t(region.nameKey) }),
          logistics: t('assistant.reply.genericLogistics'),
          itinerary: t('assistant.reply.regionHintItinerary'),
        },
        t,
      )
    }
  }

  return formatReply(
    {
      enchant: t('assistant.reply.default'),
      logistics: t('assistant.reply.defaultLogistics'),
      itinerary: t('assistant.reply.defaultItinerary'),
    },
    t,
  )
}

type VirtualPiauiAssistantProps = {
  onInteraction?: () => void
}

export default function VirtualPiauiAssistant({ onInteraction }: VirtualPiauiAssistantProps) {
  const { t, i18n } = useTranslation()
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', text: t('assistant.welcome') },
  ])

  const apiKey = import.meta.env.VITE_GEMINI_API_KEY?.trim()

  const QUICK_QUESTIONS = [
    {
      labelKey: 'assistant.quickQuestion1',
      text: 'O que fazer em Pedro II em um fim de semana?',
    },
    {
      labelKey: 'assistant.quickQuestion2',
      text: 'Qual a melhor época para visitar o Delta do Parnaíba?',
    },
    {
      labelKey: 'assistant.quickQuestion3',
      text: 'Conte a história e curiosidades do Parque Nacional Serra da Capivara.',
    },
  ]

  const sendMessage = async (text: string) => {
    const normalizedText = text.trim()
    if (!normalizedText || loading) return

    const lower = normalizedText.toLowerCase()
    if (/\b(delta|parnaíba|parnaiba)\b/.test(lower)) {
      recordDeltaMention()
    }

    const withUser: Message[] = [...messages, { role: 'user', text: normalizedText }]
    setMessages(withUser)
    setInput('')
    setLoading(true)

    let reply: string
    try {
      if (apiKey) {
        reply = await generateGeminiAssistantReply(apiKey, i18n.language, withUser)
      } else {
        reply = buildReply(normalizedText, t)
      }
    } catch {
      reply = apiKey
        ? `${t('assistant.error')}\n\n${buildReply(normalizedText, t)}`
        : buildReply(normalizedText, t)
    }

    setMessages((prev) => [...prev, { role: 'assistant', text: reply }])
    setLoading(false)
    recordAssistantTurn()
    onInteraction?.()
  }

  const send = async () => {
    await sendMessage(input)
  }

  return (
    <div className="virtual-assistant">
      <div className="virtual-assistant-thread" role="log" aria-live="polite">
        {messages.map((m, i) => (
          <div key={`${i}-${m.role}`} className={`virtual-assistant-msg virtual-assistant-msg-${m.role}`}>
            {m.text}
          </div>
        ))}
        {loading && (
          <div className="virtual-assistant-msg virtual-assistant-msg-assistant virtual-assistant-loading">
            {t('assistant.loading')}
          </div>
        )}
      </div>
      <div className="assistant-suggestions" role="group" aria-label={t('assistant.suggestionsLabel')}>
        {QUICK_QUESTIONS.map((item) => (
          <button
            key={item.labelKey}
            type="button"
            className="assistant-suggestion-button"
            onClick={() => void sendMessage(item.text)}
            disabled={loading}
          >
            {t(item.labelKey)}
          </button>
        ))}
      </div>
      <div className="virtual-assistant-input-row">
        <label className="sr-only" htmlFor="assistant-input">
          {t('assistant.inputLabel')}
        </label>
        <input
          id="assistant-input"
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault()
              void send()
            }
          }}
          placeholder={t('assistant.placeholder')}
          autoComplete="off"
          disabled={loading}
        />
        <button type="button" className="virtual-assistant-send" onClick={() => void send()} disabled={loading}>
          {t('assistant.send')}
        </button>
      </div>
    </div>
  )
}
