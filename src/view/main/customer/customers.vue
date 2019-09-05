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
            <Col span="3" v-show="department_show" >
              <Row>
                <Col :span="16">
                  <Select v-model="department" size="small" style="width:8rem;" placeholder="请选择部门" >
                      <Option :value="i.id" v-for="i in option.department_list">{{i.area}}{{i.name}}</Option>
                  </Select>
                </Col>
                <Col :span="8">
                  <Button type="primary" size="small" icon="ios-search" style="margin-left:10px;" @click="query()"></Button>
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
            <Col span="2">
                <Button type="success" size="small" @click="refresh">
                    <Icon type="ios-refresh"></Icon>
                    刷新
                </Button>
            </Col>
            <Col span="2">
                <Button type="success" size="small" @click="add">
                    <Icon type="ios-add"></Icon>
                    添加客户
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
              <Button type="primary" size="small" style="margin-right: 5px"   @click="edit(row)">编辑修改</Button>
              <Button type="info" size="small" style="margin-right: 5px"      @click="customerActionMenuHandler(name='addDoc')">添加跟单</Button>
              <Button type="warning" size="small" style="margin-right: 5px"   @click="customerActionMenuHandler(name='addPay')">添加收款</Button>
			        <Button type="success" size="small" style="margin-right: 5px" v-show="transferShow"   @click="customerActionMenuHandler(name='addTransfer')">客户转移</Button>
            </template>
        </Table>
        <Page style="margin:10px 0;" :total="data.total" :page-size="data.per_page" size="small" show-total show-elevator @on-change="onPage"></Page>
        <!--        客户详情-->
        <Drawer title="客户详情" placement="left" :closable="false" v-model="showDetailDrawer">
            <div v-html="currDetailTable"></div>
        </Drawer>
        <!-- 客户表单-->
        <Modal v-model="formVisible" width="73" :title="formMode==='add'?'添加客户':'编辑客户'" footer-hide
               @on-cancel="form={brand_right:0}">
            <Form :model="form" ref="form" :label-width="130" :rules="ruleInline" inline >
              <Row :gutter="16">
                <Col :span="5">
                  <FormItem label="姓名" prop="name" >
                      <Input v-model="form.name" size="small" placeholder="请填写姓名" style="width:8rem;" ></Input>
                  </FormItem>
                  <FormItem label="性别" prop="sex">
                      <RadioGroup v-model="form.sex">
                          <Radio label="1">男</Radio>
                          <Radio label="0">女</Radio>
                      </RadioGroup>
                  </FormItem>
                  <FormItem label="电话" prop="phone">
                      <Input v-model="form.phone" size="small" type="number" placeholder="请填写电话" style="width:8rem;" ></Input>
                  </FormItem>
                  <FormItem label="客户质量" prop="quality">
                      <Select v-model="form.quality" size="small" style="width:8rem;" >
                          <Option value="一般">一般</Option>
                          <Option value="优质">优质</Option>
                      </Select>
                  </FormItem>
                  <FormItem label="QQ" prop="qq">
                      <Input v-model="form.qq" size="small" type="number" placeholder="请填写QQ" style="width:8rem;" ></Input>
                  </FormItem>
                  <FormItem label="来源" prop="from">
                      <Select v-model="form.from" size="small" style="width:8rem;">
                          <Option :value="i" v-for="i in option.fromList">{{i}}</Option>
                      </Select>
                  </FormItem>
                </Col>
                <Col :span="5">
                  <FormItem label="地区" prop="area">
                      <Cascader :data="ChinaArea" size="small" v-model="form.area" style="width:8rem;" ></Cascader>
                  </FormItem>
                  <FormItem label="意向课程" prop="intention_lesson">
                      <Select v-model="form.intention_lesson" size="small" style="width:8rem;"  >
                          <Option :value="i" v-for="i in option.lessonList">{{i}}</Option>
                      </Select>
                  </FormItem>
                  <FormItem label="意向参课城市" prop="intention_city">
                      <Select v-model="form.intention_city" size="small" style="width:8rem;"  >
                          <Option :value="i" v-for="i in option.cityList">{{i}}</Option>
                      </Select>
                  </FormItem>
                  <FormItem label="意向参课时间"  prop="intention_time">
                          <Date-picker  placeholder="Select date"  type="date" v-model="form.intention_time" style="width:8rem;" ></Date-picker>
                  </FormItem>
                  <FormItem label="身份证号码" prop="id_card_number">
                      <Input v-model="form.id_card_number" type="number" size="small" placeholder="请填写身份证号码" style="width:8rem;" ></Input>
                  </FormItem>
                  <FormItem label="职业" prop="job">
                      <Input v-model="form.job" size="small" placeholder="请填写职业" style="width:8rem;" ></Input>
                  </FormItem>
                </Col>
                <Col :span="5">
                  <FormItem label="配偶姓名">
                      <Input v-model="form.spouse_name" size="small" placeholder="请填写配偶姓名" style="width:8rem;" ></Input>
                  </FormItem>
                  <FormItem label="配偶电话">
                      <Input v-model="form.spouse_phone" type="number" size="small" placeholder="请填写配偶电话" style="width:8rem;" ></Input>
                  </FormItem>
                  <FormItem label="配偶性别">
                      <RadioGroup v-model="form.spouse_sex" >
                          <Radio label="1">男</Radio>
                          <Radio label="0">女</Radio>
                      </RadioGroup>
                  </FormItem>
                  <FormItem label="配偶QQ">
                      <Input v-model="form.spouse_qq" type="number" size="small" placeholder="请填写QQ号码" style="width:8rem;" ></Input>
                  </FormItem>
                  <FormItem label="配偶职业">
                      <Input v-model="form.spouse_job" size="small" placeholder="请填写配偶职业" style="width:8rem;" ></Input>
                  </FormItem>
                  <FormItem label="配偶身份证号码">
                      <Input v-model="form.spouse_id_card_number" type="number" size="small" placeholder="身份证号码" style="width:8rem;" ></Input>
                  </FormItem>
                </Col>
                <Col :span="4">
                  <FormItem label="孩子1姓名">
                      <Input v-model="form.child1_name" size="small" placeholder="孩子1姓名" style="width:7rem;" ></Input>
                  </FormItem>
                  <FormItem label="孩子1性别">
                      <RadioGroup v-model="form.child1_sex" style="width:7rem;">
                          <Radio label="1">男</Radio>
                          <Radio label="0">女</Radio>
                      </RadioGroup>
                  </FormItem>
                  <FormItem label="孩子1年龄">
                      <Input v-model="form.child1_age" type="number" size="small" placeholder="孩子1年龄" style="width:7rem;" ></Input>
                  </FormItem>
                  <FormItem label="孩子1学校">
                      <Input v-model="form.child1_school" size="small" placeholder="孩子1学校" style="width:7rem;" ></Input>
                  </FormItem>
                  <FormItem label="孩子1身份证号">
                      <Input v-model="form.child1_id_card_number" type="number" size="small" placeholder="身份证号码" style="width:7rem;" ></Input>
                  </FormItem>
                </Col>
                <Col :span="4">
                  <FormItem label="孩子2姓名">
                      <Input v-model="form.child2_name" size="small" placeholder="孩子2姓名" style="width:7rem;" ></Input>
                  </FormItem>
                  <FormItem label="孩子2性别">
                      <RadioGroup v-model="form.child2_sex" style="width:7rem;">
                          <Radio label="1" >男</Radio>
                          <Radio label="0" >女</Radio>
                      </RadioGroup>
                  </FormItem>
                  <FormItem label="孩子2年龄">
                      <Input v-model="form.child2_age" type="number" size="small" placeholder="孩子2年龄" style="width:7rem;" ></Input>
                  </FormItem>
                  <FormItem label="孩子2学校">
                      <Input v-model="form.child2_school" size="small" placeholder="孩子2学校" style="width:7rem;" ></Input>
                  </FormItem>
                  <FormItem label="孩子2身份证号">
                      <Input v-model="form.child2_id_card_number" type="number" size="small"  placeholder="身份证号码" style="width:7rem;" ></Input>
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col :span="8">
                  <FormItem label="备注">
                      <Input type="textarea" placeholder="客户描述" :autosize="{minRows: 4,maxRows: 6}" v-model="form.desc"></Input>
                  </FormItem>
                </Col>
              </Row>
                <FormItem>
                    <Button type="primary" @click="submit('form')">提交</Button>
                    <Button style="margin-left: 8px" @click="formVisible=false">取消</Button>
                </FormItem>
            </Form>
        </Modal>
        <!-- 跟单表单-->
        <DocumentaryForm :visible="docFormVisible" :customer_id="curr.id"  mode="add" @hideForm="docFormVisible=false"></DocumentaryForm>
        <!-- 收款表单-->
        <PaymentForm :visible="payFormVisible" :customer_id="curr.id" mode="add" @hideForm="payFormVisible=false"></PaymentForm>
        <!-- 转移客户表单-->
        <TransferForm :visible="transferFormVisible" :id="curr.id" mode="add"  @clickInit="initData"   @hideForm="transferFormVisible=false"></TransferForm>
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
  import { customerDetailTable, customerHeadTable,customerHeadTables, } from '@/libs/data-customer'
  import ChinaArea from '@/libs/China-area'
  import DocumentaryForm from '@/view/main/customer/formmodal/DocumentaryForm'
  import PaymentForm from '@/view/main/customer/formmodal/PaymentForm'
  import TransferForm from '@/view/main/customer/formmodal/TransferForm'
  import Cookies from 'js-cookie'

  export default {
	components: {  DocumentaryForm, PaymentForm,TransferForm },
    data () {
      return {
        col: customerHeadTable,//客户表头
        cols:customerHeadTables,//客户详细表头
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
        department:'',//部门筛选
        time:[],//搜索时间关键字
        time_start:"",//开始时间
        time_end:"",//结束时间
        admin_name:"",//搜索顾问关键字
        ChinaArea: ChinaArea,//中国行政区数据
        department_show:true,
        transferShow:true,//转移客户
        //表单选项
        option: {
          fromList: [],
          cityList: [],
          lessonList: [],
          department_list:[],
        },
        //客户表单
        form: {
          name: '',
          sex: '',
          phone: '',
          quality: '',
          qq: '',
          from: '',
          province: '',
          city: '',
          area: [],
          intention_lesson: '',
          intention_city: '',
          intention_time: '',
          id_card_number: '',
          job: '',
          spouse_name: '',
          spouse_phone: '',
          spouse_sex: '',
          spouse_qq: '',
          spouse_job: '',
          spouse_id_card_number: '',
          child1_name: '',
          child1_sex: '',
          child1_age: '',
          child1_school: '',
          child1_id_card_number: '',
          child2_name: '',
          child2_sex: '',
          child2_age: '',
          child2_school: '',
          child2_id_card_number: '',
          desc: '',
        },
      ruleInline: {
        name: [
          { required: true, message: '请填写姓名', trigger: 'blur' }
        ],
        quality:[
          { required: true, message: '客户质量', trigger: 'blur' },
        ],
        from:[
          { required: true, message: '客户来源', trigger: 'blur' },
        ],
        // phone: [
        //   { required: true, message: '请填写电话', trigger: 'blur' },
        //   { type: 'string', min: 11,max:11, message: '请填写正确的电话', trigger: 'blur' }
        // ],
        intention_lesson:[
          {required:true,message:'请填写意向课程',trigger:'blur'},
        ],
        qq:[
          { required: false, message: '请填写qq号码', trigger: 'blur' },
          { type: 'string', min: 5, message: '请填写正确的QQ', trigger: 'blur' }
        ],
        id_card_number:[
          { required: false, message: '请填写身份证号码', trigger: 'blur' },
          { type: 'string', min: 18,max:18, message: '请填写正确的身份证号码', trigger: 'blur' }
        ]
      },
        formMode: 'add',//客户表单模式  add 添加  edit 修改
        formVisible: false,//客户表单是否显示
        //是否显示跟单表单
        docFormVisible: false,
        //是否显示收款表单
        payFormVisible: false,
        //是否显示转移客户表单
        transferFormVisible:false,
        //时间戳
        timestamp: 0,
      }
    },
    mounted () {
      const role = Cookies.get('role')
      if(role=='["a1"]'){
        this.department_show = false
        this.transferShow = false
      }
      this.initData()
      this.getOption()
    },
    watch: {
      curr (_new) {
        this.currDetailTable = dataToTable(_new, customerDetailTable)
      }
    },
    methods: {
      ...mapMutations([
        'closeTag'
      ]),
      //获取选项
      getOption () {
        apiRequest(api.Common.getOption, {
          'list': 'from_list,city_list,lesson_list,department_list'
        }, ret => {
          this.option = {
            fromList: ret.from_list,
            cityList: ret.city_list,
            lessonList: ret.lesson_list,
            department_list:ret.department_list,
          }
        })
      },
      initData () {
        const keyword = this.keyword.trim()//电话
        const admin_name =this.admin_name.trim()//顾问
        const keywordd = this.department//部门筛选
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
        //关键字筛选-部门
        if(keywordd){
          params.keywordd =keywordd
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
        apiRequest(api.Customer.getList,params,ret => {
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
                  const keywordd = this.department//部门筛选
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
                  //关键字筛选-部门
                  if(keywordd){
                    params.keywordd =keywordd
                  }
                  //关键字筛选-开始时间
                  if (time_start) {
                    params.time_start = time_start
                  }
                  //关键字筛选-结束时间
                  if (time_end) {
                    params.time_end = time_end
                  }
                 apiRequest(api.Customer.getList,params,ret => {
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
          case 'edit':
            this.edit(this.curr)
            break
          case 'addDoc':
            this.docFormVisible = true
            break
          case 'addPay':
            this.payFormVisible = true
            break
          case 'addTransfer':
            this.transferFormVisible = true
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
        //this.form.phone = parseInt(this.form.phone)

			  //转化中国标准日期格式
				//意向参课时间
				var d = new Date(this.form.intention_time);
				var datetime=d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
				this.form.intention_time=datetime.toString();

        console.log(this.form)

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
