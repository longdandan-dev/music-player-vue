<script setup lang="ts">
import type { Track } from '@/data/tracks';
import TrackRow from './TrackRow.vue';

interface Props{
    tracks:Track[]
}
const props = defineProps<Props>()
</script>

<template>
    <ul class="track-list">
        <TrackRow 
        v-for="(track,i) in props.tracks"
        :key="track.id"
        :track="track"
        :index="i"
        />
    </ul>
</template>