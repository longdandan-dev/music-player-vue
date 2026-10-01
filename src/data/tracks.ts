const AUDIO_BASE = import.meta.env.BASE_URL

export interface Track {
    id:string
    title:string
    artist:string
    album:string
    mood:string
    duration:number
    src:string
    c1:string
    c2:string
}

export const tracks:Track[]=[

    {
        id:'t1',
        title:'凌晨四点的代码',
        artist:'深夜电台',
        album:'代码之夜',
        mood:'lo-fi',
        duration:35.89,
        src:`${AUDIO_BASE}audio/01-lingchen.wav`,
        c1:'#3b6df5',
        c2:'#8b5cf6',
    },

    {
        id:'t2',
        title:'深圳湾的风',
        artist:'海风组合',
        album:'南方海岸',
        mood:'民谣',
        duration:31.6,
        src:`${AUDIO_BASE}audio/02-shenzhenwan.wav`,
        c1:'#0ea5e9',
        c2:'#22d3ee',
    },

    {
        id:'t3',
        title:'海边的信号塔',
        artist:'海风组合',
        album:'南方海岸',
        mood:'city pop',
        duration:27.78,
        src:`${AUDIO_BASE}audio/03-xinhaota.wav`,
        c1:'#f472b6',
        c2:'#fb923c',
    },

    {
        id:'t4',
        title:'像素心跳',
        artist:'八比特工坊',
        album:'像素时代',
        mood:'8-bit',
        duration:24.1,
        src:`${AUDIO_BASE}audio/04-xiangsu.wav`,
        c1:'#22c55e',
        c2:'#a3e635',
    },

    {
        id:'t5',
        title:'雨停之后',
        artist:'木子',
        album:'雨与钢琴',
        mood:'钢琴',
        duration:28.27,
        src:`${AUDIO_BASE}audio/05-yuting.wav`,
        c1:'#6366f1',
        c2:'#38bdf8',
    },

    {
        id:'t6',
        title:'前进吧，前端',
        artist:'木子',
        album:'出发',
        mood:'流行',
        duration:25.21,
        src:`${AUDIO_BASE}audio/06-qianjin.wav`,
        c1:'#f59e0b',
        c2:'#ef4444',
    },

    {
        id:'t7',
        title:'错误音频',
        artist:'木子',
        album:'出发',
        mood:'流行',
        duration:25.21,
        src:`${AUDIO_BASE}audio/07-broken.wav`,
        c1:'#f59e0b',
        c2:'#ef4444',
    },
]
