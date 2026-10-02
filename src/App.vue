<script setup lang="ts">
import { onMounted,ref,computed } from 'vue';
import TrackList from './components/TrackList.vue';
import { tracks } from './data/tracks';
import { usePlayerStore } from './stores/player';
import PlayerPanel from './components/PlayerPanel.vue';
import { fetchRepos } from './utils/github.ts';
import type { Repo } from './utils/github.ts';
import { isRequestError } from '@/utils/http';

const repos = ref<Repo[]>([])
const loading = ref(false)
const err = ref('')
const player = usePlayerStore()
const audioRef = ref<HTMLAudioElement | null>(null)
const keyword = ref('')
const onlyFav = ref(false)
const activeTab = ref<'player' | 'repos'>('player')
const filteredTracks = computed(()=> {
  const  a = tracks.filter((track)=>{
    if(onlyFav.value && !player.favIds.includes(track.id))
    return false
    if(track.title.toLowerCase().includes(keyword.value.toLowerCase()) || 
      track.artist.toLowerCase().includes(keyword.value.toLowerCase())){
      return true 
    }
    return false
  })
  return a 
  
})

async function load(){
  loading.value = true
  err.value = ''
  repos.value = []
  try{
    repos.value = await fetchRepos()
  }catch(e){
    if (!isRequestError(e)) {
      err.value = '出了点问题，请稍后再试'
    } else if (e.kind === 'timeout') {
      err.value = '请求超时了，检查网络之后再试试'
    } else if (e.kind === 'network') {
      err.value = '连接不上服务器，检查网络之后再试试'
    } else if (e.kind === 'http') {
      err.value = `服务器返回 ${e.status}，请稍后再试`
    } else {
      err.value = '出了点问题，请稍后再试'
    }
  }finally{

    loading.value = false
  }
}

onMounted(()=>{
  if (audioRef.value) player.bindAudio(audioRef.value) 
  load()
})
</script>

<template>
  <!-- 页签条：两个按钮，靠 activeTab 高亮 -->
  <nav class="tabs">
    <button
      type="button"
      :class="{ active: activeTab === 'player' }"
      @click="activeTab = 'player'"
    >播放器</button>
    <button
      type="button"
      :class="{ active: activeTab === 'repos' }"
      @click="activeTab = 'repos'"
    >我的仓库（{{ repos.length }}）</button>
  </nav>

  <!-- 第一页：播放器（切换时它会被卸载，但 <audio> 在下面，不会被卸载） -->
  <section v-if="activeTab === 'player'">
    <div class="toolbar">
      <input class="search" v-model="keyword" placeholder="搜歌手/歌名">
      <label class="only-fav">
        <input type="checkbox" v-model="onlyFav" /> 我的收藏
      </label>
    </div>
    <p class="list-count">共{{ filteredTracks.length }}首</p>
    <TrackList v-if="filteredTracks.length > 0" :tracks="filteredTracks" />
    <p v-else class="empty">搜索「{{ keyword }}」没有结果，换个词试试？</p>
    <PlayerPanel />
  </section>

  <!-- 第二页：我的仓库 -->
  <section v-else>
    <p v-if="loading" class="state">加载中…</p>
    <p v-else-if="err" class="state-error">{{ err }}</p>
    <p v-else-if="repos.length === 0" class="state">这个账号还没有仓库</p>
    <ul v-else class="repo-list">
      <li v-for="repo in repos" :key="repo.name" class="repo">
        <a :href="repo.html_url" target="_blank" rel="noopener">{{ repo.name }}</a>
        <span class="stars">★ {{ repo.stargazers_count }}</span>
        <p class="desc">{{ repo.description || '还没有写描述' }}</p>
      </li>
    </ul>
  </section>

  <!-- ⚠️ <audio> 放在两个页签【外面】：切页签时它不会被卸载，歌照放 -->
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

<style scoped>
.search {
  padding: 6px 10px;       
  border: 1px solid #cbd5e1;
  border-radius: 6px;      
  width: 220px;            
}
.empty {
  padding: 20px 0;           
  text-align: center;         
  color: #64748b;            
  font-size: 14px;          
}
.only-fav {
  margin-left: 12px;   /* 和搜索框拉开距离 */
  cursor: pointer;     /* 鼠标变手型 */
  font-size: 14px;
}
.tabs {
  display: flex;              /* 两个按钮并排 */
  gap: 8px;                   /* 按钮之间留 8px（4 的倍数） */
  margin-bottom: 12px;
  border-bottom: 1px solid var(--line);
}
.tabs button {
  padding: 8px 14px;
  border: none;
  background: none;
  cursor: pointer;
  font-size: 15px;
  color: var(--muted);                 /* 没选中：灰 */
  border-bottom: 2px solid transparent; /* 预留一条底线，选中时点亮，避免跳动 */
}
.tabs button.active {
  color: var(--brand);                 /* 选中：主色 */
  border-bottom-color: var(--brand);   /* 底下的线跟着亮 —— 视觉母题 */
}
</style>

