<template>
    <div>
        <!--筛选工具-->
        <Row :gutter="24" style="margin-bottom: 10px">
            <Col span="4">
                <Input search enter-button size="small" v-model="keyword" placeholder="输入姓名/电话" @on-search="query"/>
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
            <Col span="4">
                <Button type="primary" size="small" @click="modal1 = true" ><Icon type="ios-download-outline"></Icon>导出数据</Button>
            </Col>
        </Row>
        <!--表格-->
        <Table :data="data.data"  :columns="col"  ref="table"  size="small" highlight-row @on-current-change="row=>curr=row">
            <template slot-scope="{ row, index }" slot="action">
                <Button type="default" size="small" style="margin-right: 5px"   @click="customerActionMenuHandler(name='detail')">查看</Button>
                <Button type="primary" size="small" style="margin-right: 5px"   @click="edit(row)">编辑</Button>
                <Button type="warning" size="small" style="margin-right: 5px"   @click="customerActionMenuHandler(name='refound')">退款</Button>
            </template>
        </Table>
        <Page style="margin:10px 0;" :total="data.total" :page-size="data.per_page" size="small" show-total show-elevator @on-change="onPage"></Page>
         <!-- 详情-->
        <Drawer title="详情" placement="left" :closable="false" v-model="showDetailDrawer">
            <div v-html="currDetailTable"></div>
        </Drawer>
         <!-- 简历表单-->
        <Modal v-model="formVisible" class-name="vertical-center-modal" :title="formMode==='add'?'添加缴费记录':'编辑缴费记录'" footer-hide
               @on-cancel="form={brand_right:0}">
            <Form :model="form" :label-width="120" :rules="formInline" ref="form" inline >
                <FormItem label="交费金额" prop="value">
                    <Input v-model="form.value" size="small" type="number" placeholder="请填写金额"></Input>
                </FormItem>
                <Row>
                  <Col :span="12">
                    <FormItem label="定金/全款" prop="is_deposit" >
                      <RadioGroup v-model="form.is_deposit">
                        <Radio label="定金">定金</Radio>
                        <Radio label="全款">全款</Radio>
                      </RadioGroup>
                    </FormItem>
                  </Col>
                  <Col :span="12">
                    <FormItem label="缴费方式" prop="way" >
                        <Select v-model="form.way" size="small" style="width:7rem;" >
                            <Option value="支付宝">支付宝</Option>
                            <Option value="微信">微信</Option>
                            <Option value="公对公">公对公</Option>
                        </Select>
                    </FormItem>
                  </Col>
                </Row>
                <Row>
                  <Col span="12">
                    <FormItem label="交费事由">
                        <Select v-model="form.origin" size="small" style="width:7rem;">
                          <Option :value="i" v-for="i in option.paymentOriginList">{{i}}</Option>
                        </Select>
                    </FormItem>
                  </Col>
                  <Col span="12">
                    <FormItem label="课程类别" prop="lesson">
                        <Select v-model="form.lesson" size="small"  style="width:7rem;">
                          <Option :value="i" v-for="i in option.lessonList">{{i}}</Option>
                        </Select>
                    </FormItem>
                  </Col>
                </Row>
                <Row>
                  <Col span="12">
                    <FormItem label="交费时间" prop="pay_time"   >
                        <DatePicker type="date"   placeholder="Pay time" v-model="form.pay_time"></DatePicker>
                    </FormItem>
                  </Col>
                  <Col span="12">

                    <FormItem label="参课时间" prop="join_lesson_time"  >
                        <DatePicker type="date"  placeholder="Select date" v-model="form.join_lesson_time"></DatePicker>
                    </FormItem>
                  </Col>
                </Row>
                <Row>
                  <Col span="12">
                    <FormItem label="参课城市" prop="join_lesson_city" >
                        <Select v-model="form.join_lesson_city" size="small" style="width:7rem;" >
                          <Option :value="i" v-for="i in option.cityList">{{i}}</Option>
                        </Select>
                    </FormItem>
                  </Col>
                  <Col span="12">
                    <FormItem label="参课状态" prop="is_join">
                        <Select v-model="form.is_join" size="small" style="width:7rem;" >
                          <Option value="未参课">未参课</Option>
                          <Option value="已参课">已参课</Option>
                        </Select>
                    </FormItem>
                  </Col>
                </Row>
                <Row>
                  <Col :span="12">
                    <FormItem label="落款地" prop="final_city">
                        <Select v-model="form.final_city" size="small" style="width:7rem;" >
                          <Option :value="i" v-for="i in option.cityList">{{i}}</Option>
                        </Select>
                    </FormItem>
                  </Col>
                  <Col :span="12">
                    <FormItem label="是否到账" prop="is_complete_name" >
                        <Select v-model="form.is_complete_name" size="small" style="width:7rem;" >
                          <Option value="到账">到账</Option>
                          <Option value="未到账">未到账</Option>
                        </Select>
                    </FormItem>
                  </Col>
                </Row>
                    <Col :span="24">
                        <FormItem label="备注">
                            <Input type="textarea" placeholder="缴费备注" :autosize="{minRows: 4,maxRows: 6}"
                                   v-model="form.desc"></Input>
                        </FormItem>
                    </Col>
                </Row>
                <FormItem>
                    <Button type="primary" @click="submit('form')">提交</Button>
                    <Button style="margin-left: 8px" @click="formVisible=false">取消</Button>
                </FormItem>
            </Form>
        </Modal>
        <!-- 退款表单 -->
		    <RefoundForm :visible="docFormVisible"  :customer_id="curr.customer_id" :payment_id="curr.id" mode="add" @hideForm="docFormVisible=false">
			  </RefoundForm>
        <!-- 放大Modal -->
        <!--  -->
        <Modal title="查看大图" v-model="visible" footer-hide>
        	<img :src="imgUrl" v-if="visible" style="width: 100%">
        </Modal>
        <!-- 导出数据表单 -->
        <template>
            <Modal style="text-align: center;" v-model="modal1" title="请选择导出页数" @on-ok="exportData(4)"   >
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
  import { api } from '@/api/api'  //引入api配置
  import { mapMutations } from 'vuex'  //状态数据存储
  import { apiRequest } from '@/api/http' //引入请求文件
  import { dataToTable, objFilter,getBaseUrl, getToken } from '@/libs/util' //引入结构化表格和表单数据过滤
  import { paymentDetailTable, paymentHeadTable,paymentHeadTables, } from '@/libs/data-customer'//引入表头和详情数据文件
  import ChinaArea from '@/libs/China-area'
  import RefoundForm from '@/view/main/customer/formmodal/RefoundForm.vue'

  export default {
	components:{RefoundForm},
    data () {
      return {
        cols: paymentHeadTables,//表头详细数据
        pageNum: 1,//页码
        modal1:false,//导出modal
        outData:[],//导出数据
        exportA:1,//导出页码
        exportB:1,//导出页码
        pageAll:1,
        data: {},//数据
        curr: {},//当前row
        currDetailTable: '',//详情html
        showDetailDrawer: false,//是否显示详情抽屉
        keyword: '',//搜索关键字
        time:[],//搜索时间关键字
        time_start:"",//开始时间
        time_end:"",//结束时间
        ChinaArea: ChinaArea,//中国行政区数据
        formMode: 'add',//客户表单模式  add 添加  edit 修改
        formVisible: false,//客户表单是否显示

        //是否显示退款表单
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
            title: '客户姓名',
            key: 'customer_name'
          },
          {
            title: '电话',
            key: 'phone',
            width:'110px'
          },
          {
            title: '金额',
            key: 'value'
          },
          {
            title: '交费方式',
            key: 'way'
          },
          {
            title: '交费事由',
            key: 'origin'
          },
          // {
          //   title: '定金/全款',
          //   key: 'is_deposit'
          // },
          {
            title: '参加课程',
            key: 'lesson'
          },
          // {
          //   title: '参课城市',
          //   key: 'join_lesson_city'
          // },
          // {
          //   title: '落款地',
          //   key: 'final_city'
          // },
          {
            title: '发票凭证',
            key: 'voucher_img',
            width: 100,
            align: 'center',
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
            title: '参课状态',
            key: 'is_join'
          },
          {
            title: '是否到账',
            key: 'is_complete_name'
          },
          {
            title: '发票状态',
            key: 'invoice_status_name',
        		width:'100'
          },
          {
            title: '退款状态',
            key: 'refund_status',
        		width:'100'
          },
          {
            title: '操作',
            slot: 'action',
            width: 200,
            align: 'center'
          }
        ],
        //客户表单
        form: {
          id: "",
          value: "",//金额
          is_deposit: "",//定金/全款
          way: "",//交费方式
          origin: "",//原因
          lesson: "",//课程类别
          pay_time: "",//交费时间
          join_lesson_time: "",//参课时间
          join_lesson_city: "",//参课城市
          is_join: "",//参课状态
          final_city:"",//落款地
          is_complete_name: "",//是否到账
          voucher_img: "",//凭证
          invoice_status: "",//发票状态
          refund_status: "",//退款状态
          invoice_status_name: "",//发票信息
          refund_status_name: "",//退款信息
          desc: "",//备注
        },
		//验证规则
		formInline: {
				value: [
					{ required: true, message: '请填写金额', trigger: 'blur' },
				],
				pay_time: [
					{ required: true, message: '请填写缴费时间', trigger: 'blur',pattern:/.+/ },
				],
				way:[
					{required:true,message:'缴费方式',trigger:'blur'}
				],
				paymentOriginList: [
					{ required: true, message: '请选择缴费原因', trigger: 'blur' }
				]
		},

      }
    },
	//页面渲染完成后调用
    mounted () {
      this.initData()
      this.getOption()
    },
    watch: {
      curr (_new) {
        this.currDetailTable = dataToTable(_new, paymentDetailTable)
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
        //搜索关键字-开始时间
        const time_start = parseInt(this.time_start);
        //搜索关键字-结束时间
        const time_end = parseInt(this.time_end);
        const group = this.group

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

        apiRequest(api.Payment.getList,
          params,
          ret => {
            this.data = ret
            this.pageAll = ret.last_page

            let len = this.data.data.length;
            for(let i=0;i<len;i++){
              // 是否到账
              if(this.data.data[i].is_complete_name=='1'){this.data.data[i].is_complete_name="到账"}else{this.data.data[i].is_complete_name="未到账"}
              if(this.data.data[i].invoice_status=='1'){this.data.data[i].invoice_status="已开发票"}else{this.data.data[i].invoice_status="未开发票"}
              if(this.data.data[i].refund_status=='1'){this.data.data[i].refund_status="已退款"}else{this.data.data[i].refund_status="未退款"}
              if(this.data.data[i].is_join=='1'){this.data.data[i].is_join="已参课"}else{this.data.data[i].is_join="未参课"}
              if(this.data.data[i].invoice_status_name=="1"){this.data.data[i].invoice_status_name="已开发票"}else{this.data.data[i].invoice_status_name="未开发票"}
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
                 const keyword = this.keyword.trim()
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
                 apiRequest(api.Payment.getList,params,ret => {
                   let len = ret.data.length;
                   for(let i=0;i<len;i++){
                    // 是否到账
                    if(ret.data[i].is_complete_name=='1'){ret.data[i].is_complete_name="到账"}else{ret.data[i].is_complete_name="未到账"}
                    if(ret.data[i].invoice_status=='1'){ret.data[i].invoice_status="已开发票"}else{ret.data[i].invoice_status="未开发票"}
                    if(ret.data[i].refund_status=='1'){ret.data[i].refund_status="已退款"}else{ret.data[i].refund_status="未退款"}
                    if(ret.data[i].is_join=='1'){ret.data[i].is_join="已参课"}else{ret.data[i].is_join="未参课"}
                    if(ret.data[i].invoice_status_name=="1"){ret.data[i].invoice_status_name="已开发票"}else{ret.data[i].invoice_status_name="未开发票"}
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

        //意向参课时间
        var d = new Date(this.form.join_lesson_time);
        var datetime=d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
        this.form.join_lesson_time=datetime.toString()
        //转化参数为0，1
        if(this.form.is_complete_name=="到账"){this.form.is_complete_name="1"}else{this.form.is_complete_name="0"}
        if(this.form.invoice_status=='已开发票'){this.form.invoice_status="1"}else{this.form.invoice_status="0"}
        if(this.form.refund_status=='已退款'){this.form.refund_status="1"}else{this.form.refund_status="0"}
        if(this.form.is_join=='已参课'){this.form.is_join="1"}else{this.form.is_join="0"}

       this.$refs[name].validate((valid) => {
        if (valid) {
					const apiName = this.formMode === 'add' ? api.Payment.add : api.Payment.edit
					apiRequest(apiName,this.form, ret => {
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
