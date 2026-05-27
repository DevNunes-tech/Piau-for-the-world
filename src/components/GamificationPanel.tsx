import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { loadGamification, recordQuizScore, type BadgeId } from '../lib/gamification'
import '../styles/GamificationPanel.css'

const QUIZ = [
  { qKey: 'quiz.q1', options: ['quiz.q1a', 'quiz.q1b', 'quiz.q1c'] as const, correct: 1 },
  { qKey: 'quiz.q2', options: ['quiz.q2a', 'quiz.q2b', 'quiz.q2c'] as const, correct: 0 },
  { qKey: 'quiz.q3', options: ['quiz.q3a', 'quiz.q3b', 'quiz.q3c'] as const, correct: 2 },
] as const

type GamificationPanelProps = {
  version: number
  onUpdate?: () => void
}

export default function GamificationPanel({ version, onUpdate }: GamificationPanelProps) {
  const { t } = useTranslation()
  const [answers, setAnswers] = useState<(number | null)[]>(() => QUIZ.map(() => null))
  const [submitted, setSubmitted] = useState(false)

  const state = useMemo(() => loadGamification(), [version])

  const score = useMemo(() => {
    if (!submitted) return 0
    return answers.reduce<number>(
      (acc, a, i) => acc + (a !== null && a === QUIZ[i].correct ? 1 : 0),
      0,
    )
  }, [answers, submitted])

  const submitQuiz = () => {
    const s = answers.reduce<number>(
      (acc, a, i) => acc + (a !== null && a === QUIZ[i].correct ? 1 : 0),
      0,
    )
    recordQuizScore(s, QUIZ.length)
    setSubmitted(true)
    onUpdate?.()
  }

  const resetQuiz = () => {
    setAnswers(QUIZ.map(() => null))
    setSubmitted(false)
  }

  const badges: { id: BadgeId; labelKey: string }[] = [
    { id: 'first_steps', labelKey: 'badge.first_steps' },
    { id: 'map_explorer', labelKey: 'badge.map_explorer' },
    { id: 'itinerary_builder', labelKey: 'badge.itinerary_builder' },
    { id: 'assistant_friend', labelKey: 'badge.assistant_friend' },
    { id: 'quiz_guardian', labelKey: 'badge.quiz_guardian' },
    { id: 'delta_voice', labelKey: 'badge.delta_voice' },
  ]

  return (
    <div className="gamification-panel">
      <div className="gamification-summary">
        <strong>{t('lab.points')}</strong>
        <span className="gamification-points">{state.points}</span>
      </div>

      <h3 className="gamification-subtitle">{t('lab.badgesTitle')}</h3>
      <ul className="gamification-badges">
        {badges.map((b) => (
          <li key={b.id} className={state.badges.includes(b.id) ? 'unlocked' : 'locked'}>
            <span className="gamification-badge-icon" aria-hidden="true">
              {state.badges.includes(b.id) ? '★' : '○'}
            </span>
            {t(b.labelKey)}
          </li>
        ))}
      </ul>

      <h3 className="gamification-subtitle">{t('lab.quizTitle')}</h3>
      <p className="gamification-quiz-intro">{t('lab.quizIntro')}</p>
      <ol className="gamification-quiz">
        {QUIZ.map((item, qi) => (
          <li key={item.qKey}>
            <p>{t(item.qKey)}</p>
            <div className="gamification-quiz-options">
              {item.options.map((opt, oi) => (
                <label key={opt} className="gamification-quiz-option">
                  <input
                    type="radio"
                    name={`quiz-${qi}`}
                    checked={answers[qi] === oi}
                    disabled={submitted}
                    onChange={() => {
                      setAnswers((prev) => {
                        const next = [...prev]
                        next[qi] = oi
                        return next
                      })
                    }}
                  />
                  {t(opt)}
                </label>
              ))}
            </div>
          </li>
        ))}
      </ol>
      {!submitted ? (
        <button type="button" className="btn-quiz-submit" onClick={submitQuiz} disabled={answers.some((a) => a === null)}>
          {t('lab.quizSubmit')}
        </button>
      ) : (
        <div className="gamification-quiz-result">
          <p>
            {t('lab.quizResult', { score, total: QUIZ.length })}
          </p>
          <button type="button" className="btn-quiz-reset" onClick={resetQuiz}>
            {t('lab.quizAgain')}
          </button>
        </div>
      )}
    </div>
  )
}
