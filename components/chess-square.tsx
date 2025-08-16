"use client"

import type { ChessPiece, Position } from "@/lib/chess-types"
import { getPieceSymbol } from "@/lib/chess-utils"
import { cn } from "@/lib/utils"

interface ChessSquareProps {
  piece: ChessPiece | null
  position: Position
  isLight: boolean
  isSelected: boolean
  isValidMove: boolean
  onClick: () => void
  isAnimating?: boolean
}

export default function ChessSquare({
  piece,
  position,
  isLight,
  isSelected,
  isValidMove,
  onClick,
  isAnimating,
}: ChessSquareProps) {
  return (
    <div
      className={cn(
        "w-16 h-16 flex items-center justify-center text-4xl relative cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-lg animate-in fade-in-0 zoom-in-95",
        isLight
          ? "bg-gradient-to-br from-amber-50 to-amber-100 hover:from-amber-100 hover:to-amber-200"
          : "bg-gradient-to-br from-amber-700 to-amber-800 hover:from-amber-600 hover:to-amber-700",
        isSelected &&
          "bg-gradient-to-br from-emerald-400 to-emerald-500 shadow-xl ring-2 ring-emerald-300 animate-pulse",
        isAnimating && "animate-bounce",
      )}
      onClick={onClick}
      data-position={`${position.row}-${position.col}`}
      style={{
        animationDelay: `${(position.row + position.col) * 30}ms`,
        animationDuration: isAnimating ? "0.6s" : "0.5s",
      }}
    >
      {piece && (
        <span
          className={cn(
            "select-none drop-shadow-lg transition-all duration-300 hover:scale-110",
            piece.color === "white"
              ? "text-slate-100 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] hover:drop-shadow-[0_4px_8px_rgba(0,0,0,0.9)]"
              : "text-slate-900 drop-shadow-[0_2px_4px_rgba(255,255,255,0.3)] hover:drop-shadow-[0_4px_8px_rgba(255,255,255,0.4)]",
            isAnimating && "animate-spin",
          )}
        >
          {getPieceSymbol(piece)}
        </span>
      )}

      {isValidMove && !piece && (
        <div className="absolute w-4 h-4 rounded-full bg-emerald-500 opacity-70 shadow-md animate-ping"></div>
      )}

      {isValidMove && piece && (
        <div className="absolute inset-0 border-4 border-emerald-500 opacity-70 rounded-sm shadow-md animate-pulse"></div>
      )}

      <div className="absolute inset-0 bg-gradient-to-br from-white/0 to-white/0 hover:from-white/10 hover:to-transparent transition-all duration-300 rounded-sm pointer-events-none"></div>
    </div>
  )
}
