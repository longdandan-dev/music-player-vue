<script setup lang="ts">
import TrackList from './components/TrackList.vue';
import { tracks } from './data/tracks';
</script>

<template>
  <h1>听风播放器（Vue 版）</h1>
  <p class="list-count">共{{ tracks.length }}首</p>

  <TrackList :tracks="tracks" />

</template>

