import Swal from "sweetalert2";
import "@sweetalert2/theme-bootstrap-4/bootstrap-4.scss";
export function pleaseUseACT(callback = () => {}) {
  Swal.fire("該頁面需要在ACT懸浮窗中新增才可正常工作哦").finally(() => callback());
}
