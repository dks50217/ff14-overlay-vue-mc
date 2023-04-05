import { FFlogsStance, FFlogsType } from "../types/Fflogs";

const windowAction: Map<number, { type: FFlogsType; window: [number, number] }> = new Map();
windowAction.set(26155, { type: "cast", window: [999, 999] }); //海德林轉場 眾生離絕
windowAction.set(28027, { type: "cast", window: [999, 999] }); //佐迪亞克轉場 悼念
windowAction.set(26340, { type: "cast", window: [999, 999] }); //P3S轉場 黑暗不死鳥
windowAction.set(25533, { type: "begincast", window: [60, 60] }); //絕龍詩 萬物終結
windowAction.set(26376, { type: "cast", window: [999, 999] }); //絕龍詩 滅絕之詩
windowAction.set(26814, { type: "begincast", window: [999, 999] }); //絕龍詩 邪龍爪牙
windowAction.set(25313, { type: "begincast", window: [200, 200] }); //絕龍詩 空間牢獄
windowAction.set(27526, { type: "begincast", window: [999, 999] }); //絕龍詩 聖徒化
windowAction.set(26215, { type: "cast", window: [500, 30] }); //絕龍詩 P6: Nidhogg v2
windowAction.set(29050, { type: "begincast", window: [200, 30] }); //絕龍詩 P6.5: Eyes v2
windowAction.set(29156, { type: "cast", window: [20, 20] }); //絕龍詩 衝擊波
windowAction.set(27973, { type: "cast", window: [20, 20] }); //絕龍詩 邪念之火
windowAction.set(27937, { type: "begincast", window: [20, 20] }); //絕龍詩 絕命怒嚎
windowAction.set(28059, { type: "begincast", window: [20, 20] }); //絕龍詩 騎龍劍百京核爆
windowAction.set(28060, { type: "begincast", window: [20, 20] }); //絕龍詩 騎龍劍百京核爆
windowAction.set(28061, { type: "begincast", window: [20, 20] }); //絕龍詩 騎龍劍百京核爆
windowAction.set(27956, { type: "begincast", window: [20, 20] }); //絕龍詩 聖龍吐息 不太行 吐息是隨機的
windowAction.set(27957, { type: "begincast", window: [20, 20] }); //絕龍詩 聖龍吐息 不太行 吐息是隨機的
windowAction.set(27952, { type: "begincast", window: [30, 30] }); //絕龍詩 滅殺的誓言
windowAction.set(27969, { type: "begincast", window: [20, 20] }); //絕龍詩 無盡輪迴
windowAction.set(27971, { type: "begincast", window: [20, 20] }); //絕龍詩 無盡輪迴
windowAction.set(27939, { type: "begincast", window: [20, 20] }); //絕龍詩 神聖之翼
windowAction.set(27966, { type: "begincast", window: [20, 20] }); //絕龍詩 邪炎俯衝
windowAction.set(25316, { type: "begincast", window: [999, 999] }); //絕龍詩 純潔心靈
windowAction.set(25544, { type: "begincast", window: [10, 10] }); //絕龍詩 阿斯卡隆之仁·隱秘
windowAction.set(26379, { type: "begincast", window: [10, 10] }); //絕龍詩 騰龍槍
windowAction.set(31552, { type: "begincast", window: [30, 30] }); //絕歐米茄 防禦程式
windowAction.set(31573, { type: "begincast", window: [30, 30] }); //絕歐米茄 你好，世界
windowAction.set(31573, { type: "begincast", window: [30, 30] }); //絕歐米茄 你好，世界
windowAction.set(31617, { type: "begincast", window: [8, 8] }); //絕歐米茄 波動炮
windowAction.set(31624, { type: "begincast", window: [30, 30] }); //絕歐米茄 代號：*能*·德爾塔
windowAction.set(31649, { type: "begincast", window: [30, 30] }); //絕歐米茄 宇宙記憶

export function factory(events: FFlogsStance): FFlogsStance {
  for (const event of events) {
    const w = windowAction.get(event.actionId);
    if (w?.type === event.type) event.window = w?.window;
  }
  return events;
}
