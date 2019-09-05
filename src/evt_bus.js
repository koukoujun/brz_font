import Vue from 'vue'
import router from '@/router/index'
import { setToken } from '@/libs/util'

const EventBus = new Vue()

export default EventBus
//监听token失效
EventBus.$on('token_invalid', (num, deg) => {
  setToken('')
  router.go({ name: 'login' })
})

