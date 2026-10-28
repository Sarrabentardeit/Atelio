import { useEffect, useRef, useState, type MouseEvent, type ReactNode, type CSSProperties } from 'react'
import {
  BadgeCheck,
  Banknote,
  CarFront,
  ClipboardList,
  Crown,
  Wrench,
} from 'lucide-react'

export const MARQUEE = [
  'Véhicules',
  'Réunion du jour',
  'Suivi atelier',
  'Clients',
  'Carte VIP',
  'Réclamations',
  'Devis',
  'Factures',
  'Caisse équipe',
  'Money',
  'Achats fournisseurs',
  'Stock',
  'Checklists',
  'Chat interne',
  'Application mobile',
]

export const STYLES = `
@keyframes em-float { 0%,100% { transform: translateY(0) } 50% { transform: translateY(-10px) } }
@keyframes em-float-slow { 0%,100% { transform: translateY(0) } 50% { transform: translateY(8px) } }
@keyframes em-rise { from { opacity: 0; transform: translateY(24px) } to { opacity: 1; transform: translateY(0) } }
@keyframes em-blob { 0%,100% { transform: translate(0,0) scale(1) } 33% { transform: translate(40px,-30px) scale(1.12) } 66% { transform: translate(-30px,30px) scale(.94) } }
@keyframes em-shimmer { 0% { background-position: 0% 50% } 100% { background-position: 200% 50% } }
@keyframes em-marquee { from { transform: translateX(0) } to { transform: translateX(-50%) } }
@keyframes em-pop { 0% { opacity: 0; transform: translateY(14px) scale(.94) } 100% { opacity: 1; transform: translateY(0) scale(1) } }
@keyframes em-bar { from { transform: scaleX(0) } to { transform: scaleX(1) } }
@keyframes em-swap { from { opacity: 0; transform: translateY(14px) } to { opacity: 1; transform: translateY(0) } }
@keyframes em-ping { 0% { transform: scale(1); opacity: .6 } 100% { transform: scale(2.4); opacity: 0 } }
@keyframes em-flash { 0% { background-color: rgba(227,6,19,.22) } 100% { background-color: transparent } }
@keyframes em-line { from { transform: scaleX(0) } to { transform: scaleX(1) } }
.em-float { animation: em-float 6s ease-in-out infinite }
.em-float-slow { animation: em-float-slow 7s ease-in-out infinite }
.em-blob { animation: em-blob 16s ease-in-out infinite }
.em-blob-2 { animation: em-blob 20s ease-in-out infinite reverse }
.em-shimmer-dark {
  background-image: linear-gradient(90deg, #ef4444, #fb923c, #dc2626, #ef4444);
  background-size: 200% 100%;
  animation: em-shimmer 5s linear infinite;
}
.em-shimmer-text {
  background-image: linear-gradient(90deg, #f97316, #fbbf24, #ea580c, #f97316);
  background-size: 200% 100%;
  animation: em-shimmer 5s linear infinite;
}
.em-marquee { animation: em-marquee 38s linear infinite }
.em-marquee:hover { animation-play-state: paused }
.em-pop { animation: em-pop .5s cubic-bezier(.2,.8,.2,1) both }
.em-bar { transform-origin: left; animation: em-bar 1.1s cubic-bezier(.2,.8,.2,1) both }
.em-swap { animation: em-swap .55s cubic-bezier(.2,.8,.2,1) both }
.em-ping { animation: em-ping 1.8s ease-out infinite }
.em-flash { animation: em-flash 1.4s ease-out }
.em-line { transform-origin: left; animation: em-line 1.6s cubic-bezier(.2,.8,.2,1) both }
.em-reveal { opacity: 0; transform: translateY(28px); transition: opacity .8s cubic-bezier(.2,.8,.2,1), transform .8s cubic-bezier(.2,.8,.2,1) }
.em-reveal.em-left { transform: translateX(-40px) }
.em-reveal.em-right { transform: translateX(40px) }
.em-reveal.em-zoom { transform: scale(.92) }
.em-reveal.em-in { opacity: 1; transform: none }
.em-hero-in { animation: em-rise .8s ease both }
.em-hero-stagger > * { animation: em-rise .9s cubic-bezier(.2,.8,.2,1) both }
.em-hero-stagger > *:nth-child(2) { animation-delay: .12s }
.em-hero-stagger > *:nth-child(3) { animation-delay: .24s }
.em-hero-stagger > *:nth-child(4) { animation-delay: .36s }
.em-btn { position: relative; overflow: hidden }
.em-btn::after {
  content: ''; position: absolute; inset: 0; transform: translateX(-120%) skewX(-20deg);
  background: linear-gradient(90deg, transparent, rgba(255,255,255,.45), transparent);
  transition: transform .7s ease;
}
.em-btn:hover::after { transform: translateX(120%) skewX(-20deg) }
.em-card-glow { position: relative; overflow: hidden }
.em-card-glow::before {
  content: ''; position: absolute; inset: 0; opacity: 0; transition: opacity .3s ease; pointer-events: none;
  background: radial-gradient(260px circle at var(--mx, 50%) var(--my, 50%), rgba(227,6,19,.16), transparent 60%);
}
.em-card-glow:hover::before { opacity: 1 }
.em-grid-bg {
  background-image: radial-gradient(rgba(15,23,42,.07) 1px, transparent 1px);
  background-size: 22px 22px;
}
@media (prefers-reduced-motion: reduce) {
  .em-float, .em-float-slow, .em-hero-in, .em-blob, .em-blob-2, .em-shimmer-text, .em-marquee,
  .em-pop, .em-bar, .em-swap, .em-ping, .em-flash, .em-line, .em-hero-stagger > * { animation: none }
  .em-reveal, .em-reveal.em-left, .em-reveal.em-right, .em-reveal.em-zoom { opacity: 1; transform: none; transition: none }
}
`

export function useInView<T extends HTMLElement>(threshold = 0.25) {
  const ref = useRef<T>(null)
  const [seen, setSeen] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (typeof IntersectionObserver === 'undefined') {
      setSeen(true)
      return
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setSeen(true)
          io.disconnect()
        }
      },
      { threshold }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [threshold])
  return { ref, seen }
}

export function CountUp({ to, suffix = '', duration = 1400 }: { to: number; suffix?: string; duration?: number }) {
  const { ref, seen } = useInView<HTMLSpanElement>()
  const [n, setN] = useState(0)
  useEffect(() => {
    if (!seen) return
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
      setN(to)
      return
    }
    let raf = 0
    const start = performance.now()
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / duration)
      setN(Math.round(to * (1 - Math.pow(1 - p, 3))))
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [seen, to, duration])
  return <span ref={ref}>{n}{suffix}</span>
}

export function ScrollProgress() {
  const [p, setP] = useState(0)
  useEffect(() => {
    const on = () => {
      const h = document.documentElement.scrollHeight - window.innerHeight
      setP(h > 0 ? Math.min(1, window.scrollY / h) : 0)
    }
    on()
    window.addEventListener('scroll', on, { passive: true })
    return () => window.removeEventListener('scroll', on)
  }, [])
  return (
    <div className="fixed inset-x-0 top-0 z-50 h-[3px]">
      <div className="h-full origin-left bg-gradient-to-r from-[#E30613] to-[#ff4d4d]" style={{ transform: `scaleX(${p})` }} />
    </div>
  )
}

export function glowMove(e: MouseEvent<HTMLElement>) {
  const r = e.currentTarget.getBoundingClientRect()
  e.currentTarget.style.setProperty('--mx', `${e.clientX - r.left}px`)
  e.currentTarget.style.setProperty('--my', `${e.clientY - r.top}px`)
}

export function Reveal({
  children,
  className = '',
  delay = 0,
  from = 'up',
}: {
  children: ReactNode
  className?: string
  delay?: number
  from?: 'up' | 'left' | 'right' | 'zoom'
}) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (typeof IntersectionObserver === 'undefined') {
      el.classList.add('em-in')
      return
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('em-in')
            io.unobserve(e.target)
          }
        })
      },
      { threshold: 0.12 }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])
  return (
    <div
      ref={ref}
      className={`em-reveal ${from === 'left' ? 'em-left' : from === 'right' ? 'em-right' : from === 'zoom' ? 'em-zoom' : ''} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  )
}

export const ROWS: Array<{ car: string; etat: string; tone: string; jours: string; equipe: string }> = [
  { car: 'Volkswagen Touareg', etat: 'En cours', tone: 'bg-orange-100 text-orange-700', jours: '18 j', equipe: 'Meher B.' },
  { car: 'Toyota C-HR', etat: 'Att. pièces', tone: 'bg-purple-100 text-purple-700', jours: '41 j', equipe: 'Amine K.' },
  { car: 'Audi Q5', etat: 'Test', tone: 'bg-sky-100 text-sky-700', jours: '6 j', equipe: 'Yassine T.' },
  { car: 'Opel Astra', etat: 'À résoudre', tone: 'bg-red-100 text-red-700', jours: '9 j', equipe: 'Meher B.' },
]

/** Logo ATELIO : carré orange #F47216, « A » blanc. */
/** Icône ATELIO (planche rouge / anthracite). */
export function AtelioMark({
  className = '',
  style,
  dark = false,
}: {
  className?: string
  style?: CSSProperties
  dark?: boolean
}) {
  return (
    <img
      src={dark ? '/atelio-icon-dark.png' : '/atelio-icon-light.png'}
      alt="Atelio"
      className={`shrink-0 object-contain ${className}`}
      style={style}
      draggable={false}
    />
  )
}

/**
 * Logo Atelio : icône + wordmark + signature.
 * `compact` = barre de navigation (sans la ligne « Atelier · Gestion · Performance »).
 */
export function AtelioLogo({
  dark = false,
  size = 40,
  word = 0.8,
  compact = false,
  className = '',
}: {
  dark?: boolean
  size?: number
  word?: number
  compact?: boolean
  className?: string
}) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <AtelioMark dark={dark} style={{ width: size, height: size }} />
      <span className="flex flex-col items-start text-left leading-none">
        <span
          className={`font-extrabold tracking-[-0.02em] ${dark ? 'text-white' : 'text-[#1A1C1E]'}`}
          style={{ fontSize: size * word }}
        >
          Atelio
          <span className="ml-0.5 inline-block -translate-y-[0.35em] text-[0.55em] font-black text-[#E30613]">´</span>
        </span>
        {!compact ? (
          <span
            className={`mt-1.5 font-semibold uppercase tracking-[0.18em] ${dark ? 'text-white/55' : 'text-[#1A1C1E]/60'}`}
            style={{ fontSize: Math.max(8, size * 0.2) }}
          >
            Atelier · Gestion · Performance
          </span>
        ) : (
          <span
            className={`mt-1 font-semibold uppercase tracking-[0.16em] ${dark ? 'text-[#E30613]' : 'text-[#8A7F77]'}`}
            style={{ fontSize: Math.max(8, size * 0.2) }}
          >
            Powered by Mecano
          </span>
        )}
      </span>
    </span>
  )
}

/** Logo vertical complet (planche officielle), pour fond clair. */
export function AtelioLogoFull({ className = '', height = 96 }: { className?: string; height?: number }) {
  return (
    <img
      src="/atelio-logo-full.png"
      alt="Atelio — Atelier · Gestion · Performance"
      className={`object-contain object-left ${className}`}
      style={{ height }}
      draggable={false}
    />
  )
}

export function Browser({ children, url = 'atelio.app' }: { children: ReactNode; url?: string }) {
  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow-[0_30px_80px_rgba(15,23,42,0.16)] ring-1 ring-black/[0.08]">
      <div className="flex items-center gap-2 border-b border-gray-100 bg-gray-50 px-4 py-2.5">
        <span className="h-2.5 w-2.5 rounded-full bg-red-300" />
        <span className="h-2.5 w-2.5 rounded-full bg-amber-300" />
        <span className="h-2.5 w-2.5 rounded-full bg-emerald-300" />
        <span className="mx-auto rounded-md bg-white px-10 py-1 text-[11px] text-gray-400 ring-1 ring-gray-200">{url}</span>
        <span className="w-10" />
      </div>
      {children}
    </div>
  )
}

export function Kpi({ label, value, tone = 'text-gray-950', pulseKey }: { label: string; value: string; tone?: string; pulseKey?: number }) {
  return (
    <div className="rounded-xl bg-white p-3 ring-1 ring-black/[0.06]">
      <p className="text-[10px] font-medium uppercase tracking-wide text-gray-400">{label}</p>
      <p key={pulseKey ?? 'static'} className={`${pulseKey != null ? 'em-pop' : ''} mt-1 text-xl font-semibold ${tone}`}>{value}</p>
    </div>
  )
}

const ETATS_MOCK = [
  { etat: 'En cours', tone: 'bg-orange-100 text-orange-700' },
  { etat: 'Att. pièces', tone: 'bg-purple-100 text-purple-700' },
  { etat: 'Test', tone: 'bg-sky-100 text-sky-700' },
  { etat: 'À résoudre', tone: 'bg-red-100 text-red-700' },
]

/** Aperçu vivant : un véhicule change d'état toutes les 2,6 s. */
export function SuiviMock() {
  const [state, setState] = useState<{
    idx: number[]
    tick: number
    lastRow: number | null
    events: Array<{ id: number; car: string; etat: string }>
  }>({ idx: [0, 1, 2, 3], tick: 0, lastRow: null, events: [{ id: 0, car: 'Audi Q5', etat: 'Test' }] })
  const { idx, tick, lastRow, events } = state

  useEffect(() => {
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return
    const timer = window.setInterval(() => {
      setState((s) => {
        const row = s.tick % ROWS.length
        const nextIdx = [...s.idx]
        nextIdx[row] = (nextIdx[row] + 1) % ETATS_MOCK.length
        return {
          idx: nextIdx,
          tick: s.tick + 1,
          lastRow: row,
          events: [{ id: s.tick + 1, car: ROWS[row].car, etat: ETATS_MOCK[nextIdx[row]].etat }, ...s.events].slice(0, 3),
        }
      })
    }, 2600)
    return () => window.clearInterval(timer)
  }, [])

  const parts = idx.filter((i) => i === 1).length + 3
  const resolve = idx.filter((i) => i === 3).length + 1

  return (
    <div className="grid gap-3 bg-[#f6f5f2] p-4 sm:grid-cols-[1fr_190px]">
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          <Kpi label="Au garage" value="25" />
          <Kpi label="Att. pièces" value={String(parts)} tone="text-purple-600" pulseKey={parts} />
          <Kpi label="À résoudre" value={String(resolve)} tone="text-red-600" pulseKey={resolve} />
          <Kpi label="Validées" value="3" tone="text-emerald-600" />
        </div>
        <div className="overflow-hidden rounded-xl bg-white ring-1 ring-black/[0.06]">
          <div className="grid grid-cols-[1.4fr_1fr_.5fr] border-b border-gray-100 px-3 py-2 text-[10px] font-semibold uppercase tracking-wide text-gray-400">
            <span>Véhicule</span>
            <span>État</span>
            <span className="text-right">Jours</span>
          </div>
          {ROWS.map((r, i) => {
            const e = ETATS_MOCK[idx[i]]
            const flash = lastRow === i
            return (
              <div
                key={`${r.car}-${flash ? tick : 'x'}`}
                className={`grid grid-cols-[1.4fr_1fr_.5fr] items-center border-b border-gray-50 px-3 py-2.5 last:border-0 ${flash ? 'em-flash' : ''}`}
              >
                <div>
                  <p className="text-xs font-semibold text-gray-900">{r.car}</p>
                  <p className="text-[10px] text-gray-400">{r.equipe}</p>
                </div>
                <span key={e.etat} className={`em-pop w-fit rounded-md px-2 py-0.5 text-[10px] font-semibold ${e.tone}`}>{e.etat}</span>
                <span className="text-right text-xs font-semibold text-gray-700">{r.jours}</span>
              </div>
            )
          })}
        </div>
      </div>
      <div className="hidden space-y-3 sm:block">
        <div className="rounded-xl bg-white p-3 ring-1 ring-black/[0.06]">
          <p className="text-xs font-bold text-emerald-700">Validées aujourd’hui</p>
          <div className="mt-1 h-1 w-8 rounded-full bg-emerald-600" />
          <p className="mt-3 text-xs font-semibold text-gray-900">Kia Sportage</p>
          <p className="text-[10px] text-gray-400">Sortie 11:20</p>
        </div>
        <div className="rounded-xl bg-white p-3 ring-1 ring-black/[0.06]">
          <p className="text-xs font-bold text-[#C10510]">Mouvements</p>
          <div className="mt-1 h-1 w-8 rounded-full bg-[#E30613]" />
          <div className="mt-3 space-y-1.5">
            {events.map((ev) => (
              <p key={ev.id} className="em-pop text-[11px] text-gray-700">
                {ev.car} passe en <b>{ev.etat}</b>
              </p>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

/* ---------- Grille « Dans le détail » ---------- */

export function MiniReunion() {
  const rows = [
    ['Touareg', 'Meher B.', 'Freins à contrôler', 'En cours', 'bg-orange-100 text-orange-700'],
    ['C-HR', 'Amine K.', 'Pièce commandée', 'Att. pièces', 'bg-purple-100 text-purple-700'],
    ['Q5', 'Yassine T.', 'Essai sur route', 'Test', 'bg-sky-100 text-sky-700'],
  ]
  return (
    <div>
      <div className="mb-3 flex flex-wrap gap-1.5">
        {['Tous', 'En cours', 'Att. pièces', 'Test'].map((f, i) => (
          <span key={f} className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${i === 0 ? 'bg-[#E30613] text-white' : 'bg-white text-gray-600 ring-1 ring-black/[0.08]'}`}>{f}</span>
        ))}
      </div>
      <div className="overflow-hidden rounded-2xl bg-white ring-1 ring-black/[0.06]">
        {rows.map(([car, who, note, etat, tone], i) => (
          <div key={car} style={{ animationDelay: `${i * 140}ms` }} className="em-pop grid grid-cols-[1fr_auto] items-center gap-3 border-b border-gray-50 px-4 py-3 last:border-0 sm:grid-cols-[.8fr_1fr_1.4fr_auto]">
            <p className="text-sm font-semibold">{car}</p>
            <p className="hidden text-xs text-gray-500 sm:block">{who}</p>
            <p className="hidden text-xs text-gray-500 sm:block">{note}</p>
            <span className={`w-fit rounded-md px-2 py-0.5 text-[10px] font-semibold ${tone}`}>{etat}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export function MiniSuivi() {
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-3 gap-2">
        <Kpi label="Garage" value="25" />
        <Kpi label="Pièces" value="4" tone="text-purple-600" />
        <Kpi label="Validées" value="3" tone="text-emerald-600" />
      </div>
      <div className="rounded-2xl bg-white p-3.5 ring-1 ring-black/[0.06]">
        <p className="text-xs font-bold text-emerald-700">Validées aujourd’hui</p>
        <div className="mt-1 h-1 w-8 rounded-full bg-emerald-600" />
        <p className="mt-2.5 text-xs font-semibold">Kia Sportage <span className="font-normal text-gray-400">· sortie 11:20</span></p>
      </div>
    </div>
  )
}

export function MiniVip() {
  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-black/[0.06]">
      <div className="relative px-4 pb-4 pt-3">
        <div className="pointer-events-none absolute -right-5 -top-7 h-20 w-20 rounded-full bg-red-100" />
        <div className="relative flex items-center justify-between">
          <p className="text-[10px] font-bold tracking-[0.2em] text-[#C10510]">ATELIO</p>
          <span className="rounded bg-[#E30613] px-1.5 py-0.5 text-[10px] font-bold text-white">ADVANCED</span>
        </div>
        <p className="relative mt-4 text-base font-semibold">Ahmed Benali</p>
        <p className="relative mt-1.5 inline-flex rounded-md bg-gray-50 px-2 py-0.5 font-mono text-[11px] tracking-widest text-gray-600 ring-1 ring-gray-200">VIP-0001</p>
      </div>
      <div className="grid grid-cols-2 border-t border-gray-100 bg-gray-50 text-[11px]">
        <p className="px-4 py-2 text-gray-500">Du <b className="text-gray-900">14/10/26</b></p>
        <p className="border-l border-gray-200 px-4 py-2 text-gray-500">Au <b className="text-gray-900">14/10/27</b></p>
      </div>
    </div>
  )
}

export function MiniMoney() {
  return (
    <div className="space-y-3 rounded-2xl bg-white p-4 ring-1 ring-black/[0.06]">
      <div className="flex items-end justify-between">
        <div>
          <p className="text-[10px] font-medium uppercase tracking-wide text-gray-400">Entrées</p>
          <p className="text-lg font-semibold text-emerald-600">12 480 DT</p>
        </div>
        <div className="text-right">
          <p className="text-[10px] font-medium uppercase tracking-wide text-gray-400">Sorties</p>
          <p className="text-lg font-semibold text-red-600">3 250 DT</p>
        </div>
      </div>
      {[['Réparation', 78], ['Pièces', 52], ['Diagnostic', 24]].map(([l, w]) => (
        <div key={String(l)}>
          <div className="flex justify-between text-[11px] font-medium text-gray-600"><span>{l}</span><span>{w}%</span></div>
          <div className="mt-1 h-1.5 rounded-full bg-gray-100">
            <div className="em-bar h-1.5 rounded-full bg-gradient-to-r from-[#E30613] to-[#ff4d4d]" style={{ width: `${w}%` }} />
          </div>
        </div>
      ))}
    </div>
  )
}

export function MiniFacture() {
  return (
    <div className="rounded-2xl bg-white p-4 ring-1 ring-black/[0.06]">
      <div className="flex items-center justify-between">
        <p className="text-xs font-bold">Facture F-0042</p>
        <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">Payée</span>
      </div>
      <div className="mt-3 space-y-1.5 text-[11px] text-gray-600">
        <div className="flex justify-between"><span>Main d’œuvre</span><b className="text-gray-900">180 DT</b></div>
        <div className="flex justify-between"><span>Plaquettes de frein</span><b className="text-gray-900">120 DT</b></div>
        <div className="flex justify-between border-t border-dashed border-gray-200 pt-1.5"><span>Total</span><b className="text-gray-950">300 DT</b></div>
      </div>
    </div>
  )
}

export function MiniChat() {
  const msgs: Array<[string, string, boolean]> = [
    ['Meher', 'Le Touareg est prêt pour le test.', false],
    ['Rabii', 'Parfait, je préviens le client.', true],
    ['Amine', 'La pièce du C-HR arrive demain.', false],
  ]
  return (
    <div className="space-y-2 rounded-2xl bg-white p-4 ring-1 ring-black/[0.06]">
      {msgs.map(([who, t, mine], i) => (
        <div key={t} style={{ animationDelay: `${i * 220}ms` }} className={`em-pop flex ${mine ? 'justify-end' : ''}`}>
          <div className={`max-w-[85%] rounded-2xl px-3 py-2 text-[11px] leading-snug ${mine ? 'rounded-br-md bg-[#E30613] text-white' : 'rounded-bl-md bg-gray-100 text-gray-800'}`}>
            {!mine ? <p className="mb-0.5 text-[10px] font-bold text-[#C10510]">{who}</p> : null}
            {t}
          </div>
        </div>
      ))}
    </div>
  )
}

export function MiniAcces() {
  const [on, setOn] = useState([true, true, false, true])
  const rows = ['Voir la réunion', 'Voir le suivi atelier', 'Voir la caisse', 'Gérer les clients']
  return (
    <div className="rounded-2xl bg-white p-2 ring-1 ring-black/[0.06]">
      {rows.map((label, i) => (
        <button
          key={label}
          type="button"
          onClick={() => setOn((v) => v.map((x, n) => (n === i ? !x : x)))}
          className="flex w-full items-center justify-between gap-3 rounded-xl px-3 py-2.5 text-left transition hover:bg-gray-50"
        >
          <span className="text-xs font-medium text-gray-800">{label}</span>
          <span className={`relative h-5 w-9 shrink-0 rounded-full transition ${on[i] ? 'bg-[#E30613]' : 'bg-gray-200'}`}>
            <span className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-all ${on[i] ? 'left-[18px]' : 'left-0.5'}`} />
          </span>
        </button>
      ))}
    </div>
  )
}

const JOURNEY = [
  { icon: CarFront, title: 'La voiture entre', text: 'On crée la fiche, l’état, l’équipe et le problème.' },
  { icon: Wrench, title: 'L’atelier avance', text: 'Pièces, test, notes de la réunion du jour.' },
  { icon: BadgeCheck, title: 'Elle est validée', text: 'Elle quitte la liste du garage et reste aux archives.' },
  { icon: Banknote, title: 'L’argent suit', text: 'Devis, facture, paiement et caisse.' },
]

export function Journey() {
  const { ref, seen } = useInView<HTMLDivElement>(0.3)
  const [active, setActive] = useState(0)
  useEffect(() => {
    if (!seen) return
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return
    const t = window.setInterval(() => setActive((a) => (a + 1) % JOURNEY.length), 2200)
    return () => window.clearInterval(t)
  }, [seen])

  return (
    <div ref={ref} className="relative mt-14 grid gap-6 md:grid-cols-4">
      <div className="pointer-events-none absolute left-[12.5%] right-[12.5%] top-6 hidden h-0.5 rounded-full bg-red-100 md:block">
        {seen ? <div className="em-line h-full rounded-full bg-gradient-to-r from-[#ff4d4d] to-[#ff7a7a]" /> : null}
      </div>
      {JOURNEY.map((step, i) => {
        const I = step.icon
        const on = i === active
        return (
          <Reveal key={step.title} delay={i * 140}>
            <div className="relative text-center">
              <span
                className={`relative mx-auto flex h-12 w-12 items-center justify-center rounded-2xl transition duration-500 ${
                  on
                    ? 'scale-110 bg-[#E30613] text-white shadow-[0_10px_26px_rgba(227,6,19,0.45)]'
                    : 'bg-red-50 text-[#C10510] ring-1 ring-red-100'
                }`}
              >
                {on ? <span className="em-ping absolute inset-0 rounded-2xl bg-[#ff4d4d]/60" /> : null}
                <I className="relative h-5 w-5" />
              </span>
              <p className={`mt-4 text-base font-semibold transition ${on ? 'text-gray-950' : 'text-gray-700'}`}>{step.title}</p>
              <p className="mx-auto mt-1.5 max-w-[220px] text-sm leading-relaxed text-gray-600">{step.text}</p>
            </div>
          </Reveal>
        )
      })}
    </div>
  )
}

export const FEED_LEFT = [
  { icon: Wrench, tone: 'bg-purple-100 text-purple-600', title: 'Toyota C-HR', text: 'Attente de pièces · 41 jours' },
  { icon: ClipboardList, tone: 'bg-red-100 text-[#C10510]', title: 'Réunion du jour', text: '25 voitures au garage' },
  { icon: CarFront, tone: 'bg-sky-100 text-sky-600', title: 'Nouvelle entrée', text: 'Kia Picanto · fiche créée' },
]
export const FEED_RIGHT = [
  { icon: BadgeCheck, tone: 'bg-emerald-100 text-emerald-600', title: 'Voiture validée', text: 'Sortie du garage · archivée' },
  { icon: Banknote, tone: 'bg-amber-100 text-amber-600', title: 'Paiement reçu', text: 'Facture réglée en caisse' },
  { icon: Crown, tone: 'bg-red-100 text-[#C10510]', title: 'Carte VIP', text: 'Advanced · nouveau client' },
]

export function FeedCard({ items, interval, offset, className }: { items: typeof FEED_LEFT; interval: number; offset: number; className: string }) {
  const [i, setI] = useState(0)
  useEffect(() => {
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return
    let timer = 0
    const start = window.setTimeout(() => {
      timer = window.setInterval(() => setI((v) => (v + 1) % items.length), interval)
    }, offset)
    return () => {
      window.clearTimeout(start)
      window.clearInterval(timer)
    }
  }, [items.length, interval, offset])
  const it = items[i]
  const I = it.icon
  return (
    <div className={className}>
      <div key={i} className="em-pop flex items-center gap-3 rounded-2xl bg-white p-4 shadow-[0_18px_40px_rgba(15,23,42,0.14)] ring-1 ring-black/[0.06]">
        <span className={`flex h-10 w-10 items-center justify-center rounded-xl ${it.tone}`}>
          <I className="h-5 w-5" />
        </span>
        <div>
          <p className="text-xs font-semibold">{it.title}</p>
          <p className="text-[11px] text-gray-500">{it.text}</p>
        </div>
      </div>
    </div>
  )
}

export function PhoneMock() {
  return (
    <div className="relative mx-auto w-[250px] rounded-[38px] bg-gray-950 p-2.5 shadow-[0_30px_70px_rgba(15,23,42,0.3)]">
      <div className="absolute left-1/2 top-3 h-4 w-20 -translate-x-1/2 rounded-full bg-gray-950" />
      <div className="overflow-hidden rounded-[30px] bg-[#f6f5f2] px-3 pb-4 pt-8">
        <p className="text-center text-xs font-bold">Suivi atelier</p>
        <div className="mt-3 grid grid-cols-3 gap-1.5 rounded-xl bg-white p-1 ring-1 ring-black/[0.06]">
          <span className="rounded-lg py-1.5 text-center text-[10px] font-semibold text-gray-500">Veille</span>
          <span className="rounded-lg bg-[#E30613] py-1.5 text-center text-[10px] font-semibold text-white">Aujourd’hui</span>
          <span className="rounded-lg py-1.5 text-center text-[10px] font-semibold text-gray-500">Semaine</span>
        </div>
        <div className="mt-2.5 grid grid-cols-2 gap-1.5">
          <Kpi label="Au garage" value="25" />
          <Kpi label="Validées" value="3" tone="text-emerald-600" />
        </div>
        <div className="mt-2.5 space-y-1.5">
          {ROWS.slice(0, 3).map((r) => (
            <div key={r.car} className="rounded-xl bg-white p-2.5 ring-1 ring-black/[0.06]">
              <div className="flex items-center justify-between gap-2">
                <p className="text-[11px] font-semibold">{r.car}</p>
                <span className={`rounded px-1.5 py-0.5 text-[9px] font-semibold ${r.tone}`}>{r.etat}</span>
              </div>
              <p className="mt-0.5 text-[10px] text-gray-400">{r.equipe} · {r.jours}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export function ModulePreview({ id }: { id: string }) {
  if (id === 'clients') {
    return (
      <div className="mx-auto max-w-sm">
        <div className="overflow-hidden rounded-2xl bg-white shadow-[0_14px_34px_rgba(15,23,42,0.1)] ring-1 ring-black/[0.06]">
          <div className="relative px-5 pb-5 pt-4">
            <div className="pointer-events-none absolute -right-6 -top-8 h-24 w-24 rounded-full bg-red-100" />
            <div className="relative flex items-center justify-between">
              <p className="text-[11px] font-bold tracking-[0.2em] text-[#C10510]">ATELIO</p>
              <span className="rounded-md bg-[#E30613] px-2 py-1 text-[11px] font-bold text-white">ADVANCED</span>
            </div>
            <p className="relative mt-6 text-[11px] font-medium uppercase tracking-wide text-gray-400">Titulaire</p>
            <p className="relative text-[22px] font-semibold tracking-tight">Ahmed Benali</p>
            <p className="relative mt-3 inline-flex rounded-lg bg-gray-50 px-2.5 py-1 font-mono text-sm tracking-[0.16em] text-gray-700 ring-1 ring-gray-200">VIP-0001</p>
          </div>
          <div className="grid grid-cols-2 border-t border-gray-100 bg-gray-50">
            <div className="px-5 py-3"><p className="text-[10px] font-semibold uppercase text-gray-400">Valable du</p><p className="text-sm font-semibold">14/10/2026</p></div>
            <div className="border-l border-gray-200 px-5 py-3"><p className="text-[10px] font-semibold uppercase text-gray-400">Jusqu’au</p><p className="text-sm font-semibold">14/10/2027</p></div>
          </div>
        </div>
      </div>
    )
  }
  if (id === 'argent') {
    return (
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <Kpi label="Entrées" value="12 480 DT" tone="text-emerald-600" />
          <Kpi label="Sorties" value="3 250 DT" tone="text-red-600" />
        </div>
        <div className="rounded-xl bg-white p-4 ring-1 ring-black/[0.06]">
          <p className="text-xs font-semibold text-gray-500">Types d’entrée</p>
          <div className="mt-3 space-y-2.5">
            {[['Réparation', 78], ['Pièces', 52], ['Diagnostic', 24]].map(([l, w]) => (
              <div key={String(l)}>
                <div className="flex justify-between text-[11px] font-medium text-gray-700"><span>{l}</span><span>{w}%</span></div>
                <div className="mt-1 h-2 rounded-full bg-gray-100"><div className="em-bar h-2 rounded-full bg-gradient-to-r from-[#E30613] to-[#ff4d4d]" style={{ width: `${w}%` }} /></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }
  if (id === 'equipe') {
    return (
      <div className="space-y-2.5">
        {[['Contrôle freins', 'Meher B.', true], ['Vidange et filtres', 'Amine K.', true], ['Essai sur route', 'Yassine T.', false]].map(([t, who, ok], n) => (
          <div key={String(t)} style={{ animationDelay: `${n * 120}ms` }} className="em-pop flex items-center justify-between rounded-xl bg-white p-3.5 ring-1 ring-black/[0.06]">
            <div className="flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-red-100 text-[11px] font-bold text-[#C10510]">{String(who).slice(0, 1)}</span>
              <div><p className="text-sm font-semibold">{String(t)}</p><p className="text-[11px] text-gray-400">{String(who)}</p></div>
            </div>
            <span className={`rounded-full px-2.5 py-1 text-[10px] font-semibold ${ok ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-600'}`}>{ok ? 'Fait' : 'À faire'}</span>
          </div>
        ))}
      </div>
    )
  }
  return <SuiviMock />
}

/* ---------- Démo ---------- */
