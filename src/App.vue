<script setup lang="ts">
import { onMounted,ref } from 'vue';
import TrackList from './components/TrackList.vue';
import { tracks } from './data/tracks';
import { usePlayerStore } from './stores/player';
import PlayerPanel from './components/PlayerPanel.vue';


const player = usePlayerStore()
const audioRef = ref<HTMLAudioElement | null>(null)

onMounted(()=>{
  if(audioRef.value)player.bindAudio(audioRef.value)
})
</script>

<template>
  <h1>听风播放器（Vue 版）</h1>
  <p class="list-count">共{{ tracks.length }}首</p>
  <PlayerPanel/>
  <TrackList :tracks="tracks" />
  <audio
  ref="audioRef"
  preload="metadata"
  @play="player.onPlay()"
  @pause="player.onPause()"
  @ended="player.onEnded()"
  @timeupdate="player.onTimeUpdate()"
  @loadedmetadata="player.onLoadedMetadata()"
  @volumechange="player.onVolumeChange()"
  />
</template>

