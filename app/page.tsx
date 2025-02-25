"use client"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button, Card, CardContent, CardMedia } from "@mui/material"
import Image from "next/image"

const emotions = [
  { name: "Happy", image: "/images/happy.jpg" },
  { name: "Sad", image: "/images/sad.jpg" },
  { name: "Angry", image: "/images/angry.jpg" },
  { name: "Excited", image: "/images/excited.jpg" },
  { name: "Worried", image: "/images/worried.jpg" },
]

const situations = [
  { name: "Situation 1", image: "/images/situation.jpg" },
  { name: "Situation 2", image: "/images/situation2.jpg" },
  { name: "Situation 3", image: "/images/situation3.jpg" },
  { name: "Situation 4", image: "/images/situation4.jpg" },
  { name: "Situation 5", image: "/images/situation5.jpg" },
  { name: "Situation 6", image: "/images/situation6.jpg" },
]

function shuffleArray<T>(array: T[]): T[] {
  return [...array].sort(() => Math.random() - 0.5)
}

export default function GameBoard() {
  const [numPlayers, setNumPlayers] = useState("3")
  const [players, setPlayers] = useState<string[]>([])
  const [currentPlayer, setCurrentPlayer] = useState(0)
  const [gameStarted, setGameStarted] = useState(false)
  const [revealed, setRevealed] = useState(false)
  const [roles, setRoles] = useState<string[]>([])
  const [playerSituations, setPlayerSituations] = useState<
    { name: string; image: string }[]
  >([])
  const [selectedEmo, setSelectedEmo] = useState<string>("")
  const [allCardsRevealed, setAllCardsRevealed] = useState(false)
  const [timer, setTimer] = useState<number>(10)
  const [timerActive, setTimerActive] = useState(false)
  const [spyWin, setSpyWin] = useState<boolean | null>(null)
  const [reviewPhase, setReviewPhase] = useState(false)
  const [spySelecting, setSpySelecting] = useState(false)

  const startGame = () => {
    if (players.length < 3 || players.length > 6) return

    const newRoles = Array(players.length).fill("Citizen")
    const spyIndex = Math.floor(Math.random() * players.length)
    newRoles[spyIndex] = "Spy"
    setRoles(newRoles)

    const shuffledSituations = shuffleArray(situations).slice(0, players.length)
    setPlayerSituations(shuffledSituations)

    const randomEmo = emotions[Math.floor(Math.random() * emotions.length)]
    setSelectedEmo(randomEmo.name)

    setGameStarted(true)
    setAllCardsRevealed(false)
    setSpyWin(null)
  }

  const filteredEmo = emotions.find((emo) => emo.name === selectedEmo)

  const toggleCards = () => {
    setRevealed(!revealed)
  }

  const nextPlayer = () => {
    if (currentPlayer + 1 < players.length) {
      setCurrentPlayer(currentPlayer + 1)
      setRevealed(false)
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
    } else if (timer === 0) {
      setTimerActive(false)
      setReviewPhase(true)
    }
  }, [timerActive, timer])

  const handleSpyGuess = (emo: string) => {
    setSpyWin(emo === selectedEmo)
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4">
      <h1 className="text-3xl font-bold mb-4">Emotions Board Game</h1>

      {!gameStarted ? (
        <div className="flex flex-col items-center">
          <label className="mb-2">จำนวนผู้เล่น (3-6) คน :</label>
          <input
            type="text"
            value={numPlayers}
            onChange={(e) => {
              const value = e.target.value
              if (
                /^\d{0,1}$/.test(value) &&
                (value === "" || (Number(value) >= 3 && Number(value) <= 6))
              ) {
                setNumPlayers(value)
              }
            }}
            className="text-black mb-4 p-2"
          />
          <label className="mb-2">Enter Player Names:</label>
          {Array.from({ length: Number(numPlayers) }).map((_, index) => (
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
          <Button onClick={startGame} className="py-2 px-4 mt-4">
            <span className="text-black bg-white p-3">Start Game</span>
          </Button>
        </div>
      ) : reviewPhase ? (
        <div className="text-center">
          <h2 className="text-2xl font-bold">🧐 ทบทวนตัวเอง</h2>
          <Button
            onClick={() => {
              setReviewPhase(false)
              setSpySelecting(true) // ให้ Spy เลือก Emotion
            }}
            className="mt-4 bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded"
          >
            ไปยังการเลือก Emotion
          </Button>
        </div>
      ) : spySelecting ? (
        <div className="text-center">
          <h2 className="text-2xl font-bold">🔍 Spy เลือก Emotion</h2>
          <div className="grid grid-cols-3 gap-4 mt-4">
            {emotions.map((emo) => (
              <motion.div key={emo.name} whileTap={{ scale: 0.9 }}>
                <Card
                  onClick={() => handleSpyGuess(emo.name)}
                  className="cursor-pointer w-32 h-34 flex flex-col items-center justify-center bg-gray-800 border border-gray-600 text-center"
                >
                  <CardMedia
                    component="img"
                    image={emo.image}
                    alt={emo.name}
                    className="w-full h-full object-cover items-center"
                  />
                </Card>
                <span className="text-lg font-bold">{emo.name}</span>
              </motion.div>
            ))}
            {/* แสดงผลลัพธ์ */}
          </div>
          {spyWin !== null && (
            <div className="text-center mt-10">
              <h2 className="text-3xl font-bold">
                {spyWin ? "🎉 Spy Win!" : "❌ Spy Lose!"}
              </h2>
              <Button onClick={() => window.location.reload()}>
                <span className="text-black bg-white p-3 mt-5 text-xl">
                  เล่นใหม่
                </span>
              </Button>
            </div>
          )}
        </div>
      ) : allCardsRevealed ? (
        <div className="text-center">
          <h2 className="text-2xl font-bold">Game Started!</h2>
          <p className="text-lg mt-4">Time Left: {timer} seconds</p>
        </div>
      ) : (
        <div className="flex flex-col items-center">
          <h2 className="text-xl mb-4">{players[currentPlayer]} Is Turn</h2>

          <div className="flex gap-4">
            <motion.div whileTap={{ scale: 0.9 }}>
              <Card
                onClick={toggleCards}
                className="cursor-pointer w-40 h-56 flex items-center justify-center bg-gray-800 border border-gray-600 text-center"
              >
                <CardContent>
                  {revealed ? (
                    roles[currentPlayer] === "Spy" ? (
                      <span className="text-lg font-bold">Spy</span>
                    ) : (
                      <div>
                        <Image
                          src={filteredEmo?.image || "/images/default.jpg"}
                          alt={filteredEmo?.name || "Default Emotion"}
                          className="w-full h-auto object-cover rounded"
                          width={160}
                          height={224}
                        />
                        <span className="text-lg font-bold">
                          {filteredEmo?.name}
                        </span>
                      </div>
                    )
                  ) : (
                    <span className="text-gray-400">Tap to Reveal</span>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            <motion.div whileTap={{ scale: 0.9 }}>
              <Card
                onClick={toggleCards}
                className="cursor-pointer w-40 h-56 flex items-center justify-center bg-gray-800 border border-gray-600 text-center"
              >
                <CardContent>
                  {revealed ? (
                    roles[currentPlayer] === "Spy" ? (
                      <span className="text-lg font-bold">Spy</span>
                    ) : (
                      <div>
                        <Image
                          src={playerSituations[currentPlayer].image}
                          alt={playerSituations[currentPlayer].name}
                          className="w-full h-auto object-cover rounded"
                          width={160}
                          height={224}
                        />
                        <span className="text-lg font-bold">
                          {playerSituations[currentPlayer].name}
                        </span>
                      </div>
                    )
                  ) : (
                    <span className="text-gray-400">Tap to Reveal</span>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>

          <Button onClick={nextPlayer}>
            <span className="text-black bg-white p-3 mt-5 text-xl">
              คนต่อไป
            </span>
          </Button>
        </div>
      )}
    </div>
  )
}
