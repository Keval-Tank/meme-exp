"use client"
import { logout } from "@/lib/auth/logout"
import { useRouter } from "next/navigation"
import { useDispatch } from "react-redux"
import { AppDispatch } from "@/lib/store"
import { removeUserState } from "@/lib/features/user-store/userSlice"
import RouteSwitcher from "@/components/RouteSwitcher"

export default function LogoutButton() {
    const router = useRouter()
    const dispatch = useDispatch()

    async function handleLogout() {
        const result = await logout()
        dispatch(removeUserState())
        localStorage.setItem("isLoggedIn", "false")
        localStorage.setItem("email", " ")
        localStorage.setItem("sessionId", " ")
        if (result.success) {
            router.push("/auth/login")
        } else {
            console.error(result.error)
        }
    }

    return (
        <div>
            <RouteSwitcher/>
            <button onClick={handleLogout}>
            Logout
        </button>
        </div>
    )
}