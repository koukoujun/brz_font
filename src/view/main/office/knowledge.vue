<template>
    <div>
        <!--筛选工具-->
        <Row style="margin-bottom: 10px;" align="bottom" >
            <Col :span="4" style="margin-right:2rem;">
                <Input search enter-button size="small" v-model="keyword" placeholder="输入问题" @on-search="query"/>
            </Col>
            <Col :span="4">
            <Row>
            	<Col :span="16">
                  <Select v-model="style" size="small" >
                      <Option value="专业术语累积">专业术语累积</Option>
                      <Option value="解决问题方案累积">解决问题方案累积</Option>
                      <Option value="案例累积">案例累积</Option>
                      <Option value="其他累积">其他累积</Option>
                      <Option value="全部">全部</Option>
                  </Select>
            	</Col>
            	<Col :span="8">
            		<Button type="primary" size="small" icon="ios-search" style="margin-left:10px;" @click="tablechoose()" ></Button>
            	</Col>
            </Row>
            </Col>
            <Col :span="2">
                <Button type="success" size="small" @click="refresh">
                    <Icon type="ios-refresh"></Icon>
                    刷新
                </Button>
            </Col>
            <Col :span="2">
                <Button type="success" size="small" @click="add">
                    <Icon type="ios-add"></Icon>
                    添加
                </Button>
            </Col>
        </Row>
        <!--专业术语累积表格-->
        <div v-show="table1">
				<h3>专业术语累积</h3>
        <Table :data="data1.data"  :columns="col"  size="small" highlight-row @on-current-change="row=>curr=row" >
            <template slot-scope="{ row, index }" slot="action">
              <Button type="default" size="small" style="margin-right: 5px"   @click="detail()">查看</Button>
              <Button type="primary" size="small" style="margin-right: 5px"   @click="edit(row)">编辑</Button>
            </template>
        </Table>
        <Page style="margin:10px 0;" :total="data1.total" :page-size="data1.per_page" size="small" show-totalshow-elevator @on-change="onPage"></Page>
        </div>
				<!--解决问题方案累积表格-->
        <div v-show="table2">
				<h3>解决问题方案累积</h3>
				<Table :data="data2.data"  :columns="col"  size="small" highlight-row @on-current-change="row=>curr=row" >
				    <template slot-scope="{ row, index }" slot="action">
              <Button type="default" size="small" style="margin-right: 5px"   @click="detail()">查看</Button>
              <Button type="primary" size="small" style="margin-right: 5px"   @click="edit(row)">编辑</Button>
				    </template>
				</Table>
				<Page style="margin:10px 0;" :total="data2.total" :page-size="data2.per_page" size="small" show-totalshow-elevator @on-change="onPage"></Page>
        </div>
				<!-- 案例累积累积表格-->
        <div v-show="table3">
				<h3> 案例累积</h3>
				<Table :data="data3.data"  :columns="col"  size="small" highlight-row @on-current-change="row=>curr=row" v-show="table3" >
				    <template slot-scope="{ row, index }" slot="action">
              <Button type="default" size="small" style="margin-right: 5px"   @click="detail()">查看</Button>
              <Button type="primary" size="small" style="margin-right: 5px"   @click="edit(row)">编辑</Button>
				    </template>
				</Table>
				<Page style="margin:10px 0;" :total="data3.total" :page-size="data3.per_page" size="small" show-totalshow-elevator @on-change="onPage"></Page>
        </div>
				<!-- 其他累积表格-->
        <div v-show="table4">
				<h3> 其他累积</h3>
				<Table :data="data4.data"  :columns="col"  size="small" highlight-row @on-current-change="row=>curr=row" >
				    <template slot-scope="{ row, index }" slot="action">
              <Button type="default" size="small" style="margin-right: 5px"   @click="detail()">查看</Button>
              <Button type="primary" size="small" style="margin-right: 5px"   @click="edit(row)">编辑</Button>
				    </template>
				</Table>
				<Page style="margin:10px 0;" :total="data4.total" :page-size="data4.per_page" size="small" show-totalshow-elevator @on-change="onPage"></Page>
        </div>
        <!-- 详情-->
        <Drawer title="详情" placement="left" :closable="false" v-model="showDetailDrawer">
			    <div v-html="currDetailTable"></div>
        </Drawer>
         <!-- 简历表单-->
        <Modal v-model="formVisible" width="73" :title="formMode==='add'?'添加知识管理信息':'编辑知识管理信息'" footer-hide  @on-cancel="form={brand_right:0}">
          <Form :model="form" :label-width="120" :rules="formInline" ref="form" inline >
							<Row :gutter="15">
							<!-- 第一行-->
							<Row>
								<Col :span="12">
									<FormItem label="添加类型" prop="category" >
											<Select v-model="form.category" size="small" style="width:8rem;" >
													<Option value="专业术语累积">专业术语累积</Option>
													<Option value="解决问题方案累积">解决问题方案累积</Option>
													<Option value="案例累积">案例累积</Option>
													<Option value="其他累积">其他累积</Option>
											</Select>
									</FormItem>
								</Col>
								<Col :span="12">
									<FormItem label="知识标题" prop="title" >
										 <Input v-model="form.title" size="small" placeholder="请填写知识标题" ></Input>
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
  import { knowledgeDetailTable} from '@/libs/data-office'
  import ChinaArea from '@/libs/China-area'
	import Editor from '_c/editor'

  export default {
		components: { Editor},
    data () {
      return {
        pageNum: 1,//页码
        data1: {},//数据1
        data2: {},//数据2
        data3: {},//数据3
        data4: {},//数据3
        //表单筛选
        style:'',
        table1:true,
        table2:true,
        table3:true,
        table4:true,
        curr: {},//当前row
        currDetailTable: '',//详情html
        showDetailDrawer: false,//是否显示简历详情抽屉
        keyword: '',//搜索关键字
        ChinaArea: ChinaArea,//中国行政区数据
		    imgshow:true,
				content:"",//富文本编辑内容
				// 工作汇报表头信息
				col:[
          {
          	title:'编号',
          	key:'id'
          },
          {
          	title:'发表人',
          	key:'name'
          },
					{
						title:'标题',
						key:'title'
					},
					{
						title:'内容',
						key:'content'
					},
					{
						title:'添加时间',
						key:'create_at'
					},
					 {
						title: '操作',
						slot: 'action',
						width: '150px',
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
					title: "",
					content: "",//*
					category:""//*
						},
				//验证规则
				formInline: {
					title: [
						{ required: true, message: '请填写标题', trigger: 'blur' },
					],
					category: [
						{ required: true, message: '请选择添加类别', trigger: 'blur',pattern:/.+/ },
					]
				},
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
          this.$refs.editor.setHtml('')
				},
				watch: {
					curr (_new) {
						this.currDetailTable = dataToTable(_new, knowledgeDetailTable)
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
						//请求接口-01
						apiRequest(api.Knowledge.getList,
							params,
							ret => {
								this.data1 = ret
							})
            //请求接口-02
            apiRequest(api.Knowledge.getListtwo,
              params,
              ret => {
                this.data2 = ret
              })
            //请求接口-03
            apiRequest(api.Knowledge.getListthree,
              params,
              ret => {
                this.data3 = ret
              })
            //请求接口-04
            apiRequest(api.Knowledge.getListfour,
              params,
              ret => {
                this.data4 = ret
              })
					},
					// 复文本01
					handleChange (html, text) {
            this.form.content = text
					},
					//富文本02
					changeContent () {
					  this.$refs.editor.setHtml('')
					},
          //表单筛选
          tablechoose(){
            switch(this.style){
              case '专业术语累积':
                 this.table1=true,this.table2=false,this.table3=false,this.table4=false;
                 break;
              case '解决问题方案累积':
                 this.table1=false,this.table2=true,this.table3=false,this.table4=false;
                 break;
              case '案例累积':
                 this.table1=false,this.table2=false,this.table3=true,this.table4=false;
                 break;
              case '其他累积':
                 this.table1=false,this.table2=false,this.table3=false,this.table4=true;
                 break;
              case '全部':
                 this.table1=true,this.table2=true,this.table3=true,this.table4=true;
                 break;
            }
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
          //查看
          detail(){
            this.showDetailDrawer = true;
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
				  //提交客户表单
					submit (name) {
				  this.$refs[name].validate((valid) => {
					if (valid) {
              const apiName = this.formMode === 'add' ? api.Knowledge.add : api.Knowledge.edit
              apiRequest(apiName, objFilter(this.form), ret => {
              //清空form表单
              this.form = { brand_right: 0 },
              //关闭表单modal
              this.formVisible = false
              //重新加载数据
              this.initData()
              this.$Message.success('Success!');
              this.delete_button=false
              this.$refs.editor.setHtml('')
              })
					}
					else {
						this.$Message.error('Fail!');
					}
				})
      },
      //删除简历表单
      deletes(){
        const apiName = this.formMode = api.Knowledge.del
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
