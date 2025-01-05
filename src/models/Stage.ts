import { Question } from "../interfaces/Question"

export class Stage {
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