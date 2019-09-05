<template>
    <div class="user-avator-dropdown" @click="showCount()" >
        <Dropdown @on-click="handleClick" trigger="click">
            <Badge :dot="!!messageUnreadCount">
                <Avatar :src="userAvator"/>
            </Badge>
            <Icon :size="18" type="md-arrow-dropdown"></Icon>
            <DropdownMenu slot="list">
                <DropdownItem name="message">
                    消息中心
                    <Badge style="margin-left: 10px" :count="unreadCount"></Badge>
                </DropdownItem>
				        <DropdownItem name="personCenter">个人中心</DropdownItem>
                <DropdownItem name="logout">退出登录</DropdownItem>
            </DropdownMenu>
        </Dropdown>
    </div>
</template>

<script>
  import { api } from '@/api/api'
  import { apiRequest } from '@/api/http'
  import './user.less'
  import { mapActions } from 'vuex'
  import { setToken } from '@/libs/util'
  import Cookies from 'js-cookie'

  export default {
    name: 'User',
    data(){
      return{
        messageUnreadCount:0,
        unreadCount:0,
        userAvator:'http://brz-crm.oss-cn-beijing.aliyuncs.com/img/20190805152446_plQ7.png',
      }
    },
    mounted(){
       this.admiId = Cookies.get('admin_id')
       this.initData()
    },
    methods: {
      ...mapActions([
        'handleLogOut',
      ]),
      //获取数据
      initData () {
        const params = {id: this.admiId,}
        //请求管理员列表
        apiRequest(api.Admin.onlinePerson,
          params,
          ret => {
            if(ret.data[0].icon==""){
              ret.data[0].icon="http://brz-crm.oss-cn-beijing.aliyuncs.com/img/20190710154039_MQ1A.jpg"
            }
            this.userAvator=ret.data[0].icon
      	})
      },
      logout () {
        //todo 发送退出登录的网路请求
        setToken('')
        this.$router.push({
          name: 'login'
        })
      },
      message () {
        this.$router.push({
          name: 'message_page'
        })
      },
      personCenter(){
        this.$router.push({name:'person_center'})
      },
      showCount(){
        this.unreadCount=this.$store.state.user.unreadCount
      },
      handleClick (name) {
        switch (name) {
          case 'logout':
            this.logout()
            break
          case 'personCenter':
            this.personCenter()
            break
          case 'message':
            this.message()
            break
        }
      },
    }
  }
</script>
