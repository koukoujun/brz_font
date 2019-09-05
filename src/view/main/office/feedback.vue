<template>
    <div>
        <!--筛选工具-->
        <Row :gutter="24" style="margin-bottom: 10px">
            <Col span="4">
                <Input search enter-button size="small" v-model="keyword" placeholder="输入查找内容" @on-search="query"/>
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
         <!-- 简历表单-->
        <Modal v-model="formVisible" class-name="vertical-center-modal" :title="formMode==='add'?'添加反馈信息':'编辑反馈信息'" footer-hide
         @on-cancel="form={brand_right:0}">
            <Form :model="form" ref="form" :label-width="120" :rules="formInline" inline>
									<FormItem label="上传图片">
									     	 <input type="text" v-show="false" v-model="form.img" size="small" >
									       <div style="width:600px;">
									         <div  class="demo-upload-list" v-for="item in uploadList">
									             <template v-if="item.status === 'finished'">
									                 <img :src="item.url">
									                 <div class="demo-upload-list-cover">
									                     <Icon type="ios-eye-outline" @click.native="handleView(item.url)"></Icon>
									                     <Icon type="ios-trash-outline" @click.native="handleRemove(item)"></Icon>
									                 </div>
									             </template>
									             <template v-else>
									                 <Progress v-if="item.showProgress" :percent="item.percentage" hide-info></Progress>
									             </template>
									         </div>
									     	<div v-show="imgshow">
									         <Upload
									                 ref="upload"
									                 :on-success="handleImgSuccess"
									                 :format="['jpg','jpeg','png']"
									                 :default-file-list="defaultUploadList"
									                 :max-size="2048"
									                 :show-upload-list="false"
									                 :before-upload="handleBeforeUpload"
									                 :on-format-error="handleFormatError"
									                 :on-exceeded-size="handleMaxSize"
									                 multiple
									                 type="drag"
									                 :action="uploadUrl"
									                 style="display: inline-block;width:58px;">
									             <div style="width: 58px;height:58px;line-height: 58px;">
									                 <Icon type="ios-camera" size="20"></Icon>
									             </div>
									         </Upload>
									     	</div>
									     </div>
									</FormItem>
					      <FormItem label="反馈" prop="content" >
					         <Input type="textarea" placeholder="反馈信息" :autosize="{minRows: 4,maxRows: 6}" v-model="form.content"></Input>
					      </FormItem>
                <FormItem>
                    <Button type="primary" @click="submit('form')">提交</Button>
                    <Button style="margin-left: 8px;" v-show="delete_button" type="error" @click="deletes">删除</Button>
                    <Button style="margin-left: 8px" @click="formVisible=false">取消</Button>
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
  import { feedbackDetailTable} from '@/libs/data-office'
  import ChinaArea from '@/libs/China-area'

  export default {
    data () {
      return {
        pageNum: 1,//页码
        data: {},//数据
        curr: {},//当前row
        currDetailTable: '',//详情html
        showDetailDrawer: false,//是否显示详情抽屉
        keyword: '',//搜索关键字
        ChinaArea: ChinaArea,//中国行政区数据
		    adminList:[],//管理员列表
		    imgshow:true,
        //表单选项
        option: {
          fromList: [],
          cityList: [],
          lessonList: [],
        },
        //通讯录表单
        form: {
          admin_id: "",
          content: "",
          img: "",
          name: ""
        },
        //用户反馈
        col:[
          {
           title:'编号',
           key:'id'
          },
          {
           title:'反馈人',
           key:'name'
          },
          {
           title:'反馈内容',
           key:'content',
           width:'500'
          },
          {
           title:'图片',
           key:'img',
        　　 align: 'center',
        　　 width: 200,
        　　 render:(h,params) => {
        　　　　　　return h('img', {
        　　　　　　　　attrs: {
        　　　　　　　　　src: params.row.img,
                         onerror:'this.src="http://brz-crm.oss-cn-beijing.aliyuncs.com/img/20190710154039_MQ1A.jpg"'
        　　　　　　　　},
        　　　　　　　　style: {
        　　　　　　　　　marginRight: '5px',
                         width:'40px'
        　　　　　　　　},
        　　　　　　　　on:{
                  click:(e)=>{
                    this.handleViews(e.srcElement.currentSrc)
                  }
        　　　　 }
        　　　});
        　　},
          },
          {
           title:'创建时间',
           key:'create_at'
          },
          {
            title: '操作',
            slot: 'action',
            width: '200px',
            align: 'center'
          }
        ],
        //验证规则
        formInline: {
          name: [
              { required: true, message: '请填写姓名', trigger: 'blur' }
          ],
          content: [
              { required: true, message: '请填写反馈内容', trigger: 'blur' },
          ]
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
        timestamp: 0,//时间戳
      }
    },
    mounted () {
        this.initData()
        this.getOption()
        this.uploadList = this.$refs.upload.fileList
    },
    watch: {
        curr (_new) {
          this.currDetailTable = dataToTable(_new, feedbackDetailTable)
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
        apiRequest(api.Feedback.getList,
          params,
          ret => {
            this.data = ret
          })
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
        this.showDetailDrawer= true;
      },
      //编辑
      edit (row) {
        this.formMode = 'edit'
        this.formVisible = true
        this.form = { ...row }
        this.form.id = row.id
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
			 this.$refs[name].validate((valid) => {
						if (valid) {
								const apiName = this.formMode === 'add' ? api.Feedback.add : api.Feedback.edit
								apiRequest(apiName, objFilter(this.form), ret => {
								  //清空form表单
								  this.form = { brand_right: 0 }
								  this.formVisible = false
								  this.initData()
								})
								this.$Message.success('Success!');
                this.delete_button=false
						}
						else {
								this.$Message.error('Fail!');
						}
				})
      },
      //删除表单
      deletes(){
      	const apiName = this.formMode = api.Feedback.del
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
