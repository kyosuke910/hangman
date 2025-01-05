import { UserInterface, Color } from "../interfaces/UserInterface"
import readlinePromises from "readline/promises"
import chalk from "chalk"
import figlet from "figlet"
// readlinePromisesインターフェイスのインスタンスを生成
const rl = readlinePromises.createInterface({
  input: process.stdin,
  output: process.stdout
})

export const CLI: UserInterface = {
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