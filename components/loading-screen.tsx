"use client"

import { useState, useEffect } from "react"

export default function LoadingScreen() {
  const [rotation, setRotation] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setRotation((prev) => prev + 2)
    }, 16)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-amber-50 to-amber-100">
      <div className="relative mb-8">
        <div
          className="text-8xl transition-transform duration-75 ease-linear"
          style={{ transform: `rotate(${rotation}deg)` }}
        >
          ♔
        </div>
        <div className="absolute inset-0 text-8xl animate-pulse opacity-30">♔</div>
      </div>

      <h1 className="text-4xl font-bold text-amber-900 mb-4">Ajedrez Real</h1>

      <div className="flex space-x-1 mb-4">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="w-3 h-3 bg-amber-600 rounded-full animate-bounce"
            style={{ animationDelay: `${i * 0.2}s` }}
          />
        ))}
      </div>

      <p className="text-amber-700 text-lg">Cargando el tablero...</p>
    </div>
  )
}
