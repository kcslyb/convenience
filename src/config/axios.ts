import * as axios from 'axios'
import { AxiosResponse, AxiosRequestConfig } from 'axios'
import EncryptHelper from 'kcs-common/utils/encryption-util'
import { removeToken } from './auth'
import { Notify } from 'vant'

const http = axios.default.create({
  baseURL: '/api',
  timeout: 15000
})
// request拦截器
http.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    // 对请求方式为post，put的请求进行加密
    if (config.method === 'post' || config.method === 'put') {
      console.info(config.data)
      config.data = EncryptHelper.aesEncrypt(JSON.stringify(config.data))
    }
    config.headers = { 'Content-Type': 'application/json;charset=utf-8' }
    return config
  },
  (error: any) => {
    Notify({ type: 'danger', message: '加载超时' })
    return Promise.reject(error)
  }
)
// response拦截器
http.interceptors.response.use(
  (response: AxiosResponse) => {
    // 对进行加密过的string进行解密
    if (response.data && typeof (response.data) === 'string') {
      response.data = EncryptHelper.aesDecrypt(response.data)
    }
    return response
  },
  (error: any) => {
    let isDecrypt: boolean = error.response && error.response.data && typeof (error.response.data) === 'string'
    let msg: string = error.message
    if (isDecrypt) {
      try {
        msg = EncryptHelper.aesDecrypt(error.response.data)
      } catch (e) {
        msg = error.response.data
      }
    }
    console.info(msg)
    Notify({ type: 'danger', message: msg })
    const flag = '/api/login'.indexOf(error.response.config.url) > -1
    if (error.response.status === 401 && !flag) {
      removeToken()
      location.reload()
    }
    return Promise.reject(error)
  }
)
export default http
