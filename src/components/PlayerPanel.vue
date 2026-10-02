<script setup lang="ts">
import { usePlayerStore } from '@/stores/player';
const player = usePlayerStore()
</script>

<template>
  <section class="player">
    <!-- 大圆形封面：颜色由数据驱动（c1 / c2），没选歌时用主色兜底 -->
    <div
      class="cover"
      :style="{ '--c1': player.currentTrack?.c1, '--c2': player.currentTrack?.c2 }"
    >{{ player.currentTrack ? player.currentTrack.title.slice(0, 1) : '♪' }}</div>

    <p class="now-title">{{ player.currentTrack ? player.currentTrack.title : '还没选歌' }}</p>
    <p class="now-artist">
      {{ player.currentTrack ? player.currentTrack.artist + ' · ' + player.currentTrack.album : '点下面的歌开始播放' }}
    </p>

    <div class="progress">
      <div class="progress-fill" :style="{ width: player.progressPercent + '%' }"></div>
      <input class="seek" type="range" min="0" max="100" step="0.1"
        :value="player.progressPercent"
        @change="player.onSeek"
        @input="player.onSeekStart"
      >
    </div>

    <p class="time">{{ player.currentTimeText }} / {{ player.durationText }}</p>

    <div class="volume-row">
      <button class="mute" type="button" @click="player.toggleMute()">{{ player.isMuted ? '取消静音' : '静音' }}</button>
      <input class="volume" type="range" min="0" max="1" step="0.01"
        :value="player.volume"
        @input="player.onVolumeInput"
      >
    </div>

    <div class="player-controls">
      <button class="ctrl-mode" type="button" @click="player.cycleLoopMode()">{{ player.loopText }}</button>
      <button class="icon-btn" type="button" title="上一首" aria-label="上一首" @click="player.playPrev()">◀</button>
      <button
        class="play-btn"
        :class="{ 'is-playing': player.isPlaying }"
        type="button"
        :title="player.isPlaying ? '暂停' : '播放'"
        :aria-label="player.isPlaying ? '暂停' : '播放'"
        @click="player.togglePlay()"
      >{{ player.isPlaying ? '❚❚' : '▶' }}</button>
      <button class="icon-btn" type="button" title="下一首" aria-label="下一首" @click="player.playNext()">▶</button>
    </div>
  </section>
</template>

<style>
/* 注意：这个组件没有 scoped，下面这些类名是全项目共享的 */
.player {
  display: flex;
  flex-direction: column;
  gap: var(--sp-3);
}

/* 桌面宽屏时让播放器跟着滚动停在视野里（窗口窄了就不 sticky，免得浮在列表上） */
@media (min-width: 821px) {
  .player {
    position: sticky;
    top: var(--sp-5);
  }
}

/* 大圆形封面 */
.cover {
  width: 150px;
  height: 150px;
  margin: 0 auto;
  border-radius: 50%;
  display: grid;
  place-items: center;
  font-size: 48px;
  font-weight: 700;
  color: var(--on-accent);
  background: linear-gradient(135deg, var(--c1, var(--accent)), var(--c2, var(--accent-2)));
  box-shadow: var(--shadow-cover);
}

.now-title {
  margin: 0;
  font-size: var(--fs-md);
  font-weight: 700;
  text-align: center;
}
.now-artist {
  margin: 0;
  font-size: var(--fs-sm);
  color: var(--text-dim);
  text-align: center;
}

/* 进度条 */
.progress {
  position: relative;
  height: 6px;
  border-radius: 999px;
  background: var(--border);
}
.progress-fill {
  height: 100%;
  border-radius: 999px;
  background: linear-gradient(90deg, var(--accent), var(--accent-2));
  transition: width 0.1s linear;
}
.seek {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  margin: 0;
  opacity: 0;
  cursor: pointer;
}

/* 时间 */
.time {
  margin: 0;
  text-align: center;
  color: var(--text-dim);
  font-size: var(--fs-sm);
  font-variant-numeric: tabular-nums;
}

/* 音量行 */
.volume-row {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--sp-3);
}
.mute {
  padding: var(--sp-2) var(--sp-4);
  border: 1px solid var(--border);
  border-radius: 999px;
  background: transparent;
  color: var(--text-2);
  font-size: var(--fs-sm);
}
.mute:hover { border-color: var(--accent); color: var(--accent-light); }
.mute:active { transform: scale(0.94); }
.volume { width: 120px; }

/* 控制键那一排 */
.player-controls {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: var(--sp-2);
}

/* 主控：圆形播放键 */
.play-btn {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  background: var(--accent);
  color: var(--on-accent);
  font-size: var(--fs-md);
}
.play-btn:hover { background: var(--accent-light); }
.play-btn:active { transform: scale(0.94); }
.play-btn.is-playing {
  background: var(--accent-deep);
  box-shadow: 0 0 0 4px var(--accent-ring);
}

/* 次控：圆形图标 */
.icon-btn {
  width: 40px;
  height: 40px;
  border: 1px solid var(--border);
  border-radius: 50%;
  background: transparent;
  color: var(--text-2);
  font-size: var(--fs-sm);
  display: grid;
  place-items: center;
}
.icon-btn:hover { border-color: var(--accent); color: var(--accent-light); }
.icon-btn:active { transform: scale(0.94); }

/* 循环模式：胶囊 + 文字 */
.ctrl-mode {
  height: 40px;
  padding: 0 var(--sp-4);
  border: 1px solid var(--border);
  border-radius: 999px;
  background: transparent;
  color: var(--text-2);
  font-size: var(--fs-sm);
}
.ctrl-mode:hover { border-color: var(--accent); color: var(--accent-light); }
.ctrl-mode:active { transform: scale(0.94); }
</style>
