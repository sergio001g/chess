"use client"

import { useState, useEffect } from "react"
import ChessBoard from "./chess-board"
import GameControls from "./game-controls"
import GameInfo from "./game-info"
import LoadingScreen from "./loading-screen"
import PlayerSetup from "./player-setup"
import { initialBoardState, PieceType, PieceColor, type ChessPiece, type Position } from "@/lib/chess-types"
import { isValidMove, makeMove, isCheck, isCheckmate, isStalemate } from "@/lib/chess-rules"
import { Github } from "lucide-react"

type GameState = "loading" | "setup" | "playing"

interface PlayerNames {
  white: string
  black: string
}

export default function ChessGame() {
  const [gameState, setGameState] = useState<GameState>("loading")
  const [playerNames, setPlayerNames] = useState<PlayerNames>({ white: "", black: "" })
  const [board, setBoard] = useState<(ChessPiece | null)[][]>(initialBoardState())
  const [currentPlayer, setCurrentPlayer] = useState<PieceColor>(PieceColor.WHITE)
  const [selectedPiece, setSelectedPiece] = useState<Position | null>(null)
  const [validMoves, setValidMoves] = useState<Position[]>([])
  const [gameStatus, setGameStatus] = useState<string>("ongoing")
  const [moveHistory, setMoveHistory] = useState<string[]>([])
  const [capturedPieces, setCapturedPieces] = useState<{
    [PieceColor.WHITE]: ChessPiece[]
    [PieceColor.BLACK]: ChessPiece[]
  }>({
    [PieceColor.WHITE]: [],
    [PieceColor.BLACK]: [],
  })
  const [animatingMove, setAnimatingMove] = useState<{ from: Position; to: Position } | null>(null)

  useEffect(() => {
    const timer = setTimeout(() => {
      setGameState("setup")
    }, 3000)
    return () => clearTimeout(timer)
  }, [])

  const handlePlayersSet = (names: PlayerNames) => {
    setPlayerNames(names)
    setGameState("playing")
  }

  useEffect(() => {
    if (selectedPiece) {
      const moves: Position[] = []
      for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
          if (isValidMove(board, selectedPiece, { row, col }, currentPlayer)) {
            moves.push({ row, col })
          }
        }
      }
      setValidMoves(moves)
    } else {
      setValidMoves([])
    }
  }, [selectedPiece, board, currentPlayer])

  useEffect(() => {
    if (isCheckmate(board, currentPlayer)) {
      const winner = currentPlayer === PieceColor.WHITE ? "Black" : "White"
      setGameStatus(`checkmate-${winner}`)
    } else if (isStalemate(board, currentPlayer)) {
      setGameStatus("stalemate")
    } else if (isCheck(board, currentPlayer)) {
      setGameStatus(`check-${currentPlayer}`)
    } else {
      setGameStatus("ongoing")
    }
  }, [board, currentPlayer])

  const handleSquareClick = (position: Position) => {
    if (gameStatus.includes("checkmate") || gameStatus === "stalemate") {
      return
    }

    const piece = board[position.row][position.col]

    if (selectedPiece) {
      if (selectedPiece.row === position.row && selectedPiece.col === position.col) {
        setSelectedPiece(null)
        return
      }

      if (validMoves.some((move) => move.row === position.row && move.col === position.col)) {
        setAnimatingMove({ from: selectedPiece, to: position })

        setTimeout(() => {
          const result = makeMove(board, selectedPiece, position)

          if (result.capturedPiece) {
            setCapturedPieces((prev) => {
              const oppositeColor = currentPlayer === PieceColor.WHITE ? PieceColor.BLACK : PieceColor.WHITE
              return {
                ...prev,
                [currentPlayer]: [...prev[currentPlayer], result.capturedPiece],
              }
            })
          }

          const fromNotation = `${String.fromCharCode(97 + selectedPiece.col)}${8 - selectedPiece.row}`
          const toNotation = `${String.fromCharCode(97 + position.col)}${8 - position.row}`
          const pieceSymbol =
            board[selectedPiece.row][selectedPiece.col]?.type === PieceType.PAWN
              ? ""
              : board[selectedPiece.row][selectedPiece.col]?.type.charAt(0)

          setMoveHistory((prev) => [...prev, `${pieceSymbol}${fromNotation}-${toNotation}`])

          setBoard(result.newBoard)
          setCurrentPlayer((prev) => (prev === PieceColor.WHITE ? PieceColor.BLACK : PieceColor.WHITE))
          setSelectedPiece(null)
          setAnimatingMove(null)
        }, 300)
      } else if (piece && piece.color === currentPlayer) {
        setSelectedPiece(position)
      }
    } else if (piece && piece.color === currentPlayer) {
      setSelectedPiece(position)
    }
  }

  const resetGame = () => {
    setBoard(initialBoardState())
    setCurrentPlayer(PieceColor.WHITE)
    setSelectedPiece(null)
    setValidMoves([])
    setGameStatus("ongoing")
    setMoveHistory([])
    setCapturedPieces({
      [PieceColor.WHITE]: [],
      [PieceColor.BLACK]: [],
    })
    setGameState("setup")
  }

  if (gameState === "loading") {
    return <LoadingScreen />
  }

  if (gameState === "setup") {
    return <PlayerSetup onPlayersSet={handlePlayersSet} />
  }

  return (
    <div className="flex flex-col lg:flex-row gap-8 w-full max-w-7xl">
      <div className="fixed top-4 right-4 z-50">
        <a
          href="https://github.com/sergio001g"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 bg-gray-900 hover:bg-gray-800 text-white px-4 py-2 rounded-lg transition-all duration-300 hover:scale-105 shadow-lg"
        >
          <Github size={20} />
          <span className="hidden sm:inline">sergio001g</span>
        </a>
      </div>

      <div className="flex-1 flex flex-col items-center">
        <ChessBoard
          board={board}
          selectedPiece={selectedPiece}
          validMoves={validMoves}
          onSquareClick={handleSquareClick}
          animatingMove={animatingMove}
        />
        <GameControls onReset={resetGame} gameStatus={gameStatus} />
      </div>
      <div className="flex-1">
        <GameInfo
          currentPlayer={currentPlayer}
          gameStatus={gameStatus}
          moveHistory={moveHistory}
          capturedPieces={capturedPieces}
          playerNames={playerNames}
        />
      </div>
    </div>
  )
}
