<script setup lang="ts">
import type { Track } from '@/data/tracks';
import { formatTime } from '@/utils/format';
import { usePlayerStore } from '@/stores/player';

interface Props{
    track:Track
    index:number
}
const props = defineProps<Props>()
const player = usePlayerStore()

</script>
<template>
    <li class="track" :class="{playing:player.currentId === props.track.id}"
    @click="player.selectTrack(props.track.id)">
    <span class="track-index">{{props.index + 1 }}</span>
    <span class="track-cover" :style="{'--c1':props.track.c1,'--c2':props.track.c2}">{{ props.track.title.slice(0,1) }}</span>
    <span class="track-title">{{ props.track.title }}</span>
    <span class="track-meta">{{ props.track.artist }} · {{ props.track.album }}</span>
    <span class="track-duration">{{ formatTime(props.track.duration) }}</span>
    <button class="fav" type="button" @click.stop="player.toggleFav(props.track.id)">
        {{ player.favIds.includes(props.track.id) ? '♥' : '♡' }}</button>
    </li>
</template>
<style scoped>
.track-cover { 
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 6px;
  color: #fff;
  font-weight: 700;
  background: linear-gradient(135deg, var(--c1), var(--c2));
}
.track{cursor: pointer;}
.track.playing{font-weight:700}
.fav {
  margin-left: 8px;      /* 和前面的信息拉开一点 */
  border: none;          /* 去掉按钮默认边框 */
  background: none;      /* 去掉按钮默认底色 */
  cursor: pointer;       /* 鼠标变手型 */
  font-size: 16px;       /* 图标大一号，好点 */
}
</style>