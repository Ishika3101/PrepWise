"use client"

import Image from 'next/image';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import Link from 'next/link';
// Auth actions are dynamically imported inside the submit handler to avoid
// evaluating Firebase config on initial render

const signInSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const signUpSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

interface AuthFormProps {
  type: "sign-in" | "sign-up"
}

const AuthForm = ({ type }: AuthFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  
  // Use separate form instances for sign-in and sign-up
  const signInForm = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: "", password: "" },
  });

  const signUpForm = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: { name: "", email: "", password: "", confirmPassword: "" },
  });

  const form = type === "sign-in" ? signInForm : signUpForm;
 
  async function onSubmit(values: any) {
    setIsLoading(true);
    setError(null);
    
    try {
      let result;
      const actions = await import('@/lib/actions/auth.action');
      
      if (type === "sign-in") {
        result = await actions.signIn(values.email, values.password);
      } else {
        result = await actions.signUp(values.email, values.password, values.name);
      }
      
      if (result.success) {
        // Redirect to home page on successful authentication
        router.push('/');
      } else {
        setError(result.error || 'Authentication failed');
      }
    } catch (error: any) {
      console.error("Authentication error:", error);
      setError(error.message || 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="auth-layout">
      <div className="card-border lg:min-w-[566px]">
        <div className="flex flex-col gap-6 card py-14 px-10">
          <div className="flex flex-row gap-2 justify-center">
            <Image src="/logo.svg" alt="logo" height={32} width={38} />
            <h2 className="text-primary-100">PrepWise</h2>
          </div>
          
          <div className="text-center">
            <h3 className="text-2xl font-bold text-white mb-2">
              {type === "sign-in" ? "Welcome back" : "Create your account"}
            </h3>
            <p className="text-light-100">
              {type === "sign-in" 
                ? "Sign in to continue your interview preparation" 
                : "Start your journey to ace your interviews"
              }
            </p>
          </div>
          
          {error && (
            <div className="p-3 text-sm text-destructive-100 bg-destructive-100/10 border border-destructive-100/20 rounded-md">
              {error}
            </div>
          )}
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {type === "sign-up" && (
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="john@example.com" type="email" {...field} />
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
                      <Input placeholder="••••••••" type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {type === "sign-up" && (
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm Password</FormLabel>
                      <FormControl>
                        <Input placeholder="••••••••" type="password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Loading..." : type === "sign-in" ? "Sign In" : "Sign Up"}
              </Button>
            </form>
          </Form>
          
          <div className="text-center">
            <p className="text-light-100">
              {type === "sign-in" ? "Don't have an account? " : "Already have an account? "}
              <Link 
                href={type === "sign-in" ? "/sign-up" : "/sign-in"}
                className="text-primary-200 hover:underline"
              >
                {type === "sign-in" ? "Sign up" : "Sign in"}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AuthForm
