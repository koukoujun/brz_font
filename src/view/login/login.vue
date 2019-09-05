<style lang="less">
    @import './login.less';
</style>

<template>
    <div class="login">
        <div class="login-con">
            <Card icon="log-in" title="" :bordered="false">
                <div class="form-con">
                    <login-form  @on-success-valid="handleSubmit"></login-form>
                    <p class="login-tip">输入用户名和密码</p>
                </div>
            </Card>
        </div>
    </div>
</template>

<script>
  import LoginForm from '_c/login-form'
  import { apiList, apiRequest } from '@/api/http'

  export default {
    components: {
      LoginForm
    },
    methods: {
      handleSubmit ({ userName, password }) {

      }
    }
  }
</script>

<style>

</style>
