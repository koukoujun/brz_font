<template>
    <div>
        <!--筛选工具-->
        <Row :gutter="24" style="margin-bottom: 10px">
            <Col span="4">
                <Input search enter-button size="small" v-model="keyword" placeholder="输入姓名" @on-search="query"/>
            </Col>
            <Col span="4">
                 <Row>
                   <Col :span="16">
                     <DatePicker size="small" v-model="time" format="yyyy/MM/dd" type="daterange" placement="bottom-end" placeholder="Select date">
                     </DatePicker>
                   </Col>
                   <Col :span="8">
                     <Button type="primary" size="small" icon="ios-search" style="margin-left:10px;" @click="query()"></Button>
                   </Col>
                 </Row>
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
            <Col span="4">
                <Button type="primary" size="small" @click="modal1=true"><Icon type="ios-download-outline"></Icon>导出数据</Button>
            </Col>
        </Row>
        <!--表格-->
        <Table :data="data.data"  :columns="col" ref="table"  size="small" highlight-row @on-current-change="row=>curr=row">
            <template slot-scope="{ row, index }" slot="action">
              <Button type="default" size="small" style="margin-right: 5px"   @click="customerActionMenuHandler(name='detail')">查看</Button>
              <Button type="primary" size="small" style="margin-right: 5px"   @click="edit(row)">编辑</Button>
            </template>
        </Table>
        <Page style="margin:10px 0;" :total="data.total" :page-size="data.per_page" size="small" show-total show-elevator @on-change="onPage"></Page>
         <!-- 详情-->
        <Drawer title="详情" placement="left" :closable="false" v-model="showDetailDrawer">
			    <div v-html="currDetailTable"></div>
        </Drawer>
         <!-- 简历表单-->
        <Modal v-model="formVisible" class-name="vertical-center-modal" :title="formMode==='add'?'添加简历信息':'编辑简历信息'" footer-hide @on-cancel="form={brand_right:0}">
            <Form :model="form" :label-width="100" :rules="formInline" ref="form" inline >
              <Row>
                <Col :span="12">
                  <FormItem label="姓名" prop="name" >
                      <Input v-model="form.name" size="small" type="text" placeholder="请填写姓名" style="width:8rem;" ></Input>
                  </FormItem>
                </Col>
                <Col :span="12">
                  <FormItem label="年龄" prop="age" >
                      <Input v-model="form.age" size="small"  placeholder="请填写年龄" style="width:8rem;"></Input>
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col :span="12">
                  <FormItem label="面试状态" prop="interview_status">
                    <Select v-model="form.interview_status" size="small" style="width:8rem;">
                      <Option value="未面试">未面试</Option>
                      <Option value="已面试">已面试</Option>
                    </Select>
                  </FormItem>
                </Col>
                <Col :span="12">
                  <FormItem label="面试岗位" prop="job" >
                      <Input v-model="form.job" size="small" placeholder="请填写面试岗位" style="width:8rem;"></Input>
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col :span="12">
                  <FormItem label="面试结果" prop="interview_result" >
                      <Select v-model="form.interview_result" size="small" style="width:8rem;">
                        <Option value="未通过">未通过</Option>
                        <Option value="已通过">已通过</Option>
                    </Select>
                  </FormItem>
                </Col>
                <Col :span="12">
                  <FormItem label="是否入职" prop="is_entry" >
                      <RadioGroup v-model="form.is_entry" style="width:8rem;">
                          <Radio label="已入职">已入职</Radio>
                          <Radio label="未入职">未入职</Radio>
                      </RadioGroup>
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col :span="12">
                    <FormItem label="渠道" prop="channel">
                      <Select v-model="form.channel" size="small" style="width:8rem;">
                          <Option value="Boss直聘">Boss直聘</Option>
                          <Option value="前程无忧">前程无忧</Option>
                          <Option value="拉勾网">拉勾网</Option>
                          <Option value="猎聘网">猎聘网</Option>
                          <Option value="智联招聘">智联招聘</Option>
                          <Option value="推荐">推荐</Option>
                      </Select>
                    </FormItem>
                </Col>
                <Col :span="12">
                    <FormItem label="面试人" prop="hr_name" >
                        <Input v-model="form.hr_name" size="small" placeholder="请填写面试人" style="width:8rem;"></Input>
                    </FormItem>
                </Col>
              </Row>
              <Row>
                <Col :span='12'>
                  <FormItem label="简历照片" prop="img" >
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
                </Col>
                <Col :span='12'>
                  <FormItem label="预约面试时间" prop="order_time" >
                      <DatePicker type="datetime" format="yyyy-MM-dd HH:mm" size="small" placeholder="请选择面试时间" v-model="form.order_time" style="width: 8rem;" ></DatePicker>
                  </FormItem>
                </Col>
              </Row>

              <FormItem label="面试人评价">
                  <Input type="textarea" placeholder="简历信息备注" :autosize="{minRows: 4,maxRows: 6}" v-model="form.hr_evaluation"></Input>
              </FormItem>
              <FormItem>
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
          <!-- 导出数据表单 -->
          <template>
              <Modal style="text-align: center;" v-model="modal1" title="请选择导出页数" @on-ok="exportData(4)">
                 <Row >
                   <Col :span="12" >
                     <template>
                         <Icon type="ios-arrow-round-forward" size="35" />
                         <InputNumber :max="pageAll" :min="1" v-model="exportA"  ></InputNumber>
                     </template>
                   </Col>
                   <Col :span="12" >
                     <template>
                         <Icon type="ios-arrow-round-forward" size="35" />
                         <InputNumber :max="pageAll" :min="1" v-model="exportB"  ></InputNumber>
                     </template>
                   </Col>
                 </Row>
              </Modal>
          </template>
       </div>
</template>
<script>
  import { api } from '@/api/api'
  import { mapMutations } from 'vuex'
  import { apiRequest } from '@/api/http'
  import { dataToTable, objFilter,getBaseUrl, getToken } from '@/libs/util'
  import { cvDetailTable, cvHeadTable,cvHeadTables} from '@/libs/data-staffmange'
  import ChinaArea from '@/libs/China-area'

  export default {
    data () {
      return {
        cols: cvHeadTables,//简历表头
        pageNum: 1,//简历页码
        modal1:false,//导出modal
        outData:[],//导出数据
        exportA:1,//导出页码
        exportB:1,//导出页码
        pageAll:1,
        data: {},//简历数据
        curr: {},//简历当前row
        currDetailTable: '',//简历详情html
        showDetailDrawer: false,//是否显示简历详情抽屉
        keyword: '',//搜索关键字
        ChinaArea: ChinaArea,//中国行政区数据
        imgshow:true,
        // 简历表头信息
        col:[
          {
            title:'编号',
            key:'id'
          },
          {
            title:'姓名',
            key:'name',
          },
          {
            title:'年龄',
            key:'age'
          },
          {
            title:'预约面试时间',
            key:'order_time'
          },
          {
            title:'面试状态',
            key:'interview_status'
          },
          {
            title:'面试人',
            key:'hr_name'
          },
          {
            title:'面试结果',
            key:'interview_result'
          },
          {
            title:'是否入职',
            key:'is_entry'
          },
          {
            title:'渠道',
            key:'channel'
          },
          {
             title:'简历照片',
             key:'img',
        　　 align: 'center',
        　　 width: 110,
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
            title:'面试人评价',
            key:'hr_evaluation'
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
      name: "",//*
      img: "",
      age: "",//*
      job: "",//*
      interview_status: "",
      hr_name: "",//*
      interview_result: "",
      is_entry: "",
      channel: "",
      hr_evaluation: "",
      order_time:"",
      create_at: "",
      update_at:""
    },
    //验证规则
    formInline: {
      name: [
        { required: true, message: '请填写姓名', trigger: 'blur' }
      ],
      age: [
        { required: true, message: '请填写年龄', trigger: 'blur' },
      ],
      job:[
        {required:true,message:'请填写面试岗位',trigger:'blur'},
      ],
      hr_name: [
        { required: true, message: '请填写hr姓名', trigger: 'blur',pattern:/.+/ },
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
    time:'',
      }
    },
    mounted () {
      this.initData()
      this.getOption()
      this.uploadList = this.$refs.upload.fileList
    },
    watch: {
      curr (_new) {
        this.currDetailTable = dataToTable(_new, cvDetailTable)
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
        //搜索关键字-开始时间
        const time_start = parseInt(this.time_start);
        //搜索关键字-结束时间
        const time_end = parseInt(this.time_end);
        const params = {
          pageNum: this.pageNum,
        }
        //关键字筛选
        if (keyword) {
          params.keyword = keyword
        }
        //关键字筛选-开始时间
        if (time_start) {
          params.time_start = time_start
        }
        //关键字筛选-结束时间
        if (time_end) {
          params.time_end = time_end
        }
        //分组筛选
        if (group) {
          params.group = group
        }
        //请求接口
        apiRequest(api.Cv.getList,
          params,
          ret => {
            this.data = ret
            this.pageAll = ret.last_page
            //年龄转化数据类型
            //判断是否面试
            let len = this.data.data.length;
            for(let i=0;i<len;i++){
              //电话-转化科学计数法
              this.data.data[i].phone = "\t"+this.data.data[i].phone;

              //转化年龄为字符类型
              this.data.data[i].age=this.data.data[i].age.toString()

              if(this.data.data[i].interview_result==1){
                this.data.data[i].interview_result="已通过"
              }
              if(this.data.data[i].interview_result==0){
                this.data.data[i].interview_result="未通过"
              }
             }
              //判断是否入职
              for(let i=0;i<len;i++){
                //判断是否入职
                if(this.data.data[i].is_entry==1){
                  this.data.data[i].is_entry="已入职"
                }
                if(this.data.data[i].is_entry==0){
                  this.data.data[i].is_entry="未入职"
                }
                //判断面试状态
                if(this.data.data[i].interview_status==1){
                  this.data.data[i].interview_status="已面试"
                }
                if(this.data.data[i].interview_status==0){
                  this.data.data[i].interview_status="未面试"
                }
                //判断面试结果
                if(this.data.data[i].interview_result==1){
                  this.data.data[i].interview_result="已通过"
                }
                if(this.data.data[i].interview_result==0){
                  this.data.data[i].interview_result="未通过"
                }
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
        //搜索时间
        this.time_start =this.time[0]
        this.time_end = this.time[1]
        //转化中国标准日期格式
        //开始时间
        let d = new Date(this.time_start);
        let datetime=d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
        this.time_start=Date.parse(datetime);
        this.time_start = this.time_start/1000;
        //结束时间
        let d01 = new Date(this.time_end);
        let datetime01=d01.getFullYear() + '-' + (d01.getMonth() + 1) + '-' + d01.getDate();
        this.time_end=Date.parse(datetime01);
        this.time_end=this.time_end/1000;
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
        this.form.area = [row.province, row.city]
      },
      //导出数据表
      exportData (type) {
          if (type === 1) {
              this.$refs.table.exportCsv({
                  filename: 'The original data'
              });
          }
          else if (type === 2) {
              this.$refs.table.exportCsv({
                  filename: 'Sorting and filtering data',
                  original: false
              });
          }
          else if (type === 3) {
              this.$refs.table.exportCsv({
                  filename: 'Custom data',
                  columns: this.cols.filter((cols, index) => index < 100),
                  data: this.data.data.filter((data, index) => index < 100)
              });
          }
          //导出所有数据
          else if (type === 4) {
              //遍历存储数据
              var testData=[];
              let a=this.exportA;
              let b=this.exportB;
              for(a;a<=b;a++){
                 let params = {pageNum:''}
                 params.pageNum=a
                 console.log(params)
                 const keyword = this.keyword.trim()//trim去除前后空格 //客户搜索关键词
                 //搜索关键字-开始时间
                 const time_start = parseInt(this.time_start);
                 //搜索关键字-结束时间
                 const time_end = parseInt(this.time_end);
                 //关键字筛选
                 if (keyword) {
                   params.keyword = keyword
                 }
                 //关键字筛选-开始时间
                 if (time_start) {
                   params.time_start = time_start
                 }
                 //关键字筛选-结束时间
                 if (time_end) {
                   params.time_end = time_end
                 }
                 apiRequest(api.Cv.getList,params,ret => {
                   let len = ret.data.length;
                   for(let i=0;i<len;i++){
                     //判断是否入职
                     if(ret.data[i].is_entry==1){ ret.data[i].is_entry="已入职"}
                     if(ret.data[i].is_entry==0){ret.data[i].is_entry="未入职"}
                     //判断面试状态
                     if(ret.data[i].interview_status==1){ret.data[i].interview_status="已面试"}
                     if(ret.data[i].interview_status==0){ret.data[i].interview_status="未面试"}
                     //判断面试结果
                     if(ret.data[i].interview_result==1){ret.data[i].interview_result="已通过"}
                     if(ret.data[i].interview_result==0){ret.data[i].interview_result="未通过"}
                     //电话-转化科学计数法
                     ret.data[i].phone = "\t"+ret.data[i].phone;

                     testData.push(ret.data[i])
                   }
                   if(params.pageNum==b){
                     // console.log("现在可以下载数据了......................！！！！！！！！！！！！！")
                     // console.log(testData)

                     this.$refs.table.exportCsv({
                         filename: 'Custom data',
                         columns: this.cols.filter((cols, index) => index < 100),
                         data: testData.filter((data, index) => index < 1000)
                     });
                    //初始化页码选择
                     this.exportA=1
                     this.exportB=1
                   }
                })
              }
          }
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
		this.$refs[name].validate((valid) => {
			if (valid) {
        //预约面试时间
        if(this.form.order_time!=""){
          var d = new Date(this.form.order_time);
          var datetime=d.getFullYear() + '-' + (d.getMonth() + 1) + ',' + d.getDate()+'-'+d.getHours()+':'+d.getMinutes();
          this.form.order_time=datetime.toString()
        }
				//转化是否入职
				if(this.form.is_entry=="已入职"){
					this.form.is_entry=1
				}
				else if(this.form.is_entry=="未入职"){
					this.form.is_entry=0
				}
				//转化面试结果
				if(this.form.interview_result=="已通过"){
					this.form.interview_result=1
				}
				else if(this.form.interview_result=="未通过"){
					this.form.interview_result=0
				}
				//转化面试状态
				if(this.form.interview_status=="已面试"){
					this.form.interview_status=1
				}
				else if(this.form.interview_status=="未面试"){
					this.form.interview_status=0
				}

				const apiName = this.formMode === 'add' ? api.Cv.add : api.Cv.edit
				apiRequest(apiName, objFilter(this.form), ret => {
				//清空form表单
				this.form = { brand_right: 0 },
				//关闭表单modal
				this.formVisible = false
				//重新加载数据
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
    //删除简历表单
		deletes(){
			const apiName = this.formMode = api.Cv.del
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
