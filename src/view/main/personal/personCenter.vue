<template>
    <div>
     <Row type="flex" justify="center" align="middle" class="code-row-bg">
        <Col span="8" >
            <Card style="margin-right:2rem;margin-left:2rem;height:20rem;">
                <div slot="title">
                  <Row type="flex" justify="center" align="middle" class="code-row-bg">
                    <Col :span="8" >
                      <img v-bind:src="data.icon" style="width:7rem;" alt="" >
                    </Col>
                    <Col :span="16">
                     <div style="line-height:1.5rem;font-size:0.9rem;">
                       <b>{{data.name}}</b><br>
                       <a style="color: #2DB7F5;" @click="changePerson()" >修改个人资料</a><br>
                       <a style="color: #D61808" @click="changePassword()" >修改密码</a>
                     </div>
                    </Col>
                  </Row>
                </div>
                <div>
                  <Row>
                    <Col class="demo-spin-col" span="24">
                        <Spin fix>
                            <Icon type="ios-loading" size=18 class="demo-spin-icon-load"></Icon>
                            <div>Loading</div>
                        </Spin>
                    </Col>
                  </Row>
                </div>
            </Card>
        </Col>
        <Col span="16">
          <!-- 个人信息修改模块 -->
          <Card style="margin-right:5rem;margin-left:2rem;height:20rem;" >
            <!-- 修改用户信息 -->
            <div v-show="formOneVisible" style="margin-top:1.5rem;">
            <Form :model="form" :label-width="150" :rules="formInline" ref="form" inline  >
                  <FormItem label="姓名" prop="name" >
                      <Input v-model="form.name" size="default" placeholder="请填写姓名" style="width:10rem;" ></Input>
                  </FormItem><br>
                  <FormItem label="头像" prop="img" >
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
                 <FormItem>
                    <Button type="primary" @click="submit('form')">提交</Button>
                 </FormItem>
            </Form>
            </div>
            <!-- 修改用户信息 -->
            <div v-show="formTwoVisible" style="margin-top:2.5rem;">
            <Form :model="form" :label-width="150" :rules="formInline" ref="form" inline  >
              <FormItem label="原密码" prop="old_pwd" >
                  <Input v-model="forms.old_pwd" size="default" placeholder="请输入原始密码" style="width:10rem;" ></Input>
              </FormItem><br>
              <FormItem label="新密码" prop="new_pwd" >
                  <Input v-model="forms.new_pwd" size="default" placeholder="请输入新密码" style="width:10rem;" ></Input>
              </FormItem><br>
              <FormItem>
                 <Button type="primary" @click="submitPassword('forms')">提交</Button>
              </FormItem>
              </Form>
            </div>
          </Card>
        </Col>
    </Row>

    <!-- 图片预览-->
    <Modal title="图片预览" v-model="imgModalVisible" footer-hide>
        <img :src="previewImg" v-if="imgModalVisible" style="width: 100%" alt="">
    </Modal>

    </div>
</template>
<script>
  import { api } from '@/api/api'
  import { mapMutations } from 'vuex'
  import { apiRequest } from '@/api/http'
  import { dataToTable, objFilter,getBaseUrl, getToken } from '@/libs/util'
  import Cookies from 'js-cookie'

  export default {
    data () {
      return {
        adminId: '',//页码
        data: {},//数据
        curr: {},//当前row
		    imgshow:true,
        //表单
        form: {
          name:"",
          icon:"",
        },
        //密码表单
        forms:{
          old_pwd:'',
          new_pwd:''
        },
        //验证规则
        formInline: {
          category: [
            { required: true, message: '请选择汇报类型', trigger: 'blur' }
          ],
          title: [
            { required: true, message: '请填写标题', trigger: 'blur' },
          ],
          report_content: [
            { required: true, message: '请填写报告内容', trigger: 'blur',pattern:/.+/ },
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

        formOneVisible:false,
        formTwoVisible:false,


        //时间戳
        timestamp: 0,
			}
		},
		mounted () {
      //存入admin_id
      this.admiId = Cookies.get('admin_id')
			this.initData()
      this.uploadList = this.$refs.upload.fileList
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
				const params = {id: this.admiId,}
				//请求管理员列表
				apiRequest(api.Admin.onlinePerson,
				  params,
				  ret => {
           this.data=ret.data[0]
           if(ret.data[0].icon==""){
             ret.data[0].icon="http://brz-crm.oss-cn-beijing.aliyuncs.com/img/20190710154039_MQ1A.jpg"
           }
				 })
			},
		//图片上传开始
		//图片上传成功
		handleImgSuccess (response, file, fileList) {
			file.url = response
      this.imgshow=false
      this.form.icon=file.url;
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
    //修改用户资料
    changePerson(){
      this.formOneVisible = true
      this.formTwoVisible = false
    },
    //更改密码
    changePassword(){
      this.formOneVisible = false
      this.formTwoVisible = true
    },
    //提交更改密码
    submitPassword(){
      apiRequest(api.Admin.password,this.forms, ret => {
      //清空form表单
      this.forms = { brand_right: 0 },
      this.$Message.success('密码修改成功');
      })
    },
		//提交客户表单
			submit (name) {
		  this.$refs[name].validate((valid) => {
			if (valid) {
				const apiName = this.formMode === 'add' ? api.Admin.updates : api.Admin.updates
				apiRequest(apiName,this.form, ret => {
				//清空form表单
				this.form = { brand_right: 0 },
				//关闭表单modal
				this.formVisible = false
				//重新加载数据
				this.initData()
				})

				this.$Message.success('Success!');
			}
			else {
				this.$Message.error('Fail!');
			 }
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

    .demo-spin-icon-load{
        animation: ani-demo-spin 1s linear infinite;
    }
    @keyframes ani-demo-spin {
        from { transform: rotate(0deg);}
        50%  { transform: rotate(180deg);}
        to   { transform: rotate(360deg);}
    }
    .demo-spin-col{
        height: 12rem;
        position: relative;
    }
</style>
