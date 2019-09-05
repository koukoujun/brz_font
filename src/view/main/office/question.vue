<template>
    <div>
        <!--筛选工具-->
        <Row :gutter="24" style="margin-bottom: 10px">
            <Col span="4">
                <Input search enter-button size="small" v-model="keyword" placeholder="输入提问人" @on-search="query"/>
            </Col>
            <Col span="2">
                <Button type="success" size="small" @click="refresh">
                    <Icon type="ios-refresh"></Icon>
                    刷新
                </Button>
            </Col>
            <Col span="2">
                <Button type="success" size="small" @click="add">
                    <Icon type="ios-add"></Icon>
                    添加
                </Button>
            </Col>
        </Row>
        <!--表格-->
        <Table :data="data.data"  :columns="col"  size="small" highlight-row @on-current-change="row=>curr=row">
            <template slot-scope="{ row, index }" slot="action">
                <Dropdown trigger="click"  style="margin-left: 20px" @on-click="customerActionMenuHandler" placement="left" >
                    <Button size="small">
                        操作
                        <Icon type="ios-arrow-down"></Icon>
                    </Button>
                    <DropdownMenu slot="list">
                        <DropdownItem name="detail">查看详情</DropdownItem>
                        <DropdownItem name="edit">编辑修改</DropdownItem>
                    </DropdownMenu>
                </Dropdown>
            </template>
        </Table>
        <Page style="margin:10px 0;" :total="data.total" :page-size="data.per_page" size="small" show-total show-elevator @on-change="onPage"></Page>
         <!-- 详情-->
        <Drawer title="详情" placement="left" :closable="false" v-model="showDetailDrawer">
			    <div v-html="currDetailTable"></div>
        </Drawer>
         <!-- 简历表单-->
        <Modal v-model="formVisible" width="73" :title="formMode==='add'?'添加提问信息':'编辑提问信息'" footer-hide @on-cancel="form={brand_right:0}">
          <Form :model="form" :label-width="120" :rules="formInline" ref="form" inline >
							<Row :gutter="15">
							<!-- 第一行-->
							<Row>
								<Col :span="8">
									<FormItem label="提问人" prop="to_admin"  >
								     <Select v-model="form.to_admin" size="small" style="width:150%">
								         <Option :value="i" v-for="i in adminList"  >{{i.name}}</Option>
								     </Select>
									</FormItem>
								</Col>
								<Col :span="8">
									<FormItem label="申请标题" prop="title" >
										 <Input v-model="form.title" size="small" placeholder="请填写汇报标题" ></Input>
									</FormItem>
								</Col>
                <Col :span="8">
                	<div style="padding-left:7.6rem;">
                		 <Button @click="changeContent" type="primary" ghost size="small" >重置编辑器内容</Button>
                	</div>
                </Col>
							</Row>
							<!-- 富文本编辑 -->
							<Row type="flex" justify="center" class="code-row-bg">
								<Col :span="22">
									<div>
										<editor ref="editor" :value="content" v-model="content" @on-change="handleChange"/>
									</div>
								</Col>
							</Row>
                </Row>
                <FormItem style="margin-top:2rem;">
                    <Button type="primary" @click="submit('form')">提交</Button>
					          <Button style="margin-left: 8px;" v-show="delete_button" type="error" @click="deletes">删除</Button>
                    <Button style="margin-left: 8px" @click="formVisible=false,delete_button=false">取消</Button>
                </FormItem>
            </Form>
        </Modal>
		    <!-- 图片预览-->
				<Modal title="图片预览" v-model="imgModalVisible" footer-hide>
						<img :src="previewImg" v-if="imgModalVisible" style="width: 100%" alt="">
				</Modal>
				<!--  -->
				<Modal title="查看大图" v-model="visible" footer-hide>
            <img :src="imgUrl" v-if="visible" style="width: 100%">
        </Modal>
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

  export default {
		components: { Editor},
    data () {
      return {
        // col: cvHeadTable,//表头
        pageNum: 1,//页码
        data: {},//数据
        curr: {},//当前row
        currDetailTable: '',//详情html
        showDetailDrawer: false,//是否显示简历详情抽屉
        keyword: '',//搜索关键字
        ChinaArea: ChinaArea,//中国行政区数据
		    imgshow:true,
				content:"",//富文本编辑内容
        adminList:[],//管理员列表
				// 工作汇报表头信息
				col:[
					{
						title:'编号',
						key:'id'
					},
          {
          	title:'提问人',
          	key:'to_name',
          },
          {
          	title:'姓名',
          	key:'name',
          },
					{
						title:'标题',
						key:'title'
					},
					{
						title:'提问内容',
						key:'content'
					},
          {
            title:"回复内容",
            key:'answer'
          },
					{
						title:'添加时间',
						key:'create_at'
					},
					 {
						title: '操作',
						slot: 'action',
						width: '100px',
						align: 'center'
					}
				],
        //表单选项
        option: {
          fromList: [],
          cityList: [],
          lessonList: [],
        },
        //客户表单
        form: {
            to_admin:"",
            admin_id:"",
            to_admin_id:"",
            name:"",//*
            title: "",
            content: "",//*

            type:10,
            to_user:'',
            from_user:'',
            is_read:0,
            create_at:"",
					},
				//验证规则
				formInline: {
					title: [
						{ required: true, message: '请填写标题', trigger: 'blur' }
					],
					content: [
						{ required: true, message: '请填写内容', trigger: 'blur' },
					],
				},

				uploadUrl: getBaseUrl() + api.Common.upload + '?token=' + getToken(),
				uploadList: [],//图片上传截图列表
				defaultUploadList: [],//默认上传列表
				imgModalVisible: false,
				previewImg: '',
				//图片放大
				visible:false,
				imgUrl:"",
				//删除是否显示
				delete_button:false,

				formMode: 'add',//客户表单模式  add 添加  edit 修改
				formVisible: false,//客户表单是否显示

				//时间戳
				timestamp: 0,
					}
				},
				mounted () {
					this.initData()
					this.getOption()
				  //this.uploadList = this.$refs.upload.fileList
				},
				watch: {
					curr (_new) {
						this.currDetailTable = dataToTable(_new, questionDetailTable)
					}
				},
				methods: {
					...mapMutations([
						'closeTag'
					]),
					//获取选项
					getOption () {
						apiRequest(api.Common.getOption, {
							'list': 'from_list,city_list,lesson_list'
						}, ret => {
							this.option = {
								fromList: ret.from_list,
								cityList: ret.city_list,
								lessonList: ret.lesson_list,
							}
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
						//分组筛选
						if (group) {
							params.group = group
						}
						//请求接口
						apiRequest(api.Question.getList,
							params,
							ret => {
								this.data = ret
                   let len = ret.data.length;
                   for(let i=0;i<len;i++){
                     this.data.data[i].to_admin={
                       name:this.data.data[i].to_name,
                       id:this.data.data[i].to_admin_id,
                       }
                     //console.log(this.data.data[i].to_admin)
                   }
							})
            //请求管理员列表
            apiRequest(api.Admin.indexList,
              params,
              ret => {
            	 let len = ret.data.length;
            	 for(let i=0;i<len;i++){
            		  this.adminList.push({name:ret.data[i].name,id:ret.data[i].id})
            	 }
              })
					},
					// 复文本01
					handleChange (html, text) {
            this.form.content = text;
					},
					//富文本02
					changeContent () {
					  this.$refs.editor.setHtml('<p></p>')
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
					//添加员工
					add () {
						this.formMode = 'add'
						this.formVisible = true
					},
					//编辑
					edit (row) {
						this.formMode = 'edit'
						this.formVisible = true
						this.form = { ...row }
						this.form.id = row.id
						this.form.content=row.content
						this.$refs.editor.setHtml(this.form.content)
					},
					//操作菜单
					customerActionMenuHandler (name) {
						switch (name) {
					//查看详情
            case 'detail':
              this.showDetailDrawer = true
              break
					//编辑修改
            case 'edit':
              this.edit(this.curr)
              this.delete_button=true
              break
            case 'addDoc':
              this.docFormVisible = true
              break
            case 'addPay':
              this.payFormVisible = true
              break
						}
					},
				//图片上传开始
				//图片上传成功
				handleImgSuccess (response, file, fileList) {
					file.url = response
          this.imgshow=false
          this.form.img=file.url;
				},
				//图片上传预览
				handleView (img) {
					this.previewImg = img
					this.imgModalVisible = true
				},
				//表格图片预览
				handleViews(url) {
						this.imgUrl = url;
						this.visible = true;
					},
				handleBeforeUpload () {
					const check = this.uploadList.length < 5
					if (!check) {
						this.$Notice.warning({
							title: '最多上传五张截图'
						})
					}
					return check
				},
				handleFormatError (file) {
					this.$Notice.warning({
						title: '文件格式不正确',
						desc: '文件格式 ' + file.name + ' 不正确，请选择jpg或png图片文件'
					})
				},
				handleMaxSize (file) {
					this.$Notice.warning({
						title: '文件太大！',
						desc: '文件  ' + file.name + ' 太大了, 请不要超过 2M.'
					})
				},
				//删除已上传的图片
				handleRemove (file) {
					const fileList = this.$refs.upload.fileList
					this.$refs.upload.fileList.splice(fileList.indexOf(file), 1)
				  this.imgshow=true
				},
				//图片上传结束
				//提交客户表单
					submit (name) {

          //传入id和姓名
          this.form.to_admin_id = this.form.to_admin.id;
          this.form.to_name = this.form.to_admin.name;

          //验证
				  this.$refs[name].validate((valid) => {
					if (valid && this.to_admin!='') {

						const apiName = this.formMode === 'add' ? api.Question.add : api.Question.edit
						apiRequest(apiName, this.form, ret => {
						//清空form表单
						this.form = { brand_right: 0 },
						//关闭表单modal
						this.formVisible = false
						//重新加载数据
						this.initData()
						})

						this.$Message.success('Success!');
						this.delete_button=false;
            this.$refs.editor.setHtml('<p>powered by editor</p>')
					}
					else {
						this.$Message.error('Fail!');
					}
				})
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
