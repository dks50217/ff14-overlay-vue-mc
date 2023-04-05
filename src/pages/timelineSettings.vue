<script lang="ts" setup>
import Swal from "sweetalert2";
import "@sweetalert2/theme-bootstrap-4/bootstrap-4.scss";
import zoneInfo from "@/resources/zoneInfo";
import { useTimelineStore, parseTimeline } from "@/store/timeline";
import Util from "@/utils/util";
import "animate.css";
import ClipboardJS from "clipboard";
import { ITimeline, ITimelineLine } from "@/types/Timeline";
import { p8sTimeline } from "@/resources/timelineTemplate";
import moment from "moment";

const simulatedCombatTime = ref(-30);
const timelineStore = useTimelineStore();
const timelines = toRef(timelineStore, "allTimelines");
const timelineFilters = toRef(timelineStore, "filters");
const highDifficultZoneId: { id: string; name: string }[] = [{ id: "0", name: "任意" }];
const showFFlogs = ref(false);
const showSettings = ref(false);
let timelineCurrentlyEditing: { timeline: ITimeline } = reactive({
  timeline: { name: "空", condition: { zoneId: "0", job: "NONE" }, timeline: "空", codeFight: "空", create: "空" },
});
const isWSMode = location.href.includes("OVERLAY_WS=");
const transmissionTimeline = ref([] as ITimelineLine[]);

async function updateTransmissionTimeline() {
  transmissionTimeline.value = await parseTimeline(timelineCurrentlyEditing.timeline.timeline);
}
const debounceJobCN = useDebounce(
  computed(() => Util.getBattleJobs2()),
  500,
  { maxWait: 5000 },
);
init();

function init(): void {
  for (const key in zoneInfo) {
    if (Object.prototype.hasOwnProperty.call(zoneInfo, key)) {
      const element = zoneInfo[key];
      switch (element.contentType) {
        case 4:
        case 5:
        case 28:
          highDifficultZoneId.push({ id: key, name: element.name?.cn ?? element.name?.ja ?? element.name?.ja ?? key });
      }
    }
  }
  loadTimelineStoreData();
  timelineStore.sortTimelines();
  saveTimelineStoreData();
}

function applyData(): void {
  callOverlayHandler({
    call: "broadcast",
    source: "soumuaTimelineSetting",
    msg: {
      store: timelineStore.$state,
    },
  });
}

//通訊數據
function broadcastData(): void {
  if (!!urlTool({ url: location.href })?.OVERLAY_WS) {
    applyData();
    Swal.fire({
      title: "已嘗試進行通訊,請檢查ACT懸浮窗是否接收",
      text: "若無法通訊，可將本頁面直接新增到ACT懸浮窗進行編輯，設定將會自動儲存。（編輯后重新整理一下時間軸網頁）",
    });
  } else {
    Swal.fire({
      icon: "error",
      title: "目前與ACT斷開了連線。",
      text: '請啟用ACT OverlayPlugin WSServer，並使本頁面url參數中的埠號與其保持一致：OVERLAY_WS=ws://127.0.0.1:埠號/ws"',
    });
  }
}

//獲取URL參數
function urlTool({ url }: { url: string }): any {
  const array = url.split("?")!.pop()!.split("&");
  const data: any = {};
  array!.forEach((ele) => {
    let dataArr = ele.split("=");
    data[dataArr[0]] = dataArr[1];
  });
  return data;
}

function fflogsImportClick(): void {
  showFFlogs.value = !showFFlogs.value;
  clearCurrentlyTimeline();
}

function clearCurrentlyTimeline(): void {
  timelineCurrentlyEditing.timeline = {
    name: "空",
    condition: { zoneId: "0", job: "NONE" },
    timeline: "空",
    codeFight: "空",
    create: "空",
  };
}

function newDemoTimeline(): void {
  // clearCurrentlyTimeline();
  timelineCurrentlyEditing.timeline = timelineStore.allTimelines[timelineStore.newTimeline()];
}

function editTimeline(timeline: ITimeline): void {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
  timelineCurrentlyEditing.timeline = timeline;
  updateTransmissionTimeline();
}

//刪除某時間軸 來自點選事件
function deleteTimeline(target: ITimeline): void {
  Swal.fire({
    title: `確定要刪除${target.name}嗎？`,
    text: "這將無法撤回！",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "確認刪除",
    cancelButtonText: "取消",
  }).then((result) => {
    if (result.isConfirmed) {
      clearCurrentlyTimeline();
      timelines.value.splice(
        timelines.value.findIndex((v) => v === target),
        1,
      );
    }
  });
}

//初始化時load
function loadTimelineStoreData(): void {
  timelineStore.loadTimelineSettings();
  Reflect.deleteProperty(timelineStore.configValues, "refreshRateMs");
}

//開啟watch去save
function saveTimelineStoreData(): void {
  watchEffect(
    () => {
      timelineStore.saveTimelineSettings();
    },
    { flush: "post" },
  );
}

function exportTimeline(timelineArr: ITimeline[]): void {
  let clipboard = new ClipboardJS(".export", {
    text: () => {
      return JSON.stringify(timelineArr);
    },
  });
  clipboard.on("success", () => {
    Swal.fire({
      position: "top-end",
      icon: "success",
      title: "複製成功，已寫入剪下板。",
      showConfirmButton: false,
      timer: 1500,
    });
    clipboard.destroy();
  });
  clipboard.on("error", () => {
    Swal.fire("複製失敗，請手動複製！", JSON.stringify([timelineArr]));
    clipboard.destroy();
  });
}

function importTimelines(): void {
  Swal.fire({
    title: "輸入導出的字串",
    input: "text",
    returnInputValueOnDeny: true,
    showDenyButton: true,
    denyButtonText: "覆蓋",
    showConfirmButton: true,
    confirmButtonText: "追加",
    showCancelButton: true,
    cancelButtonText: "放棄",
  }).then((result) => {
    if (result.isConfirmed || result.isDenied) {
      try {
        if (result.isDenied) {
          Swal.fire({
            title: "這將丟失目前擁有的所有數據，你確定要覆蓋嗎？",
            showConfirmButton: false,
            showDenyButton: true,
            denyButtonText: "確定覆蓋",
            showCancelButton: true,
            cancelButtonText: "取消",
          }).then((res) => {
            if (res.isDenied) {
              timelineStore.allTimelines.length = 0;
              timelineStore.allTimelines.push(...(JSON.parse(result.value) as ITimeline[]));
              timelineStore.sortTimelines();
            }
          });
        } else {
          timelineStore.allTimelines.push(...(JSON.parse(result.value) as ITimeline[]));
          timelineStore.sortTimelines();
        }
      } catch (e: any) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: e,
        });
      }
    }
  });
}

function createP8STimeline(): void {
  timelineCurrentlyEditing.timeline =
    timelineStore.allTimelines[
      timelineStore.newTimeline("門神模板", { zoneId: "1088", job: "NONE" }, p8sTimeline, "P8S門神模板V6")
    ];
}
const timeMinuteSecondDisplay = computed(() => {
  return (
    (simulatedCombatTime.value < 0 ? "-" : "") +
    (Array(2).join("0") + (Math.floor(simulatedCombatTime.value / 60) + (simulatedCombatTime.value < 0 ? 1 : 0))).slice(
      -2,
    ) +
    ":" +
    (Array(2).join("0") + Math.floor(simulatedCombatTime.value % 60)).slice(-2)
  );
});
function timelineTimeFormat() {
  timelineCurrentlyEditing.timeline.timeline = timelineCurrentlyEditing.timeline.timeline.replaceAll(
    /(?<=^|^#\s*)(?<time>[:：\d.]+)/gm,
    (searchValue: string | RegExp, replaceValue: string): string => {
      if (/^\d+[::]\d+(?:\.\d{1,2})?$/.test(searchValue.toString())) {
        // mm:ss 轉 seconds
        return moment
          .duration("00:" + searchValue.toString())
          .as("seconds")
          .toString();
      } else {
        //seconds 轉 mm:ss
        return moment.utc(parseFloat(searchValue.toString()) * 1000).format("mm:ss.S");
      }
    },
  );
}
</script>
<template>
  <el-container class="container">
    <el-header>
      <el-button type="primary" @click="newDemoTimeline()">新建</el-button>
      <el-button @click="fflogsImportClick()">從FFlogs匯入</el-button>
      <el-button @click="showSettings = !showSettings" color="#626aef" style="color: white">樣式設定</el-button>
      <el-button @click="importTimelines()">匯入</el-button>
      <el-button class="export" @click="exportTimeline(timelines)">全部導出</el-button>
      <el-button v-if="isWSMode" type="success" @click="broadcastData()">通過WS發送到懸浮窗</el-button>
      <!-- <el-button v-if="!isWSMode" type="success" @click="applyData()">應用</el-button> -->
      <el-button @click="createP8STimeline()">P8S門神模板</el-button>
    </el-header>
    <el-main>
      <timeline-fflogs-import
        :settings="timelineStore.settings"
        :filters="timelineFilters"
        v-if="showFFlogs"
        @clearCurrentlyTimeline="clearCurrentlyTimeline"
        @showFFlogsToggle="() => (showFFlogs = !showFFlogs)"
        @newTimeline="timelineStore.newTimeline"
      >
      </timeline-fflogs-import>
      <el-card class="box-card" v-show="showSettings">
        <el-descriptions title="時間軸參數" size="small" border>
          <el-descriptions-item
            v-for="(_value, key, index) in timelineStore.configValues"
            :key="index"
            :label="timelineStore.configTranslate[key]"
            label-align="right"
            width="16em"
          >
            <el-input-number :min="0" :step="0.1" v-model="timelineStore.configValues[key]" />
          </el-descriptions-item>
        </el-descriptions>
        <br />
        <el-descriptions size="small" title="時間軸樣式" border>
          <el-descriptions-item
            v-for="(_value, key, index) in timelineStore.showStyle"
            :key="index"
            :label="timelineStore.showStyleTranslate[key]"
            label-align="right"
            width="16em"
          >
            <el-input-number :min="0" :step="0.01" v-model="timelineStore.showStyle[key]" />
          </el-descriptions-item>
        </el-descriptions>
      </el-card>
      <br />
      <el-card v-show="timelineCurrentlyEditing.timeline.create !== '空'">
        <div class="slider-demo-block">
          <span>模擬時間：</span>
          <el-slider v-model="simulatedCombatTime" :min="-30" :max="1500" :step="0.1" show-input> </el-slider>
          <div>{{ timeMinuteSecondDisplay }}</div>
        </div>
        <el-row class="timeline-info">
          <div>
            <p class="timeline-info-config">
              <span>名稱：</span>
              <el-input v-model="timelineCurrentlyEditing.timeline.name" class="timeline-info-name"></el-input>
            </p>
            <p class="timeline-info-config">
              <span>地圖：</span>
              <el-select v-model="timelineCurrentlyEditing.timeline.condition.zoneId" filterable>
                <el-option
                  v-for="zone in highDifficultZoneId"
                  :key="zone.id"
                  :label="zone.name"
                  :value="zone.id"
                ></el-option>
              </el-select>
            </p>
            <p class="timeline-info-config">
              <span>職業：</span>
              <el-select v-model="timelineCurrentlyEditing.timeline.condition.job" required placeholder="職業">
                <el-option
                  v-for="job in debounceJobCN"
                  :key="job"
                  :label="Util.nameToFullName(job).full"
                  :value="job"
                ></el-option>
              </el-select>
            </p>
            <p class="timeline-info-config">
              <span>來源：</span>
              <el-input v-model="timelineCurrentlyEditing.timeline.codeFight" disabled />
            </p>
            <p class="timeline-info-config">
              <span>建立：</span>
              <el-input v-model="timelineCurrentlyEditing.timeline.create" disabled />
            </p>
            <el-row m-b-10px>
              <el-button :span="12" class="export" @click="exportTimeline([timelineCurrentlyEditing.timeline])"
                >單獨導出</el-button
              >
              <el-button type="primary" :span="12" @click="timelineTimeFormat()">切換時間</el-button>
            </el-row>
            <el-row>
              <el-button :span="12" type="danger" @click="deleteTimeline(timelineCurrentlyEditing.timeline)"
                >刪除</el-button
              >
              <el-button :span="12" @click="clearCurrentlyTimeline()">隱藏編輯界面</el-button>
            </el-row>
          </div>
          <div style="flex: 1">
            <el-input
              class="timeline-timeline-raw"
              v-model="timelineCurrentlyEditing.timeline.timeline"
              type="textarea"
              :rows="12"
              wrap="off"
              placeholder="請鍵入時間軸文字"
              style="max-width: 569px"
              @change="updateTransmissionTimeline()"
            />
          </div>
          <div style="max-height: 353px">
            <div class="timeline-timeline-view">
              <timeline-timeline-show
                :config="timelineStore.configValues"
                :lines="transmissionTimeline"
                :runtime="simulatedCombatTime"
                :show-style="timelineStore.showStyle"
              ></timeline-timeline-show>
            </div>
          </div>
        </el-row>
        <br />
      </el-card>
      <br />
      <el-card v-if="timelines.length > 0">
        <el-table :data="timelines" style="width: 100%" stripe>
          <el-table-column prop="name" label="名稱"> </el-table-column>
          <el-table-column prop="conditon" label="地圖" sortable>
            <template #default="scope">
              {{ highDifficultZoneId.find((value) => value.id === scope.row.condition.zoneId)?.name }}
            </template>
          </el-table-column>
          <el-table-column prop="conditon" label="職業">
            <template #default="scope">{{ Util.nameToFullName(scope.row.condition.job).full }} </template>
          </el-table-column>
          <el-table-column fixed="right" label="操作" width="100">
            <template #default="scope">
              <el-button @click="editTimeline(scope.row)" type="primary" size="small">編輯</el-button>
            </template>
          </el-table-column>
        </el-table></el-card
      >
      <el-card v-if="timelines.length === 0">
        <el-empty description="點選上方新建或匯入一個時間軸吧~"></el-empty
      ></el-card>
    </el-main>
  </el-container>
</template>
<style lang="scss" scoped>
.slider-demo-block {
  display: flex;
  align-items: center;
  white-space: nowrap;
}
.slider-demo-block .el-slider {
  margin-top: 0;
  margin-left: 12px;
}
.container {
  max-width: 1080px;
  .timeline-info {
    display: flex;
    flex-wrap: nowrap;
    position: relative;
    box-sizing: border-box;
    flex-direction: row;
    justify-content: space-between;
    .timeline-info-config {
      display: flex;
      span {
        white-space: nowrap;
      }
    }
    :deep(.el-input) {
      max-width: 200px;
      margin-right: 5px;
    }
    .timeline-timeline-view {
      margin-top: 1em;
      overflow-x: auto;
    }
    :deep(.el-textarea__inner) {
      line-height: 2;
      margin-top: 1em;
      // overflow-x: hidden;
    }
  }
  .timelinesList {
    list-style: circle;
    padding: 0;
    margin: 0;
    margin-left: 1em;
    li {
      cursor: pointer;
      font-size: 16px;
      font-family: "Microsoft YaHei";
      padding: 5px;
      transition-duration: 0.5s;
      animation-duration: 1s;
      &:hover {
        background-color: rgba($color: gray, $alpha: 0.1);
      }
    }
  }
}
</style>
