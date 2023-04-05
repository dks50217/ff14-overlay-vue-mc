export type IActionData = [string, number, number, number, number, boolean, number, number, number, boolean, boolean];
export type IAction = {
  Id: number;
  Name: string;
  Icon: number;
  ActionCategory: number;
  ClassJob: string;
  ClassJobLevel: number;
  IsRoleAction: boolean;
  Cast100ms: number;
  Recast100ms: number;
  MaxCharges: number;
  IsPvP: boolean;
  IsPlayerAction: boolean;
  Url?: string;
};
export enum ActionEnum {
  "Name",
  "Icon",
  "ActionCategory",
  "ClassJob",
  "ClassJobLevel",
  "IsRoleAction",
  "Cast100ms",
  "Recast100ms",
  "MaxCharges",
  "IsPvP",
  "IsPlayerAction",
}
export enum ActionCategoryEnum {
  自動攻擊 = 1,
  魔法 = 2,
  戰技 = 3,
  能力 = 4,
  道具 = 5,
  採集能力 = 6,
  製作能力 = 7,
  任務 = 8,
  極限技 = 9,
  系統 = 10,
  弩炮 = 11,
  坐騎 = 12,
  特殊技能 = 13,
  道具操作 = 14,
  奮戰技 = 15,
}
