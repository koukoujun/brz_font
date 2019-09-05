import axios from 'axios'
import config from '@/config'
import iView from 'iview'
import { getBaseUrl, getToken } from '@/libs/util'
import EventBus from '@/evt_bus'

/**
 * 自定义网络请求
 * @param apiName
 * @param arg2 参数或成功回调
 * @param arg3  当arg2为参数时此为成功回调
 * @param arg4 err func
 */
export function apiRequest (apiName, arg2, arg3, arg4) {

  iView.LoadingBar.start()
  const paramsData = typeof arg2 === 'object' ? arg2 : {}
  const succ = typeof arg3 === 'function' ? arg3 : arg2
  const onErr = typeof arg2 === 'object' ? arg4 : arg3
  const token = getToken()
  axios({
    url: apiName,
    method: 'post',
    baseURL: getBaseUrl(),
    headers: {
      'Content-Type': 'text/plain;charset=utf-8'//去除跨域访问如果值为application/json CORB警告
    },
    params: { token },
    data: paramsData,
    timeout: 10000,
  })
    .then(res => {
      iView.LoadingBar.finish()
      const ret = res.data
      const code = parseInt(ret.code)
      const msg = ret.msg
      const data = ret.data


      switch (code) {
        case 0:
          if (typeof onErr === 'function') {
            onErr(msg)
          } else {
            iView.Message.error(msg)
          }
          break
        case 1:
          if (typeof succ === 'function') {
            succ(data)
          } else {
            iView.Message.error('no success callback exist')
          }
          break
        case 1004:
          EventBus.$emit('token_invalid')
          break
        case 1005:
          iView.Message.error('权限不足，无法操作')
          break
        default:
          console.error(code)
          iView.Message.error('http api code does not handled [' + code + ' ]')
          break
      }

    })
    .catch(err => {
      console.error('axios', err)
    })
}
