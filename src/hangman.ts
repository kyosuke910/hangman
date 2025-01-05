import rawData from "./data/questions.test.json"
import { GameState } from "./interfaces/GameState"
import { Question } from "./interfaces/Question"
import { Quiz } from "./models/Quiz"
import { Game } from "./models/Game"
import { Message } from "./models/Message"
import { CLI } from "./utils/CLI"

// 問題の読み込み
const questions: Question[] = rawData

const quiz = new Quiz(questions)
const message = new Message(CLI)
const game = new Game(quiz, message, CLI)

// ゲーム開始
game.start()