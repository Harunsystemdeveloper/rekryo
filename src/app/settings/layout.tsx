import { Navbar } from '@/components/navbar'

// Gemensam ram för /settings och /settings/privacy. Integritetssidan saknade tidigare
// navigeringsfältet helt, eftersom bara inställningssidan renderade det själv.
export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-10 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  )
}
