import { tracks } from "@/data/tracks";
import {defineStore } from "pinia";
import { computed, ref } from "vue";

export const usePlayerStore = defineStore('player',()=>{
    const currentId = ref<string |  null>(null)
    const isPlaying = ref(false)
    const audio = ref<HTMLAudioElement | null>(null)

    const currentTrack = computed(()=>tracks.find((t)=>t.id===currentId.value) ?? null)
    const currentIndex = computed(()=>tracks.findIndex((t)=> t.id===currentId.value))

    function selectTrack(id:string){
        currentId.value = id
        const t = currentTrack.value
        if(!audio.value || !t)return 
        audio.value.src = t.src
        audio.value.play().catch(()=>{})
    }

    function togglePlay(){
        if(!currentId.value) return
        if(audio.value ==null) return 
        else if (audio.value.paused === true) audio.value?.play().catch(()=>{})
        else audio.value?.pause()

    }
    function bindAudio(el:HTMLAudioElement){
        audio.value = el
    }
    function onPlay(){
        isPlaying.value=true
    }
    function onPause(){
        isPlaying.value=false
    }
    return {currentId,isPlaying,currentTrack,currentIndex,selectTrack,togglePlay,bindAudio,onPlay,onPause}
})