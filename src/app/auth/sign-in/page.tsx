'use client'

import React, { useState } from 'react'
import InputField from '@/components/fields/InputField'
import Card from '@/components/card'
import Button from '@/components/ui/Button'
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
    <div className="flex h-screen w-full items-center justify-center bg-background">
      <Card extra="w-full max-w-md p-8 !rounded-2xl">
        <div className="mb-8 flex flex-col items-center">
          <img src="/logo-dark.png" alt="Moreine Logo" className="h-40 mb-6 w-full object-contain dark:hidden" />
          <img src="/logo-white.png" alt="Moreine Logo" className="h-40 mb-6 w-full object-contain hidden dark:block" />
          <h3 className="mb-2 text-3xl font-bold text-text-primary">
            Sign In
          </h3>
          <p className="text-sm text-text-secondary text-center">
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

          <Button variant="primary" size="lg" className="w-full" type="submit" disabled={loading}>
            {loading ? 'Signing In...' : 'Sign In'}
          </Button>
        </form>
      </Card>
    </div>
  )
}


