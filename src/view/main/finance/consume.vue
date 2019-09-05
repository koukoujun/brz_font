<template>
    <div>
        <!--筛选工具-->
        <Row :gutter="24" style="margin-bottom: 10px">
            <Col span="4">
                <Input search enter-button size="small" v-model="keyword" placeholder="输入姓名/联系方式" @on-search="query"/>
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
            </template>
        </Table>
        <Page style="margin:10px 0;" :total="data.total" :page-size="data.per_page" size="small" show-total
              show-elevator @on-change="onPage"></Page>
         <!-- 详情-->
        <Drawer title="详情" placement="left" :closable="false" v-model="showDetailDrawer">
            <div v-html="currDetailTable"></div>
        </Drawer>
         <!-- 简历表单-->
        <Modal v-model="formVisible" class-name="vertical-center-modal" :title="formMode==='add'?'添加消费记录':'编辑消费记录'" footer-hide
               @on-cancel="form={brand_right:0}">
            <Form :model="form" :label-width="120" :rules="formInline" ref="form" inline >
              <FormItem label="姓名" prop="admin_name">
                  <Input v-model="form.admin_name" size="default"  placeholder="请填写姓名"></Input>
              </FormItem>
              <FormItem label="联系方式" prop="phone">
                  <Input v-model="form.phone" size="default"  placeholder="请填写联系方式"></Input>
              </FormItem>
              <FormItem label="消费时间" prop="pay_time" >
                  <DatePicker type="date"   placeholder="Pay time" v-model="form.pay_time" style="width:10rem;" size="default" ></DatePicker>
              </FormItem>
              <FormItem label="消费事由" prop="origin">
                  <Input v-model="form.origin" size="default"  placeholder="请填写消费事由"></Input>
              </FormItem>
              <FormItem label="消费金额" prop="value">
                   <Input v-model="form.value" type="number" size="default"  placeholder="请填写消费金额"></Input>
              </FormItem>
              <FormItem label="消费地点" prop="area" >
                   <Input v-model="form.area" type="text" size="default"  placeholder="请填写消费地点"></Input>
              </FormItem>
              <FormItem label="是否报销" prop="is_report" >
                  <Select v-model="form.is_report"  style="width:10rem;" size="default">
                    <Option value="已报销">已报销</Option>
                    <Option value="未报销">未报销</Option>
                  </Select>
              </FormItem>
              <FormItem label="发票" prop="img" >
                   <input type="text" v-show="false" v-model="form.voucher_img" size="small" >
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
              <br>
              <FormItem>
                  <Button type="primary" @click="submit('form')">提交</Button>
                  <Button style="margin-left: 8px" @click="formVisible=false">取消</Button>
              </FormItem>
            </Form>
        </Modal>

        <!-- 数据统计表单 -->
        <chartconsume></Chartconsume>

        <!-- 放大Modal -->
        <!--  -->
        <Modal title="查看大图" v-model="visible" footer-hide>
        	<img :src="imgUrl" v-if="visible" style="width: 100%">
        </Modal>

    </div>
</template>
<script>
  import { api } from '@/api/api'  //引入api配置
  import { mapMutations } from 'vuex'  //状态数据存储
  import { apiRequest } from '@/api/http' //引入请求文件
  import { dataToTable, objFilter,getBaseUrl, getToken } from '@/libs/util' //引入结构化表格和表单数据过滤
  import { consumeDetailTable } from '@/libs/data-customer'//引入表头和详情数据文件
  import ChinaArea from '@/libs/China-area'
  import Chartconsume from '@/view/main/finance/chart/chart-consume'

  export default {
    components:{Chartconsume},
    data () {
      return {
        pageNum: 1,//页码
        data: {},//数据
        curr: {},//当前row
        currDetailTable: '',//详情html
        showDetailDrawer: false,//是否显示详情抽屉
        keyword: '',//搜索关键字
        ChinaArea: ChinaArea,//中国行政区数据
        formMode: 'add',//客户表单模式  add 添加  edit 修改
        formVisible: false,//客户表单是否显示
        //是否显示消费表单
        docFormVisible:false,
        //时间戳
        timestamp: 0,
        //图片放大
        visible:false,
        imgUrl:"",
        uploadUrl: getBaseUrl() + api.Common.upload + '?token=' + getToken(),
        uploadList: [],//图片上传截图列表
        defaultUploadList: [],//默认上传列表
        imgModalVisible: false,
        previewImg: '',
        imgshow:true,
        //表单选项
        option: {
          fromList: [], //用户来源数据
          cityList: [], //城市列表数据
          lessonList: [], //课程列表数据
		      paymentOriginList: [],//交费事由列表
        },
        col: [
          {
            title: '编号',
            key: 'id',
        		width:'110px'
          },
          {
            title: '姓名',
            key: 'admin_name'
          },
          {
            title: '联系方式',
            key: 'phone',
            width:'110px'
          },
          {
            title: '消费时间',
            key: 'pay_time',
        		width:"105"
          },
          {
            title: '消费事由',
            key: 'origin'
          },
          {
            title: '消费金额',
            key: 'value'
          },
          {
            title: '消费地点',
            key: 'area'
          },
          {
             title:'简历照片',
             key:'voucher_img',
        　　 align: 'center',
        　　 width: 110,
        　　 render:(h,params) => {
        　　　　　　return h('img', {
        　　　　　　　　attrs: {
        　　　　　　　　　　src: params.row.voucher_img,
                           onerror:'this.src="http://brz-crm.oss-cn-beijing.aliyuncs.com/img/20190710154417_UauI.png"'
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
            title: '到账报销',
            key: 'is_report'
          },
          {
            title: '创建日期',
            key: 'create_at'
          },
          {
            title: '操作',
            slot: 'action',
            width: 150,
            align: 'center'
          }
        ],
        //客户表单
        form: {
          admin_name: "",//姓名
          phone: "",//电话
          pay_time: "",//消费时间
          origin: "",//消费事由
          value:"",//消费金额
          area: "",//消费地点
          is_report: "",//是否报销
          voucher_img:""//发票
        },
		//验证规则
		formInline: {
        admin_name:[
          {required:true,message:'请填写姓名',trigger:'blur'}
        ],
				phone: [
					{ required: true, message: '请填写联系方式', trigger: 'blur',pattern:/.+/ },
          { type: 'string', min:11 ,max:11, message: '请填写正确的电话号码', trigger: 'blur' }
				],
        origin:[
          {required:true,message:'请填写消费事由',trigger:'blur'}
        ],
        value:[
          {required:true,message:'请填写消费金额',trigger:'blur'}
        ]
		   },
      }
    },
	//页面渲染完成后调用
    mounted () {
      this.initData()
      this.getOption()
      this.uploadList = this.$refs.upload.fileList
    },
    watch: {
      curr (_new) {
        this.currDetailTable = dataToTable(_new, consumeDetailTable)
      }
    },
    methods: {
      ...mapMutations([
        'closeTag'
      ]),
      //获取选项
      getOption () {
        apiRequest(api.Common.getOption, {
          'list': 'from_list,city_list,lesson_list,payment_origin_list'
        }, ret => {
          this.option = {
            fromList: ret.from_list,
            cityList: ret.city_list,
            lessonList: ret.lesson_list,
			      paymentOriginList:ret.payment_origin_list,
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

        apiRequest(api.Consume.getList,
          params,
          ret => {
            this.data = ret
            let len = this.data.data.length;
            for(let i=0;i<len;i++){
              // 是否到账
              if(this.data.data[i].is_report=='1'){this.data.data[i].is_report="已报销"}else{this.data.data[i].is_report="未报销"}
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

      },
      //图片上传成功
      handleImgSuccess (response, file, fileList) {
        file.url = response
        this.form.voucher_img=file.url
        //console.error(this.uploadList)
      },
      //图片上传预览
      handleView (img) {
        this.previewImg = img
        this.imgModalVisible = true
      },
      handleBeforeUpload () {
        const check = this.uploadList.length < 1
        if (!check) {
          this.$Notice.warning({
            title: '只能上传一张图片'
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
      },
      //表格图片预览
      handleViews(url) {
        this.imgUrl = url;
        this.visible = true;
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
          case 'refound':
            this.docFormVisible = true
            break
          case 'addPay':
            this.payFormVisible = true
            break
        }
      },
      //提交表单
      submit (name) {

        //转化中国标准日期格式
        //意向参课时间
        var d = new Date(this.form.pay_time);
        var datetime=d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
        this.form.pay_time=datetime.toString()

        //转化参数为0，1
        if(this.form.is_report=="已报销"){this.form.is_report="1"}else{this.form.is_report="0"}

       this.$refs[name].validate((valid) => {
        if (valid) {

					const apiName = this.formMode === 'add' ? api.Consume.add : api.Consume.edit
					apiRequest(apiName, objFilter(this.form), ret => {
						//清空form表单
						this.form = { brand_right: 0 }
						this.formVisible = false
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
</style>
