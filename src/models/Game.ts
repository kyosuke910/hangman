import { GameState } from "../interfaces/GameState"
import { UserInterface } from "../interfaces/UserInterface"
import { Message } from "./Message"
import { Quiz } from "./Quiz"
import { Stage } from "./Stage"

export class Game {
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