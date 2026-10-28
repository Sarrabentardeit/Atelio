import dotenv from 'dotenv'
import express from 'express'
import helmet from 'helmet'
import nodemailer from 'nodemailer'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: path.join(__dirname, '..', '.env') })

const PORT = Number(process.env.PORT ?? 4100)
const DATA_DIR = process.env.DATA_DIR ?? path.join(__dirname, '..', 'data')

const app = express()
app.set('trust proxy', 1)
app.use(helmet())
app.use(express.json({ limit: '20kb' }))

const escapeHtml = (v) => String(v).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c])

// Limite simple : 5 demandes par heure et par adresse IP.
const hits = new Map()
function tooMany(ip) {
  const now = Date.now()
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < 3_600_000)
  recent.push(now)
  hits.set(ip, recent)
  return recent.length > 5
}

function transporter() {
  const { SMTP_HOST, SMTP_USER, SMTP_PASS } = process.env
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) return null
  const port = Number(process.env.SMTP_PORT ?? 465)
  const secure = process.env.SMTP_SECURE ? process.env.SMTP_SECURE === 'true' : port === 465
  return nodemailer.createTransport({ host: SMTP_HOST, port, secure, auth: { user: SMTP_USER, pass: SMTP_PASS } })
}

async function sendMail(d) {
  const t = transporter()
  if (!t) throw new Error('SMTP non configuré')
  const lignes = [
    ['Nom', d.nom],
    ['Garage', d.garage],
    ['Téléphone', d.telephone],
    ['Message', d.message || '—'],
  ]
  await t.sendMail({
    from: process.env.SMTP_FROM || `ATELIO <${process.env.SMTP_USER}>`,
    to: process.env.DEMO_NOTIFY_TO || process.env.SMTP_USER,
    subject: `Nouvelle demande de démo — ${d.garage}`,
    text: lignes.map(([k, v]) => `${k} : ${v}`).join('\n'),
    html: `<div style="font-family:Arial,sans-serif;color:#1b1b1f">
  <h2 style="margin:0 0 12px;color:#E30613">Nouvelle demande de démonstration</h2>
  <table style="border-collapse:collapse">${lignes
    .map(([k, v]) => `<tr><td style="padding:6px 16px 6px 0;color:#6b7280">${escapeHtml(k)}</td><td style="padding:6px 0;font-weight:600">${escapeHtml(v)}</td></tr>`)
    .join('')}</table>
</div>`,
  })
}

// Copie locale de chaque demande (aucune demande n'est perdue si l'e-mail échoue).
function backup(d) {
  fs.mkdirSync(DATA_DIR, { recursive: true })
  fs.appendFileSync(path.join(DATA_DIR, 'demandes-demo.jsonl'), JSON.stringify({ date: new Date().toISOString(), ...d }) + '\n')
}

app.get('/health', (_req, res) => res.json({ ok: true }))

app.post('/demandes-demo', async (req, res) => {
  if (tooMany(req.ip)) return res.status(429).json({ error: 'Trop de demandes. Veuillez réessayer plus tard.' })

  const clean = (v, max) => String(v ?? '').trim().slice(0, max)
  const d = {
    nom: clean(req.body?.nom, 120),
    garage: clean(req.body?.garage, 160),
    telephone: clean(req.body?.telephone, 40),
    message: clean(req.body?.message, 2000),
  }
  if (!d.nom || !d.garage || !d.telephone) {
    return res.status(400).json({ error: 'Le nom, le garage et le téléphone sont requis.' })
  }

  let saved = false
  let mailed = false
  try {
    backup(d)
    saved = true
  } catch (err) {
    console.error('[demande] sauvegarde impossible :', err)
  }
  try {
    await sendMail(d)
    mailed = true
  } catch (err) {
    console.error('[demande] e-mail non envoyé :', err.message)
  }

  if (!saved && !mailed) return res.status(500).json({ error: 'La demande n’a pas pu être envoyée.' })
  return res.status(201).json({ ok: true })
})

app.listen(PORT, () => console.log(`ATELIO vitrine API sur le port ${PORT}`))
