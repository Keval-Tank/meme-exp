"use client"
import { useEffect } from "react"
import { useDispatch } from "react-redux"
import { AppDispatch } from "@/lib/store"
import { userThunk } from "@/lib/features/user-store/userThunk"

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch<AppDispatch>()
  useEffect(() => {
    dispatch(userThunk())
  }, [dispatch])
  return <>{children}</>
}