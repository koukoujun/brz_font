<template>
  <Card shadow>
    <div>
      <!-- 左边导航 -->
      <div class="message-page-con message-category-con">
        <Menu width="auto" active-name="unread" @on-select="handleSelect">
          <MenuItem name="unread">
            <span class="category-title">未读消息</span><Badge style="margin-left: 10px" :count="messageUnreadCount"></Badge>
          </MenuItem>
          <MenuItem name="readed">
            <span class="category-title">已读消息</span><Badge style="margin-left: 10px" class-name="gray-dadge" :count="messageReadedCount"></Badge>
          </MenuItem>
<!--          <MenuItem name="trash">
            <span class="category-title">回收站</span><Badge style="margin-left: 10px" class-name="gray-dadge" :count="messageTrashCount"></Badge>
          </MenuItem> -->
        </Menu>
      </div>
      <!-- 未读消息 -->
      <div class="message-page-con message-list-con">
        <Spin fix v-if="listLoading" size="large"></Spin>
        <Menu width="auto" active-name="" @on-select="handleView" >
          <MenuItem v-for="item in messageList" :name="item.id" :key="item.id">
            <div>
              <!-- 标题部分 -->
              <p class="msg-title">{{ item.title }}</p>
              <Badge status="default" :text="item.create_at" />
<!--              <Button
                style="float: right;margin-right: 20px;"
                :style="{ display: item.loading ? 'inline-block !important' : '' }"
                :loading="item.loading"
                size="small"
                :icon="currentMessageType === 'readed' ? 'md-trash' : 'md-redo'"
                :title="currentMessageType === 'readed' ? '删除' : '还原'"
                type="text"
                v-show="currentMessageType !== 'unread'"
                @click.native.stop="removeMsg(item)"></Button> -->
            </div>
          </MenuItem>
        </Menu>
      </div>
      <div class="message-page-con message-view-con">
        <Spin fix v-if="contentLoading" size="large"></Spin>
        <div class="message-view-header">
          <!-- 正文标题 -->
          <h2 class="message-view-title">{{ showingMsgItem.title }}</h2>
          <!-- 标题时间 -->
          <time class="message-view-time">{{ showingMsgItem.create_at }}</time>
          <span style="margin-left:1rem;" >{{showingMsgItem.name}}</span>
          <a class="message-view-title" style="margin-left:2rem;color: #2D8CF0;" @click="response()" >{{ showingMsgItem.response }}</a>
          <a class="message-view-title" style="margin-left:2rem;color: #2D8CF0;" @click="detail()" >{{ showingMsgItem.detail }}</a>
        </div>
        <!-- 详细内容 -->
        <div>
          <div>
            {{showingMsgItem.title01}}
            <br>
            {{showingMsgItem.content}}
            <span style="margin-right:1rem;">{{showingMsgItem.lesson}}</span>
            <span style="margin-right: 1rem;">{{showingMsgItem.way}}</span>
            <span>{{showingMsgItem.value}}</span>
          </div>
          <div style="margin-top:2rem;" v-show="answerVisable" >
            {{showingMsgItem.title02}}
            <br>
            {{showingMsgItem.answer}}
          </div>
        </div>
      </div>
      <!-- detrail -->
      <Drawer title="交费详情" placement="left" :closable="false" v-model="showPaymentDrawer">
          <p>发送人:{{payDetaildata.admin_name}}</p>
          <p>顾客姓名:{{payDetaildata.customer_name}}</p>
          <p>电话{{payDetaildata.phone}}</p>
          <p>金额:{{payDetaildata.value}}</p>
          <p>缘由:{{payDetaildata.origin}}</p>
          <p>定金/全款:{{payDetaildata.is_deposit}}</p>
          <p>交费方式:{{payDetaildata.way}}</p>
          <p>支付时间:{{payDetaildata.pay_time}}</p>
          <p>课程类别:{{payDetaildata.lesson}}</p>
          <p>参课城市:{{payDetaildata.join_lesson_city}}</p>
          <p>参课时间:{{payDetaildata.join_lesson_time}}</p>
          <p>落款城市:{{payDetaildata.final_city}}</p>
          <p>是否到账:{{payDetaildata.is_complete_name}}</p>
          <p>发票状态:{{payDetaildata.invoice_status}}</p>
          <p>退款状态:{{payDetaildata.refund_status}}</p>
          <p>是否参课:{{payDetaildata.is_join}}</p>
          <p>创建日期:{{payDetaildata.create_at}}</p>
      </Drawer>
      <Drawer title="退款详情" placement="left" :closable="false" v-model="showRefundDrawer">
          <p>发送人:{{refundDetaildata.admin_name}}</p>
          <p>顾客姓名:{{refundDetaildata.customer_name}}</p>
          <p>电话{{refundDetaildata.phone}}</p>
          <p>金额:{{refundDetaildata.value}}</p>
          <p>缘由:{{refundDetaildata.origin}}</p>
          <p>定金/全款:{{refundDetaildata.is_deposit}}</p>
          <p>退款方式:{{refundDetaildata.way}}</p>
          <p>参课城市:{{refundDetaildata.join_lesson_city}}</p>
          <p>课程类别:{{refundDetaildata.lesson}}</p>
          <p>开户行:{{refundDetaildata.bank_name}}</p>
          <p>开户账号:{{refundDetaildata.bank_account}}</p>
          <p>开户人姓名:{{refundDetaildata.bank_customer_name}}</p>
          <p>开户行地址:{{refundDetaildata.bank_address}}</p>
          <p>备注:{{refundDetaildata.desc}}</p>
          <p>退款状态:{{refundDetaildata.refund_status}}</p>
          <p>是否参课:{{refundDetaildata.is_join}}</p>
          <p>创建日期:{{refundDetaildata.create_at}}</p>
      </Drawer>
      <!-- modal -->
      <MessageForm :visible="FormVisible" :src_id="src_id" :id="showingMsgItem.id" :type="showingMsgItem.type" mode="add" @hideForm="FormVisible=false" @answer="answer()" @update="getData()"  ></MessageForm>
      <PaymentForm :visible="payFormVisible" :src_id="src_id" :id="showingMsgItem.id" :type="showingMsgItem.type" mode="add" @hideForm="payFormVisible=false" @answer="answer()" @update="getData()"  ></PaymentForm>
      <RefundForm :visible="refundFormVisible" :pay_id="showingMsgItem.pay_id" :src_id="src_id" :id="showingMsgItem.id" :type="showingMsgItem.type" mode="add" @hideForm="refundFormVisible=false" @answer="answer()" @update="getData()"  ></RefundForm>
    </div>
  </Card>
</template>

<script>
import { api } from '@/api/api'
import { apiRequest } from '@/api/http'
import {getUnreadCount} from '@/api/user'
//vuex里面的四大金刚：State， Mutations，Actions，Getters
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'
import { dataToTable, objFilter,getBaseUrl, getToken } from '@/libs/util'
import MessageForm from '@/view/main/message/modal/message_form'
import PaymentForm from '@/view/main/message/modal/payment_form'
import RefundForm from '@/view/main/message/modal/refund_form'

const listDic = {
  unread: 'messageUnreadList',
  readed: 'messageReadedList',
  trash: 'messageTrashList'
}
export default {
  components:{MessageForm,PaymentForm,RefundForm},
  name: 'message_page',
  data () {
    return {
      //支付详细信息
      paydata:{},
      showPaymentDrawer:false,
      payDetaildata:"",
      //退款详细信息
      refunddata:{},
      showRefundDrawer:false,
      refundDetaildata:"",
      //
      data:{},
      item:{},
      listLoading: true,
      contentLoading: false,
      currentMessageType: 'unread',
      messageContent: '',
      showingMsgItem: {},
      //未读消息列表
      messageUnreadList:{},
      messageUnreadCount:0,
      //已度消息列表
      messageReadedList:{},
      messageReadedCount:0,
      //modal
      FormVisible:false,
      payFormVisible:false,
      answerVisable:false,
      refundFormVisible:false,
      src_id:'',
    }
  },

  computed: {
    //state 存储数据
    ...mapState({
      messageList () {
        return this[listDic[this.currentMessageType]]
      },
    }),
  },
  methods: {
    changeCount(){
      this.$store.commit('changeCount',this.messageUnreadCount)
    },
    //action 的作用跟mutation的作用是一致的，它提交mutation，从而改变state，是改变state的一个增强版
    ...mapActions([
      'getContentByMsgId',
      'getMessageList',
      'hasRead',
      'removeReaded',
      'restoreTrash',
    ]),
    stopLoading (name) {
      this[name] = false
    },
    //选择消息列表
    handleSelect (name) {
      this.currentMessageType = name
    },
    //消息详情
    handleView (id) {
      this.contentLoading = true
      this.getContentByMsgId({ id }).then(content => {
        const item = this.messageList.find(item => item.id === id)
        if (item) this.showingMsgItem = item
        //赋予标题
        this.showingMsgItem.title01="Question:"
        this.showingMsgItem.title02="Answer:"
        //
        this.messageContent = item.content
        this.src_id =item.src_id
        this.item = item
        //索引未读消息
        if (this.currentMessageType === 'unread'){
          this.hasRead({ id })
          this.stopLoading('contentLoading')
          this.showingMsgItem.response="回复"
          this.answerVisable=false
          //12发票申请，13退款申请
          if(this.showingMsgItem.type=='12'||this.showingMsgItem.type=='13'){
            this.showingMsgItem.detail="详情"
          }
        }
        //索引已读消息
        if (this.currentMessageType === 'readed'){
          this.hasRead({ id })
          this.stopLoading('contentLoading')
          this.showingMsgItem.response=""
          this.answerVisable=true
        }
        //索引回收消息
        if (this.currentMessageType === 'trash'){
          this.hasRead({ id })
          this.stopLoading('contentLoading')
          this.showingMsgItem.response=""
          this.answerVisable=true
        }

      }).catch(() => {
        this.stopLoading('contentLoading')
      })
    },
    //删除消息
    removeMsg (item) {
      item.loading = true
      const id = item.id
      //已读消息转回收消息
      if (this.currentMessageType === 'readed'){
        item.is_read='2'
        this.data.id=item.id
        this.data.is_read=item.is_read
        apiRequest(api.Message.updates,objFilter(this.data), ret => {this.getData()});item.loading = false;
      };
      //回收站消息回复为已读消息
      if (this.currentMessageType === 'trash'){
        item.is_read='1'
        this.data.id=item.id
        this.data.is_read=item.is_read
        apiRequest(api.Message.updates,objFilter(this.data), ret => {this.getData()});item.loading = false;
      };
    },
    //回复消息
    response(){
      if(this.showingMsgItem.type=='12'){
        this.payFormVisible=true;
      }
      else if(this.showingMsgItem.type=='13'){
        this.refundFormVisible=true;
      }
      else{
        this.FormVisible=true;
      }
    },
    //查看详情
    detail(){
      if(this.showingMsgItem.type=="12"){
      this.paydata.id = this.showingMsgItem.src_id;
    	apiRequest(api.Payment.search,this.paydata, ret => {
        console.log(ret)
        this.payDetaildata=ret
        this.showPaymentDrawer=true;
      })
      }
      if(this.showingMsgItem.type=="13"){
      this.refunddata.id = this.showingMsgItem.src_id;
    	apiRequest(api.Refund.search,this.refunddata, ret => {
        console.log(ret)
        this.refundDetaildata=ret
        this.showRefundDrawer=true;
      })
      }
    },
    //消息回复完成
    answer(){
      //未读消息回复为已读消息
      if (this.currentMessageType === 'unread'){
        this.item.is_read='1'
        this.data.id=this.item.id
        this.data.is_read=this.item.is_read
        apiRequest(api.Message.updates,objFilter(this.data), ret => {this.getData()});this.item.loading = false;
      };
    },
    //-----------------------------------------
    //获取数据
    getData () {
      //未读消息接口
    	apiRequest(api.Message.getList, ret => {
          this.messageUnreadList=ret.data
          //listDic.unread=ret.data
          let len = ret.data.length;
          this.messageUnreadCount=len;
          this.changeCount()
    	})
      //已读消息接口
      apiRequest(api.Message.getListReaded, ret => {
          this.messageReadedList=ret.data
          let len = ret.data.length;
          this.messageReadedCount=len
      })
      //回收消息接口
      apiRequest(api.Message.getListRecycle, ret => {
          this.messageTrashList=ret.data
          let len = ret.data.length;
          this.messageTrashCount=len
      })
    },
  },
  created() {
    //获取数据
    this.getData()
    this.listLoading = true
    // 请求获取消息列表
    this.getMessageList().then(() => this.stopLoading('listLoading')).catch(() => this.stopLoading('listLoading'))
  },
}
</script>

<style lang="less">
.message-page{
  &-con{
    height: ~"calc(100vh - 176px)";
    display: inline-block;
    vertical-align: top;
    position: relative;
    &.message-category-con{
      border-right: 1px solid #e6e6e6;
      width: 200px;
    }
    &.message-list-con{
      border-right: 1px solid #e6e6e6;
      width: 230px;
    }
    &.message-view-con{
      position: absolute;
      left: 446px;
      top: 16px;
      right: 16px;
      bottom: 16px;
      overflow: auto;
      padding: 12px 20px 0;
      .message-view-header{
        margin-bottom: 20px;
        .message-view-title{
          display: inline-block;
        }
        .message-view-time{
          margin-left: 20px;
        }
      }
    }
    .category-title{
      display: inline-block;
      width: 65px;
    }
    .gray-dadge{
      background: gainsboro;
    }
    .not-unread-list{
      .msg-title{
        color: rgb(170, 169, 169);
      }
      .ivu-menu-item{
        .ivu-btn.ivu-btn-text.ivu-btn-small.ivu-btn-icon-only{
          display: none;
        }
        &:hover{
          .ivu-btn.ivu-btn-text.ivu-btn-small.ivu-btn-icon-only{
            display: inline-block;
          }
        }
      }
    }
  }
}
</style>
