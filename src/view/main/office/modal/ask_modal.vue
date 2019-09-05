<template>
    <div style="padding-left:2rem;padding-right:2rem;" >
        <template>
            <Card style="width:100%">
                <div style="text-align:left">
                    <h2>{{this.data.title}}</h2>
                    <div style="margin-top:1rem;">{{this.data.content}}</div>
                </div>
            </Card>
        </template>
        <!-- 富文本编辑 -->
        <div style="margin-top:1rem;">
          <editor ref="editor" :value="content" v-model="content" @on-change="handleChange"/>
        </div>
        <!-- 回复按钮 -->
        <div style="text-align: right;margin-top:1rem;margin-right:5rem;">
          <Button type="primary" @click="submit()">提交回答</Button>
        </div>
        <!--回复标签-->
        <div style="margin-top:3rem;">
        <Row type="flex" justify="center" align="middle" class="code-row-bg">
          <Col :span="2"><h3>{{askData.total}}个回答</h3></Col>
          <Col :span="22"><hr style='background-color:#D1D1D1; height:1px; border:none'></Col>
        </Row>
        </div>
        <!-- 回复详情 -->
        <div style="margin-top:1rem;" v-for="ask in askData.data" >
           <div style="width:12rem;">
           <Row type="flex" justify="center" align="middle" class="code-row-bg">
             <Col :span="6" >
                <div class="demo-avatar">
                   <Avatar v-bind:src="ask.icon" />
                </div>
             </Col>
             <Col :span="18" >
               <div>{{ask.name}}</div>
               <div>{{ask.create_at}}</div>
             </Col>
           </Row>
           </div>
           <div style="width:70vw;margin-top:1rem">
             <div>{{ask.content}}</div>
           </div>
           <hr style='background-color:#DFDFDF; height:1px; border:none;margin-top:1rem;'>
        </div>
        <Page style="margin:10px 0;" :total="askData.total" :page-size="askData.per_page" size="small" show-total show-elevator @on-change="onPage"></Page>

    </div>
</template>
<script>
  import { api } from '@/api/api'
  import { mapMutations } from 'vuex'
  import { apiRequest } from '@/api/http'
  import { dataToTable, objFilter,getBaseUrl, getToken } from '@/libs/util'
  import { questionDetailTable} from '@/libs/data-office'
  import ChinaArea from '@/libs/China-area'
	import Editor from '_c/editor'
  import Cookies from 'js-cookie'

  export default {
		components: { Editor},
    data () {
      return {
        pageNum: 1,//页码
        data: {},//数据
        askData:{},//回复数据
        curr: {},//当前row
        keyword: '',//搜索关键字
		    imgshow:true,
				content:"",//富文本编辑内容
        orderId:this.$route.query.orderId,//提问页面传递参数
        nameicon:"",
        //客户表单
        form: {
            admin_id:"",
            src_id:"",
            icon:"",
            content:"",
            create_at:"",
					},
					}
				},
				mounted () {
          this.admiId = Cookies.get('admin_id');
          this.personData();
					this.initData();
          this.initDatas();
          this.$refs.editor.setHtml('');
				},
				methods: {
					...mapMutations([
						'closeTag'
					]),
          initDatas(){
            const params = {}
            //请求接口
            apiRequest(api.Question.getList,
            	params,
            	ret => {
            		   this.data = ret
                   let len = ret.data.length;
                   for(let i=0;i<len;i++){
                     if(ret.data[i].id==this.orderId){
                       this.data = ret.data[i]
                     }
                   }
            	})
          },
          //获取数据
          personData () {
              const params = {id: this.admiId,}
              //请求管理员列表
              apiRequest(api.Admin.onlinePerson,
                params,
                ret => {
                  if(ret.data[0].icon==""){
                    ret.data[0].icon="http://brz-crm.oss-cn-beijing.aliyuncs.com/img/20190710154039_MQ1A.jpg"
                  }
                  this.form.icon = ret.data[0].icon
               })
            },
					initData () {
						const keyword = this.keyword.trim()//trim去除前后空格 //客户搜索关键词
						const group = this.group

						const params = {
							pageNum: this.pageNum,
						}
						//关键字筛选
						if (keyword) {
							params.keyword = keyword
						}
            params.src_id = this.orderId
            //ask回复列表
            apiRequest(api.Question.askList,
              params,
              ret=>{
                this.askData = ret
              })
					},
					// 复文本01
					handleChange (html, text) {
            this.form.content = text;
					},
					//富文本02
					changeContent () {
					  this.$refs.editor.setHtml('')
					},
					//页码点击
					onPage (page) {
						this.pageNum = page
						this.initData()
					},
					//搜索按钮点击
					query () {
						this.pageNum = 1
						this.initData()
					},
					//刷新
					refresh () {
						this.pageNum = 1
						this.keyword = ''
						this.group = null
						this.initData()
					},
				  //提交客户表单
					submit (name) {

            this.form.src_id = this.$route.query.orderId;

            if(this.form.content==''||this.form.content==undefined){
              this.$Message.info('请填写回复内容');
            }
            else{
              apiRequest(api.Question.askAdd, this.form, ret => {
              //清空form表单
              this.form = { brand_right: 0 },
              //关闭表单modal
              this.formVisible = false
              //重新加载数据
              this.initData()
              this.personData()
              })

              this.$Message.success('Success!');
              this.$refs.editor.setHtml('');
            }

      },
      //删除简历表单
		  deletes(){
			const apiName = this.formMode = api.Question.del
			apiRequest(apiName,objFilter(this.form),ret=>{
				this.$Message.info(ret)
				//清空form表单
				this.from={brand_right:0}
				this.formVisible=false
				this.initData()
				this.delete_button=false
			})
		},
    }
  }

</script>
<style>
    .demo-upload-list {
        display: inline-block;
        width: 60px;
        height: 60px;
        text-align: center;
        line-height: 60px;
        border: 1px solid transparent;
        border-radius: 4px;
        overflow: hidden;
        background: #fff;
        position: relative;
        box-shadow: 0 1px 1px rgba(0, 0, 0, .2);
        margin-right: 4px;
    }

    .demo-upload-list img {
        width: 100%;
        height: 100%;
    }

    .demo-upload-list-cover {
        display: none;
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        background: rgba(0, 0, 0, .6);
    }

    .demo-upload-list:hover .demo-upload-list-cover {
        display: block;
    }

    .demo-upload-list-cover i {
        color: #fff;
        font-size: 20px;
        cursor: pointer;
        margin: 0 2px;
    }
</style>
