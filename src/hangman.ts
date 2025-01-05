import rawData from "./data/questions.test.json"
interface Question {
  word: string
  hint: string
}

// Question[]型を指定
const question: Question[] = rawData // JSONから読み込んだデータを代入

class Quiz {
  questions: Question[]
  constructor(questions: Question[]) {
    this.questions = questions
  }

  // ランダムに質問を取得して、その質問をリストから削除
  getNext(): Question {
    // 0以上、配列の長さ以下のランダムな整数を生成
    const idx = Math.floor(Math.random() * this.questions.length)
    // ランダムなインデックスidxを使って、questions配列から1つの問題を削除
    const [question] = this.questions.splice(idx, 1)
    return question
  }

  // 次の問題が存在するか確認
  hasNext(): boolean {
    return this.questions.length > 0
  }

  // 残りの質問数を取得
  lefts(): number {
    return this.questions.length
  }
}

const quiz = new Quiz(question)