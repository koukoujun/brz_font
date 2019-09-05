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
        <Page style="margin:10px 0;" :total="data.total" :page-size="data.per_page" size="small" show-total show-elevator  @on-change="onPage"></Page>
         <!-- 详情-->
        <Drawer title="详情" placement="left" :closable="false" v-model="showDetailDrawer">
            <div v-html="currDetailTable"></div>
        </Drawer>
        <!-- 编辑表单模块 -->
        <Modal v-model="formVisible" width="73" :title="formMode==='add'?'添加父母补助信息':'编辑父母补助信息'" footer-hide @on-cancel="cancel()">
        <Form :model="form" :label-width="120"  ref="form" inline >
            <Row :gutter="15">
        <!-- 第一列 -->
        <Col :span="6">
            <FormItem label="父亲姓名" prop="father_name">
                <Input v-model="form.father_name" size="small" placeholder="请填写父亲姓名"></Input>
            </FormItem>
            <FormItem label="父亲电话" prop="father_phone">
                <Input type="number" placeholder="请填写父亲电话" v-model="form.father_phone"></Input>
            </FormItem>
            <FormItem label="母亲姓名" prop="mother_name">
                <Input v-model="form.mother_name" size="small" placeholder="请填写母亲姓名" ></Input>
            </FormItem>
            <FormItem label="母亲电话" prop="mother_phone">
                <Input type="number" placeholder="请填写母亲电话" v-model="form.mother_phone"></Input>
            </FormItem>
        </Col>
        <!-- 第二列 -->
        <Col :span="6">
        		<FormItem label="常用电话" prop="parent_normal_phone">
        			<Input v-model="form.parent_normal_phone" size="small" placeholder="请填写常用电话号码"  ></Input>
        		</FormItem>
        		<FormItem label="是否问候" prop="is_greeting">
        			<Select v-model="form.is_greeting" size="small" style="width: 200%;" >
        			    <Option value="已问候">已问候</Option>
        			    <Option value="未问候">未问候</Option>
        			</Select>
        		</FormItem>
            <FormItem label="是否到账" prop="is_allowance">
                <Select v-model="form.is_allowance" size="small" style="width: 200%;" >
            	    <Option value="已到账">已到账</Option>
            	    <Option value="未到账">未到账</Option>
            	</Select>
            </FormItem>
            <FormItem label="是否签字" prop="is_sign" >
            	<Select v-model="form.is_sign" size="small" style="width: 200%;" >
            			<Option value="已签字">已签字</Option>
            			<Option value="未签字">未签字</Option>
            	</Select>
            </FormItem>
         </Col>
         <!-- 第三列 -->
         <Col :span="6">
            <FormItem label="开户行" prop="allowance_bnak" >
                  <Input size="small" v-model="form.allowance_bank" placeholder="请填写开户行" ></Input>
            </FormItem>
            <FormItem label="开户行账号" prop="allowance_bank_accout" >
                <Input size="small" v-model="form.allowance_bank_account" placeholder="请填写开户行账号" ></Input>
            </FormItem>
            <FormItem label="开户行姓名" prop="allowance_bank_name" >
                <Input size="small" v-model="form.allowance_bank_name" placeholder="请填写开户行姓名" ></Input>
            </FormItem>
            <FormItem label="开户行地址" prop="allowance_bank_address" >
                <Input size="small" v-model="form.allowance_bank_address" placeholder="请填写开户行地址" ></Input>
            </FormItem>
        	</Col>
          <!-- 第四列 -->
          <Col :span="6">
             <FormItem label="月份" prop="month">
                 <DatePicker type="date" placeholder="Select month" v-model="form.month"></DatePicker>
             </FormItem>
          </Col>
        </Row>
        <Row>
          <Col :span="8">
              <FormItem label="备注">
                  <Input type="textarea" placeholder="信息备注" :autosize="{minRows: 4,maxRows: 6}" v-model="form.desc"></Input>
              </FormItem>
          </Col>
          </Row>
              <FormItem>
                  <Button type="primary" @click="submit('form')">提交</Button>
                  <Button style="margin-left: 8px" @click="formVisible=false">取消</Button>
              </FormItem>
          </Form>
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
  import { dataToTable, objFilter } from '@/libs/util'
  import { allowanceDetailTable, allowanceHeadTable,allowanceHeadTables } from '@/libs/data-staffmange'

  export default {
    data () {
      return {
        cols: allowanceHeadTables,//详细表头
        col: allowanceHeadTable,//表头
        pageNum: 1,//页码
        modal1:false,//导出modal
        outData:[],//导出数据
        exportA:1,//导出页码
        exportB:1,//导出页码
        pageAll:1,
        data: {},//数据
        curr: {},//当前row
        currDetailTable: '',//详情html
        showDetailDrawer: false,//是否显示简历抽屉
        time:[],//搜索时间关键字
        time_start:"",//开始时间
        time_end:"",//结束时间
        keyword: '',//搜索关键字
        formMode: 'add',//客户表单模式  add 添加  edit 修改
        formVisible: false,//客户表单是否显示
        //时间戳
        timestamp: 0,
        form: {
          is_allowance: "",
          is_greeting: "",
          is_sign: "",
          create_at: "",
          update_at: "",
          month:"",
          father_name: "",
          father_phone: "",
          mother_name: "",
          mother_phone: "",
          parent_normal_phone: "",
          allowance_bank: "",
          allowance_bank_account: "",
          allowance_bank_address: "",
          allowance_bank_name: ""
        },
      }
    },
    mounted () {
      this.initData()
    },
    watch: {
      curr (_new) {
        this.currDetailTable = dataToTable(_new, allowanceDetailTable)
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
        apiRequest(api.Allowance.getList,
          params,
          ret => {
            this.data = ret
			      console.log(ret)
            this.pageAll = ret.last_page
            let len =this.data.data.length;
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
                 apiRequest(api.Allowance.getList,params,ret => {
                   let len = ret.data.length;
                   for(let i=0;i<len;i++){
                     //电话-转化科学计数法
                     ret.data[i].parent_normal_phone = "\t"+ret.data[i].parent_normal_phone;
                     //父亲电话-转化科学计数法
                     ret.data[i].father_phone = "\t"+ret.data[i].father_phone;
                     //母亲电话-转化科学计数法
                     ret.data[i].mother_phone = "\t"+ret.data[i].mother_phone;
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
          case 'detail':
            this.showDetailDrawer = true
            break
          case 'edit':
            this.edit(this.curr)
            this.formVisible=true;
            break
          case 'addDoc':
            this.docFormVisible = true
            break
          case 'addPay':
            this.payFormVisible = true
            break
        }
      },
      //提交客户表单
      submit (name) {

        //转化中国标准日期格式
        var d = new Date(this.form.month);
        var datetime=d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
        this.form.month=datetime.toString()

        this.$refs[name].validate((valid) => {
          if (valid) {
            this.$Message.success('Success!');
            const apiName = this.formMode === 'add' ? api.Allowance.add : api.Allowance.edit
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
