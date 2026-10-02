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
  <!-- 页签条-->
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

  <!-- 第一页：播放器（桌面两栏：左播放器 + 右列表；≤820px 自动堆叠成一列） -->
  <div v-if="activeTab === 'player'" class="player-page">
    <PlayerPanel />
    <section class="list-col">
      <div class="toolbar">
        <input class="search" v-model="keyword" placeholder="搜歌手/歌名">
        <label class="only-fav">
          <input type="checkbox" v-model="onlyFav" /> 我的收藏
        </label>
      </div>
      <p class="list-count">共{{ filteredTracks.length }}首</p>
      <TrackList v-if="filteredTracks.length > 0" :tracks="filteredTracks" />
      <p v-else class="empty">搜索「{{ keyword }}」没有结果，换个词试试？</p>
    </section>
  </div>

  <!-- 第二页：我的仓库 -->
  <section v-else class="repo-page">
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

  <!--  <audio> 放在两个页签【外面】：切页签时它不会被卸载，歌照放 -->
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
/* 页签：胶囊形，选中时描边点亮 + 浅主色底（沿用 v1 的 .tab） */
.tabs {
  display: flex;
  flex-wrap: wrap;
  gap: var(--sp-2);
  margin-bottom: var(--sp-4);
}
.tabs button {
  padding: var(--sp-2) var(--sp-4);
  border: 1px solid var(--border);
  border-radius: 999px;
  background: transparent;
  color: var(--text-2);
  font-size: var(--fs-sm);
}
.tabs button:hover {
  border-color: var(--accent);
  color: var(--accent-light);
}
.tabs button:active { transform: scale(0.94); }
.tabs button.active {
  border-color: var(--accent);
  background: var(--accent-soft);
  color: var(--accent-light);
}

/* 播放器页：桌面两栏（左播放器 + 右列表），≤820px 收成一列 */
.player-page {
  display: grid;
  grid-template-columns: 320px 1fr;
  gap: var(--sp-4);
  align-items: start;
}
/* grid 子项默认 min-width:auto，长内容会把布局撑破 —— 归零后省略号才生效 */
.list-col { min-width: 0; }
@media (max-width: 820px) {
  .player-page { grid-template-columns: 1fr; }
}

/* 搜索框 */
.search {
  width: 100%;
  max-width: 320px;
  padding: var(--sp-3);
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  background: var(--panel-2);
  color: var(--text);
  font-size: var(--fs-sm);
}
.search::placeholder { color: var(--text-dim); }
.search:focus {
  border-color: var(--accent);
  outline: none;
}
</style>

