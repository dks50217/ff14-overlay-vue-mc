import { defineStore } from "pinia";
import {
  ITimeline,
  ITimelineCondition,
  TimelineConfigEnum,
  ITimelineLine,
  TimelineConfigTranslate,
  ShowStyleTranslate,
  TimelineConfigValues,
  ShowStyle,
} from "../types/Timeline";
import Swal from "sweetalert2";
import "@sweetalert2/theme-bootstrap-4/bootstrap-4.scss";
import Util from "../utils/util";
import { getActionByChineseName, getImgSrc } from "@/utils/xivapi";
import { FFIcon } from "@/types/Fflogs";

class Timeline implements ITimeline {
  constructor(name: string, condition: ITimelineCondition, timeline: string, codeFight: string) {
    if (Util.iconToJobEnum(condition.job as FFIcon)) {
      //突然有一天數據格式不一致了 可能是fflogs改返回值了?
      condition.job = Util.jobEnumToJob(Util.iconToJobEnum(condition.job as FFIcon));
    }
    this.name = name;
    this.condition = condition;
    this.timeline = timeline;
    this.codeFight = codeFight;
    this.create = new Date().toLocaleString();
  }
  name: string;
  condition: ITimelineCondition;
  timeline: string;
  codeFight: string;
  create: string;
}

const configTranslate: TimelineConfigTranslate = {
  [TimelineConfigEnum.顯示範圍]: "顯示範圍（秒）",
  [TimelineConfigEnum.變色時間]: "提前變色（秒）",
  [TimelineConfigEnum.零后持續]: "後續保持（秒）",
  [TimelineConfigEnum.戰前準備]: "倒計時量（秒）",
  [TimelineConfigEnum.TTS提前量]: "TTS預備（秒）",
  // [TimelineConfigEnum.重新整理頻率]: "重新整理率（毫秒）",
};

const configValues: TimelineConfigValues = {
  [TimelineConfigEnum.顯示範圍]: 120,
  [TimelineConfigEnum.變色時間]: 2.75,
  [TimelineConfigEnum.零后持續]: 0.5,
  [TimelineConfigEnum.戰前準備]: 30,
  [TimelineConfigEnum.TTS提前量]: 1,
  // [TimelineConfigEnum.重新整理頻率]: 100,
};

const showStyleTranslate: ShowStyleTranslate = {
  "--timeline-width": "時間軸寬度",
  "--font-size": "字型大小",
  "--normal-scale": "等待縮放",
  "--up-coming-scale": "來臨縮放",
  "--opacity": "等待不透明度",
  "--tras-duration": "動畫時間",
};

let showStyle: ShowStyle = {
  "--timeline-width": 180,
  "--font-size": 18,
  "--opacity": 0.33,
  "--normal-scale": 0.5,
  "--up-coming-scale": 1,
  "--tras-duration": 1,
};

export const useTimelineStore = defineStore("timeline", {
  state: () => {
    return {
      // reg: reg,
      // timelineLegalRegular: new RegExp(reg, "gm"),
      allTimelines: [] as ITimeline[],
      configValues,
      configTranslate,
      settings: { api: "" },
      filters: {},
      showStyle,
      showStyleTranslate,
    };
  },
  getters: {},
  actions: {
    newTimeline(
      title: string = "Demo",
      condition: ITimelineCondition = { zoneId: "0", job: "NONE" },
      rawTimeline: string = `# 註釋的內容不會被解析
# "<技能名>"會被解析為圖片 緊接著一個波浪線可快捷重複技能名
-20 "<中間學派>~刷盾"
0 "戰鬥開始" tts "衝呀"
# 當sync在window的範圍內被滿足時將進行時間同步
30 "一運" sync / 14:4.{7}:[^:]*:AAAA:/ window 2.5,2.5
# 當存在jump時會進跳轉至jump時間
50 "變異化型:蛇" sync / 14:4.{7}:[^:]*:BBBB:/ window 2.5,2.5 jump 1000
50 "變異化型:獸" sync / 14:4.{7}:[^:]*:CCCC:/ window 2.5,2.5 jump 2000
1000 "蛇軸"
2000 "獸軸"
`,
      codeFight: string = "使用者建立",
    ): number {
      this.allTimelines.push(new Timeline(title, condition, rawTimeline, codeFight));
      this.sortTimelines();
      Swal.fire({
        position: "center",
        icon: "success",
        title: `「${title}」已建立`,
        showConfirmButton: false,
        timer: 1000,
      });
      //如果嚴謹點應該還要比較create 但重複的demo選錯又能怎麼樣呢
      const result = this.allTimelines.findIndex(
        (t) =>
          t.timeline === rawTimeline &&
          t.name === title &&
          JSON.stringify(t.condition) === JSON.stringify(condition) &&
          t.codeFight === codeFight,
      );
      return result;
    },
    getTimeline(condition: ITimelineCondition): ITimeline[] {
      return this.allTimelines.filter((t) => {
        return (
          (t.condition.zoneId === "0" || t.condition.zoneId === condition.zoneId) &&
          (t.condition.job === "NONE" || t.condition.job === condition.job)
        );
      });
    },
    saveTimelineSettings() {
      localStorage.setItem(
        "timelines",
        JSON.stringify({
          allTimelines: this.allTimelines,
          configValues: this.configValues,
          settings: this.settings,
          showStyle: this.showStyle,
          filters: this.filters,
        }),
      );
    },
    loadTimelineSettings() {
      const ls = localStorage.getItem("timelines");
      if (ls) {
        Object.assign(this, JSON.parse(ls));
        this.allTimelines.forEach((v) => {
          if ((v.condition as any).jobList) {
            v.condition.job = (v.condition as any).jobList[0] ?? "NONE";
            delete (v.condition as any).jobList;
          }
        });
        this.sortTimelines();
      }
      this.allTimelines.forEach((v) => {
        //突然有一天數據格式不一致了 可能是fflogs改返回值了? 對現有數據進行修復
        if (Util.iconToJobEnum(v.condition.job as FFIcon))
          v.condition.job = Util.jobEnumToJob(Util.iconToJobEnum(v.condition.job as FFIcon));
      });
    },
    sortTimelines() {
      this.allTimelines.sort((a, b) => {
        // a.condition.job === b.condition.job
        //   ? Number(a.condition.zoneId) - Number(b.condition.zoneId)
        //   : Util.jobToJobEnum(a.condition.job) - Util.jobToJobEnum(b.condition.job),
        if (Number(a.condition.zoneId) === Number(b.condition.zoneId))
          return Util.jobToJobEnum(a.condition.job) - Util.jobToJobEnum(b.condition.job);
        return Number(a.condition.zoneId) - Number(b.condition.zoneId);
      });
    },
  },
});

function parseTime(time: string): number {
  const timeFormatType = time.match(/^(?<negative>-)?(?<mm>[^:：]+):(?<ss>[^:：]+)$/);
  if (timeFormatType) {
    return (
      parseFloat(timeFormatType.groups!.mm) * 60 +
      parseFloat(timeFormatType.groups!.ss) * (timeFormatType.groups?.negative ? -1 : 1)
    );
  } else {
    return parseFloat(time);
  }
}
function parseAction(text: string) {
  return text.matchAll(/\<(?<name>[^\<\>]*?)!??\>(?<repeat>~)?/g);
}

async function parseActionHTML(text: string): Promise<string> {
  text = text.replaceAll(/^["']|["']$/g, "");
  const items = parseAction(text);
  if (!items) return Promise.resolve(text);
  for (const item of items) {
    if (item.groups?.name) {
      let src
      try {
        src = await getImgSrc(await getActionByChineseName(item.groups.name).then((v) => v?.Icon ?? ""));
      } catch (e) {}
      text = text.replace(
        item[0],
        `${src ? `<div class="skill_icon"><img src='${src}' loading="lazy"/></div>` : ""}${
          item.groups?.repeat ? item.groups!.name : ""
        }`,
      );
    }
  }
  return Promise.resolve(text);
}
export async function parseTimeline(rawTimeline: string): Promise<ITimelineLine[]> {
  const total: ITimelineLine[] = [];
  const matchs = [...rawTimeline.matchAll(/^(?<time>[-:：\d.]+)\s+(?<action>(--|["'])[^"'\n]+?\3).*$/gm)];
  for (let i = 0; i < matchs.length; i++) {
    const match = matchs[i];
    const jump = match[0].match(/(?<=jump ?)[-:：\d.]+/)?.[0];
    const sync = match[0].match(/(?<=sync ?\/).+(?=\/)/)?.[0];
    const windowBefore = match[0].match(/(?<=window ?)[-:：\d.]+/)?.[0];
    const windowAfter = match[0].match(/(?<=window ?[-:：\d.]+,)[-:：\d.]+/)?.[0];
    const tts = match[0].match(/ tts ?["'](?<tts>[^"']+)["']/)?.groups?.tts;
    const ttsSim = / tts(?: |$)/.test(match[0])
      ? Array.from(parseAction(match.groups!.action))?.[0]?.groups?.name
      : undefined;
    const actionHTML = await parseActionHTML(match.groups!.action);
    total.push({
      time: parseTime(match.groups!.time),
      actionHTML: match.groups!.action ? actionHTML : "",
      alertAlready: false,
      sync: sync ? new RegExp(sync) : undefined,
      show: !sync,
      windowBefore: parseFloat(windowBefore || windowAfter || "2.5"),
      windowAfter: parseFloat(windowAfter || windowBefore || "2.5"),
      jump: jump ? parseFloat(jump) : undefined,
      tts: tts || ttsSim,
    });
  }
  total.sort((a, b) => a.time - b.time);
  return total;
}
