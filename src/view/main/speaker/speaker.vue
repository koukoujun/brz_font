<template>
    <div>
        <!--筛选工具-->
        <Row :gutter="24" style="margin-bottom: 10px">
            <Col span="4">
                <Input search enter-button size="small" v-model="keyword" placeholder="输入姓名" @on-search="query"/>
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
        <Modal v-model="formVisible" class-name="vertical-center-modal" :title="formMode==='add'?'添加讲师信息':'编辑讲师信息'" footer-hide
        @on-cancel="form={brand_right:0}">
            <Form :model="form" :label-width="120" :rules="formInline" ref="form" inline >
              <Row>
                <Col :span="12">
                  <FormItem label="课程名称" prop="lesson_name" >
                      <Input v-model="form.lesson_name" size="small" type="text" placeholder="请填写课程名称" ></Input>
                  </FormItem>
                </Col>
                <Col :span="12">
                  <FormItem label="开讲人" prop="speaker" >
                      <Input v-model="form.speaker" size="small"  placeholder="请填写开讲人"></Input>
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col :span="12">
                  <FormItem label="开课地点" prop="area">
                      <Select v-model="form.area" size="small" placeholder="请选择开课地点" style="width:7rem;" >
                          <Option :value="i" v-for="i in option.cityList">{{i}}</Option>
                      </Select>
                  </FormItem>
                </Col>
                <Col :span="12">
                  <FormItem label="开课性质" prop="nature" >
                      <Input v-model="form.nature" size="small" placeholder="请填写开课性质"></Input>
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col :span="12">
                  <FormItem label="参课人数" prop="people_number" >
                      <Input v-model="form.people_number" type="number" size="small" placeholder="请填写参课人数" ></Input>
                  </FormItem>
                </Col>
                <Col :span="12">
                  <FormItem label="讲课费" prop="money" >
                      <Input size="small" v-model="form.money" type="number" placeholder="请填写讲课费用"></Input>
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col :span="12">
                  <FormItem label="会务成本" prop="cost">
                      <Input size="small" v-model="form.cost" type="number" placeholder="请填写会务成本"></Input>
                  </FormItem>
                </Col>
                <Col :span="12">
                  <FormItem label="门票收入" prop="ticket" >
                      <Input v-model="form.ticket" type="number" size="small" placeholder="请填写门票收入"></Input>
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col :span="12">
                  <FormItem label="课程收款额">
                      <Input v-model="form.gathering" type="number" size="small" placeholder="请填写门票收入"></Input>
                  </FormItem>
                </Col>
                <Col :span="12">

                </Col>
              </Row>
                <FormItem label="现场报名情况" prop="apply" >
                   <input type="text" v-show="false" v-model="form.apply" size="small" >
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
            <Modal style="text-align: center;" v-model="modal1" title="请选择导出页数" @on-ok="exportData(4)" >
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
  import { speakerDetailTable, speakerHeadTables} from '@/libs/data-speaker'
  import ChinaArea from '@/libs/China-area'

  export default {
    data () {
      return {
        cols: speakerHeadTables,//简历表头
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
            title:'课程名称',
            key:'lesson_name',
          },
          {
            title:'开讲人',
            key:'speaker'
          },
          {
            title:'开课地点',
            key:'area'
          },
          {
            title:'参课人数',
            key:'people_number'
          },
          {
            title:'讲课费',
            key:'money'
          },
          {
            title:'会务成本',
            key:'cost'
          },
          {
            title:'门票收入',
            key:'ticket'
          },
          {
             title:'现场报名情况',
             key:'apply',
        　　 align: 'center',
        　　 width: 110,
        　　 render:(h,params) => {
        　　　　　　return h('img', {
        　　　　　　　　attrs: {
        　　　　　　　　　　src: params.row.apply,
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
            title:'课程收款额',
            key:'gathering'
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
          lesson_name: "",//*
          speaker: "",
          area: "",//*
          nature: "",//*
          people_number: "",
          money: "",//*
          cost: "",
          ticket: "",
          apply: "",
          gathering: "",
        },
		//验证规则
		formInline: {
			lesson_name: [
				{ required: true, message: '请填写课程姓名', trigger: 'blur' },
			],
			speaker: [
				{ required: true, message: '请填写讲师姓名', trigger: 'blur' },
			],
			people_number:[
				{required:true,message:'请填写参课人数',trigger:'blur'},
			],
			money: [
				{ required: true, message: '请填写讲课费用', trigger: 'blur',pattern:/.+/ },
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

    //时间戳
    timestamp: 0,
      }
    },
    mounted () {
      this.initData()
      this.getOption()
	    this.uploadList = this.$refs.upload.fileList
    },
    watch: {
      curr (_new) {
        this.currDetailTable = dataToTable(_new, speakerDetailTable)
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
        apiRequest(api.Speaker.getList,
          params,
          ret => {
            this.data = ret
            this.pageAll = ret.last_page
            let len = this.data.data.length;
            for(let i=0;i<len;i++){
              this.data.data[i].area=this.data.data[i].area.toString()
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
                 apiRequest(api.Speaker.getList,params,ret => {
                   let len = ret.data.length;
                   for(let i=0;i<len;i++){
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
      this.form.apply=file.url;
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
        // 添加单位
        this.form.people_number=this.form.people_number.toString();
        this.form.money=this.form.money.toString();
        this.form.cost=this.form.cost.toString();
        this.form.ticket=this.form.ticket.toString();
        this.form.gathering=this.form.gathering.toString();

				const apiName = this.formMode === 'add' ? api.Speaker.add : api.Speaker.edit
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
        const apiName = this.formMode = api.Speaker.del
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
