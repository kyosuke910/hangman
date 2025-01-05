<div id="top"></div>

## 使用技術一覧
<p style="display: inline">
  <img src="https://img.shields.io/badge/-Node.js-000000.svg?logo=node.js&style=for-the-badge">
  <img src="https://img.shields.io/badge/-typescript-232F3E.svg?logo=typescript&style=for-the-badge">
</p>

## 目次
1. [プロジェクトについて](#プロジェクトについて)
2. [環境](#環境)
3. [ディレクトリ構成](#ディレクトリ構成)
4. [開発環境構築](#開発環境構築)

## プロジェクト名
Node.jsのCLIゲーム

## プロジェクト概要
伝統的な「ハングマン」と呼ばれる言葉を当てるゲームをベースにした独自のものです。オリジナルのハングマンとの変更点は下記になります。
<ul>
  <li>出題される単語はTypeScriptに関する用語に限定されている</li>
  <li>解答者には単語のヒントは提示される</li>
  <li>2文字以上の解答とする(オリジナルは1文字ずつ)</li>
</ul>

このゲームの問題の出題(画面表示)と解答(文字入力)は、コマンドラインインターフェイスを通して。すべてテキストベースで行われます。<br>
具体的には、Node.js上でコンパイル後のJavaScriptファイルを実行して、ターミナル上で文字の入出力を行います。
<img width="725" alt="スクリーンショット 2025-01-05 22 37 46" src="https://github.com/user-attachments/assets/7d0c93c1-d606-4223-bab6-5a60d49fd4b0" />

## 環境
| 言語・フレームワーク  | バージョン |
| --------------------- | ---------- |
| Node.js               | 20.8.1     |
| TypeScript            | 5.2.2      |
| chalk                 | 4.1.2      |
| figlet                | 1.6.0      |

その他のパッケージのバージョンは package.json を参照してください

## ディレクトリ構成
```
.
├── .gitignore
├── README.md
├── package.json
├── src
│   ├── data
│   │   └── questions.test.json
│   ├── hangman.ts
│   ├── interfaces
│   │   ├── GameState.ts
│   │   ├── Question.ts
│   │   └── UserInterface.ts
│   ├── models
│   │   ├── Game.ts
│   │   ├── Message.ts
│   │   ├── Quiz.ts
│   │   └── Stage.ts
│   └── utils
│       └── CLI.ts
└── tsconfig.json
```

## 開発環境構築
```
npm i
```
npm i を実行して、開発環境構築をしてください。
```
npm start
```
npm startでゲームが開始されます。