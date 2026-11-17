import type { ReactNode } from 'react'

// Gemensam rubrik för landningssidans sektioner: liten etikett, rubrik och ingress.
// Etiketten skrivs som vanlig text med ett kort streck framför i stället för spärrade
// versaler, och rubriken får balanserade radbrytningar så att den inte ser uppställd ut.
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
    <div className={`mb-10 lg:mb-14 ${centered ? 'mx-auto max-w-2xl text-center' : 'max-w-2xl'}`}>
      <p className={`mb-4 flex items-center gap-2.5 text-sm font-medium text-primary ${centered ? 'justify-center' : ''}`}>
        <span className="h-px w-6 bg-primary/50" aria-hidden />
        {eyebrow}
      </p>
      <h2 className="text-balance text-3xl font-semibold leading-[1.12] tracking-[-0.022em] sm:text-[2.6rem]">{title}</h2>
      {description && (
        <p className={`mt-5 text-pretty text-base leading-[1.7] text-muted-foreground sm:text-lg ${centered ? 'mx-auto max-w-xl' : ''}`}>
          {description}
        </p>
      )}
    </div>
  )
}
