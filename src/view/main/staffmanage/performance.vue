<template>
    <div>
        <!--筛选工具-->
        <Row :gutter="24" style="margin-bottom: 10px">
          <Col :span="4">
            <Row>
              <Col :span="16">
                <Select  size="small" v-model="tablestaus" >
                  <Option value="线下亲子部门">线下亲子部门</Option>
                  <Option value="高端服务中心">高端服务中心</Option>
                  <Option value="线下推广部门">线下推广部门</Option>
                </Select>
              </Col>
              <Col :span="8">
                <Button type="primary" size="small" icon="ios-search" style="margin-left:10px;" @click="tableshow()" ></Button>
              </Col>
            </Row>
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
           <Col span="4">
                <Input search enter-button size="small" v-model="keyword" placeholder="输入姓名" @on-search="query"/>
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
        <!--表格-线下亲子部门-->
        <div v-show="table01" >
        <h3>线下亲子部门</h3>
        <Table :data="data1.data" ref="table01"  :columns="HeadTable01"  size="small" highlight-row @on-current-change="row=>curr=row">
            <template slot-scope="{ row, index }" slot="action">
                <Button type="default" size="small" style="margin-right: 5px"   @click="customerActionMenuHandler(name='detail')">查看</Button>
                <Button type="primary" size="small" style="margin-right: 5px"   @click="edit(row)">编辑</Button>
            </template>
        </Table>
        <Page style="margin:10px 0;" :total="data1.total" :page-size="data1.per_page" size="small" show-total show-elevator @on-change="onPage"></Page>
        </div>
        <!--表格-高端服务中心-->
        <div v-show="table02" >
        <h3>高端服务中心</h3>
        <Table :data="data2.data" ref="table02" :columns="HeadTable02"  size="small" highlight-row @on-current-change="row=>curr=row">
            <template slot-scope="{ row, index }" slot="action">
                <Button type="default" size="small" style="margin-right: 5px"   @click="customerActionMenuHandler(name='detail')">查看</Button>
                <Button type="primary" size="small" style="margin-right: 5px"   @click="edit(row)">编辑</Button>
            </template>
        </Table>
        <Page style="margin:10px 0;" :total="data2.total" :page-size="data2.per_page" size="small" show-total show-elevator @on-change="onPage"></Page>
        </div>
        <!--表格-线下推广部门-->
        <div v-show="table03">
        <h3>线下推广部门</h3>
        <Table :data="data3.data"  ref="table03" :columns="HeadTable03"  size="small" highlight-row @on-current-change="row=>curr=row">
            <template slot-scope="{ row, index }" slot="action">
                <Button type="default" size="small" style="margin-right: 5px"   @click="customerActionMenuHandler(name='detail')">查看</Button>
                <Button type="primary" size="small" style="margin-right: 5px"   @click="edit(row)">编辑</Button>
            </template>
        </Table>
        <Page style="margin:10px 0;" :total="data3.total" :page-size="data3.per_page" size="small" show-total show-elevator @on-change="onPage"></Page>
        </div>
         <!-- 详情-->
        <Drawer title="详情" placement="left" :closable="false" v-model="showDetailDrawer">
			      <div v-html="currDetailTable"></div>
        </Drawer>
         <!-- 线下亲子部表单-->
        <Childrenform :visible="one_form_visible" :data="data1" :mode="formMode" @hideForm="one_form_visible=false" ></Childrenform>
         <!-- .... -->
         <!-- 高端服务中心表单-->
         <Highform :visible="two_form_visible" :mode="formMode" @hideForm="two_form_visible=false" ></Highform>
          <!-- .... -->
         <!-- 线下推广表单（暂时写网络部）-->
         <Offlineform :visible="three_form_visible" :mode="formMode" @hideForm="three_form_visible=false" ></Offlineform>
         <!-- .... -->

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
  import { performanceDetailTable, cvHeadTable} from '@/libs/data-staffmange'
  import ChinaArea from '@/libs/China-area'
  import PerformanceData from '@/libs/PerformanceData'
  import Childrenform  from '@/view/main/staffmanage/formmodal/children_form'//亲子部表单
  import Highform from '@/view/main/staffmanage/formmodal/high_form'//高端服务中心
  import Offlineform from '@/view/main/staffmanage/formmodal/offline_form'//线下推广部门

  export default {
    components:{Childrenform,Highform,Offlineform},
    data () {
      return {
        //col: HeadTable01,//表头
        pageNum: 1,//页码
        modal1:false,//导出modal
        outData:[],//导出数据
        exportA:1,//导出页码
        exportB:1,//导出页码
        pageAll:1,
        data1: {},//线下亲子部数据
        data2:{},//高端服务中心数据
        data3:{},//线下推广部门数据
        curr: {},//当前row
        currDetailTable: '',//详情html
        showDetailDrawer: false,//是否显示详情抽屉
        keyword: '',//搜索关键字
        time:[],//搜索时间关键字
        time_start:"",//开始时间
        time_end:"",//结束时间
        ChinaArea: ChinaArea,//中国行政区数据
        PerformanceData:PerformanceData,
        imgshow:true,
        one_form_visible:false, //表单1是否显示
        two_form_visible:false, //表单2是否显示
        three_form_visible:false, //表单3是否显示


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
        //表单控制显示
        tablestaus:"线下亲子部门",
        table01:true,
        table02:false,
        table03:false,



		// 亲子部门表头信息
		HeadTable01:[
			{
				title:'编号',
				key:'id'
			},
			{
				title:'姓名',
				key:'employ_name',
			},
			{
				title:'地区',
				key:'area'
			},
			{
				title:'部门',
				key:'department'
			},
			{
				title:'收款(初训)',
				key:'firstearn'
			},
			{
				title:'收款(复训)',
				key:'overearn'
			},
			{
				title:'退款',
				key:'refund'
			},
			{
				title:'家长作业',//表示跟单了多少次
				key:'familywork'
			},
			{
				title:'推下一阶课程',
				key:'nextlesson',
				width:'120'
			},
			{
				title:'课后作业',
				key:'afterwork'
			},
			{
				title:'朋友圈更新',
				key:'friendsupdate'
			},
			{
				title:'实到天数',
				key:'signdata'
			},
			{
				title:'请假天数',
				key:'leavedata'
			},
      {
        title:'创建日期',
        key:'create_at',
        width:'150px'
      },
      {
        title: '操作',
        slot: 'action',
        width: '150px',
        align: 'center'
       }
		],
	    // 高端服务中心表头信息
		HeadTable02:[
			{
				title:'编号',
				key:'id'
			},
			{
				title:'姓名',
				key:'employ_name',
			},
			{
				title:'地区',
				key:'area'
			},
			{
				title:'部门',
				key:'department'
			},
			{
				title:'回访电话',
				key:'return_phone'
			},
			{
				title:'小型沙龙',
				key:'salon'
			},
			{
				title:'咨询会',
				key:'ask_meeting'
			},
			{
				title:'户外活动',
				key:'out_activity'
			},
			{
				title:'一对一咨询',
				key:'one_to_one_ask',
				width:'120'
			},
      {
        title:'创建日期',
        key:'create_at',
        width:'150px'
      },
      {
        title: '操作',
        slot: 'action',
        width: '150px',
        align: 'center'
       }
		],
    // 线下推广表头信息
		HeadTable03:[
			{
				title:'编号',
				key:'id'
			},
			{
				title:'姓名',
				key:'employ_name',
			},
			{
				title:'地区',
				key:'area'
			},
			{
				title:'部门',
				key:'department'
			},
			{
				title:'学校报告会',
				key:'school_report'
			},
			{
				title:'家长学校',
				key:'patriarch_school'
			},
			{
				title:'线下销售课',
				key:'offline_lesson'
			},
			{
				title:'社会场推广课',
				key:'social_lesson'
			},
      {
        title:'创建日期',
        key:'create_at',
        width:'150px'
      },
      {
        title: '操作',
        slot: 'action',
        width: '150px',
        align: 'center'
       }
		],
      }
    },
    mounted () {
      this.initData()
    },
    watch: {
      curr (_new) {
        this.currDetailTable = dataToTable(_new, performanceDetailTable)
      }
    },
    methods: {
      ...mapMutations([
        'closeTag'
      ]),
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
        //请求接口-线下亲子部门
        apiRequest(api.Performance.getList,
          params,
          ret => {
            this.data1 = ret
            this.pageAll = ret.last_page
            console.log(this.data1)
            let len = this.data1.data.length;
            for(let i=0;i<len;i++){
            //部门id转部门
            if(this.data1.data[i].department_id=="2"){this.data1.data[i].department="亲子部"}
            if(this.data1.data[i].department_id=="3"){this.data1.data[i].department="网络部"}
            if(this.data1.data[i].department_id=="4"){this.data1.data[i].department="高端服务中心"}
            }
          })
        //请求接口-高端服务中心
        apiRequest(api.Performancehigh.getList,
          params,
          ret => {
            this.data2 = ret
            let len = this.data2.data.length;
            for(let i=0;i<len;i++){
            //部门id转部门
            if(this.data2.data[i].department_id=="2"){this.data2.data[i].department="亲子部"}
            if(this.data2.data[i].department_id=="3"){this.data2.data[i].department="网络部"}
            if(this.data2.data[i].department_id=="4"){this.data2.data[i].department="高端服务中心"}
            }
          })
          //请求接口-线下推广部门
          apiRequest(api.Performanceoffline.getList,
            params,
            ret => {
              this.data3 = ret
              let len = this.data3.data.length;
              for(let i=0;i<len;i++){
              //部门id转部门
              if(this.data3.data[i].department_id=="2"){this.data3.data[i].department="亲子部"}
              if(this.data3.data[i].department_id=="3"){this.data3.data[i].department="网络部"}
              if(this.data3.data[i].department_id=="4"){this.data3.data[i].department="高端服务中心"}
              }
            })
      },
      //表单的选择与显示
      tableshow(){
        switch(this.tablestaus){
           case "线下亲子部门":
           this.table01=true,this.table02=false,this.table03=false;
           break;
           case "高端服务中心":
           this.table01=false,this.table02=true,this.table03=false;
           break;
           case "线下推广部门":
           this.table01=false,this.table02=false,this.table03=true;
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
      //添加信息
      add () {
        this.formMode = 'add'
        switch(this.tablestaus){
           case "线下亲子部门":
           this.one_form_visible=true
           break;
           case "高端服务中心":
           this.two_form_visible=true
           break;
           case "线下推广部门":
           this.three_form_visible=true
           break;
        }
      },
      //编辑
      edit (row) {
        this.formMode = 'edit'
        switch(this.tablestaus){
           case "线下亲子部门":
           this.one_form_visible=true
           break;
           case "高端服务中心":
           this.two_form_visible=true
           break;
           case "线下推广部门":
           this.three_form_visible=true
           break;
        }
        this.form = { ...row }
        this.form.id = row.id
        this.form.area = [row.province, row.city]
      },
      //导出数据表
      exportData (type) {
        if(this.table01==true){
          //导出所有数据
          if (type === 4) {
              //遍历存储数据
              var testData=[];
              let a=this.exportA;
              let b=this.exportB;
              for(a;a<=b;a++){
                 let params = {pageNum:''}
                 params.pageNum=a
                 console.log(params)
                 apiRequest(api.Performance.getList,params,ret => {
                   let len = ret.data.length;
                   for(let i=0;i<len;i++){
                     testData.push(ret.data[i])
                   }
                   if(params.pageNum==b){
                     console.log("现在可以下载数据了......................！！！！！！！！！！！！！")
                     console.log(testData)

                     this.$refs.table01.exportCsv({
                         filename: 'Custom data',
                         columns: this.HeadTable01.filter((col, index) => index < 100),
                         data: testData.filter((data, index) => index < 1000)
                     });
                     //初始化页码选择
                     this.exportA=1
                     this.exportB=1
                   }
                })
              }
          }
         }
        if(this.table02==true){
           //导出所有数据
           if (type === 4) {
               //遍历存储数据
               var testData=[];
               let a=this.exportA;
               let b=this.exportB;
               for(a;a<=b;a++){
                  let params = {pageNum:''}
                  params.pageNum=a
                  console.log(params)
                  apiRequest(api.Performancehigh.getList,params,ret => {
                    let len = ret.data.length;
                    for(let i=0;i<len;i++){
                      testData.push(ret.data[i])
                    }
                    if(params.pageNum==b){
                      console.log("现在可以下载数据了......................！！！！！！！！！！！！！")
                      console.log(testData)

                      this.$refs.table02.exportCsv({
                          filename: 'Custom data',
                          columns: this.HeadTable02.filter((col, index) => index < 100),
                          data: testData.filter((data, index) => index < 1000)
                      });
                      //初始化页码选择
                      this.exportA=1
                      this.exportB=1
                    }
                 })
               }
           }
         }
        if(this.table03==true){
           //导出所有数据
           if (type === 4) {
               //遍历存储数据
               var testData=[];
               let a=this.exportA;
               let b=this.exportB;
               for(a;a<=b;a++){
                  let params = {pageNum:''}
                  params.pageNum=a
                  console.log(params)
                  apiRequest(api.Performanceoffline.getList,params,ret => {
                    let len = ret.data.length;
                    for(let i=0;i<len;i++){
                      testData.push(ret.data[i])
                    }
                    if(params.pageNum==b){
                      console.log("现在可以下载数据了......................！！！！！！！！！！！！！")
                      console.log(testData)

                      this.$refs.table03.exportCsv({
                          filename: 'Custom data',
                          columns: this.HeadTable03.filter((col, index) => index < 100),
                          data: testData.filter((data, index) => index < 1000)
                      });
                      //初始化页码选择
                      this.exportA=1
                      this.exportB=1
                    }
                 })
               }
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
