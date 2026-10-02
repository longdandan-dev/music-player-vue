import axios from 'axios'

// 统一的 baseURL：所有请求都从这儿出发，改一处全生效
const BASE_URL = 'https://api.github.com'

const http = axios.create({
  baseURL: BASE_URL,
  timeout: 8000,          // 8 秒还没回来就算超时
})

// 响应拦截器：把三种失败"翻译"成一种好用的形状
http.interceptors.response.use(
  (response) => response,          // 成功：原样放行
  (error) => {
    let kind: 'timeout' | 'http' | 'network' | 'unknown' = 'unknown'
    let status = 0

    if (error.code === 'ECONNABORTED') {
      kind = 'timeout'
    } else if (error.response) {
      kind = 'http'
      status = error.response.status
    } else if (error.request) {
      kind = 'network'
    }

    // 把归类结果挂回 error 上
    error.kind = kind
    error.status = status
    return Promise.reject(error)   // 必须 reject，不能 return
  },
)

// 请求错误的"形状"
export interface RequestError {
  kind: 'timeout' | 'http' | 'network' | 'unknown'
  status: number
}

// 类型守卫
export function isRequestError(e: unknown): e is RequestError {
  return typeof e === 'object' && e !== null && 'kind' in e
}

export default http