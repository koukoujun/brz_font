<template>
    <div>
        <!-- 筛选工具-->
        <Row :gutter="24" style="margin-bottom: 10px">
            <Col span="3">
                <Input search enter-button size="small" v-model="keyword" placeholder="输入客户姓名/电话" @on-search="query"/>
            </Col>
            <Col span="3">
                <Input search enter-button size="small" v-model="admin_name" placeholder="输入顾问姓名" @on-search="query"/>
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
        <!-- 表格-->
        <Table :data="data.data" :columns="col" size="small" ref="table" highlight-row @on-current-change="row=>curr=row">
            <template slot-scope="{ row, index }" slot="action">
              <Button type="default" size="small" style="margin-right: 5px"   @click="customerActionMenuHandler(name='detail')">查看详情</Button>
              <Button type="info" size="small" style="margin-right: 5px"    v-show="addShow"  @click="customerActionMenuHandler(name='addDoc')">添加跟单</Button>
              <Button type="warning" size="small" style="margin-right: 5px" v-show='allotShow'  @click="customerActionMenuHandler(name='allot')">分配客户</Button>
            </template>
        </Table>
        <Page style="margin:10px 0;" :total="data.total" :page-size="data.per_page" size="small" show-total show-elevator @on-change="onPage"></Page>
        <!--客户详情-->
        <Drawer title="客户详情" placement="left" :closable="false" v-model="showDetailDrawer">
            <div v-html="currDetailTable"></div>
        </Drawer>
        <!-- 跟单表单-->
        <DocumentaryForm :visible="docFormVisible" :customer_id="curr.id" mode="add" @hideForm="docFormVisible=false"></DocumentaryForm>
        <!-- 顾问分配表单-->
        <AllotForm :visible="allotFormVisible" :customer_id="curr.id" mode="add" @hideForm="allotFormVisible=false" @submit="timestamp=Date.now()"></AllotForm>
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
  import { dataToTable, objFilter } from '@/libs/util'
  import { highpointDetailTable, highpointHeadTable,highpointHeadTables, } from '@/libs/data-highpoint'
  import DocumentaryForm from '@/view/main/highpoint/modal/DocumentaryForm'
  import AllotForm from '@/view/main/highpoint/modal/AllotForm'
  import Cookies from 'js-cookie'

  export default {
	components: {  DocumentaryForm, AllotForm, },
    data () {
      return {
        col: highpointHeadTable,//客户表头
        cols:highpointHeadTables,//客户详细表头
        pageNum: 1,//客户页码
        modal1:false,//导出modal
        outData:[],//导出数据
        exportA:1,//导出页码
        exportB:1,//导出页码
        pageAll:1,
        data: {},//客户数据
        curr: {},//客户当前row
        currDetailTable: '',//客户详情html
        showDetailDrawer: false,//是否显示客户详情抽屉
        keyword: '',//客户搜索关键字
        time:[],//搜索时间关键字
        time_start:"",//开始时间
        time_end:"",//结束时间
        admin_name:"",//搜索顾问关键字

        formMode: 'add',//客户表单模式  add 添加  edit 修改
        formVisible: false,//客户表单是否显示
        //是否显示跟单表单
        docFormVisible: false,
        //是否显示分配顾问表单
        allotFormVisible: false,
        //时间戳
        timestamp: 0,

        //添加和分配显示
        addShow:true,
        allotShow:true,
      }
    },
    mounted () {
      //存入access
      const role = Cookies.get('role')

      if(role=='["a1"]'){
        this.allotShow=false
      }
      else{
        this.addShow=false
      }

      this.initData()
    },
    watch: {
      curr (_new) {
        this.currDetailTable = dataToTable(_new, highpointDetailTable)
      }
    },
    methods: {
      ...mapMutations([
        'closeTag'
      ]),
      initData () {
        const keyword = this.keyword.trim()//电话
        const admin_name =this.admin_name.trim()//顾问
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
       //关键字筛选-顾问
        if (admin_name) {
          params.admin_name = admin_name
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
        apiRequest(api.Customer.highLessonList,params,ret => {
            this.data = ret
            console.log(this.data)
            this.pageAll = ret.last_page
            //遍历操控
            let len =this.data.data.length;
            for(let i=0;i<len;i++){
              //性别转化
              if(this.data.data[i].sex=="男"){this.data.data[i].sex='1'}else{this.data.data[i].sex='0'}
              if(this.data.data[i].spouse_sex=="男"){this.data.data[i].spouse_sex='1'}else{this.data.data[i].spouse_sex='0'}
              if(this.data.data[i].child1_sex=="男"){this.data.data[i].child1_sex='1'}else{this.data.data[i].child1_sex='0'}
              if(this.data.data[i].child2_sex=="男"){this.data.data[i].child2_sex='1'}else{this.data.data[i].child2_sex='0'}
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
      //添加客户
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
          //自定义导出数据
          else if (type === 4) {
              //遍历存储数据
              var testData=[];
              let a=this.exportA;
              let b=this.exportB;
              for(a;a<=b;a++){
                 let params = {pageNum:''}
                 params.pageNum=a
                 console.log(params)
                 const keyword = this.keyword.trim()//电话
                  const admin_name =this.admin_name.trim()//顾问
                  //搜索关键字-开始时间
                  const time_start = parseInt(this.time_start);
                  //搜索关键字-结束时间
                  const time_end = parseInt(this.time_end);
                  //关键字筛选
                  if (keyword) {
                    params.keyword = keyword
                  }
                 //关键字筛选-顾问
                  if (admin_name) {
                    params.admin_name = admin_name
                  }
                  //关键字筛选-开始时间
                  if (time_start) {
                    params.time_start = time_start
                  }
                  //关键字筛选-结束时间
                  if (time_end) {
                    params.time_end = time_end
                  }
                 apiRequest(api.Customer.highLessonList,params,ret => {
                   let len = ret.data.length;
                   for(let i=0;i<len;i++){

                     if(ret.data[i].sex==1){ret.data[i].sex='男'}else{this.data.data[i].sex='女'}
                     if(ret.data[i].spouse_sex==1){ret.data[i].spouse_sex='男'}else{ret.data[i].spouse_sex='女'}
                     if(ret.data[i].child1_sex==1){ret.data[i].child1_sex='男'}else{ret.data[i].child1_sex='女'}
                     if(ret.data[i].child2_sex==1){ret.data[i].child2_sex='男'}else{ret.data[i].child2_sex='女'}
                     //电话-转化科学计数法
                     ret.data[i].phone = "\t"+ret.data[i].phone;
                     //配偶电话-转化科学计数法
                     ret.data[i].spouse_phone = "\t"+ret.data[i].spouse_phone;
                     //身份证号码-转化科学计数法
                     ret.data[i].id_card_number = "\t"+ret.data[i].id_card_number;
                     //孩子1身份证号码-转化科学计数法
                     ret.data[i].child1_id_card_number = "\t"+ret.data[i].child1_id_card_number;
                     //孩子2身份证号码-转化科学计数法
                     ret.data[i].child2_id_card_number = "\t"+ret.data[i].child2_id_card_number;
                     //配偶身份证号码-转化科学计数法
                     ret.data[i].spouse_id_card_number = "\t"+ret.data[i].spouse_id_card_number;

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
      //客户操作菜单
      customerActionMenuHandler (name) {
        switch (name) {
          case 'detail':
            this.showDetailDrawer = true
            break
          case 'addDoc':
            this.docFormVisible = true
            break
          case 'allot':
            this.allotFormVisible = true
            break
        }
      },
      //提交客户表单
      submit (name) {
		  this.$refs[name].validate((valid) => {
			if (valid) {
				this.$Message.success('Success!');
				this.form.province = this.form.area[0]
				this.form.city = this.form.area[1]
				this.form.area = []
        this.form.phone = parseInt(this.form.phone)

			  //转化中国标准日期格式
				//意向参课时间
				var d = new Date(this.form.intention_time);
				var datetime=d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
				this.form.intention_time=datetime.toString();
				const apiName = this.formMode === 'add' ? api.Customer.add : api.Customer.edit
				apiRequest(apiName, objFilter(this.form), ret => {
				  //清空form表单
				  this.form = { brand_right: 0 }
				  this.formVisible = false
				  this.initData()
				})
			}
			else {
				this.$Message.error('Fail!');
			 }
		  })
     },
    }
  }
</script>
<style scoped>
    .top,.bottom{
        text-align: center;
    }
    .center{
        width: 300px;
        margin: 10px auto;
        overflow: hidden;
    }
    .center-left{
        float: left;
    }
    .center-right{
        float: right;
    }
</style>
