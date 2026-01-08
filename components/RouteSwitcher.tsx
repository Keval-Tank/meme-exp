"use client"
import React from "react"
import { useRouter, usePathname } from "next/navigation"

const ROUTES = [
  { label: "Search Templates", path: "/search-template" },
  { label: "Text to Meme", path: "/text-to-meme" },
  { label: "Text to Visuals", path: "/text-to-visuals" },
]

export default function RouteSwitcher({ className }: { className?: string }) {
  const router = useRouter()
  const pathname = usePathname()

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const target = e.target.value
    if (target && target !== pathname) router.push(target)
  }

  return (
    <div className={className ?? "mb-4 flex items-center gap-3"}>
      <label className="text-sm text-gray-600">Go to:</label>
      <select
        value={pathname ?? ""}
        onChange={handleChange}
        className="border rounded px-2 py-1 text-sm"
        aria-label="Navigate to route"
      >
        <option value="">Select...</option>
        {ROUTES.map((r) => (
          <option key={r.path} value={r.path}>
            {r.label}
          </option>
        ))}
      </select>

      {/* optional quick buttons */}
      <div className="ml-2 flex gap-2">
        {ROUTES.map((r) => (
          <button
            key={r.path}
            onClick={() => router.push(r.path)}
            className={
              "px-2 py-1 text-sm rounded " +
              (pathname === r.path ? "bg-blue-600 text-white" : "bg-gray-100")
            }
            aria-current={pathname === r.path ? "page" : undefined}
            type="button"
          >
            {r.label}
          </button>
        ))}
      </div>
    </div>
  )
}