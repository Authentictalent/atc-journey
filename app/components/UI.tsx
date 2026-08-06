// Badge
export function Badge({ status }: { status: 'active' | 'pending' | 'completed' | 'error' }) {
  const variants = {
    active: 'badge-active',
    pending: 'badge-pending',
    completed: 'badge-completed',
    error: 'badge-error',
  }

  const labels = {
    active: '🟢 Actif',
    pending: '🟡 En attente',
    completed: '✅ Terminé',
    error: '🔴 Erreur',
  }

  return <span className={variants[status]}>{labels[status]}</span>
}

// Button variants
export function Button({ children, variant = 'primary', ...props }: { children: React.ReactNode; variant?: 'primary' | 'secondary' | 'tertiary'; [key: string]: any }) {
  const variants = {
    primary: 'px-4 py-2 rounded-full bg-navy text-off-white font-medium hover:opacity-90 transition-opacity',
    secondary: 'px-4 py-2 rounded-full bg-lime text-navy font-medium hover:opacity-90 transition-opacity',
    tertiary: 'px-4 py-2 rounded-full bg-transparent border border-navy text-navy font-medium hover:bg-navy hover:text-off-white transition-all',
  }

  return (
    <button className={variants[variant]} {...props}>
      {children}
    </button>
  )
}

// Progress indicator
export function Progress({ items }: { items: { done: number; total: number }[] }) {
  return (
    <div className="flex gap-1">
      {items.map((item, i) => (
        <div key={i} className="flex gap-0.5">
          {Array.from({ length: item.total }).map((_, j) => (
            <div
              key={j}
              className={`w-3 h-3 rounded-full ${
                j < item.done ? 'bg-teal' : 'bg-border-color'
              }`}
            />
          ))}
        </div>
      ))}
    </div>
  )
}
