import { useState, type FormEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { saveContribution, type ContributionRole } from '../lib/contributionsStorage'
import '../styles/ContributionForm.css'

const ROLES: ContributionRole[] = ['teacher', 'student', 'guide', 'artisan', 'manager', 'other']

type ContributionFormProps = {
  onSubmitted?: () => void
}

export default function ContributionForm({ onSubmitted }: ContributionFormProps) {
  const { t } = useTranslation()
  const [role, setRole] = useState<ContributionRole>('teacher')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [contact, setContact] = useState('')
  const [done, setDone] = useState(false)

  const submit = (e: FormEvent) => {
    e.preventDefault()
    if (title.trim().length < 3 || description.trim().length < 12) return
    saveContribution({
      role,
      title: title.trim(),
      description: description.trim(),
      contact: contact.trim() || undefined,
    })
    setDone(true)
    setTitle('')
    setDescription('')
    setContact('')
    onSubmitted?.()
  }

  if (done) {
    return (
      <div className="contribution-form contribution-thanks">
        <p>{t('contribute.thanks')}</p>
        <button type="button" className="btn-contribute-again" onClick={() => setDone(false)}>
          {t('contribute.again')}
        </button>
      </div>
    )
  }

  return (
    <form className="contribution-form" onSubmit={submit}>
      <p className="contribution-intro">{t('contribute.intro')}</p>
      <label className="contribution-label">
        {t('contribute.role')}
        <select value={role} onChange={(e) => setRole(e.target.value as ContributionRole)}>
          {ROLES.map((r) => (
            <option key={r} value={r}>
              {t(`contribute.roles.${r}`)}
            </option>
          ))}
        </select>
      </label>
      <label className="contribution-label">
        {t('contribute.title')}
        <input value={title} onChange={(e) => setTitle(e.target.value)} required minLength={3} />
      </label>
      <label className="contribution-label">
        {t('contribute.description')}
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} required minLength={12} rows={5} />
      </label>
      <label className="contribution-label">
        {t('contribute.contact')}
        <input value={contact} onChange={(e) => setContact(e.target.value)} type="text" placeholder={t('contribute.contactPlaceholder')} />
      </label>
      <button type="submit" className="btn-contribute-submit">
        {t('contribute.submit')}
      </button>
    </form>
  )
}
