"use client"

import type { ChessPiece, Position } from "@/lib/chess-types"
import ChessSquare from "./chess-square"

interface ChessBoardProps {
  board: (ChessPiece | null)[][]
  selectedPiece: Position | null
  validMoves: Position[]
  onSquareClick: (position: Position) => void
  animatingMove?: { from: Position; to: Position } | null
}

export default function ChessBoard({
  board,
  selectedPiece,
  validMoves,
  onSquareClick,
  animatingMove,
}: ChessBoardProps) {
  const isValidMove = (row: number, col: number) => {
    return validMoves.some((move) => move.row === row && move.col === col)
  }

  const isSelected = (row: number, col: number) => {
    return selectedPiece?.row === row && selectedPiece?.col === col
  }

  // Generate column labels (a-h)
  const columnLabels = Array.from({ length: 8 }, (_, i) => String.fromCharCode(97 + i))

  // Generate row labels (1-8)
  const rowLabels = Array.from({ length: 8 }, (_, i) => 8 - i)

  return (
    <div className="relative">
      <div className="grid grid-cols-[auto_repeat(8,1fr)] grid-rows-[repeat(8,1fr)_auto] bg-gradient-to-br from-amber-900 via-amber-800 to-amber-900 p-4 rounded-xl shadow-2xl animate-in fade-in-0 zoom-in-95 duration-700">
        {/* Empty top-left corner */}
        <div className="w-8"></div>

        {/* Column labels (top) */}
        {columnLabels.map((label, index) => (
          <div
            key={`top-${label}`}
            className="flex justify-center items-center h-8 text-lg font-semibold text-amber-100 animate-in slide-in-from-top-2 duration-500"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            {label}
          </div>
        ))}

        {/* Board with row labels */}
        {board.map((row, rowIndex) => (
          <>
            {/* Row label */}
            <div
              key={`label-${rowIndex}`}
              className="flex justify-center items-center w-8 text-lg font-semibold text-amber-100 animate-in slide-in-from-left-2 duration-500"
              style={{ animationDelay: `${rowIndex * 50}ms` }}
            >
              {rowLabels[rowIndex]}
            </div>

            {/* Chess squares */}
            {row.map((piece, colIndex) => (
              <ChessSquare
                key={`${rowIndex}-${colIndex}`}
                piece={piece}
                position={{ row: rowIndex, col: colIndex }}
                isLight={(rowIndex + colIndex) % 2 === 0}
                isSelected={isSelected(rowIndex, colIndex)}
                isValidMove={isValidMove(rowIndex, colIndex)}
                onClick={() => onSquareClick({ row: rowIndex, col: colIndex })}
                isAnimating={
                  animatingMove &&
                  ((animatingMove.from.row === rowIndex && animatingMove.from.col === colIndex) ||
                    (animatingMove.to.row === rowIndex && animatingMove.to.col === colIndex))
                }
              />
            ))}
          </>
        ))}

        {/* Empty bottom-left corner */}
        <div className="w-8"></div>

        {/* Column labels (bottom) */}
        {columnLabels.map((label, index) => (
          <div
            key={`bottom-${label}`}
            className="flex justify-center items-center h-8 text-lg font-semibold text-amber-100 animate-in slide-in-from-bottom-2 duration-500"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            {label}
          </div>
        ))}
      </div>
    </div>
  )
}
