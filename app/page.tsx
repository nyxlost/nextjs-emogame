"use client"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button, Card, CardContent } from "@mui/material"

const emotions = ["Happy", "Sad", "Angry", "Excited", "Worried"]
const situations = ["Situation 1", "Situation 2", "Situation 3", "Situation 4", "Situation 5", "Situation 6"]

export default function GameBoard() {
  const [numPlayers, setNumPlayers] = useState(3)
  const [players, setPlayers] = useState<string[]>([])
  const [currentPlayer, setCurrentPlayer] = useState(0)
  const [gameStarted, setGameStarted] = useState(false)
  const [revealed, setRevealed] = useState(false)
  const [role, setRole] = useState<string | null>(null)
  const [situation, setSituation] = useState<string>("")
  const [roles, setRoles] = useState<string[]>([])
  const [selectedEmo, setSelectedEmo] = useState<string>("")
  const [allCardsRevealed, setAllCardsRevealed] = useState(false)
  const [timer, setTimer] = useState<number>(120)
  const [timerActive, setTimerActive] = useState(false)

  const startGame = () => {
    if (players.length < 3 || players.length > 6) return

    const newRoles = Array(players.length).fill("Citizen")
    const spyIndex = Math.floor(Math.random() * players.length)
    newRoles[spyIndex] = "Spy"
    setRoles(newRoles)

    setRole(newRoles[currentPlayer])

    const newSituation = situations[Math.floor(Math.random() * situations.length)]
    setSituation(newSituation)

    const randomEmo = emotions[Math.floor(Math.random() * emotions.length)]
    setSelectedEmo(randomEmo)

    setGameStarted(true)
    setAllCardsRevealed(false)
  }

  const toggleCards = () => {
    setRevealed(!revealed)
  }

  const nextPlayer = () => {
    if (currentPlayer + 1 < players.length) {
      setCurrentPlayer(currentPlayer + 1)
      setRevealed(false)
      setRole(roles[currentPlayer + 1])
    } else {
      setAllCardsRevealed(true)
    }
  }

  useEffect(() => {
    if (allCardsRevealed) {
      setTimerActive(true)
    }
  }, [allCardsRevealed])

  useEffect(() => {
    if (timerActive && timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1)
      }, 1000)
      return () => clearInterval(interval)
    }
  }, [timerActive, timer])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4">
      <h1 className="text-3xl font-bold mb-4">Mr. White Board Game</h1>

      {!gameStarted ? (
        <div className="flex flex-col items-center">
          <label className="mb-2">Number of Players (3-6):</label>
          <input
            type="number"
            min="3"
            max="6"
            value={numPlayers}
            onChange={(e) => setNumPlayers(Number(e.target.value))}
            className="text-black mb-4 p-2"
          />
          <label className="mb-2">Enter Player Names:</label>
          {Array.from({ length: numPlayers }).map((_, index) => (
            <input
              key={index}
              type="text"
              placeholder={`Player ${index + 1}`}
              className="text-black p-2 mb-2"
              onBlur={(e) => {
                const newPlayers = [...players]
                newPlayers[index] = e.target.value
                setPlayers(newPlayers)
              }}
            />
          ))}
          <Button
            onClick={startGame}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4"
          >
            Start Game
          </Button>
        </div>
      ) : allCardsRevealed ? (
        <div className="text-center">
          <h2 className="text-2xl font-bold">Game Started!</h2>
          <p className="text-lg mt-4">Time Left: {timer} seconds</p>
        </div>
      ) : (
        <div className="flex flex-col items-center">
          <h2 className="text-xl mb-4">{players[currentPlayer]}is Turn</h2>

          <div className="flex gap-4">
            {/* การ์ด Role */}
            <motion.div whileTap={{ scale: 0.9 }}>
              <Card
                onClick={toggleCards}
                className="cursor-pointer w-40 h-56 flex items-center justify-center bg-gray-800 border border-gray-600 text-center"
              >
                <CardContent>
                  {revealed ? (
                    role === "Spy" ? (
                      <span className="text-lg font-bold">Spy</span>
                    ) : (
                      <span className="text-lg font-bold">{selectedEmo}</span>
                    )
                  ) : (
                    <span className="text-gray-400">Tap to Reveal</span>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* การ์ดสถานการณ์ */}
            <motion.div whileTap={{ scale: 0.9 }}>
              <Card
                onClick={toggleCards}
                className="cursor-pointer w-40 h-56 flex items-center justify-center bg-gray-800 border border-gray-600 text-center"
              >
                <CardContent>
                  {revealed ? (
                    role === "Spy" ? (
                      <span className="text-lg font-bold">Spy</span>
                    ) : (
                      <span className="text-lg font-bold">{situation}</span>
                    )
                  ) : (
                    <span className="text-gray-400">Tap to Reveal</span>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>

          <Button
            onClick={nextPlayer}
            className="mt-4 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
          >
            Next Player
          </Button>
        </div>
      )}
    </div>
  )
}