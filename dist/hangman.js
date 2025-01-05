"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const questions_test_json_1 = __importDefault(require("./data/questions.test.json"));
const promises_1 = __importDefault(require("readline/promises"));
const chalk_1 = __importDefault(require("chalk"));
// Question[]型を指定
const question = questions_test_json_1.default; // JSONから読み込んだデータを代入
class Quiz {
    questions;
    constructor(questions) {
        this.questions = questions;
    }
    // ランダムに質問を取得して、その質問をリストから削除
    getNext() {
        // 0以上、配列の長さ以下のランダムな整数を生成
        const idx = Math.floor(Math.random() * this.questions.length);
        // ランダムなインデックスidxを使って、questions配列から1つの問題を削除
        const [question] = this.questions.splice(idx, 1);
        return question;
    }
    // 次の問題が存在するか確認
    hasNext() {
        return this.questions.length > 0;
    }
    // 残りの質問数を取得
    lefts() {
        return this.questions.length;
    }
}
const quiz = new Quiz(question);
// readlinePromisesインターフェイスのインスタンスを生成
const rl = promises_1.default.createInterface({
    input: process.stdin,
    output: process.stdout
});
const CLI = {
    // プロパティとメソッドを追加していく
    async input() {
        const input = await rl.question("文字または単語を推測してください： ");
        return input.replaceAll(" ", "").toLowerCase();
    },
    clear() {
        console.clear(); // コンソールのクリア
    },
    destroy() {
        rl.close(); // プロンプトの終了
    }
};
// 確認用関数
// async function testQuestion() {
//   CLI.clear(); // 画面をクリア
//   const userInput = await CLI.input() // 入力を受け付けて返す。
//   console.log(userInput)
//   CLI.destroy() // セッションの終了
// }
// testQuestion()
console.log(chalk_1.default.green("正解！")); // 緑色で表示される
