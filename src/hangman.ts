import rawData from "./data/questions.test.json"
import readlinePromises from "readline/promises"
import chalk from "chalk"
import figlet from "figlet"

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

interface UserInterface {
  input(): Promise<string>
  clear(): void
  destroy(): void
  output(message: string, color?: Color): void
  outputAnswer(message: string,): void
}

// readlinePromisesインターフェイスのインスタンスを生成
const rl = readlinePromises.createInterface({
  input: process.stdin,
  output: process.stdout
})

const CLI: UserInterface = {
  // プロパティとメソッドを追加していく
  async input() {
    const input = await rl.question("文字または単語を推測してください： ")
    return input.replaceAll(" ", "").toLowerCase()
  },

  clear() {
    console.clear() // コンソールのクリア
  },

  destroy() {
    rl.close() // プロンプトの終了
  },

  output(message: string, color: Color = "white") {
    console.log(chalk[color](message), "\n")
  },

  outputAnswer(message: string) {
    console.log(figlet.textSync(message, { font: "Big" }), "\n")
  }
}

type Color = "red" | "green" | "yellow" | "white"

class Stage {
  answer: string // 解答の状態(例：ty_escri_t)
  leftAttempts: number = 5 // 試行回数
  question: Question // 出題中の問題

  constructor(question: Question) {
    this.question = question
    // answerにブランク "_"の羅列を指定
    this.answer = new Array(question.word.length) // 文字数の長さの空の配列を生成
    .fill("_") // 配列の要素を"_"で埋める
    .join("") // 配列の要素を連結して新しい文字列にする。""によってセパレータ(区切り文字)なしで連結する。
  }

  updateAnswer(userInput: string = ""): void {
    if(!userInput) return // 空文字の場合、以降の処理は行わない

    const regex = new RegExp(userInput, "g") // 入力を正規表現のパターンとして使用
    const answerArry = this.answer.split("") // 文字列を配列に変換

    let matches: RegExpExecArray | null // 正規表現での検索結果を格納する変数

    // 入力と一致する箇所がなくなるまで繰り返す。
    while ((matches = regex.exec(this.question.word))) {
      /**
       * "n(入力)"で"union(正解の単語)"を検索した際の matches の例
       * 1ループ目：[ 'n', index: 1, input: 'union', groups: undefined]
       * 2ループ目：[ 'n', index: 4, input: 'union', groups: undefined]
       */
      const foundIdx = matches.index // 一致した箇所のインデックス(wordの先頭から文字目か)
      // インデックス位置のanswerの"_"を入力された文字と置き換え
      answerArry.splice(foundIdx, userInput.length, ...userInput)

      this.answer = answerArry.join("") // 配列を文字列に変換
    }

  }

  // 入力が単語の長さを超えているか判定
  isTooLong(userInput: string): boolean {
    return userInput.length > this.question.word.length
  }

  // 単語に解答者の入力が含まれるか判定
  isIncludes(userInput: string): boolean {
    return this.question.word.includes(userInput)
  }

  // 解答が単語のすべての文字列と一致したか判定
  isCorrect(): boolean {
    return this.answer === this.question.word
  }

  // 試行回数を1減少
  decrementAttempts(): number {
    return --this.leftAttempts
  }

  // 試行回数が0か判定
  isGameOver(): boolean {
    return this.leftAttempts === 0
  }
}

class Message {
  ui: UserInterface

  constructor(ui: UserInterface) {
    this.ui = ui
  }

  // 問題を解答者に表示
  askQuestion(stage: Stage): void {
    this.ui.output(`Hint ${stage.question.hint}`, "yellow")
    this.ui.outputAnswer(
      stage.answer // 例 "_oi_"
      .replaceAll("", " ") // 見やすくするために、すべての位置にスペースを挿入 " _ o i _  "
      .trim() // 先頭と末尾のスペースを削除 "_ o i _"
    )
    this.ui.output(` (残りの試行回数: ${stage.leftAttempts}) `)
  }
  leftQuestions(quiz: Quiz): void {
    this.ui.output(` 残り${quiz.lefts() + 1}問 `)
  }
  start() {
    this.ui.output( "\nGame Start!!" )
  }
  enterSomething() {
    this.ui.output( `何か文字を入力してください。`, "red" )
  }
  notInclude(input: string) {
    this.ui.output(`"${input}" は単語に含まれていません。`, "red")
  }
  notCorrect(input: string) {
    this.ui.output(`残念！ "${input}" は正解ではありません。`, "red")
  }
  hit(input: string) {
    this.ui.output(` "${input}" がHit!`, "green")
  }
  correct(question: Question) {
    this.ui.output(` 正解！ 単語は "${question.word}" でした。`, "green")
  }
  gameover(question: Question) {
    this.ui.output(` 正解は "${question.word}" でした。`)
  }
  end() {
    this.ui.output("ゲーム終了です！お疲れ様でした！")
  }
}

interface GameState {
  stage: Stage // 現在のステージ情報。質問や解答、試行回数などを持つ
  done: boolean // ゲームが終了したかどうかを示すフラグ。trueの場合、ゲームはすでに終了しているとみなされる
}
class Game {
  quiz: Quiz // ゲーム内のクイズの情報管理を担当
  message: Message // ゲーム内のメッセージ管理を担当
  stage: Stage // 現在のゲームステージの情報管理を担当
  ui: UserInterface // ゲームのUIとインタラクション機能を提供

  constructor(quiz: Quiz, message: Message, ui: UserInterface) {
    this.quiz = quiz
    this.message = message
    this.ui = ui
    this.stage = new Stage(this.quiz.getNext()) // 初期ステージを設定
  }

  shouldEnd(): boolean {
    // 失敗できる回数の上限を超えた場合
    if(this.stage.isGameOver()) {
      return true
    }
    // 最終問題（次の問題がない）かつ、正解した場合
    if(!this.quiz.hasNext() && this.stage.isCorrect()) {
      return true
    }
    return false
  }

  next(isCorrect: boolean): GameState {
    // if文①：試行回数を減らすかどうかの判断
    if(!isCorrect) {
      // 推論に間違えた場合
      this.stage.decrementAttempts()
    }

    // if文②：ゲームを終了させるかの判断
    if(this.shouldEnd()) {
      // ゲームを終了すると判断するとき
      return { stage: this.stage, done: true } // ゲーム終了のためにdoneをtrueに設定する。
    }

    // if文③：ステージ(単語)を新しくするかの判断
    if(isCorrect) {
      // 推論が完全に一致した場合
      this.stage = new Stage(this.quiz.getNext()) // 次のstageの情報を設定
    }

    return { stage: this.stage, done: false } // ゲームは終了しない。
  }

  async start(): Promise<void> {
    this.ui.clear()
    this.message.start()

    // GameStateの初期値を設定
    let state: GameState = {
      stage: this.stage,
      done: false,
    }

    // ゲームオーバーになるか、すべての問題を正解するまでループ
    while (!state.done) {
      if (state.stage === undefined) break

      const { stage } = state // stageオブジェクトを分割代入で取得

      this.message.leftQuestions(this.quiz) // 残り何問か表示
      this.message.askQuestion(stage) // 問題を表示

      // 解答者の入力を待機
      const userInput = await this.ui.input()

      // 入力値チェック
      if (!userInput) {
        // 入力がない旨のメッセージを表示
        this.message.enterSomething()
        // 不正解として扱い、falseを渡してnextを呼び出し、GameStateを更新
        state = this.next(false)
        continue // 以降の処理を中断し、次のループ処理を実行
      }

      // 解答状況を最新の状態に更新
      stage.updateAnswer(userInput)

      // 入力が正解と完全一致するか判定
      if (stage.isCorrect()) {
        this.message.correct(stage.question) // 完全に正解した旨を表示
        state = this.next(true) // 正解したため、trueを渡してnextを呼び出す
        continue
      }

      // 入力の文字数が正解より長いか判定
      if (stage.isTooLong(userInput)) {
        this.message.notCorrect(userInput)
        // 不正解のため、falseを渡してnextを呼び出す
        state = this.next(false)
        continue
      }

      // 入力が部分的に正解に一致するか判定
      if (stage.isIncludes(userInput)) {
        this.message.hit(userInput)
        continue
      }

      // 入力がどの文字にも一致しない場合
      this.message.notInclude(userInput)
      state = this.next(false)
    }

    // 試行回数が0か判定
    if (state.stage.isGameOver()) {
      this.message.gameover(this.stage.question)
    }

    this.message.end()

    this.ui.destroy()
  }
}

// 問題の読み込み
const questions: Question[] = rawData

const quiz = new Quiz(questions)
const message = new Message(CLI)
const game = new Game(quiz, message, CLI)

// ゲーム開始
game.start()