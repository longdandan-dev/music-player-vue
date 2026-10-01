import { tracks } from "@/data/tracks";
import {defineStore } from "pinia";
import { computed, ref } from "vue";
import { formatTime } from "@/utils/format";

export const usePlayerStore = defineStore('player',()=>{
    type LoopMode = 'list' | 'single' | 'none'
    
    const currentId = ref<string |  null>(null)
    const isPlaying = ref(false)
    const audio = ref<HTMLAudioElement | null>(null)
    const LOOP_MODES:Record<LoopMode, {text:string; next: LoopMode}>={
        list: { text:'列表循环', next:'single'},
        single: { text:'单曲循环', next:'none'},
        none: { text:'顺序播放', next:'list'},
    }
    const currentTime = ref(0)
    const duration = ref(0)
    let isSeeking = false
    const volume = ref(1)
    const muted =ref(false)

    const loopMode = ref<LoopMode>('list')
    const loopText = computed(()=> LOOP_MODES[loopMode.value].text)
    function cycleLoopMode(){loopMode.value = LOOP_MODES[loopMode.value].next}

    const currentTrack = computed(()=>tracks.find((t)=>t.id===currentId.value) ?? null)
    const currentIndex = computed(()=>tracks.findIndex((t)=> t.id===currentId.value))
    const currentTimeText = computed(()=>formatTime(currentTime.value))
    const durationText = computed(()=>formatTime(duration.value))
    const progressPercent = computed(()=>currentTime.value / duration.value *100 || 0)
    const isMuted = computed(()=> muted.value || volume.value=== 0 )


    function selectTrack(id:string){
        currentId.value = id
        const t = currentTrack.value
        if(!audio.value || !t)return 
        audio.value.src = t.src
        currentTime.value = 0
        duration.value = 0
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
    function playPrev(){
        if(audio.value === null) return 
        else if(audio.value.currentTime > 3 ) 
            {audio.value.currentTime = 0 ;
                return}
        const currentPrev = (currentIndex.value - 1 + tracks.length ) % tracks.length
        const t = tracks[currentPrev]
        if(!t)return
        selectTrack(t.id)
    }
    function playNext(){

        const currentNext = (currentIndex.value + 1 + tracks.length) % tracks.length
        const t = tracks[currentNext]
        if(!t)return
        selectTrack(t.id)
    }
    function onEnded(){
        if(loopMode.value === 'single'){
            if(!audio.value) return
            audio.value.currentTime = 0;
            audio.value.play().catch(()=>{})
            return
        }
        if(loopMode.value === 'none' && currentIndex.value === tracks.length - 1){
            return
        }

        playNext()
    }
    function onTimeUpdate(){
        if(audio.value === null) return
        if(isSeeking === true) return
        currentTime.value = audio.value.currentTime
    }
    function onLoadedMetadata(){
        if(audio.value === null) return
        duration.value = audio.value.duration
    }
    function seekTo(percent:number){
        if(audio.value === null ) return
        const d = audio.value.duration
        if(!Number.isFinite(d))return
        audio.value.currentTime = (percent / 100) * d
    }
    function onSeek(e: Event){
        const el = e.target as HTMLInputElement
        if(!el)return 
        seekTo(Number(el.value))
        isSeeking  = false
    }
    function onSeekStart(e:Event){
        const el = e.target as HTMLInputElement
        if(!el)return
        isSeeking = true
        currentTime.value = ( Number(el.value) / 100)*duration.value
    }
    function onVolumeChange(){
        if(audio.value === null) return
        volume.value = audio.value.volume
        muted.value = audio.value.muted
    }
    function setVolume(v:number){
        if(!audio.value) return
        audio.value.volume = v
        audio.value.muted = v === 0
    }
    function toggleMute(){
    if(!audio.value) return
    audio.value.muted = !audio.value.muted
    if( audio.value.volume === 0  && !audio.value.muted){
        audio.value.volume = 0.5
    }
    }
    function onVolumeInput(e: Event){
        const el = e.target as HTMLInputElement
        if(!el)return 
        setVolume(Number(el.value))
    }
    return {currentId,isPlaying,currentTrack,currentIndex,
        selectTrack,togglePlay,bindAudio,onPlay,onPause,
        playPrev,playNext,onEnded,loopMode,loopText,cycleLoopMode,
        onTimeUpdate,onLoadedMetadata,currentTime,duration,durationText,currentTimeText,
        progressPercent,seekTo,onSeek,onSeekStart,onVolumeChange,volume,muted,
        setVolume,toggleMute,isMuted,onVolumeInput
    }
})