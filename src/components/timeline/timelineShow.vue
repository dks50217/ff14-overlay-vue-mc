<template>
  <ul v-if="lines.length" class="loadedTimelines" :style="showStyle">
    <li
      v-for="(item, index) in props.lines"
      :key="index"
      v-show="
        item.show &&
        item.time - runtime > 0 - config.hold - showStyle['--tras-duration'] &&
        item.time - runtime <= config.displayDuration
      "
      :class="{
        upcoming: item.time - runtime <= config.discoloration,
        fade: item.time - runtime <= 0 - config.hold,
        passed: item.time - runtime <= 0,
      }">
      <aside :style="{ right: Math.max((item.time - runtime) / config.displayDuration, 0) * 100 + '%' }"></aside>
      <section>
        <span v-html="item.actionHTML"></span
        ><span style="padding: 0px 1px">{{ (item.time - runtime).toFixed(1) }} </span>
      </section>
    </li>
  </ul>
</template>

<script lang="ts" setup>
import { ITimelineLine, ShowStyle, TimelineConfigValues } from "@/types/Timeline";

const props = defineProps<{
  config: TimelineConfigValues;
  lines: ITimelineLine[];
  runtime: number;
  showStyle: ShowStyle;
}>();
</script>
<style lang="scss">
::-webkit-scrollbar {
  display: none !important;
}
</style>
<style lang="scss" scoped>
* {
  overflow: hidden;
  box-sizing: border-box;
}
$timelineWitdh: 180;
$fontSize: 18;
$opacity: 0.33;
$normalScale: 0.5;
$upComingScale: 1;
$trasDuration: 1;
.loadedTimelines {
  width: calc(1px * var(--timeline-width, $timelineWitdh));
  list-style-type: none;
  color: white;
  text-shadow: -1px 0 1px #000, 0 1px 1px #000, 1px 0 1px #000, 0 -1px 1px #000;
  font-family: "Microsoft Yahei UI";
  margin: 0em;
  padding: 0em 0.5em;
  li {
    overflow: hidden;
    background-color: rgb(20, 22, 25);
    margin-bottom: 1px;
    border: 1px solid #000;
    box-sizing: border-box;
    position: relative;
    opacity: var(--opacity, $opacity);
    transition-duration: calc(var(--tras-duration, $trasDuration) * 1s);
    height: calc(48px * var(--normal-scale, $normalScale));
    &.fade {
      animation: myfade calc(var(--tras-duration, $trasDuration) * 1s) 1 forwards !important;
      height: calc(48px * var(--up-coming-scale, $upComingScale));
    }
    @keyframes myfade {
      0% {
        opacity: 1;
        height: calc(48px * var(--up-coming-scale, $upComingScale));
      }
      50% {
        opacity: 0;
        height: calc(48px * var(--up-coming-scale, $upComingScale));
      }
      100% {
        height: 0px;
        opacity: 0;
      }
    }
    &.passed {
      // > aside {
      > * {
        animation: passed 0.34s 2 alternate;
      }
      // }
      @keyframes passed {
        0% {
          filter: drop-shadow(0px 0px 0px black);
        }
        100% {
          filter: drop-shadow(1px 2px 3px black);
        }
      }
    }
    &.upcoming {
      font-family: "SmartisanHei", "微软雅黑";
      opacity: 1;
      font-weight: bold;
      transition-property: all;
      transition-duration: calc(var(--tras-duration, $trasDuration) * 1s);
      transition-timing-function: ease;
      height: calc(48px * var(--up-coming-scale, $upComingScale));
      aside {
        background-color: rgb(255, 136, 136);
      }
      :deep(span) {
        font-size: calc(var(--font-size, $fontSize) * var(--up-coming-scale, $upComingScale) * 1px) !important;
      }
      span :deep(.skill_icon) {
        transition-property: all;
        transition-duration: calc(var(--tras-duration, $trasDuration) * 1s);
        transition-timing-function: ease;
        width: calc(48px * var(--up-coming-scale, $upComingScale));
        height: calc(48px * var(--up-coming-scale, $upComingScale));
        img {
          transition-property: all;
          transition-duration: calc(var(--tras-duration, $trasDuration) * 1s);
          transition-timing-function: ease;
          width: calc(40px * var(--up-coming-scale, $upComingScale));
          height: calc(40px * var(--up-coming-scale, $upComingScale));
          top: calc(4px * var(--up-coming-scale, $upComingScale));
          left: calc(4px * var(--up-coming-scale, $upComingScale));
        }
        &::after {
          transition-property: all;
          transition-duration: calc(var(--tras-duration, $trasDuration) * 1s);
          transition-timing-function: ease;
          width: calc(48px * var(--up-coming-scale, $upComingScale));
          height: calc(48px * var(--up-coming-scale, $upComingScale));
        }
      }
    }
    > aside {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: #88f;
    }
    section {
      height: 100%;
      position: relative;
      padding: 0 2px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: calc(calc(var(--font-size, $fontSize) * 1px) * var(--normal-scale, $normalScale));
      // font-size: calc(calc(var(--font-size, $fontSize) * 1px));
      > span {
        display: flex;
        align-items: center;
        overflow: hidden;
        &:first-of-type {
          flex: 1;
        }
        > :deep(span) {
          // white-space: nowrap;
          text-overflow: ellipsis;
          overflow: hidden;
          flex: 1;
        }
      }
      > :deep(div) {
        width: calc(40px * var(--up-coming-scale, 1));
        height: calc(40px * var(--up-coming-scale, 1));
        top: calc(4px * var(--up-coming-scale, 1));
      }
      span :deep(.skill_icon) {
        position: relative;
        top: 0px;
        left: calc(-4px * var(--normal-scale, $normalScale));
        width: calc(48px * var(--normal-scale, $normalScale));
        height: calc(48px * var(--normal-scale, $normalScale));
        img {
          display: inline-block;
          position: absolute;
          width: calc(40px * var(--normal-scale, $normalScale));
          height: calc(40px * var(--normal-scale, $normalScale));
          top: calc(4px * var(--normal-scale, $normalScale));
          left: calc(4px * var(--normal-scale, $normalScale));
          z-index: 1;
        }
        &::after {
          content: "";
          background: url(@/assets/frame.png) no-repeat;
          background-size: cover;
          width: calc(48px * var(--normal-scale, $normalScale));
          height: calc(48px * var(--normal-scale, $normalScale));
          display: inline-block;
          position: absolute;
          z-index: 2;
        }
      }
    }
  }
}
</style>
