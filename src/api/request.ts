import axios, { AxiosInstance, AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/store/modules/user'
import { errorCodeWhiteUrlList } from './enum'
import { errorCodeType } from './helper/errorCodeType'

// 创建axios实例 进行基本参数配置
const service = axios.create({
  // 默认请求地址，根据环境的不同可在.env 文件中进行修改
  baseURL: import.meta.env.VITE_APP_BASE_API,
  // 设置接口访问超时时间
  timeout: 3000000, // request timeout，
  // 跨域时候允许携带凭证
  withCredentials: true,
})

//  request interceptor 接口请求拦截
service.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    /**
     * 用户登录之后获取服务端返回的token,后面每次请求都在请求头中带上token进行JWT校验
     * token 存储在本地储存中（storage）、vuex、pinia
     */
    const userStore = useUserStore()
    const token: string = userStore.token
    // 自定义请求头
    if (token) {
      config.headers['Authorization'] = token
    }
    return config
  },
  (error: AxiosError) => {
    // 请求错误，这里可以用全局提示框进行提示
    return Promise.reject(error)
  },
)

//  response interceptor 接口响应拦截
service.interceptors.response.use(
  (response: AxiosResponse) => {
    // 直接返回res，当然你也可以只返回res.data
    // 系统如果有自定义code也可以在这里处理
    // return response.data
    // 2xx 范围内的状态码都会触发该函数
    const data = response.data
    if (Object.prototype.toString.call(data) === '[object Blob]') {
      return data
    }
    if (data.code === 200) {
      return data
    } else {
      if (
        response.config.method == 'get' &&
        errorCodeWhiteUrlList.includes(response?.config?.url.split('?')[0])
      ) {
        return data
      } else if (
        response.config.method == 'post' &&
        errorCodeWhiteUrlList.includes(response?.config?.url)
      ) {
        // 自定义错误处理
        return data
      } else {
        // 统一错误处理
        showErrMessage(data.msg || data.message)
        return data
      }
    }
  },
  (error: AxiosError) => {
    const { response } = error
    if (response) {
      // 请求已发出，但是不在2xx的范围
      showErrMessage(errorCodeType(response.status)) // 传入响应码，匹配响应码对应信息
      return Promise.reject(response.data)
    } else {
      ElMessage.warning('网络连接异常,请稍后再试!')
    }
    return Promise.reject(error)
  },
)

/**
 * @description 显示错误消息
 * opt 传入参数
 * err 错误信息
 * type 消息类型
 * duration 消息持续时间
 */
function showErrMessage(err, type: any = 'error', duration = 3000) {
  ElMessage({
    message: err || '服务端异常',
    type: type,
    duration: duration,
  })
}

export default service
