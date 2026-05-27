import { createContext, useContext, useEffect, useState, ReactNode } from 'react'

const isSpeechSupported = () =>
  typeof window !== 'undefined' &&
  'speechSynthesis' in window &&
  'SpeechSynthesisUtterance' in window

const speak = (text: string, locale: string) => {
  if (!isSpeechSupported() || !text.trim()) {
    return
  }

  window.speechSynthesis.cancel()
  const utterance = new SpeechSynthesisUtterance(text)
  utterance.lang = locale
  utterance.rate = 1
  utterance.pitch = 1
  window.speechSynthesis.speak(utterance)
}

const cleanText = (text: string): string => {
  return text
    .replace(/\s+/g, ' ') // Remove múltiplos espaços
    .trim()
}

const extractFullContent = (element: HTMLElement): string => {
  // Lista de classes que indicam um container com conteúdo completo
  const contentContainers = [
    'article',
    'card',
    'detail',
    'description',
    'content',
    'info',
    'section',
  ]

  // Procura por article no elemento ou próximo
  let contentElement = element.closest('article')
  if (!contentElement) {
    contentElement = element.closest('[class*="article"]')
  }
  if (!contentElement) {
    contentElement = element.closest('[class*="card"]')
  }
  if (!contentElement) {
    contentElement = element.closest('[class*="content"]')
  }

  // Se encontrou um container, extrai todo o conteúdo
  if (contentElement) {
    const parts: string[] = []

    // Extrai título/heading
    const heading = contentElement.querySelector('h1, h2, h3, h4')
    if (heading) {
      parts.push(cleanText(heading.textContent || ''))
    }

    // Extrai todos os parágrafos
    const paragraphs = contentElement.querySelectorAll('p, strong, em')
    paragraphs.forEach((p) => {
      const text = cleanText(p.textContent || '')
      if (text && !parts.includes(text)) {
        parts.push(text)
      }
    })

    // Extrai tags/categorias (elementos com classe que parecem tags)
    const tags = contentElement.querySelectorAll(
      '[class*="tag"], [class*="badge"], [class*="category"], [class*="genre"]',
    )
    const tagTexts: string[] = []
    tags.forEach((tag) => {
      const text = cleanText(tag.textContent || '')
      if (text && !tagTexts.includes(text)) {
        tagTexts.push(text)
      }
    })
    if (tagTexts.length > 0) {
      parts.push('Categorias: ' + tagTexts.join(', '))
    }

    // Extrai metadados (localização, tipo, etc)
    const meta = contentElement.querySelectorAll('[class*="meta"], [class*="location"]')
    meta.forEach((m) => {
      const text = cleanText(m.textContent || '')
      if (text && !parts.includes(text)) {
        parts.push(text)
      }
    })

    if (parts.length > 0) {
      return parts.join('. ')
    }
  }

  // Fallback: extrai tudo do elemento direto
  return cleanText(element.textContent || '')
}

const extractElementText = (element: HTMLElement): string => {
  // Se for uma imagem, tenta alt text
  if (element instanceof HTMLImageElement) {
    const alt = element.getAttribute('alt')
    if (alt) return alt
  }

  // Pega aria-label
  const ariaLabel = element.getAttribute('aria-label')
  if (ariaLabel) {
    // Se temos aria-label, também tenta extrair conteúdo completo
    const fullContent = extractFullContent(element)
    return fullContent.length > ariaLabel.length ? fullContent : ariaLabel
  }

  // Title attribute
  const title = element.getAttribute('title')
  if (title) {
    const fullContent = extractFullContent(element)
    return fullContent.length > title.length ? fullContent : title
  }

  // Extrai conteúdo completo
  const fullContent = extractFullContent(element)

  // Se for um botão vazio, retorna mensagem padrão
  if (!fullContent && element.tagName === 'BUTTON') {
    return 'Botão sem rótulo'
  }

  return fullContent || 'Elemento sem conteúdo'
}

interface ScreenReaderContextType {
  enabled: boolean
  locale: string
  toggleScreenReader: () => void
  speak: (text: string) => void
}

const ScreenReaderContext = createContext<ScreenReaderContextType | undefined>(
  undefined,
)

export function ScreenReaderProvider({ children }: { children: ReactNode }) {
  const [enabled, setEnabled] = useState(false)
  const [supported, setSupported] = useState(false)
  const [locale, setLocale] = useState('pt-BR')

  useEffect(() => {
    setSupported(isSpeechSupported())
    const saved = localStorage.getItem('screenReaderEnabled')
    setEnabled(saved === 'true')

    // Detecta mudanças de idioma no documento
    const handleLanguageChange = () => {
      const html = document.documentElement
      const lang = html.getAttribute('lang') || 'pt'
      setLocale(lang.startsWith('en') ? 'en-US' : 'pt-BR')
    }

    // Monitora mudanças na linguagem
    const observer = new MutationObserver(handleLanguageChange)
    observer.observe(document.documentElement, { attributes: true })

    return () => observer.disconnect()
  }, [])

  const toggleScreenReader = () => {
    if (!supported) return
    const nextValue = !enabled
    setEnabled(nextValue)
    localStorage.setItem('screenReaderEnabled', String(nextValue))
  }

  const speakText = (text: string) => {
    if (!enabled) return
    speak(text, locale)
  }

  // Adiciona listener global para cliques
  useEffect(() => {
    if (!enabled || !supported) {
      return
    }

    const handleGlobalClick = (event: MouseEvent) => {
      // Ignora cliques no próprio botão de screen reader
      const target = event.target as HTMLElement
      if (target.closest('.accessibility-toggle')) {
        return
      }

      // Encontra o elemento clicável (botão, link, etc)
      let clickedElement = target
      if (!clickedElement.matches('button, a, [role="button"]')) {
        clickedElement = clickedElement.closest('button, a, [role="button"]') || target
      }

      // Extrai o texto do elemento clicado
      let text = extractElementText(clickedElement)

      // Se o elemento está em um container maior (article, card), também lê o conteúdo associado
      const article = clickedElement.closest('article')
      if (article && article !== clickedElement) {
        const articleText = extractFullContent(article)
        if (articleText && articleText !== text) {
          text = text + '. ' + articleText
        }
      }

      // Se nenhum conteúdo foi extraído, tenta o elemento pai
      if (!text || text === 'Elemento sem conteúdo') {
        const parent = clickedElement.parentElement
        if (parent) {
          text = extractFullContent(parent)
        }
      }

      speak(text, locale)
    }

    document.addEventListener('click', handleGlobalClick, true)

    return () => {
      document.removeEventListener('click', handleGlobalClick, true)
    }
  }, [enabled, supported, locale])

  return (
    <ScreenReaderContext.Provider
      value={{ enabled, locale, toggleScreenReader, speak: speakText }}
    >
      {children}
    </ScreenReaderContext.Provider>
  )
}

export function useScreenReader() {
  const context = useContext(ScreenReaderContext)
  if (!context) {
    throw new Error('useScreenReader deve ser usado dentro de ScreenReaderProvider')
  }
  return context
}
