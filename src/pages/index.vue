<script setup lang="ts">
import { pleaseUseACT } from "../utils/pleaseUseACT";
import router from "../router";
type MenuType = "網頁" | "懸浮窗" | "懸浮窗/網頁";
interface Menu {
  title: string;
  type: MenuType;
  path: string;
}
const menu: Menu[] = [
  {
    title: "♿[Github]CACTBOT JS 火箭輪椅",
    type: "網頁",
    path: "https://github.com/Souma-Sumire/raidboss-user-js-public",
  },
  { title: "🪐占星一鍵髮卡", type: "懸浮窗", path: "okASTCard" },
  {
    title: "🌱施法監控",
    type: "懸浮窗",
    path: "castingMonitor?duration=25&energySaving=true&displayAA=false&displayGCDSpace=false&api=cafemaker&syncFocusWS=true&showHeader=true",
  },
  { title: "👍全副本一鍵發宏/標點", type: "懸浮窗", path: "zoneMacro" },
  { title: "🔥技能時間軸", type: "懸浮窗", path: "timeline" },
  { title: "📹OBS自動錄製", type: "懸浮窗", path: "obs" },
  { title: "🤷我TM現在在幾線？", type: "懸浮窗", path: "instancedAreaInfo" },
  { title: "📖絕龍詩雙分攤修血記錄", type: "懸浮窗", path: "dsrP6" },
  { title: "🀄[Github]國際服漢化補丁", type: "網頁", path: "https://github.com/Souma-Sumire/FFXIVChnTextPatch-Souma/" },
  { title: "⏩FFLOGS上傳器加速下載", type: "網頁", path: "fflogsUploaderDownload" },
  { title: "💃舞臺節目單（沒啥用，被窩同款）", type: "網頁", path: "stageProgramme" },
  {
    title: "🧐減傷監控",
    type: "懸浮窗",
    path: "https://souma.diemoe.net/dist/keigennRecord.html?maxLength=800&24Mode=false&bgOpacity=0.45&bodyOpacity=1&fontSize=12px&th1=36px&th2=75px&th3=34px&th4=46px&imgHeight=20&mini=false&autoclean=false",
  },
  {
    title: "🕵️團輔團減監控",
    type: "懸浮窗",
    path: "https://souma.diemoe.net/dist/keySkillTimer.html?international=false&dajinengTTS=true&jianshangTTS=true&tuanfuTTS=true",
  },
  {
    title: "👨‍✈️技能監控",
    type: "懸浮窗",
    path: "https://souma.diemoe.net/dist/teamWatch.html?scale=1&reverse=false&rightAlign=false&postNamazu=false",
  },
  {
    title: "📰讀條漢化",
    type: "懸浮窗",
    path: "castingToChinese",
  },
  {
    title: "🏵️LB額外增長監控",
    type: "懸浮窗",
    path: "https://souma.diemoe.net/dist/limitBreakTip.html?LBMax=30000&automatic=220",
  },
  {
    title: "（錄像用）顯示時間",
    type: "網頁",
    path: "time",
  },
];
function handleClickMenu(menu: Menu) {
  if (menu.type === "懸浮窗") {
    pleaseUseACT(() => {
      /^http/.test(menu.path) ? (location.href = menu.path) : router.push(menu.path);
    });
  } else {
    /^http/.test(menu.path) ? (location.href = menu.path) : router.push(menu.path);
  }
}
</script>

<template>
  <div class="common-layout" bt-white>
    <el-container>
      <el-header><h1>主頁導航</h1></el-header>
      <el-main>
        <el-table :data="menu" :show-header="false">
          <el-table-column label="跳轉" width="85">
            <template #default="scope"> <el-button @click="handleClickMenu(scope.row)">跳轉</el-button> </template>
          </el-table-column>
          <el-table-column prop="title" label="標題" />
        </el-table>
      </el-main>
    </el-container>
  </div>
</template>
