"use client"

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function Home() {
  const router = useRouter()
  useEffect(() => {
    router.push('/login')
  }, [])
  return (
    <div className='h-screen flex flex-col justify-center items-center text-center'>
      <h1 className='font-bold text-5xl'>Hydrate</h1>
      <p className=''>Redirecting to dashboard</p>
    </div>
  )
}
