"use client"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { useDispatch } from "react-redux"
import { AppDispatch } from "@/lib/store"
import { userThunk } from "@/lib/features/user-store/userThunk"
import { login } from "@/lib/auth/login"

export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
})

export default function LoginPage() {
  const dispatch = useDispatch<AppDispatch>()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  async function onSubmit(values: z.infer<typeof loginSchema>) {
    // setLoading(true)
    // setError(null)

    // try {
    //   const response = await fetch("/api/auth/login", {
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //     body: JSON.stringify({
    //       email: values.email,
    //       password: values.password,
    //     }),
    //   })

    //   const data = await response.json()

    //   if (!response.ok) {
    //     throw new Error(data.error || "Login failed")
    //   }

    //   // Redirect to home on success
    //   router.push("/")
    // } catch (err) {
    //   setError(err instanceof Error ? err.message : "Something went wrong")
    // } finally {
    //   setLoading(false)
    // }
    // console.log(values)
    // console.log("values -> ", values)
    // dispatch(userThunk({
    //     email : values.email,
    //     password : values.password
    // }))
    // const response = await fetch('/api/login', {
    //     method : "POST",
    //     headers : {
    //         'Content-Type' : "application/json"
    //     },
    //     body : JSON.stringify(values),
    //     credentials : 'include'
    // })
    // const data = await response.json()
    // console.log("login request data -> ", data)
    const response = await login(values)
    console.log(response)
  }

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-gray-50">
      <div className="w-full max-w-md space-y-6 bg-white p-8 rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Login</h1>
          <p className="text-gray-500 mt-2">Welcome back</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-500 p-3 rounded-md text-sm">
            {error}
          </div>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input 
                      type="email" 
                      placeholder="Enter your email" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input 
                      type="password" 
                      placeholder="Enter your password" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </Button>
          </form>
        </Form>

        <div className="text-center text-sm text-gray-500">
          <p>Don&apos;t have an account?</p>
          <Button 
            variant="link" 
            onClick={() => router.push("/auth/signUp")}
            className="p-0"
          >
            Sign up here
          </Button>
        </div>
      </div>
    </div>
  )
}