import { defaultMacro } from "./../resources/macro";
import { defineStore } from "pinia";
import { doTextCommand, doInsertPreset, doWayMarks, doQueueActions } from "../utils/postNamazu";
import { MacroInfoMacro, MacroInfoPlace, MacroType } from "../types/Macro";
import zoneInfo from "../resources/zoneInfo";
import { getMapIDByTerritoryType, getTerritoryTypeByMapID } from "../resources/contentFinderCondition";
import ClipboardJS from "clipboard";
import { ElInputNumber, ElMessage, ElMessageBox } from "element-plus";
let partyLen = 0;
const slotIndex = useStorage("macro-slot-index", 5);
addOverlayListener("PartyChanged", (e: any) => (partyLen = e.party.length));
const [show, toggleShow] = useToggle(true);
export const useMacroStore = defineStore("macro", {
  state: () => {
    return {
      data: useStorage("my-macros", reactive(defaultMacro)),
      selectZone: useStorage("my-zone", ref("1003")),
      zoneNow: useStorage("my-zone-now", ref("129")),
      fastEntrance: [
        // { text: "P1S", value: "1003" },
        // { text: "P2S", value: "1005" },
        // { text: "P3S", value: "1007" },
        // { text: "P4S", value: "1009" },
        // { text: "极风", value: "1072" },
        { text: "幻魔神", value: "1090" },
        { text: "P5S", value: "1082" },
        { text: "P6S", value: "1084" },
        { text: "P7S", value: "1086" },
        { text: "P8S", value: "1088" },
        { text: "绝龙诗", value: "968" },
        { text: "绝欧米茄", value: "1122" },
        { text: "异闻水道", value: "1075" },
        { text: "零式异闻水道", value: "1076" },
      ],
      // gameExists: useStorage("my-game-exists", false),
      show,
      toggleShow,
    };
  },
  getters: {
    defaultX: (state) => zoneInfo[Number(state.selectZone)]?.offsetX ?? 0,
    defaultY: (state) => zoneInfo[Number(state.selectZone)]?.offsetY ?? 0,
  },
  actions: {
    editMacroMacro(macro: MacroInfoMacro): void {
      this.data.zoneId[this.selectZone].map((v) => Reflect.deleteProperty(v, "Editable"));
      macro.Editable = true;
      macro.Text = cleanMacro(macro.Text);
    },
    submitMacroMacro(macro: MacroInfoMacro): void {
      Reflect.deleteProperty(macro, "Editable");
      macro.Text = cleanMacro(macro.Text);
    },
    editMacroPlace(macro: MacroInfoPlace): void {
      this.data.zoneId[this.selectZone].map((v) => Reflect.deleteProperty(v, "Editable"));
      macro.Editable = true;
    },
    submitMacroPlace(macro: MacroInfoPlace): void {
      Reflect.deleteProperty(macro, "Editable");
    },
    formatAllWaymarkPlaceData() {
      for (const x in this.data.zoneId) this.formatSelectZoneWaymarkPlaceData(x);
    },
    formatSelectZoneWaymarkPlaceData(zone: string) {
      for (const y in this.data.zoneId[zone]) {
        Reflect.deleteProperty(this.data.zoneId[zone][y], "Editable");
        if (this.data.zoneId[zone][y].Type === "place") {
          const d = this.data.zoneId[zone][y] as MacroInfoPlace;
          (this.data.zoneId[zone][y] as MacroInfoPlace).Place = {
            A: d.Place.A ?? { X: -this.defaultX, Y: 0, Z: -this.defaultY, Active: false },
            B: d.Place.B ?? { X: -this.defaultX, Y: 0, Z: -this.defaultY, Active: false },
            C: d.Place.C ?? { X: -this.defaultX, Y: 0, Z: -this.defaultY, Active: false },
            D: d.Place.D ?? { X: -this.defaultX, Y: 0, Z: -this.defaultY, Active: false },
            One: d.Place.One ?? { X: -this.defaultX, Y: 0, Z: -this.defaultY, Active: false },
            Two: d.Place.Two ?? { X: -this.defaultX, Y: 0, Z: -this.defaultY, Active: false },
            Three: d.Place.Three ?? { X: -this.defaultX, Y: 0, Z: -this.defaultY, Active: false },
            Four: d.Place.Four ?? { X: -this.defaultX, Y: 0, Z: -this.defaultY, Active: false },
          };
        }
      }
    },
    newOne(type: MacroType = "macro") {
      for (const x in this.data.zoneId)
        for (const y in this.data.zoneId[x]) Reflect.deleteProperty(this.data.zoneId[x][y], "Editable");
      const selectZoneId = Number(this.selectZone);
      if (this.data.zoneId[selectZoneId] === undefined) this.data.zoneId[selectZoneId] = [];
      if (this.data.zoneId[selectZoneId]) {
        if (type === "macro") {
          this.data.zoneId[selectZoneId].push({ Type: type, Name: "New Macro", Text: "", Editable: true });
        } else if (type === "place") {
          const i = this.data.zoneId[selectZoneId].push({
            Name: "New WayMark",
            Type: type,
            Editable: true,
            Place: {
              A: { X: -this.defaultX, Y: 0, Z: -this.defaultY, Active: false },
              B: { X: -this.defaultX, Y: 0, Z: -this.defaultY, Active: false },
              C: { X: -this.defaultX, Y: 0, Z: -this.defaultY, Active: false },
              D: { X: -this.defaultX, Y: 0, Z: -this.defaultY, Active: false },
              One: { X: -this.defaultX, Y: 0, Z: -this.defaultY, Active: false },
              Two: { X: -this.defaultX, Y: 0, Z: -this.defaultY, Active: false },
              Three: { X: -this.defaultX, Y: 0, Z: -this.defaultY, Active: false },
              Four: { X: -this.defaultX, Y: 0, Z: -this.defaultY, Active: false },
            },
          });
          return this.data.zoneId[selectZoneId][i - 1];
        }
      }
    },
    async importPPJSON(): Promise<void> {
      const selectZoneId = Number(this.selectZone);
      const blank: PPJSON = {
        A: { X: -this.defaultX, Y: 0, Z: -this.defaultY, Active: false },
        B: { X: -this.defaultX, Y: 0, Z: -this.defaultY, Active: false },
        C: { X: -this.defaultX, Y: 0, Z: -this.defaultY, Active: false },
        D: { X: -this.defaultX, Y: 0, Z: -this.defaultY, Active: false },
        One: { X: -this.defaultX, Y: 0, Z: -this.defaultY, Active: false },
        Two: { X: -this.defaultX, Y: 0, Z: -this.defaultY, Active: false },
        Three: { X: -this.defaultX, Y: 0, Z: -this.defaultY, Active: false },
        Four: { X: -this.defaultX, Y: 0, Z: -this.defaultY, Active: false },
      };
      ElMessageBox.prompt("输入PPJSON", "Import PPJSON", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        inputPattern: /^(\{.*\})$/,
        inputErrorMessage: "无效的格式",
      })
        .then(async ({ value }) => {
          const json = Object.assign({ MapID: -1, Name: "json" }, Object.assign(blank, JSON.parse(value)));
          const selectMapID = getMapIDByTerritoryType(selectZoneId);
          const selectZone = zoneInfo[selectZoneId];
          const JSONZone = zoneInfo[getTerritoryTypeByMapID(json.MapID)];
          let flag = true;
          if (json.MapID !== selectMapID) {
            const confirm = await ElMessageBox.confirm(
              `PPJSON中的地图${JSONZone.name.cn ?? JSONZone.name.ja ?? "" + JSONZone.name.en}(${
                json.MapID
              })), 与当前选择的地图${
                selectZone.name.cn ?? selectZone.name.ja ?? "" + selectZone.name.en
              }(${selectMapID})不一致, 是否继续?`,
              "警告",
              {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
              },
            );
            if (confirm !== "confirm") flag = false;
          }
          if (!flag) return;
          const targetMacro = this.newOne("place") as MacroInfoPlace;
          targetMacro.Name = json.Name;
          targetMacro.Place = json;
          Reflect.deleteProperty(targetMacro, "Editable");
          const oX = selectZone.offsetX - JSONZone.offsetX;
          const oY = selectZone.offsetY - JSONZone.offsetY;
          try {
            ["A", "B", "C", "D", "One", "Two", "Three", "Four"].map((v: any) => {
              // @ts-ignore
              targetMacro.Place[v].X -= oX;
              // @ts-ignore
              targetMacro.Place[v].Z -= oY;
            });
          } catch {}
          Reflect.deleteProperty(targetMacro.Place, "MapID");
          Reflect.deleteProperty(targetMacro.Place, "Name");
          ElMessage.success("导入成功");
        })
        .catch(() => ElMessage.error("解析失败"));
    },
    deleteMacro(macro: MacroInfoMacro | MacroInfoPlace): void {
      if (
        (macro.Type === "macro" && (macro?.Text ?? "").length <= 5) ||
        (macro.Type === "place" &&
          macro.Place?.A?.Active === false &&
          macro.Place?.B?.Active === false &&
          macro.Place?.C?.Active === false &&
          macro.Place?.D?.Active === false &&
          macro.Place?.One?.Active === false &&
          macro.Place?.Two?.Active === false &&
          macro.Place?.Three?.Active === false &&
          macro.Place?.Four?.Active === false)
      ) {
        let index = this.data.zoneId[this.selectZone].indexOf(macro);
        if (index > -1) this.data.zoneId[this.selectZone].splice(index, 1);
      } else {
        ElMessageBox.confirm("确定要删除吗?", "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(() => {
            let index = this.data.zoneId[this.selectZone].indexOf(macro);
            if (index > -1) this.data.zoneId[this.selectZone].splice(index, 1);
          })
          .catch(() => {});
      }
    },
    exportWaymarksJson(macro: MacroInfoPlace): void {
      const json = JSON.parse(JSON.stringify(macro.Place));
      json.MapID = getMapIDByTerritoryType(Number(this.selectZone));
      json.Name = macro.Name;
      let clipboard = new ClipboardJS(".export", {
        text: () => {
          return JSON.stringify(json);
        },
      });
      clipboard.on("success", () => {
        ElMessage.success("已复制到剪贴板");
        clipboard.destroy();
      });
      clipboard.on("error", () => {
        ElMessageBox.alert(JSON.stringify(json), "Export Waymarks");
        clipboard.destroy();
      });
    },
    sendMacroParty(text: string): void {
      ElMessageBox.confirm("确定要发送到队伍频道吗?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          macroCommand(text, "p");
        })
        .catch(() => {});
    },
    sendMacroEcho(text: string): void {
      macroCommand(text, "e");
    },
    doLocalWayMark(place: PPJSON): void {
      doWayMarks(place);
      ElMessage.success("已标点");
    },
    doSlotWayMark(place: PPJSON): void {
      ElMessageBox({
        title: "选择插槽",
        message: () =>
          h(ElInputNumber, {
            "modelValue": slotIndex.value,
            "min": 1,
            "max": 5,
            "size": "large",
            "onUpdate:modelValue": (val: any) => {
              slotIndex.value = val;
            },
          }),
        showCancelButton: true,
        confirmButtonText: "确定",
        cancelButtonText: "取消",
      })
        .then(() => {
          doInsertPreset(Number(this.selectZone), place, slotIndex.value as 1 | 2 | 3 | 4 | 5);
          doQueueActions([{ c: "DoTextCommand", p: "/waymark preset " + slotIndex.value, d: 750 }]);
          ElMessage.success("插槽" + slotIndex.value + "已设置并标记");
        })
        .catch(() => {});
    },
    positioning(): void {
      this.selectZone = this.zoneNow;
    },
    handleChangeZone(e: any): void {
      this.selectZone = e.zoneID.toString();
      this.zoneNow = e.zoneID.toString();
      getZoneIDByZoneName(e.zoneName) || ElMessage(`未知区域 ${e.zoneName} ${e.zoneID}`);
    },
    // handleGameExists(e: any): void {
    //   this.gameExists = !!e?.detail?.exists;
    // },
    handleLogLine(e: any) {
      if (e.line[2] === "0038") {
        if (/^duty$/i.test(e.line[4])) {
          toggleShow();
          return;
        }
        const echoSwitch = e.line[4].match(/^(?:发宏|宏|macro|hong|fahong)\s*(?<channel>e|p)?(?<party>[!！])?\s*$/i);
        if (echoSwitch) {
          const channel: "e" | "p" = echoSwitch?.groups?.party ? "p" : echoSwitch?.groups?.channel ?? "e";
          const macro = this.data.zoneId[this.zoneNow]?.filter((v) => v.Type === "macro");
          if (macro?.length === 0 || !macro) {
            doTextCommand("/e 当前地图没有宏<se.3>");
          } else if (macro.length === 1 && macro[0].Type === "macro") {
            macroCommand(macro[0].Text, channel);
          } else if (macro.length > 1) {
            doTextCommand("/e 本地图存在多个宏，无法使用快捷发宏，请手动在网页中指定。");
            show.value = true;
          } else {
            console.error(macro);
          }
          return;
        }
        const echoSlot = (e.line[4] as string).match(
          /^(?:标点|标记|场景标记|place|biaodian)(?:插槽|预设|)\s*(?<slot>[1-5])?.*?(?<mark>[!！])?\s*$/i,
        );
        if (echoSlot) {
          const slotIndex: 1 | 2 | 3 | 4 | 5 = Number(echoSlot?.groups?.slot ?? 5) as 1 | 2 | 3 | 4 | 5;
          const place = this.data.zoneId[this.zoneNow]?.filter((v) => v.Type === "place");
          if (place?.length === 0 || !place) {
            doTextCommand("/e 当前地图没有标点<se.3>");
          } else if (place.length === 1) {
            doInsertPreset(Number(this.zoneNow), (place[0] as MacroInfoPlace).Place!, slotIndex);
            doTextCommand(`/e 已写入第${slotIndex}格<se.9>`);
            if (echoSlot?.groups?.mark) {
              doQueueActions([{ c: "DoTextCommand", p: `/waymark preset ${slotIndex}`, d: 500 }]);
            }
          } else if (place.length > 1) {
            show.value = true;
            doTextCommand("/e 本地图存在多个场景标记预设，无法使用快捷插槽，请手动在网页中指定。");
          } else {
            console.error(place);
          }
          return;
        }
      }
    },
    resetZone(): void {
      ElMessageBox.confirm("确定要重置当前地图的所有标点吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.data.zoneId[this.selectZone].length = 0;
          this.data.zoneId[this.selectZone].push(...JSON.parse(JSON.stringify(defaultMacro.zoneId[this.selectZone])));
          this.formatSelectZoneWaymarkPlaceData(this.selectZone);
          ElMessage.success("重置成功");
        })
        .catch(() => {});
    },
    resetAllData(): void {
      ElMessageBox.confirm("要重置所有数据吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          ElMessageBox.confirm("你确定吗？", "警告", {
            confirmButtonText: "确定！",
            cancelButtonText: "取消",
            type: "warning",
          }).then(() => {
            // localStorage.removeItem("my-macros");
            this.data = JSON.parse(JSON.stringify(defaultMacro));
            this.formatSelectZoneWaymarkPlaceData(this.selectZone);
            ElMessage.success("重置成功");
          });
        })
        .catch(() => {});
    },
    updateZone(): void {
      ElMessageBox.confirm("将所有地图的用户当前数据与自带数据取并集？这将恢复你曾经删除的默认数据", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          for (const key in this.data.zoneId) {
            this.data.zoneId[key] = Array.from(
              new Set([...defaultMacro.zoneId[key], ...this.data.zoneId[key]].map((v) => JSON.stringify(v))),
            ).map((v) => JSON.parse(v));
          }

          ElMessage.success("更新成功");
        })
        .catch(() => {});
    },
  },
});
export function cleanMacro(text: string): string {
  text = text.replaceAll(/\n{2,}/gm, "\n");
  text = text.replaceAll(/^\s+/gm, "");
  text = text.replaceAll(/ /gm, `\xa0`);
  return text;
}
export function getZoneIDByZoneName(ZoneName: string) {
  for (const zoneId in zoneInfo) {
    const zone = zoneInfo[zoneId];
    for (const lang in zone.name) {
      const zoneName = zone.name[lang as keyof typeof zone.name];
      if (zoneName?.toUpperCase() === ZoneName.toUpperCase() || zoneName === ZoneName.replaceAll(/[\(\)]/gi, "")) {
        return zoneId;
      }
    }
  }
}

async function macroCommand(text: string, channel: "e" | "p") {
  if (channel === "p" && partyLen === 0) doTextCommand("/e 单人时无法发送小队宏<se.3>");
  const macros = text.replaceAll(/^\s*\/[pe]\s/gm, "").split("\n");
  const queue = macros.map((m) => {
    return { c: "DoTextCommand" as PostNamazuCall, p: `/${channel} ` + m, d: 125 };
  });
  doQueueActions(queue);
  ElMessage.success("已发送");
}
