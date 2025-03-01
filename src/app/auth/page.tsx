'use client'

import { signIn, SignInResponse } from 'next-auth/react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Swal from 'sweetalert2'
export default function AuthPage() {
  const router = useRouter()
  const [name, setName] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const result = (await signIn('credentials', {
      name,
      password,
      redirect: false
    })) as SignInResponse

    if (result.error) {
      console.error(result.error)
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Invalid credentials'
      })
    }
    if (result.ok) {
      // Redirect to a secure page on successful sign in
      await Swal.fire({
        icon: 'success',
        title: 'Logged in!',
        text: 'You are now logged in.'
      })
      // Redirect to the admin dashboard page after successful login
      router.replace('/admin')
    }
  }
  return (
    <>
      <div className="hero bg-base-200 min-h-screen">
        <div className="hero-content flex-col lg:flex-row-reverse">
          <div className="text-center lg:text-left">
            <h1 className="text-5xl font-bold">Login now!</h1>
            <p className="py-6">
              Provident cupiditate voluptatem et in. Quaerat fugiat ut assumenda
              excepturi exercitationem quasi. In deleniti eaque aut repudiandae
              et a id nisi.
            </p>
          </div>
          <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl">
            <div className="card-body">
              <form className="fieldset" onSubmit={handleSubmit}>
                <label className="fieldset-label">Name</label>
                <input
                  type="text"
                  className="input"
                  placeholder="Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
                <label className="fieldset-label">Password</label>
                <input
                  type="password"
                  className="input"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button className="btn btn-neutral mt-4">Login</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
