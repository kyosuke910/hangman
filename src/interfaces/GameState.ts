import { Stage } from "../models/Stage"

export interface GameState {
  stage: Stage // 現在のステージ情報。質問や解答、試行回数などを持つ
  done: boolean // ゲームが終了したかどうかを示すフラグ。trueの場合、ゲームはすでに終了しているとみなされる
}