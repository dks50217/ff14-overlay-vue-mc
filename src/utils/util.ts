import { FFIcon } from "../types/Fflogs";
import { FullJob, Job, Role } from "../types/Job";

const iconToJobEnum: Record<FFIcon, number> = {
  NONE: 0,
  Paladin: 19,
  Monk: 20,
  Warrior: 21,
  Dragoon: 22,
  Bard: 23,
  WhiteMage: 24,
  BlackMage: 25,
  Summoner: 27,
  Scholar: 28,
  Ninja: 30,
  Machinist: 31,
  DarkKnight: 32,
  Astrologian: 33,
  Samurai: 34,
  RedMage: 35,
  Gunbreaker: 37,
  Dancer: 38,
  Reaper: 39,
  Sage: 40,
};

const nameToJobEnum: Record<Job, number> = {
  NONE: 0,
  GLA: 1,
  PGL: 2,
  MRD: 3,
  LNC: 4,
  ARC: 5,
  CNJ: 6,
  THM: 7,
  CRP: 8,
  BSM: 9,
  ARM: 10,
  GSM: 11,
  LTW: 12,
  WVR: 13,
  ALC: 14,
  CUL: 15,
  MIN: 16,
  BTN: 17,
  FSH: 18,
  PLD: 19,
  MNK: 20,
  WAR: 21,
  DRG: 22,
  BRD: 23,
  WHM: 24,
  BLM: 25,
  ACN: 26,
  SMN: 27,
  SCH: 28,
  ROG: 29,
  NIN: 30,
  MCH: 31,
  DRK: 32,
  AST: 33,
  SAM: 34,
  RDM: 35,
  BLU: 36,
  GNB: 37,
  DNC: 38,
  RPR: 39,
  SGE: 40,
};
const nameToFullName: Record<Job, { full: string; simple1: string; simple2: string; en: FullJob }> = {
  NONE: { full: "無", simple2: "無", simple1: "無", en: "none" },
  GLA: { full: "劍術師", simple2: "劍術", simple1: "劍", en: "gladiator" },
  PGL: { full: "格鬥家", simple2: "格鬥", simple1: "斗", en: "pugilist" },
  MRD: { full: "斧術師", simple2: "斧術", simple1: "斧", en: "marauder" },
  LNC: { full: "槍術士", simple2: "槍術", simple1: "槍", en: "lancer" },
  ARC: { full: "弓箭手", simple2: "弓箭", simple1: "弓", en: "arcanist" },
  CNJ: { full: "幻術師", simple2: "幻術", simple1: "幻", en: "conjurer" },
  THM: { full: "咒術師", simple2: "咒術", simple1: "咒", en: "thaumaturge" },
  CRP: { full: "刻木匠", simple2: "刻木", simple1: "刻", en: "carpenter" },
  BSM: { full: "段鐵匠", simple2: "段鐵", simple1: "段", en: "blacksmith" },
  ARM: { full: "鑄甲匠", simple2: "鑄甲", simple1: "鑄", en: "armorer" },
  GSM: { full: "雕金匠", simple2: "雕金", simple1: "雕", en: "goldsmith" },
  LTW: { full: "製革匠", simple2: "製革", simple1: "革", en: "leatherworker" },
  WVR: { full: "裁衣匠", simple2: "裁衣", simple1: "裁", en: "weaver" },
  ALC: { full: "鍊金術師", simple2: "鍊金", simple1: "煉", en: "alchemist" },
  CUL: { full: "烹調師", simple2: "烹調", simple1: "烹", en: "culinarian" },
  MIN: { full: "採礦工", simple2: "採礦", simple1: "采", en: "miner" },
  BTN: { full: "園藝工", simple2: "園藝", simple1: "園", en: "botanist" },
  FSH: { full: "捕魚人", simple2: "捕魚", simple1: "捕", en: "fisher" },
  PLD: { full: "騎士", simple2: "騎士", simple1: "騎 ", en: "paladin" },
  MNK: { full: "武僧", simple2: "武僧", simple1: "僧", en: "monk" },
  WAR: { full: "戰士", simple2: "戰士", simple1: "戰", en: "warrior" },
  DRG: { full: "龍騎士", simple2: "龍騎", simple1: "龍", en: "dragoon" },
  BRD: { full: "吟遊詩人", simple2: "詩人", simple1: "詩", en: "bard" },
  WHM: { full: "白魔法師", simple2: "白魔", simple1: "白", en: "whitemage" },
  BLM: { full: "黑魔法師", simple2: "黑魔", simple1: "黑", en: "blackmage" },
  ACN: { full: "秘術師", simple2: "秘術", simple1: "秘", en: "arcanist" },
  SMN: { full: "召喚師", simple2: "召喚", simple1: "召", en: "summoner" },
  SCH: { full: "學者", simple2: "學者", simple1: "學", en: "scholar" },
  ROG: { full: "雙劍師", simple2: "雙劍", simple1: "雙", en: "rogue" },
  NIN: { full: "忍者", simple2: "忍者", simple1: "忍", en: "ninja" },
  MCH: { full: "機工士", simple2: "機工", simple1: "機", en: "machinist" },
  DRK: { full: "暗黑騎士", simple2: "暗騎", simple1: "暗", en: "darkknight" },
  AST: { full: "占星術士", simple2: "占星", simple1: "占", en: "astrologian" },
  SAM: { full: "武士", simple2: "武士", simple1: "武", en: "samurai" },
  RDM: { full: "赤魔法師", simple2: "赤魔", simple1: "赤", en: "redmage" },
  BLU: { full: "青魔法師", simple2: "青魔", simple1: "青", en: "bluemage" },
  GNB: { full: "絕槍戰士", simple2: "絕槍", simple1: "絕", en: "gunbreaker" },
  DNC: { full: "舞者", simple2: "舞者", simple1: "舞", en: "dancer" },
  RPR: { full: "釤鐮客", simple2: "釤鐮", simple1: "鐮", en: "reaper" },
  SGE: { full: "賢者", simple2: "賢者", simple1: "賢", en: "sage" },
};
const allJobs = Object.keys(nameToJobEnum) as Job[];
const allRoles = ["tank", "healer", "dps", "crafter", "gatherer", "none"] as Role[];

const tankJobs: Job[] = ["GLA", "PLD", "MRD", "WAR", "DRK", "GNB"];
const healerJobs: Job[] = ["CNJ", "WHM", "SCH", "AST", "SGE"];
const meleeDpsJobs: Job[] = ["PGL", "MNK", "LNC", "DRG", "ROG", "NIN", "SAM", "RPR"];
const rangedDpsJobs: Job[] = ["ARC", "BRD", "DNC", "MCH"];
const casterDpsJobs: Job[] = ["BLU", "RDM", "BLM", "SMN", "ACN", "THM"];
const dpsJobs: Job[] = [...meleeDpsJobs, ...rangedDpsJobs, ...casterDpsJobs];
const battleJobs: Job[] = [...tankJobs, ...healerJobs, ...meleeDpsJobs, ...rangedDpsJobs, ...casterDpsJobs];
const battleJobs2: Job[] = [...tankJobs, ...healerJobs, ...meleeDpsJobs, ...rangedDpsJobs, ...casterDpsJobs, "NONE"];

const craftingJobs: Job[] = ["CRP", "BSM", "ARM", "GSM", "LTW", "WVR", "ALC", "CUL"];
const gatheringJobs: Job[] = ["MIN", "BTN", "FSH"];

const stunJobs: Job[] = ["BLU", ...tankJobs, ...meleeDpsJobs];
const silenceJobs: Job[] = ["BLU", ...tankJobs, ...rangedDpsJobs];
const sleepJobs: Job[] = ["BLM", "BLU", ...healerJobs];
const feintJobs: Job[] = [...meleeDpsJobs];
const addleJobs: Job[] = [...casterDpsJobs];
const cleanseJobs: Job[] = ["BLU", "BRD", ...healerJobs];

const jobToRoleMap: Map<Job, Role> = (() => {
  const addToMap = (map: Map<Job, Role>, jobs: Job[], role: Role) => {
    jobs.forEach((job) => map.set(job, role));
  };

  const map: Map<Job, Role> = new Map([["NONE", "none"]]);
  addToMap(map, tankJobs, "tank");
  addToMap(map, healerJobs, "healer");
  addToMap(map, dpsJobs, "dps");
  addToMap(map, craftingJobs, "crafter");
  addToMap(map, gatheringJobs, "gatherer");

  return map;
})();

const Util = {
  jobEnumToJob: (id: number) => {
    const job = allJobs.find((job: Job) => nameToJobEnum[job] === id);
    return job ?? "NONE";
  },
  jobToJobEnum: (job: Job) => nameToJobEnum[job],
  jobToRole: (job: Job) => {
    const role = jobToRoleMap.get(job);
    return role ?? "none";
  },
  getAllRoles: (): readonly Role[] => allRoles,
  isTankJob: (job: Job) => tankJobs.includes(job),
  isHealerJob: (job: Job) => healerJobs.includes(job),
  isMeleeDpsJob: (job: Job) => meleeDpsJobs.includes(job),
  isRangedDpsJob: (job: Job) => rangedDpsJobs.includes(job),
  isCasterDpsJob: (job: Job) => casterDpsJobs.includes(job),
  isDpsJob: (job: Job) => dpsJobs.includes(job),
  isCraftingJob: (job: Job) => craftingJobs.includes(job),
  isGatheringJob: (job: Job) => gatheringJobs.includes(job),
  isCombatJob: (job: Job) => {
    return !craftingJobs.includes(job) && !gatheringJobs.includes(job);
  },
  canStun: (job: Job) => stunJobs.includes(job),
  canSilence: (job: Job) => silenceJobs.includes(job),
  canSleep: (job: Job) => sleepJobs.includes(job),
  canCleanse: (job: Job) => cleanseJobs.includes(job),
  canFeint: (job: Job) => feintJobs.includes(job),
  canAddle: (job: Job) => addleJobs.includes(job),
  getAllJobs: (): readonly Job[] => allJobs,
  getBattleJobs: (): readonly Job[] => battleJobs,
  getBattleJobs2: (): readonly Job[] => battleJobs2,
  nameToFullName: (job: Job) => {
    return nameToFullName[job] ?? { full: job, simple2: job.substring(0, 2), simple1: job.substring(0, 2), en: job };
  },
  iconToJobEnum: (icon: FFIcon) => {
    return iconToJobEnum[icon] ?? 0;
  },
  nameToJobEnum: (job: Job) => {
    return nameToJobEnum[job] ?? 0;
  },
} as const;

export default Util;
