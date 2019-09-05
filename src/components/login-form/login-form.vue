<template>
    <Form ref="loginForm" :model="form" :rules="rules" @keydown.enter.native="handleSubmit">
        <FormItem prop="userName">
            <Input v-model="form.userName" placeholder="请输入用户名">
        <span slot="prepend">
          <Icon :size="16" type="ios-person"></Icon>
        </span>
            </Input>
        </FormItem>
        <FormItem prop="password">
            <Input type="password" v-model="form.password" placeholder="请输入密码">
        <span slot="prepend">
          <Icon :size="14" type="md-lock"></Icon>
        </span>
            </Input>
        </FormItem>
        <FormItem>
            <Button @click="handleSubmit" type="primary" long>登录</Button>
        </FormItem>
    </Form>
</template>
<script>
  import {api} from '@/api/api';
  import { apiRequest } from '@/api/http'
  import { setToken,setTokens,setTokenr,setTokena} from '@/libs/util'
  import Vuex from 'vuex'
  import Cookies from 'js-cookie'

  export default {
    name: 'LoginForm',
    props: {
      userNameRules: {
        type: Array,
        default: () => {
          return [
            { required: true, message: '账号不能为空', trigger: 'blur' }
          ]
        }
      },
      passwordRules: {
        type: Array,
        default: () => {
          return [
            { required: true, message: '密码不能为空', trigger: 'blur' }
          ]
        }
      }
    },
    data () {
      return {
        form: {
          userName: '',
          password: ''
        }
      }
    },
    computed: {
      rules () {
        return {
          userName: this.userNameRules,
          password: this.passwordRules,
        }
      }
    },
    methods: {
      handleSubmit () {
        apiRequest(api.User.login, {
          username: this.form.userName.trim(),
          password: this.form.password.trim(),
        }, ret => {
          console.log(ret)
          const token = ret.token
          setToken(token)

          //写入路由权限参数access
          const access = ret.access
          setTokens(access)

          //写入权限参数
          const role = ret.role
          setTokenr(role)

          //写入管理员id
          const admin_id = ret.person
          setTokena(admin_id)

          //跳转
          this.$router.push({name:'home'})
        })
      }
    }
  }
</script>
