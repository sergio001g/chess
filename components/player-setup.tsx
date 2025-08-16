"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface PlayerNames {
  white: string
  black: string
}

interface PlayerSetupProps {
  onPlayersSet: (names: PlayerNames) => void
}

export default function PlayerSetup({ onPlayersSet }: PlayerSetupProps) {
  const [whitePlayer, setWhitePlayer] = useState("")
  const [blackPlayer, setBlackPlayer] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (whitePlayer.trim() && blackPlayer.trim()) {
      onPlayersSet({
        white: whitePlayer.trim(),
        black: blackPlayer.trim(),
      })
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md border border-slate-200">
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">♔♛</div>
          <h1 className="text-3xl font-bold text-slate-800 mb-2">Configurar Jugadores</h1>
          <p className="text-slate-600">Introduce los nombres de ambos jugadores</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="white-player" className="text-slate-700 font-medium">
              🤍 Jugador Blancas
            </Label>
            <Input
              id="white-player"
              type="text"
              value={whitePlayer}
              onChange={(e) => setWhitePlayer(e.target.value)}
              placeholder="Nombre del jugador 1"
              className="border-slate-300 focus:border-amber-500 focus:ring-amber-500"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="black-player" className="text-slate-700 font-medium">
              🖤 Jugador Negras
            </Label>
            <Input
              id="black-player"
              type="text"
              value={blackPlayer}
              onChange={(e) => setBlackPlayer(e.target.value)}
              placeholder="Nombre del jugador 2"
              className="border-slate-300 focus:border-amber-500 focus:ring-amber-500"
              required
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-semibold py-3 rounded-lg transition-all duration-200 transform hover:scale-105"
            disabled={!whitePlayer.trim() || !blackPlayer.trim()}
          >
            ¡Comenzar Partida!
          </Button>
        </form>
      </div>
    </div>
  )
}
