"use client"

import { PieceColor, type ChessPiece } from "@/lib/chess-types"
import { getPieceSymbol } from "@/lib/chess-utils"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface PlayerNames {
  white: string
  black: string
}

interface GameInfoProps {
  currentPlayer: PieceColor
  gameStatus: string
  moveHistory: string[]
  capturedPieces: {
    [PieceColor.WHITE]: ChessPiece[]
    [PieceColor.BLACK]: ChessPiece[]
  }
  playerNames: PlayerNames
}

export default function GameInfo({
  currentPlayer,
  gameStatus,
  moveHistory,
  capturedPieces,
  playerNames,
}: GameInfoProps) {
  const currentPlayerName = currentPlayer === PieceColor.WHITE ? playerNames.white : playerNames.black

  return (
    <div className="space-y-4 animate-in slide-in-from-right-4 duration-700">
      <Card className="border-amber-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
        <CardHeader className="pb-2 bg-gradient-to-r from-amber-50 to-amber-100">
          <CardTitle className="text-amber-900 animate-in slide-in-from-top-2 duration-500">Estado del Juego</CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="flex items-center gap-3 mb-3 animate-in slide-in-from-left-2 duration-500 delay-100">
            <div
              className={`w-5 h-5 rounded-full shadow-md transition-all duration-500 animate-pulse ${
                currentPlayer === PieceColor.WHITE
                  ? "bg-slate-100 border-2 border-slate-400"
                  : "bg-slate-800 border-2 border-slate-600"
              }`}
            ></div>
            <span className="font-semibold text-lg text-slate-800">Turno de {currentPlayerName}</span>
            <span className="text-sm text-slate-600">
              ({currentPlayer === PieceColor.WHITE ? "Blancas" : "Negras"})
            </span>
          </div>

          {gameStatus === "ongoing" ? (
            <p className="text-sm text-slate-600 bg-slate-50 px-3 py-2 rounded-lg animate-in fade-in-0 duration-300">
              Partida en curso
            </p>
          ) : gameStatus.includes("check") && !gameStatus.includes("checkmate") ? (
            <p className="text-sm text-orange-700 font-semibold bg-orange-50 px-3 py-2 rounded-lg border border-orange-200 animate-in slide-in-from-bottom-2 duration-500 animate-pulse">
              ¡{gameStatus.split("-")[1] === PieceColor.WHITE ? playerNames.white : playerNames.black} está en jaque!
            </p>
          ) : gameStatus.includes("checkmate") ? (
            <p className="text-sm text-red-700 font-bold bg-red-50 px-3 py-2 rounded-lg border border-red-200 animate-in slide-in-from-bottom-2 duration-500 animate-bounce">
              ¡Jaque mate! Ganó {gameStatus.split("-")[1] === "White" ? playerNames.white : playerNames.black}
            </p>
          ) : gameStatus === "stalemate" ? (
            <p className="text-sm text-blue-700 font-semibold bg-blue-50 px-3 py-2 rounded-lg border border-blue-200 animate-in slide-in-from-bottom-2 duration-500">
              ¡Tablas por ahogado!
            </p>
          ) : null}
        </CardContent>
      </Card>

      <Tabs defaultValue="moves" className="w-full animate-in slide-in-from-right-4 duration-700 delay-200">
        <TabsList className="grid grid-cols-2 bg-amber-100 transition-all duration-300">
          <TabsTrigger
            value="moves"
            className="data-[state=active]:bg-amber-600 data-[state=active]:text-white transition-all duration-300 hover:scale-105"
          >
            Historial
          </TabsTrigger>
          <TabsTrigger
            value="captured"
            className="data-[state=active]:bg-amber-600 data-[state=active]:text-white transition-all duration-300 hover:scale-105"
          >
            Capturadas
          </TabsTrigger>
        </TabsList>

        <TabsContent value="moves">
          <Card className="border-amber-200 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="pt-4">
              {moveHistory.length > 0 ? (
                <div className="max-h-64 overflow-y-auto">
                  {Array.from({ length: Math.ceil(moveHistory.length / 2) }).map((_, i) => (
                    <div
                      key={i}
                      className="grid grid-cols-2 border-b border-amber-100 py-2 hover:bg-amber-50 transition-all duration-200 hover:scale-[1.02] animate-in slide-in-from-left-2 duration-300"
                      style={{ animationDelay: `${i * 50}ms` }}
                    >
                      <div className="text-sm">
                        <span className="text-amber-700 font-medium mr-2">{i + 1}.</span>
                        <span className="font-mono">{moveHistory[i * 2]}</span>
                      </div>
                      {moveHistory[i * 2 + 1] && <div className="text-sm font-mono">{moveHistory[i * 2 + 1]}</div>}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-slate-500 text-center py-4 animate-pulse">Sin movimientos aún</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="captured">
          <Card className="border-amber-200 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="pt-4">
              <div className="space-y-6">
                <div className="bg-slate-50 p-4 rounded-lg hover:bg-slate-100 transition-all duration-300 animate-in slide-in-from-left-2 duration-500">
                  <h3 className="text-sm font-semibold mb-2 text-slate-800">Capturadas por {playerNames.white}:</h3>
                  <div className="flex flex-wrap gap-2">
                    {capturedPieces[PieceColor.BLACK].length > 0 ? (
                      capturedPieces[PieceColor.BLACK].map((piece, i) => (
                        <span
                          key={i}
                          className="text-2xl text-slate-900 bg-white p-1 rounded shadow-sm hover:scale-110 transition-all duration-300 animate-in zoom-in-50"
                          style={{ animationDelay: `${i * 100}ms` }}
                        >
                          {getPieceSymbol(piece)}
                        </span>
                      ))
                    ) : (
                      <span className="text-sm text-slate-500 italic">Ninguna</span>
                    )}
                  </div>
                </div>

                <div className="bg-slate-800 p-4 rounded-lg hover:bg-slate-700 transition-all duration-300 animate-in slide-in-from-right-2 duration-500 delay-100">
                  <h3 className="text-sm font-semibold mb-2 text-slate-100">Capturadas por {playerNames.black}:</h3>
                  <div className="flex flex-wrap gap-2">
                    {capturedPieces[PieceColor.WHITE].length > 0 ? (
                      capturedPieces[PieceColor.WHITE].map((piece, i) => (
                        <span
                          key={i}
                          className="text-2xl text-slate-100 bg-slate-700 p-1 rounded shadow-sm hover:scale-110 transition-all duration-300 animate-in zoom-in-50"
                          style={{ animationDelay: `${i * 100}ms` }}
                        >
                          {getPieceSymbol(piece)}
                        </span>
                      ))
                    ) : (
                      <span className="text-sm text-slate-400 italic">Ninguna</span>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="relative flex justify-center animate-in slide-in-from-bottom-4 duration-700 delay-300 mt-96 mb-16">
        <div className="relative animate-in zoom-in-50 duration-500 delay-400 w-full flex justify-center">
          <img
            src="/images/chess-mascot.png"
            alt="Mascota del ajedrez"
            className="w-64 h-64 object-contain hover:scale-105 transition-all duration-300 animate-bounce"
            style={{ animationDuration: "3s" }}
          />
          <div className="absolute -top-2 -right-8 w-4 h-4 bg-green-400 rounded-full animate-pulse shadow-lg"></div>
        </div>
      </div>
    </div>
  )
}
