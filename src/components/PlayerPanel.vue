<script setup lang="ts">
import { usePlayerStore } from '@/stores/player'; 
const player = usePlayerStore()
</script>

<template>
    <section class="player">
        <p class="now-title">{{ player.currentTrack? player.currentTrack.title : '还没选歌' }}</p>
        <button class="ctrl" type="button" @click="player.togglePlay()">{{player.isPlaying ? '暂停' : '播放' }}</button>
    </section>
</template>

<style>
.player{margin: 12px 0;}
.now-title{font-weight: 700;}
.ctrl{padding: 6px 14px; cursor: pointer;}
</style>