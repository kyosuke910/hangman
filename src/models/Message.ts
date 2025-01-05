import { Question } from "../interfaces/Question"
import { UserInterface } from "../interfaces/UserInterface"
import { Quiz } from "./Quiz"
import { Stage } from "./Stage"

export class Message {
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
