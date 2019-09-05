<template>
  <div>
    <Row :gutter="20">
      <i-col :xs="12" :md="8" :lg="4" v-for="(infor, i) in inforCardData" :key="`infor-${i}`" style="height: 120px;padding-bottom: 10px;">
        <infor-card shadow :color="infor.color" :icon="infor.icon" :icon-size="36">
          <count-to :end="infor.count" count-class="count-style"/>
          <p>{{ infor.title }}</p>
        </infor-card>
      </i-col>
    </Row>
    <Row :gutter="20" style="margin-top: 10px;">
      <i-col :md="24" :lg="8" style="margin-bottom: 20px;">
        <!-- 系统公告模块 -->
        <Card shadow >
         <template>
              <Scroll :on-reach-bottom="handleReachBottom_Notice" height='420' >
                  <Card dis-hover v-for="(item, index) in list2" :key="index" style="margin:10px 0;">
                      <Row>
                        <Col :span="14"><font style="color: #731E7F;" >[{{item.category}}]&nbsp;</font>{{item.title}}</Col>
                        <Col :span="8"><font style="color: #2D8CF0;" >时间:{{item.create_at}}&nbsp;</font></Col>
                        <Col :span="2"> <Button type="info" size="small" @click="noticeDetail(item)"  >详情</Button></button> </Col>
                      </Row>
                  </Card>
              </Scroll>
          </template>
        </Card>
      </i-col>
      <i-col :md="24" :lg="16" style="margin-bottom: 20px;">
        <!-- 每日问答模块 -->
        <Card shadow >
          <template>
              <Scroll :on-reach-bottom="handleReachBottom" height='420' >
                  <Card dis-hover v-for="(item, index) in list1" :key="index" style="margin:10px 0">
                      <Row>
                        <Col :span="4"><font style="color: #5CE09E;" >[提问人]&nbsp;</font>{{ item.name }}</Col>
                        <Col :span="5"><font style="color: #E998E6;" >[标题]&nbsp;</font> {{ item.title }}</Col>
                        <Col :span="11"><font style="color: #2D8CF0;" >[内容]&nbsp;</font>{{ item.content }}</Col>
                        <Col :span="2"> <Button type="info" size="small" @click="askDetail(item)" >查看回复</Button></button> </Col>
                      </Row>
                  </Card>
              </Scroll>
          </template>
        </Card>
      </i-col>
    </Row>
<!--   <Row>
      <Card shadow>
        <example style="height: 310px;"/>
      </Card>
    </Row> -->
    <!-- 详情-->
    <Drawer title="公告详情" placement="left" :closable="false" v-model="noticeVisable">
        <p>发布人:{{list2DeatilData.name}}</p>
        <p>标题:{{list2DeatilData.title}}</p>
        <p>内容:{{list2DeatilData.content}}</p>
        <p>时间:{{list2DeatilData.create_at}}</p>
    </Drawer>
  </div>
</template>

<script>
import { api } from '@/api/api'
import { apiRequest } from '@/api/http'
import InforCard from '_c/info-card'
import CountTo from '_c/count-to'
import { ChartPie, ChartBar } from '_c/charts'
import Example from './example.vue'
import {home_oneData,homeOneHead} from '@/view/single-page/home/home-data'
export default {
  name: 'home',
  components: {
    InforCard,
    CountTo,
    ChartPie,
    ChartBar,
    Example
  },
  data () {
    return {
      home_oneData:home_oneData,//
      columns1:homeOneHead,//
      list1: [],//每日问答数据
      list2: [],//系统公告模块
      list2DeatilData:{},//系统公告数据详情
      noticeVisable:false,
      pageNum:1,
      pageNums:1,
      //数据统计
      inforCardData: [
        { title: '每日一问', icon: 'md-person-add', count: 0, color: '#2d8cf0' },
        { title: '知识管理', icon: 'md-locate', count: 0, color: '#19be6b' },
        { title: '通讯录', icon: 'md-help-circle', count: 0, color: '#ff9900' },
        { title: '意见反馈', icon: 'md-share', count: 0, color: '#ed3f14' },
        { title: '公告数量', icon: 'md-chatbubbles', count: 0, color: '#E46CBB' },
        { title: '访客数量', icon: 'md-map', count: 0, color: '#9A66E4' }
      ],

    }
  },
  mounted () {
    this.initData()
    this.initDataNotice()
    this.initDataKnowledge()
    this.initDataContacts()
    this.initDataFeedback()
  },
  methods:{
    //加载数据-每日问答
    initData(){
      const params = {
      	pageNum: this.pageNum,
      }
      //请求接口
      apiRequest(api.Question.getList,
      	params,
      	ret => {
          this.list1 = ret.data
          this.inforCardData[0].count=ret.total
      	})
    },
    //加载数据-系统公告
    initDataNotice(){
      const params = {
      	pageNum: this.pageNum,
      }
      //请求接口
      apiRequest(api.Notice.getList,
      	params,
      	ret => {
          this.list2 = ret.data
          this.inforCardData[4].count=ret.total
      	})
    },
    //加载数据-知识管理
    initDataKnowledge(){
      const params = {pageNum: this.pageNum}
      apiRequest(api.Knowledge.getList,params,ret => {this.inforCardData[1].count=this.inforCardData[1].count+ret.total})
      apiRequest(api.Knowledge.getListtwo,params,ret => {this.inforCardData[1].count=this.inforCardData[1].count+ret.total})
      apiRequest(api.Knowledge.getListthree,params,ret => {this.inforCardData[1].count=this.inforCardData[1].count+ret.total})
      apiRequest(api.Knowledge.getListfour,params,ret => {this.inforCardData[1].count=this.inforCardData[1].count+ret.total})
    },
    //加载通讯录数据
    initDataContacts(){
      const params = {pageNum: this.pageNum}
      apiRequest(api.Contacts.getList,params,ret => {this.inforCardData[2].count=this.inforCardData[1].count+ret.total})
    },
    //加载意见反馈数据
    initDataFeedback(){
      const params = {pageNum: this.pageNum}
      apiRequest(api.Feedback.getList,params,ret => {this.inforCardData[3].count=this.inforCardData[1].count+ret.total})
    },
    //无限制循环-每日问答
    handleReachBottom () {
        return new Promise(resolve => {
            setTimeout(() => {
                const last = this.list1[this.list1.length - 1];
                let params = {pageNum:this.pageNums+1 , }
                apiRequest(api.Question.getList,
                	params,
                	ret => {
                    let len = ret.data.length
                    let page = ret.last_page

                    this.pageNums = params.pageNum

                    if(this.pageNums<=page){
                      for(let i=0;i<len;i++){
                        this.list1.push(ret.data[i])
                      }
                      console.log(this.list1)
                    }
                    else{
                      this.$Message.info("已经是最后一条问答了！")
                    }

                	})
                resolve();
            }, 1000);
        });
    },
    //无限制循环-系统公告
    handleReachBottom_Notice () {
        return new Promise(resolve => {
            setTimeout(() => {
                const last = this.list2[this.list2.length - 1];
                let params = {pageNum:this.pageNum+1 , }
                apiRequest(api.Notice.getList,
                	params,
                	ret => {
                    let len = ret.data.length
                    let page = ret.last_page

                    this.pageNum = params.pageNum

                    if(this.pageNum<=page){
                      for(let i=0;i<len;i++){
                        this.list2.push(ret.data[i])
                      }
                      console.log(this.list2)
                    }
                    else{
                      this.$Message.info("已经是最后一条问答了！")
                    }

                	})
                resolve();
            }, 1000);
        });
    },
    //查看问答详情数据
    askDetail(item){
     this.$router.push({ path: '/ask_modal', query: { orderId: item.id } })
    },
    //系统公告详情数据
    noticeDetail(item){
      this.noticeVisable=true
     this.list2DeatilData = item
    },

  }
}
</script>

<style lang="less">
.count-style{
  font-size: 50px;
}
</style>
