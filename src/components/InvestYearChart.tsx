import type { InvestFeedYearPoint } from '../lib/investFeed'

type Props = {
  points: InvestFeedYearPoint[]
  locale: string
  title: string
  subtitle: string
  valueLabel: string
}

const CHART_H = 120
const CHART_W = 360
const PAD = { l: 28, r: 8, t: 8, b: 28 }

export default function InvestYearChart({ points, locale, title, subtitle, valueLabel }: Props) {
  const sorted = [...points].sort((a, b) => a.month - b.month)
  const maxV = Math.max(...sorted.map((p) => p.valueBrl), 1)
  const innerW = CHART_W - PAD.l - PAD.r
  const innerH = CHART_H - PAD.t - PAD.b
  const slot = innerW / Math.max(sorted.length, 1)
  const barW = Math.max(3, slot - 3)
  const fmt = new Intl.NumberFormat(locale, { notation: 'compact', compactDisplay: 'short', maximumFractionDigits: 1 })

  const monthShort = (m: number) => {
    const d = new Date(2026, m - 1, 1)
    return d.toLocaleDateString(locale, { month: 'short' })
  }

  return (
    <div className="invest-chart-wrap" role="img" aria-label={title}>
      <div className="invest-chart-head">
        <h2 className="invest-chart-title">{title}</h2>
        <p className="invest-chart-sub">{subtitle}</p>
      </div>
      <svg
        className="invest-chart-svg"
        viewBox={`0 0 ${CHART_W} ${CHART_H}`}
        width="100%"
        height={CHART_H}
        preserveAspectRatio="xMidYMid meet"
      >
        <text x={PAD.l} y={14} className="invest-chart-axis-label" fontSize="9">
          {valueLabel}
        </text>
        {sorted.map((p, i) => {
          const h = (p.valueBrl / maxV) * innerH
          const x = PAD.l + i * slot + (slot - barW) / 2
          const y = PAD.t + innerH - h
          return (
            <g key={p.month}>
              <rect
                x={x}
                y={y}
                width={Math.max(barW, 4)}
                height={Math.max(h, 1)}
                rx={3}
                className="invest-chart-bar"
              />
              <text
                x={x + barW / 2}
                y={CHART_H - 6}
                textAnchor="middle"
                className="invest-chart-month"
                fontSize="9"
              >
                {monthShort(p.month)}
              </text>
              <title>
                {monthShort(p.month)}: {fmt.format(p.valueBrl)}
              </title>
            </g>
          )
        })}
      </svg>
    </div>
  )
}
