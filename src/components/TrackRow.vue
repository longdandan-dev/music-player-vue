<script setup lang="ts">
import type { Track } from '@/data/tracks';
import { formatTime } from '@/utils/format';

interface Props{
    track:Track
    index:number
}
const props = defineProps<Props>()
</script>
<template>
    <li class="track">
    <span class="track-index">{{props.index + 1 }}</span>
    <span class="track-cover" :style="{'--c1':props.track.c1,'--c2':props.track.c2}">{{ props.track.title.slice(0,1) }}</span>
    <span class="track-title">{{ props.track.title }}</span>
    <span class="track-meta">{{ props.track.artist }} · {{ props.track.album }}</span>
    <span class="track-duration">{{ formatTime(props.track.duration) }}</span>
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
</style>