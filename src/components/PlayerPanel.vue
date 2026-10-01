<script setup lang="ts">
import { usePlayerStore } from '@/stores/player'; 
const player = usePlayerStore()
</script>

<template>
    <section class="player">
        <p class="now-title">{{ player.currentTrack? player.currentTrack.title : '还没选歌' }}</p>
        <div class="progress">
            <div class="progress-fill" :style="{ width: player.progressPercent + '%'}"></div>
            <input class="seek" type="range" min="0" max="100" step="0.1"
            :value="player.progressPercent"
            @change="player.onSeek"
            @input="player.onSeekStart"
            >
        </div>
        <div class="volume-row">
            <button class="mute" type="button" @click="player.toggleMute()">{{ player.isMuted ? '取消静音' : '静音' }}</button>
            <input class="volume" type="range" min="0" max="1" step="0.01"
                :value="player.volume"
                @input="player.onVolumeInput"
                >
        </div>
        <p class="time">{{ player.currentTimeText }} / {{ player.durationText }}</p>
        <button class="ctrl" type="button" @click="player.cycleLoopMode()">{{ player.loopText }}</button>
        <button class="ctrl" type="button" @click="player.playPrev()">上一首</button>
        <button class="ctrl" type="button" @click="player.togglePlay()">{{player.isPlaying ? '暂停' : '播放' }}</button>
        <button class="ctrl" type="button" @click="player.playNext()">下一首</button>
    </section>
</template>

<style>
.player{margin: 12px 0;}
.now-title{font-weight: 700;}
.mute,.ctrl{padding: 6px 14px; cursor: pointer;}
.progress{ position: relative ;height: 6px; border-radius: 3px;background-color: #e5e7eb;}
.progress-fill{height: 100%;border-radius: 3px; background-color: #2563eb;}
.seek{
  position: absolute; inset: 0; width: 100%; height: 100%;
  margin: 0; opacity: 0; cursor: pointer;
}
.volume-row{display: flex; justify-content: center; gap: 10px;}
.volume{width: 120px;}
.mute{cursor: pointer;}
</style>