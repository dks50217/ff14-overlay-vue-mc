import Swal from "sweetalert2";
import { createRouter, createWebHashHistory, createWebHistory } from "vue-router";
import routes from "~pages";
const router = createRouter({
  history: createWebHashHistory(),
  // history: createWebHistory(),
  routes,
});
// router.beforeResolve((to, from) => {
//   if (to.name === "index") Swal.close();
//   return true;
// });
const routeTitles = new Map(
  Object.entries({
    "index": "首頁",
    "timeline": "時間軸",
    "timeline-settings": "時間軸編輯",
    "instancedAreaInfo": "副本區資訊",
    "stageProgramme": "舞臺節目單",
    "dsrp6": "絕龍詩P6",
    "obs": "obs自動錄製",
    "zoneMacro": "副本宏",
    "fflogsUploaderDownload": "今天FFLogsUploader更新了嗎？",
  }),
);
router.getRoutes().forEach((route) => (route.meta.title = routeTitles.get(route.name?.toString() ?? "")));
router.afterEach((to, from) => {
  document.title = to.meta.title?.toString() ?? "頁面";
  // if (from.name === "index" && to.name === "index") Swal.close();
  // if (from.name === "index" && to.name === "zoneMacro") location.reload();
});

export default router;
