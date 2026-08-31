'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useLanguage } from '@/lib/i18n/context'

export default function LoginPage() {
  const { t, locale } = useLanguage()
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    startTransition(async () => {
      const supabase = createClient()
      const { error: authError } = await supabase.auth.signInWithPassword({ email, password })
      if (authError) {
        setError(locale === 'ar' ? 'البريد الإلكتروني أو كلمة المرور غير صحيحة.' : 'Invalid email or password.')
      } else {
        router.push('/dashboard')
        router.refresh()
      }
    })
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-cream px-4">
      <div className="w-full max-w-md">
        {/* Logo / Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-sage rounded-2xl mb-4 shadow-lg">
            <span className="text-2xl">☕</span>
          </div>
          <h1 className="text-3xl font-bold text-olive">Moreine</h1>
          <p className="text-olive/60 mt-1 text-sm">
            {locale === 'ar' ? 'لوحة العمليات الداخلية' : 'Internal Operations Dashboard'}
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-md border border-cream-dark p-8">
          <h2 className="text-xl font-semibold text-charcoal mb-6">
            {locale === 'ar' ? 'تسجيل الدخول' : 'Sign In'}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-olive mb-1.5"
              >
                {locale === 'ar' ? 'البريد الإلكتروني' : 'Email address'}
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg border border-cream-dark bg-cream-light text-charcoal placeholder-olive/40 focus:outline-none focus:ring-2 focus:ring-sage focus:border-transparent transition"
                placeholder={locale === 'ar' ? 'name@example.com' : 'name@example.com'}
                dir="ltr"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-olive mb-1.5"
              >
                {locale === 'ar' ? 'كلمة المرور' : 'Password'}
              </label>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg border border-cream-dark bg-cream-light text-charcoal placeholder-olive/40 focus:outline-none focus:ring-2 focus:ring-sage focus:border-transparent transition"
                placeholder="••••••••"
                dir="ltr"
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isPending}
              className="w-full py-2.5 px-4 bg-sage hover:bg-sage-dark text-white font-semibold rounded-lg transition disabled:opacity-60 disabled:cursor-not-allowed shadow-sm"
            >
              {isPending
                ? (locale === 'ar' ? 'جارٍ تسجيل الدخول...' : 'Signing in...')
                : (locale === 'ar' ? 'تسجيل الدخول' : 'Sign In')}
            </button>
          </form>

          <p className="text-xs text-olive/50 text-center mt-6">
            {locale === 'ar'
              ? 'للوصول، تواصل مع مدير النظام.'
              : 'Access is invitation-only. Contact your admin.'}
          </p>
        </div>
      </div>
    </div>
  )
}
