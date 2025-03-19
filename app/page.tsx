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
  { name: "กลัว", image: "/images/fear.jpg" },
  { name: "อิจฉา", image: "/images/jealous.jpg" },
  { name: "เศร้า", image: "/images/sad.jpg" },
  { name: "อาย", image: "/images/shy.jpg" },
  { name: "กังวล", image: "/images/worried.jpg" },
]

const situations = [
  { name: "ตอบคำถามครูผิด", image: "/images/situation_1.jpg" },
  { name: "ทำไอศกรีมหล่น", image: "/images/situation_2.jpg" },
  { name: "เพื่อนผลักให้ล้ม", image: "/images/situation_3.jpg" },
  {
    name: "เพื่อนไม่ช่วยทำงานกลุ่ม",
    image: "/images/situation_4.jpg",
  },
  { name: "เพื่อนไม่ให้เล่นด้วย", image: "/images/situation_5.jpg" },
  { name: "เพื่อนอวดของเล่น", image: "/images/situation_6.jpg" },
  { name: "แม่ไม่พาไปเที่ยว", image: "/images/situation_7.jpg" },
  { name: "แม่ไม่พาไปเที่ยว", image: "/images/situation_8.jpg" },
  { name: "ลืมเอาการบ้านมาส่ง", image: "/images/situation_9.jpg" },
  {
    name: "สอบตกในวิชาที่ตั้งใจอ่าน",
    image: "/images/situation_10.jpg",
  },
  { name: "ใส่ชุดมาผิดวัน", image: "/images/situation_11.jpg" },
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
  const [timer, setTimer] = useState<number>(420)
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
          <label className="mb-2">ใส่ชื่อผู้เล่น </label>
          {Array.from({ length: Number(numPlayers) }).map((_, index) => (
            <input
              key={index}
              type="text"
              placeholder={`ผู้เล่น ${index + 1}`}
              className="text-black p-2 mb-2"
              onBlur={(e) => {
                const newPlayers = [...players]
                newPlayers[index] = e.target.value
                setPlayers(newPlayers)
              }}
            />
          ))}
          <Button onClick={startGame} className="py-2 px-4 mt-4">
            <span className="text-black bg-white p-3 border rounded-lg">
              เริ่มเกม
            </span>
          </Button>
        </div>
      ) : reviewPhase ? (
        <div className="text-center">
          <h2 className="text-2xl font-bold mt-5">
            {" "}
            ถ้าฉันเจอสถานการณ์นี้และอยู่ในอารมณ์นี้ ฉันจะ...{" "}
          </h2>
          <Button
            onClick={() => {
              setReviewPhase(false)
              setSpySelecting(true) // ให้ Spy เลือก Emotion
            }}
            className="py-2 px-4"
          >
            <span className="text-black bg-white p-3 mt-5 border rounded-lg">
              ไปยังการเลือกอารมณ์
            </span>
          </Button>
        </div>
      ) : spySelecting ? (
        <div className="text-center">
          <h2 className="text-2xl font-bold mt-2">🔍 สายลับเลือกอารมณ์</h2>
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
                  {spyWin ? "🎉 ตอบถูก!" : "❌ ตอบผิด!"}
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
        <>
          <div className="text-center">
            <h2 className="text-2xl font-bold mt-5">เริ่มเกม !</h2>
            <p className="text-lg mt-4">
              เวลา : {Math.floor(timer / 60)}:
              {(timer % 60).toString().padStart(2, "0")}
            </p>
          </div>
          <div className="text-center mt-5">
            <h2 className="text-2xl font-bold">คำถามแนะนำ</h2>
            <p className="text-lg mt-4">1. เมื่อเร็ว ๆ นี้ เกิดอารมณ์นี้มั้ย</p>
            <p className="text-lg mt-4">
              2. ถ้า (สถานการณ์สมมติ) จะเกิดอารมณ์นี้หรือไม่
            </p>
            <p className="text-lg mt-4">
              3. เธอจะแสดงออกยังไง ถ้าเธอเกิดอารมณ์นี้
            </p>
            <p className="text-lg mt-4">
              4. เธอกล้าปรึกษาคนอื่นมั้ย ถ้าเธอเกิดอารมณ์นี้
            </p>
            <p className="text-lg mt-4">5. ช่วยแสดงสีหน้าตามอารมณ์ที่ได้</p>
            <p className="text-lg mt-4">6. จะพูดอะไรกับคนที่มีอารมณ์ที่ได้</p>
            <p className="text-lg mt-4">7. ขอ 3 คำให้กับอารมณ์ที่ได้</p>
            <p className="text-lg mt-4">8. มีอะไรอยากบอกกับตัวเองมั้ย</p>
            <p className="text-lg mt-4">9. ขอเพลง 1 ท่อนที่ตรงกับอารมณ์นี้</p>
          </div>
          <Button onClick={() => setTimer(0)} className="py-2 px-4">
            <span className="text-black bg-white p-3 mt-5 border rounded-lg">
              ข้าม
            </span>
          </Button>
        </>
      ) : (
        <div className="flex flex-col items-center">
          <h2 className="text-xl mb-4">รอบของ {players[currentPlayer]}</h2>

          <div className="flex gap-4">
            <motion.div whileTap={{ scale: 0.9 }}>
              <Card
                onClick={toggleCards}
                className="cursor-pointer w-40 h-56 flex items-center justify-center bg-gray-800 border border-gray-600 text-center"
              >
                <CardContent>
                  {revealed ? (
                    roles[currentPlayer] === "Spy" ? (
                      <span className="text-lg font-bold">สายลับ</span>
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
                    <span className="text-gray-400">กดเพื่อดู</span>
                  )}
                </CardContent>
              </Card>
              {revealed &&
                (roles[currentPlayer] === "Spy" ? (
                  <span className="text-lg font-bold">สายลับ</span>
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
                      <span className="text-lg font-bold">สายลับ</span>
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
                    <span className="text-gray-400">กดเพื่อดู</span>
                  )}
                </CardContent>
              </Card>
              {revealed &&
                (roles[currentPlayer] === "Spy" ? (
                  <span className="text-lg font-bold">สายลับ</span>
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
        <Box className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg shadow-lg w-96 h-96 overflow-y-auto">
          <Typography variant="h5" className="font-bold text-center">
            📝 กติกาการเล่น
          </Typography>
          <Typography className="mt-3">
            1.จำนวนผู้เล่น <br />
            - เล่นได้ตั้งแต่ 3-6 คน <br />- มี 1 คน ได้รับบทบาทสายลับ (Spy)
            และที่เหลือได้รับบทบาทอารมณ์ ได้แก่ โกรธ กลัว กังวล อิจฉา เศร้า อาย
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
            - ห้ามถามตรง ๆ ว่าอารมณ์หรือสถานการณ์นั้นคืออะไร
            และห้ามตอบคำถามโดยพูดชื่ออารมณ์นั้นออกมาตรง ๆ <br />
            - สายลับต้องพยายามเนียนและจับคำใบ้จากคำตอบของคนอื่น <br />
            - จะมีเวลาในการถามคำถามกันทั้งหมด 7 นาที
            และหลังจากนั้นจะเป็นการอธิบายแนวทางการรับมือกับอารมณ์นั้น
            โดยให้ผู้เล่นผลัดกันอธิบายอารมณ์ของตัวเองตามที่ได้รับไป <br />
            - เมื่อผู้เล่นผลัดกันอธิบายกันครบทุกคนแล้ว
            จึงเริ่มการโหวตว่าใครเป็นสายลับ โดยอิงตามเสียงข้างมาก <br />
          </Typography>
          <Typography className="mt-3">
            4.การตัดสินผลแพ้ชนะ <br />
            - หากคนทั่วไปหาสายลับเจอ และสายลับตอบผิด สายลับจะแพ้ <br />
            - หากคนทั่วไปหาสายลับไม่เจอ และสายลับตอบถูก สายลับจะชนะ <br />
            - หากคนทั่วไปหาสายลับไม่เจอ และสายลับตอบผิด หรือ
            หากคนทั่วไปหาสายลับเจอ และสายลับตอบถูก จะถือว่าเสมอกัน <br />
          </Typography>
          <p className="mt-3 font-medium text-lg"> ความยากของเกม ⭐️⭐️⭐️ </p>

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
