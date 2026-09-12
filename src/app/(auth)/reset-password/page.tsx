import { ResetPasswordForm } from '@/components/auth/reset-password-form'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Återställ lösenord – Rekryo' }

export default function ResetPasswordPage() {
  return <ResetPasswordForm />
}
