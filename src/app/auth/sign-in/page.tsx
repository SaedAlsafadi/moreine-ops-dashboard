'use client'

import React, { useState } from 'react'
import InputField from '@/components/fields/InputField'
import { loginAction } from '@/app/actions/auth'

export default function SignInDefault() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    
    try {
      const formData = new FormData()
      formData.append('email', email)
      formData.append('password', password)
      
      const res = await loginAction(formData)
      if (res.error) {
        setError(res.error)
      } else {
        window.location.href = '/admin/dashboard'
      }
    } catch (err: any) {
      console.error("Login Exception:", err)
      setError(err.message || 'An unexpected error occurred.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex h-screen w-full items-center justify-center bg-lightPrimary dark:bg-navy-900">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-horizon-sm dark:bg-navy-800">
        <div className="mb-8 flex flex-col items-center">
          <img src="/logo-dark.png" alt="Moreine Logo" className="h-20 mb-6 object-contain dark:hidden" />
          <img src="/logo-white.png" alt="Moreine Logo" className="h-20 mb-6 object-contain hidden dark:block" />
          <h3 className="mb-2 text-3xl font-bold text-navy-700 dark:text-white">
            Sign In
          </h3>
          <p className="text-sm text-gray-600 text-center">
            Enter your email and password to access the ops dashboard.
          </p>
        </div>

        <form onSubmit={handleLogin} className="w-full">
          <InputField
            variant="auth"
            extra="mb-4"
            label="Email*"
            placeholder="mail@moreine.com"
            id="email"
            type="email"
            value={email}
            state={error ? "error" : ""}
            onChange={(e: any) => setEmail(e.target.value)}
          />
          <InputField
            variant="auth"
            extra="mb-6"
            label="Password*"
            placeholder="Min. 8 characters"
            id="password"
            type="password"
            value={password}
            state={error ? "error" : ""}
            onChange={(e: any) => setPassword(e.target.value)}
          />

          {error && <div className="mb-4 text-sm text-red-500 font-medium text-center">{error}</div>}

          <button
            type="submit"
            disabled={loading}
            className="linear w-full rounded-xl bg-brand-400 py-3 text-base font-medium text-white transition duration-200 hover:bg-brand-500 active:bg-brand-600 dark:bg-brand-400 dark:hover:bg-brand-300 dark:active:opacity-90 disabled:opacity-70"
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  )
}
