import { useId, useRef, useState } from 'react'
import { Sparkles } from 'lucide-react'
import { post } from '../lib/api'
import { useMeta } from '../lib/meta'
import { ErrorBox } from '../ui/kit'

const ACTIONS = [
  { key: 'draft', label: 'Create draft', needsText: false },
  { key: 'improve', label: 'Improve wording', needsText: true },
  { key: 'shorten', label: 'Make shorter', needsText: true },
  { key: 'expand', label: 'Expand details', needsText: true },
  { key: 'formalize', label: 'Executive / Legal tone', needsText: true },
  { key: 'luxury', label: 'Luxury property copy', needsText: true },
  { key: 'whatsapp', label: 'Format for WhatsApp', needsText: true },
  { key: 'rera_compliant', label: 'RERA compliant', needsText: true },
  { key: 'bullets', label: 'Bullet summary', needsText: true },
  { key: 'translate_ar', label: 'Translate → Arabic', needsText: true },
  { key: 'translate_en', label: 'Translate → English', needsText: true },
  { key: 'translate_ru', label: 'Translate → Russian', needsText: true },
] as const

export function AIWriting({ value, onChange, module = 'ai', label, kind = 'field', disabled, maxLength }: { value: string; onChange: (text: string) => void; module?: string; label: string; kind?: 'email' | 'whatsapp' | 'field'; disabled?: boolean; maxLength?: number }) {
  const { can, me } = useMeta(), id = useId(), current = useRef(value)
  current.current = value
  const [open, setOpen] = useState(false), [notes, setNotes] = useState(''), [draft, setDraft] = useState(''), [source, setSource] = useState(''), [busy, setBusy] = useState(false), [error, setError] = useState<any>(null)
  if (me?.party_id || !(can(module, 'create') || can(module, 'edit'))) return null
  const generate = async (action: string) => {
    const original = value; setBusy(true); setError(null); setDraft(''); setSource(original)
    try { const r = await post<{ text: string }>('/api/ai/write', { module, label, kind, action, instructions: notes, text: original }); setDraft(r.text) } catch (e) { setError(e) } finally { setBusy(false) }
  }
  return <div className="ai-writing"><button type="button" className="btn outline sm" disabled={disabled || busy} aria-expanded={open} aria-controls={id} onClick={() => setOpen(!open)}><Sparkles size={16} />Help me write</button>{open && <div id={id} className="writing-panel"><label className="label" htmlFor={`${id}-notes`}>What should this say?</label><textarea id={`${id}-notes`} className="textarea" rows={2} maxLength={3000} disabled={busy || disabled} value={notes} onChange={e => setNotes(e.target.value)} placeholder="For example: politely ask the customer to confirm the viewing slot or Form F signing date." /><p className="text-sm text-muted">Only this text and your notes are shared with your configured AI provider. Check all facts before using the draft.</p><div className="flex gap-1.5 flex-wrap">{ACTIONS.map(a => <button key={a.key} type="button" className="btn outline sm" disabled={disabled || busy || value.length > 12000 || (!value.trim() && !notes.trim()) || (a.needsText && !value.trim())} onClick={() => void generate(a.key)}>{busy ? 'Writing…' : a.label}</button>)}</div>{value.length > 12000 && <p>Use a shorter section of text (up to 12,000 characters).</p>}{error && <ErrorBox error={error} />}{draft && <div className="writing-preview"><label className="label" htmlFor={`${id}-draft`}>Review your draft</label><textarea id={`${id}-draft`} className="textarea" rows={6} value={draft} onChange={e => setDraft(e.target.value)} /><button type="button" className="btn green sm" disabled={disabled || busy || current.current !== source || !draft.trim() || !!(maxLength && draft.length > maxLength)} onClick={() => { onChange(draft); setDraft(''); setOpen(false) }}>Use this draft</button>{maxLength && draft.length > maxLength && <p>Shorten this draft to {maxLength} characters before using it.</p>}{current.current !== source && <p>Your original text changed. Generate a new draft to keep those edits.</p>}</div>}</div>}</div>
}
