"use client"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Modal,
  Typography,
} from "@mui/material"
import Image from "next/image"

const emotions = [
  { name: "โกรธ", image: "/images/angry.jpg" },
  { name: "กลัว", image: "/images/fear.png" },
  { name: "อิจฉา", image: "/images/jealous.png" },
  { name: "เศร้า", image: "/images/sad.png" },
  { name: "อาย", image: "/images/shy.png" },
  { name: "กังวล", image: "/images/worried.png" },
]

const situations = [
  { name: "ตอบคำถามครูผิด", image: "/images/situation_1.png" },
  { name: "ทำไอศกรีมหล่น", image: "/images/situation_2.png" },
  { name: "เพื่อนผลักให้ล้ม", image: "/images/situation_3.png" },
  {
    name: "เพื่อนไม่ช่วยทำงานกลุ่ม",
    image: "/images/situation_4.png",
  },
  { name: "เพื่อนไม่ให้เล่นด้วย", image: "/images/situation_5.png" },
  { name: "เพื่อนอวดของเล่น", image: "/images/situation_6.png" },
  { name: "แม่ไม่พาไปเที่ยว", image: "/images/situation_7.png" },
  { name: "แม่ไม่พาไปเที่ยว", image: "/images/situation_8.png" },
  { name: "ลืมเอาการบ้านมาส่ง", image: "/images/situation_9.png" },
  {
    name: "สอบตกในวิชาที่ตั้งใจอ่าน",
    image: "/images/situation_10.png",
  },
  { name: "ใส่ชุดมาผิดวัน", image: "/images/situation_11.png" },
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
  const [open, setOpen] = useState(false)

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
      <h1 className="text-3xl font-bold mb-4">EMOSPY สายลับจับอารมณ์</h1>
      <Button onClick={() => setOpen(true)}>
        <span className="text-black bg-white p-3 rounded-md">กติกา</span>
      </Button>

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
            className="py-2 px-4"
          >
            <span className="text-black bg-white p-3 mt-5">
              ไปยังการเลือก Emotion
            </span>
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
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
              <div className="bg-white p-6 rounded-lg shadow-lg text-center">
                <h2 className="text-3xl font-bold text-black">
                  {spyWin ? "🎉 Spy Win!" : "❌ Spy Lose!"}
                </h2>
                <Button
                  onClick={() => window.location.reload()}
                  className="mt-5"
                >
                  <span className="text-black hover:text-white bg-slate-400 hover:bg-black px-6 py-3 mt-5 text-xl rounded-md">
                    เล่นใหม่
                  </span>
                </Button>
              </div>
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
                      </div>
                    )
                  ) : (
                    <span className="text-gray-400">Tap to Reveal</span>
                  )}
                </CardContent>
              </Card>
              {revealed &&
                (roles[currentPlayer] === "Spy" ? (
                  <span className="text-lg font-bold">Spy</span>
                ) : (
                  <div>
                    <span className="text-lg font-bold w-full flex justify-center mt-2">
                      {filteredEmo?.name}
                    </span>
                  </div>
                ))}
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
                      </div>
                    )
                  ) : (
                    <span className="text-gray-400">Tap to Reveal</span>
                  )}
                </CardContent>
              </Card>
              {revealed &&
                (roles[currentPlayer] === "Spy" ? (
                  <span className="text-lg font-bold">Spy</span>
                ) : (
                  <div>
                    <span className="text-lg font-bold w-full flex justify-center mt-2">
                      {playerSituations[currentPlayer].name}
                    </span>
                  </div>
                ))}
            </motion.div>
          </div>

          <Button onClick={nextPlayer}>
            <span className="text-black bg-white p-3 mt-5 text-xl">
              คนต่อไป
            </span>
          </Button>
        </div>
      )}

      <Modal open={open} onClose={() => setOpen(false)}>
        <Box className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg shadow-lg w-96">
          <Typography variant="h5" className="font-bold text-center">
            📝 กติกาการเล่น
          </Typography>
          <Typography className="mt-3">
            1.จำนวนผู้เล่น <br />
            - เล่นได้ตั้งแต่ 3-6 คน <br />- มี 1 คนเป็นสายลับ (Spy)
            และที่เหลือเป็น คนทั่วไป
          </Typography>
          <Typography className="mt-3">
            2.การแจกบทบาท <br />
            - ทุกคน (ยกเว้นสายลับ) จะได้รับ บทบาทอารมณ์เหมือนกัน
            แต่สถานการณ์ต่างกัน <br />-
            สายลับจะไม่รู้ว่าอารมณ์และสถานการณ์นั้นคืออะไร
          </Typography>
          <Typography className="mt-3">
            3.วิธีเล่น <br />
            - ผู้เล่นจะผลัดกันถามคำถามกัน เช่น เคยเจอสถานการณ์แบบนี้ไหม หรือ
            อารมณ์นั้นพึ่งเกิดขึ้นไหม เป็นต้น <br />
            - ห้ามถามตรง ๆ ว่าอารมณ์หรือสถานการณ์นั้นคืออะไร <br />
            - สายลับต้องพยายามเนียนและจับคำใบ้จากคำตอบของคนอื่น <br />
            - จะมีเวลาในการถามคำถามกันทั้งหมด 2 นาที
            และหลังจากนั้นจะเป็นการทบทวนตัวเอง -
            โดยให้ผู้เล่นผลัดกันอธิบายอารมณ์ของตัวเองตามที่ได้รับไป <br />
            - เมื่อผู้เล่นทบทวนตัวเองกันครบทุกคนแล้ว -
            จึงเริ่มการโหวตว่าใครเป็นสายลับ โดยอิงตามเสียงข้างมาก <br />
            - โดยถ้าจับถูกสายลับจะเป็นผู้แพ้ แต่ถ้าจับผิด สายลับจะเป็นผู้ชนะ{" "}
            <br />- หลังสิ้นสุดการโหวตสายลับจะต้องทายอารมณ์ให้ถูกต้อง
            จึงจะเป็นผู้ชนะหลังจากถูกจับได้
          </Typography>

          {/* ปุ่มปิด Modal */}
          <Button
            onClick={() => setOpen(false)}
            className="mt-4 w-full bg-gray-800 text-white py-2 rounded-md"
          >
            ปิด
          </Button>
        </Box>
      </Modal>
    </div>
  )
}
