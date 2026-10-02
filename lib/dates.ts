const pad = (n: number) => String(n).padStart(2, '0')

export function todayISO() {
  const d = new Date()
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

const parse = (iso: string) => new Date(`${iso}T00:00:00`)

export function addDays(iso: string, n: number) {
  const d = parse(iso)
  d.setDate(d.getDate() + n)
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

export function daysBetween(from: string, to: string) {
  return Math.round((parse(to).getTime() - parse(from).getTime()) / 86_400_000)
}

export function fmtDate(iso: string, withWeekday = true) {
  return parse(iso).toLocaleDateString('fr-FR', {
    weekday: withWeekday ? 'long' : undefined,
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export function fmtShort(iso: string) {
  return parse(iso).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })
}

export function relativeDay(iso: string) {
  const d = daysBetween(todayISO(), iso)
  if (d === 0) return "Aujourd'hui"
  if (d === 1) return 'Demain'
  if (d === -1) return 'Hier'
  return d > 0 ? `Dans ${d} jours` : `Il y a ${-d} jours`
}

export function addMinutes(time: string, minutes: number) {
  const [h, m] = time.split(':').map(Number)
  const total = h * 60 + m + minutes
  return `${pad(Math.floor(total / 60) % 24)}:${pad(total % 60)}`
}

export function fmtTime(time: string) {
  const [h, m] = time.split(':')
  return `${Number(h)} h ${m}`
}

export function fmtDuration(minutes: number) {
  if (minutes < 60) return `${minutes} min`
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return m ? `${h} h ${pad(m)}` : `${h} h`
}

export function fmtTimestamp(iso: string) {
  return new Date(iso).toLocaleString('fr-FR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })
}
