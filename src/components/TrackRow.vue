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
  width: 44px;
  height: 44px;
  flex-shrink: 0;
  border-radius: 50%;
  color: var(--on-accent);
  font-size: var(--fs-lg);
  font-weight: 700;
  background: linear-gradient(135deg, var(--c1), var(--c2));
  box-shadow: var(--shadow-cover);
  transition: transform 0.2s ease;
}
.track:hover { background: var(--panel-2); }
.track:hover .track-cover { transform: scale(1.06); }
.track.playing .track-title { color: var(--accent-light); }

.fav {
  margin-left: var(--sp-2);
  padding: 0 var(--sp-1);
  color: var(--text-dim);
  font-size: var(--fs-lg);
  line-height: 1;
}
.fav:hover { color: var(--accent); }
</style>