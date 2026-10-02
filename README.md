# 听风播放器（Vue 3 + TypeScript）

用 Vue 3 + TypeScript 重写的音乐播放器。

分两个页签：**播放器**（列表、搜索、收藏）和**我的仓库**（接口页，带三态）。

## 功能

### 播放器

- 歌单列表：7 首，显示序号、封面、歌名、歌手·专辑、时长
- 点歌曲行播放；当前播放的行高亮
- 播放 / 暂停（状态由 `<audio>` 的事件回写）
- 上一首 / 下一首：播过 3 秒按"上一首"回到本首开头，否则真换歌
- 循环模式：列表循环 / 单曲循环 / 顺序播放
- 进度条：显示已播比例、可拖动跳转、显示 `已播 / 总时长`
- 音量条 + 静音按钮
- 搜索：按歌名或歌手过滤，忽略大小写
- 搜不到时显示空状态，并回显搜索词
- 收藏：每行一个爱心，可点亮 / 取消
- 只看收藏：勾选后只显示已收藏的歌
- 收藏写入 `localStorage`，**刷新不丢**
- 三档适配：1440 / 820 / 375 均无横向滚动（窄屏隐藏序号与歌手·专辑）

### 我的仓库

- 用 axios 拉取 GitHub 仓库列表
- 三态齐全：加载中 / 请求失败 / 空结果
- 响应拦截器统一归类错误：`timeout` / `http` / `network`

## 技术栈

| 用了什么 | 为什么用它 |
| --- | --- |
| Vue 3 `<script setup>` | 组合式 API，逻辑按功能成块，不用拆到 `data` / `methods` 里 |
| Pinia | 收藏、当前歌曲、播放状态要被多个组件共用；放 store 后组件直接取，不用层层传 props |
| TypeScript | 拦住类型不匹配、字段名写错、对象形状不对 |
| axios + 拦截器 | 错误分类只写一处；组件只认 `e.kind` / `e.status`，不直接依赖 HTTP 库 |
| Vite | 开发服务器（热更新）+ 打包 |

## 运行

```sh
npm install
npm run dev        # 开发，默认 http://localhost:5173
npm run build      # 类型检查 + 打包
npm run type-check # 只做类型检查
```

## 目录结构

```
src/
  main.ts            入口：挂载 App、装 Pinia、引入全局样式
  App.vue            根组件：页签切换、搜索、只看收藏、接口页三态
  base.css           设计令牌 + 全局样式 + 断点
  components/
    TrackList.vue    列表容器
    TrackRow.vue     单行：点播、爱心
    PlayerPanel.vue  播放器面板：进度、时间、音量、控制按钮
  stores/
    player.ts        播放状态 + 收藏 + 持久化
  data/
    tracks.ts        静态歌单数据 + Track 类型
  utils/
    format.ts        秒数 → m:ss
    github.ts        拉取仓库列表
    http.ts          axios 实例 + 响应拦截器 + 类型守卫
```

依赖方向：`main → App → components → stores → data / utils`。
只能往下依赖，不能反过来（避免循环依赖）。
