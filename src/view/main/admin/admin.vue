<template>
    <div>
        <!--筛选工具-->
        <Row :gutter="24" style="margin-bottom: 10px">
            <Col span="4">
                <Input search enter-button size="small" v-model="keyword" placeholder="输入姓名/电话" @on-search="query"/>
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
                <Button type="default" size="small" style="margin-right: 5px"   @click="customerActionMenuHandler(name='detail')">查看</Button>
                <Button type="primary" size="small" style="margin-right: 5px"   @click="edit(row)">编辑</Button>
                <Button type="info" size="small" style="margin-right: 5px"   @click="re(row)">重置密码</Button>
            </template>
        </Table>
        <Page style="margin:10px 0;" :total="data.total" :page-size="data.per_page" size="small" show-total
              show-elevator @on-change="onPage"></Page>
         <!-- 详情-->
        <Drawer title="详情" placement="left" :closable="false" v-model="showDetailDrawer">
            <div v-html="currDetailTable"></div>
        </Drawer>
         <!-- 简历表单-->
        <Modal v-model="formVisible" class-name="vertical-center-middle" :title="formMode==='add'?'添加管理员信息':'编辑管理员信息'" footer-hide
               @on-cancel="form={brand_right:0}">
            <Form :model="form" :label-width="150" :rules="formInline" ref="form" inline >
										<FormItem label="姓名" prop="name" >
												<Input v-model="form.name" size="default" placeholder="请填写姓名" style="width:10rem;" ></Input>
										</FormItem>
										<FormItem label="部门" prop="department_id">
											 <Select v-model="form.department_id" size="default" style="width:10rem;"  >
                         <Option :value="i" v-for="i in option.departmentList">{{i.area}}{{i.name}}</Option>
											 </Select>
									  </FormItem>
										<FormItem label="账号" prop="username">
												<Input v-model="form.username" type="number" size="default" placeholder="请填写账号" style="width:10rem;" ></Input>
										</FormItem>
                    <FormItem label="密码" v-show="passwordShow"  >
                    		<Input v-model="form.password" type="number" size="default" placeholder="请填写密码" style="width:10rem;" ></Input>
                    </FormItem>
                    <FormItem label="再次输入密码"  v-show="passwordShow"   >
                    		<Input v-model="form.password_confirm" type="number" size="default" placeholder="请再次填写密码" style="width:10rem;" ></Input>
                    </FormItem>
										<FormItem label="角色" prop="role_id">
											 <Select v-model="form.role_id"  size="default" style="width:10rem;" @on-change="show()" >
                            <Option :value="i[1]" v-for="i in RoleData" >{{i[0]}}</Option>
												</Select>
										</FormItem>
                   <FormItem label="权限范围" v-show="super_show" >
                    <template>
                        <div v-show="areaTitleShow" >
                          <RadioGroup v-model="form.area_title" @on-change="area" >
                              <Radio label="个人"></Radio>
                              <Radio label="部门"></Radio>
                              <Radio label="地区" v-show="areaAllShow" ></Radio>
                          </RadioGroup>
                        </div>
                        <div style="border-top: 1px solid #e9e9e9;padding-bottom:6px;margin-bottom:6px;" v-show="areaShow" >
                        <CheckboxGroup v-model="area_titles">
                            <Checkbox label="西安"></Checkbox>
                            <Checkbox label="太原"></Checkbox>
                            <Checkbox label="济南"></Checkbox>
                            <Checkbox label="渭南"></Checkbox>
                            <Checkbox label="青岛"></Checkbox>
                        </CheckboxGroup>
                        </div>
                    </template>
                    </FormItem>
									<FormItem label="头像上传">
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
                    <Button style="margin-left: 8px" @click="formVisible=false">取消</Button>
                 </FormItem>
            </Form>
        </Modal>
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
  import { adminDetailTable, adminHeadTable, } from '@/libs/data-admin'
  import ChinaArea from '@/libs/China-area'

  export default {
    data () {
      return {
        col: adminHeadTable,//表头
        pageNum: 1,//页码
        data: {},//数据
        curr: {},//当前row
        currDetailTable: '',//详情html
        showDetailDrawer: false,//是否显示简历抽屉
        keyword: '',//搜索关键字
        ChinaArea: ChinaArea,//中国行政区数据
        passwordShow:true,
        RoleData:[],
        //权限选项
        areaShow:false,
        area_titles:[],
        //权限显示
        areaAllShow:true,
        areaTitleShow:true,
        super_show:true,
        //上传照片
        uploadUrl: getBaseUrl() + api.Common.upload + '?token=' + getToken(),
        uploadList: [],//图片上传截图列表
        defaultUploadList: [],//默认上传列表
        imgModalVisible: false,
        previewImg: '',
        imgshow:true,

        //表单选项
        option: {
          fromList: [],
          cityList: [],
          lessonList: [],
          departmentList:[],
        },
        //客户表单
        form: {
					name: "",
					username: "",
          icon:"",
					password: "",
          password_confirm:"",
					role_id: "",
          area_title:[],
					department_id: "",
        },
        //重置密码
        re_form:{
          id:"",
        },
				formInline:{
					name:[
						{required:true,message:'请填写姓名',trigger:'blur'}
					],
					department_id:[
						{required:true,message:'请选择部门',trigger:'blur',type:'number'}
					],
					username:[
						{required:true,message:'请填写账号',trigger:'blur'}
					],
          password:[
          	{required:true,message:'请输入密码',trigger:'blur'}
          ],
          password_confirm:[
          	{required:true,message:'请再次输入密码',trigger:'blur'}
          ],

				},
        formMode: 'add',//客户表单模式  add 添加  edit 修改
        formVisible: false,//客户表单是否显示

        //时间戳
        timestamp: 0,
      }
    },
    mounted () {
      this.initData()
      this.getOption()
      this.getRoleList()
      this.uploadList = this.$refs.upload.fileList
    },
    watch: {
      curr (_new) {
        this.currDetailTable = dataToTable(_new, adminDetailTable)
      }
    },
    methods: {
      ...mapMutations([
        'closeTag'
      ]),
      //权限编辑
      area(){
         if(this.form.area_title=="地区"){
           this.areaShow=true;
         }
         else{
           this.areaShow=false;
           this.form.area_titles=[];
         }
      },
      //获取选项
      getOption () {
        apiRequest(api.Common.getOption, {
          'list': 'from_list,city_list,lesson_list,department_list'
        }, ret => {
          this.option = {
            fromList: ret.from_list,
            cityList: ret.city_list,
            lessonList: ret.lesson_list,
            departmentList: ret.department_list,
          }
          let len = ret.department_list.length
          for(let i=0;i<len;i++){
            //console.log(ret.department_list[i].name)
          }
        })
      },
      getRoleList(){
        apiRequest(api.Role.getList,
          ret => {
            let len = ret.data.length
            for(let i= 0;i<len;i++){
              this.RoleData.push([ret.data[i].name,ret.data[i].id])
              if(i==len-1){
                //console.log(this.RoleData)
              }
            }
          })
      },
      initData () {
        const keyword = this.keyword.trim()
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

        apiRequest(api.Admin.getList,
          params,
          ret => {
            this.data = ret
            let len = ret.data.length
            for(let i=0;i<len;i++){

            }
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
        this.passwordShow = true
      },
      //编辑
      edit (row) {
        this.formMode = 'edit'
        this.formVisible = true
        this.passwordShow = false
        this.form = { ...row }
        this.form.id = row.id
      },
      //重置密码
      re(row){
        this.form.id=row.id
        apiRequest(api.Admin.re_password,this.form, ret => {
          console.log(ret)
        	this.initData()
          //this.$Message.success('Success!');
        })

      },
      //根据角色控制显示与隐藏
      show(){
         if(this.form.role_id=='6'){
           this.super_show=true
           this.areaAllShow=false
           this.areaShow=false
           this.areaTitleShow=true
         }
         else if(this.form.role_id=='1'){
           this.super_show=false
           this.areaTitleShow=false
           this.areaShow=false
         }
         else{
           this.super_show=true
           this.areaAllShow=true
           this.areaShow=false
           this.areaTitleShow=true
         }
      },
      //操作菜单
      customerActionMenuHandler (name) {
        switch (name) {
          case 'detail':
            this.showDetailDrawer = true
            break
          case 'edit':
            this.edit(this.curr)
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
      //提交客户表单
      submit (name) {

        this.form.department_id=this.form.department_id.id;//部门id

				this.$refs[name].validate((valid) => {
					if (valid) {
            if(this.form.password!=this.form.password_confirm){
              this.$Message.error('两次密码不一致！')
            }
            else{
              //权限范围
              if(this.form.area_title=="地区"){
                this.form.area_title=this.area_titles;
              }
              //转化参数
              let len = this.form.area_title.length
              for(let i=0;i<len;i++){
                if(this.form.area_title[i]=='西安'){this.form.area_title[i]='1'}
                if(this.form.area_title[i]=='太原'){this.form.area_title[i]='2'}
                if(this.form.area_title[i]=='济南'){this.form.area_title[i]='3'}
                if(this.form.area_title[i]=='渭南'){this.form.area_title[i]='4'}
                if(this.form.area_title[i]=='青岛'){this.form.area_title[i]='5'}
              }
              if(this.form.area_title=='个人'){this.form.area_title='a1'}
              if(this.form.area_title=='部门'){this.form.area_title='a2'}

              this.form.area_title=this.form.area_title.toString()
              this.form.area_title=this.form.area_title.toString()
              this.form.role_id=this.form.role_id.toString()

              const apiName = this.formMode === 'add' ? api.Admin.add : api.Admin.edit
              apiRequest(apiName, objFilter(this.form), ret => {
              	//清空form表单
              	this.form = { brand_right: 0 }
              	this.formVisible = false
              	this.initData()
                this.$Message.success('Success!');
              })
            }
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
</style>
