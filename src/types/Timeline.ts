import { Job } from "./Job";

export interface ITimeline {
  name: string;
  condition: ITimelineCondition;
  timeline: string;
  codeFight: string;
  create: string;
}

export interface ITimelineCondition {
  zoneId: string; //0=true
  job: Job; //JobEnum.NONE=true
}

export interface ITimelineLine {
  time: number;
  actionHTML: string;
  sync?: RegExp;
  show: boolean;
  windowBefore: number;
  windowAfter: number;
  jump?: number;
  alertAlready: boolean;
  tts?: string;
}

export enum TimelineConfigEnum {
  顯示範圍 = "displayDuration",
  變色時間 = "discoloration",
  零后持續 = "hold",
  戰前準備 = "preBattle",
  TTS提前量 = "ttsAdvance",
  // 重新整理頻率 = "refreshRateMs",
}

export type TimelineConfigTranslate = Record<TimelineConfigEnum, string>;
export type TimelineConfigValues = Record<TimelineConfigEnum, number>;
export type ShowStyleTranslate = Record<ShowStyleConfigEnum, string>;
export type ShowStyle = Record<ShowStyleConfigEnum, number>;
export enum ShowStyleConfigEnum {
  總寬度 = "--timeline-width",
  未到來縮放 = "--normal-scale",
  即將到來縮放 = "--up-coming-scale",
  字型尺寸 = "--font-size",
  變色動畫時間 = "--tras-duration",
  未到來不透明度 = "--opacity",
}
