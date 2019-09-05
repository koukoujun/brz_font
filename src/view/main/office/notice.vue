<template>
    <div>
        <!--筛选工具-->
        <Row :gutter="24" style="margin-bottom: 10px">
            <Col span="4">
                <Input search enter-button size="small" v-model="keyword" placeholder="输入公告标题" @on-search="query"/>
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
                <Button type="default" size="small" style="margin-right: 5px"   @click="detail()">查看</Button>
                <Button type="primary" size="small" style="margin-right: 5px"   @click="edit(row)">编辑</Button>
            </template>
        </Table>
        <Page style="margin:10px 0;" :total="data.total" :page-size="data.per_page" size="small" show-total show-elevator @on-change="onPage"></Page>
         <!-- 详情-->
        <Drawer title="详情" placement="left" :closable="false" v-model="showDetailDrawer">
			  <div v-html="currDetailTable"></div>
        </Drawer>
         <!-- 公告表单-->
        <Modal v-model="formVisible" width="73" :title="formMode==='add'?'添加公告信息':'编辑公告信息'" footer-hide @on-cancel="form={brand_right:0}">
          <Form :model="form" :label-width="120" :rules="formInline" ref="form" inline >
							<Row :gutter="15">
							<!-- 第一行-->
							<Row >
								<Col :span="12">
									<FormItem label="公告类型" prop="category" placeholder="请选择公告类型" >
											<Select v-model="form.category" size="small" style="width:9rem;" >
													<Option value="财务公告">财务公告</Option>
													<Option value="人事公告">人事公告</Option>
													<Option value="高端中心公告">高端中心公告</Option>
                          <Option value="系统公告">系统公告</Option>
                          <Option value="综合公告">综合公告</Option>
											</Select>
									</FormItem>
								</Col>
								<Col :span="12">
									<FormItem label="公告标题" prop="title" >
										 <Input v-model="form.title" size="small" placeholder="请填写公告发布标题" ></Input>
									</FormItem>
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
    </div>
</template>
<script>
  import { api } from '@/api/api'
  import { mapMutations } from 'vuex'
  import { apiRequest } from '@/api/http'
  import { dataToTable, objFilter,getBaseUrl, getToken } from '@/libs/util'
  import { workReportDetailTable, cvHeadTable} from '@/libs/data-office'
	import Editor from '_c/editor'

  export default {
		components: { Editor},
    data () {
      return {
        pageNum: 1,//页码
        data: {},//数据
        data01:{},//数据01
        curr: {},//当前row
        currDetailTable: '',//详情html
        showDetailDrawer: false,//是否显示简历详情抽屉
        keyword: '',//搜索关键字
				content:"",//富文本编辑内容
				// 工作汇报表头信息
				col:[
					{
						title:'编号',
						key:'id'
					},
					{
						title:'发布人',
						key:'name'
					},
					{
						title:'标题',
						key:'title'
					},
					{
						title:'公告类型',
						key:'category'
					},
					{
						title:'公告内容',
						key:'content'
					},
					{
						title:'添加时间',
						key:'create_at'
					},
					 {
						title: '操作',
						slot: 'action',
						width: '200px',
						align: 'center'
					}
				],
        //表单
        form: {
          title: "",
          category:"",
          content: "",
		  },
		//验证规则
		formInline: {
			category: [
				{ required: true, message: '请选择汇报类型', trigger: 'blur' }
			],
			title: [
				{ required: true, message: '请填写标题', trigger: 'blur' },
			],
		},
		//删除是否显示
		delete_button:false,

		formMode: 'add',//客户表单模式  add 添加  edit 修改
		formVisible: false,//客户表单是否显示
		timestamp: 0,//时间戳
			}
		},
		mounted () {
			this.initData()
      this.$refs.editor.setHtml('')
		},
		watch: {
			curr (_new) {
				this.currDetailTable = dataToTable(_new, workReportDetailTable)
			}
		},
		methods: {
			...mapMutations([
				'closeTag'
			]),
     //获取数据
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
				//请求接口
				apiRequest(api.Notice.getList,
					params,
					ret => {
						this.data = ret
            console.log(this.data)
				})
			},
			// 复文本01
			handleChange (html, text) {
	     this.form.content = text
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
        this.delete_button = false
        this.$refs.editor.setHtml('')
			},
      //查看
      detail(){
        this.showDetailDrawer = true
      },
			//编辑
			edit (row) {
				this.formMode = 'edit'
				this.formVisible = true
				this.form = { ...row }
				this.form.id = row.id
        this.form.content=row.content
        this.delete_button=true
        this.$refs.editor.setHtml(this.form.content)
			},
		  //提交客户表单
			submit (name) {

      //验证
		  this.$refs[name].validate((valid) => {
			if (valid ) {

				const apiName = this.formMode === 'add' ? api.Notice.add : api.Notice.edit
				apiRequest(apiName,this.form, ret => {
				//清空form表单
				this.form = { brand_right: 0 },
				//关闭表单modal
				this.formVisible = false
				//重新加载数据
				this.initData()
				})
				this.$Message.success('Success!');
				this.delete_button=false
        this.$refs.editor.setHtml('')
			}
			else {
				this.$Message.error('Fail!');
			}
		})
   },
    //删除表单
		deletes(){
			const apiName = this.formMode = api.Notice.del
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