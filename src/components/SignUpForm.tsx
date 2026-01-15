"use client";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/src/components/ui/form";
import { Input } from "@/src/components/ui/input";
import { Button } from "@/src/components/ui/button";
import { useState } from "react";

const formSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  email: z.email({error : "Please enter a valid email"}),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export default function SignUpForm() {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: { fullName: "", email: "", password: "" },
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setError("");
    setSuccess("");
    const BackendURL = process.env.NEXT_PUBLIC_BACKEND_URL
    if(!BackendURL){
        setError("Backend url not found")
    }
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
        credentials : 'include'
      });
      const data = await res.json();
      if (!res.ok) {
        console.log("res -> ", res)
        setError(data.error || "Sign up failed");
      } else {
        setSuccess("Sign up successful! Please check your email.");
        form.reset();
      }
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    }
  }

  return (
    <Form {...form}>
      <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="fullName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" {...field} />
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
                <Input type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? "Signing up..." : "Sign Up"}
        </Button>
        {error && <div className="text-red-500 text-sm">{error}</div>}
        {success && <div className="text-green-600 text-sm">{success}</div>}
      </form>
    </Form>
  );
}