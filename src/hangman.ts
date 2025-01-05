import rawData from "./data/questions.test.json"
interface Question {
  word: string
  hint: string
}

// Question[]型を指定
const question: Question[] = rawData // JSONから読み込んだデータを代入