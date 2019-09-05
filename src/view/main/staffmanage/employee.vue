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
        <Table :data="data.data" :columns="col" ref="table"  size="small" highlight-row @on-current-change="row=>curr=row">
            <template slot-scope="{ row, index }" slot="action">
              <Button type="default" size="small" style="margin-right: 5px"   @click="customerActionMenuHandler(name='detail')">查看</Button>
              <Button type="primary" size="small" style="margin-right: 5px"   @click="edit(row)">编辑</Button>
              <Button type="info" size="small" style="margin-right: 5px"      @click="customerActionMenuHandler(name='allowance')">补助</Button>
              <Button type="warning" size="small" style="margin-right: 5px"   @click="performance(row)">绩效</Button>
<!--                <Dropdown trigger="click" style="margin-left: 20px" @on-click="customerActionMenuHandler" placement="left" >
                    <Button size="small">
                        操作
                    <Icon type="ios-arrow-down"></Icon>
                    </Button>
                    <DropdownMenu slot="list">
                        <DropdownItem name="detail">查看详情</DropdownItem>
                        <DropdownItem name="edit">编辑修改</DropdownItem>
                        <DropdownItem name="allowance">父母补助</DropdownItem>
                        <DropdownItem name="performance">绩效考核</DropdownItem>
                    </DropdownMenu>
                </Dropdown> -->
            </template>
        </Table>
        <Page style="margin:10px 0;" :total="data.total" :page-size="data.per_page" size="small" show-total
              show-elevator
              @on-change="onPage"></Page>
         <!-- 详情-->
        <Drawer title="详情" placement="left" :closable="false" v-model="showDetailDrawer">
            <div v-html="currDetailTable"></div>
        </Drawer>
         <!-- 员工表单-->
        <Modal v-model="formVisible" width="73" :title="formMode==='add'?'添加员工信息':'编辑员工信息'" footer-hide
               @on-cancel="form={brand_right:0}">
            <Form :model="form" :label-width="120" :rules="formInline" ref="form" inline >
                <Row :gutter="15">
				    <!-- 第一列 -->
        <Col :span="5">
            <FormItem label="姓名" prop="name">
                <Input v-model="form.name" size="small" placeholder="请填写姓名" ></Input>
            </FormItem>
            <FormItem label="性别" prop="sex">
                <RadioGroup v-model="form.sex">
                    <Radio label="男">男</Radio>
                    <Radio label="女">女</Radio>
                </RadioGroup>
            </FormItem>
            <FormItem label="工作电话" prop="phone"><!-- 未trim,编辑包含空格 -->
                <Input v-model="form.phone" size="small" placeholder="请填写工作电话号码"></Input>
            </FormItem>
            <FormItem label="出生日期" prop="birthday">
                  <DatePicker type="date" placeholder="Birthday date" v-model="form.birthday" ></DatePicker>
            </FormItem>
            <FormItem label="身份证号码" prop="id_card_number"><!-- 未trim,编辑包含空格 -->
              <Input v-model="form.id_card_number" size="small" placeholder="Id number" ></Input>
            </FormItem>
          </Col>

					<!-- 第二列 -->
            <Col :span="5">
               <FormItem label="籍贯" prop="native_place" >
                  <Cascader :data="ChinaArea" size="small" v-model="form.native_place"></Cascader>
                </FormItem>
                <FormItem label="婚配" prop="marry">
						<RadioGroup v-model="form.marry">
							<Radio label="已婚">已婚</Radio>
							<Radio label="未婚">未婚</Radio>
						</RadioGroup>
                        </FormItem>
						<FormItem label="学历" prop="degree" >
							  <Select v-model="form.degree" size="small" placeholder="请选择学历" style="width:9rem" >
								<Option value="博士">博士</Option>
							  	<Option value="研究生">研究生</Option>
							  	<Option value="本科">本科</Option>
							  	<Option value="大专">大专</Option>
							  	<Option value="高中">高中</Option>
							  </Select>
						</FormItem>
						<FormItem label="毕业院校" prop="graduate_school">
							  <Input v-model="form.graduate_school" size="small" placeholder="毕业院校" ></Input>
						</FormItem>
						<FormItem label="专业" prop="profession">
							  <Input v-model="form.profession" size="small" placeholder="专业" ></Input>
						</FormItem>
                    </Col>
					<!-- 第三列 -->
					<Col :span="5">
						<FormItem label="入职时间" prop="entry_time">
							<DatePicker type="date" placeholder="Entry date" v-model="form.entry_time" ></DatePicker>
						</FormItem>
						<FormItem label="离职时间">
							<DatePicker type="date" placeholder="Leave date" v-model="form.leave_time" ></DatePicker>
						</FormItem>
						<FormItem label="在职状态" >
							  <Select v-model="form.is_employ" size="small" style="width:9rem" >
								  <Option value="在职">在职</Option>
								  <Option value="离职">离职</Option>
							  </Select>
						</FormItem>

					  <FormItem label="部门" prop="department_id">
							<Select v-model="form.department_id" size="small" style="width:9rem" >
                  <Option :value="i.id" v-for="i in option.departmentList">{{i.area}}{{i.name}}</Option>
							</Select>
						</FormItem>
						<FormItem label="职位" prop="job">
							<Input v-model="form.job" size="small" placeholder="职位" ></Input>
						</FormItem>
					</Col>
					<!-- 第四列 -->
					<Col :span="5">
						<FormItem label="QQ" prop="qq" >
							<Input v-model="form.qq" size="small" placeholder="请填写QQ号码" ></Input>
						</FormItem>
						<FormItem label="微信">
							<Input v-model="form.wechat" size="small" placeholder="请填写微信账号" ></Input>
						</FormItem>
						<FormItem label="邮箱" prop="email">
							<Input v-model="form.email" size="small" placeholder="Email address" ></Input>
						</FormItem>
						<FormItem label="私人电话" prop="private_phone" >
							<Input v-model="form.private_phone" size="small" placeholder="请填写私人手机号" ></Input>
						</FormItem>
					</Col>
                </Row>
                <FormItem>
                    <Button type="primary" @click="submit('form')">提交</Button>
					          <Button style="margin-left: 8px;" v-show="delete_button" type="error" @click="deletes">删除</Button>
                    <Button style="margin-left: 8px" @click="formVisible=false,delete_button=false">取消</Button>
                </FormItem>
            </Form>
        </Modal>
        <!-- 父母收款表单-->
        <AllowanceForm :visible="allowanceVisible" :employ_id="curr.id"  mode="add" :customer_name="curr.name"  @hideForm="allowanceVisible=false" >
        </AllowanceForm>
        <!-- 亲子部表单-->
        <Childrenform :visible="one_form_visible" :mode="formMode" @hideForm="one_form_visible=false" :employ_id="curr.id" :customer_name="curr.name" :department_id="curr.department_id" >
        </Childrenform>
        <!-- .... -->
        <!-- 高端服务中心表单-->
        <Highform :visible="two_form_visible" :mode="formMode" @hideForm="two_form_visible=false":employ_id="curr.id" :customer_name="curr.name" :department_id="curr.department_id" ></Highform>
        <!-- .... -->
        <!-- 线下推广表单-->
        <Offlineform :visible="three_form_visible" :mode="formMode" @hideForm="three_form_visible=false" :employ_id="curr.id" :customer_name="curr.name" :department_id="curr.department_id" ></Offlineform>
        <!-- .... -->
        <!-- 导出数据表单 -->
        <template>
            <Modal style="text-align: center;" v-model="modal1" title="请选择导出页数" @on-ok="exportData(4)"  >
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
  import { staffDetailTable, staffHeadTable,staffHeadTables } from '@/libs/data-staffmange'
  import ChinaArea from '@/libs/China-area'
  import AllowanceForm from '@/view/main/staffmanage/formmodal/allowance_form'
  import Childrenform  from '@/view/main/staffmanage/formmodal/children_form'//亲子部表单
  import Highform from '@/view/main/staffmanage/formmodal/high_form'//高端服务中心
  import Offlineform from '@/view/main/staffmanage/formmodal/offline_form'//线下推广部门

  export default {
    components:{AllowanceForm,Childrenform,Highform,Offlineform},
    data () {
      return {
        cols:staffHeadTables,//员工表头详情
        col: staffHeadTable,//员工表头
        pageNum: 1,//员工页码
        modal1:false,//导出modal
        outData:[],//导出数据
        exportA:1,//导出页码
        exportB:1,//导出页码
        pageAll:1,
        data: {},//员工数据
        curr: {},//员工当前row
        currDetailTable: '',//员工详情html
        showDetailDrawer: false,//是否显示员工详情抽屉
        keyword: '',//搜索关键字
        time:[],//搜索时间关键字
        time_start:"",//开始时间
        time_end:"",//结束时间
        ChinaArea: ChinaArea,//中国行政区数据
        one_form_visible:false, //表单1是否显示
        two_form_visible:false, //表单2是否显示
        three_form_visible:false, //表单3是否显示
		    //department_list:department_list,//
        //表单选项
        option: {
          fromList: [],
          cityList: [],
          lessonList: [],
		      departmentList:[],
        },
        //客户表单
        form: {
          name: "",                        //姓名[必选]
          phone: "",                       //工作电话[必选]
          private_phone: "",               //私人电话[必选]
          id_card_number: "",              //身份证[必选]
          qq: "",                          //QQ
          wechat: "",                      //微信
          email: "",                       //电子邮件
          birthday: "",                    //出生日期
          sex:0,                          //性别0男1女
          department_id:"",                //部门id
          job: "",                         //职位
          province: "",                    //省
          city: "",                        //市
          native_place:[],                //籍贯
          marry: "",                       //婚配情况
          degree: "",                      //学历
          graduate_school: "",             //毕业院校
          profession: "",                  //专业
          graduate_time: "",               //毕业时间
          entry_time: "",                  //入职时间
          is_employ: "",                    //是否在职1在职 0 离职
          leave_time: "",                  //离职时间
          father_name: "",                 //父亲姓名
          father_phone: "",                //父亲电话
          mother_name: "",                 //母亲姓名
          mother_phone: "",                //母亲电话
          parent_normal_phone: "",          //父母常用电话
          allowance_bank: "",              //父母补助银行
          allowance_bank_account: "",      //父母补助银行账号
          allowance_bank_address: "",      //父母补助银行开户行
          allowance_bank_name: "",         //父母补助银行姓名
        },
		//验证规则
		formInline: {
				name: [
					{ required: true, message: '请填写姓名', trigger: 'blur' }
				],
				phone:[
					{required:true,message:'请填写电话号码',trigger:'blur'},
					{ type: 'string', min:11 ,max:11, message: '请填写正确的电话号码', trigger: 'blur' }
				],
			    private_phone:[
					{required:true,message:'请填写电话号码',trigger:'blur'},
					{ type: 'string', min:11 ,max:11, message: '请填写正确的电话号码', trigger: 'blur' }
				],
				id_card_number: [
					{ required: true, message: '请填写身份证号码', trigger: 'blur' },
					{ type: 'string', min: 18,max:18, message: '请填写正确的身份证号码', trigger: 'blur' }
				],
        department_id: [
        	{ required: true, message: '请选择部门', trigger: 'blur',type:'number' },
        ]
		},
        formMode: 'add',//客户表单模式  add 添加  edit 修改
        formVisible: false,//客户表单是否显示
		    delete_button:false,
        allowanceVisible:false,
        timestamp: 0,//时间戳
      }
    },
    mounted () {
      this.initData()
      this.getOption()
    },
    watch: {
      curr (_new) {
        this.currDetailTable = dataToTable(_new, staffDetailTable)
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
			      departmentList:ret.department_list,
          }
        })
      },
	  //加载数据
      initData () {
        //搜索关键字
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

        apiRequest(api.Employee.getList,
          params,
          ret => {
            this.data = ret
            this.pageAll = ret.last_page
            //判断男女
            let len = this.data.data.length;
            for(let i=0;i<len;i++){
            //地址转化数组
            this.data.data[i].native_place=[
              this.data.data[i].province,
              this.data.data[i].city
            ]
            //城市转化籍贯
            this.data.data[i].city=this.data.data[i].province+this.data.data[i].city
            //判断性别
            this.data.data[i].sex=this.data.data[i].sex+''
            if(this.data.data[i].sex=="1"){
              this.data.data[i].sex="女"
            }
            if(this.data.data[i].sex=="0"){
              this.data.data[i].sex="男"
            }
          }
          //判断在职
          for(let i=0;i<len;i++){
            if(this.data.data[i].is_employ=="1"){
              this.data.data[i].is_employ="在职"
            }
            if(this.data.data[i].is_employ=="0"){
              this.data.data[i].is_employ="离职"
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
      //绩效表单
      //one亲子，two高端，three线下推广
      performance(row){
        switch(row.department_id){
          case 5:
          this.one_form_visible=true;
          break;
          case 6:
          this.one_form_visible=true;
          break;
          case 7:
          this.one_form_visible=true;
          break;
          case 8:
          this.one_form_visible=true;
          break;
          case 9:
          this.one_form_visible=true;
          break;
          case 4:
          this.one_form_visible=true;
          break;
          case 3:
          this.two_form_visible=true;
          break;
          case 2:
          this.$Message.info('网络部暂无需添加绩效考核');
          break;
          case 1:
          this.$Message.info('公海暂无需添加绩效考核');
          break;
        }
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
                 //搜索关键字
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
                 apiRequest(api.Employee.getList,params,ret => {
                   let len = ret.data.length;
                   for(let i=0;i<len;i++){

                     //电话-转化科学计数法
                     ret.data[i].phone = "\t"+ret.data[i].phone;
                     //配偶电话-转化科学计数法
                     ret.data[i].private_phone = "\t"+ret.data[i].private_phone;
                     //身份证号码-转化科学计数法
                     ret.data[i].id_card_number = "\t"+ret.data[i].id_card_number;
                     //部门id转部门
                     if(ret.data[i].department_id=="2"){ret.data[i].department="亲子部"}
                     if(ret.data[i].department_id=="3"){ret.data[i].department="网络部"}
                     if(ret.data[i].department_id=="4"){ret.data[i].department="高端服务中心"}
                     //在职
                     if(ret.data[i].is_employ=="1"){ret.data[i].is_employ="在职"}
                     if(ret.data[i].is_employ=="0"){ret.data[i].is_employ="离职"}
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
            console.log(this.curr)
            this.edit(this.curr)
			      this.delete_button=true
            break
          case 'allowance':
            this.allowanceVisible = true
            break
          case 'performance':
            this.performance(this.curr)
             break
        }

      },
      //提交客户表单
      submit (name) {
		    this.$refs[name].validate((valid) => {
          if (valid) {
            this.form.province = this.form.native_place[0]
            this.form.city = this.form.native_place[1]
          //转化中国标准日期格式
          //出生日期
          if(this.form.birthday!=""){
            var d = new Date(this.form.birthday);
            var datetime=d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
            this.form.birthday=datetime.toString()
          }
					//入职时间
          if(this.form.entry_time!=""){
            var d01 = new Date(this.form.entry_time);
            var datetime01=d01.getFullYear() + '-' + (d01.getMonth() + 1) + '-' + d01.getDate();
            this.form.entry_time=datetime01.toString()
          }
					//离职时间
          if(this.form.leave_time!=""){
            var d02 = new Date(this.form.leave_time);
            var datetime02=d01.getFullYear() + '-' + (d02.getMonth() + 1) + '-' + d02.getDate();
            this.form.leave_time=datetime02.toString()
          }
					//转化性别为init型数据
					if(this.form.sex=="男"){
						this.form.sex=0
					}
					else if(this.form.sex=="女"){
						this.form.sex=1
					}
					//转化地区array为字符串格式
					this.form.native_place=this.form.native_place.toString()

					//转化部门提交id
					this.form.department_id=parseInt(this.form.department_id)

					const apiName = this.formMode === 'add' ? api.Employee.add : api.Employee.edit
					apiRequest(apiName, objFilter(this.form), ret => {
						//清空form表单
						this.form = { brand_right: 0 }
						this.formVisible = false
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
	  //删除员工
	  deletes(){
			const apiName = this.formMode = api.Employee.del
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
