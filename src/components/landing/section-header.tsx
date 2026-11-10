import type { ReactNode } from 'react'

// Gemensam rubrik för landningssidans sektioner: liten etikett, rubrik och ingress,
// så att alla sektioner får samma hierarki i stället för varsin badge-variant.
export function SectionHeader({
  eyebrow,
  title,
  description,
  align = 'center',
}: {
  eyebrow: string
  title: ReactNode
  description?: ReactNode
  align?: 'center' | 'left'
}) {
  const centered = align === 'center'
  return (
    <div className={`mb-14 ${centered ? 'mx-auto max-w-2xl text-center' : 'max-w-2xl'}`}>
      <p className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-primary">{eyebrow}</p>
      <h2 className="text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">{title}</h2>
      {description && (
        <p className={`mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg ${centered ? 'mx-auto max-w-xl' : ''}`}>
          {description}
        </p>
      )}
    </div>
  )
}
