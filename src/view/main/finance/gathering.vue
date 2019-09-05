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
                <Button type="primary" size="small" @click="modal1=true"><Icon type="ios-download-outline"></Icon>导出数据</Button>
            </Col>
        </Row>
        <!--表格-->
        <Table :data="data.data" ref="table"  :columns="col"  size="small" highlight-row @on-current-change="row=>curr=row">
            <template slot-scope="{ row, index }" slot="action">
              <Button type="default" size="small" style="margin-right: 5px"   @click="customerActionMenuHandler(name='detail')">查看</Button>
            </template>
        </Table>
        <Page style="margin:10px 0;" :total="data.total" :page-size="data.per_page" size="small" show-total show-elevator @on-change="onPage"></Page>
         <!-- 详情-->
        <Drawer title="详情" placement="left" :closable="false" v-model="showDetailDrawer">
            <div v-html="currDetailTable"></div>
        </Drawer>
        <!-- 数据统计表单 -->
        <Chartgather></Chartgather>
        <!-- 放大Modal -->
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
  import { api } from '@/api/api'  //引入api配置
  import { mapMutations } from 'vuex'  //状态数据存储
  import { apiRequest } from '@/api/http' //引入请求文件
  import { dataToTable, objFilter,getBaseUrl, getToken } from '@/libs/util' //引入结构化表格和表单数据过滤
  import { paymentDetailTable, paymentHeadTable,paymentHeadTables, } from '@/libs/data-customer'//引入表头和详情数据文件
  import ChinaArea from '@/libs/China-area'
  import RefoundForm from '@/view/main/customer/formmodal/RefoundForm.vue'
  import Chartgather from '@/view/main/finance/chart/chart-gather'

  export default {
	components:{RefoundForm,Chartgather},
    data () {
      return {
        cols: paymentHeadTables,//表头数据
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
        imgModalVisible: false,
        previewImg: '',
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
            title: '联系方式',
            key: 'phone',
            width:'110px'
          },
          {
            title: '顾问姓名',
            key: 'admin_name'
          },
          {
            title: '金额',
            key: 'value'
          },
          {
            title: '收款时间',
            key: 'pay_time',
        		width:"105"
          },
          {
            title: '收款方式',
            key: 'way'
          },
          {
            title: '收款事由',
            key: 'origin'
          },
          {
            title: '定金/全款',
            key: 'is_deposit',
            filters: [
                {label: '全款',value: 1},
                {label: '定金',value: 0},
            ],
            filterMultiple: false,
            filterMethod (value, row) {
                if (value === 1) {return row.is_deposit =='全款';}
                else if (value === 0) {return row.is_deposit == '定金';}
            }
          },
          {
            title: '参加课程',
            key: 'lesson'
          },
          {
            title: '参课城市',
            key: 'join_lesson_city'
          },
          {
            title: '落款地',
            key: 'final_city',
            filters: [
                {label: '西安',value: 1},
                {label: '北京',value: 2},
                {label: '长春',value: 3},
                {label: '沈阳',value: 4},
                {label: '石家庄',value:5},
                {label: '邯郸',value: 6},
                {label: '济南',value: 7},
                {label: '青岛',value: 8},
                {label: '上海',value: 9},
                {label: '合肥',value: 10},
                {label: '杭州',value: 11},
                {label: '郑州',value: 12},
                {label: '武汉',value: 13},
                {label: '成都',value: 14},
                {label: '榆林',value: 15},
                {label: '延安',value: 16},
                {label: '太原',value: 17},
                {label: '广州',value: 18},
            ],
            filterMultiple: false,
            filterMethod (value, row) {
                if (value === 1) {return row.final_city =='西安';}
                else if (value === 2) {return row.final_city == '北京';}
                else if (value === 3) {return row.final_city == '长春';}
                else if (value === 4) {return row.final_city == '沈阳';}
                else if (value === 5) {return row.final_city == '石家庄';}
                else if (value === 6) {return row.final_city == '邯郸';}
                else if (value === 7) {return row.final_city == '济南';}
                else if (value === 8) {return row.final_city == '青岛';}
                else if (value === 9) {return row.final_city == '上海';}
                else if (value === 10) {return row.final_city == '合肥';}
                else if (value === 11) {return row.final_city == '杭州';}
                else if (value === 12) {return row.final_city == '郑州';}
                else if (value === 13) {return row.final_city == '武汉';}
                else if (value === 14) {return row.final_city == '成都';}
                else if (value === 15) {return row.final_city == '榆林';}
                else if (value === 16) {return row.final_city == '延安';}
                else if (value === 17) {return row.final_city == '太原';}
                else if (value === 18) {return row.final_city == '广州';}
            }
          },
          {
            title: '凭证',
            key: 'voucher_img',
            width: 60,
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
            title: '是否到账',
            key: 'is_complete_name',
            filters: [
                {label: '到账',value: 1},
                {label: '未到账',value: 0},
            ],
            filterMultiple: false,
            filterMethod (value, row) {
                if (value === 1) {return row.is_complete_name =='到账';}
                else if (value === 0) {return row.is_complete_name == '未到账';}
            }
          },
          {
            title: '操作',
            slot: 'action',
            width: 100,
            align: 'center'
          }
        ],
        //客户表单
        form: {
          id: "",
          customer_id: "",
          admin_id: "",
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
      initData () {
        const keyword = this.keyword.trim()
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
