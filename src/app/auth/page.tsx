'use client'

import { signIn } from 'next-auth/react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Swal from 'sweetalert2'

export default function AuthPage() {
  const router = useRouter()
  const [name, setName] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    
    try {
      const result = await signIn('credentials', {
        name,
        password,
        redirect: false
      })

      if (!result) {
        throw new Error('Authentication response is undefined')
      }

      if (result.error) {
        console.error(result.error)
        await Swal.fire({
          icon: 'error',
          title: 'Authentication Failed',
          text: 'Invalid credentials. Please try again.'
        })
      } else if (result.ok) {
        await Swal.fire({
          icon: 'success',
          title: 'Login Successful',
          text: 'You are now logged in.'
        })
        // Redirect to the admin dashboard page after successful login
        router.replace('/admin')
      }
    } catch (error) {
      console.error('Login error:', error)
      await Swal.fire({
        icon: 'error',
        title: 'System Error',
        text: 'An unexpected error occurred. Please try again later.'
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-base-200 flex items-center justify-center">
      <div className="hero-content flex-col lg:flex-row-reverse gap-8 w-full max-w-4xl">
        <div className="text-center lg:text-left lg:w-1/2">
          <h1 className="text-5xl font-bold">Login now!</h1>
          <p className="py-6">
            Provident cupiditate voluptatem et in. Quaerat fugiat ut assumenda
            excepturi exercitationem quasi. In deleniti eaque aut repudiandae
            et a id nisi.
          </p>
        </div>
        
        <div className="card bg-base-100 w-full lg:w-1/2 shadow-2xl">
          <div className="card-body">
            <form onSubmit={handleSubmit}>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Name</span>
                </label>
                <input
                  type="text"
                  className="input input-bordered w-full"
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              
              <div className="form-control mt-4">
                <label className="label">
                  <span className="label-text">Password</span>
                </label>
                <input
                  type="password"
                  className="input input-bordered w-full"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              
              <div className="form-control mt-6">
                <button 
                  type="submit" 
                  className="btn btn-primary w-full"
                  disabled={isLoading}
                >
                  {isLoading ? 'Logging in...' : 'Login'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}