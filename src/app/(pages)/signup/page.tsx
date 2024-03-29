"use client"
import { appwriteService } from '@/appwrite/config'
import React, { FormEvent, useState } from 'react'
import { useRouter } from "next/navigation"
import Image from 'next/image'

const Signup = () => {
  const [error, setError] = useState("")
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: ""
  })

  const router = useRouter()

  const signup = async (e: FormEvent) => {
    e.preventDefault()
    try {
      const userData = await appwriteService.createUserAccount(formData)
      if (userData) {
        router.push("/console")
      }
    } catch (error: any) {
      setError(error.message)
    }

  }
  return (
    <div className="login flex  h-screen w-ful">
      <div className="hidden sm:flex flex-col items-center justify-end h-full w-1/2 text-center p-4">
        <h1 className="font-bold text-6xl tracking-wider mb-6">Hydrat8</h1>
        <Image className="text-blue-500" src="/cloud.svg" height={150} width={480} alt="projection" />
      </div>
      <form className="flex flex-col justify-center items-center h-full w-full sm:w-1/2 bg-white text-black" onSubmit={signup}>
        <div className="w-[75%]">
          {
            error &&
            <div className="error flex justify-center items-center p-4 my-5 rounded bg-red-400 border border-red-700 text-red-700">
              <h1>{error}</h1>
            </div>
          }
          <div>
            <h1 className="font-bold text-3xl ">Sign up</h1>
          </div>
          <div className="my-5">
            <label htmlFor="username">Username*</label>
            <input type="text" value={formData.name} onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                name: e.target.value,
              }))} placeholder="Enter your username" required />
          </div>
          <div className="mb-5">
            <label htmlFor="username">Email*</label>
            <input type="email" value={formData.email} onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                email: e.target.value,
              }))} placeholder="Enter your email" required />
          </div>
          <div>
            <label htmlFor="password">Password*</label>
            <input type="password" value={formData.password} onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                password: e.target.value,
              }))} placeholder="Enter your password" required />
          </div>
          <button className="text-white bg-blue-500 p-2 rounded w-full border border-none mt-6" type="submit">Signup</button>
          <p></p>
        </div>
      </form>
    </div>
  )
}

export default Signup